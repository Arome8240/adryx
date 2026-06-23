'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { URLS, navigateTo, makeAuthRedirect } from '@/lib/urls';

/* ── Icons ── */
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 4.5V3a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="13" cy="11" r="1" fill="currentColor"/>
    </svg>
  );
}
function EyeIcon({ open }: { open: boolean }) {
  return open
    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
}

/* ── Brand logo ── */
function BrandLogo() {
  return (
    <Link href={URLS.home} style={{ display:'inline-flex', alignItems:'center', gap:9, fontWeight:560, letterSpacing:'-0.02em', fontSize:18, color:'#f5f5f5', textDecoration:'none' }}>
      <div style={{ width:24, height:24, borderRadius:6, background:'#EBFF45', position:'relative', flexShrink:0 }}>
        <div style={{ position:'absolute', top:4, left:4, width:8, height:8, background:'#08080a', borderRadius:'2px 0 0 0' }}/>
      </div>
      Adryx
    </Link>
  );
}

/* ── Yellow sparkline ── */
function Sparkline() {
  const vals = [28, 42, 35, 55, 48, 62, 58, 72, 65, 80];
  const W = 180, H = 42;
  const min = Math.min(...vals), max = Math.max(...vals);
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - ((v - min) / (max - min)) * (H * 0.78) - H * 0.1}`).join(' ');
  const area = `M0,${H} ` + vals.map((v, i) => `L${(i / (vals.length - 1)) * W},${H - ((v - min) / (max - min)) * (H * 0.78) - H * 0.1}`).join(' ') + ` L${W},${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:'block' }}>
      <defs>
        <linearGradient id="lg-login" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EBFF45" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#EBFF45" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg-login)"/>
      <polyline points={pts} fill="none" stroke="#EBFF45" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Stats card ── */
function StatsCard() {
  return (
    <div style={{ position:'relative', overflow:'hidden', border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.025)', borderRadius:12, padding:'20px 22px', marginBottom:28 }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:'#EBFF45', borderRadius:'12px 0 0 12px' }}/>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <div style={{ fontSize:10.5, color:'rgba(245,245,245,.38)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>Weekly payout</div>
          <div style={{ fontSize:28, fontWeight:620, letterSpacing:'-0.025em', color:'#f5f5f5', fontFamily:'var(--f-display)' }}>$8,420.10</div>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:5, height:22, padding:'0 8px', borderRadius:999, background:'rgba(74,222,128,.12)', border:'1px solid rgba(74,222,128,.2)', fontSize:11, fontWeight:550, color:'#4ade80' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80' }}/>
          Settled
        </div>
      </div>
      <Sparkline/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:14, marginBottom:10 }}>
        {[{ label:'Impressions', value:'1.2M' }, { label:'CTR', value:'1.84%' }, { label:'eCPM', value:'$3.05' }].map(m => (
          <div key={m.label} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:8, padding:'8px 10px' }}>
            <div style={{ fontSize:10, color:'rgba(245,245,245,.32)', marginBottom:3 }}>{m.label}</div>
            <div style={{ fontSize:14, fontWeight:560, color:'#f5f5f5' }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:10.5, color:'rgba(245,245,245,.28)', fontFamily:'var(--f-mono)' }}>TX: 0x4f2a…9c1e · Base</div>
    </div>
  );
}

/* ── Quote ── */
function Quote() {
  return (
    <div>
      <p style={{ fontSize:14, lineHeight:1.62, color:'rgba(245,245,245,.55)', fontStyle:'italic', marginBottom:14 }}>
        "The weekly USDC drop is the most boring — and best — part of our finance week."
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(235,255,69,.12)', border:'1px solid rgba(235,255,69,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11.5, fontWeight:600, color:'#EBFF45', flexShrink:0 }}>MV</div>
        <div>
          <div style={{ fontSize:13, fontWeight:540, color:'rgba(245,245,245,.85)' }}>Marina Voss</div>
          <div style={{ fontSize:11.5, color:'rgba(245,245,245,.35)' }}>Head of Revenue, Tessera Wire</div>
        </div>
      </div>
    </div>
  );
}

