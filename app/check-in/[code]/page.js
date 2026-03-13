import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckInClient from './CheckInClient';

export const dynamic = 'force-dynamic';

export default async function CheckInPage({ params }) {
  const { code } = await params;

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
    include: { event: { select: { id: true, title: true, brand: true, accent: true, date: true } } },
  });

  if (!registration) notFound();

  return (
    <CheckInClient
      registration={{
        ticketCode: registration.ticketCode,
        firstName: registration.firstName,
        lastName: registration.lastName,
        company: registration.company,
        email: registration.email,
        checkedIn: registration.checkedIn,
        checkedInAt: registration.checkedInAt?.toISOString() || null,
      }}
      event={{
        title: registration.event.title,
        brand: registration.event.brand,
        accent: registration.event.accent,
      }}
    />
  );
}
