'use client';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ label: '', color: '#5B8DEF', type: 'article' });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    const key = form.label.toLowerCase()
      .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
      .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
      .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, key }),
    });
    setSaving(false);
    setForm({ label: '', color: '#5B8DEF', type: 'article' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Usunąć kategorię? Artykuły tej kategorii stracą przypisanie.')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    load();
  }

  const articleCats = categories.filter(c => c.type === 'article');
  const newsCats = categories.filter(c => c.type === 'news');

  function CatList({ cats }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {cats.map(c => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', background: '#1A1A1A',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
          }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: c.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: '#DDD', fontSize: '13px' }}>{c.label}</span>
            <span style={{ color: '#555', fontSize: '11px' }}>{c.key}</span>
            <button onClick={() => handleDelete(c.id)} style={{
              background: 'transparent', border: 'none', color: '#E74C3C',
              cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
            }}>Usuń</button>
          </div>
        ))}
      </div>
    );
  }

  const inputStyle = {
    padding: '8px 12px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px', color: '#fff', fontSize: '13px', fontFamily: 'inherit',
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '32px' }}>Kategorie</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Artykuły ({articleCats.length})
          </h2>
          <CatList cats={articleCats} />
        </div>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI News ({newsCats.length})
          </h2>
          <CatList cats={newsCats} />
        </div>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>Dodaj kategorię</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <input placeholder="Nazwa kategorii" style={inputStyle} value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
        <input type="color" value={form.color}
          onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
          style={{ width: '44px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
        <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="article">Artykuły</option>
          <option value="news">AI News</option>
        </select>
        <button type="submit" disabled={saving} style={{
          padding: '8px 20px', background: '#F5C518', color: '#111',
          border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {saving ? 'Dodaję...' : 'Dodaj'}
        </button>
      </form>
    </div>
  );
}
