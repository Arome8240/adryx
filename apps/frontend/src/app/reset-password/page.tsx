"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TickCircle, CloseCircle, Eye, EyeSlash } from "iconsax-react";
import Link from "next/link";

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

/* ── Right panel: shield card ── */
function RightPanel() {
  return (
    <div style={{ background:'#08080a', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'56px 52px', minHeight:'100vh', position:'relative', overflow:'hidden', textAlign:'center' }}>
      <div style={{ position:'absolute', top:'20%', left:'40%', transform:'translateX(-50%)', width:480, height:480, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(235,255,69,.06) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'20%', right:'10%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(74,222,128,.05) 0%, transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'relative', zIndex:1, maxWidth:340 }}>
        <div style={{ position:'relative', overflow:'hidden', border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.025)', borderRadius:16, padding:'36px 28px', marginBottom:28 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:'#EBFF45', borderRadius:'16px 0 0 16px' }}/>
          <div style={{ width:56, height:56, borderRadius:14, background:'rgba(235,255,69,.1)', border:'1px solid rgba(235,255,69,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', color:'#EBFF45' }}>
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L5 7v8c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{ fontSize:16, fontWeight:560, color:'#f5f5f5', marginBottom:8, letterSpacing:'-0.01em' }}>You're almost there</h3>
          <p style={{ fontSize:13.5, lineHeight:1.6, color:'rgba(245,245,245,.5)' }}>
            Choose a strong password. We recommend at least 12 characters with a mix of letters and numbers.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {['Your password is encrypted end-to-end', 'Reset links are single-use only', 'You\'ll be signed in after resetting'].map(t => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, color:'rgba(245,245,245,.35)' }}>
              <div style={{ width:14, height:14, borderRadius:'50%', border:'1px solid rgba(74,222,128,.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <path d="M1 3.5l2 2 3-3" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Missing reset token. Please request a new link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords don't match");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/auth/reset-password`,
        { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ token, newPassword: password }) },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || "Reset failed");
      }
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
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

          {done ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:20 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <TickCircle size={32} color="#4ade80" variant="Bold"/>
              </div>
              <h1 style={{ fontSize:26, fontWeight:560, letterSpacing:'-0.02em', color:'#f5f5f5', fontFamily:'var(--f-display)' }}>Password reset!</h1>
              <p style={{ fontSize:14, color:'rgba(245,245,245,.5)', lineHeight:1.6 }}>
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="c-btn-y" style={{ width:'100%', justifyContent:'center', height:46 }}
              >
                Sign in
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize:28, fontWeight:560, letterSpacing:'-0.022em', color:'#f5f5f5', marginBottom:6, fontFamily:'var(--f-display)' }}>Set new password</h1>
              <p style={{ fontSize:14, color:'rgba(245,245,245,.45)', marginBottom:32 }}>
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {error && (
                  <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.2)', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
                    <CloseCircle size={16} color="#f87171"/>
                    <span style={{ fontSize:13.5, color:'#f87171' }}>{error}</span>
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>New password</label>
                  <div className="c-input-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required minLength={8}
                      placeholder="••••••••"
                      className="c-input"
                    />
                    <button type="button" className="c-input-btn" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <EyeSlash size={17} color="currentColor"/> : <Eye size={17} color="currentColor"/>}
                    </button>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:13, fontWeight:500, color:'rgba(245,245,245,.65)' }}>Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="c-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="c-btn-y" style={{ width:'100%', justifyContent:'center', height:46, marginTop:4 }}
                >
                  {loading ? "Resetting…" : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm/>
    </Suspense>
  );
}
