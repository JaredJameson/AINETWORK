'use client';
import { useState } from 'react';

export default function ImagePicker({ value, onChange, contentType, slug, title, excerpt, category }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!slug) { setError('Najpierw podaj tytuł (slug)'); return; }
    setGenerating(true);
    setError('');
    const res = await fetch('/api/generate/thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, type: contentType, title, excerpt, category }),
    });
    setGenerating(false);
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      setError('Błąd generowania obrazu. Spróbuj ponownie lub wgraj ręcznie.');
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !slug) return;
    const form = new FormData();
    form.append('file', file);
    form.append('type', contentType);
    form.append('slug', slug);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      setError('Błąd uploadu pliku');
    }
  }

  return (
    <div>
      {value && (
        <img src={value} alt="thumbnail" style={{ width: '100%', maxHeight: '160px',
          objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleGenerate} disabled={generating} style={{
          padding: '8px 16px', background: '#F5C518', color: '#111', border: 'none',
          borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: generating ? 'wait' : 'pointer',
          fontFamily: 'inherit',
        }}>
          {generating ? 'Generuję...' : 'Generuj AI'}
        </button>
        <label style={{
          padding: '8px 16px', background: '#222', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px', fontSize: '12px', color: '#CCC', cursor: 'pointer', fontWeight: 600,
        }}>
          Wgraj plik
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload}
            style={{ display: 'none' }} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange('')} style={{
            padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', fontSize: '12px', color: '#888', cursor: 'pointer',
          }}>
            Usuń
          </button>
        )}
      </div>
      {error && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '6px' }}>{error}</div>}
    </div>
  );
}
