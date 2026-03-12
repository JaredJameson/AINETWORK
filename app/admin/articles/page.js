import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArticlesListPage() {
  const articles = await prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>Artykuły</h1>
        <Link href="/admin/articles/new" style={{
          padding: '10px 20px', background: '#F5C518', color: '#111',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
        }}>
          + Nowy artykuł
        </Link>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {articles.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Brak artykułów</div>
        )}
        {articles.map((a, i) => (
          <Link key={a.id} href={`/admin/articles/${a.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', textDecoration: 'none',
            borderBottom: i < articles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: a.type === 'pillar' ? 'rgba(245,197,24,0.15)' : 'rgba(91,141,239,0.15)',
              color: a.type === 'pillar' ? '#F5C518' : '#5B8DEF',
              whiteSpace: 'nowrap',
            }}>
              {a.type === 'pillar' ? 'Filar' : 'Cluster'}
            </span>
            <span style={{ flex: 1, color: '#DDD', fontSize: '13px' }}>{a.title}</span>
            <span style={{ color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>{a.category?.label}</span>
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: a.published ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)',
              color: a.published ? '#2ECC71' : '#888',
              whiteSpace: 'nowrap',
            }}>
              {a.published ? 'Opublikowany' : 'Szkic'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
