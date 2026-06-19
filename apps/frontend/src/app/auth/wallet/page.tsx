'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function FreighterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#5B8FF9"/>
      <path d="M7 8h6a3 3 0 010 6H7V8z" fill="#fff" fillOpacity=".9"/>
      <path d="M7 14h4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function LobstrIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0081C5"/>
      <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.6" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="#fff"/>
    </svg>
  );
}
function XBullIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1E293B"/>
      <path d="M7 7l5 5 5-5M7 17l5-5 5 5" stroke="#EBFF45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function StellarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#3E1BDB"/>
      <path d="M5 10l3.5-1.5L12 6l3.5 2.5L19 10M5 14l3.5 1.5L12 18l3.5-2.5L19 14M5 12h14" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Spinner ── */
function Spinner() {
  return (
    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(235,255,69,.2)', borderTopColor: '#EBFF45', animation: 'spin 0.7s linear infinite', flexShrink: 0 }}/>
  );
}

/* ── Brand logo ── */
function BrandLogo() {
  return (
    <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:9, fontWeight:560, letterSpacing:'-0.02em', fontSize:18, color:'#f5f5f5', textDecoration:'none' }}>
      <div style={{ width:24, height:24, borderRadius:6, background:'#EBFF45', position:'relative', flexShrink:0 }}>
        <div style={{ position:'absolute', top:4, left:4, width:8, height:8, background:'#08080a', borderRadius:'2px 0 0 0' }}/>
      </div>
      Adryx
    </Link>
  );
}

