'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImagePicker from '@/components/admin/ImagePicker';

function slugify(str) {
  return str.toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function NewNewsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', categoryId: '', excerpt: '',
    readingTime: '3 min', source: '',
    tags: '', imageUrl: '', content: '', published: false,
    date: new Date().toISOString().split('T')[0],
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories?type=news').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  function set(key, val) {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'title') next.slug = slugify(val);
      return next;
    });
  }

  async function handleSubmit(e, publish) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      published: publish,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/news');
    else setError('Błąd zapisu. Sprawdź czy slug jest unikalny.');
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '32px' }}>Nowy news</h1>

      <form onSubmit={e => handleSubmit(e, form.published)}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Kategoria *</label>
            <select style={inputStyle} value={form.categoryId} onChange={e => set('categoryId', e.target.value)} required>
              <option value="">Wybierz...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Czas czytania</label>
            <input style={inputStyle} value={form.readingTime} onChange={e => set('readingTime', e.target.value)} placeholder="3 min" />
          </div>
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Excerpt *</label>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.excerpt} onChange={e => set('excerpt', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Źródło (source)</label>
            <input style={inputStyle} value={form.source} onChange={e => set('source', e.target.value)} placeholder="np. TechCrunch" />
          </div>
          <div>
            <label style={labelStyle}>Tagi (rozdzielone przecinkiem)</label>
            <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="AI, GPT, OpenAI" />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Obraz</label>
          <ImagePicker value={form.imageUrl} onChange={v => set('imageUrl', v)}
            contentType="news" slug={form.slug}
            title={form.title} excerpt={form.excerpt} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Treść (Markdown)</label>
          <MarkdownEditor value={form.content} onChange={v => set('content', v)} />
        </div>

        {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={e => handleSubmit(e, false)} disabled={saving} style={{
            padding: '12px 24px', background: '#333', color: '#CCC', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Zapisz szkic
          </button>
          <button type="button" onClick={e => handleSubmit(e, true)} disabled={saving} style={{
            padding: '12px 24px', background: '#F5C518', color: '#111', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {saving ? 'Zapisuję...' : 'Opublikuj'}
          </button>
        </div>
      </form>
    </div>
  );
}
