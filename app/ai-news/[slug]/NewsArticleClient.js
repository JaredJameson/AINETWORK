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

export default function NewsArticleClient({ article, related }) {
  const dateLabel = new Date(article.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const html = marked(article.content || '', { breaks: true });
  const catColor = article.category?.color || '#F5C518';

  return (
    <>
      {/* Hero */}
      <section className="news-art-hero">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            className="news-art-hero-img"
          />
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

      {/* Content */}
      <section style={{ padding: '60px 0 120px', background: '#FFFFFF' }}>
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
                  <h3 className="news-art-sidebar-title">Inne artykuły</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {related.map(r => (
                      <Link key={r.slug} href={`/ai-news/${r.slug}`} className="news-art-related">
                        <span className="news-art-related-cat">{r.category?.label}</span>
                        <span className="news-art-related-title">{r.title}</span>
                        <span className="news-art-related-date">
                          {new Date(r.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
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
          opacity: 0.25;
          pointer-events: none;
        }
        .news-art-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.85) 100%);
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

        .news-art-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 48px;
          max-width: 960px;
          margin: 0 auto;
        }

        .news-art-content {
          min-width: 0;
          font-size: 16px;
          line-height: 1.8;
          color: #333;
        }
        .news-art-content h1,
        .news-art-content h2,
        .news-art-content h3 {
          color: #111;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.3;
        }
        .news-art-content h1 { font-size: 28px; }
        .news-art-content h2 { font-size: 22px; font-weight: 700; }
        .news-art-content h3 { font-size: 18px; font-weight: 700; }
        .news-art-content p { margin-bottom: 1.2em; }
        .news-art-content strong { color: #111; font-weight: 700; }
        .news-art-content a { color: #F5C518; text-decoration: underline; }
        .news-art-content ul, .news-art-content ol {
          padding-left: 1.5em;
          margin-bottom: 1.2em;
        }
        .news-art-content li { margin-bottom: 0.4em; }
        .news-art-content blockquote {
          border-left: 3px solid #F5C518;
          padding: 12px 20px;
          margin: 1.5em 0;
          background: #FAFAFA;
          color: #555;
          border-radius: 0 8px 8px 0;
        }
        .news-art-content hr {
          border: none;
          border-top: 1px solid #E5E5E5;
          margin: 2em 0;
        }
        .news-art-content code {
          background: #F0F0F0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
        }

        .news-art-sidebar {
          position: sticky;
          top: 100px;
          align-self: start;
        }
        .news-art-sidebar-box {
          background: #FAFAFA;
          border: 1px solid #E5E5E5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .news-art-sidebar-title {
          font-size: 13px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        }
        .news-art-tag {
          padding: 4px 10px;
          background: #F0F0F0;
          border-radius: 6px;
          font-size: 12px;
          color: #666;
        }
        .news-art-related {
          display: flex;
          flex-direction: column;
          gap: 4px;
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

        @media (max-width: 768px) {
          .news-art-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .news-art-sidebar {
            position: static;
          }
        }
      `}</style>
    </>
  );
}
