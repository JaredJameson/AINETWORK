import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req, { params }) {
  const { id } = await params;
  await prisma.newsDraft.update({
    where: { id },
    data: { status: 'rejected' },
  });
  return NextResponse.json({ ok: true });
}
