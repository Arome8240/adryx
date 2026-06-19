'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

/* ── Right panel: mail card ── */
function RightPanel() {
  return (
    <div style={{ background:'#08080a', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'56px 52px', minHeight:'100vh', position:'relative', overflow:'hidden', textAlign:'center' }}>
      <div style={{ position:'absolute', top:'20%', left:'40%', transform:'translateX(-50%)', width:480, height:480, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(235,255,69,.06) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'20%', right:'10%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(59,130,246,.05) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'relative', zIndex:1, maxWidth:340 }}>
        {/* Mail icon card */}
        <div style={{ position:'relative', overflow:'hidden', border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.025)', borderRadius:16, padding:'36px 28px', marginBottom:28 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:'#EBFF45', borderRadius:'16px 0 0 16px' }}/>
          <div style={{ width:56, height:56, borderRadius:14, background:'rgba(235,255,69,.1)', border:'1px solid rgba(235,255,69,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', color:'#EBFF45' }}>
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M4 7h20v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M4 7l10 9 10-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{ fontSize:16, fontWeight:560, color:'#f5f5f5', marginBottom:8, letterSpacing:'-0.01em' }}>Reset link, sent in seconds</h3>
          <p style={{ fontSize:13.5, lineHeight:1.6, color:'rgba(245,245,245,.5)' }}>
            Enter your email and we'll send you a secure link to reset your password instantly.
          </p>
        </div>
        <p style={{ fontSize:12.5, color:'rgba(245,245,245,.28)', lineHeight:1.5 }}>
          Links expire in 30 minutes. Check your spam folder if you don't see it.
        </p>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/forgot-password`,
        { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ email }) },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Request failed');
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'100vh', background:'#08080a' }} className="auth-shell">
      {/* ── Left ── */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'56px 64px', background:'#0f0f13', borderRight:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth:400, width:'100%', margin:'0 auto' }}>
          <div style={{ marginBottom:40 }}><BrandLogo/></div>

          {sent ? (
            /* ── Sent state ── */
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:20 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" stroke="#4ade80" strokeWidth="1.6"/>
                  <path d="M8.5 14l4 4 7-7" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 style={{ fontSize:26, fontWeight:560, letterSpacing:'-0.02em', color:'#f5f5f5', fontFamily:'var(--f-display)' }}>Check your inbox</h1>
              <p style={{ fontSize:14, color:'rgba(245,245,245,.5)', lineHeight:1.6, maxWidth:300 }}>
                We sent a reset link to <strong style={{ color:'rgba(245,245,245,.85)', fontWeight:520 }}>{email}</strong>.
                It expires in 30 minutes.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="c-btn-y" style={{ width:'100%', justifyContent:'center', height:46 }}
              >
                Back to sign in
              </button>
              <button
                type="button"
                onClick={() => { setSent(false); setEmail(''); }}
                style={{ background:'none', border:'none', color:'rgba(245,245,245,.35)', cursor:'pointer', fontSize:13, padding:0 }}
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <h1 style={{ fontSize:28, fontWeight:560, letterSpacing:'-0.022em', color:'#f5f5f5', marginBottom:6, fontFamily:'var(--f-display)' }}>Forgot password?</h1>
              <p style={{ fontSize:14, color:'rgba(245,245,245,.45)', marginBottom:32, lineHeight:1.5 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {error && (
                  <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.2)', borderRadius:8, padding:'10px 14px', fontSize:13.5, color:'#f87171' }}>
                    {error}
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Email address</label>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="c-input" placeholder="you@company.com"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="c-btn-y" style={{ width:'100%', justifyContent:'center', height:46 }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div style={{ marginTop:24, textAlign:'center' }}>
                <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13.5, color:'rgba(245,245,245,.4)', textDecoration:'none' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 12L4 7l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right ── */}
      <RightPanel/>
    </div>
  );
}
