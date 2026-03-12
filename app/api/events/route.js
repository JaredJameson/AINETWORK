import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const events = await prisma.event.findMany({
    where: status ? { status } : {},
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(events);
}

export async function POST(req) {
  const data = await req.json();
  const event = await prisma.event.create({
    data: {
      slug: data.slug,
      brand: data.brand,
      title: data.title,
      excerpt: data.excerpt,
      date: new Date(data.date),
      time: data.time,
      location: data.location,
      venue: data.venue,
      format: data.format,
      seats: data.seats,
      free: data.free ?? true,
      accent: data.accent || '#F5C518',
      imageUrl: data.imageUrl,
      status: data.status || 'upcoming',
      href: data.href || null,
    },
  });
  revalidatePath('/wydarzenia');
  return NextResponse.json(event, { status: 201 });
}
