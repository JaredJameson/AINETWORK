import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>Eventy</h1>
        <Link href="/admin/events/new" style={{
          padding: '10px 20px', background: '#F5C518', color: '#111',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + Nowy event
        </Link>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {events.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Brak eventów</div>
        )}
        {events.map((ev, i) => (
          <Link key={ev.id} href={`/admin/events/${ev.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', textDecoration: 'none',
            borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: ev.accent || '#F5C518', flexShrink: 0,
            }} />
            <span style={{ flex: 1, color: '#DDD', fontSize: '13px' }}>{ev.title}</span>
            <span style={{ color: '#888', fontSize: '12px', whiteSpace: 'nowrap' }}>
              {new Date(ev.date).toLocaleDateString('pl-PL')}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: ev.status === 'upcoming' ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.05)',
              color: ev.status === 'upcoming' ? '#F5C518' : '#888',
              whiteSpace: 'nowrap',
            }}>
              {ev.status === 'upcoming' ? 'Nadchodzący' : 'Miniony'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
