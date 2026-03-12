import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const categories = await prisma.category.findMany({
    where: type ? { type } : {},
    orderBy: { label: 'asc' },
  });
  return NextResponse.json(categories);
}

export async function POST(req) {
  const data = await req.json();
  const category = await prisma.category.create({
    data: { key: data.key, label: data.label, color: data.color, type: data.type },
  });
  return NextResponse.json(category, { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
