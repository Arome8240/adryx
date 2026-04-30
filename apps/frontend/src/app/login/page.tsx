"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { TickCircle, Eye, EyeSlash } from "iconsax-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading, user } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "advertiser" as "advertiser" | "publisher",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(user.role === "publisher" ? "/publishers" : "/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      // redirect handled by useEffect above once user is set
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });
      setSuccess("Account created! Redirecting…");
      // redirect handled by useEffect once user is set
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07070f] via-[#0a0a14] to-[#07070f] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Adryx
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-white/60">
            {mode === "login"
              ? "Sign in to manage your campaigns"
              : "Join the decentralized ad network"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === "register"
                  ? "bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
              <TickCircle size={16} color="#4ade80" variant="Bold" />
              <p className="text-emerald-400 text-sm">{success}</p>
            </div>
          )}

          {/* Email Login */}
          {mode === "login" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlash size={18} color="currentColor" />
                    ) : (
                      <Eye size={18} color="currentColor" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* Register */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={8}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlash size={18} color="currentColor" />
                    ) : (
                      <Eye size={18} color="currentColor" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  I am a…
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "advertiser" | "publisher",
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                >
                  <option value="advertiser">Advertiser</option>
                  <option value="publisher">Publisher</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
