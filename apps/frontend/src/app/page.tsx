'use client';

import { useState, useEffect } from 'react';
import { Globe, Megaphone, Check, ArrowRight, Moon, Sun } from 'lucide-react';

/* ─── Dark mode hook ──────────────────────────────────────────────── */
function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adryx-theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && sysDark);
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('adryx-theme', next ? 'dark' : 'light');
    setDark(next);
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
  }

  return { dark, toggle };
}

/* ─── Waitlist form ───────────────────────────────────────────────── */
function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'publisher' | 'advertiser' | ''>('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !role) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  }

  if (done) {
    return (
      <div style={{
        textAlign: 'center', padding: '32px 28px',
        background: 'var(--c-ok-soft)',
        border: '1px solid rgba(34,197,94,.2)',
        borderRadius: 14, maxWidth: 420, margin: '0 auto',
        animation: 'fadeIn 0.4s ease both',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: 'var(--c-ok)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
        }}>
          <Check size={24} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ fontWeight: 620, fontSize: 16, marginBottom: 6 }}>You&apos;re on the list!</div>
        <p style={{ fontSize: 14, color: 'var(--c-fg-3)', lineHeight: 1.5, margin: 0 }}>
          We&apos;ll reach out to <strong>{email}</strong> when early access opens
          for {role === 'publisher' ? 'publishers' : 'advertisers'}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto', width: '100%' }}>
      {/* Role selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {(['publisher', 'advertiser'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            style={{
              padding: '11px 14px', borderRadius: 10,
              border: `2px solid ${role === r ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
              background: role === r ? 'var(--c-acc-soft)' : 'transparent',
              cursor: 'pointer', fontWeight: 520, fontSize: 14,
              color: role === r ? 'var(--c-acc-ink)' : 'var(--c-fg-3)',
              transition: 'all .14s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            {r === 'publisher'
              ? <><Globe size={14} /><span>Publisher</span></>
              : <><Megaphone size={14} /><span>Advertiser</span></>}
          </button>
        ))}
      </div>

      {/* Email + submit */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="input" style={{ flex: 1, fontSize: 14 }}
        />
        <button
          type="submit"
          disabled={loading || !role}
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', gap: 6, opacity: (!role || loading) ? 0.5 : 1, transition: 'opacity .15s' }}
        >
          {loading ? 'Joining…' : <><span>Join waitlist</span><ArrowRight size={14} /></>}
        </button>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--c-fg-4)', textAlign: 'center', margin: 0 }}>
        No spam. Early access means early payouts.
      </p>
    </form>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function ComingSoonPage() {
  const { dark, toggle } = useDarkMode();

  const an = (delay: number, duration = 0.65) => ({
    animation: `fadeUp ${duration}s cubic-bezier(.22,1,.36,1) both`,
    animationDelay: `${delay}s`,
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background orbs ──────────────────────────────────────── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Top-right orb — blue */}
        <div style={{
          position: 'absolute', top: -160, right: -160,
          width: 640, height: 640, borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(59,130,246,.28) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(37,99,235,.13) 0%, transparent 65%)',
          filter: 'blur(48px)',
          animation: 'orb-1 14s ease-in-out infinite',
        }} />
        {/* Bottom-left orb — violet */}
        <div style={{
          position: 'absolute', bottom: -120, left: -100,
          width: 560, height: 560, borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(124,58,237,.22) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(124,58,237,.1) 0%, transparent 65%)',
          filter: 'blur(48px)',
          animation: 'orb-2 18s ease-in-out infinite',
        }} />
        {/* Center orb — accent, subtle */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37,99,235,.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orb-3 22s ease-in-out infinite',
        }} />
      </div>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{
        borderBottom: '1px solid var(--c-line)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: 1100, width: '100%', margin: '0 auto',
        position: 'relative', zIndex: 10,
      }}>
        <div className="brand" style={{ ...an(0, 0.4) }}>
          <span className="mark mark-acc" />
          Adryx
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 540, color: 'var(--c-fg-4)', letterSpacing: '.04em', textTransform: 'uppercase', ...an(0.05, 0.4) }}>
            Private beta
          </span>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid var(--c-line-2)',
              background: 'var(--c-bg-2)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--c-fg-3)',
              transition: 'background .15s, border-color .15s',
              ...an(0.1, 0.4),
            }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px', textAlign: 'center',
        position: 'relative', zIndex: 1,
      }}>

        {/* Eyebrow */}
        <div className="eyebrow-pill" style={{ marginBottom: 28, ...an(0.1) }}>
          <span className="dot" />
          Launching soon · USDC on Base
        </div>

        {/* Headline */}
        <h1 className="t-display-xl" style={{ maxWidth: 700, marginBottom: 18, ...an(0.2) }}>
          Internet advertising,<br />settled in stablecoins.
        </h1>

        {/* Sub */}
        <p className="t-body-lg" style={{ maxWidth: 480, marginBottom: 40, ...an(0.3) }}>
          Adryx connects publishers and advertisers through a transparent,
          on-chain ad marketplace. Every impression attested. Every payout in USDC.
        </p>

        {/* Waitlist form */}
        <div style={{ width: '100%', ...an(0.4) }}>
          <WaitlistForm />
        </div>

        {/* Key promises */}
        <div style={{
          display: 'flex', gap: 24, flexWrap: 'wrap',
          justifyContent: 'center', marginTop: 44,
          fontSize: 13.5, color: 'var(--c-fg-3)',
          ...an(0.5),
        }}>
          {['78% publisher revenue share', 'Weekly USDC payouts', 'On-chain impression proofs', 'Zero setup fees'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--c-acc-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Check size={10} color="var(--c-acc)" strokeWidth={2.5} />
              </span>
              {t}
            </span>
          ))}
        </div>

        {/* Dashboard preview mock */}
        <div style={{
          marginTop: 64, maxWidth: 640, width: '100%',
          animation: 'fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.55s both, float 7s ease-in-out 1.2s infinite',
        }}>
          <div style={{
            background: dark ? 'var(--c-bg-2)' : '#fff',
            border: '1px solid var(--c-line)',
            borderRadius: 14,
            boxShadow: dark
              ? '0 24px 80px -16px rgba(0,0,0,.6), 0 0 0 1px var(--c-line)'
              : '0 24px 64px -16px rgba(15,15,20,.12), 0 0 0 1px var(--c-line)',
            overflow: 'hidden',
          }}>
            {/* Browser chrome */}
            <div style={{
              background: 'var(--c-bg-3)', borderBottom: '1px solid var(--c-line)',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {[dark ? '#6b3535' : '#ff5f57', dark ? '#6b5a28' : '#febc2e', dark ? '#1e5c2a' : '#28c840'].map((c, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
              <span style={{
                flex: 1, background: dark ? 'var(--c-bg-4)' : '#fff',
                border: '1px solid var(--c-line)', borderRadius: 6, height: 22, marginLeft: 8,
                display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, color: 'var(--c-fg-4)',
              }}>
                app.adryx.io/advertiser
              </span>
            </div>
            {/* Mock content */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--c-fg-4)', marginBottom: 3 }}>Good morning, Forecast Labs</div>
                  <div style={{ fontSize: 22, fontWeight: 620, letterSpacing: '-0.02em' }}>$24,140 spent this month</div>
                </div>
                <span className="badge badge-ok"><span className="badge-dot" /> 5 campaigns live</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {[
                  { label: 'Impressions', value: '4.8M' },
                  { label: 'Clicks', value: '92.1K' },
                  { label: 'CTR', value: '1.92%' },
                  { label: 'Avg. CPC', value: '$0.26' },
                ].map(m => (
                  <div key={m.label} style={{
                    background: 'var(--c-bg-3)',
                    border: '1px solid var(--c-line)',
                    borderRadius: 8, padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-4)', marginBottom: 3 }}>{m.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 580, letterSpacing: '-0.01em' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--c-line)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, fontSize: 13, color: 'var(--c-fg-4)',
        position: 'relative', zIndex: 1,
      }}>
        <span>© 2026 Adryx</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <a href="mailto:hello@adryx.xyz" style={{ color: 'var(--c-fg-4)' }}>hello@adryx.xyz</a>
      </footer>
    </div>
  );
}
