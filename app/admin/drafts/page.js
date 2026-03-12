import { prisma } from '@/lib/prisma';
import DraftsClient from './DraftsClient';

export const dynamic = 'force-dynamic';

export default async function DraftsPage() {
  const drafts = await prisma.newsDraft.findMany({
    where: { status: 'pending' },
    include: { source: true },
    orderBy: { scannedAt: 'desc' },
  });
  return <DraftsClient initialDrafts={drafts} />;
}
