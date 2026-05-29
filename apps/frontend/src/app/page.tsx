'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Brand logo ──────────────────────────────────────────────────── */
function BrandLogo() {
  return (
    <div className="brand">
      <span className="mark mark-acc" />
      Adryx
    </div>
  );
}

/* ─── TopNav ──────────────────────────────────────────────────────── */
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: scrolled ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.80)',
        backdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: scrolled ? '1px solid var(--c-line)' : '1px solid transparent',
        transition: 'border-color .15s, background .15s',
      }}
    >
      <div className="container row between" style={{ height: 60 }}>
        <Link href="/"><BrandLogo /></Link>
        <div className="row gap-1 topnav-links">
          {['Product', 'Publishers', 'Advertisers', 'Docs', 'Pricing'].map(l => (
            <Link
              key={l}
              href={`/${l.toLowerCase()}`}
              style={{ padding: '6px 12px', borderRadius: 'var(--r-2)', fontSize: 14, color: 'var(--c-fg-2)', fontWeight: 480, transition: 'color .1s, background .1s' }}
              className="topnav-link"
            >{l}</Link>
          ))}
        </div>
        <div className="row gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero product mock ───────────────────────────────────────────── */
function HeroProductMock() {
  /* Simple inline SVG area chart */
  const pts = [0,18,10,35,22,28,30,45,40,38,50,52,60,44,70,62,80,55,90,68,100,60];
  const xs = pts.filter((_,i) => i%2===0);
  const ys = pts.filter((_,i) => i%2!==0);
  const W = 320, H = 80;
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scaleX = (x: number) => (x/100)*W;
  const scaleY = (y: number) => H - ((y - minY)/(maxY - minY))*(H*0.8) - H*0.1;
  const linePts = xs.map((x,i) => `${scaleX(x)},${scaleY(ys[i])}`).join(' ');
  const areaPath = `M${scaleX(xs[0])},${H} ` + xs.map((x,i) => `L${scaleX(x)},${scaleY(ys[i])}`).join(' ') + ` L${scaleX(xs[xs.length-1])},${H} Z`;

  return (
    <div style={{
      marginTop: 48,
      background: '#fff',
      border: '1px solid var(--c-line)',
      borderRadius: 14,
      boxShadow: '0 24px 64px -16px rgba(15,15,20,.14), 0 0 0 1px var(--c-line)',
      overflow: 'hidden',
      maxWidth: 720,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      {/* Browser chrome */}
      <div style={{ background: 'var(--c-bg-2)', borderBottom: '1px solid var(--c-line)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        <span style={{ flex: 1, background: '#fff', border: '1px solid var(--c-line)', borderRadius: 6, height: 22, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 8, fontSize: 11, color: 'var(--c-fg-4)' }}>
          app.adryx.io/publishers
        </span>
      </div>
      {/* Dashboard preview */}
      <div style={{ padding: '20px 24px' }}>
        <div className="row between" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--c-fg-4)', marginBottom: 2 }}>This week's earnings</div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--c-fg)' }}>$12,847.20</div>
          </div>
          <span className="badge badge-ok"><span className="badge-dot" /> Settled</span>
        </div>
        {/* Area chart */}
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', marginBottom: 16 }}>
          <defs>
            <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-acc)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--c-acc)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#hGrad)" />
          <polyline points={linePts} fill="none" stroke="var(--c-acc)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { label: 'Impressions', value: '1.84M' },
            { label: 'CTR', value: '1.92%' },
            { label: 'eCPM', value: '$6.97' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--c-bg-2)', border: '1px solid var(--c-line)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: 'var(--c-fg-4)', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 560, letterSpacing: '-0.01em' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────── */
function Hero() {
  const router = useRouter();
  return (
    <section className="section" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 64 }}>
      <div className="container col" style={{ alignItems: 'center', gap: 0 }}>
        {/* Eyebrow */}
        <div className="eyebrow-pill" style={{ marginBottom: 28 }}>
          <span className="dot" />
          New · USDC payouts now on Base
        </div>
        {/* Headline */}
        <h1 className="t-display-xl" style={{ maxWidth: 760, marginBottom: 20 }}>
          Internet advertising,<br />settled in stablecoins.
        </h1>
        {/* Description */}
        <p className="t-body-lg" style={{ maxWidth: 520, marginBottom: 32 }}>
          Adryx connects publishers and advertisers through a transparent, on-chain ad marketplace.
          Every impression attested. Every payout in USDC.
        </p>
        {/* CTA buttons */}
        <div className="row gap-3" style={{ marginBottom: 28 }}>
          <button onClick={() => router.push('/signup')} className="btn btn-primary btn-lg">
            Start earning
          </button>
          <button onClick={() => router.push('/signup?role=advertiser')} className="btn btn-outline btn-lg">
            Run a campaign
          </button>
        </div>
        {/* Checks */}
        <div className="row gap-5 wrap" style={{ justifyContent: 'center', fontSize: 13.5, color: 'var(--c-fg-3)' }}>
          {['No credit card required', 'Weekly USDC payouts', 'On-chain attestations'].map(t => (
            <span key={t} className="row gap-2">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="7.5" fill="var(--c-acc-soft)" /><path d="M4.5 7.5l2 2 4-4" stroke="var(--c-acc)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t}
            </span>
          ))}
        </div>
        <HeroProductMock />
      </div>
    </section>
  );
}

