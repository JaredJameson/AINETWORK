'use client';

import { useState } from 'react';

export default function CheckInClient({ registration, event }) {
  const [checkedIn, setCheckedIn] = useState(registration.checkedIn);
  const [checkedInAt, setCheckedInAt] = useState(registration.checkedInAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckIn() {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/registrations/${registration.ticketCode}/checkin`, {
      method: 'POST',
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setCheckedIn(true);
      setCheckedInAt(data.registration.checkedInAt);
    } else {
      const data = await res.json();
      setError(data.error || 'Błąd');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: event.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          {event.brand}
        </div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>{event.title}</div>

        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', padding: '32px', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            {registration.firstName} {registration.lastName}
          </div>
          {registration.company && (
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{registration.company}</div>
          )}
          <div style={{ fontSize: '12px', color: '#555' }}>{registration.email}</div>

          <div style={{
            margin: '20px 0', padding: '8px', background: 'rgba(245,197,24,0.1)',
            borderRadius: '6px', fontSize: '18px', fontWeight: 700, color: '#F5C518', letterSpacing: '0.15em',
          }}>
            {registration.ticketCode}
          </div>

          {checkedIn ? (
            <div style={{
              padding: '16px', background: 'rgba(46,204,113,0.1)',
              border: '1px solid rgba(46,204,113,0.25)', borderRadius: '8px',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>&#10003;</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2ECC71' }}>Obecność potwierdzona</div>
              {checkedInAt && (
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  {new Date(checkedInAt).toLocaleString('pl-PL')}
                </div>
              )}
            </div>
          ) : (
            <>
              {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
              <button onClick={handleCheckIn} disabled={loading} style={{
                width: '100%', padding: '16px', background: '#2ECC71', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
              }}>
                {loading ? 'Potwierdzanie...' : 'Potwierdź obecność'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
