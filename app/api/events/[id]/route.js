import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();
  const event = await prisma.event.update({
    where: { id },
    data: {
      brand: data.brand,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date ? new Date(data.date) : undefined,
      time: data.time,
      location: data.location,
      venue: data.venue,
      format: data.format,
      maxSeats: data.maxSeats !== undefined ? (data.maxSeats ? parseInt(data.maxSeats) : null) : undefined,
      free: data.free,
      registrationOpen: data.registrationOpen,
      accent: data.accent,
      imageUrl: data.imageUrl,
      status: data.status,
      href: data.href,
    },
  });
  revalidatePath('/wydarzenia');
  return NextResponse.json(event);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  revalidatePath('/wydarzenia');
  return NextResponse.json({ ok: true });
}
