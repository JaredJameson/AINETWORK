import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [articles, events, news, drafts] = await Promise.all([
    prisma.article.count(),
    prisma.event.count(),
    prisma.news.count({ where: { published: true } }),
    prisma.newsDraft.count({ where: { status: 'pending' } }),
  ]);
  return { articles, events, news, drafts };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const recentArticles = await prisma.article.findMany({
    take: 5, orderBy: { createdAt: 'desc' }, include: { category: true },
  });

  const cards = [
    { label: 'Artykuły', value: stats.articles, href: '/admin/articles', color: '#5B8DEF' },
    { label: 'Eventy', value: stats.events, href: '/admin/events', color: '#F5C518' },
    { label: 'AI News', value: stats.news, href: '/admin/news', color: '#2ECC71' },
    { label: 'Propozycje do przejrzenia', value: stats.drafts, href: '/admin/drafts', color: '#E74C3C' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Witaj w panelu AI NETWORK</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '40px' }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
              borderTop: `3px solid ${c.color}`, borderRadius: '10px', padding: '20px',
            }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>{c.value}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
        Ostatnio dodane artykuły
      </h2>
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {recentArticles.map((a, i) => (
          <Link key={a.id} href={`/admin/articles/${a.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', textDecoration: 'none',
            borderBottom: i < recentArticles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              padding: '2px 8px', background: `${a.category?.color || '#F5C518'}22`,
              borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              color: a.category?.color || '#F5C518', whiteSpace: 'nowrap',
            }}>
              {a.type === 'pillar' ? 'Filar' : 'Artykuł'}
            </span>
            <span style={{ color: '#DDDDDD', fontSize: '13px', flex: 1 }}>{a.title}</span>
            <span style={{ color: '#555', fontSize: '11px' }}>
              {new Date(a.createdAt).toLocaleDateString('pl-PL')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
