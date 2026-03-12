'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function EventPage({
  brand, title, subtitle, date, time, location, venue, status, heroImage, accent = '#F5C518',
  intro, introLead, speakers, panel, networking, conclusion, gallery, sidebar, allEvents,
}) {
  const galleryRef = useRef(null);
  const panelSliderRef = useRef(null);

  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  const scrollPanel = (dir) => {
    if (panelSliderRef.current) {
      panelSliderRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="ev-hero">
        <div className="ev-hero-bg">
          {heroImage && (
            <img src={heroImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
          )}
        </div>
        <div className="ev-hero-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="ev-breadcrumb">
              <Link href="/wydarzenia">Wydarzenia</Link>
              <span>&gt;</span>
              <span>{brand}</span>
            </div>

            {/* Status badge */}
            <div className="ev-badge-status">{status}</div>

            {/* Title */}
            <h1 className="ev-hero-title">
              <span className="ev-hero-brand">{brand.replace(/#(\d+)/, '')}</span>
              <span className="ev-hero-accent">#{brand.match(/#(\d+)/)?.[1]}</span>
            </h1>
            <p className="ev-hero-subtitle">{subtitle || title}</p>

            {/* Meta */}
            <div className="ev-hero-meta">
              <span className="ev-meta-item"><CalendarIcon /> {date}</span>
              <span className="ev-meta-item"><LocationIcon /> {venue ? `${location}, ${venue}` : location}</span>
              <span className="ev-meta-item"><ClockIcon /> {time}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content with sidebar */}
      <div className="ev-layout">
        <div className="container">
          <div className="ev-grid">
            {/* Main column */}
            <div className="ev-main">
              {/* Intro */}
              {(introLead || intro) && (
                <motion.section className="ev-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {introLead && (
                    <p className="ev-lead" dangerouslySetInnerHTML={{ __html: introLead }} />
                  )}
                  {intro && (
                    <p className="ev-body">{intro}</p>
                  )}
                  <div className="ev-divider" />
                </motion.section>
              )}

              {/* Speakers */}
              {speakers && speakers.length > 0 && (
                <section className="ev-section">
                  <div className="ev-section-label">Prelegenci</div>
                  <h2 className="ev-section-title">Wystąpienia</h2>

                  {speakers.map((sp, i) => (
                    <motion.div
                      key={i}
                      className="ev-speaker"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * i }}
                    >
                      {sp.image && (
                        <div className="ev-speaker-img">
                          <img src={sp.image} alt={sp.name} />
                        </div>
                      )}
                      <div className="ev-speaker-content">
                        <div className="ev-speaker-topic-label">{sp.topicLabel || 'Prezentacja'}</div>
                        <h3 className="ev-speaker-topic">{sp.topic}</h3>
                        <div className="ev-speaker-name">{sp.name}</div>
                        <div className="ev-speaker-role">{sp.role}</div>
                        <p className="ev-speaker-desc">{sp.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </section>
              )}

              {/* Panel Discussion */}
              {panel && (
                <section className="ev-panel-section">
                  <div className="ev-panel-layout">
                    <div>
                      <div className="ev-section-label">Panel dyskusyjny</div>
                      <h2 className="ev-panel-title">{panel.title}</h2>
                      <p className="ev-body">{panel.desc}</p>
                      {panel.topics && (
                        <div className="ev-panel-topics">
                          {panel.topics.map((t, i) => (
                            <div key={i} className="ev-panel-topic-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {panel.participants && panel.participants.length > 0 && (
                      <div className="ev-panel-slider-wrap">
                        <button className="ev-panel-slider-btn ev-panel-slider-prev" onClick={() => scrollPanel(-1)}><ChevronLeft /></button>
                        <div className="ev-panel-slider-track" ref={panelSliderRef}>
                          {panel.participants.map((p, i) => (
                            <div key={i} className="ev-panel-slide">
                              {p.poster ? (
                                <img src={p.poster} alt={p.name} className="ev-panel-slide-poster" />
                              ) : (
                                <div className="ev-panel-slide-fallback">
                                  {p.image && <img src={p.image} alt={p.name} className="ev-panel-participant-img" />}
                                  <div className="ev-panel-participant-name">{p.name}</div>
                                  <div className="ev-panel-participant-role">{p.role}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <button className="ev-panel-slider-btn ev-panel-slider-next" onClick={() => scrollPanel(1)}><ChevronRight /></button>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Networking */}
              {networking && (
                <section className="ev-section">
                  <div className="ev-divider" />
                  <h2 className="ev-section-title">{networking.title}</h2>
                  <p className="ev-body">{networking.desc}</p>

                  {conclusion && (
                    <div className="ev-highlight">
                      <h3 className="ev-highlight-title">{conclusion.title}</h3>
                      <div dangerouslySetInnerHTML={{ __html: conclusion.content }} />
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="ev-sidebar">
              {/* Event info card */}
              <div className="ev-info-card">
                <h4 className="ev-info-card-title">Informacje</h4>
                <div className="ev-info-item">
                  <span className="ev-info-label">Data</span>
                  <span className="ev-info-value">{date}</span>
                </div>
                <div className="ev-info-item">
                  <span className="ev-info-label">Godzina</span>
                  <span className="ev-info-value">{time}</span>
                </div>
                <div className="ev-info-item">
                  <span className="ev-info-label">Lokalizacja</span>
                  <span className="ev-info-value">{venue ? `${venue}, ${location}` : location}</span>
                </div>
                <div className="ev-info-item">
                  <span className="ev-info-label">Status</span>
                  <span className="ev-info-value ev-status-badge">{status}</span>
                </div>
              </div>

              {/* All events */}
              {allEvents && allEvents.length > 0 && (
                <div className="ev-info-card" style={{ marginTop: '20px' }}>
                  <h4 className="ev-info-card-title">Wszystkie edycje</h4>
                  {allEvents.map((ev, i) => (
                    <Link key={i} href={ev.href} className={`ev-sidebar-event${ev.active ? ' active' : ''}`}>
                      <div className="ev-sidebar-event-date">{ev.date}</div>
                      <div className="ev-sidebar-event-title">{ev.title}</div>
                      <div className="ev-sidebar-event-location">{ev.location}</div>
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="ev-gallery-section">
          <div className="container">
            <div className="ev-section-label" style={{ color: '#D4A800' }}>Galeria</div>
            <h2 className="ev-section-title" style={{ color: '#FFFFFF', marginBottom: '32px' }}>Zdjęcia z wydarzenia</h2>
          </div>
          <div className="ev-gallery-wrapper">
            <button className="ev-gallery-btn ev-gallery-prev" onClick={() => scrollGallery(-1)}><ChevronLeft /></button>
            <div className="ev-gallery-track" ref={galleryRef}>
              {gallery.map((img, i) => (
                <div key={i} className="ev-gallery-item">
                  <img src={img} alt={`${brand} — zdjęcie ${i + 1}`} />
                </div>
              ))}
            </div>
            <button className="ev-gallery-btn ev-gallery-next" onClick={() => scrollGallery(1)}><ChevronRight /></button>
          </div>
        </section>
      )}

      {/* Back button */}
      <section style={{ padding: '60px 0', background: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Link href="/wydarzenia" className="ev-btn-back">
            <ArrowLeft /> Wróć do wydarzeń
          </Link>
        </div>
      </section>

      <style>{`
        /* ======== HERO ======== */
        .ev-hero {
          position: relative;
          min-height: 440px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          margin-top: 64px;
        }
        .ev-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0D0D0D 100%);
        }
        .ev-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(13,13,13,0.15) 0%,
            rgba(13,13,13,0.4) 40%,
            rgba(13,13,13,0.85) 80%,
            rgba(13,13,13,0.92) 100%
          );
          z-index: 1;
        }
        .ev-hero .container {
          padding-top: 80px;
          padding-bottom: 60px;
        }
        .ev-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          color: #8888AA;
          margin-bottom: 24px;
        }
        .ev-breadcrumb a {
          color: #8888AA;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ev-breadcrumb a:hover { color: #C4C4D4; }
        .ev-badge-status {
          display: inline-block;
          padding: 4px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          color: #888888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
        }
        .ev-hero-title {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        .ev-hero-brand { color: #C4C4D4; }
        .ev-hero-accent { color: #F5C518; }
        .ev-hero-subtitle {
          font-size: 24px;
          font-weight: 600;
          color: #C4C4D4;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        .ev-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .ev-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #8888AA;
        }

        @media (max-width: 768px) {
          .ev-hero { min-height: 360px; }
          .ev-hero-title { font-size: 34px; }
          .ev-hero-subtitle { font-size: 18px; }
        }

        /* ======== LAYOUT ======== */
        .ev-layout {
          background: #FFFFFF;
          padding: 60px 0 80px;
        }
        .ev-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ev-grid { grid-template-columns: 1fr; }
        }

        /* ======== MAIN CONTENT ======== */
        .ev-main { min-width: 0; overflow: hidden; }
        .ev-section { margin-bottom: 48px; }
        .ev-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #D4A800;
          margin-bottom: 8px;
        }
        .ev-section-title {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #111111;
          margin-bottom: 24px;
        }
        .ev-lead {
          font-size: 18px;
          line-height: 1.75;
          color: #333333;
          margin-bottom: 16px;
        }
        .ev-lead strong { color: #111111; }
        .ev-body {
          font-size: 16px;
          line-height: 1.7;
          color: #4A4A4A;
          margin-bottom: 16px;
        }
        .ev-divider {
          width: 60px;
          height: 4px;
          background: #F5C518;
          border-radius: 2px;
          margin: 32px 0;
        }

        /* ======== SPEAKERS ======== */
        .ev-speaker {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          margin-bottom: 40px;
          padding: 32px;
          background: #FAFAFA;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          transition: box-shadow 0.3s;
        }
        .ev-speaker:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .ev-speaker-img {
          width: 200px;
          height: 240px;
          border-radius: 10px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .ev-speaker-img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .ev-speaker-topic-label {
          display: inline-block;
          padding: 3px 12px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          color: #8B6F00;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .ev-speaker-topic {
          font-size: 20px;
          font-weight: 700;
          color: #111111;
          line-height: 1.3;
          margin-bottom: 12px;
        }
        .ev-speaker-name {
          font-size: 15px;
          font-weight: 600;
          color: #333333;
          margin-bottom: 2px;
        }
        .ev-speaker-role {
          font-size: 13px;
          color: #8A8A8A;
          margin-bottom: 16px;
        }
        .ev-speaker-desc {
          font-size: 14px;
          line-height: 1.7;
          color: #555555;
          margin: 0;
        }
        @media (max-width: 700px) {
          .ev-speaker { grid-template-columns: 1fr; }
          .ev-speaker-img { width: 100%; height: 200px; }
          .ev-speaker-img img { object-fit: cover; }
        }

        /* ======== HIGHLIGHT ======== */
        .ev-highlight {
          margin-top: 32px;
          padding: 28px 32px;
          background: #F8F9FA;
          border-left: 4px solid #F5C518;
          border-radius: 0 10px 10px 0;
        }
        .ev-highlight-title {
          font-size: 18px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 12px;
        }
        .ev-highlight ul {
          padding-left: 20px;
          margin: 12px 0;
        }
        .ev-highlight li {
          font-size: 15px;
          color: #4A4A4A;
          line-height: 1.7;
          margin-bottom: 4px;
        }
        .ev-highlight p {
          font-size: 15px;
          color: #4A4A4A;
          line-height: 1.7;
          margin: 8px 0;
        }
        .ev-highlight strong { color: #111111; }

        /* ======== SIDEBAR ======== */
        .ev-sidebar {
          position: sticky;
          top: 88px;
        }
        .ev-info-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .ev-info-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #E5E7EB;
        }
        .ev-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #F3F4F6;
        }
        .ev-info-item:last-child { border-bottom: none; }
        .ev-info-label {
          font-size: 13px;
          color: #8A8A8A;
        }
        .ev-info-value {
          font-size: 13px;
          font-weight: 600;
          color: #111111;
          text-align: right;
        }
        .ev-status-badge {
          display: inline-block;
          padding: 2px 10px;
          background: #0D0D0D;
          color: #FFFFFF !important;
          border-radius: 9999px;
          font-size: 11px !important;
        }

        /* Sidebar events list */
        .ev-sidebar-event {
          display: block;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          margin-bottom: 8px;
          transition: background 0.2s;
          border: 1px solid transparent;
        }
        .ev-sidebar-event:hover { background: #F8F9FA; }
        .ev-sidebar-event.active {
          background: rgba(245,197,24,0.06);
          border-color: rgba(245,197,24,0.2);
        }
        .ev-sidebar-event-date {
          font-size: 11px;
          font-weight: 600;
          color: #8A8A8A;
          margin-bottom: 2px;
        }
        .ev-sidebar-event-title {
          font-size: 14px;
          font-weight: 600;
          color: #111111;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .ev-sidebar-event-location {
          font-size: 12px;
          color: #8A8A8A;
        }

        /* ======== GALLERY ======== */
        .ev-gallery-section {
          background: #0D0D0D;
          padding: 60px 0 80px;
          position: relative;
        }
        .ev-gallery-wrapper {
          position: relative;
          overflow: hidden;
        }
        .ev-gallery-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0 32px 16px;
          scrollbar-width: none;
        }
        .ev-gallery-track::-webkit-scrollbar { display: none; }
        .ev-gallery-item {
          flex: 0 0 320px;
          height: 220px;
          border-radius: 10px;
          overflow: hidden;
          background: #1A1A2E;
          transition: transform 0.3s;
          cursor: pointer;
        }
        .ev-gallery-item:hover { transform: scale(1.02); }
        .ev-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ev-gallery-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: all 0.2s;
        }
        .ev-gallery-btn:hover {
          background: rgba(245,197,24,0.3);
          border-color: rgba(245,197,24,0.5);
        }
        .ev-gallery-prev { left: 16px; }
        .ev-gallery-next { right: 16px; }

        /* ======== PANEL DISCUSSION ======== */
        .ev-panel-section {
          margin-top: 48px;
          padding: 40px;
          background: #0D0D0D;
          border-radius: 16px;
        }
        .ev-panel-layout {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .ev-panel-title {
          font-size: 26px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .ev-panel-section .ev-section-label {
          color: #D4A800;
        }
        .ev-panel-section .ev-body {
          color: #BBBBBB;
        }
        .ev-panel-topics {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }
        .ev-panel-topic-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #DDDDDD;
        }
        .ev-panel-topic-item svg {
          color: #F5C518;
          flex-shrink: 0;
        }
        .ev-panel-slider-wrap {
          position: relative;
        }
        .ev-panel-slider-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 8px 0;
        }
        .ev-panel-slider-track::-webkit-scrollbar { display: none; }
        .ev-panel-slide {
          flex: 0 0 calc(25% - 12px);
          scroll-snap-align: start;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .ev-panel-slide:hover { transform: scale(1.03); }
        .ev-panel-slide-poster {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 12px;
        }
        .ev-panel-slide-fallback {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }
        .ev-panel-participant-img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 12px;
        }
        .ev-panel-participant-name {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
        }
        .ev-panel-participant-role {
          font-size: 13px;
          color: #999999;
          margin-top: 4px;
        }
        .ev-panel-slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(245,197,24,0.9);
          border: none;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .ev-panel-slider-btn:hover {
          background: #F5C518;
          transform: translateY(-50%) scale(1.1);
        }
        .ev-panel-slider-btn svg { color: #111; }
        .ev-panel-slider-prev { left: -12px; }
        .ev-panel-slider-next { right: -12px; }
        @media (max-width: 768px) {
          .ev-panel-layout { grid-template-columns: 1fr; gap: 32px; }
          .ev-panel-title { font-size: 22px; }
          .ev-panel-section { padding: 24px; }
          .ev-panel-slide { flex: 0 0 200px; }
          .ev-panel-slider-btn { display: flex; }
          .ev-panel-slider-prev { left: -6px; }
          .ev-panel-slider-next { right: -6px; }
        }

        /* ======== BACK BUTTON ======== */
        .ev-btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border: 2px solid #111111;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #111111;
          text-decoration: none;
          transition: all 0.2s;
        }
        .ev-btn-back:hover {
          background: #111111;
          color: #FFFFFF;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
