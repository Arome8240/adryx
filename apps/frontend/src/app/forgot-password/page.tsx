'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Brand logo ───────────────────────────────────────────────────── */
function BrandLogo() {
  return (
    <Link href="/" className="brand" style={{ display: 'inline-flex' }}>
      <span className="mark mark-acc" />
      Adryx
    </Link>
  );
}

/* ─── Right panel ──────────────────────────────────────────────────── */
function RightPanel() {
  return (
    <div style={{
      background: 'var(--c-fg)', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '56px 48px',
      minHeight: '100vh', position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 260, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(37,99,235,.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 320 }}>
        {/* Mail icon card */}
        <div style={{
          background: '#fff', border: '1px solid var(--c-line)', borderRadius: 14,
          padding: '32px 28px', marginBottom: 24, boxShadow: '0 12px 36px -8px rgba(15,15,20,.12)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'var(--c-acc-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', color: 'var(--c-acc)',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 7h20v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 7l10 9 10-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="t-h3" style={{ marginBottom: 8, color: 'var(--c-fg)' }}>Reset link, sent in seconds</h3>
          <p className="t-sm" style={{ color: 'var(--c-fg-3)' }}>
            Enter your email and we'll send you a secure link to reset your password instantly.
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)' }}>
          Links expire in 30 minutes. Check your spam folder if you don't see it.
        </p>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Request failed');
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* ── Left ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px', background: '#fff' }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}><BrandLogo /></div>

          {sent ? (
            /* ── Sent state ── */
            <div className="col" style={{ alignItems: 'center', textAlign: 'center', gap: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--c-ok-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" stroke="var(--c-ok)" strokeWidth="1.6" />
                  <path d="M8.5 14l4 4 7-7" stroke="var(--c-ok)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="t-h1">Check your inbox</h1>
              <p className="t-body muted" style={{ maxWidth: 320 }}>
                We sent a reset link to <strong style={{ color: 'var(--c-fg)' }}>{email}</strong>.
                It expires in 30 minutes.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                Back to sign in
              </button>
              <button
                type="button"
                onClick={() => { setSent(false); setEmail(''); }}
                className="t-sm"
                style={{ background: 'none', border: 'none', color: 'var(--c-fg-4)', cursor: 'pointer' }}
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* ── Initial form ── */
            <>
              <h1 className="t-h1" style={{ marginBottom: 8 }}>Forgot password?</h1>
              <p className="t-sm muted" style={{ marginBottom: 32 }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="col" style={{ gap: 16 }}>
                {error && (
                  <div style={{ background: 'var(--c-bad-soft)', border: '1px solid rgba(185,28,28,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, color: 'var(--c-bad)' }}>
                    {error}
                  </div>
                )}
                <div className="field">
                  <label className="field-label">Email address</label>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input" placeholder="you@company.com"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Link href="/login" className="row gap-1 t-sm" style={{ color: 'var(--c-fg-3)', justifyContent: 'center', display: 'inline-flex' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 12L4 7l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel />
    </div>
  );
}
