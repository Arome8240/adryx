'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HambergerMenu, CloseCircle } from 'iconsax-react';

/* ─── Celina dark-first CSS overrides ────────────────────────────── */
const STYLES = `
  /* Override design-system tokens to Celina dark palette */
  :root, [data-theme="dark"], [data-theme] {
    --c-acc:       #EBFF45;
    --c-acc-soft:  rgba(235,255,69,.12);
    --c-acc-ink:   #0e0e00;
    --c-bg:        #08080a;
    --c-bg-2:      #0f0f13;
    --c-bg-3:      #171719;
    --c-fg:        #f5f5f5;
    --c-fg-2:      rgba(245,245,245,.72);
    --c-fg-3:      rgba(245,245,245,.5);
    --c-fg-4:      rgba(245,245,245,.3);
    --c-line:      rgba(255,255,255,.08);
    --c-line-2:    rgba(255,255,255,.12);
    --c-line-3:    rgba(255,255,255,.18);
    --c-ok:        #4ade80;
    --c-bad:       #f87171;
    --c-warn:      #fbbf24;
    --c-card:      rgba(255,255,255,.025);
  }

  /* Nav — dark glassmorphism */
  nav.c-nav {
    position: sticky; top: 0; z-index: 40;
    background: rgba(8,8,10,.72);
    backdrop-filter: saturate(180%) blur(16px);
    border-bottom: 1px solid rgba(255,255,255,.08);
    transition: background .2s, border-color .2s;
  }
  nav.c-nav.scrolled { background: rgba(8,8,10,.92); border-color: rgba(255,255,255,.12); }
  .c-nav-link { color: rgba(245,245,245,.55); font-size: 13px; font-weight: 500; padding: 6px 10px; border-radius: 7px; transition: color .1s, background .1s; text-decoration: none; }
  .c-nav-link:hover { color: #f5f5f5; background: rgba(255,255,255,.07); }

  /* Brand */
  .c-brand { font-size: 17px; font-weight: 700; letter-spacing: -.02em; color: #f5f5f5; display: inline-flex; align-items: center; gap: 7px; text-decoration: none; }
  .c-mark { width: 9px; height: 9px; border-radius: 2px; background: #EBFF45; display: inline-block; }

  /* Buttons */
  .c-btn-y { background: #EBFF45; color: #0e0e00; border: none; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 620; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: transform .12s, box-shadow .12s; white-space: nowrap; text-decoration: none; font-family: inherit; }
  .c-btn-y:hover { transform: translateY(-1.5px); box-shadow: 0 0 0 3px rgba(235,255,69,.28); }
  .c-btn-y.lg { padding: 14px 30px; font-size: 15px; border-radius: 11px; }
  .c-btn-ghost { background: transparent; color: rgba(245,245,245,.75); border: 1px solid rgba(255,255,255,.14); border-radius: 10px; padding: 11px 20px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: background .12s, border-color .12s; text-decoration: none; font-family: inherit; }
  .c-btn-ghost:hover { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.22); }
  .c-btn-ghost.lg { padding: 13px 26px; font-size: 15px; border-radius: 11px; }

  /* Cards */
  .c-card { position: relative; overflow: hidden; border-radius: 16px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.025); padding: 24px; transition: transform .15s, border-color .15s, box-shadow .15s; }
  .c-card:hover { transform: translateY(-2px); border-color: rgba(235,255,69,.4); box-shadow: 0 8px 32px rgba(0,0,0,.45); }
  .c-card .accent-bar { position: absolute; left: 0; top: 0; height: 100%; width: 3px; background: #EBFF45; opacity: 0; transition: opacity .15s; }
  .c-card:hover .accent-bar { opacity: 1; }

  /* Eyebrow pill */
  .c-eyebrow { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(235,255,69,.28); background: rgba(235,255,69,.08); border-radius: 99px; padding: 5px 14px; font-size: 12px; font-weight: 560; color: rgba(235,255,69,.9); letter-spacing: .05em; }
  .c-dot { width: 7px; height: 7px; border-radius: 50%; background: #EBFF45; animation: cdot 2.2s ease-in-out infinite; flex-shrink: 0; }
  @keyframes cdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  /* Badges */
  .c-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 560; padding: 3px 10px; border-radius: 99px; }
  .c-badge-ok  { background: rgba(74,222,128,.1); color: #4ade80; border: 1px solid rgba(74,222,128,.25); }
  .c-badge-acc { background: rgba(235,255,69,.1); color: #EBFF45; border: 1px solid rgba(235,255,69,.22); }
  .c-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Stats */
  .c-stat-val { font-size: 40px; font-weight: 660; letter-spacing: -0.04em; color: #f5f5f5; margin-bottom: 6px; }
  .c-stat-lbl { font-size: 13px; color: rgba(245,245,245,.38); letter-spacing: .01em; }

  /* Containers & layout */
  .c-wrap  { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
  .c-row   { display: flex; align-items: center; flex-wrap: wrap; }
  .c-col   { display: flex; flex-direction: column; }
  .c-between { justify-content: space-between; }
  .gap-2 { gap: 8px; } .gap-3 { gap: 12px; } .gap-4 { gap: 16px; } .gap-5 { gap: 20px; }

  .c-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .c-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .c-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
  @media (max-width: 900px) { .c-grid-4 { grid-template-columns: repeat(2,1fr); } .c-grid-3 { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 640px) { .c-grid-4 { grid-template-columns: 1fr; } .c-grid-2 { grid-template-columns: 1fr; } .c-grid-3 { grid-template-columns: 1fr; } }

  /* Section spacing */
  .c-section { padding: 96px 0; }
  .c-section-tight { padding: 64px 0; }

  /* Typography helpers */
  .c-display-xl { font-size: clamp(42px,6vw,68px); font-weight: 680; letter-spacing: -.04em; line-height: 1.08; color: #f5f5f5; margin: 0; }
  .c-display    { font-size: clamp(30px,4vw,44px); font-weight: 660; letter-spacing: -.03em; line-height: 1.15; color: #f5f5f5; margin: 0; }
  .c-h1 { font-size: clamp(24px,3vw,32px); font-weight: 640; letter-spacing: -.025em; line-height: 1.2; color: #f5f5f5; margin: 0; }
  .c-h3 { font-size: 17px; font-weight: 600; letter-spacing: -.015em; color: #f5f5f5; margin: 0; }
  .c-h4 { font-size: 15px; font-weight: 600; letter-spacing: -.01em; color: #f5f5f5; margin: 0; }
  .c-body-lg { font-size: 17px; line-height: 1.7; color: rgba(245,245,245,.68); margin: 0; }
  .c-body    { font-size: 15px; line-height: 1.7; color: rgba(245,245,245,.68); margin: 0; }
  .c-sm      { font-size: 13px; line-height: 1.6; color: rgba(245,245,245,.55); }
  .c-xs      { font-size: 12px; color: rgba(245,245,245,.45); }
  .c-label   { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgba(245,245,245,.38); }
  .c-mono    { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(245,245,245,.55); }
  .c-muted   { color: rgba(245,245,245,.45); }
  .c-acc-text { color: #EBFF45; }

  /* Code block */
  .c-code { background: #0d0d11; border: 1px solid rgba(255,255,255,.07); border-radius: 10px; padding: 16px 18px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.75; overflow-x: auto; }
  .tk-c { color: rgba(245,245,245,.3); }
  .tk-k { color: #EBFF45; }
  .tk-s { color: #a8d8a8; }
  .tk-n { color: rgba(245,245,245,.65); }

  /* Logo strip */
  .c-logo-strip { display: flex; flex-wrap: wrap; justify-content: center; gap: 36px; }
  .c-logo-strip span { font-size: 13px; font-weight: 580; color: rgba(245,245,245,.22); letter-spacing: .07em; text-transform: uppercase; }

  /* Table */
  .c-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .c-table th { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgba(245,245,245,.32); padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,.07); }
  .c-table td { padding: 11px 14px; border-bottom: 1px solid rgba(255,255,255,.05); color: rgba(245,245,245,.75); }
  .c-table tr:hover td { background: rgba(255,255,255,.025); }

  /* Progress bars */
  .c-bar-track { height: 6px; background: rgba(255,255,255,.07); border-radius: 3px; overflow: hidden; }
  .c-bar-fill  { height: 100%; border-radius: 3px; background: #EBFF45; transition: width 1s; }
  .c-bar-muted { background: rgba(255,255,255,.14); }

  /* Corner brackets (hero) */
  .c-bracket { position: absolute; width: 22px; height: 22px; opacity: .55; }
  .c-bracket-tl { top: 20px; left: 20px; border-top: 2px solid #EBFF45; border-left: 2px solid #EBFF45; }
  .c-bracket-br { bottom: 20px; right: 20px; border-bottom: 2px solid #3a6e18; border-right: 2px solid #3a6e18; }

  /* Avatar */
  .c-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 620; flex-shrink: 0; background: rgba(235,255,69,.12); color: #EBFF45; border: 1px solid rgba(235,255,69,.2); }

  /* Animations */
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .fade-up-1 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .1s both; }
  .fade-up-2 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .2s both; }
  .fade-up-3 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .35s both; }
  .fade-up-4 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .5s both; }
`;

