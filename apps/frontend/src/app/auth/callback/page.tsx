"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (!token) {
      setError("Authentication failed — no token received.");
      return;
    }

    try {
      localStorage.setItem("accessToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    } catch {
      // localStorage may be unavailable (private browsing, etc.)
    }

    // Redirect to dashboard
    router.replace("/publishers");
  }, [params, router]);

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#08080a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,80,80,.2)",
            borderRadius: 16,
            padding: "32px 40px",
            textAlign: "center",
            maxWidth: 420,
          }}
        >
          <p style={{ color: "#f87171", fontWeight: 600, marginBottom: 8 }}>Sign-in error</p>
          <p style={{ color: "rgba(245,245,245,.5)", fontSize: 14 }}>{error}</p>
          <a
            href="/login"
            className="c-btn-y"
            style={{ display: "inline-block", marginTop: 20, fontSize: 14 }}
          >
            Back to sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08080a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2.5px solid rgba(235,255,69,.15)",
          borderTopColor: "#EBFF45",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <p style={{ color: "rgba(245,245,245,.45)", fontSize: 14 }}>Signing you in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  );
}
