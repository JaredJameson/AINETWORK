'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const LocationIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CalendarIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const NetworkingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const SmileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const MONTH_NAMES_PL = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];

function getDateParts(dateStr) {
  const d = new Date(dateStr);
  return {
    day: String(d.getDate()),
    month: MONTH_NAMES_PL[d.getMonth()],
  };
}

export default function WydarzeniaClient({ upcomingEvents, pastEvents }) {
  return (
    <>
      {/* Hero — dark, matching HTML */}
      <section className="wyd-hero">
        <div className="wyd-hero-bg">
          <img src="/assets/images/events/wydarzenia-hero.png" alt="" className="wyd-hero-bg-img" />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="wyd-hero-pills">
              <span className="wyd-hero-pill"><NetworkingIcon /> Networking</span>
              <span className="wyd-hero-pill"><BookIcon /> Wiedza ekspercka</span>
              <span className="wyd-hero-pill"><SmileIcon /> Społeczność</span>
            </div>
            <h1 className="wyd-hero-title">
              Kalendarz <span className="wyd-highlight">wydarzeń</span>
            </h1>
            <p className="wyd-hero-subtitle">
              Warsztaty, meetupy, spotkania networkingowe i konferencje organizowane przez społeczność AI NETWORK.
            </p>
            <a href="#upcoming" className="wyd-btn-primary">
              Zobacz nadchodzące
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="wyd-section-upcoming" id="upcoming">
        <div className="container">
          <div className="wyd-section-label">Nadchodzące</div>
          <div className="wyd-section-title">Najbliższe wydarzenia</div>
          <div className="wyd-section-desc">Zarejestruj się i dołącz do nadchodzących spotkań społeczności AI NETWORK.</div>

          {upcomingEvents.map((ev, i) => {
            const { day, month } = getDateParts(ev.date);
            const image = ev.imageUrl || ev.image;
            const href = ev.href || `/wydarzenia/${ev.slug}`;
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="wyd-upcoming-card">
                  {/* Image side */}
                  <div className="wyd-upcoming-card-img">
                    <div className="wyd-upcoming-card-img-inner" style={{ background: '#f5f5f0' }}>
                      {image && (
                        <img src={image} alt={ev.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    {/* Date badge — top right */}
                    <div className="wyd-upcoming-date" style={{ boxShadow: '0 4px 16px rgba(245,197,24,0.3)' }}>
                      <div className="wyd-upcoming-date-day">{day}</div>
                      <div className="wyd-upcoming-date-month">{month}</div>
                    </div>
                    {/* Category badge — top left */}
                    <div className="wyd-upcoming-category">
                      <span className="wyd-category-badge" style={{
                        background: ev.accent === '#F5C518' ? 'rgba(245,197,24,0.15)' : `${ev.accent}22`,
                        color: ev.accent,
                      }}>
                        {ev.brand}
                      </span>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="wyd-upcoming-card-body">
                    {/* Tag pills — format + location */}
                    <div className="wyd-tag-pills">
                      {ev.format && (
                        <span className="wyd-tag-pill">
                          <CalendarIcon size={13} /> {ev.format}
                        </span>
                      )}
                      <span className="wyd-tag-pill">
                        <LocationIcon size={13} /> {ev.location}{ev.venue ? `, ${ev.venue}` : ''}
                      </span>
                    </div>

                    <h3 className="wyd-upcoming-card-title">{ev.title}</h3>
                    <p className="wyd-upcoming-card-excerpt">{ev.excerpt}</p>

                    {/* Meta row — time + optionally seats */}
                    <div className="wyd-upcoming-card-meta">
                      <span className="wyd-meta-item">
                        <ClockIcon size={15} /> {ev.time}
                      </span>
                      {ev.seats && (
                        <span className="wyd-meta-item">
                          <UsersIcon size={15} /> {ev.seats}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="wyd-upcoming-card-footer">
                      {ev.free && (
                        <span className="wyd-badge-free">
                          <CheckIcon /> Darmowe
                        </span>
                      )}
                      <Link href={href} className="wyd-btn-sm-yellow">
                        Zarejestruj się
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Past Events — light background like HTML */}
      <section className="wyd-section-past" id="past">
        <div className="container">
          <div className="wyd-section-label">Archiwum</div>
          <div className="wyd-section-title">Minione wydarzenia</div>
          <div className="wyd-section-desc">Przeglądaj historię naszych spotkań. Kliknij w kafel, by zobaczyć szczegóły i materiały.</div>

          <div className="wyd-past-grid">
            {pastEvents.map((ev, i) => {
              const { day, month } = getDateParts(ev.date);
              const image = ev.imageUrl || ev.image;
              const href = ev.href || `/wydarzenia/${ev.slug}`;
              const hasPage = ev.href !== null;
              const CardWrapper = hasPage ? Link : 'div';
              const wrapperProps = hasPage
                ? { href, style: { textDecoration: 'none', display: 'block', height: '100%', color: 'inherit' } }
                : { style: { height: '100%' } };

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <CardWrapper {...wrapperProps}>
                    <div className={`wyd-past-card${!hasPage ? ' wyd-past-card-disabled' : ''}`}>
                      {/* Image */}
                      <div className="wyd-past-card-img">
                        <div className="wyd-past-card-img-inner" style={{ background: '#f5f5f0' }}>
                          {image && (
                            <img src={image} alt={ev.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div className="wyd-past-date-badge">
                          <div className="wyd-past-date-day">{day}</div>
                          <div className="wyd-past-date-month">{month}</div>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="wyd-past-card-body">
                        <h4 className="wyd-past-card-title">{ev.title}</h4>
                        {ev.excerpt && (
                          <p className="wyd-past-card-excerpt">{ev.excerpt}</p>
                        )}
                        <div className="wyd-past-card-meta">
                          <span className="wyd-meta-item">
                            <LocationIcon size={13} /> {ev.location}
                          </span>
                        </div>
                        <div className="wyd-past-card-footer">
                          <span className="wyd-badge-completed">Zakończone</span>
                          {hasPage && (
                            <span className="wyd-past-card-link">
                              Szczegóły <ArrowRight size={14} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        /* ============================================
           HERO
           ============================================ */
        .wyd-hero {
          position: relative;
          min-height: 440px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          margin-top: 64px;
        }
        .wyd-hero-bg {
          position: absolute;
          inset: 0;
          background: #0D0D0D;
        }
        .wyd-hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.35;
        }
        .wyd-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.5) 60%, rgba(13,13,13,0.95) 100%);
          pointer-events: none;
        }
        .wyd-hero .container {
          padding-top: 80px;
          padding-bottom: 60px;
        }
        .wyd-hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }
        .wyd-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
          color: #C4C4D4;
          transition: all 0.2s;
        }
        .wyd-hero-pill:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.18);
        }
        .wyd-hero-pill svg { opacity: 0.7; }
        .wyd-hero-title {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #FFFFFF;
          margin-bottom: 16px;
        }
        .wyd-highlight { color: #F5C518; }
        .wyd-hero-subtitle {
          font-size: 17px;
          font-weight: 400;
          color: #C4C4D4;
          max-width: 580px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .wyd-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F5C518;
          color: #111111;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 32px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.25s;
        }
        .wyd-btn-primary:hover {
          background: #FFD84D;
          box-shadow: 0 0 40px rgba(245,197,24,0.15);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .wyd-hero { min-height: 380px; }
          .wyd-hero-title { font-size: 34px; }
          .wyd-hero .container { padding-top: 60px; padding-bottom: 40px; }
        }

        /* ============================================
           SECTION COMMON
           ============================================ */
        .wyd-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #D4A800;
          margin-bottom: 8px;
        }
        .wyd-section-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          color: #111111;
        }
        .wyd-section-desc {
          font-size: 15px;
          color: #4A4A4A;
          margin-bottom: 40px;
          max-width: 520px;
        }

        /* ============================================
           UPCOMING EVENTS
           ============================================ */
        .wyd-section-upcoming {
          background: #FFFFFF;
          padding: 80px 0;
        }

        .wyd-upcoming-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          overflow: hidden;
          background: #FFFFFF;
          transition: all 0.3s;
          position: relative;
          margin-bottom: 24px;
        }
        .wyd-upcoming-card:hover {
          box-shadow: 0 16px 48px rgba(0,0,0,0.16);
          border-color: #F5C518;
        }
        .wyd-upcoming-card:hover .wyd-upcoming-card-body {
          background: #0D0D0D;
        }
        .wyd-upcoming-card:hover .wyd-upcoming-card-title {
          color: #FFFFFF;
        }
        .wyd-upcoming-card:hover .wyd-upcoming-card-excerpt {
          color: #C4C4D4;
        }
        .wyd-upcoming-card:hover .wyd-meta-item {
          color: #8888AA;
        }
        .wyd-upcoming-card:hover .wyd-tag-pill {
          border-color: rgba(255,255,255,0.08);
          color: #C4C4D4;
        }
        .wyd-upcoming-card:hover .wyd-badge-free {
          border-color: transparent;
        }

        .wyd-upcoming-card-img {
          position: relative;
          min-height: 320px;
          overflow: hidden;
        }
        .wyd-upcoming-card-img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wyd-upcoming-card-img-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .wyd-upcoming-date {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #F5C518;
          color: #111111;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: center;
          z-index: 3;
        }
        .wyd-upcoming-date-day {
          font-size: 26px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .wyd-upcoming-date-month {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .wyd-upcoming-category {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 3;
        }
        .wyd-category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .wyd-upcoming-card-body {
          padding: 36px 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: background 0.3s;
        }

        .wyd-tag-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .wyd-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border: 1px solid #E5E7EB;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: #4A4A4A;
          transition: all 0.3s;
        }
        .wyd-tag-pill svg { opacity: 0.5; }

        .wyd-upcoming-card-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.25;
          color: #111111;
          margin-bottom: 12px;
          transition: color 0.3s;
        }
        .wyd-upcoming-card-excerpt {
          font-size: 15px;
          color: #4A4A4A;
          line-height: 1.65;
          margin-bottom: 20px;
          transition: color 0.3s;
        }

        .wyd-upcoming-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 24px;
        }
        .wyd-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #8A8A8A;
          transition: color 0.3s;
        }
        .wyd-meta-item svg { color: #8A8A8A; transition: color 0.3s; }

        .wyd-upcoming-card-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .wyd-badge-free {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(34,197,94,0.1);
          color: #22C55E;
        }
        .wyd-btn-sm-yellow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          background: #F5C518;
          color: #111111;
          text-decoration: none;
          transition: all 0.25s;
        }
        .wyd-btn-sm-yellow:hover {
          background: #FFD84D;
          box-shadow: 0 0 40px rgba(245,197,24,0.15);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .wyd-upcoming-card { grid-template-columns: 1fr; }
          .wyd-upcoming-card-img { min-height: 200px; }
          .wyd-upcoming-card-body { padding: 24px; }
          .wyd-upcoming-card-title { font-size: 22px; }
        }

        /* ============================================
           PAST EVENTS
           ============================================ */
        .wyd-section-past {
          background: #F8F9FA;
          padding: 80px 0 100px;
        }

        .wyd-past-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .wyd-past-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.25s;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .wyd-past-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          border-color: #F5C518;
        }
        .wyd-past-card-disabled {
          cursor: default;
          opacity: 0.6;
        }
        .wyd-past-card-disabled:hover {
          transform: none;
          box-shadow: none;
          border-color: #E5E7EB;
        }

        .wyd-past-card-img {
          height: 160px;
          position: relative;
          overflow: hidden;
        }
        .wyd-past-card-img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wyd-past-card-img-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        .wyd-past-date-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #0D0D0D;
          color: #FFFFFF;
          padding: 6px 10px;
          border-radius: 6px;
          text-align: center;
          z-index: 2;
        }
        .wyd-past-date-day {
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
        }
        .wyd-past-date-month {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #C4C4D4;
        }

        .wyd-past-card-body {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .wyd-past-card-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
          color: #111111;
          margin-bottom: 8px;
        }
        .wyd-past-card-excerpt {
          font-size: 13px;
          color: #4A4A4A;
          line-height: 1.55;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .wyd-past-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wyd-past-card-meta .wyd-meta-item { font-size: 12px; }
        .wyd-past-card-meta .wyd-meta-item svg { width: 13px; height: 13px; }

        .wyd-past-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .wyd-badge-completed {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #0D0D0D;
          color: #FFFFFF;
        }
        .wyd-past-card-link {
          font-size: 13px;
          font-weight: 600;
          color: #3B82F6;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
        }
        .wyd-past-card:hover .wyd-past-card-link { gap: 8px; }

        @media (max-width: 900px) {
          .wyd-past-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wyd-past-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
