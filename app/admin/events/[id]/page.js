'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImagePicker from '@/components/admin/ImagePicker';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(ev => {
        setForm({
          slug: ev.slug,
          brand: ev.brand,
          title: ev.title,
          excerpt: ev.excerpt,
          date: ev.date ? ev.date.split('T')[0] : '',
          time: ev.time,
          location: ev.location,
          venue: ev.venue,
          format: ev.format,
          seats: ev.seats,
          free: ev.free,
          accent: ev.accent || '#F5C518',
          imageUrl: ev.imageUrl || '',
          status: ev.status,
          href: ev.href || '',
        });
      })
      .catch(() => setError('Błąd ładowania eventu'));
  }, [id]);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/events');
    else setError('Błąd zapisu. Sprawdź czy slug jest unikalny.');
  }

  async function handleDelete() {
    if (!confirm('Usunąć event? Tej operacji nie można cofnąć.')) return;
    setDeleting(true);
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    router.push('/admin/events');
  }

  if (!form) return <div style={{ color: '#888', padding: '40px' }}>Ładowanie...</div>;

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>Edytuj event</h1>
        <button onClick={handleDelete} disabled={deleting} style={{
          padding: '8px 16px', background: 'transparent', border: '1px solid rgba(231,76,60,0.4)',
          color: '#E74C3C', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {deleting ? 'Usuwam...' : 'Usuń event'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Tytuł *</label>
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Brand (np. "AI NETWORK vol.5")</label>
          <input style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} />
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
        <label style={labelStyle}>Krótki opis</label>
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
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
          <label style={labelStyle}>Miejsca</label>
          <input style={inputStyle} value={form.seats} onChange={e => set('seats', e.target.value)} />
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

      {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

      <button type="button" onClick={handleSave} disabled={saving} style={{
        padding: '12px 32px', background: '#F5C518', color: '#111', border: 'none',
        borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        {saving ? 'Zapisuję...' : 'Zapisz zmiany'}
      </button>
    </div>
  );
}
