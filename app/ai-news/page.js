import { prisma } from '@/lib/prisma';
import AiNewsClient from './AiNewsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AI News — Nowości ze świata AI | AI NETWORK',
  description: 'Cotygodniowy przegląd najważniejszych wydarzeń ze świata sztucznej inteligencji.',
};

export default async function AiNewsPage() {
  const [categories, articles] = await Promise.all([
    prisma.category.findMany({ where: { type: 'news' }, orderBy: { label: 'asc' } }),
    prisma.news.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
  ]);

  // Transform to match AiNewsClient expected format
  const pillars = categories.map(c => ({
    id: c.key,
    slug: c.key,
    title: c.label,
    desc: '',
    color: c.color,
    icon: '',
  }));

  const arts = articles.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category?.key,
    category_label: a.category?.label,
    excerpt: a.excerpt,
    date: a.date?.toISOString().split('T')[0],
    reading_time: a.readingTime,
    source: a.source,
    tags: a.tags,
    imageUrl: a.imageUrl,
  }));

  const data = { pillars, articles: arts };
  return <AiNewsClient data={data} />;
}
