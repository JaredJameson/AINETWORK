import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewsListPage() {
  const news = await prisma.news.findMany({
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>AI News</h1>
        <Link href="/admin/news/new" style={{
          padding: '10px 20px', background: '#F5C518', color: '#111',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + Nowy news
        </Link>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {news.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Brak newsów</div>
        )}
        {news.map((n, i) => (
          <Link key={n.id} href={`/admin/news/${n.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', textDecoration: 'none',
            borderBottom: i < news.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: `${n.category?.color || '#5B8DEF'}22`,
              color: n.category?.color || '#5B8DEF',
              whiteSpace: 'nowrap',
            }}>
              {n.category?.label || 'Brak kategorii'}
            </span>
            <span style={{ flex: 1, color: '#DDD', fontSize: '13px' }}>{n.title}</span>
            <span style={{ color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>
              {new Date(n.date).toLocaleDateString('pl-PL')}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: n.published ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)',
              color: n.published ? '#2ECC71' : '#888',
            }}>
              {n.published ? 'Opublikowany' : 'Szkic'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
