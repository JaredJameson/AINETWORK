import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const { id } = await params;
  const news = await prisma.news.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(news);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();
  const news = await prisma.news.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      source: data.source,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      published: data.published,
      date: data.date ? new Date(data.date) : undefined,
      readingTime: data.readingTime,
      categoryId: data.categoryId,
    },
  });
  revalidatePath('/ai-news');
  return NextResponse.json(news);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await prisma.news.delete({ where: { id } });
  revalidatePath('/ai-news');
  return NextResponse.json({ ok: true });
}
