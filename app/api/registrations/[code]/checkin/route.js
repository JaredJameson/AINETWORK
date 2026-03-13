import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req, { params }) {
  const { code } = await params;

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Bilet nie znaleziony' }, { status: 404 });
  }

  if (registration.checkedIn) {
    return NextResponse.json({
      error: 'Już zarejestrowany',
      checkedInAt: registration.checkedInAt,
    }, { status: 409 });
  }

  const updated = await prisma.registration.update({
    where: { ticketCode: code },
    data: { checkedIn: true, checkedInAt: new Date() },
    include: { event: { select: { title: true, brand: true } } },
  });

  return NextResponse.json({ ok: true, registration: updated });
}
