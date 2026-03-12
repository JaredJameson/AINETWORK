'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══ Icons ═══ */
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ClusterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const PenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
);
const NoResultsIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>
  </svg>
);

/* ═══ Pillar badge icons by category ═══ */
const pillarBadgeIcons = {
  'content-marketing': <PenIcon />,
  'strategia-ai': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>
    </svg>
  ),
  'narzedzia-modele': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4"/><path d="m6.41 6.41-2.83-2.83"/><path d="M2 12h4"/>
      <path d="m6.41 17.59-2.83 2.83"/><path d="M12 18v4"/><path d="m17.59 17.59 2.83 2.83"/>
      <path d="M18 12h4"/><path d="m17.59 6.41 2.83-2.83"/><circle cx="12" cy="12" r="4"/>
    </svg>
  ),
};

function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ═══ MAIN COMPONENT ═══ */
export default function KnowledgeClient({ pillars, articles, categories }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allItems = useMemo(() => [...pillars.map(p => ({ ...p, _type: 'pillar' })), ...articles.map(a => ({ ...a, _type: 'article' }))], [pillars, articles]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allItems.filter(item => {
      const matchesCategory = activeFilter === 'all' || item.categoryKey === activeFilter;
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || (item.excerpt || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allItems, activeFilter, searchQuery]);

  const filteredPillars = filtered.filter(i => i._type === 'pillar');
  const filteredArticles = filtered.filter(i => i._type === 'article');

  return (
    <>
      {/* ═══ PAGE HERO ═══ */}
      <section style={{
        padding: '120px 0 60px',
        background: '#0D0D0D',
      }}>
        <div className="container">
          <div className="bw-hero-inner" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px',
          }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ flex: 1 }}
            >
              <div style={{
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: '#F5C518', marginBottom: '12px',
              }}>
                Baza wiedzy
              </div>
              <h1 style={{
                fontFamily: 'var(--font)', fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700, color: '#FFFFFF', marginBottom: '16px',
              }}>
                Materiały, które pomagają wdrażać AI
              </h1>
              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.7, maxWidth: '600px',
              }}>
                Praktyczne przewodniki, case studies i gotowe szablony. Wszystko, czego potrzebujesz, żeby skutecznie wdrażać sztuczną inteligencję w swojej firmie.
              </p>
            </motion.div>

            <motion.div
              className="bw-hero-img"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ flexShrink: 0 }}
            >
              <img
                src="/assets/images/baza-wiedzy-hero.png"
                alt="AI Knowledge Base"
                style={{
                  width: '320px', height: 'auto',
                  filter: 'drop-shadow(0 0 40px rgba(245,197,24,0.15))',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FILTERS & SEARCH ═══ */}
      <div style={{
        padding: '32px 0 0',
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E8E8',
        position: 'sticky', top: '64px', zIndex: 50,
      }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '24px', flexWrap: 'wrap', paddingBottom: '20px',
          }}
          className="filters-inner"
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveFilter('all')}
                style={{
                  padding: '8px 18px', borderRadius: '100px',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                  fontSize: '13px', fontWeight: 600,
                  background: activeFilter === 'all' ? '#111' : '#F5F5F5',
                  color: activeFilter === 'all' ? '#FFF' : '#555',
                  transition: 'all 0.2s',
                }}
              >
                Wszystkie
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.key)}
                  style={{
                    padding: '8px 18px', borderRadius: '100px',
                    border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font)',
                    fontSize: '13px', fontWeight: 600,
                    borderColor: activeFilter === cat.key ? '#111' : '#E8E8E8',
                    background: activeFilter === cat.key ? '#111' : '#FFF',
                    color: activeFilter === cat.key ? '#FFF' : '#555',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', flexShrink: 0 }}>
              <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#999',
                pointerEvents: 'none',
              }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Szukaj artykułów..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '280px', padding: '10px 16px 10px 40px',
                  border: '1px solid #E8E8E8', borderRadius: '10px',
                  fontFamily: 'var(--font)', fontSize: '14px',
                  color: '#111', background: '#FFF',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RESULTS INFO ═══ */}
      <div style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ padding: '24px 0 8px', fontSize: '14px', color: '#999' }}>
            <span style={{ fontWeight: 600, color: '#333' }}>{filtered.length}</span> materiałów
          </div>
        </div>
      </div>

      {/* ═══ PILLAR PAGES ═══ */}
      {filteredPillars.length > 0 && (
        <section style={{ padding: '48px 0 24px', background: '#FFFFFF' }}>
          <div className="container">
            <div style={{
              fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999',
              marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              Przewodniki kompleksowe (Pillar Pages)
              <span style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
            </div>

            {filteredPillars.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={`/artykul/${p.slug}`} className="pillar-card-link" style={{
                  background: '#0D0D0D',
                  borderRadius: '16px',
                  padding: '36px 40px',
                  marginBottom: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderLeft: '4px solid #F5C518',
                  textDecoration: 'none',
                  display: 'block',
                  color: 'inherit',
                  backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'all 0.3s',
                }}>
                  {/* Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.7) 100%)',
                    zIndex: 1,
                  }} />

                  {/* Number watermark */}
                  <div style={{
                    position: 'absolute', top: '-15px', right: '30px',
                    fontFamily: 'var(--font)', fontSize: '120px', fontWeight: 800,
                    color: 'rgba(245,197,24,0.06)', lineHeight: 1,
                    pointerEvents: 'none', zIndex: 2,
                  }}>
                    {p.number}
                  </div>

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: '#F5C518', marginBottom: '12px',
                    }}>
                      {pillarBadgeIcons[p.categoryKey] || <PenIcon />}
                      Pillar Page &middot; {p.categoryLabel}
                    </div>

                    <div style={{
                      fontFamily: 'var(--font)', fontSize: '24px', fontWeight: 700,
                      color: '#FFFFFF', lineHeight: 1.25, marginBottom: '12px',
                    }}>
                      {p.title}
                    </div>

                    <div style={{
                      fontSize: '15px', color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.65, maxWidth: '700px', marginBottom: '20px',
                    }}>
                      {p.excerpt}
                    </div>

                    <div style={{
                      display: 'flex', gap: '24px', alignItems: 'center',
                    }}
                    className="pillar-meta"
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                      }}>
                        <span style={{ color: '#F5C518' }}><ClockIcon /></span>
                        {p.readingTime} czytania
                      </div>
                      {p.clusterCount > 0 && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                        }}>
                          <span style={{ color: '#F5C518' }}><ClusterIcon /></span>
                          {p.clusterCount} {p.clusterCount === 1 ? 'artykuł w klastrze' : p.clusterCount < 5 ? 'artykuły w klastrze' : 'artykułów w klastrze'}
                        </div>
                      )}
                      <div className="pillar-arrow" style={{
                        marginLeft: 'auto',
                        width: '40px', height: '40px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#F5C518', transition: 'all 0.3s',
                      }}>
                        <ArrowIcon />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ ALL ARTICLES ═══ */}
      <section style={{ padding: '24px 0 80px', background: '#FFFFFF' }}>
        <div className="container">
          {filteredArticles.length > 0 && (
            <>
              <div style={{
                fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999',
                marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                Wszystkie artykuły
                <span style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
              </div>

              <div className="bw-articles-grid" style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
              }}>
                <AnimatePresence mode="popLayout">
                  {filteredArticles.map((art, i) => (
                    <motion.div
                      key={art.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link href={`/artykul/${art.slug}`} className="bw-article-card" style={{
                        background: '#FFFFFF',
                        border: '1px solid #E8E8E8',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.25s',
                      }}>
                        {/* Image */}
                        <div style={{
                          height: '180px', overflow: 'hidden',
                          background: '#F5F5F5', position: 'relative',
                        }}>
                          {art.imageUrl ? (
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%', height: '100%',
                              background: 'linear-gradient(135deg, #1a1a2e 0%, #0d0d0d 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'rgba(255,255,255,0.3)',
                              fontSize: '12px', fontWeight: 600,
                            }}>
                              AI NETWORK
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div style={{
                          padding: '20px', flex: 1,
                          display: 'flex', flexDirection: 'column',
                        }}>
                          <div style={{
                            fontSize: '11px', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            color: '#B8860B', marginBottom: '8px',
                          }}>
                            {art.categoryLabel}
                          </div>
                          <div style={{
                            fontFamily: 'var(--font)', fontSize: '17px', fontWeight: 700,
                            lineHeight: 1.3, marginBottom: '8px', color: '#111',
                          }}>
                            {art.title}
                          </div>
                          <div style={{
                            fontSize: '14px', color: '#666',
                            lineHeight: 1.5, marginBottom: '14px', flex: 1,
                          }}>
                            {art.excerpt}
                          </div>
                          <div style={{
                            display: 'flex', gap: '14px', alignItems: 'center',
                            fontSize: '12px', color: '#999', marginTop: 'auto',
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ClockIcon /> {art.readingTime}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CalendarIcon /> {formatDate(art.date)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* No results */}
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
            }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 20px', color: '#999' }}>
                <NoResultsIcon />
              </div>
              <h3 style={{
                fontFamily: 'var(--font)', fontSize: '20px', fontWeight: 700,
                marginBottom: '8px', color: '#333',
              }}>
                Brak wyników
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Spróbuj zmieniać filtry lub wpisz inne słowo kluczowe.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ padding: '80px 0', background: '#0D0D0D', color: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '48px', flexWrap: 'wrap',
          }}
          className="newsletter-inner"
          >
            <div style={{ maxWidth: '480px' }}>
              <h3 style={{
                fontFamily: 'var(--font)', fontSize: '28px', fontWeight: 700,
                marginBottom: '8px',
              }}>
                Bądź na bieżąco z AI
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                Cotygodniowy przegląd najważniejszych nowości, narzędzi i praktycznych porad ze świata sztucznej inteligencji.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }} className="newsletter-form">
              <input
                type="email"
                placeholder="Twój adres email"
                style={{
                  width: '300px', padding: '14px 18px',
                  borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
                  background: '#1A1A1A', color: '#FFF',
                  fontFamily: 'var(--font)', fontSize: '15px',
                }}
              />
              <button style={{
                padding: '14px 28px', background: '#F5C518',
                color: '#111', border: 'none', borderRadius: '10px',
                fontFamily: 'var(--font)', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                Zapisz się
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STYLES ═══ */}
      <style>{`
        .pillar-card-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(245,197,24,0.1);
        }
        .pillar-card-link:hover .pillar-arrow {
          background: #F5C518 !important;
          color: #111 !important;
          border-color: #F5C518 !important;
        }
        .bw-article-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: #F5C518 !important;
        }
        @media (max-width: 1024px) {
          .bw-articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 860px) {
          .bw-hero-img { display: none !important; }
        }
        @media (max-width: 640px) {
          .bw-articles-grid { grid-template-columns: 1fr !important; }
          .filters-inner { flex-direction: column !important; align-items: stretch !important; }
          .filters-inner input { width: 100% !important; }
          .newsletter-inner { flex-direction: column !important; text-align: center; }
          .newsletter-form { flex-direction: column !important; }
          .newsletter-form input { width: 100% !important; }
          .pillar-meta { flex-wrap: wrap !important; gap: 12px !important; }
        }
      `}</style>
    </>
  );
}
