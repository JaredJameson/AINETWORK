import { prisma } from '@/lib/prisma';
import WydarzeniaClient from './WydarzeniaClient';

export const dynamic = 'force-dynamic';

export default async function WydarzeniaPage() {
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { status: 'upcoming' },
      orderBy: { date: 'asc' },
      include: { _count: { select: { registrations: true } } },
    }),
    prisma.event.findMany({ where: { status: 'past' }, orderBy: { date: 'desc' } }),
  ]);
  return <WydarzeniaClient upcomingEvents={upcoming} pastEvents={past} />;
}
