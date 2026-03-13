'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegistrationsClient({ event, registrations: initialRegs, totalRegistered }) {
  const [registrations, setRegistrations] = useState(initialRegs);
  const [regOpen, setRegOpen] = useState(event.registrationOpen);

  async function toggleRegistration() {
    const newVal = !regOpen;
    await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationOpen: newVal }),
    });
    setRegOpen(newVal);
  }

  async function handleDelete(regId) {
    if (!confirm('Usunąć rejestrację?')) return;
    const res = await fetch(`/api/events/${event.id}/registrations?regId=${regId}`, { method: 'DELETE' });
    if (res.ok) setRegistrations(prev => prev.filter(r => r.id !== regId));
  }

  async function handleCheckIn(ticketCode, idx) {
    const res = await fetch(`/api/registrations/${ticketCode}/checkin`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setRegistrations(prev => prev.map((r, i) =>
        i === idx ? { ...r, checkedIn: true, checkedInAt: data.registration.checkedInAt } : r
      ));
    }
  }

  function exportCSV() {
    const headers = ['Imię', 'Nazwisko', 'Email', 'Firma', 'Telefon', 'Kod biletu', 'Data rejestracji', 'Check-in'];
    const rows = registrations.map(r => [
      r.firstName, r.lastName, r.email, r.company || '', r.phone || '',
      r.ticketCode, new Date(r.createdAt).toLocaleString('pl-PL'),
      r.checkedIn ? 'Tak' : 'Nie',
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zapisy-${event.title.replace(/[^a-zA-Z0-9]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const thStyle = {
    padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700,
    color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  };
  const tdStyle = {
    padding: '10px 14px', fontSize: '13px', color: '#DDD',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link href={`/admin/events/${event.id}`} style={{ color: '#888', fontSize: '12px', textDecoration: 'none' }}>
            ← Wróć do eventu
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginTop: '8px' }}>
            Zapisy — {event.title}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={exportCSV} style={{
            padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: '#DDD', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Eksport CSV
          </button>
          <button onClick={toggleRegistration} style={{
            padding: '8px 16px', background: regOpen ? 'rgba(231,76,60,0.15)' : 'rgba(46,204,113,0.15)',
            border: 'none', color: regOpen ? '#E74C3C' : '#2ECC71',
            borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {regOpen ? 'Zamknij rejestrację' : 'Otwórz rejestrację'}
          </button>
        </div>
      </div>

      <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
        {event.maxSeats
          ? `${registrations.length} / ${event.maxSeats} miejsc`
          : `${registrations.length} zapisanych`
        }
        {' · '}
        <span style={{ color: regOpen ? '#2ECC71' : '#E74C3C' }}>
          {regOpen ? 'Rejestracja otwarta' : 'Rejestracja zamknięta'}
        </span>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'auto' }}>
        {registrations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Brak zapisów</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Imię</th>
                <th style={thStyle}>Nazwisko</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Firma</th>
                <th style={thStyle}>Telefon</th>
                <th style={thStyle}>Kod</th>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Check-in</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, idx) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.firstName}</td>
                  <td style={tdStyle}>{r.lastName}</td>
                  <td style={tdStyle}>{r.email}</td>
                  <td style={tdStyle}>{r.company || '—'}</td>
                  <td style={tdStyle}>{r.phone || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: '#F5C518', letterSpacing: '0.08em' }}>{r.ticketCode}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: '12px' }}>{new Date(r.createdAt).toLocaleString('pl-PL')}</td>
                  <td style={tdStyle}>
                    {r.checkedIn ? (
                      <span style={{ color: '#2ECC71', fontSize: '12px', fontWeight: 600 }}>
                        &#10003; {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString('pl-PL') : ''}
                      </span>
                    ) : (
                      <button onClick={() => handleCheckIn(r.ticketCode, idx)} style={{
                        padding: '4px 10px', background: 'rgba(46,204,113,0.15)', border: 'none',
                        color: '#2ECC71', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        Check-in
                      </button>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(r.id)} style={{
                      padding: '4px 8px', background: 'transparent', border: '1px solid rgba(231,76,60,0.3)',
                      color: '#E74C3C', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
