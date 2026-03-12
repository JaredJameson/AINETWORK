'use client';

import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

/* ─── Animation helpers ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function Reveal({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] } } }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function RevealList({ children, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Icons ────────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const FormatIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const SeatsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ─── Homepage ────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <EventsSection />
      <BenefitsSection />
      <KnowledgeSection />
      <CtaSection />
      <NewsletterSection />
    </>
  );
}

/* ─── HERO (white background) ─────────────────────────────── */
function HeroSection() {
  return (
    <section style={{
      padding: '140px 0 80px',
      background: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Subtle glow */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }} className="hero-grid">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{
                fontSize: '44px',
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                marginBottom: '8px',
                color: '#111111',
              }}
            >
              Platforma transferu wiedzy<br />
              i budowy{' '}
              <span style={{
                background: 'var(--yellow)',
                color: '#111111',
                padding: '0 8px',
                display: 'inline',
              }}>
                kompetencji AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: '20px',
                fontWeight: 500,
                color: '#555555',
                lineHeight: 1.4,
                marginBottom: '32px',
                maxWidth: '480px',
              }}
            >
              Integrujemy ludzi z różnych branż wokół praktycznych wdrożeń sztucznej inteligencji.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}
            >
              <Link href="/#events" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Zobacz kalendarz wydarzeń <ArrowRight />
              </Link>
              <Link href="/#about" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px',
                borderRadius: '100px',
                fontSize: '13px', fontWeight: 700,
                border: '1.5px solid #E5E5E5',
                color: '#111111',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}>
                Dowiedz się więcej
              </Link>
            </motion.div>

          </motion.div>

          {/* Right — Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: '100%',
              height: '420px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/hero.png"
              alt="AI robot czytający książkę"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
            {/* Fade-out bottom + soft edges */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent 55%, #FFFFFF 95%)',
            }} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── PHILOSOPHY (light gray #F5F5F5, dark cards inside) ─── */
function PhilosophySection() {
  const cards = [
    {
      num: '01',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
      title: 'Technologia w służbie biznesu',
      text: 'AI NETWORK opiera się na pragmatycznym podejściu — sztuczna inteligencja jest narzędziem rozwiązywania realnych problemów biznesowych, nie celem samym w sobie. Każde wdrożenie AI powinno odpowiadać na konkretne wyzwanie i dostarczać wymiernych korzyści.',
    },
    {
      num: '02',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
      title: 'Niezależność technologiczna',
      text: 'Propagujemy podejście oparte na budowie własnych systemów AI, zapewniających pełną kontrolę nad danymi, procesami i kierunkami rozwoju. To strategiczna niezależność od globalnych dostawców i wolność w kształtowaniu narzędzi pod unikalne wyzwania biznesowe.',
    },
    {
      num: '03',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
      title: 'Synteza wiedzy i technologii',
      text: 'Prawdziwa wartość powstaje na przecięciu głębokiej znajomości branży i innowacyjnych technologii. Narzędzia AI nie zastępują ekspertów — wzmacniają ich możliwości i pozwalają skupić się na zadaniach wymagających kreatywności i strategicznego myślenia.',
    },
  ];

  return (
    <section id="about" style={{ padding: '100px 0', background: '#F5F5F5' }}>
      <div className="container">
        <Reveal style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 48px' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: 'var(--yellow)',
            textTransform: 'uppercase',
          }}>
            Nasza filozofia
          </h2>
        </Reveal>

        <RevealList style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cards.map((card) => (
            <motion.div
              key={card.num}
              variants={fadeUp}
              style={{
                background: '#0D0D0D',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: '4px solid var(--yellow)',
                borderRadius: '12px',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(245,197,24,0.08)', transition: { duration: 0.25 } }}
            >
              <div style={{
                position: 'absolute', top: '50%', right: '24px',
                transform: 'translateY(-50%)',
                fontSize: '100px', fontWeight: 800,
                color: 'rgba(245,197,24,0.07)',
                lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
              }}>
                {card.num}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ color: 'var(--yellow)', flexShrink: 0 }}>{card.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--yellow)' }}>{card.title}</h3>
              </div>
              <p style={{ fontSize: '15px', color: '#BBBBBB', lineHeight: 1.7, maxWidth: '780px' }}>
                {card.text}
              </p>
            </motion.div>
          ))}
        </RevealList>
      </div>
    </section>
  );
}

