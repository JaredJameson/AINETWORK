import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true, clusters: true },
  });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();
  const article = await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      readingTime: data.readingTime,
      date: data.date ? new Date(data.date) : undefined,
      imageUrl: data.imageUrl,
      published: data.published,
      categoryId: data.categoryId,
      pillarId: data.pillarId || null,
    },
  });
  revalidatePath('/baza-wiedzy');
  revalidatePath('/artykul/' + article.slug);
  return NextResponse.json(article);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  revalidatePath('/baza-wiedzy');
  return NextResponse.json({ ok: true });
}
