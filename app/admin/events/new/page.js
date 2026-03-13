'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/admin/ImagePicker';

function slugify(str) {
  return str.toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const defaultForm = {
  slug: '', brand: '', title: '', excerpt: '',
  date: new Date().toISOString().split('T')[0], time: '17:00–20:00',
  location: '', venue: '', format: 'Konferencja', maxSeats: '',
  registrationOpen: true, free: true, accent: '#F5C518', imageUrl: '', status: 'upcoming', href: '',
};

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key, val) {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'title') next.slug = slugify(val);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/events');
    else setError('Błąd zapisu. Sprawdź czy slug jest unikalny.');
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '32px' }}>Nowy event</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Tytuł *</label>
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Brand (np. "AI NETWORK vol.5")</label>
            <input style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Akcent (kolor)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={form.accent} onChange={e => set('accent', e.target.value)}
                style={{ width: '44px', height: '44px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={form.accent} onChange={e => set('accent', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Krótki opis *</label>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.excerpt} onChange={e => set('excerpt', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Godzina</label>
            <input style={inputStyle} value={form.time} onChange={e => set('time', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="upcoming">Nadchodzący</option>
              <option value="past">Miniony</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Miasto</label>
            <input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Miejsce/Venue</label>
            <input style={inputStyle} value={form.venue} onChange={e => set('venue', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Format</label>
            <input style={inputStyle} value={form.format} onChange={e => set('format', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Maks. miejsc <span style={{ color: '#555', fontWeight: 400 }}>(puste = bez limitu)</span></label>
            <input type="number" min="1" style={inputStyle} value={form.maxSeats} onChange={e => set('maxSeats', e.target.value)} placeholder="np. 100" />
          </div>
          <div>
            <label style={labelStyle}>Link zewnętrzny (opcjonalny)</label>
            <input style={inputStyle} value={form.href} onChange={e => set('href', e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Obraz</label>
          <ImagePicker value={form.imageUrl} onChange={v => set('imageUrl', v)}
            contentType="events" slug={form.slug}
            title={form.title} excerpt={form.excerpt} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.registrationOpen} onChange={e => set('registrationOpen', e.target.checked)} style={{ accentColor: '#F5C518' }} />
            Rejestracja otwarta
          </label>
        </div>

        {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

        <button type="submit" disabled={saving} style={{
          padding: '12px 32px', background: '#F5C518', color: '#111', border: 'none',
          borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {saving ? 'Zapisuję...' : 'Zapisz event'}
        </button>
      </form>
    </div>
  );
}
