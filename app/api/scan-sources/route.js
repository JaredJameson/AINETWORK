import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sources = await prisma.scanSource.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(sources);
}

export async function POST(req) {
  const data = await req.json();
  const source = await prisma.scanSource.create({
    data: { url: data.url, name: data.name, enabled: true },
  });
  return NextResponse.json(source, { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.scanSource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
