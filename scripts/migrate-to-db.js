import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Load articles.json
  const articlesJson = JSON.parse(
    readFileSync(path.join(__dirname, '../public/articles.json'), 'utf-8')
  );

  // 2. Get category IDs
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.key, c.id]));
  console.log('Categories available:', Object.keys(catMap));

  // 3. Migrate pillars first
  for (const p of (articlesJson.pillars || [])) {
    let content = '';
    if (p.article_file) {
      try {
        content = readFileSync(
          path.join(__dirname, '../public', p.article_file), 'utf-8'
        ).replace(/^---[\s\S]*?---\n?/, '');
      } catch (e) {
        console.log('Could not read file for pillar:', p.slug, e.message);
      }
    }

    await prisma.article.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        type: 'pillar',
        title: p.title,
        content,
        excerpt: p.description || '',
        readingTime: p.reading_time || '15 min',
        date: p.date ? new Date(p.date) : new Date(),
        imageUrl: p.image ? (p.image.startsWith('/') ? p.image : '/' + p.image) : null,
        published: true,
        categoryId: catMap[p.category] || cats[0].id,
      },
    });
    console.log('Migrated pillar:', p.slug);
  }

  // 4. Build pillar slug→id map
  const pillarRecords = await prisma.article.findMany({ where: { type: 'pillar' } });
  const pillarIdMap = Object.fromEntries(pillarRecords.map(p => [p.slug, p.id]));

  // 5. Migrate cluster articles
  for (const a of (articlesJson.articles || [])) {
    const pillarObj = (articlesJson.pillars || []).find(p => p.id === a.pillar_id);
    const pillarSlug = pillarObj?.slug;

    let content = '';
    if (a.article_file) {
      try {
        content = readFileSync(
          path.join(__dirname, '../public', a.article_file), 'utf-8'
        ).replace(/^---[\s\S]*?---\n?/, '');
      } catch (e) {
        console.log('Could not read file for article:', a.slug, e.message);
      }
    }

    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        type: 'cluster',
        title: a.title,
        content,
        excerpt: a.excerpt || '',
        readingTime: a.reading_time || '10 min',
        date: a.date ? new Date(a.date) : new Date(),
        imageUrl: a.image ? (a.image.startsWith('/') ? a.image : '/' + a.image) : null,
        published: true,
        categoryId: catMap[a.category] || cats[0].id,
        pillarId: pillarSlug ? pillarIdMap[pillarSlug] : null,
      },
    });
    console.log('Migrated article:', a.slug);
  }

  // 6. Migrate hardcoded events
  const events = [
    {
      slug: 'ai-network-vol4',
      brand: 'AI NETWORK vol.4',
      title: 'Praktyczne wdrożenia AI w biznesie',
      excerpt: 'Czwarta edycja spotkań AI NETWORK dla przedsiębiorców i menedżerów.',
      date: new Date('2026-04-10'),
      time: '17:00–20:00',
      location: 'Bydgoszcz',
      venue: 'WSB Merito',
      format: 'Konferencja',
      seats: '100 miejsc',
      free: true,
      accent: '#F5C518',
      status: 'upcoming',
    },
    {
      slug: 'ai-network-edu',
      brand: 'AI NETWORK EDU',
      title: 'AI w Edukacji — Praktyczny Warsztat dla Nauczycieli',
      excerpt: 'Warsztaty dla nauczycieli i edukatorów.',
      date: new Date('2026-04-30'),
      time: '17:00–20:00',
      location: 'Bydgoszcz',
      venue: 'WSB Merito',
      format: 'Warsztat',
      seats: 'Darmowe',
      free: true,
      accent: '#2ECC71',
      status: 'upcoming',
      href: 'https://edu.ainetwork.pl',
    },
    {
      slug: 'ai-network-plastics',
      brand: 'AI NETWORK PLASTICS',
      title: 'AI w przetwórstwie tworzyw sztucznych',
      excerpt: 'Praktyczne case studies z branży plastics.',
      date: new Date('2026-05-21'),
      time: '10:00–12:00',
      location: 'Kielce',
      venue: 'Targi PLASTPOL',
      format: 'Konferencja',
      seats: '80 miejsc',
      free: true,
      accent: '#5B8DEF',
      status: 'upcoming',
      href: 'https://plastics.ainetwork.pl',
    },
    {
      slug: 'ai-network-vol3',
      brand: 'AI NETWORK vol.3',
      title: 'Narzędzia i Modele AI — co wybrać dla swojej firmy?',
      excerpt: 'Trzecia edycja spotkań AI NETWORK.',
      date: new Date('2024-09-25'),
      time: '17:00–20:00',
      location: 'Bydgoszcz',
      venue: 'WSB Merito',
      format: 'Konferencja',
      seats: '80 miejsc',
      free: true,
      accent: '#2ECC71',
      status: 'past',
    },
    {
      slug: 'ai-network-vol1',
      brand: 'AI NETWORK vol.1',
      title: 'Prompting, Bezpieczeństwo i Prawo AI',
      excerpt: 'Pierwsza edycja spotkań AI NETWORK.',
      date: new Date('2024-02-26'),
      time: '17:00–20:00',
      location: 'Bydgoszcz',
      venue: 'WSB Merito',
      format: 'Konferencja',
      seats: '60 miejsc',
      free: true,
      accent: '#5B8DEF',
      status: 'past',
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({ where: { slug: ev.slug }, update: {}, create: ev });
    console.log('Migrated event:', ev.slug);
  }

  console.log('Migration complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
