import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  const news = await prisma.news.findMany({
    include: { category: true },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(news);
}

export async function POST(req) {
  const data = await req.json();
  const news = await prisma.news.create({
    data: {
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      source: data.source,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      published: data.published ?? false,
      date: data.date ? new Date(data.date) : new Date(),
      readingTime: data.readingTime,
      categoryId: data.categoryId,
    },
  });
  revalidatePath('/ai-news');
  return NextResponse.json(news, { status: 201 });
}
