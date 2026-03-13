import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function generateTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(5);
  return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

export async function POST(req, { params }) {
  const { eventId } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { firstName, lastName, email, company, phone } = body;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Imię, nazwisko i email są wymagane' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Nieprawidłowy format email' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) {
    return NextResponse.json({ error: 'Wydarzenie nie istnieje' }, { status: 404 });
  }

  if (!event.registrationOpen) {
    return NextResponse.json({ error: 'Rejestracja jest zamknięta' }, { status: 410 });
  }

  if (new Date(event.date) < new Date()) {
    return NextResponse.json({ error: 'Wydarzenie już się odbyło' }, { status: 410 });
  }

  if (event.maxSeats && event._count.registrations >= event.maxSeats) {
    return NextResponse.json({ error: 'Brak wolnych miejsc' }, { status: 410 });
  }

  let registration;
  for (let attempt = 0; attempt < 3; attempt++) {
    const ticketCode = generateTicketCode();
    try {
      registration = await prisma.$transaction(async (tx) => {
        if (event.maxSeats) {
          const count = await tx.registration.count({ where: { eventId } });
          if (count >= event.maxSeats) {
            throw new Error('FULL');
          }
        }
        return tx.registration.create({
          data: {
            eventId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            company: company?.trim() || null,
            phone: phone?.trim() || null,
            ticketCode,
          },
        });
      });
      break;
    } catch (e) {
      if (e.message === 'FULL') {
        return NextResponse.json({ error: 'Brak wolnych miejsc' }, { status: 410 });
      }
      if (e.code === 'P2002') {
        const target = JSON.stringify(e.meta || {});
        if (target.includes('ticketCode')) {
          continue;
        }
        return NextResponse.json({ error: 'Ten email jest już zarejestrowany na to wydarzenie' }, { status: 409 });
      }
      throw e;
    }
  }

  if (!registration) {
    return NextResponse.json({ error: 'Nie udało się wygenerować kodu biletu' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ticketCode: registration.ticketCode }, { status: 201 });
}