/* ── Right panel ── */
function RightPanel() {
  return (
    <div className="hidden lg:flex" style={{ background:'#08080a', flexDirection:'column', justifyContent:'center', padding:'56px 52px', minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'15%', left:'35%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(235,255,69,.07) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'18%', right:'5%', width:240, height:240, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(59,130,246,.05) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'relative', zIndex:1 }}>
        <StatsCard/>
        <Quote/>
      </div>
    </div>
  );
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/* ── Login page ── */
export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const { token, refreshToken } = useAuth.getState();
      const dest = user.role === 'publisher' ? URLS.publishers : URLS.dashboard;
      navigateTo(makeAuthRedirect(dest, token!, refreshToken));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  function handleOAuth(provider: 'google' | 'github') {
    window.location.href = `${API_BASE}/auth/${provider}`;
  }

  return (
    <div className="auth-shell grid grid-cols-1 lg:grid-cols-2" style={{ minHeight:'100vh', background:'#08080a' }}>
      {/* ── Left ── */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'56px 64px', background:'#0f0f13', borderRight:'1px solid rgba(255,255,255,.06)', overflowY:'auto' }}>
        <div style={{ maxWidth:400, width:'100%', margin:'0 auto' }}>
          {/* Logo */}
          <div style={{ marginBottom:40 }}><BrandLogo/></div>

          <h1 style={{ fontSize:28, fontWeight:560, letterSpacing:'-0.022em', color:'#f5f5f5', marginBottom:6, fontFamily:'var(--f-display)' }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'rgba(245,245,245,.5)', marginBottom:32 }}>Sign in to your Adryx account</p>

          {/* Social buttons */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
            <button className="c-btn-ghost" style={{ width:'100%', justifyContent:'center', gap:10 }} onClick={() => handleOAuth('google')}>
              <GoogleIcon/> Continue with Google
            </button>
            <button className="c-btn-ghost" style={{ width:'100%', justifyContent:'center', gap:10 }} onClick={() => handleOAuth('github')}>
              <GitHubIcon/> Continue with GitHub
            </button>
            <button
              className="c-btn-ghost"
              style={{ width:'100%', justifyContent:'center', gap:10 }}
              onClick={() => navigateTo('/auth/wallet')}
            >
              <WalletIcon/> Connect Stellar wallet
            </button>
          </div>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22, color:'rgba(245,245,245,.28)', fontSize:12 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }}/>
            or
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }}/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:16 }}>
            {error && (
              <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.2)', borderRadius:8, padding:'10px 14px', fontSize:13.5, color:'#f87171' }}>
                {error}
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Work email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="c-input" placeholder="you@company.com"
              />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize:12.5, color:'#EBFF45', fontWeight:500 }}>Forgot password?</Link>
              </div>
              <div className="c-input-wrap">
                <input
                  type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="c-input" placeholder="••••••••"
                />
                <button type="button" className="c-input-btn" onClick={() => setShowPwd(v => !v)}>
                  <EyeIcon open={showPwd}/>
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="c-btn-y" style={{ width:'100%', justifyContent:'center', marginTop:4, height:46 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13.5, color:'rgba(245,245,245,.45)' }}>
            New to Adryx?{' '}
            <Link href="/signup" style={{ color:'#EBFF45', fontWeight:520 }}>Create an account</Link>
          </p>

          {/* Footer */}
          <div style={{ marginTop:48, paddingTop:24, borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:12, color:'rgba(245,245,245,.25)' }}>© 2026 Adryx</span>
            <div style={{ display:'flex', gap:16 }}>
              {[{ l:'Help', h:URLS.contact }, { l:'Privacy', h:URLS.privacy }, { l:'Terms', h:URLS.terms }].map(i => (
                <Link key={i.l} href={i.h} style={{ fontSize:12, color:'rgba(245,245,245,.3)' }}>{i.l}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel/>
    </div>
  );
}
