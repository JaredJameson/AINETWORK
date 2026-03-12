import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleClient from './ArticleClient';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    select: { title: true, excerpt: true },
  });
  if (!article) return {};
  return {
    title: `${article.title} — AI NETWORK`,
    description: article.excerpt || '',
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      pillar: { select: { id: true, title: true, slug: true } },
      clusters: {
        where: { published: true },
        include: { category: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!article) notFound();

  // For cluster articles, get sibling clusters from the same pillar
  let siblingClusters = [];
  if (article.type === 'cluster' && article.pillarId) {
    siblingClusters = await prisma.article.findMany({
      where: {
        pillarId: article.pillarId,
        published: true,
        type: 'cluster',
        id: { not: article.id },
      },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Serialize for client component
  const serialized = {
    id: article.id,
    slug: article.slug,
    type: article.type,
    title: article.title,
    excerpt: article.excerpt,
    readingTime: article.readingTime,
    content: article.content || '',
    imageUrl: article.imageUrl,
    date: article.date?.toISOString() || null,
    categoryKey: article.category?.key || '',
    categoryLabel: article.category?.label || '',
    categoryColor: article.category?.color || '#F5C518',
    pillar: article.pillar
      ? { title: article.pillar.title, slug: article.pillar.slug }
      : null,
    clusters: (article.clusters || []).map(c => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      excerpt: c.excerpt,
      readingTime: c.readingTime,
      imageUrl: c.imageUrl,
      date: c.date?.toISOString() || null,
      categoryLabel: c.category?.label || '',
    })),
  };

  // Related articles: for pillar -> its clusters, for cluster -> siblings
  const related = article.type === 'pillar'
    ? serialized.clusters
    : siblingClusters.map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        excerpt: c.excerpt,
        readingTime: c.readingTime,
        imageUrl: c.imageUrl,
        date: c.date?.toISOString() || null,
        categoryLabel: c.category?.label || '',
      }));

  return (
    <ArticleClient
      article={serialized}
      related={related}
    />
  );
}