/* ─── LogoBar ─────────────────────────────────────────────────────── */
function LogoBar() {
  const brands = ['Mirror', 'Layer3', 'Farcaster', 'Lens', 'Zora', 'Stargate', 'Optimism', 'Polygon', 'Linea'];
  return (
    <div style={{ borderTop: '1px solid var(--c-line)', borderBottom: '1px solid var(--c-line)', padding: '36px 0', background: 'var(--c-bg-2)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--c-fg-4)', fontWeight: 540, marginBottom: 20 }}>
          Trusted by builders shipping the open internet
        </p>
        <div className="logo-strip">
          {brands.map(b => <span key={b} className="lg">{b}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ─── SplitSection ────────────────────────────────────────────────── */
function SplitSection() {
  const router = useRouter();
  const cards = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="10" cy="10" rx="4" ry="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M1.5 10h17" stroke="currentColor" strokeWidth="1.5" /></svg>
      ),
      label: 'Publishers',
      headline: 'Get paid for the attention your site earns',
      bullets: ['Embed one script tag — done', 'Real-time earnings dashboard', 'Weekly USDC payouts, on-chain', 'Human-verified impressions only'],
      primary: { label: 'See publisher app', href: '/publishers' },
      secondary: { label: 'Get the snippet', href: '/publishers/integrate' },
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" /></svg>
      ),
      label: 'Advertisers',
      headline: 'Reach real humans. Pay only for verified impressions.',
      bullets: ['Transparent on-chain spend', 'Contextual & wallet-based targeting', 'Real-time campaign analytics', 'No minimum budget'],
      primary: { label: 'See advertiser app', href: '/dashboard' },
      secondary: { label: 'Launch a campaign', href: '/dashboard/create' },
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="t-eyebrow" style={{ marginBottom: 10 }}>A two-sided network</p>
          <h2 className="t-display" style={{ maxWidth: 560, margin: '0 auto' }}>One protocol. Two sides. Aligned incentives.</h2>
        </div>
        <div className="grid-2">
          {cards.map(c => (
            <div key={c.label} className="card card-pad-lg col" style={{ gap: 20 }}>
              <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--c-acc-soft)', color: 'var(--c-acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div>
                  <p className="t-eyebrow-n" style={{ marginBottom: 4 }}>{c.label}</p>
                  <h3 className="t-h3">{c.headline}</h3>
                </div>
              </div>
              <ul className="col" style={{ gap: 8, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                {c.bullets.map(b => (
                  <li key={b} className="row gap-2 t-sm" style={{ color: 'var(--c-fg-3)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M3 7l3 3 5-5" stroke="var(--c-acc)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="row gap-2" style={{ marginTop: 'auto' }}>
                <Link href={c.primary.href} className="btn btn-primary btn-sm">{c.primary.label}</Link>
                <Link href={c.secondary.href} className="btn btn-outline btn-sm">{c.secondary.label}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HowItWorks ──────────────────────────────────────────────────── */
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
        {/* Steps grid */}
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
        {/* Code cards */}
        <div className="grid-2">
          {/* Publisher snippet */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="t-xs" style={{ fontWeight: 560, color: 'var(--c-fg-3)' }}>Publisher integration</span>
            </div>
            <div className="code" style={{ borderRadius: 0, margin: 0 }}>
              <span className="tk-c">{'<!-- Paste before </body> -->'}</span>{'\n'}
              <span className="tk-k">{'<script'}</span>
              <span className="tk-n">{' async'}</span>
              <span className="tk-k">{'>'}</span>
              {'\n  '}
              <span className="tk-s">{'src="https://cdn.adryx.io/v1/loader.js"'}</span>
              {'\n  '}
              <span className="tk-n">{'data-pub="pub_xxxxxxxx"'}</span>
              {'\n'}
              <span className="tk-k">{'</script>'}</span>
            </div>
          </div>
          {/* Advertiser ledger */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--c-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="t-xs" style={{ fontWeight: 560, color: 'var(--c-fg-3)' }}>Advertiser settlement</span>
            </div>
            <table className="table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr><th>Tx hash</th><th>Date</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {[
                  { hash: '0x4f2a…9c1e', date: 'May 16', amt: '-$1,240.00', s: 'ok' },
                  { hash: '0x8b1d…3a7f', date: 'May 9', amt: '-$980.50', s: 'ok' },
                  { hash: '0x2e9c…7b4d', date: 'May 2', amt: '-$1,105.20', s: 'ok' },
                  { hash: '0x6f3a…2c8e', date: 'Apr 25', amt: '-$870.00', s: 'ok' },
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
        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
          {/* Transparency — span 4 */}
          <div className="card card-pad" style={{ gridColumn: 'span 4', minHeight: 200 }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Transparency</p>
            <h3 className="t-h3" style={{ marginBottom: 12 }}>Every impression, proven on-chain.</h3>
            <p className="t-sm muted" style={{ marginBottom: 20 }}>Each ad render writes an attestation to Base. Advertisers can verify every dollar spent; publishers can audit every cent earned.</p>
            <ProofVisual />
          </div>
          {/* Speed — span 2 */}
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Speed</p>
            <h3 className="t-h4" style={{ marginBottom: 16 }}>38ms median auction latency</h3>
            {[{ label: 'Adryx', pct: 38, w: '38%', color: 'var(--c-acc)' }, { label: 'Incumbent A', pct: 180, w: '90%', color: 'var(--c-line-3)' }, { label: 'Incumbent B', pct: 220, w: '100%', color: 'var(--c-line-3)' }].map(b => (
              <div key={b.label} style={{ marginBottom: 10 }}>
                <div className="row between t-xs muted" style={{ marginBottom: 4 }}>
                  <span>{b.label}</span><span>{b.pct}ms</span>
                </div>
                <div style={{ height: 6, background: 'var(--c-bg-3)', borderRadius: 3 }}>
                  <div style={{ height: 6, borderRadius: 3, background: b.color, width: b.w, transition: 'width 1s' }} />
                </div>
              </div>
            ))}
          </div>
          {/* Trust — span 2 */}
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Trust</p>
            <h3 className="t-h4" style={{ marginBottom: 16 }}>92% human traffic, verified</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="var(--c-line)" strokeWidth="8" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="var(--c-acc)" strokeWidth="8"
                  strokeDasharray={`${2*Math.PI*28*0.92} ${2*Math.PI*28}`}
                  strokeDashoffset={2*Math.PI*28*0.25}
                  strokeLinecap="round" />
                <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--c-fg)">92%</text>
              </svg>
              <div className="col" style={{ gap: 6 }}>
                <span className="t-xs" style={{ color: 'var(--c-fg-3)' }}><span style={{ color: 'var(--c-acc)', fontWeight: 600 }}>92%</span> Human verified</span>
                <span className="t-xs" style={{ color: 'var(--c-fg-3)' }}><span style={{ color: 'var(--c-bad)', fontWeight: 600 }}>8%</span> Filtered bots</span>
              </div>
            </div>
          </div>
          {/* Targeting — span 2 */}
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Targeting</p>
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Wallet-based audience segments</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['DeFi users', 'NFT holders', 'L2 native', 'Early adopters', 'DAO voters', 'Stakers'].map(t => (
                <span key={t} className="badge badge-acc">{t}</span>
              ))}
            </div>
          </div>
          {/* Payments — span 2 */}
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Payments</p>
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Multi-chain USDC payouts</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ label: 'Base', color: '#0052ff' }, { label: 'Optimism', color: '#ff0420' }, { label: 'Polygon', color: '#8247e5' }, { label: 'Linea', color: '#121212' }].map(c => (
                <div key={c.label} title={c.label} style={{ width: 32, height: 32, borderRadius: '50%', background: c.color, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 }}>
                  {c.label[0]}
                </div>
              ))}
            </div>
          </div>
          {/* Control — span 2 */}
          <div className="card card-pad" style={{ gridColumn: 'span 2' }}>
            <p className="t-eyebrow-n" style={{ marginBottom: 6 }}>Control</p>
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Brand safety allow/block list</h3>
            <div className="col" style={{ gap: 6 }}>
              {[{ t: 'Allow: crypto, DeFi, Web3', ok: true }, { t: 'Block: gambling, adult', ok: false }].map(r => (
                <div key={r.t} className="row gap-2 t-xs" style={{ color: r.ok ? 'var(--c-ok)' : 'var(--c-bad)' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    {r.ok
                      ? <><circle cx="6" cy="6" r="5.5" stroke="currentColor" /><path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></>
                      : <><circle cx="6" cy="6" r="5.5" stroke="currentColor" /><path d="M4 4l4 4M8 4l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></>}
                  </svg>
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

/* ─── Stats ───────────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: '$28.4M', label: 'Paid to publishers' },
    { value: '4.2B', label: 'Impressions verified' },
    { value: '12,400', label: 'Active publisher sites' },
    { value: '78%', label: 'Revenue share' },
  ];
  return (
    <div style={{ background: '#0a0a0c', padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 620, letterSpacing: '-0.03em', color: '#fff', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', letterSpacing: '.01em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Compare ─────────────────────────────────────────────────────── */
function Compare() {
  const rows = [
    ['On-chain attestations', true, false],
    ['USDC payouts', true, false],
    ['No middlemen', true, false],
    ['Real-time analytics', true, true],
    ['78% publisher revenue share', true, false],
    ['Human verification', true, 'Partial'],
    ['Transparent auction', true, false],
  ] as [string, boolean | string, boolean | string][];

  const check = (v: boolean | string) =>
    v === true ? <span style={{ color: 'var(--c-ok)', fontWeight: 600 }}>✓</span>
      : v === false ? <span style={{ color: 'var(--c-bad)' }}>✕</span>
        : <span style={{ color: 'var(--c-warn)', fontSize: 12 }}>{v}</span>;

  return (
    <section className="section-tight">
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
                <th style={{ color: 'var(--c-acc)' }}>Adryx</th>
                <th>Incumbent ad network</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, adryx, other]) => (
                <tr key={label as string}>
                  <td style={{ fontWeight: 480, color: 'var(--c-fg-2)' }}>{label as string}</td>
                  <td style={{ textAlign: 'center' }}>{check(adryx)}</td>
                  <td style={{ textAlign: 'center' }}>{check(other)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────────────── */
function Testimonials() {
  const quotes = [
    { quote: 'Switching to Adryx doubled our effective CPM and we actually get paid on time — every Friday, in USDC.', name: 'Marina Voss', title: 'Head of Revenue, Tessera Wire', initials: 'MV' },
    { quote: 'The transparency is unreal. I can verify every impression we paid for on Base. No more trusting a black box.', name: 'Daniel Park', title: 'Growth Lead, Onchain Labs', initials: 'DP' },
    { quote: 'Our DeFi audience segment performed 3x better than generic programmatic. The wallet-based targeting is a game-changer.', name: 'Asha Rao', title: 'Marketing Director, Meridian Finance', initials: 'AR' },
  ];
  return (
    <section className="section-tight" style={{ background: 'var(--c-bg-2)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="t-eyebrow" style={{ marginBottom: 10 }}>Testimonials</p>
          <h2 className="t-h1">What our partners say</h2>
        </div>
        <div className="grid-3">
          {quotes.map(q => (
            <div key={q.name} className="card card-pad col" style={{ gap: 20 }}>
              <p className="t-body" style={{ color: 'var(--c-fg-2)', flex: 1 }}>"{q.quote}"</p>
              <div className="row gap-3">
                <div className="avatar avatar-lg" style={{ background: 'var(--c-acc-soft)', color: 'var(--c-acc)', fontWeight: 600, fontSize: 13 }}>{q.initials}</div>
                <div>
                  <p className="t-sm" style={{ fontWeight: 540 }}>{q.name}</p>
                  <p className="t-xs muted-2">{q.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTAFinal ────────────────────────────────────────────────────── */
function CTAFinal() {
  const router = useRouter();
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container col" style={{ alignItems: 'center', gap: 24 }}>
        <div className="eyebrow-pill"><span className="dot" />No setup fee</div>
        <h2 className="t-display" style={{ maxWidth: 500, margin: 0 }}>Ready when you are.</h2>
        <p className="t-body-lg" style={{ maxWidth: 440, margin: 0 }}>
          Join 12,400 publishers earning in USDC and hundreds of advertisers reaching verified on-chain audiences.
        </p>
        <div className="row gap-3">
          <button onClick={() => router.push('/signup')} className="btn btn-primary btn-lg">Create free account</button>
          <button onClick={() => router.push('/docs')} className="btn btn-outline btn-lg">Read the docs</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────── */
function SiteFooter() {
  const cols = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '#' },
    ],
    Developers: [
      { label: 'Documentation', href: '/docs' },
      { label: 'SDK reference', href: '/docs' },
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Status', href: '#' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '/contact' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookie policy', href: '#' },
      { label: 'DPA', href: '#' },
    ],
  };
  return (
    <footer style={{ borderTop: '1px solid var(--c-line)', background: 'var(--c-bg-2)', padding: '56px 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 32, marginBottom: 48 }}>
          {/* Brand */}
          <div className="col" style={{ gap: 14 }}>
            <BrandLogo />
            <p className="t-sm muted" style={{ maxWidth: 240 }}>
              Internet advertising, settled in stablecoins. USDC payouts for every verified impression.
            </p>
          </div>
          {Object.entries(cols).map(([group, links]) => (
            <div key={group}>
              <p className="t-xs" style={{ fontWeight: 600, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>{group}</p>
              <div className="col" style={{ gap: 8 }}>
                {links.map(l => (
                  <Link key={l.label} href={l.href} className="t-sm" style={{ color: 'var(--c-fg-3)', transition: 'color .1s' }}>{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--c-line)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p className="t-xs muted-2">© 2026 Adryx. All rights reserved.</p>
          <div className="row gap-4">
            {[{ label: 'Help', href: '/contact' }, { label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }].map(l => (
              <Link key={l.label} href={l.href} className="t-xs" style={{ color: 'var(--c-fg-4)' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <TopNav />
      <main>
        <Hero />
        <LogoBar />
        <SplitSection />
        <HowItWorks />
        <Features />
        <Stats />
        <Compare />
        <Testimonials />
        <CTAFinal />
      </main>
      <SiteFooter />
    </>
  );
}
