import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const drafts = await prisma.newsDraft.findMany({
    where: { status: 'pending' },
    include: { source: true },
    orderBy: { scannedAt: 'desc' },
  });
  return NextResponse.json(drafts);
}
