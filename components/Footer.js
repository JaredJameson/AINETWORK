import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '72px 0 32px',
    }}>
      <div className="container">
        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '64px',
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '30px', height: '30px',
                background: 'var(--yellow)',
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>AI</span> NETWORK
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '280px',
              marginBottom: '20px',
            }}>
              Platforma wiedzy i wydarzeń AI dla ludzi, którzy AI wdrażają — nie tylko o nim mówią.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://www.linkedin.com/company/ai-network-bydgoszcz/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '36px', height: '36px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 1 */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              marginBottom: '16px',
            }}>Platforma</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['O nas', '/#about'],
                ['Warsztaty', '/warsztaty'],
                ['Kontakt', '/#contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              marginBottom: '16px',
            }}>Materiały</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['Baza wiedzy', '/baza-wiedzy'],
                ['AI News', '/ai-news'],
                ['Newsletter', '/#newsletter'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              marginBottom: '16px',
            }}>Wydarzenia</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['AI NETWORK EDU', '/wydarzenia'],
                ['AI NETWORK PLASTICS', '/wydarzenia'],
                ['AI NETWORK HERITAGE', '/wydarzenia'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            &copy; {year} AI NETWORK. Wszelkie prawa zastrzeżone.
          </span>
          <Link href="/polityka-prywatnosci" style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
          }}>
            Polityka prywatności
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
