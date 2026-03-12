'use client';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [sources, setSources] = useState([]);
  const [form, setForm] = useState({ url: '', name: '' });
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  async function loadSources() {
    const res = await fetch('/api/scan-sources');
    const data = await res.json();
    setSources(Array.isArray(data) ? data : []);
  }

  useEffect(() => { loadSources(); }, []);

  async function handleAddSource(e) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/scan-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm({ url: '', name: '' });
    loadSources();
  }

  async function handleDeleteSource(id) {
    if (!confirm('Usunąć źródło?')) return;
    await fetch(`/api/scan-sources?id=${id}`, { method: 'DELETE' });
    loadSources();
  }

  async function handleRunScan() {
    setScanning(true);
    setScanResult(null);
    const res = await fetch('/api/scan', { method: 'POST' });
    const data = await res.json();
    setScanResult(data);
    setScanning(false);
  }

  const inputStyle = {
    padding: '10px 14px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontSize: '14px', fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '32px' }}>Ustawienia</h1>

      {/* Scanner section */}
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Skaner newsów</h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
          Automatyczne skanowanie co poniedziałek i czwartek o 8:00. Możesz też uruchomić ręcznie.
        </p>

        <button onClick={handleRunScan} disabled={scanning} style={{
          padding: '10px 24px', background: '#F5C518', color: '#111', border: 'none',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700,
          cursor: scanning ? 'wait' : 'pointer', fontFamily: 'inherit',
          marginBottom: scanResult ? '16px' : 0,
        }}>
          {scanning ? 'Skanowanie...' : 'Uruchom skan teraz'}
        </button>

        {scanResult && (
          <div style={{
            padding: '12px 16px', background: 'rgba(46,204,113,0.1)',
            border: '1px solid rgba(46,204,113,0.25)', borderRadius: '8px',
            color: '#2ECC71', fontSize: '13px',
          }}>
            Skan zakończony: {scanResult.drafts} nowych propozycji z {scanResult.scanned} źródeł
          </div>
        )}
      </div>

      {/* Sources */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>Źródła skanowania</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {sources.length === 0 && (
            <div style={{ color: '#555', fontSize: '13px', padding: '16px 0' }}>
              Brak skonfigurowanych źródeł. Dodaj poniżej.
            </div>
          )}
          {sources.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', background: '#1A1A1A',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#DDD', fontSize: '13px', fontWeight: 600 }}>{s.name}</div>
                <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>{s.url}</div>
              </div>
              {s.lastScannedAt && (
                <span style={{ color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  Ostatni skan: {new Date(s.lastScannedAt).toLocaleDateString('pl-PL')}
                </span>
              )}
              <button onClick={() => handleDeleteSource(s.id)} style={{
                background: 'transparent', border: 'none', color: '#E74C3C',
                cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
              }}>Usuń</button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddSource} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            placeholder="Nazwa źródła (np. TechCrunch AI)"
            style={{ ...inputStyle, flex: '1', minWidth: '180px' }}
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
          />
          <input
            placeholder="URL (np. https://techcrunch.com/category/artificial-intelligence/)"
            style={{ ...inputStyle, flex: '2', minWidth: '200px' }}
            value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required
            type="url"
          />
          <button type="submit" disabled={saving} style={{
            padding: '10px 20px', background: '#F5C518', color: '#111', border: 'none',
            borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {saving ? 'Dodaję...' : 'Dodaj źródło'}
          </button>
        </form>
      </div>

      {/* API Keys info */}
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>Klucze API</h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
          Klucze API są konfigurowane przez zmienne środowiskowe w pliku <code style={{ color: '#F5C518' }}>.env</code>.
        </p>
        {[
          { label: 'ANTHROPIC_API_KEY', env: process.env.NEXT_PUBLIC_BASE_URL ? 'Skonfigurowany' : 'Sprawdź .env' },
          { label: 'GEMINI_API_KEY', env: 'Sprawdź .env' },
          { label: 'JWT_SECRET', env: 'Skonfigurowany' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            fontSize: '13px',
          }}>
            <code style={{ color: '#DDD', fontFamily: 'monospace' }}>{item.label}</code>
            <span style={{ color: '#888' }}>{item.env}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
