'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationForm({ event }) {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/register/${event.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      router.push(`/wydarzenia/${event.slug}/rejestracja/sukces?code=${data.ticketCode}`);
    } else {
      setError(data.error || 'Wystąpił błąd. Spróbuj ponownie.');
    }
  }

  const eventDate = new Date(event.date).toLocaleDateString('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
        <Link href="/wydarzenia" style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '32px' }}>
          ← Wróć do wydarzeń
        </Link>

        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderTop: `3px solid ${event.accent}`, borderRadius: '10px',
          padding: '24px', marginBottom: '32px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: event.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {event.brand}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
            {event.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#888' }}>
            <span>{eventDate}</span>
            <span>{event.time}</span>
            <span>{event.location}, {event.venue}</span>
          </div>
          {event.maxSeats && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: event.registered >= event.maxSeats ? '#E74C3C' : '#2ECC71' }}>
              {event.registered} / {event.maxSeats} miejsc zajętych
            </div>
          )}
        </div>

        {!event.canRegister ? (
          <div style={{
            background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              {event.reason === 'past' && 'Wydarzenie już się odbyło'}
              {event.reason === 'closed' && 'Rejestracja jest zamknięta'}
              {event.reason === 'full' && 'Wszystkie miejsca zajęte'}
            </div>
            <Link href="/wydarzenia" style={{ color: event.accent, fontSize: '13px' }}>
              Zobacz inne wydarzenia →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '32px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
              Formularz rejestracji
            </h2>

            {error && (
              <div style={{
                background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)',
                borderRadius: '8px', padding: '10px 14px', color: '#E74C3C', fontSize: '13px', marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Imię *</label>
                <input required value={form.firstName} onChange={e => set('firstName', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nazwisko *</label>
                <input required value={form.lastName} onChange={e => set('lastName', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email *</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Firma</label>
                <input value={form.company} onChange={e => set('company', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '14px', background: event.accent || '#F5C518',
              color: '#111', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}>
              {saving ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>

            <p style={{ marginTop: '16px', fontSize: '11px', color: '#555', textAlign: 'center' }}>
              Rejestrując się, wyrażasz zgodę na przetwarzanie danych osobowych w celu organizacji wydarzenia.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
