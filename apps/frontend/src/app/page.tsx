'use client';

import { useState, useEffect } from 'react';
import { Globe, Megaphone, Check, X, ArrowRight, Moon, Sun } from 'lucide-react';

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
        background: 'var(--c-ok-soft)', border: '1px solid rgba(34,197,94,.2)',
        borderRadius: 14, maxWidth: 420, margin: '0 auto',
        animation: 'fadeIn 0.4s ease both',
      }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--c-ok)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Check size={24} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ fontWeight: 620, fontSize: 16, marginBottom: 6 }}>You&apos;re on the list!</div>
        <p style={{ fontSize: 14, color: 'var(--c-fg-3)', lineHeight: 1.5, margin: 0 }}>
          We&apos;ll reach out to <strong>{email}</strong> when early access opens for {role === 'publisher' ? 'publishers' : 'advertisers'}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {(['publisher', 'advertiser'] as const).map(r => (
          <button key={r} type="button" onClick={() => setRole(r)} style={{
            padding: '11px 14px', borderRadius: 10,
            border: `2px solid ${role === r ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
            background: role === r ? 'var(--c-acc-soft)' : 'transparent',
            cursor: 'pointer', fontWeight: 520, fontSize: 14,
            color: role === r ? 'var(--c-acc-ink)' : 'var(--c-fg-3)',
            transition: 'all .14s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            {r === 'publisher' ? <><Globe size={14} /><span>Publisher</span></> : <><Megaphone size={14} /><span>Advertiser</span></>}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="input" style={{ flex: 1, fontSize: 14 }} />
        <button type="submit" disabled={loading || !role} className="btn btn-primary" style={{ whiteSpace: 'nowrap', gap: 6, opacity: (!role || loading) ? 0.5 : 1, transition: 'opacity .15s' }}>
          {loading ? 'Joining…' : <><span>Join waitlist</span><ArrowRight size={14} /></>}
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--c-fg-4)', textAlign: 'center', margin: 0 }}>No spam. Early access means early payouts.</p>
    </form>
  );
}

/* ─── How it works ────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: '01', title: 'Publisher embeds Adryx',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5l-3 4 3 4M13 5l3 4-3 4M10 3l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      desc: 'One async script tag — no frameworks, no bundle impact.',
    },
    {
      n: '02', title: 'Auction runs in 38ms',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v4M9 12v4M5 6L2.5 3.5M13 12l2.5 2.5M2 9h4M12 9h4M5 12L2.5 14.5M13 6l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
      desc: 'Second-price auction selects the winning bid in real-time.',
    },
    {
      n: '03', title: 'Impression is attested',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C5 2 2 5 2 9s3 7 7 7 7-3 7-7-3-7-7-7z" stroke="currentColor" strokeWidth="1.5" /><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      desc: 'Human verification proof is written on-chain. Fraudulent bots earn nothing.',
    },
    {
      n: '04', title: 'USDC settles weekly',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="10" r="1.5" fill="currentColor" /></svg>,
      desc: 'Every Friday, publisher balances sweep to their on-chain wallet in USDC.',
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--c-bg-2)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="t-eyebrow" style={{ marginBottom: 10 }}>How Adryx works</p>
          <h2 className="t-display" style={{ maxWidth: 580, margin: '0 auto' }}>
            From ad request to settled payout — in one hop.
          </h2>
        </div>
        <div className="grid-4" style={{ marginBottom: 48 }}>
          {steps.map(s => (
            <div key={s.n} className="col" style={{ gap: 14 }}>
              <div className="row gap-3" style={{ alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--c-acc-soft)', color: 'var(--c-acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-fg-4)', letterSpacing: '.06em' }}>{s.n}</span>
              </div>
              <h4 className="t-h4">{s.title}</h4>
              <p className="t-sm muted">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid-2">
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="t-xs" style={{ fontWeight: 560, color: 'var(--c-fg-3)' }}>Publisher integration</span>
            </div>
            <div className="code" style={{ borderRadius: 0, margin: 0 }}>
              <span className="tk-c">{'<!-- Paste before </body> -->'}</span>{'\n'}
              <span className="tk-k">{'<script'}</span><span className="tk-n">{' async'}</span><span className="tk-k">{'>'}</span>
              {'\n  '}<span className="tk-s">{'src="https://cdn.adryx.io/v1/loader.js"'}</span>
              {'\n  '}<span className="tk-n">{'data-pub="pub_xxxxxxxx"'}</span>
              {'\n'}<span className="tk-k">{'</script>'}</span>
            </div>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="t-xs" style={{ fontWeight: 560, color: 'var(--c-fg-3)' }}>Advertiser settlement</span>
            </div>
            <table className="table" style={{ fontSize: 12.5 }}>
              <thead><tr><th>Tx hash</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { hash: '0x4f2a…9c1e', date: 'May 16', amt: '-$1,240.00' },
                  { hash: '0x8b1d…3a7f', date: 'May 9',  amt: '-$980.50' },
                  { hash: '0x2e9c…7b4d', date: 'May 2',  amt: '-$1,105.20' },
                  { hash: '0x6f3a…2c8e', date: 'Apr 25', amt: '-$870.00' },
                ].map(r => (
                  <tr key={r.hash}>
                    <td className="t-mono" style={{ color: 'var(--c-fg-3)' }}>{r.hash}</td>
                    <td style={{ color: 'var(--c-fg-3)' }}>{r.date}</td>
                    <td style={{ fontWeight: 530 }}>{r.amt}</td>
                    <td><span className="badge badge-ok"><span className="badge-dot" />Settled</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────────────────── */
function ProofVisual() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      {['Request', 'Auction', 'Attest', 'Settle'].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'var(--c-acc-soft)', color: 'var(--c-acc)', fontSize: 11.5, fontWeight: 560, borderRadius: 6, padding: '4px 10px', border: '1px solid rgba(37,99,235,.15)' }}>{s}</div>
          {i < 3 && <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 5h12M11 1l4 4-4 4" stroke="var(--c-fg-4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
      ))}
    </div>
  );
}

function Features() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="t-eyebrow" style={{ marginBottom: 10 }}>Built for both sides</p>
          <h2 className="t-display" style={{ maxWidth: 520, margin: '0 auto' }}>The features that make Adryx work.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
          <div className="card card-pad" style={{ gridColumn: 'span 4', minHeight: 200 }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Transparency</p>
            <h3 className="t-h3" style={{ marginBottom: 12 }}>Every impression, proven on-chain.</h3>
            <p className="t-sm muted" style={{ marginBottom: 20 }}>Each ad render writes an attestation to Base. Advertisers can verify every dollar spent; publishers can audit every cent earned.</p>
            <ProofVisual />
          </div>
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Speed</p>
            <h3 className="t-h4" style={{ marginBottom: 16 }}>38ms median auction latency</h3>
            {[{ label: 'Adryx', pct: 38, w: '38%', color: 'var(--c-acc)' }, { label: 'Incumbent A', pct: 180, w: '90%', color: 'var(--c-line-3)' }, { label: 'Incumbent B', pct: 220, w: '100%', color: 'var(--c-line-3)' }].map(b => (
              <div key={b.label} style={{ marginBottom: 10 }}>
                <div className="row between t-xs muted" style={{ marginBottom: 4 }}><span>{b.label}</span><span>{b.pct}ms</span></div>
                <div style={{ height: 6, background: 'var(--c-bg-3)', borderRadius: 3 }}>
                  <div style={{ height: 6, borderRadius: 3, background: b.color, width: b.w }} />
                </div>
              </div>
            ))}
          </div>
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Trust</p>
            <h3 className="t-h4" style={{ marginBottom: 16 }}>92% human traffic, verified</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="var(--c-line)" strokeWidth="8" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="var(--c-acc)" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 28 * 0.92} ${2 * Math.PI * 28}`}
                  strokeDashoffset={2 * Math.PI * 28 * 0.25} strokeLinecap="round" />
                <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--c-fg)">92%</text>
              </svg>
              <div className="col" style={{ gap: 6 }}>
                <span className="t-xs" style={{ color: 'var(--c-fg-3)' }}><span style={{ color: 'var(--c-acc)', fontWeight: 600 }}>92%</span> Human verified</span>
                <span className="t-xs" style={{ color: 'var(--c-fg-3)' }}><span style={{ color: 'var(--c-bad)', fontWeight: 600 }}>8%</span> Filtered bots</span>
              </div>
            </div>
          </div>
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Targeting</p>
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Wallet-based audience segments</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['DeFi users', 'NFT holders', 'L2 native', 'Early adopters', 'DAO voters', 'Stakers'].map(t => (
                <span key={t} className="badge badge-acc">{t}</span>
              ))}
            </div>
          </div>
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Payments</p>
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Multi-chain USDC payouts</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ label: 'Base', color: '#0052ff' }, { label: 'Optimism', color: '#ff0420' }, { label: 'Polygon', color: '#8247e5' }, { label: 'Linea', color: '#121212' }].map(c => (
                <div key={c.label} title={c.label} style={{ width: 32, height: 32, borderRadius: '50%', background: c.color, border: '2px solid var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 }}>
                  {c.label[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Control</p>
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Brand safety allow/block list</h3>
            <div className="col" style={{ gap: 6 }}>
              {[{ t: 'Allow: crypto, DeFi, Web3', ok: true }, { t: 'Block: gambling, adult', ok: false }].map(r => (
                <div key={r.t} className="row gap-2 t-xs" style={{ color: r.ok ? 'var(--c-ok)' : 'var(--c-bad)' }}>
                  {r.ok
                    ? <Check size={12} strokeWidth={2} />
                    : <X size={12} strokeWidth={2} />}
                  {r.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Compare ─────────────────────────────────────────────────────── */
function Compare() {
  const rows: [string, boolean | string, boolean | string][] = [
    ['On-chain attestations',        true,  false],
    ['USDC payouts',                 true,  false],
    ['No middlemen',                 true,  false],
    ['Real-time analytics',          true,  true],
    ['78% publisher revenue share',  true,  false],
    ['Human verification',           true,  'Partial'],
    ['Transparent auction',          true,  false],
  ];

  const cell = (v: boolean | string) =>
    v === true    ? <Check size={16} color="var(--c-ok)" strokeWidth={2.5} />
    : v === false ? <X     size={16} color="var(--c-bad)" strokeWidth={2} />
    : <span style={{ color: 'var(--c-warn)', fontSize: 12, fontWeight: 520 }}>{v}</span>;

  return (
    <section className="section-tight" style={{ background: 'var(--c-bg-2)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="t-eyebrow" style={{ marginBottom: 10 }}>Compare</p>
          <h2 className="t-h1">Adryx vs. incumbent ad networks</h2>
        </div>
        <div className="table-wrap" style={{ maxWidth: 680, margin: '0 auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Feature</th>
                <th style={{ color: 'var(--c-acc)', textAlign: 'center' }}>Adryx</th>
                <th style={{ textAlign: 'center' }}>Incumbent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, adryx, other]) => (
                <tr key={label}>
                  <td style={{ fontWeight: 480, color: 'var(--c-fg-2)' }}>{label}</td>
                  <td style={{ textAlign: 'center' }}>{cell(adryx)}</td>
                  <td style={{ textAlign: 'center' }}>{cell(other)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── No setup fees CTA ───────────────────────────────────────────── */
function NoSetupFees() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container col" style={{ alignItems: 'center', gap: 24 }}>
        <div className="eyebrow-pill"><span className="dot" />No setup fee</div>
        <h2 className="t-display" style={{ maxWidth: 520, margin: 0 }}>Ready when you are.</h2>
        <p className="t-body-lg" style={{ maxWidth: 480, margin: 0 }}>
          Join 12,400 publishers earning in USDC and hundreds of advertisers reaching verified on-chain audiences.
          Get early access when we launch.
        </p>
        <div style={{ width: '100%' }}>
          <WaitlistForm />
        </div>
      </div>
    </section>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', position: 'relative' }}>

      {/* ── Background orbs ──────────────────────────────────────── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -160, right: -160, width: 640, height: 640, borderRadius: '50%', background: dark ? 'radial-gradient(circle, rgba(59,130,246,.28) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(37,99,235,.13) 0%, transparent 65%)', filter: 'blur(48px)', animation: 'orb-1 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -100, width: 560, height: 560, borderRadius: '50%', background: dark ? 'radial-gradient(circle, rgba(124,58,237,.22) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(124,58,237,.1) 0%, transparent 65%)', filter: 'blur(48px)', animation: 'orb-2 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, borderRadius: '50%', background: dark ? 'radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,.05) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-3 22s ease-in-out infinite' }} />
      </div>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid var(--c-line)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="brand" style={{ ...an(0, 0.4) }}>
          <span className="mark mark-acc" />Adryx
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 540, color: 'var(--c-fg-4)', letterSpacing: '.04em', textTransform: 'uppercase', ...an(0.05, 0.4) }}>Private beta</span>
          <button onClick={toggle} aria-label="Toggle dark mode" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--c-line-2)', background: 'var(--c-bg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-fg-3)', ...an(0.1, 0.4) }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <div className="eyebrow-pill" style={{ marginBottom: 28, ...an(0.1) }}>
          <span className="dot" />Launching soon · USDC on Base
        </div>

        <h1 className="t-display-xl" style={{ maxWidth: 700, marginBottom: 18, ...an(0.2) }}>
          Internet advertising,<br />settled in stablecoins.
        </h1>

        <p className="t-body-lg" style={{ maxWidth: 480, marginBottom: 40, ...an(0.3) }}>
          Adryx connects publishers and advertisers through a transparent, on-chain ad marketplace.
          Every impression attested. Every payout in USDC.
        </p>

        <div style={{ width: '100%', ...an(0.4) }}>
          <WaitlistForm />
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginTop: 44, fontSize: 13.5, color: 'var(--c-fg-3)', ...an(0.5) }}>
          {['78% publisher revenue share', 'Weekly USDC payouts', 'On-chain impression proofs', 'Zero setup fees'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--c-acc-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={10} color="var(--c-acc)" strokeWidth={2.5} />
              </span>
              {t}
            </span>
          ))}
        </div>

        {/* Dashboard preview mock */}
        <div style={{ marginTop: 64, maxWidth: 640, width: '100%', animation: 'fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.55s both, float 7s ease-in-out 1.2s infinite' }}>
          <div style={{ background: dark ? 'var(--c-bg-2)' : '#fff', border: '1px solid var(--c-line)', borderRadius: 14, boxShadow: dark ? '0 24px 80px -16px rgba(0,0,0,.6), 0 0 0 1px var(--c-line)' : '0 24px 64px -16px rgba(15,15,20,.12), 0 0 0 1px var(--c-line)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--c-bg-3)', borderBottom: '1px solid var(--c-line)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {[dark ? '#6b3535' : '#ff5f57', dark ? '#6b5a28' : '#febc2e', dark ? '#1e5c2a' : '#28c840'].map((c, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
              <span style={{ flex: 1, background: dark ? 'var(--c-bg-4)' : '#fff', border: '1px solid var(--c-line)', borderRadius: 6, height: 22, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, color: 'var(--c-fg-4)' }}>
                app.adryx.io/advertiser
              </span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--c-fg-4)', marginBottom: 3 }}>Good morning, Forecast Labs</div>
                  <div style={{ fontSize: 22, fontWeight: 620, letterSpacing: '-0.02em' }}>$24,140 spent this month</div>
                </div>
                <span className="badge badge-ok"><span className="badge-dot" /> 5 campaigns live</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {[{ label: 'Impressions', value: '4.8M' }, { label: 'Clicks', value: '92.1K' }, { label: 'CTR', value: '1.92%' }, { label: 'Avg. CPC', value: '$0.26' }].map(m => (
                  <div key={m.label} style={{ background: 'var(--c-bg-3)', border: '1px solid var(--c-line)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--c-fg-4)', marginBottom: 3 }}>{m.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 580, letterSpacing: '-0.01em' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Content sections ─────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HowItWorks />
        <Features />
        <Compare />
        <NoSetupFees />
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--c-line)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 13, color: 'var(--c-fg-4)', position: 'relative', zIndex: 1 }}>
        <span>© 2026 Adryx</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <a href="mailto:hello@adryx.xyz" style={{ color: 'var(--c-fg-4)' }}>hello@adryx.xyz</a>
      </footer>
    </div>
  );
}
