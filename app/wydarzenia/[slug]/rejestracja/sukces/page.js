import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ params, searchParams }) {
  const { slug } = await params;
  const { code } = await searchParams;

  if (!code) notFound();

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
    include: { event: true },
  });

  if (!registration || registration.event.slug !== slug) notFound();

  const ev = registration.event;
  const eventDate = new Date(ev.date).toLocaleDateString('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(46,204,113,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '28px', color: '#2ECC71',
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Rejestracja potwierdzona!
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
          {registration.firstName}, dziękujemy za rejestrację na wydarzenie.
        </p>

        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '24px', marginBottom: '24px', textAlign: 'left',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: ev.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {ev.brand}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            {ev.title}
          </div>
          <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.8 }}>
            <div>{eventDate}, {ev.time}</div>
            <div>{ev.location}, {ev.venue}</div>
            <div style={{ marginTop: '8px', color: '#F5C518', fontWeight: 700, fontSize: '16px', letterSpacing: '0.1em' }}>
              Kod biletu: {registration.ticketCode}
            </div>
          </div>
        </div>

        <a
          href={`/api/tickets/${registration.ticketCode}`}
          download
          style={{
            display: 'inline-block', padding: '14px 32px',
            background: ev.accent || '#F5C518', color: '#111',
            borderRadius: '8px', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none', marginBottom: '16px',
          }}
        >
          Pobierz bilet (PDF)
        </a>

        <p style={{ color: '#555', fontSize: '12px', marginBottom: '32px' }}>
          Pokaż QR kod z biletu przy wejściu na wydarzenie.
        </p>

        <Link href="/wydarzenia" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>
          ← Wróć do wydarzeń
        </Link>
      </div>
    </div>
  );
}