/* ── Right panel ── */
function RightPanel() {
  return (
    <div style={{ background:'#08080a', display:'flex', flexDirection:'column', justifyContent:'center', padding:'56px 52px', minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'18%', left:'35%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(235,255,69,.07) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'relative', zIndex:1 }}>
        {/* Security card */}
        <div style={{ position:'relative', overflow:'hidden', border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.025)', borderRadius:12, padding:'22px', marginBottom:28 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:'#EBFF45', borderRadius:'12px 0 0 12px' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 5v6c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5l-7-3z" stroke="#4ade80" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M7 10l2 2 4-4" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:560, color:'#f5f5f5', marginBottom:2 }}>Non-custodial sign-in</div>
              <div style={{ fontSize:12, color:'rgba(245,245,245,.38)' }}>Your keys stay with you</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {[
              'We never see your private keys',
              'Sign-in only — no transaction approval',
              'Revocable anytime from your wallet',
            ].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:'rgba(245,245,245,.5)' }}>
                <div style={{ width:14, height:14, borderRadius:'50%', border:'1px solid rgba(74,222,128,.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 3.5l2 2 3-3" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:14, lineHeight:1.62, color:'rgba(245,245,245,.55)', fontStyle:'italic', marginBottom:14 }}>
          "Connecting my wallet took ten seconds. Every payout is on-chain so I can verify it myself."
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(235,255,69,.12)', border:'1px solid rgba(235,255,69,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11.5, fontWeight:600, color:'#EBFF45', flexShrink:0 }}>DP</div>
          <div>
            <div style={{ fontSize:13, fontWeight:540, color:'rgba(245,245,245,.85)' }}>Daniel Park</div>
            <div style={{ fontSize:11.5, color:'rgba(245,245,245,.35)' }}>Growth Lead, Onchain Labs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function WalletAuthPage() {
  const router = useRouter();
  const { walletLogin } = useAuth();
  const [status, setStatus] = useState<'idle' | 'connecting' | 'signing' | 'loading'>('idle');
  const [error, setError] = useState('');

  async function connectFreighter() {
    setError('');
    setStatus('connecting');

    try {
      if (!window.freighter) {
        setStatus('idle');
        setError('Freighter extension is not installed. Install it from freighter.app and refresh.');
        return;
      }

      const { isConnected } = await window.freighter.isConnected();
      if (!isConnected) {
        setStatus('idle');
        setError('Freighter is locked. Please unlock your wallet and try again.');
        return;
      }

      // Get public key (G-address)
      const publicKey = await window.freighter.getPublicKey();

      // Build sign message — includes timestamp to prevent replay attacks
      const message = `Sign in to Adryx\nAddress: ${publicKey}\nTimestamp: ${Date.now()}`;

      setStatus('signing');

      const { signedMessage } = await window.freighter.signMessage({ message });

      setStatus('loading');

      const user = await walletLogin(publicKey, signedMessage, message);
      router.push(user.role === 'publisher' ? '/publishers' : '/dashboard');
    } catch (err: unknown) {
      setStatus('idle');
      const msg = err instanceof Error ? err.message : String(err);
      // Freighter user-rejected errors
      if (msg.includes('User declined') || msg.includes('rejected') || msg.includes('cancelled')) {
        setError('Signature request cancelled.');
      } else {
        setError(msg || 'Connection failed. Please try again.');
      }
    }
  }

  const isWorking = status !== 'idle';
  const statusLabel = {
    connecting: 'Connecting…',
    signing: 'Waiting for signature…',
    loading: 'Signing in…',
    idle: '',
  }[status];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'100vh', background:'#08080a' }} className="auth-shell">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* ── Left ── */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'56px 64px', background:'#0f0f13', borderRight:'1px solid rgba(255,255,255,.06)', overflowY:'auto' }}>
        <div style={{ maxWidth:420, width:'100%', margin:'0 auto' }}>
          <div style={{ marginBottom:40 }}><BrandLogo/></div>

          <h1 style={{ fontSize:28, fontWeight:560, letterSpacing:'-0.022em', color:'#f5f5f5', marginBottom:6, fontFamily:'var(--f-display)' }}>Connect your wallet</h1>
          <p style={{ fontSize:14, color:'rgba(245,245,245,.45)', marginBottom:32 }}>
            Sign in with a Stellar wallet. No password required.
          </p>

          {/* Error banner */}
          {error && (
            <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.2)', borderRadius:10, padding:'12px 16px', fontSize:13.5, color:'#f87171', marginBottom:20, lineHeight:1.5 }}>
              {error}
            </div>
          )}

          {/* Status label */}
          {isWorking && (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(235,255,69,.06)', border:'1px solid rgba(235,255,69,.15)', borderRadius:10, padding:'12px 16px', fontSize:13.5, color:'rgba(235,255,69,.8)', marginBottom:20 }}>
              <Spinner/>
              {statusLabel}
            </div>
          )}

          {/* ── Freighter ── */}
          <button
            onClick={connectFreighter}
            disabled={isWorking}
            style={{
              display:'flex', alignItems:'center', gap:14,
              padding:'14px 16px', borderRadius:12, cursor: isWorking ? 'not-allowed' : 'pointer',
              background: isWorking ? 'rgba(91,143,249,.1)' : 'rgba(255,255,255,.04)',
              border: isWorking ? '1.5px solid rgba(91,143,249,.4)' : '1px solid rgba(255,255,255,.09)',
              width:'100%', textAlign:'left', marginBottom:10,
              transition:'border-color .12s, background .12s',
              opacity: isWorking ? 0.85 : 1,
            }}
          >
            <div style={{ width:44, height:44, borderRadius:10, overflow:'hidden', background:'rgba(91,143,249,.15)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(91,143,249,.25)', flexShrink:0 }}>
              <FreighterIcon/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:560, color:'rgba(245,245,245,.9)', marginBottom:2 }}>Freighter</div>
              <div style={{ fontSize:12, color:'rgba(245,245,245,.38)' }}>Stellar browser extension · freighter.app</div>
            </div>
            <div style={{ flexShrink:0 }}>
              {isWorking
                ? <Spinner/>
                : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="rgba(245,245,245,.3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </div>
          </button>

          {/* ── Other wallets — coming soon ── */}
          {([
            { name: 'Lobstr', desc: 'Popular Stellar mobile & web wallet', Icon: LobstrIcon },
            { name: 'xBull', desc: 'Open-source Stellar wallet', Icon: XBullIcon },
            { name: 'Stellar native', desc: 'Any Stellar Horizon-compatible wallet', Icon: StellarIcon },
          ] as const).map(({ name, desc, Icon }) => (
            <div
              key={name}
              style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 16px', borderRadius:12,
                background:'rgba(255,255,255,.02)',
                border:'1px solid rgba(255,255,255,.06)',
                width:'100%', marginBottom:8, opacity:0.45,
                position:'relative',
              }}
            >
              <div style={{ width:44, height:44, borderRadius:10, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:550, color:'rgba(245,245,245,.6)', marginBottom:2 }}>{name}</div>
                <div style={{ fontSize:12, color:'rgba(245,245,245,.28)' }}>{desc}</div>
              </div>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(235,255,69,.5)', border:'1px solid rgba(235,255,69,.18)', borderRadius:4, padding:'2px 6px' }}>
                Soon
              </span>
            </div>
          ))}

          <p style={{ fontSize:12.5, color:'rgba(245,245,245,.28)', textAlign:'center', marginTop:18, lineHeight:1.6 }}>
            Don't have a Stellar wallet?{' '}
            <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" style={{ color:'#EBFF45' }}>
              Install Freighter
            </a>
          </p>

          <div style={{ marginTop:28, textAlign:'center' }}>
            <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13.5, color:'rgba(245,245,245,.38)', textDecoration:'none' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 12L4 7l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel/>
    </div>
  );
}
