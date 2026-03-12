'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { useMemo, useEffect, useRef, useState } from 'react';

/* ── SVG Icons ── */
const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const CalendarIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

/* ── Helpers ── */
function stripFrontmatter(md) {
  return md.replace(/^---[\s\S]*?---\n?/, '');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function truncate(text, max) {
  if (!text || text.length <= max) return text;
  return text.substring(0, max) + '...';
}

/* ── Component ── */
export default function ArticleClient({ article, related }) {
  const contentRef = useRef(null);
  const [tocItems, setTocItems] = useState([]);
  const [activeId, setActiveId] = useState('');

  const isPillar = article.type === 'pillar';

  // Render markdown and build TOC from HTML string (not DOM) to survive React re-renders
  const { html, tocData } = useMemo(() => {
    marked.setOptions({ breaks: false, gfm: true });
    const stripped = stripFrontmatter(article.content);
    let rendered = marked.parse(stripped);
    // Fix internal article links: /slug → /artykul/slug
    rendered = rendered.replace(
      /href="\/(?!artykul\/)([a-z0-9-]+)"/g,
      'href="/artykul/$1"'
    );

    // Extract TOC and inject IDs into h2 tags in the HTML string
    const usedIds = {};
    const items = [];
    rendered = rendered.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (match, attrs, content) => {
      // Strip {#custom-id} if present
      let text = content.replace(/<[^>]+>/g, '').trim();
      const customMatch = text.match(/\{#([^}]+)\}\s*$/);
      let id;
      if (customMatch) {
        id = customMatch[1];
        text = text.replace(/\s*\{#[^}]+\}\s*$/, '');
        content = content.replace(/\s*\{#[^}]+\}\s*$/, '');
      } else {
        id = slugify(text);
      }
      if (usedIds[id]) {
        usedIds[id]++;
        id += '-' + usedIds[id];
      } else {
        usedIds[id] = 1;
      }
      items.push({ id, text });
      return `<h2${attrs} id="${id}">${content}</h2>`;
    });

    return { html: rendered, tocData: items };
  }, [article.content]);

  // Set TOC items from pre-computed data
  useEffect(() => {
    setTocItems(tocData);
  }, [tocData]);

  // Process callouts (DOM-only, no ID changes)
  useEffect(() => {
    if (!contentRef.current) return;
    const blockquotes = contentRef.current.querySelectorAll('blockquote');
    blockquotes.forEach((bq) => {
      const firstP = bq.querySelector('p');
      if (!firstP) return;
      const text = firstP.innerHTML;
      const patterns = [
        { prefix: 'Wskazówka praktyczna:', cls: 'callout-tip', label: 'Wskazówka praktyczna' },
        { prefix: 'Wskazowka praktyczna:', cls: 'callout-tip', label: 'Wskazówka praktyczna' },
        { prefix: 'Przykład:', cls: 'callout-example', label: 'Przykład' },
        { prefix: 'Przyklad:', cls: 'callout-example', label: 'Przykład' },
        { prefix: 'Uwaga:', cls: 'callout-warning', label: 'Uwaga' },
      ];
      for (const p of patterns) {
        if (text.trimStart().startsWith(p.prefix)) {
          bq.classList.add(p.cls);
          firstP.innerHTML =
            '<span class="callout-label">' + p.label + '</span>' +
            text.replace(p.prefix, '').trim();
          break;
        }
      }
    });
  }, [html]);

  // Scroll spy
  useEffect(() => {
    if (tocItems.length === 0) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 140;
        let current = '';
        tocItems.forEach((item) => {
          const el = document.getElementById(item.id);
          if (el && el.offsetTop <= scrollPos) current = item.id;
        });
        setActiveId(current);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [tocItems]);

  const sidebarRelated = (related || []).slice(0, 4);
  const bottomRelated = (related || []).slice(0, 3);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="art-hero">
        <div className="art-hero-glow" />
        {article.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imageUrl} alt="" className="art-hero-bg" />
        )}
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <div className="art-breadcrumb">
              <Link href="/baza-wiedzy">Baza wiedzy</Link>
              <span className="art-breadcrumb-sep">/</span>
              {!isPillar && article.pillar ? (
                <>
                  <Link href={`/artykul/${article.pillar.slug}`}>{truncate(article.pillar.title, 40)}</Link>
                  <span className="art-breadcrumb-sep">/</span>
                </>
              ) : article.categoryLabel ? (
                <>
                  <span className="art-breadcrumb-current">{article.categoryLabel}</span>
                  <span className="art-breadcrumb-sep">/</span>
                </>
              ) : null}
              <span className="art-breadcrumb-current">{truncate(article.title, 50)}</span>
            </div>

            {/* Title */}
            <h1 className="art-title">{article.title}</h1>

            {/* Meta */}
            <div className="art-meta">
              {article.readingTime && (
                <span className="art-meta-item">
                  <span className="art-meta-icon"><ClockIcon /></span>
                  {article.readingTime} czytania
                </span>
              )}
              {article.date && (
                <span className="art-meta-item">
                  <span className="art-meta-icon"><CalendarIcon /></span>
                  {formatDate(article.date)}
                </span>
              )}
              {isPillar && article.clusters.length > 0 && (
                <span className="art-meta-item">
                  <span className="art-meta-icon"><BookIcon /></span>
                  {article.clusters.length} artykułów w serii
                </span>
              )}
            </div>

            {/* Pillar link for cluster articles */}
            {!isPillar && article.pillar && (
              <Link href={`/artykul/${article.pillar.slug}`} className="art-pillar-link">
                <ArrowLeftIcon />
                <span>Część przewodnika: {truncate(article.pillar.title, 50)}</span>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ WHITE CONTENT AREA ═══ */}
      <div className="art-white-bg">

      {/* ═══ ARTICLE LAYOUT ═══ */}
      <div className="art-layout">
        {/* Content */}
        <motion.article
          className="article-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: html }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        />

        {/* Sidebar */}
        <aside className="art-sidebar">
          {/* TOC */}
          {tocItems.length >= 2 && (
            <div className="art-toc">
              <div className="art-toc-title">Spis treści</div>
              <ul className="art-toc-list">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeId === item.id ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) {
                          const top = el.getBoundingClientRect().top + window.pageYOffset - 88;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sidebar related */}
          {sidebarRelated.length > 0 && (
            <div className="art-sidebar-related">
              <div className="art-sidebar-related-title">Powiązane artykuły</div>
              {sidebarRelated.map((r) => (
                <Link key={r.id} href={`/artykul/${r.slug}`} className="art-sidebar-related-item">
                  <div className="art-sidebar-related-item-title">{r.title}</div>
                  <div className="art-sidebar-related-item-meta">{r.readingTime || ''}</div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ═══ BACK BUTTON ═══ */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 32px 48px' }}>
        <Link href="/baza-wiedzy" className="art-back-btn">
          <ArrowLeftIcon /> Wróć do bazy wiedzy
        </Link>
      </div>

      </div>{/* end .art-white-bg */}

      {/* ═══ BOTTOM RELATED ═══ */}
      {bottomRelated.length > 0 && (
        <section className="art-related-section">
          <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 32px' }}>
            <div className="art-related-title">
              {isPillar ? 'Artykuły w tym przewodniku' : 'Powiązane artykuły'}
            </div>
            <div className="art-related-grid">
              {bottomRelated.map((r) => (
                <Link key={r.id} href={`/artykul/${r.slug}`} className="art-related-card">
                  <div className="art-related-card-img">
                    {r.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.imageUrl} alt={r.title} />
                    ) : (
                      <div className="art-related-card-placeholder">AI NETWORK</div>
                    )}
                  </div>
                  <div className="art-related-card-body">
                    <div className="art-related-card-category">{r.categoryLabel}</div>
                    <div className="art-related-card-title">{r.title}</div>
                    {r.excerpt && (
                      <div className="art-related-card-excerpt">{truncate(r.excerpt, 120)}</div>
                    )}
                    <div className="art-related-card-meta">
                      {r.readingTime && (
                        <span className="art-related-card-meta-item">
                          <ClockIcon size={13} /> {r.readingTime}
                        </span>
                      )}
                      {r.date && (
                        <span className="art-related-card-meta-item">
                          <CalendarIcon size={13} /> {formatDate(r.date)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ NEWSLETTER ═══ */}
      <section className="art-newsletter">
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 32px' }}>
          <div className="art-newsletter-inner">
            <div className="art-newsletter-text">
              <h3>Bądź na bieżąco z AI</h3>
              <p>Cotygodniowy przegląd najważniejszych nowości, narzędzi i praktycznych porad ze świata sztucznej inteligencji.</p>
            </div>
            <div className="art-newsletter-form">
              <input type="email" className="art-newsletter-input" placeholder="Twój adres email" />
              <button className="art-newsletter-btn">Zapisz się</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STYLES ═══ */}
      <style>{`
        /* ── Hero ── */
        .art-hero {
          padding: 120px 0 48px;
          background: #0D0D0D;
          color: #FFFFFF;
          position: relative;
          overflow: hidden;
        }
        .art-hero-glow {
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .art-hero-bg {
          position: absolute;
          top: 0; right: 0;
          width: 55%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.12;
          pointer-events: none;
          mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%);
          -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%);
        }

        /* Breadcrumb */
        .art-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #777;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .art-breadcrumb a {
          color: #777;
          text-decoration: none;
          transition: color 0.2s;
        }
        .art-breadcrumb a:hover { color: #F5C518; }
        .art-breadcrumb-sep { color: #777; opacity: 0.5; }
        .art-breadcrumb-current { color: #BBB; }

        /* Title */
        .art-title {
          font-size: clamp(24px, 4vw, 38px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          max-width: 760px;
          margin-bottom: 20px;
        }

        /* Meta */
        .art-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .art-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #777;
        }
        .art-meta-icon { color: #F5C518; display: inline-flex; }

        /* Pillar link */
        .art-pillar-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #BBB;
          text-decoration: none;
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          transition: all 0.2s;
          margin-top: 8px;
        }
        .art-pillar-link:hover {
          border-color: #F5C518;
          color: #F5C518;
        }

        /* ── White content wrapper ── */
        .art-white-bg {
          background: #FFFFFF;
        }

        /* ── Layout ── */
        .art-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 48px;
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px 32px 40px;
          align-items: start;
        }

        /* ── Article content ── */
        .article-content {
          max-width: 760px;
          min-width: 0;
        }
        .article-content h2 {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.25;
          color: #111;
          margin: 48px 0 16px;
          padding-left: 16px;
          border-left: 4px solid #F5C518;
        }
        .article-content h2:first-child { margin-top: 0; }
        .article-content h3 {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.3;
          color: #111;
          margin: 36px 0 12px;
        }
        .article-content h4 {
          font-size: 17px;
          font-weight: 700;
          color: #111;
          margin: 28px 0 10px;
        }
        .article-content p {
          font-size: 16px;
          line-height: 1.75;
          color: #555;
          margin-bottom: 20px;
        }
        .article-content a {
          color: #D4A800;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .article-content a:hover { color: #F5C518; }
        .article-content ul, .article-content ol {
          margin: 0 0 20px 24px;
          font-size: 16px;
          line-height: 1.75;
          color: #555;
        }
        .article-content li { margin-bottom: 8px; }
        .article-content li::marker { color: #F5C518; }
        .article-content strong { color: #111; font-weight: 600; }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
        }

        /* Blockquotes */
        .article-content blockquote {
          margin: 28px 0;
          padding: 20px 24px;
          border-left: 4px solid #F5C518;
          background: rgba(245,197,24,0.08);
          border-radius: 0 8px 8px 0;
          font-size: 15px;
          line-height: 1.7;
          color: #555;
        }
        .article-content blockquote p { margin-bottom: 8px; }
        .article-content blockquote p:last-child { margin-bottom: 0; }

        /* Callouts */
        .article-content blockquote.callout-tip {
          border-left-color: #22C55E;
          background: rgba(34,197,94,0.06);
        }
        .article-content blockquote.callout-tip .callout-label {
          color: #22C55E;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 8px;
        }
        .article-content blockquote.callout-example {
          border-left-color: #3B82F6;
          background: rgba(59,130,246,0.06);
        }
        .article-content blockquote.callout-example .callout-label {
          color: #3B82F6;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 8px;
        }
        .article-content blockquote.callout-warning {
          border-left-color: #EF4444;
          background: rgba(239,68,68,0.06);
        }
        .article-content blockquote.callout-warning .callout-label {
          color: #EF4444;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 8px;
        }

        /* Code */
        .article-content code {
          font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 14px;
          background: #F5F5F5;
          padding: 2px 6px;
          border-radius: 4px;
          color: #111;
        }
        .article-content pre {
          margin: 24px 0;
          padding: 24px;
          background: #0D0D0D;
          border-radius: 12px;
          overflow-x: auto;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .article-content pre code {
          background: none;
          padding: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #BBB;
        }

        /* Tables */
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          font-size: 14px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #E5E5E5;
        }
        .article-content thead th {
          background: #0D0D0D;
          color: #FFF;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .article-content tbody td {
          padding: 12px 16px;
          border-bottom: 1px solid #E5E5E5;
          color: #555;
        }
        .article-content tbody tr:nth-child(even) { background: #F5F5F5; }
        .article-content tbody tr:hover { background: rgba(245,197,24,0.08); }

        /* HR */
        .article-content hr {
          border: none;
          height: 1px;
          background: #E5E5E5;
          margin: 40px 0;
        }

        /* ── Sidebar ── */
        .art-sidebar {
          position: sticky;
          top: 88px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #D5D5D5 transparent;
        }
        .art-sidebar::-webkit-scrollbar {
          width: 5px;
        }
        .art-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .art-sidebar::-webkit-scrollbar-thumb {
          background: #D5D5D5;
          border-radius: 4px;
        }
        .art-sidebar::-webkit-scrollbar-thumb:hover {
          background: #BBB;
        }

        /* TOC */
        .art-toc {
          background: #F5F5F5;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .art-toc-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          margin-bottom: 16px;
        }
        .art-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .art-toc-list li { margin-bottom: 4px; }
        .art-toc-list a {
          display: block;
          padding: 6px 12px;
          font-size: 13px;
          line-height: 1.4;
          color: #555;
          text-decoration: none;
          border-radius: 4px;
          border-left: 2px solid transparent;
          transition: all 0.2s;
        }
        .art-toc-list a:hover {
          color: #111;
          background: #FFF;
          border-left-color: #F5C518;
        }
        .art-toc-list a.active {
          color: #111;
          background: #FFF;
          border-left-color: #F5C518;
          font-weight: 600;
        }

        /* Sidebar related */
        .art-sidebar-related {
          background: #F5F5F5;
          border-radius: 12px;
          padding: 24px;
        }
        .art-sidebar-related-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          margin-bottom: 16px;
        }
        .art-sidebar-related-item {
          display: block;
          padding: 12px;
          margin-bottom: 8px;
          background: #FFF;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .art-sidebar-related-item:last-child { margin-bottom: 0; }
        .art-sidebar-related-item:hover {
          border-color: #F5C518;
          transform: translateY(-1px);
        }
        .art-sidebar-related-item-title {
          font-size: 13px;
          font-weight: 600;
          color: #111;
          line-height: 1.35;
          margin-bottom: 4px;
        }
        .art-sidebar-related-item-meta {
          font-size: 11px;
          color: #999;
        }

        /* ── Back button ── */
        .art-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: transparent;
          border: 1.5px solid #E5E5E5;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: border-color 0.2s;
        }
        .art-back-btn:hover { border-color: #F5C518; }

        /* ── Bottom related ── */
        .art-related-section {
          padding: 64px 0;
          background: #F5F5F5;
          border-top: 1px solid #E5E5E5;
        }
        .art-related-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .art-related-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E5E5;
        }
        .art-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .art-related-card {
          background: #FFF;
          border: 1px solid #E5E5E5;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.25s;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }
        .art-related-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: #F5C518;
        }
        .art-related-card-img {
          height: 160px;
          overflow: hidden;
          background: #F5F5F5;
        }
        .art-related-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .art-related-card-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #0d0d0d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
          font-size: 12px;
          font-weight: 600;
        }
        .art-related-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .art-related-card-category {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #D4A800;
          margin-bottom: 8px;
        }
        .art-related-card-title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 8px;
          color: #111;
        }
        .art-related-card-excerpt {
          font-size: 13px;
          color: #555;
          line-height: 1.5;
          margin-bottom: 12px;
          flex: 1;
        }
        .art-related-card-meta {
          display: flex;
          gap: 14px;
          align-items: center;
          font-size: 12px;
          color: #999;
          margin-top: auto;
        }
        .art-related-card-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Newsletter ── */
        .art-newsletter {
          padding: 80px 0;
          background: #0D0D0D;
          color: #FFF;
        }
        .art-newsletter-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 48px;
        }
        .art-newsletter-text { max-width: 480px; }
        .art-newsletter-text h3 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .art-newsletter-text p {
          color: #BBB;
          font-size: 15px;
        }
        .art-newsletter-form {
          display: flex;
          gap: 8px;
        }
        .art-newsletter-input {
          width: 300px;
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #1A1A1A;
          color: #FFF;
          font-family: inherit;
          font-size: 15px;
        }
        .art-newsletter-input::placeholder { color: #777; }
        .art-newsletter-input:focus { outline: none; border-color: #F5C518; }
        .art-newsletter-btn {
          padding: 14px 28px;
          border-radius: 8px;
          background: #F5C518;
          color: #111;
          border: none;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .art-newsletter-btn:hover {
          background: #FFD84D;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(245,197,24,0.25);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .art-layout {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .art-sidebar {
            position: static;
            display: none;
          }
          .art-related-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .art-hero { padding: 100px 0 36px; }
          .art-title { font-size: 24px; }
          .art-meta { gap: 12px; }
          .article-content h2 { font-size: 22px; }
          .article-content h3 { font-size: 18px; }
          .art-related-grid { grid-template-columns: 1fr; }
          .art-newsletter-inner { flex-direction: column; text-align: center; }
          .art-newsletter-form { flex-direction: column; }
          .art-newsletter-input { width: 100%; }
          .art-layout { padding: 32px 20px 40px; }
        }
      `}</style>
    </>
  );
}
