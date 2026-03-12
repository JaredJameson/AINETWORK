'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const EventIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ArticleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const NewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
    <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
  </svg>
);
const DraftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/admin/events', label: 'Eventy', Icon: EventIcon },
  { href: '/admin/articles', label: 'Artykuły', Icon: ArticleIcon },
  { href: '/admin/news', label: 'AI News', Icon: NewsIcon },
  { href: '/admin/drafts', label: 'Propozycje', Icon: DraftIcon, badge: true },
  { href: '/admin/categories', label: 'Kategorie', Icon: CategoryIcon },
  { href: '/admin/settings', label: 'Ustawienia', Icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    fetch('/api/news/drafts')
      .then(r => r.json())
      .then(d => setDraftCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside style={{
      width: '240px', minHeight: '100vh', flexShrink: 0,
      background: '#111111', borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Montserrat, sans-serif',
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ color: '#F5C518', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>
          AI NETWORK
        </span>
        <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>Admin Panel</div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(({ href, label, Icon, badge }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px',
              background: active ? 'rgba(245,197,24,0.08)' : 'transparent',
              borderLeft: active ? '3px solid #F5C518' : '3px solid transparent',
              color: active ? '#F5C518' : '#AAAAAA',
              textDecoration: 'none', fontSize: '13px', fontWeight: 600,
              transition: 'all 0.15s',
            }}>
              <Icon />
              {label}
              {badge && draftCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#F5C518', color: '#111',
                  borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 800,
                }}>
                  {draftCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} style={{
        margin: '16px', padding: '10px', borderRadius: '8px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#888', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        fontFamily: 'inherit',
      }}>
        Wyloguj się
      </button>
    </aside>
  );
}
