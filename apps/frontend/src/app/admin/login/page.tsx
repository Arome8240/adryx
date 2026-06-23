"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { URLS, navigateTo, makeAuthRedirect } from "@/lib/urls";
import { Eye, EyeSlash, Shield } from "iconsax-react";

export default function AdminLoginPage() {
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Already authenticated admin → go straight to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigateTo(URLS.adminDashboard);
    }
  }, [isAuthenticated, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "admin") {
        // Signed in successfully but not an admin — reject
        useAuth.getState().logout();
        setError("This portal is restricted to administrators.");
        return;
      }
      const { token, refreshToken } = useAuth.getState();
      navigateTo(makeAuthRedirect(URLS.adminDashboard, token!, refreshToken));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#a855f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Shield size={26} color="#ffffff" variant="Bold" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", margin: 0, letterSpacing: "-0.02em" }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: 13, color: "rgba(245,245,245,.4)", marginTop: 6 }}>
            Restricted access — authorized personnel only
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 20,
            padding: "32px 28px",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(245,245,245,.5)", marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 12,
                  color: "#f5f5f5",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(168,85,247,.5)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,.1)"; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(245,245,245,.5)", marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 44px 11px 14px",
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    color: "#f5f5f5",
                    fontSize: 14,
                    outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(168,85,247,.5)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,.1)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                  tabIndex={-1}
                >
                  {showPwd
                    ? <EyeSlash size={16} color="rgba(245,245,245,.35)" />
                    : <Eye      size={16} color="rgba(245,245,245,.35)" />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(248,113,113,.08)",
                  border: "1px solid rgba(248,113,113,.2)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "12px",
                background: loading ? "rgba(168,85,247,.5)" : "#a855f7",
                border: "none",
                borderRadius: 12,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
                letterSpacing: "-0.01em",
              }}
            >
              {loading ? "Signing in…" : "Sign in to Admin Portal"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "rgba(245,245,245,.2)" }}>
          Not an admin?{" "}
          <a href={URLS.login} style={{ color: "rgba(168,85,247,.6)", textDecoration: "none" }}>
            Go to regular sign in
          </a>
        </p>
      </div>
    </div>
  );
}
