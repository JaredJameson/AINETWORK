'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImagePicker from '@/components/admin/ImagePicker';

function slugify(str) {
  return str.toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/articles/${id}`).then(r => r.json()),
      fetch('/api/categories?type=article').then(r => r.json()),
      fetch('/api/articles?type=pillar').then(r => r.json()),
    ]).then(([article, cats, pils]) => {
      setForm({
        type: article.type,
        title: article.title,
        slug: article.slug,
        categoryId: article.categoryId,
        pillarId: article.pillarId || '',
        excerpt: article.excerpt,
        readingTime: article.readingTime,
        date: article.date ? article.date.split('T')[0] : '',
        imageUrl: article.imageUrl || '',
        content: article.content,
        published: article.published,
      });
      setCategories(cats);
      setPillars(pils.filter(p => p.id !== id));
    }).catch(e => setError('Błąd ładowania artykułu'));
  }, [id]);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function generateMeta() {
    if (!form?.title || !form?.content) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({ ...f, excerpt: data.excerpt || f.excerpt, readingTime: data.readingTime || f.readingTime }));
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave(publish) {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, published: publish }),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/articles');
    else setError('Błąd zapisu');
  }

  async function handleDelete() {
    if (!confirm('Usunąć artykuł? Tej operacji nie można cofnąć.')) return;
    setDeleting(true);
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    router.push('/admin/articles');
  }

  if (!form) return <div style={{ color: '#888', padding: '40px' }}>Ładowanie...</div>;

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#111',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontFamily: 'inherit',
    boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>Edytuj artykuł</h1>
        <button onClick={handleDelete} disabled={deleting} style={{
          padding: '8px 16px', background: 'transparent', border: '1px solid rgba(231,76,60,0.4)',
          color: '#E74C3C', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {deleting ? 'Usuwam...' : 'Usuń artykuł'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['pillar', 'cluster'].map(t => (
          <button key={t} type="button" onClick={() => set('type', t)} style={{
            padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
            fontFamily: 'inherit', cursor: 'pointer',
            background: form.type === t ? '#F5C518' : '#222',
            color: form.type === t ? '#111' : '#888',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {t === 'pillar' ? 'Filar wiedzy' : 'Artykuł cluster'}
          </button>
        ))}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Kategoria</label>
          <select style={inputStyle} value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        {form.type === 'cluster' && (
          <div>
            <label style={labelStyle}>Filar nadrzędny</label>
            <select style={inputStyle} value={form.pillarId} onChange={e => set('pillarId', e.target.value)}>
              <option value="">Brak</option>
              {pillars.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        )}
        <div>
          <label style={labelStyle}>Data</label>
          <input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', marginBottom: '16px', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Excerpt</label>
            <button type="button" onClick={generateMeta} disabled={generating} style={{
              fontSize: '11px', background: 'transparent', border: 'none',
              color: '#F5C518', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {generating ? 'Generuję...' : 'Generuj przez Claude'}
            </button>
          </div>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </div>
        <div style={{ minWidth: '120px' }}>
          <label style={labelStyle}>Czas czytania</label>
          <input style={inputStyle} value={form.readingTime} onChange={e => set('readingTime', e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Obraz</label>
        <ImagePicker value={form.imageUrl} onChange={v => set('imageUrl', v)}
          contentType="articles" slug={form.slug}
          title={form.title} excerpt={form.excerpt} />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Treść (Markdown)</label>
        <MarkdownEditor value={form.content} onChange={v => set('content', v)} />
      </div>

      {error && <div style={{ color: '#E74C3C', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="button" onClick={() => handleSave(false)} disabled={saving} style={{
          padding: '12px 24px', background: '#333', color: '#CCC', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Zapisz szkic
        </button>
        <button type="button" onClick={() => handleSave(true)} disabled={saving} style={{
          padding: '12px 24px', background: '#F5C518', color: '#111', border: 'none',
          borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {saving ? 'Zapisuję...' : 'Opublikuj'}
        </button>
      </div>
    </div>
  );
}
