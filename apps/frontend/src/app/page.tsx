'use client';

import { useState } from 'react';
import { Globe, Megaphone, Check, ArrowRight } from 'lucide-react';

function BrandLogo() {
  return (
    <div className="brand">
      <span className="mark mark-acc" />
      Adryx
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'publisher' | 'advertiser' | ''>('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !role) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 800);
  }

  if (done) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '32px 28px',
          background: 'var(--c-ok-soft)',
          border: '1px solid rgba(21,128,61,.15)',
          borderRadius: 14,
          maxWidth: 420,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--c-ok)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <Check size={22} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6, color: 'var(--c-fg)' }}>
          You&apos;re on the list!
        </div>
        <p style={{ fontSize: 14, color: 'var(--c-fg-3)', lineHeight: 1.5, margin: 0 }}>
          We&apos;ll reach out to <strong>{email}</strong> when early access opens for {role === 'publisher' ? 'publishers' : 'advertisers'}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 420,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Role selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {(['publisher', 'advertiser'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            style={{
              padding: '10px 14px',
              borderRadius: 9,
              border: `2px solid ${role === r ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
              background: role === r ? 'var(--c-acc-soft)' : 'transparent',
              cursor: 'pointer',
              fontWeight: 520,
              fontSize: 14,
              color: role === r ? 'var(--c-acc-ink)' : 'var(--c-fg-3)',
              transition: 'all .12s',
              textTransform: 'capitalize',
            }}
          >
            {r === 'publisher'
              ? <><Globe size={14} style={{ display: 'inline', marginRight: 6 }} />Publisher</>
              : <><Megaphone size={14} style={{ display: 'inline', marginRight: 6 }} />Advertiser</>}
          </button>
        ))}
      </div>

      {/* Email + submit row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="input"
          style={{ flex: 1, fontSize: 14 }}
        />
        <button
          type="submit"
          disabled={loading || !role}
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', opacity: (!role || loading) ? 0.5 : 1 }}
        >
          {loading ? 'Joining…' : <><span>Join waitlist</span><ArrowRight size={14} style={{ marginLeft: 6 }} /></>}
        </button>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--c-fg-4)', textAlign: 'center', margin: 0 }}>
        No spam. Early access means early payouts.
      </p>
    </form>
  );
}

export default function ComingSoonPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--c-bg)',
      }}
    >
      {/* Minimal nav */}
      <nav
        style={{
          borderBottom: '1px solid var(--c-line)',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <BrandLogo />
        <span
          style={{
            fontSize: 12,
            fontWeight: 540,
            color: 'var(--c-fg-4)',
            letterSpacing: '.04em',
            textTransform: 'uppercase',
          }}
        >
          Private beta
        </span>
      </nav>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px',
          textAlign: 'center',
          gap: 0,
        }}
      >
        {/* Eyebrow pill */}
        <div className="eyebrow-pill" style={{ marginBottom: 28 }}>
          <span className="dot" />
          Launching soon · USDC on Base
        </div>

        {/* Headline */}
        <h1
          className="t-display-xl"
          style={{ maxWidth: 700, marginBottom: 18 }}
        >
          Internet advertising,<br />settled in stablecoins.
        </h1>

        {/* Sub */}
        <p
          className="t-body-lg"
          style={{ maxWidth: 480, marginBottom: 40, color: 'var(--c-fg-3)' }}
        >
          Adryx connects publishers and advertisers through a transparent,
          on-chain ad marketplace. Every impression attested. Every payout in USDC.
        </p>

        {/* Waitlist form */}
        <WaitlistForm />

        {/* Key promises */}
        <div
          style={{
            display: 'flex',
            gap: 28,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 48,
            fontSize: 13.5,
            color: 'var(--c-fg-3)',
          }}
        >
          {[
            '78% publisher revenue share',
            'Weekly USDC payouts',
            'On-chain impression proofs',
            'Zero setup fees',
          ].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--c-acc-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={10} color="var(--c-acc)" strokeWidth={2.5} />
              </span>
              {t}
            </span>
          ))}
        </div>

        {/* Dashboard preview mock */}
        <div
          style={{
            marginTop: 64,
            background: '#fff',
            border: '1px solid var(--c-line)',
            borderRadius: 14,
            boxShadow: '0 24px 64px -16px rgba(15,15,20,.12), 0 0 0 1px var(--c-line)',
            overflow: 'hidden',
            maxWidth: 640,
            width: '100%',
            opacity: 0.85,
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              background: 'var(--c-bg-2)',
              borderBottom: '1px solid var(--c-line)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
            <span
              style={{
                flex: 1,
                background: '#fff',
                border: '1px solid var(--c-line)',
                borderRadius: 6,
                height: 22,
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
                fontSize: 11,
                color: 'var(--c-fg-4)',
              }}
            >
              app.adryx.io/advertiser
            </span>
          </div>
          {/* Mock content */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--c-fg-4)', marginBottom: 3 }}>Good morning, Forecast Labs</div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>$24,140 spent this month</div>
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
                <div
                  key={m.label}
                  style={{
                    background: 'var(--c-bg-2)',
                    border: '1px solid var(--c-line)',
                    borderRadius: 8,
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontSize: 11, color: 'var(--c-fg-4)', marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 580, letterSpacing: '-0.01em' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--c-line)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          fontSize: 13,
          color: 'var(--c-fg-4)',
        }}
      >
        <span>© 2026 Adryx</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <a href="mailto:hello@adryx.io" style={{ color: 'var(--c-fg-4)' }}>hello@adryx.io</a>
      </footer>
    </div>
  );
}
