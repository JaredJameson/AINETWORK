'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SourceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

export default function NewsArticleClient({ article, related }) {
  const dateLabel = new Date(article.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const html = marked(article.content || '', { breaks: true });
  const catColor = article.category?.color || '#F5C518';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="news-art-hero">
        {article.imageUrl && (
          <img src={article.imageUrl} alt="" className="news-art-hero-img" />
        )}
        <div className="news-art-hero-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/ai-news" className="news-art-back">
              <ArrowLeft /> Wróć do AI News
            </Link>

            {article.category && (
              <span className="news-art-cat" style={{ background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}>
                {article.category.label}
              </span>
            )}

            <h1 className="news-art-title">{article.title}</h1>

            <div className="news-art-meta">
              <span>{dateLabel}</span>
              <span className="news-art-meta-dot" />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ClockIcon /> {article.readingTime}</span>
              {article.source && (
                <>
                  <span className="news-art-meta-dot" />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><SourceIcon /> {article.source}</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lead / excerpt */}
      <section className="news-art-lead-section">
        <div className="container">
          <motion.div
            className="news-art-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p>{article.excerpt}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 0 120px', background: '#FFFFFF' }}>
        <div className="container">
          <div className="news-art-layout">
            {/* Main content */}
            <motion.article
              className="news-art-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Sidebar */}
            <aside className="news-art-sidebar">
              {/* Action buttons */}
              <div className="news-art-sidebar-actions">
                <button onClick={handleShare} className="news-art-share-btn">
                  <ShareIcon /> Udostępnij
                </button>
                {article.sourceUrl && (
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="news-art-source-btn">
                    <SourceIcon /> Źródło oryginalne
                  </a>
                )}
              </div>

              {/* Key takeaway */}
              <div className="news-art-sidebar-box news-art-takeaway">
                <h3 className="news-art-sidebar-title">Kluczowy wniosek</h3>
                <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.6, margin: 0 }}>
                  {article.excerpt}
                </p>
              </div>

              {/* Tags */}
              {article.tags?.length > 0 && (
                <div className="news-art-sidebar-box">
                  <h3 className="news-art-sidebar-title">Tagi</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {article.tags.map(tag => (
                      <span key={tag} className="news-art-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related */}
              {related.length > 0 && (
                <div className="news-art-sidebar-box">
                  <h3 className="news-art-sidebar-title">Czytaj również</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {related.map(r => (
                      <Link key={r.slug} href={`/ai-news/${r.slug}`} className="news-art-related">
                        <span className="news-art-related-cat">{r.category?.label}</span>
                        <span className="news-art-related-title">{r.title}</span>
                        <span className="news-art-related-date">
                          {new Date(r.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="news-art-bottom-cta">
        <div className="container">
          <div className="news-art-bottom-cta-inner">
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Chcesz więcej takich analiz?
              </h3>
              <p style={{ fontSize: '14px', color: '#AAAAAA', margin: 0 }}>
                Dołącz do newslettera AI NETWORK — co tydzień przegląd najważniejszych wydarzeń ze świata AI.
              </p>
            </div>
            <Link href="/#newsletter" className="news-art-cta-btn">
              Zapisz się
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .news-art-hero {
          padding-top: 140px;
          padding-bottom: 60px;
          background: #0D0D0D;
          position: relative;
          overflow: hidden;
        }
        .news-art-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
          pointer-events: none;
        }
        .news-art-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.85) 100%);
          pointer-events: none;
        }
        .news-art-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #AAAAAA;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 28px;
          transition: color 0.2s;
        }
        .news-art-back:hover { color: #F5C518; }
        .news-art-cat {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }
        .news-art-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          max-width: 720px;
          margin-bottom: 20px;
        }
        .news-art-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 14px;
          color: #AAAAAA;
        }
        .news-art-meta-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #555;
          display: inline-block;
        }

        /* Lead section */
        .news-art-lead-section {
          background: #FFFFFF;
          padding: 48px 0 40px;
          border-bottom: 1px solid #E5E5E5;
        }
        .news-art-lead {
          max-width: 680px;
          margin: 0 auto;
        }
        .news-art-lead p {
          font-size: 19px;
          line-height: 1.7;
          color: #444;
          font-weight: 500;
          margin: 0;
          position: relative;
          padding-left: 24px;
          border-left: 3px solid #F5C518;
        }

        /* Layout */
        .news-art-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 56px;
          max-width: 1040px;
          margin: 0 auto;
          padding-top: 48px;
        }

        /* Article content */
        .news-art-content {
          min-width: 0;
          font-size: 17px;
          line-height: 1.85;
          color: #333;
        }
        .news-art-content h1,
        .news-art-content h2,
        .news-art-content h3 {
          color: #111;
          margin-top: 2.2em;
          margin-bottom: 0.7em;
          line-height: 1.3;
        }
        .news-art-content h1 { font-size: 28px; }
        .news-art-content h2 {
          font-size: 23px;
          font-weight: 800;
          padding-bottom: 10px;
          border-bottom: 2px solid #F5C518;
          display: inline-block;
        }
        .news-art-content h3 { font-size: 18px; font-weight: 700; }
        .news-art-content p { margin-bottom: 1.3em; }
        .news-art-content strong { color: #111; font-weight: 700; }
        .news-art-content em { font-style: italic; color: #555; }
        .news-art-content a { color: #D4A800; text-decoration: underline; text-underline-offset: 3px; }
        .news-art-content a:hover { color: #F5C518; }
        .news-art-content ul, .news-art-content ol {
          padding-left: 1.5em;
          margin-bottom: 1.4em;
        }
        .news-art-content li {
          margin-bottom: 0.5em;
          padding-left: 4px;
        }
        .news-art-content li::marker {
          color: #F5C518;
        }
        .news-art-content blockquote {
          border-left: 4px solid #F5C518;
          padding: 20px 24px;
          margin: 2em 0;
          background: linear-gradient(135deg, #FFFDF5 0%, #FFF9E6 100%);
          border-radius: 0 12px 12px 0;
          font-size: 16px;
          line-height: 1.7;
          color: #444;
          position: relative;
        }
        .news-art-content blockquote::before {
          content: '"';
          position: absolute;
          top: -8px;
          left: 12px;
          font-size: 48px;
          font-weight: 800;
          color: #F5C518;
          opacity: 0.4;
          line-height: 1;
        }
        .news-art-content blockquote p { margin-bottom: 0; }
        .news-art-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #E5E5E5, transparent);
          margin: 2.5em 0;
        }
        .news-art-content code {
          background: #F0F0F0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 15px;
        }

        /* Sidebar */
        .news-art-sidebar {
          position: sticky;
          top: 90px;
          align-self: start;
        }
        .news-art-sidebar-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .news-art-share-btn, .news-art-source-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          font-family: var(--font);
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .news-art-share-btn {
          background: #F0F0F0;
          border: 1px solid #E0E0E0;
          color: #555;
        }
        .news-art-share-btn:hover { background: #E5E5E5; color: #333; }
        .news-art-source-btn {
          background: #0D0D0D;
          border: 1px solid #333;
          color: #FFFFFF;
        }
        .news-art-source-btn:hover { background: #222; }

        .news-art-sidebar-box {
          background: #FAFAFA;
          border: 1px solid #E5E5E5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .news-art-takeaway {
          background: linear-gradient(135deg, #FFFDF5 0%, #FFF9E6 100%);
          border-color: rgba(245, 197, 24, 0.25);
        }
        .news-art-sidebar-title {
          font-size: 11px;
          font-weight: 800;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .news-art-tag {
          padding: 5px 12px;
          background: #F0F0F0;
          border: 1px solid #E5E5E5;
          border-radius: 6px;
          font-size: 12px;
          color: #666;
          transition: all 0.15s;
        }
        .news-art-tag:hover { background: #E5E5E5; }
        .news-art-related {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-decoration: none;
          padding: 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .news-art-related:hover { background: #F0F0F0; }
        .news-art-related-cat {
          font-size: 10px;
          font-weight: 700;
          color: #F5C518;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .news-art-related-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          line-height: 1.35;
        }
        .news-art-related-date {
          font-size: 12px;
          color: #999;
        }

        /* Bottom CTA */
        .news-art-bottom-cta {
          background: #0D0D0D;
          padding: 48px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .news-art-bottom-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          max-width: 720px;
          margin: 0 auto;
        }
        .news-art-cta-btn {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          background: #F5C518;
          color: #111;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font);
          border-radius: 100px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .news-art-cta-btn:hover { background: #FFD84D; }

        @media (max-width: 900px) {
          .news-art-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .news-art-sidebar {
            position: static;
          }
        }
        @media (max-width: 600px) {
          .news-art-bottom-cta-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
