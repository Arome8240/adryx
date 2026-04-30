"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle, CloseCircle, ArrowLeft } from "iconsax-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Request failed");
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Adryx
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-white/60 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <TickCircle size={48} color="#4ade80" variant="Bold" />
              </div>
              <p className="text-white font-semibold">Check your email</p>
              <p className="text-white/50 text-sm">
                If an account exists for{" "}
                <span className="text-white">{email}</span>, a reset link has
                been sent.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-3 bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                  <CloseCircle size={16} color="#f87171" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors mx-auto"
          >
            <ArrowLeft size={14} color="currentColor" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
