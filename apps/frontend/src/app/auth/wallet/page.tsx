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

/* ─── Wallet configs ───────────────────────────────────────────────── */
const WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Available as browser extension',
    color: '#f6851b',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21.5 2L13.6 8l1.5-3.5L21.5 2z" fill="#E2761B" />
        <path d="M2.5 2l7.8 6.1-1.4-3.6L2.5 2z" fill="#E4761B" />
        <path d="M18.7 16.8l-2.1 3.2 4.5 1.2 1.3-4.3-3.7-.1z" fill="#E4761B" />
        <path d="M1.6 16.9l1.3 4.3 4.5-1.2-2.1-3.2-3.7.1z" fill="#E4761B" />
        <path d="M7.1 10.6L5.8 12.5l4.8.2-.2-5.2-3.3 3.1z" fill="#E4761B" />
        <path d="M16.9 10.6l-3.4-3.2-.1 5.3 4.8-.2-1.3-1.9z" fill="#E4761B" />
        <path d="M7.4 20l2.9-1.4-2.5-1.9-.4 3.3z" fill="#E4761B" />
        <path d="M13.7 18.6l2.9 1.4-.4-3.3-2.5 1.9z" fill="#E4761B" />
      </svg>
    ),
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Mobile app or browser extension',
    color: '#0052ff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#0052ff" />
        <circle cx="12" cy="12" r="4" fill="#fff" />
      </svg>
    ),
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect any mobile wallet',
    color: '#3b99fc',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6.1 8.8a8.2 8.2 0 0111.8 0l.4.4a.4.4 0 010 .6l-1.4 1.4a.2.2 0 01-.3 0l-.5-.5a5.7 5.7 0 00-8.2 0l-.5.5a.2.2 0 01-.3 0L5.7 9.8a.4.4 0 010-.6l.4-.4zm14.6 2.7l1.3 1.3a.4.4 0 010 .6l-5.7 5.7a.4.4 0 01-.6 0L12 15.3l-3.7 3.8a.4.4 0 01-.6 0L2 13.4a.4.4 0 010-.6l1.3-1.3a.4.4 0 01.6 0l3.8 3.7 3.7-3.7a.4.4 0 01.6 0l3.7 3.7 3.8-3.7a.4.4 0 01.6 0z" fill="#3b99fc" />
      </svg>
    ),
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    description: 'The fun, simple Ethereum wallet',
    color: '#ff6b6b',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="rw" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="33%" stopColor="#ffd166" />
            <stop offset="66%" stopColor="#06d6a0" />
            <stop offset="100%" stopColor="#118ab2" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#rw)" />
        <path d="M7 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M9 14c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Solana, Ethereum & Polygon',
    color: '#5340bf',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#5340bf" />
        <path d="M7 10.5c0-2.5 2-4.5 4.5-4.5H14c1.4 0 2.5 1.1 2.5 2.5S15.4 11 14 11h-1c-.6 0-1 .4-1 1s.4 1 1 1h.5c1.4 0 2.5 1.1 2.5 2.5S15.4 17 14 17h-2.5c-2.5 0-4.5-2-4.5-4.5" fill="#fff" fillOpacity=".9" />
      </svg>
    ),
  },
  {
    id: 'safe',
    name: 'Safe',
    description: 'Multi-signature smart account',
    color: '#12ff80',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#12ff80" />
        <path d="M8 12l3 3 5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ─── Spinner ──────────────────────────────────────────────────────── */
function Spinner({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="2" strokeOpacity=".3" />
      <path d="M9 2a7 7 0 017 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
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
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 260, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(37,99,235,.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Security card */}
        <div style={{
          background: '#fff', border: '1px solid var(--c-line)', borderRadius: 14,
          padding: '24px 22px', boxShadow: '0 12px 36px -8px rgba(15,15,20,.12)', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--c-ok-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 5v6c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5l-7-3z" stroke="var(--c-ok)" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7 10l2 2 4-4" stroke="var(--c-ok)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 560, color: 'var(--c-fg)', marginBottom: 2 }}>Non-custodial connection</div>
              <div style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>Your keys stay with you</div>
            </div>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {[
              'We never have access to your private keys',
              'Sign-in only — no transaction approval needed',
              'Revocable anytime from your wallet',
            ].map(t => (
              <div key={t} className="row gap-2 t-xs" style={{ color: 'var(--c-fg-3)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="6" cy="6" r="5.5" stroke="var(--c-ok)" />
                  <path d="M3.5 6l2 2 3-3" stroke="var(--c-ok)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* Quote */}
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,.8)', fontStyle: 'italic', marginBottom: 14 }}>
          "Connecting my wallet took ten seconds. Having it on-chain means I can verify every payout myself — no more trusting the black box."
        </p>
        <div className="row gap-3">
          <div className="avatar" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontWeight: 600, fontSize: 12, borderColor: 'rgba(255,255,255,.2)' }}>DP</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 540, color: '#fff' }}>Daniel Park</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Growth Lead, Onchain Labs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function WalletAuthPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState<string | null>(null);

  function handleConnect(walletId: string) {
    setConnecting(walletId);
    setTimeout(() => {
      router.push('/publishers');
    }, 1600);
  }

  return (
    <div className="auth-shell" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* ── Left ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px', background: '#fff', overflowY: 'auto' }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}><BrandLogo /></div>

          <h1 className="t-h1" style={{ marginBottom: 6 }}>Connect your wallet</h1>
          <p className="t-sm muted" style={{ marginBottom: 32 }}>
            Sign in with your crypto wallet. No password required.
          </p>

          <div className="col" style={{ gap: 10 }}>
            {WALLETS.map(wallet => {
              const isConnecting = connecting === wallet.id;
              const isDisabled = connecting !== null && !isConnecting;
              return (
                <button
                  key={wallet.id}
                  onClick={() => !connecting && handleConnect(wallet.id)}
                  disabled={isDisabled}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 10, cursor: isDisabled ? 'not-allowed' : 'pointer',
                    background: isConnecting ? `${wallet.color}10` : '#fff',
                    border: isConnecting ? `2px solid ${wallet.color}` : '1px solid var(--c-line-2)',
                    opacity: isDisabled ? 0.45 : 1,
                    transition: 'border-color .12s, background .12s',
                    width: '100%', textAlign: 'left',
                  }}
                >
                  {/* Color dot / icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, overflow: 'hidden',
                    background: `${wallet.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${wallet.color}25`, flexShrink: 0,
                  }}>
                    {wallet.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 550, color: 'var(--c-fg)', marginBottom: 1 }}>{wallet.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>{wallet.description}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {isConnecting ? (
                      <Spinner color={wallet.color} />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="var(--c-fg-4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Link href="/login" className="row gap-1 t-sm" style={{ color: 'var(--c-fg-3)', justifyContent: 'center', display: 'inline-flex' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 12L4 7l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel />
    </div>
  );
}
