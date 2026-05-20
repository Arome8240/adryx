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

/* ─── Mini sparkline for side card ────────────────────────────────── */
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
        <linearGradient id="spGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spGrad2)" />
      <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Side card ────────────────────────────────────────────────────── */
function SideCard() {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--c-line)', borderRadius: 14,
      padding: '20px 22px', boxShadow: '0 12px 36px -8px rgba(15,15,20,.12)', marginBottom: 24,
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

/* ─── Benefits list ────────────────────────────────────────────────── */
function Benefits() {
  const items = [
    '$10 test impressions on signup',
    'Real-time analytics dashboard',
    'Weekly USDC payouts, on-chain',
    'SOC 2 Type II compliant',
  ];
  return (
    <div className="col" style={{ gap: 12 }}>
      {items.map(item => (
        <div key={item} className="row gap-3" style={{ color: 'rgba(255,255,255,.8)', fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="7.5" stroke="rgba(255,255,255,.3)" />
            <path d="M5 8l2 2 4-4" stroke="rgba(255,255,255,.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </div>
      ))}
    </div>
  );
}

/* ─── Right panel ──────────────────────────────────────────────────── */
function RightPanel() {
  return (
    <div style={{
      background: 'var(--c-fg)', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '56px 48px', minHeight: '100vh',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(37,99,235,.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SideCard />
        <Benefits />
      </div>
    </div>
  );
}

/* ─── Globe icon ───────────────────────────────────────────────────── */
function GlobeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="9" cy="9" rx="3.5" ry="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 9h15" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/* ─── Target icon ──────────────────────────────────────────────────── */
function TargetIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 1.5" />
    </svg>
  );
}

/* ─── Google SVG ───────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ─── Signup page ──────────────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'publisher' | 'advertiser'>('publisher');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!terms) { setError('Please accept the terms to continue.'); return; }
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      router.push(role === 'publisher' ? '/publishers' : '/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* ── Left ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px', background: '#fff', overflowY: 'auto' }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}><BrandLogo /></div>

          <h1 className="t-h1" style={{ marginBottom: 4 }}>Create your account</h1>
          <p className="t-sm muted" style={{ marginBottom: 28 }}>Free to start. No credit card required.</p>

          {/* Role picker */}
          <div className="row gap-3" style={{ marginBottom: 24 }}>
            {([
              { value: 'publisher', label: 'Earn from my site', sub: 'Publisher', icon: <GlobeIcon /> },
              { value: 'advertiser', label: 'Run ad campaigns', sub: 'Advertiser', icon: <TargetIcon /> },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  border: role === opt.value ? '2px solid var(--c-acc)' : '1px solid var(--c-line-2)',
                  background: role === opt.value ? 'var(--c-acc-soft)' : '#fff',
                  transition: 'border-color .12s, background .12s',
                  textAlign: 'left',
                }}
              >
                <div style={{ color: role === opt.value ? 'var(--c-acc)' : 'var(--c-fg-3)', marginBottom: 6 }}>
                  {opt.icon}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 550, color: role === opt.value ? 'var(--c-acc-ink)' : 'var(--c-fg)' }}>{opt.label}</div>
                <div style={{ fontSize: 11.5, color: role === opt.value ? 'var(--c-acc)' : 'var(--c-fg-4)' }}>{opt.sub}</div>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="col" style={{ gap: 14, marginBottom: 16 }}>
            {error && (
              <div style={{ background: 'var(--c-bad-soft)', border: '1px solid rgba(185,28,28,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, color: 'var(--c-bad)' }}>
                {error}
              </div>
            )}
            <div className="field">
              <label className="field-label">Full name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Ada Lovelace" />
            </div>
            <div className="field">
              <label className="field-label">Work email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@company.com" />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Min. 8 characters" />
            </div>
            {/* Terms */}
            <label className="row gap-2 t-sm" style={{ cursor: 'pointer', color: 'var(--c-fg-3)', userSelect: 'none' }}>
              <input
                type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: 'var(--c-acc)', cursor: 'pointer' }}
              />
              I agree to the{' '}
              <Link href="/terms" style={{ color: 'var(--c-acc)' }}>Terms</Link>
              {' '}&amp;{' '}
              <Link href="/privacy" style={{ color: 'var(--c-acc)' }}>Privacy Policy</Link>
            </label>
            <button
              type="submit" disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Social */}
          <div className="row gap-3" style={{ marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--c-line)' }} />
            <span style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--c-line)' }} />
          </div>
          <div className="row gap-3" style={{ marginBottom: 20 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
              <GoogleIcon /> Google
            </button>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
              <GitHubIcon /> GitHub
            </button>
          </div>

          <p className="t-sm" style={{ textAlign: 'center', color: 'var(--c-fg-3)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--c-acc)', fontWeight: 520 }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel />
    </div>
  );
}
