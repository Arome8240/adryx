'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Shared: Brand logo ───────────────────────────────────────────── */
function BrandLogo() {
  return (
    <Link href="/" className="brand" style={{ display: 'inline-flex' }}>
      <span className="mark mark-acc" />
      Adryx
    </Link>
  );
}

/* ─── Shared: Sparkline ────────────────────────────────────────────── */
function MiniSparkline() {
  const vals = [28, 42, 35, 55, 48, 62, 58, 72, 65, 80];
  const W = 140, H = 36;
  const min = Math.min(...vals), max = Math.max(...vals);
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * (H * 0.8) - H * 0.1;
    return `${x},${y}`;
  }).join(' ');
  const area = `M0,${H} ` + vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * (H * 0.8) - H * 0.1;
    return `L${x},${y}`;
  }).join(' ') + ` L${W},${H} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spGrad)" />
      <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Shared: Side card ────────────────────────────────────────────── */
function SideCard() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--c-line)',
      borderRadius: 14,
      padding: '20px 22px',
      boxShadow: '0 12px 36px -8px rgba(15,15,20,.12)',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--c-fg-4)', marginBottom: 2 }}>Weekly payout</div>
          <div style={{ fontSize: 26, fontWeight: 620, letterSpacing: '-0.025em', color: 'var(--c-fg)' }}>$8,420.10</div>
        </div>
        <span className="badge badge-ok"><span className="badge-dot" />Settled</span>
      </div>
      <MiniSparkline />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14, marginBottom: 12 }}>
        {[{ label: 'Impressions', value: '1.2M' }, { label: 'CTR', value: '1.84%' }, { label: 'eCPM', value: '$3.05' }].map(m => (
          <div key={m.label} style={{ background: 'var(--c-bg-2)', border: '1px solid var(--c-line)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 10.5, color: 'var(--c-fg-4)', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 560 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--c-fg-4)', fontFamily: 'var(--f-mono)' }}>TX: 0x4f2a…9c1e · Base</div>
    </div>
  );
}

/* ─── Shared: Side quote ───────────────────────────────────────────── */
function SideQuote({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <div>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,.85)', fontStyle: 'italic', marginBottom: 14 }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontWeight: 600, fontSize: 12, borderColor: 'rgba(255,255,255,.2)' }}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 540, color: '#fff' }}>{name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{title}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Right side panel ─────────────────────────────────────────────── */
function RightPanel() {
  return (
    <div style={{
      background: 'var(--c-fg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '56px 48px',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Blue glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(37,99,235,.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SideCard />
        <SideQuote
          quote="The weekly USDC drop is the most boring — and best — part of our finance week."
          name="Marina Voss"
          title="Head of Revenue, Tessera Wire"
        />
      </div>
    </div>
  );
}

/* ─── Google SVG ───────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── GitHub icon ──────────────────────────────────────────────────── */
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ─── Wallet icon ──────────────────────────────────────────────────── */
function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 4.5V3a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

/* ─── Login page ───────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate auth — navigate to advertiser dashboard
    try {
      await new Promise(r => setTimeout(r, 600));
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* ── Left ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px', background: '#fff' }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ marginBottom: 36 }}>
            <BrandLogo />
          </div>

          <h1 className="t-h1" style={{ marginBottom: 28 }}>Sign in to Adryx</h1>

          {/* Social buttons */}
          <div className="col" style={{ gap: 10, marginBottom: 20 }}>
            <button className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center', gap: 10 }}>
              <GoogleIcon /> Continue with Google
            </button>
            <button className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center', gap: 10 }}>
              <GitHubIcon /> Continue with GitHub
            </button>
            <button
              className="btn btn-outline btn-lg"
              style={{ width: '100%', justifyContent: 'center', gap: 10 }}
              onClick={() => router.push('/auth/wallet')}
            >
              <WalletIcon /> Connect wallet
            </button>
          </div>

          {/* Divider */}
          <div className="row gap-3" style={{ marginBottom: 20, color: 'var(--c-fg-4)', fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--c-line)' }} />
            OR
            <div style={{ flex: 1, height: 1, background: 'var(--c-line)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="col" style={{ gap: 14, marginBottom: 16 }}>
            {error && (
              <div style={{ background: 'var(--c-bad-soft)', border: '1px solid rgba(185,28,28,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, color: 'var(--c-bad)' }}>
                {error}
              </div>
            )}
            <div className="field">
              <label className="field-label">Work email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="input" placeholder="you@company.com"
              />
            </div>
            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12.5, color: 'var(--c-acc)' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input" placeholder="••••••••" style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--c-fg-4)', cursor: 'pointer', padding: 2 }}
                >
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" stroke="currentColor" strokeWidth="1.2"/></svg>}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="t-sm" style={{ textAlign: 'center', color: 'var(--c-fg-3)' }}>
            New to Adryx?{' '}
            <Link href="/signup" style={{ color: 'var(--c-acc)', fontWeight: 520 }}>Create an account</Link>
          </p>

          {/* Footer */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span className="t-xs muted-2">© 2026 Adryx</span>
            <div className="row gap-4">
              {[{ l: 'Help', h: '/contact' }, { l: 'Privacy', h: '/privacy' }, { l: 'Terms', h: '/terms' }].map(i => (
                <Link key={i.l} href={i.h} className="t-xs" style={{ color: 'var(--c-fg-4)' }}>{i.l}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel />
    </div>
  );
}
