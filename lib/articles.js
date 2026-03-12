import { prisma } from './prisma.js';

export async function getAllArticles() {
  const articles = await prisma.article.findMany({
    where: { published: true, type: 'cluster' },
    include: {
      category: true,
      pillar: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { date: 'desc' },
  });
  return articles.map(normalizeArticle);
}

export async function getPillars() {
  const pillars = await prisma.article.findMany({
    where: { published: true, type: 'pillar' },
    include: { category: true },
    orderBy: { date: 'desc' },
  });
  return pillars.map(normalizePillar);
}

export async function getArticleBySlug(slug) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      pillar: { select: { id: true, title: true, slug: true } },
      clusters: { where: { published: true }, select: { id: true, title: true, slug: true } },
    },
  });
  if (!article) return null;
  if (article.type === 'pillar') return { ...normalizePillar(article), isPillar: true };
  return { ...normalizeArticle(article), isPillar: false };
}

function normalizeArticle(a) {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category?.key,
    category_label: a.category?.label,
    reading_time: a.readingTime,
    date: a.date?.toISOString(),
    image: a.imageUrl,
    pillar: a.pillar,
    pillar_id: a.pillarId,
  };
}

function normalizePillar(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.excerpt,
    category: p.category?.key,
    category_label: p.category?.label,
    reading_time: p.readingTime,
    date: p.date?.toISOString(),
    image: p.imageUrl,
  };
}
