import { NextResponse } from 'next/server';
import { generateThumbnail } from '@/lib/agents/thumbnail-agent';

export async function POST(req) {
  const { slug, type = 'articles', title: providedTitle, excerpt: providedExcerpt, category: providedCategory } = await req.json();
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const { prisma } = await import('@/lib/prisma');

  let title = providedTitle || slug;
  let excerpt = providedExcerpt || '';
  let category = providedCategory || '';
  let isPillar = false;

  // Enrich from DB if not fully provided
  if (!providedTitle || !providedExcerpt) {
    let record = null;
    if (type === 'articles') {
      record = await prisma.article.findUnique({ where: { slug } }).catch(() => null);
      if (record) {
        title = title || record.title;
        excerpt = excerpt || record.excerpt || record.description || '';
        category = category || record.category || '';
        isPillar = record.isPillar || false;
      }
    } else if (type === 'events') {
      record = await prisma.event.findUnique({ where: { slug } }).catch(() => null);
      if (record) {
        title = title || record.title;
        excerpt = excerpt || record.description || '';
      }
    } else if (type === 'news') {
      record = await prisma.news.findUnique({ where: { slug } }).catch(() => null);
      if (record) {
        title = title || record.title;
        excerpt = excerpt || record.excerpt || '';
        category = category || record.category || '';
      }
    }
  }

  try {
    const url = await generateThumbnail({ title, slug, type, excerpt, category, isPillar });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: 'generation_failed', message: err.message }, { status: 500 });
  }
}
