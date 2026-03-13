import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug }, select: { title: true } });
  if (!event) return {};
  return { title: `Rejestracja — ${event.title} | AI NETWORK` };
}

export default async function RegistrationPage({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) notFound();

  const isPast = new Date(event.date) < new Date();
  const isFull = event.maxSeats ? event._count.registrations >= event.maxSeats : false;
  const canRegister = event.registrationOpen && !isPast && !isFull;

  const data = {
    id: event.id,
    slug: event.slug,
    title: event.title,
    brand: event.brand,
    date: event.date.toISOString(),
    time: event.time,
    location: event.location,
    venue: event.venue,
    accent: event.accent,
    maxSeats: event.maxSeats,
    registered: event._count.registrations,
    canRegister,
    reason: isPast ? 'past' : !event.registrationOpen ? 'closed' : isFull ? 'full' : null,
  };

  return <RegistrationForm event={data} />;
}
