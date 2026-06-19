"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function Spinner() {
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

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const { setFromOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get("token");
    const refreshToken = params.get("refreshToken") ?? undefined;

    if (!token) {
      setError("Authentication failed — no token received.");
      return;
    }

    setFromOAuth(token, refreshToken)
      .then((user) => {
        router.replace(user.role === "publisher" ? "/publishers" : "/dashboard");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      });
  }, [params, router, setFromOAuth]);

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
            border: "1px solid rgba(248,113,113,.2)",
            borderRadius: 16,
            padding: "32px 40px",
            textAlign: "center",
            maxWidth: 420,
          }}
        >
          <p style={{ color: "#f87171", fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
            Sign-in failed
          </p>
          <p style={{ color: "rgba(245,245,245,.5)", fontSize: 14, marginBottom: 20 }}>{error}</p>
          <a href="/login" className="c-btn-y" style={{ display: "inline-block", fontSize: 14 }}>
            Back to sign in
          </a>
        </div>
      </main>
    );
  }

  return <Spinner />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
