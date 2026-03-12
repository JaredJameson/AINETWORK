import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const articles = await prisma.article.findMany({
    where: type ? { type } : {},
    include: { category: true, pillar: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(req) {
  const data = await req.json();
  const article = await prisma.article.create({
    data: {
      slug: data.slug,
      type: data.type,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      readingTime: data.readingTime,
      date: new Date(data.date),
      imageUrl: data.imageUrl,
      published: data.published ?? false,
      categoryId: data.categoryId,
      pillarId: data.pillarId || null,
    },
  });
  revalidatePath('/baza-wiedzy');
  revalidatePath('/artykul/' + article.slug);
  return NextResponse.json(article, { status: 201 });
}
