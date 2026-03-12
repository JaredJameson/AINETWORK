import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NewsArticleClient from './NewsArticleClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await prisma.news.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!article) return {};
  return {
    title: `${article.title} — AI News | AI NETWORK`,
    description: article.excerpt || '',
  };
}

export default async function NewsArticlePage({ params }) {
  const { slug } = await params;

  const article = await prisma.news.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article || !article.published) {
    notFound();
  }

  // Get other recent news for sidebar
  const related = await prisma.news.findMany({
    where: { published: true, slug: { not: slug } },
    orderBy: { date: 'desc' },
    take: 5,
    include: { category: true },
  });

  const data = {
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    date: article.date?.toISOString().split('T')[0],
    readingTime: article.readingTime,
    source: article.source,
    tags: article.tags,
    imageUrl: article.imageUrl,
    category: article.category ? { key: article.category.key, label: article.category.label, color: article.category.color } : null,
  };

  const relatedArticles = related.map(r => ({
    slug: r.slug,
    title: r.title,
    date: r.date?.toISOString().split('T')[0],
    category: r.category ? { key: r.category.key, label: r.category.label } : null,
  }));

  return <NewsArticleClient article={data} related={relatedArticles} />;
}
