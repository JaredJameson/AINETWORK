'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Nieprawidłowy email lub hasło');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0D0D0D', fontFamily: 'Montserrat, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '360px', background: '#1A1A1A',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '40px',
      }}>
        <div style={{ color: '#F5C518', fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>
          AI NETWORK
        </div>
        <div style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Panel administracyjny</div>

        {error && (
          <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)',
            borderRadius: '8px', padding: '10px 14px', color: '#E74C3C', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' }}>
          Email
        </label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)} required
          style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: '#fff', fontSize: '14px', fontFamily: 'inherit',
            marginBottom: '16px', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '6px' }}>
          Hasło
        </label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)} required
          style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: '#fff', fontSize: '14px', fontFamily: 'inherit',
            marginBottom: '24px', boxSizing: 'border-box' }}
        />

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px', background: '#F5C518', color: '#111',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
        }}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  );
}
