import { prisma } from '@/lib/prisma';
import KnowledgeClient from './KnowledgeClient';

export const revalidate = 60;

export const metadata = {
  title: 'Baza wiedzy — AI NETWORK',
  description: 'Praktyczne przewodniki, case studies i gotowe szablony. Wszystko, czego potrzebujesz, żeby skutecznie wdrażać sztuczną inteligencję w swojej firmie.',
};

export default async function BazaWiedzyPage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      include: {
        category: true,
        pillar: { select: { id: true, title: true, slug: true } },
        clusters: { select: { id: true }, where: { published: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      where: { type: 'article' },
      orderBy: { label: 'asc' },
    }),
  ]);

  const pillars = articles
    .filter(a => a.type === 'pillar')
    .map((a, i) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      readingTime: a.readingTime,
      imageUrl: a.imageUrl,
      categoryKey: a.category?.key || '',
      categoryLabel: a.category?.label || '',
      clusterCount: a.clusters?.length || 0,
      number: String(i + 1).padStart(2, '0'),
    }));

  const clusterArticles = articles
    .filter(a => a.type === 'cluster')
    .map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      readingTime: a.readingTime,
      imageUrl: a.imageUrl,
      date: a.date.toISOString(),
      categoryKey: a.category?.key || '',
      categoryLabel: a.category?.label || '',
    }));

  return (
    <KnowledgeClient
      pillars={pillars}
      articles={clusterArticles}
      categories={categories}
    />
  );
}