/* ─── EVENTS (white #FFFFFF, dark card banners) ───────────── */
function EventsSection() {
  const events = [
    {
      brand: 'AI NETWORK vol.4',
      title: 'Praktyczne wdrożenia AI w biznesie',
      day: '10', month: 'APR',
      location: 'Bydgoszcz', format: 'Konferencja', seats: '100 miejsc',
      accent: 'var(--yellow)',
      href: '/wydarzenia/an4',
    },
    {
      brand: 'AI NETWORK EDU',
      title: 'AI w Edukacji — Praktyczny Warsztat dla Nauczycieli',
      day: '30', month: 'APR',
      location: 'Bydgoszcz WSB Merito', format: 'Warsztat', seats: 'Darmowe',
      accent: '#2ECC71',
      href: 'https://edu.ainetwork.pl',
    },
    {
      brand: 'AI NETWORK PLASTICS',
      title: 'AI w przetwórstwie tworzyw sztucznych',
      day: '21', month: 'MAJ',
      location: 'Kielce PLASTPOL', format: 'Konferencja', seats: '80 miejsc',
      accent: '#5B8DEF',
      href: 'https://plastics.ainetwork.pl',
    },
  ];

  return (
    <section id="events" style={{ padding: '100px 0', background: '#FFFFFF' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
          <Reveal>
            <div className="sec-label">Nadchodzące</div>
            <h2 className="sec-title" style={{ color: '#111111' }}>Kalendarz wydarzeń</h2>
            <div className="yellow-line" />
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="/wydarzenia" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '100px',
              fontSize: '13px', fontWeight: 700,
              border: '1.5px solid #E5E5E5',
              color: '#111111', textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}>
              Wszystkie wydarzenia <ArrowRight />
            </Link>
          </Reveal>
        </div>

        <RevealList style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="events-grid">
          {events.map((ev) => (
            <motion.div
              key={ev.title}
              variants={fadeUp}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              whileHover={{ y: -4, borderColor: 'var(--yellow)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transition: { duration: 0.25 } }}
            >
              {/* Banner (dark) */}
              <div style={{
                background: '#111111',
                borderBottom: '1px solid #E5E5E5',
                padding: '24px 16px 16px',
                position: 'relative',
                minHeight: '140px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '3px', background: ev.accent,
                }} />
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: ev.accent, color: '#111111',
                  padding: '6px 10px', borderRadius: '6px',
                  textAlign: 'center', fontWeight: 700, lineHeight: 1,
                }}>
                  <div style={{ fontSize: '20px' }}>{ev.day}</div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{ev.month}</div>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: ev.accent, marginBottom: '6px' }}>
                  {ev.brand}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                  {ev.title}
                </div>
              </div>

              {/* Body (light) */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#999999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <LocationIcon /> {ev.location}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FormatIcon /> {ev.format}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <SeatsIcon /> {ev.seats}
                  </span>
                </div>
                <Link href={ev.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', fontWeight: 700, color: 'var(--yellow)',
                  textDecoration: 'none',
                }}>
                  Szczegóły i rejestracja <ArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </RevealList>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .events-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 560px) and (max-width: 900px) {
          .events-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── BENEFITS (dark, editorial, alternating image+text rows) */
function BenefitsSection() {
  const benefits = [
    {
      num: '01',
      title: 'Praktyczna wiedza od razu do użycia',
      desc: 'Konkretne narzędzia i strategie wdrożeń AI, które zastosujesz w firmie od pierwszego dnia. Żadnej teorii bez pokrycia — każdy temat kończy się action planem.',
      image: '/assets/images/benefits/knowledge.png',
    },
    {
      num: '02',
      title: 'Networking i wymiana doświadczeń',
      desc: 'Relacje biznesowe i dostęp do doświadczeń praktyków AI z różnych branż. Dołączasz do społeczności ludzi, którzy już wdrażają AI w swoich firmach.',
      image: '/assets/images/benefits/networking.png',
    },
    {
      num: '03',
      title: 'Customowe narzędzia AI',
      desc: 'Pokazujemy jak budować własne rozwiązania AI dopasowane do realnych potrzeb — od pomysłu po wdrożenie. Nie gotowe produkty, a umiejętność tworzenia.',
      image: '/assets/images/benefits/tools.png',
    },
    {
      num: '04',
      title: 'Case studies i inspiracje',
      desc: 'Dowiesz się jak firmy z różnych branż skutecznie wdrażają AI i osiągają wymierne rezultaty. Prawdziwe wdrożenia, prawdziwe liczby.',
      image: '/assets/images/benefits/casestudies.png',
    },
  ];

  return (
    <section style={{ padding: '100px 0', background: '#0D0D0D' }}>
      <div className="container">
        <Reveal style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
          <div className="sec-label">Dlaczego warto</div>
          <h2 className="sec-title">Co zyskasz, dołączając do wydarzeń AI NETWORK?</h2>
          <div className="yellow-line" style={{ margin: '16px auto 0' }} />
        </Reveal>

        <div className="benefits-rows">
          {benefits.map((b, i) => {
            const isReversed = i % 2 === 1;
            return (
              <Reveal key={b.num}>
                <div className="benefit-row">
                  {/* Image side */}
                  <motion.div
                    className="benefit-image-wrap"
                    style={isReversed ? { order: 2 } : {}}
                    whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: '#111',
                    }}>
                      <img
                        src={b.image}
                        alt={b.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(245,197,24,0.08) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }} />
                    </div>
                  </motion.div>

                  {/* Text side */}
                  <div className="benefit-text-side" style={isReversed ? { order: 1 } : {}}>
                    <span style={{
                      fontFamily: 'var(--font-main)',
                      fontSize: 'clamp(48px, 6vw, 72px)',
                      fontWeight: 800,
                      color: 'rgba(245,197,24,0.12)',
                      lineHeight: 1,
                      display: 'block',
                      marginBottom: '12px',
                      userSelect: 'none',
                    }}>
                      {b.num}
                    </span>
                    <h3 style={{
                      fontSize: 'clamp(20px, 2.5vw, 26px)',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      marginBottom: '16px',
                    }}>
                      {b.title}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.7,
                      maxWidth: '440px',
                    }}>
                      {b.desc}
                    </p>
                    <div style={{
                      width: '40px',
                      height: '3px',
                      background: 'var(--yellow)',
                      borderRadius: '2px',
                      marginTop: '20px',
                    }} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        .benefits-rows {
          display: flex;
          flex-direction: column;
          gap: 64px;
        }
        .benefit-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .benefit-image-wrap {
          width: 100%;
        }
        .benefit-text-side {
          padding: 16px 0;
        }
        @media (max-width: 768px) {
          .benefit-row {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .benefit-row > * {
            order: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── KNOWLEDGE (white #FFFFFF, white cards with border) ─── */
function KnowledgeSection() {
  const articles = [
    {
      category: 'AI w marketingu',
      title: 'AI Content Marketing — kompletny przewodnik',
      excerpt: 'Jak tworzyć treści, które konwertują, z pomocą narzędzi AI. Od strategii po dystrybucję.',
      time: '18 min', date: 'mar 2026', href: '/artykul/ai-content-marketing-kompletny-przewodnik',
      thumb: '/assets/images/articles/pillar-content-marketing.png',
    },
    {
      category: 'AI w strategii',
      title: 'AI w Strategii Biznesowej — Przewodnik Wdrożenia',
      excerpt: 'Strategiczny przewodnik wdrażania AI w firmie — od wyboru narzędzi przez politykę AI po mierzenie ROI.',
      time: '17 min', date: 'mar 2026', href: '/artykul/ai-w-biznesie-strategia-wdrozenia',
      thumb: '/assets/images/articles/pillar-business-strategy.png',
    },
    {
      category: 'Narzędzia i modele',
      title: 'Fundamenty AI — Modele, Narzędzia i Prompty',
      excerpt: 'Kompletny przegląd modeli AI, narzędzi i technik prompt engineeringu. Od GPT-5 przez Claude po Gemini.',
      time: '20 min', date: 'mar 2026', href: '/artykul/fundamenty-ai-modele-narzedzia-prompty',
      thumb: '/assets/images/articles/pillar-tools-models.png',
    },
  ];

  const categories = ['Wszystkie', 'AI w marketingu', 'AI dla zarządu', 'Sprzedaż B2B', 'Narzędzia AI', 'Prompty'];

  return (
    <section id="knowledge" style={{ padding: '100px 0', background: '#FFFFFF' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '24px' }}>
          <Reveal>
            <div className="sec-label">Baza wiedzy</div>
            <h2 className="sec-title" style={{ color: '#111111' }}>Materiały, które pomagają wdrażać AI</h2>
            <div className="yellow-line" />
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="/baza-wiedzy" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '100px',
              fontSize: '13px', fontWeight: 700,
              border: '1.5px solid #E5E5E5',
              color: '#111111', textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}>
              Wszystkie materiały <ArrowRight />
            </Link>
          </Reveal>
        </div>

        {/* Category tabs */}
        <Reveal style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {categories.map((cat, i) => (
            <span
              key={cat}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '5px 14px',
                borderRadius: '100px',
                fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.04em',
                background: i === 0 ? 'var(--yellow)' : '#F0F0F0',
                color: i === 0 ? '#111111' : '#555555',
                border: i === 0 ? 'none' : '1px solid #E5E5E5',
                cursor: 'pointer',
              }}
            >
              {cat}
            </span>
          ))}
        </Reveal>

        <RevealList style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="knowledge-grid">
          {articles.map((art) => (
            <motion.div key={art.title} variants={fadeUp}>
              <Link href={art.href} style={{ textDecoration: 'none', display: 'block' }}>
                <motion.div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                  whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', borderColor: 'var(--yellow)', transition: { duration: 0.25 } }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    height: '180px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <img
                      src={art.thumb}
                      alt={art.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: '#111111', marginBottom: '8px',
                    }}>
                      {art.category}
                    </div>
                    <h3 style={{
                      fontSize: '17px', fontWeight: 700,
                      lineHeight: 1.3, marginBottom: '10px',
                      color: '#111111',
                    }}>
                      {art.title}
                    </h3>
                    <p style={{
                      fontSize: '14px', color: '#555555',
                      lineHeight: 1.6,
                    }}>
                      {art.excerpt}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </RevealList>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .knowledge-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .knowledge-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── CTA (dark #0D0D0D) ──────────────────────────────────── */
function CtaSection() {
  return (
    <section style={{ padding: '100px 0', background: '#0D0D0D' }}>
      <div className="container">
        <Reveal>
          <div style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, rgba(245,197,24,0.05) 100%)',
            border: '1px solid rgba(245,197,24,0.15)',
            borderRadius: '24px',
            padding: '80px 64px',
            display: 'flex',
            gap: '64px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Wspólnie budujemy przyszłość biznesu, w której{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #FFD84D 0%, #F5C518 60%, #D4A800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>AI staje się kluczem</span>
              </h2>
              <p style={{ fontSize: '16px', color: '#BBBBBB', lineHeight: 1.7, marginBottom: '32px' }}>
                Dołącz do platformy, która nie tylko mówi o AI — ale ją wdraża. Wydarzenie po wydarzeniu, narzędzie po narzędziu, branża po branży.
              </p>
              <Link href="/#events" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Zarejestruj się na kolejne wydarzenie <ArrowRight />
              </Link>
            </div>
            <div style={{
              width: '240px', height: '240px',
              background: 'rgba(245,197,24,0.07)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(245,197,24,0.15)',
            }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── NEWSLETTER (dark) ───────────────────────────────────── */
function NewsletterSection() {
  return (
    <section id="newsletter" style={{ padding: '80px 0', background: '#070707', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <Reveal>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px',
          }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div className="sec-label">Newsletter</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#FFFFFF' }}>Bądź na bieżąco z AI</h3>
              <p style={{ color: '#AAAAAA', fontSize: '15px' }}>
                Cotygodniowy przegląd najważniejszych nowości ze świata AI w biznesie.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Twój adres email"
                style={{
                  padding: '13px 20px',
                  background: '#222222',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  width: '280px',
                  maxWidth: '100%',
                }}
              />
              <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Zapisz się <ArrowRight />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
