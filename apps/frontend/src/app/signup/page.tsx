'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { URLS, navigateTo, makeAuthRedirect } from '@/lib/urls';

/* ── Icons ── */
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
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3"/>
      <ellipse cx="9" cy="9" rx="3.5" ry="7.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1.5 9h15" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 1.5"/>
    </svg>
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
        <linearGradient id="lg-signup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EBFF45" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#EBFF45" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg-signup)"/>
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
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80' }}/>Settled
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

/* ── Benefits list ── */
function Benefits() {
  const items = [
    '$10 test impressions on signup',
    'Real-time analytics dashboard',
    'Weekly USDC payouts, on-chain',
    'SOC 2 Type II compliant',
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
      {items.map(item => (
        <div key={item} style={{ display:'flex', alignItems:'center', gap:10, color:'rgba(245,245,245,.6)', fontSize:13.5 }}>
          <div style={{ width:18, height:18, borderRadius:'50%', border:'1px solid rgba(235,255,69,.3)', background:'rgba(235,255,69,.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5l2 2 4-4" stroke="#EBFF45" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {item}
        </div>
      ))}
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
        <Benefits/>
      </div>
    </div>
  );
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/* ── Signup page ── */
export default function SignupPage() {
  const { register } = useAuth();
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
      const user = await register({ email, password, name, role });
      const { token, refreshToken } = useAuth.getState();
      const dest = user.role === 'publisher' ? URLS.publishers : URLS.dashboard;
      navigateTo(makeAuthRedirect(dest, token!, refreshToken));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
          <div style={{ marginBottom:36 }}><BrandLogo/></div>

          <h1 style={{ fontSize:28, fontWeight:560, letterSpacing:'-0.022em', color:'#f5f5f5', marginBottom:4, fontFamily:'var(--f-display)' }}>Create your account</h1>
          <p style={{ fontSize:14, color:'rgba(245,245,245,.45)', marginBottom:28 }}>Free to start. No credit card required.</p>

          {/* Role picker */}
          <div style={{ display:'flex', gap:10, marginBottom:24 }}>
            {([
              { value: 'publisher', label: 'Earn from my site', sub: 'Publisher', Icon: GlobeIcon },
              { value: 'advertiser', label: 'Run ad campaigns', sub: 'Advertiser', Icon: TargetIcon },
            ] as const).map(opt => {
              const active = role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    flex:1, padding:'12px 14px', borderRadius:10, cursor:'pointer', textAlign:'left',
                    border: active ? '1.5px solid rgba(235,255,69,.5)' : '1px solid rgba(255,255,255,.1)',
                    background: active ? 'rgba(235,255,69,.08)' : 'rgba(255,255,255,.04)',
                    transition:'border-color .12s, background .12s',
                  }}
                >
                  <div style={{ color: active ? '#EBFF45' : 'rgba(245,245,245,.35)', marginBottom:7 }}>
                    <opt.Icon/>
                  </div>
                  <div style={{ fontSize:13.5, fontWeight:550, color: active ? '#f5f5f5' : 'rgba(245,245,245,.7)', marginBottom:2 }}>{opt.label}</div>
                  <div style={{ fontSize:11.5, color: active ? 'rgba(235,255,69,.7)' : 'rgba(245,245,245,.3)' }}>{opt.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:16 }}>
            {error && (
              <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.2)', borderRadius:8, padding:'10px 14px', fontSize:13.5, color:'#f87171' }}>
                {error}
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Full name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="c-input" placeholder="Ada Lovelace"/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Work email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="c-input" placeholder="you@company.com"/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Password</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="c-input" placeholder="Min. 8 characters"/>
            </div>
            <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', userSelect:'none', fontSize:13.5, color:'rgba(245,245,245,.5)' }}>
              <input
                type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                style={{ width:14, height:14, marginTop:2, accentColor:'#EBFF45', cursor:'pointer', flexShrink:0 }}
              />
              <span>
                I agree to the{' '}
                <Link href={URLS.terms} style={{ color:'#EBFF45' }}>Terms</Link>
                {' '}&amp;{' '}
                <Link href={URLS.privacy} style={{ color:'#EBFF45' }}>Privacy Policy</Link>
              </span>
            </label>
            <button
              type="submit" disabled={loading}
              className="c-btn-y" style={{ width:'100%', justifyContent:'center', marginTop:4, height:46 }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Social */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, color:'rgba(245,245,245,.28)', fontSize:12 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }}/>
            or
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }}/>
          </div>
          <div style={{ display:'flex', gap:10, marginBottom:22 }}>
            <button className="c-btn-ghost" style={{ flex:1, justifyContent:'center', gap:8, height:40, fontSize:13.5 }} onClick={() => handleOAuth('google')}>
              <GoogleIcon/> Google
            </button>
            <button className="c-btn-ghost" style={{ flex:1, justifyContent:'center', gap:8, height:40, fontSize:13.5 }} onClick={() => handleOAuth('github')}>
              <GitHubIcon/> GitHub
            </button>
          </div>

          <p style={{ textAlign:'center', fontSize:13.5, color:'rgba(245,245,245,.45)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color:'#EBFF45', fontWeight:520 }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel/>
    </div>
  );
}
