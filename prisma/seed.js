import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const articleCategories = [
    { key: 'content-marketing', label: 'Content Marketing', color: '#5B8DEF', type: 'article' },
    { key: 'strategia-ai', label: 'Strategia AI', color: '#F5C518', type: 'article' },
    { key: 'narzedzia-modele', label: 'Narzędzia i Modele', color: '#2ECC71', type: 'article' },
  ];
  const newsCategories = [
    { key: 'modele-lmy', label: 'Modele i LLM-y', color: '#5B8DEF', type: 'news' },
    { key: 'narzedzia-workflow', label: 'Narzędzia i workflow', color: '#F5C518', type: 'news' },
    { key: 'biznes-regulacje', label: 'Biznes i regulacje', color: '#2ECC71', type: 'news' },
  ];
  for (const cat of [...articleCategories, ...newsCategories]) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: {},
      create: cat,
    });
  }
  console.log('Seeded categories');
}

main().catch(console.error).finally(() => prisma.$disconnect());
