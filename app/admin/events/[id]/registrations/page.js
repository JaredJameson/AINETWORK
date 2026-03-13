import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import RegistrationsClient from './RegistrationsClient';

export const dynamic = 'force-dynamic';

export default async function RegistrationsPage({ params }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: { orderBy: { createdAt: 'desc' } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) notFound();

  return (
    <RegistrationsClient
      event={{
        id: event.id,
        title: event.title,
        brand: event.brand,
        maxSeats: event.maxSeats,
        registrationOpen: event.registrationOpen,
        accent: event.accent,
      }}
      registrations={event.registrations.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        checkedInAt: r.checkedInAt?.toISOString() || null,
      }))}
      totalRegistered={event._count.registrations}
    />
  );
}
