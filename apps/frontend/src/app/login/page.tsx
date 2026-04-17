'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/hooks/useAuth';
import { sign } from 'tweetnacl';
import bs58 from 'bs58';
import { TickCircle } from 'iconsax-react';

export default function LoginPage() {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const { login, walletLogin, register, isAuthenticated, isLoading } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register' | 'wallet'>('wallet');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'advertiser' as 'advertiser' | 'publisher',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleWalletLogin = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError('');
      const message = `Sign this message to authenticate with Adryx.\n\nWallet: ${publicKey.toString()}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      await walletLogin(publicKey.toString(), signatureBase58, message);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with wallet');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        walletAddress: publicKey?.toString(),
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07070f] via-[#0a0a14] to-[#07070f] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Adryx</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to manage your campaigns</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => setMode('wallet')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === 'wallet'
                  ? 'bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Wallet Login */}
          {mode === 'wallet' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-4">
                  Connect your Solana wallet to get started
                </p>
                <div className="flex justify-center mb-4">
                  <WalletMultiButton />
                </div>
                {publicKey && (
                  <button
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : 'Sign Message to Login'}
                  </button>
                )}
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">
                  By connecting your wallet, you agree to our Terms of Service
                </p>
              </div>
            </div>
          )}

          {/* Email Login */}
          {mode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Register */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  I am a...
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'advertiser' | 'publisher' })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
                >
                  <option value="advertiser">Advertiser</option>
                  <option value="publisher">Publisher</option>
                </select>
              </div>
              {publicKey && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <TickCircle size={16} color="#4ade80" variant="Bold" />
                    Wallet will be linked: {publicKey.toString().slice(0, 8)}...
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
