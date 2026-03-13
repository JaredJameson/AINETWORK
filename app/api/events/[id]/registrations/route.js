import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const { id } = await params;
  const registrations = await prisma.registration.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(registrations);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const regId = searchParams.get('regId');

  if (!regId) {
    return NextResponse.json({ error: 'regId required' }, { status: 400 });
  }

  await prisma.registration.delete({ where: { id: regId } });
  revalidatePath(`/admin/events/${id}/registrations`);
  return NextResponse.json({ ok: true });
}
