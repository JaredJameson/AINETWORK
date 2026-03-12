'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/#about', label: 'O nas' },
    { href: '/wydarzenia', label: 'Wydarzenia' },
    { href: '/baza-wiedzy', label: 'Baza wiedzy' },
    { href: '/ai-news', label: 'AI News' },
    { href: '/#contact', label: 'Kontakt' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none', color: 'var(--text-dark)',
          fontWeight: 700, fontSize: '17px', letterSpacing: '-0.01em',
        }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'var(--yellow)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </div>
          <span><span style={{ color: 'var(--text-dark-muted)', fontWeight: 400 }}>AI</span> NETWORK</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-desktop">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-dark-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--text-dark)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-dark-secondary)'}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/company/ai-network-bydgoszcz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '36px', height: '36px',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-dark-secondary)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-dark)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-dark-secondary)'; }}
            aria-label="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile-btn"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-dark)', padding: '4px',
            display: 'none',
          }}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: '#ffffff',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-light)',
          padding: '16px 24px 24px',
        }} className="nav-mobile-menu">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                color: 'var(--text-dark-secondary)',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500,
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
