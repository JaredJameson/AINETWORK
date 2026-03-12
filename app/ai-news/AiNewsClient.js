'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* Colored thumbnail placeholder per category */
const CATEGORY_VISUALS = {
  'modele-lmy': {
    gradient: 'linear-gradient(135deg, #0d1a2e 0%, #1a2d4a 100%)',
    accent: '#5B8DEF',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
      </svg>
    ),
  },
  'narzedzia-workflow': {
    gradient: 'linear-gradient(135deg, #0d2010 0%, #1a3a1e 100%)',
    accent: '#2ECC71',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  'biznes-regulacje': {
    gradient: 'linear-gradient(135deg, #1a1200 0%, #2e2000 100%)',
    accent: '#F5C518',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
};

const DEFAULT_VISUAL = {
  gradient: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
  accent: '#F5C518',
  icon: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
};

export default function AiNewsClient({ data }) {
  const { pillars, articles } = data;
  const [activeFilter, setActiveFilter] = useState('all');

  const pillarMap = Object.fromEntries(pillars.map(p => [p.id, p]));
  const filters = [{ id: 'all', label: 'Wszystkie' }, ...pillars.map(p => ({ id: p.id, label: p.title }))];
  const filtered = activeFilter === 'all' ? articles : articles.filter(a => a.category === activeFilter);

  return (
    <>
      {/* ─── Header ─────────────────────────────────────────── */}
      <section style={{
        paddingTop: '140px', paddingBottom: '80px',
        background: '#0D0D0D', position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="/assets/images/news/ai-news-hero.png"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.75) 100%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="sec-title" style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: '640px', marginBottom: '20px', color: '#FFFFFF' }}>
              Co nowego w świecie AI
            </h1>
            <p style={{ fontSize: '16px', color: '#AAAAAA', lineHeight: 1.7, maxWidth: '560px', marginBottom: '16px' }}>
              Cotygodniowy przegląd najważniejszych nowości ze świata sztucznej inteligencji, filtrowanych przez pryzmat polskiego biznesu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Category pills (filter) ──────────────────────────── */}
      <section style={{ padding: '0 0 48px', background: '#FFFFFF' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <span style={{ fontSize: '13px', color: '#999999', marginRight: '4px' }}>Kategoria:</span>
            {filters.map(f => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '7px 18px', borderRadius: '100px', border: '1px solid',
                    borderColor: active ? 'var(--yellow)' : '#E5E5E5',
                    background: active ? 'var(--yellow)' : '#FFFFFF',
                    color: active ? '#111111' : '#555555',
                    fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.label}
                  {f.id !== 'all' && (
                    <span style={{
                      marginLeft: '6px', fontSize: '11px',
                      opacity: 0.7,
                    }}>
                      {articles.filter(a => a.category === f.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Articles grid ────────────────────────────────────── */}
      <section style={{ padding: '0 0 120px', background: '#F5F5F5' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#555555' }}>
              {activeFilter === 'all'
                ? `Wszystkie wpisy (${articles.length})`
                : `${pillarMap[activeFilter]?.title} (${filtered.length})`}
            </h2>
          </div>

          <motion.div
            key={activeFilter}
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
            className="news-grid"
          >
            {filtered.map(art => {
              const pillar = pillarMap[art.category];
              const vis = CATEGORY_VISUALS[art.category] || DEFAULT_VISUAL;
              const color = vis.accent;
              const date = new Date(art.date);
              const dateLabel = date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <motion.div key={art.id} variants={fadeUp}>
                  <Link href={`/ai-news/${art.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <motion.article
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E5E5',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      whileHover={{
                        y: -4,
                        borderColor: color,
                        boxShadow: `0 8px 30px rgba(0,0,0,0.08)`,
                        transition: { duration: 0.25 },
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        height: '180px',
                        background: vis.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}>
                        {art.imageUrl ? (
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '64px', height: '64px',
                            background: `${color}18`,
                            border: `1px solid ${color}33`,
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color,
                          }}>
                            {vis.icon}
                          </div>
                        )}
                        {/* Top accent bar */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />

                        {/* Date badge */}
                        <div style={{
                          position: 'absolute', top: '12px', right: '12px',
                          background: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '11px', fontWeight: 700,
                          color: '#fff', lineHeight: 1.3, textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>{date.getDate()}</div>
                          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                            {date.toLocaleDateString('pl-PL', { month: 'short' })}
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {/* Category + source */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '3px 10px',
                            background: `${color}18`,
                            borderRadius: '100px',
                            fontSize: '10px', fontWeight: 700,
                            color, textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}>
                            {art.category_label}
                          </span>
                          {art.source && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              via {art.source}
                            </span>
                          )}
                        </div>

                        <h3 style={{
                          fontSize: '16px', fontWeight: 700,
                          color: '#111111', lineHeight: 1.35,
                          marginBottom: '10px',
                        }}>
                          {art.title}
                        </h3>

                        <p style={{
                          fontSize: '13px', color: '#555555',
                          lineHeight: 1.6, marginBottom: '16px',
                          flex: 1,
                        }}>
                          {art.excerpt}
                        </p>

                        {/* Footer */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          paddingTop: '14px',
                          borderTop: '1px solid #E5E5E5',
                          flexWrap: 'wrap', gap: '8px',
                        }}>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', color: '#999999', display: 'flex', alignItems: 'center', gap: '4px' }}><ClockIcon /> {art.reading_time}</span>
                            {art.tags?.slice(0, 2).map(tag => (
                              <span key={tag} style={{
                                padding: '2px 7px',
                                background: '#F0F0F0',
                                borderRadius: '4px',
                                fontSize: '10px', color: '#777777',
                              }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span style={{
                            fontSize: '12px', fontWeight: 700, color,
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}>
                            Czytaj <ArrowRight />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 560px) { .news-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ─── Newsletter CTA ───────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{
            background: '#1A1A1A',
            border: '1px solid rgba(245,197,24,0.1)',
            borderRadius: '20px',
            padding: '56px',
            textAlign: 'center',
          }}>
            <div className="sec-label" style={{ textAlign: 'center', display: 'block' }}>Newsletter</div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: '#FFFFFF' }}>
              Dostawaj AI News co tydzień
            </h2>
            <p style={{ color: '#AAAAAA', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
              Przegląd najważniejszych wydarzeń ze świata AI — wyselekcjonowany, po polsku, gotowy do przeczytania w 5 minut.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Twój adres email"
                style={{
                  padding: '13px 20px',
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  color: '#fff', fontSize: '14px',
                  fontFamily: 'var(--font)',
                  outline: 'none', width: '280px', maxWidth: '100%',
                }}
              />
              <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Zapisz się <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