/* ─── Brand ────────────────────────────────────────────────────────── */
function BrandLogo() {
  return (
    <Link href="/" className="c-brand">
      <span className="c-mark" />
      Adryx
    </Link>
  );
}

/* ─── TopNav ───────────────────────────────────────────────────────── */
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`c-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="c-wrap c-row c-between" style={{ height: 60 }}>
        <BrandLogo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center" style={{ gap: 2 }}>
          {['Publishers', 'Advertisers', 'Docs', 'Pricing'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="c-nav-link">{l}</Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center" style={{ gap: 10 }}>
          <Link href="/login" className="c-btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>Sign in</Link>
          <Link href="/signup" className="c-btn-y" style={{ padding: '8px 18px', fontSize: 13 }}>Get started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          {open
            ? <CloseCircle size={22} color="#f87171" />
            : <HambergerMenu size={22} color="rgba(245,245,245,.7)" />
          }
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          background: 'rgba(8,8,10,.97)',
          borderTop: '1px solid rgba(255,255,255,.08)',
          padding: '16px 24px 20px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
            {['Publishers', 'Advertisers', 'Docs', 'Pricing'].map(l => (
              <Link
                key={l}
                href={`/${l.toLowerCase()}`}
                className="c-nav-link"
                onClick={() => setOpen(false)}
              >
                {l}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/login" className="c-btn-ghost" style={{ justifyContent: 'center', fontSize: 13 }} onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link href="/signup" className="c-btn-y" style={{ justifyContent: 'center', fontSize: 13 }} onClick={() => setOpen(false)}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero product mock (dark card) ───────────────────────────────── */
function HeroProductMock() {
  const pts = [0,18,10,35,22,28,30,45,40,38,50,52,60,44,70,62,80,55,90,68,100,60];
  const xs = pts.filter((_,i) => i%2===0);
  const ys = pts.filter((_,i) => i%2!==0);
  const W = 320, H = 80;
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scaleX = (x: number) => (x/100)*W;
  const scaleY = (y: number) => H - ((y-minY)/(maxY-minY))*(H*0.8) - H*0.1;
  const linePts = xs.map((x,i) => `${scaleX(x)},${scaleY(ys[i])}`).join(' ');
  const areaPath = `M${scaleX(xs[0])},${H} `+xs.map((x,i)=>`L${scaleX(x)},${scaleY(ys[i])}`).join(' ')+` L${scaleX(xs[xs.length-1])},${H} Z`;

  return (
    <div style={{ marginTop: 52, border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, overflow: 'hidden', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', background: 'rgba(255,255,255,.025)', boxShadow: '0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.07)' }}>
      {/* Browser chrome */}
      <div style={{ background: '#0f0f13', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        <span style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 6, height: 22, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 8, fontSize: 11, color: 'rgba(245,245,245,.3)', fontFamily: 'monospace' }}>
          app.adryx.io/publishers
        </span>
      </div>
      {/* Dashboard preview */}
      <div style={{ padding: '20px 24px' }}>
        <div className="c-row c-between" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(245,245,245,.38)', marginBottom: 3 }}>This week's earnings</div>
            <div style={{ fontSize: 28, fontWeight: 660, letterSpacing: '-0.03em', color: '#f5f5f5' }}>$12,847.20</div>
          </div>
          <span className="c-badge c-badge-ok"><span className="c-badge-dot" /> Settled</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', marginBottom: 16 }}>
          <defs>
            <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EBFF45" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EBFF45" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#hGrad)" />
          <polyline points={linePts} fill="none" stroke="#EBFF45" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[{ label: 'Impressions', value: '1.84M' }, { label: 'CTR', value: '1.92%' }, { label: 'eCPM', value: '$6.97' }].map(m => (
            <div key={m.label} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: 'rgba(245,245,245,.35)', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 580, letterSpacing: '-0.01em', color: '#f5f5f5' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const router = useRouter();
  return (
    <section className="c-section" style={{ textAlign: 'center', paddingTop: 88, paddingBottom: 72, background: '#08080a', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(235,255,69,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div className="c-wrap c-col" style={{ alignItems: 'center', gap: 0 }}>
        {/* Eyebrow */}
        <div className="c-eyebrow fade-up-1" style={{ marginBottom: 28 }}>
          <span className="c-dot" />
          New · USDC payouts now on Stellar
        </div>

        {/* Headline */}
        <h1 className="c-display-xl fade-up-2" style={{ maxWidth: 780, marginBottom: 22 }}>
          Internet advertising,<br />settled in stablecoins.
        </h1>

        {/* Description */}
        <p className="c-body-lg fade-up-3" style={{ maxWidth: 520, marginBottom: 36 }}>
          Adryx connects publishers and advertisers through a transparent, on-chain ad marketplace.
          Every impression attested. Every payout in USDC.
        </p>

        {/* CTAs */}
        <div className="c-row gap-3 fade-up-4" style={{ marginBottom: 28 }}>
          <button onClick={() => router.push('/signup')} className="c-btn-y lg">
            Start earning
          </button>
          <button onClick={() => router.push('/signup?role=advertiser')} className="c-btn-ghost lg">
            Run a campaign
          </button>
        </div>

        {/* Trust checks */}
        <div className="c-row" style={{ gap: 28, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: 'rgba(245,245,245,.45)' }}>
          {['No credit card required', 'Weekly USDC payouts', 'On-chain attestations'].map(t => (
            <span key={t} className="c-row gap-2">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="7.5" fill="rgba(235,255,69,.15)" /><path d="M4.5 7.5l2 2 4-4" stroke="#EBFF45" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t}
            </span>
          ))}
        </div>

        <HeroProductMock />
      </div>
    </section>
  );
}

/* ─── LogoBar ──────────────────────────────────────────────────────── */
function LogoBar() {
  const brands = ['StellarX', 'Lobstr', 'Aquarius', 'Ultrastellar', 'Stellar.org', 'Kado', 'MoneyGram', 'SDF', 'Bitso'];
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '36px 0', background: '#0f0f13' }}>
      <div className="c-wrap" style={{ textAlign: 'center' }}>
        <p className="c-label" style={{ marginBottom: 22 }}>Trusted by builders shipping the open internet</p>
        <div className="c-logo-strip">
          {brands.map(b => <span key={b}>{b}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ─── SplitSection ─────────────────────────────────────────────────── */
function SplitSection() {
  const router = useRouter();
  const cards = [
    {
      label: 'Publishers',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="10" cy="10" rx="4" ry="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M1.5 10h17" stroke="currentColor" strokeWidth="1.5" /></svg>,
      headline: 'Get paid for the attention your site earns',
      bullets: ['Embed one script tag — done', 'Real-time earnings dashboard', 'Weekly USDC payouts, on-chain', 'Human-verified impressions only'],
      primary: { label: 'See publisher app', href: '/publishers' },
      secondary: { label: 'Get the snippet', href: '/publishers/integrate' },
    },
    {
      label: 'Advertisers',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" /></svg>,
      headline: 'Reach real humans. Pay only for verified impressions.',
      bullets: ['Transparent on-chain spend', 'Contextual & wallet-based targeting', 'Real-time campaign analytics', 'No minimum budget'],
      primary: { label: 'See advertiser app', href: '/advertiser' },
      secondary: { label: 'Launch a campaign', href: '/advertiser/campaigns/new' },
    },
  ];

  return (
    <section className="c-section" style={{ background: '#08080a' }}>
      <div className="c-wrap">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="c-label" style={{ marginBottom: 12 }}>A two-sided network</p>
          <h2 className="c-display" style={{ maxWidth: 560, margin: '0 auto' }}>One protocol. Two sides. Aligned incentives.</h2>
        </div>
        <div className="c-grid-2">
          {cards.map(c => (
            <div key={c.label} className="c-card c-col" style={{ gap: 22 }}>
              <div className="accent-bar" />
              <div className="c-row gap-3" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(235,255,69,.1)', color: '#EBFF45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(235,255,69,.2)' }}>
                  {c.icon}
                </div>
                <div>
                  <p className="c-label" style={{ marginBottom: 5 }}>{c.label}</p>
                  <h3 className="c-h3">{c.headline}</h3>
                </div>
              </div>
              <ul className="c-col" style={{ gap: 8, padding: 0, listStyle: 'none', margin: 0 }}>
                {c.bullets.map(b => (
                  <li key={b} className="c-row gap-2 c-sm">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M3 7l3 3 5-5" stroke="#EBFF45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="c-row gap-2" style={{ marginTop: 'auto' }}>
                <Link href={c.primary.href} className="c-btn-y" style={{ padding: '9px 18px', fontSize: 13 }}>{c.primary.label}</Link>
                <Link href={c.secondary.href} className="c-btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>{c.secondary.label}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HowItWorks ───────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Publisher embeds Adryx', desc: 'One async script tag — no frameworks, no bundle impact.', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5l-3 4 3 4M13 5l3 4-3 4M10 3l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { n: '02', title: 'Auction runs in 38ms', desc: 'Second-price auction selects the winning bid in real-time.', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v4M9 12v4M5 6L2.5 3.5M13 12l2.5 2.5M2 9h4M12 9h4M5 12L2.5 14.5M13 6l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg> },
    { n: '03', title: 'Impression is attested', desc: 'Human verification proof is written on-chain. Bots earn nothing.', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C5 2 2 5 2 9s3 7 7 7 7-3 7-7-3-7-7-7z" stroke="currentColor" strokeWidth="1.5" /><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { n: '04', title: 'USDC settles weekly', desc: 'Every Friday, publisher balances sweep to their Stellar wallet in USDC via Soroban smart contracts.', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="10" r="1.5" fill="currentColor" /></svg> },
  ];

  return (
    <section className="c-section" style={{ background: '#0f0f13' }}>
      <div className="c-wrap">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="c-label" style={{ marginBottom: 12 }}>How Adryx works</p>
          <h2 className="c-display" style={{ maxWidth: 580, margin: '0 auto' }}>From ad request to settled payout — in one hop.</h2>
        </div>

        <div className="c-grid-4" style={{ marginBottom: 52 }}>
          {steps.map(s => (
            <div key={s.n} className="c-col" style={{ gap: 14 }}>
              <div className="c-row gap-3" style={{ alignItems: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(235,255,69,.1)', color: '#EBFF45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(235,255,69,.18)' }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 640, color: 'rgba(235,255,69,.6)', letterSpacing: '.08em' }}>{s.n}</span>
              </div>
              <h4 className="c-h4">{s.title}</h4>
              <p className="c-sm c-muted">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Code cards */}
        <div className="c-grid-2">
          <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,.02)' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 580, color: 'rgba(245,245,245,.45)' }}>Publisher integration</span>
            </div>
            <div className="c-code" style={{ borderRadius: 0, border: 'none', margin: 0 }}>
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

          <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,.02)' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 580, color: 'rgba(245,245,245,.45)' }}>Advertiser settlement</span>
            </div>
            <table className="c-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr><th>Tx hash</th><th>Date</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {[
                  { hash: '0x4f2a…9c1e', date: 'May 16', amt: '-$1,240.00' },
                  { hash: '0x8b1d…3a7f', date: 'May 9',  amt: '-$980.50' },
                  { hash: '0x2e9c…7b4d', date: 'May 2',  amt: '-$1,105.20' },
                  { hash: '0x6f3a…2c8e', date: 'Apr 25', amt: '-$870.00' },
                ].map(r => (
                  <tr key={r.hash}>
                    <td className="c-mono">{r.hash}</td>
                    <td className="c-muted">{r.date}</td>
                    <td style={{ fontWeight: 550, color: '#f5f5f5' }}>{r.amt}</td>
                    <td><span className="c-badge c-badge-ok"><span className="c-badge-dot" />Settled</span></td>
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

/* ─── Features ─────────────────────────────────────────────────────── */
function ProofVisual() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      {['Request', 'Auction', 'Attest', 'Settle'].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(235,255,69,.12)', color: '#EBFF45', fontSize: 11.5, fontWeight: 580, borderRadius: 6, padding: '4px 10px', border: '1px solid rgba(235,255,69,.2)' }}>{s}</div>
          {i < 3 && <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h10M9 1l4 4-4 4" stroke="rgba(245,245,245,.3)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
      ))}
    </div>
  );
}

function Features() {
  return (
    <section className="c-section" style={{ background: '#08080a' }}>
      <div className="c-wrap">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="c-label" style={{ marginBottom: 12 }}>Built for both sides</p>
          <h2 className="c-display" style={{ maxWidth: 520, margin: '0 auto' }}>The features that make Adryx work.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
          {/* Transparency — span 4 */}
          <div className="c-card" style={{ gridColumn: 'span 4', minHeight: 200 }}>
            <div className="accent-bar" />
            <p className="c-label" style={{ marginBottom: 8 }}>Transparency</p>
            <h3 className="c-h3" style={{ marginBottom: 12 }}>Every impression, proven on-chain.</h3>
            <p className="c-sm c-muted" style={{ marginBottom: 22, maxWidth: 440 }}>Each ad render writes an attestation to Stellar. Advertisers can verify every dollar spent; publishers can audit every cent earned.</p>
            <ProofVisual />
          </div>

          {/* Speed — span 2 */}
          <div className="c-card" style={{ gridColumn: 'span 2' }}>
            <div className="accent-bar" />
            <p className="c-label" style={{ marginBottom: 8 }}>Speed</p>
            <h3 className="c-h4" style={{ marginBottom: 18 }}>38ms median auction latency</h3>
            {[
              { label: 'Adryx', pct: 38, w: '38%', accent: true },
              { label: 'Incumbent A', pct: 180, w: '90%', accent: false },
              { label: 'Incumbent B', pct: 220, w: '100%', accent: false },
            ].map(b => (
              <div key={b.label} style={{ marginBottom: 10 }}>
                <div className="c-row c-between c-xs c-muted" style={{ marginBottom: 4 }}>
                  <span>{b.label}</span><span>{b.pct}ms</span>
                </div>
                <div className="c-bar-track">
                  <div className={`c-bar-fill${b.accent ? '' : ' c-bar-muted'}`} style={{ width: b.w }} />
                </div>
              </div>
            ))}
          </div>

          {/* Trust — span 2 */}
          <div className="c-card" style={{ gridColumn: 'span 2' }}>
            <div className="accent-bar" />
            <p className="c-label" style={{ marginBottom: 8 }}>Trust</p>
            <h3 className="c-h4" style={{ marginBottom: 18 }}>92% human traffic, verified</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="8" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="#EBFF45" strokeWidth="8"
                  strokeDasharray={`${2*Math.PI*28*0.92} ${2*Math.PI*28}`}
                  strokeDashoffset={2*Math.PI*28*0.25}
                  strokeLinecap="round" />
                <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill="#f5f5f5">92%</text>
              </svg>
              <div className="c-col" style={{ gap: 6 }}>
                <span className="c-xs c-muted"><span style={{ color: '#EBFF45', fontWeight: 620 }}>92%</span> Human verified</span>
                <span className="c-xs c-muted"><span style={{ color: '#f87171', fontWeight: 620 }}>8%</span> Filtered bots</span>
              </div>
            </div>
          </div>

          {/* Targeting — span 2 */}
          <div className="c-card" style={{ gridColumn: 'span 2' }}>
            <div className="accent-bar" />
            <p className="c-label" style={{ marginBottom: 8 }}>Targeting</p>
            <h3 className="c-h4" style={{ marginBottom: 14 }}>Wallet-based audience segments</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['XLM holders', 'USDC holders', 'Soroban users', 'AMM LPs', 'Anchor users', 'Stellar DEX'].map(t => (
                <span key={t} className="c-badge c-badge-acc">{t}</span>
              ))}
            </div>
          </div>

          {/* Payments — span 2 */}
          <div className="c-card" style={{ gridColumn: 'span 2' }}>
            <div className="accent-bar" />
            <p className="c-label" style={{ marginBottom: 8 }}>Payments</p>
            <h3 className="c-h4" style={{ marginBottom: 14 }}>Stellar USDC payouts</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'XLM',  color: '#000000', abbr: 'XLM' },
                { label: 'USDC', color: '#2775CA', abbr: '$' },
                { label: 'AQUA', color: '#00b4d8', abbr: 'AQ' },
                { label: 'yXLM', color: '#5e35b1', abbr: 'yX' },
              ].map(c => (
                <div key={c.label} title={c.label} style={{ width: 32, height: 32, borderRadius: '50%', background: c.color, border: '2px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {c.abbr}
                </div>
              ))}
            </div>
            <p className="c-xs c-muted" style={{ marginTop: 10 }}>Powered by Soroban smart contracts</p>
          </div>

          {/* Control — span 2 */}
          <div className="c-card" style={{ gridColumn: 'span 2' }}>
            <div className="accent-bar" />
            <p className="c-label" style={{ marginBottom: 8 }}>Control</p>
            <h3 className="c-h4" style={{ marginBottom: 14 }}>Brand safety allow/block list</h3>
            <div className="c-col" style={{ gap: 7 }}>
              {[{ t: 'Allow: crypto, DeFi, Web3', ok: true }, { t: 'Block: gambling, adult', ok: false }].map(r => (
                <div key={r.t} className="c-row gap-2 c-xs" style={{ color: r.ok ? '#4ade80' : '#f87171' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    {r.ok
                      ? <><circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.1" /><path d="M4 6.5l2 2 3-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></>
                      : <><circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.1" /><path d="M4.5 4.5l4 4M8.5 4.5l-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></>}
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

/* ─── Stats ────────────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: '$28.4M', label: 'Paid to publishers' },
    { value: '4.2B',   label: 'Impressions verified' },
    { value: '12,400', label: 'Active publisher sites' },
    { value: '78%',    label: 'Revenue share' },
  ];
  return (
    <div style={{ background: '#0d0d11', padding: '56px 0', borderTop: '1px solid rgba(255,255,255,.07)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
      <div className="c-wrap">
        <div className="c-grid-4">
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div className="c-stat-val">{s.value}</div>
              <div className="c-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Compare ──────────────────────────────────────────────────────── */
function Compare() {
  const rows: [string, boolean | string, boolean | string][] = [
    ['On-chain attestations',      true, false],
    ['USDC payouts',               true, false],
    ['No middlemen',               true, false],
    ['Real-time analytics',        true, true],
    ['78% publisher revenue share',true, false],
    ['Human verification',         true, 'Partial'],
    ['Transparent auction',        true, false],
  ];

  const check = (v: boolean | string) =>
    v === true  ? <span style={{ color: '#4ade80', fontWeight: 640 }}>✓</span>
    : v === false ? <span style={{ color: '#f87171' }}>✕</span>
    : <span style={{ color: '#fbbf24', fontSize: 12 }}>{v}</span>;

  return (
    <section className="c-section-tight" style={{ background: '#08080a' }}>
      <div className="c-wrap">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="c-label" style={{ marginBottom: 12 }}>Compare</p>
          <h2 className="c-h1">Adryx vs. incumbent ad networks</h2>
        </div>
        <div style={{ maxWidth: 680, margin: '0 auto', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, overflow: 'hidden' }}>
          <table className="c-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th style={{ color: '#EBFF45' }}>Adryx</th>
                <th>Incumbent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, adryx, other]) => (
                <tr key={label as string}>
                  <td style={{ fontWeight: 480, color: 'rgba(245,245,245,.72)' }}>{label as string}</td>
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

/* ─── Testimonials ─────────────────────────────────────────────────── */
function Testimonials() {
  const quotes = [
    { quote: 'Switching to Adryx doubled our effective CPM and we actually get paid on time — every Friday, in USDC.', name: 'Marina Voss', title: 'Head of Revenue, Tessera Wire', initials: 'MV' },
    { quote: 'The transparency is unreal. I can verify every impression we paid for on Stellar. No more trusting a black box.', name: 'Daniel Park', title: 'Growth Lead, Onchain Labs', initials: 'DP' },
    { quote: 'Our DeFi audience segment performed 3x better than generic programmatic. Wallet-based targeting is a game-changer.', name: 'Asha Rao', title: 'Marketing Director, Meridian Finance', initials: 'AR' },
  ];
  return (
    <section className="c-section-tight" style={{ background: '#0f0f13' }}>
      <div className="c-wrap">
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p className="c-label" style={{ marginBottom: 12 }}>Testimonials</p>
          <h2 className="c-h1">What our partners say</h2>
        </div>
        <div className="c-grid-3">
          {quotes.map(q => (
            <div key={q.name} className="c-card c-col" style={{ gap: 22 }}>
              <div className="accent-bar" />
              <p className="c-body" style={{ flex: 1 }}>"{q.quote}"</p>
              <div className="c-row gap-3">
                <div className="c-avatar">{q.initials}</div>
                <div>
                  <p className="c-sm" style={{ fontWeight: 560, color: '#f5f5f5', marginBottom: 2 }}>{q.name}</p>
                  <p className="c-xs c-muted">{q.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTAFinal ─────────────────────────────────────────────────────── */
function CTAFinal() {
  const router = useRouter();
  return (
    <section className="c-section" style={{ textAlign: 'center', background: '#08080a', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse,rgba(235,255,69,.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="c-wrap c-col" style={{ alignItems: 'center', gap: 24 }}>
        <div className="c-eyebrow"><span className="c-dot" />No setup fee</div>
        <h2 className="c-display" style={{ maxWidth: 480, margin: 0 }}>Ready when you are.</h2>
        <p className="c-body-lg" style={{ maxWidth: 440, margin: 0 }}>
          Join 12,400 publishers earning in USDC and hundreds of advertisers reaching verified on-chain audiences.
        </p>
        <div className="c-row gap-3">
          <button onClick={() => router.push('/signup')} className="c-btn-y lg">Create free account</button>
          <button onClick={() => router.push('/docs')} className="c-btn-ghost lg">Read the docs</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────── */
function SiteFooter() {
  const cols = {
    Product:    [{ label: 'Features', href: '/features' }, { label: 'How it works', href: '/#how-it-works' }, { label: 'Pricing', href: '/pricing' }, { label: 'Changelog', href: '#' }],
    Developers: [{ label: 'Documentation', href: '/docs' }, { label: 'SDK reference', href: '/docs' }, { label: 'GitHub', href: 'https://github.com' }, { label: 'Status', href: '#' }],
    Company:    [{ label: 'About', href: '/about' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '/contact' }, { label: 'Contact', href: '/contact' }],
    Legal:      [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Cookie policy', href: '#' }, { label: 'DPA', href: '#' }],
  };
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', background: '#0a0a0c', padding: '56px 0 32px' }}>
      <div className="c-wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 32, marginBottom: 48 }}>
          <div className="c-col" style={{ gap: 14 }}>
            <BrandLogo />
            <p className="c-sm c-muted" style={{ maxWidth: 240 }}>Internet advertising, settled in stablecoins. USDC payouts on Stellar for every verified impression.</p>
          </div>
          {Object.entries(cols).map(([group, links]) => (
            <div key={group}>
              <p className="c-label" style={{ marginBottom: 16 }}>{group}</p>
              <div className="c-col" style={{ gap: 9 }}>
                {links.map(l => (
                  <Link key={l.label} href={l.href} className="c-sm" style={{ color: 'rgba(245,245,245,.42)', textDecoration: 'none', transition: 'color .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,245,245,.75)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,.42)')}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p className="c-xs c-muted">© 2026 Adryx. All rights reserved.</p>
          <div className="c-row gap-4">
            {[{ label: 'Help', href: '/contact' }, { label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }].map(l => (
              <Link key={l.label} href={l.href} className="c-xs c-muted" style={{ textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: '#08080a', minHeight: '100vh', color: '#f5f5f5', fontFamily: 'var(--font-manrope, var(--font-inter, system-ui, sans-serif))' }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
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
    </div>
  );
}
