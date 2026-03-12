'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DraftsClient({ initialDrafts }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [generating, setGenerating] = useState(null); // draft id
  const [streamText, setStreamText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function handleGenerate(draft) {
    setGenerating(draft.id);
    setStreamText('');
    setShowModal(true);

    const res = await fetch(`/api/news/drafts/${draft.id}/generate`, { method: 'POST' });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let newsId = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) setStreamText(t => t + data.text);
            if (data.done) newsId = data.newsId;
            if (data.error) {
              setStreamText(t => t + '\n\n[Błąd: ' + data.error + ']');
            }
          } catch {}
        }
      }
    }

    setGenerating(null);
    setDrafts(d => d.filter(x => x.id !== draft.id));

    if (newsId) {
      setTimeout(() => {
        setShowModal(false);
        router.push(`/admin/news/${newsId}`);
      }, 1500);
    }
  }

  async function handleReject(id) {
    await fetch(`/api/news/drafts/${id}/reject`, { method: 'POST' });
    setDrafts(d => d.filter(x => x.id !== id));
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Propozycje artykułów</h1>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>
        Tematy wykryte przez skaner newsów — wybierz które chcesz rozwinąć w artykuł.
      </p>

      {drafts.length === 0 && (
        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '48px', textAlign: 'center', color: '#555',
        }}>
          Brak propozycji. Uruchom skaner w Ustawieniach lub poczekaj na zaplanowane skanowanie (pon/czw 8:00).
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {drafts.map(draft => (
          <div key={draft.id} style={{
            background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px', background: 'rgba(245,197,24,0.1)',
                    border: '1px solid rgba(245,197,24,0.2)', borderRadius: '4px',
                    fontSize: '10px', fontWeight: 700, color: '#F5C518',
                  }}>
                    {draft.sourceName || 'Źródło nieznane'}
                  </span>
                  <span style={{ color: '#555', fontSize: '11px' }}>
                    {new Date(draft.scannedAt).toLocaleDateString('pl-PL')}
                  </span>
                </div>
                <h3 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>
                  {draft.title}
                </h3>
                <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {draft.summary}
                </p>
                {draft.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {draft.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '2px 8px', background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px', fontSize: '10px', color: '#888',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => handleGenerate(draft)}
                  disabled={!!generating}
                  style={{
                    padding: '8px 16px', background: '#F5C518', color: '#111', border: 'none',
                    borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                    cursor: generating ? 'wait' : 'pointer', fontFamily: 'inherit',
                  }}>
                  {generating === draft.id ? 'Generuję...' : 'Generuj artykuł'}
                </button>
                <button
                  onClick={() => handleReject(draft.id)}
                  disabled={!!generating}
                  style={{
                    padding: '8px 12px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px', fontSize: '12px', color: '#888',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  Odrzuć
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generation modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px',
        }}>
          <div style={{
            background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px', padding: '32px', maxWidth: '700px', width: '100%',
            maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ color: '#F5C518', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
              {generating ? 'Claude pisze artykuł...' : 'Artykuł wygenerowany!'}
            </div>
            <pre style={{
              flex: 1, overflow: 'auto', background: '#111', padding: '16px',
              borderRadius: '8px', color: '#CCC', fontSize: '13px',
              fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>
              {streamText || 'Inicjalizacja...'}
            </pre>
            {!generating && (
              <button onClick={() => setShowModal(false)} style={{
                marginTop: '16px', padding: '10px', background: '#F5C518', color: '#111',
                border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Przejdź do edycji
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
