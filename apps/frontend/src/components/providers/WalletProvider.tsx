'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { type WalletId, getAdapter } from '@/lib/wallet-adapters';

const STORAGE_KEY = 'adryx_wallet_id';

interface StellarWalletState {
  address: string | null;
  walletId: WalletId | null;
  connected: boolean;
  connecting: boolean;
  /** Call with a walletId to connect via that adapter. */
  connect: (walletId: WalletId) => Promise<string>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const StellarWalletContext = createContext<StellarWalletState>({
  address: null,
  walletId: null,
  connected: false,
  connecting: false,
  connect: async () => { throw new Error('WalletProvider not mounted'); },
  disconnect: () => {},
  signTransaction: async () => { throw new Error('WalletProvider not mounted'); },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [address, setAddress] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<WalletId | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Restore last-used wallet and seed address from auth user
  useEffect(() => {
    if (user?.walletAddress) setAddress(user.walletAddress);
    const saved = localStorage.getItem(STORAGE_KEY) as WalletId | null;
    if (saved) setWalletId(saved);
  }, [user?.walletAddress]);

  const connect = useCallback(async (id: WalletId): Promise<string> => {
    const adapter = getAdapter(id);
    if (!adapter.isAvailable()) {
      throw new Error(`${adapter.name} is not installed. Visit ${adapter.website} to install it.`);
    }
    setConnecting(true);
    try {
      const pubKey = await adapter.getPublicKey();
      setAddress(pubKey);
      setWalletId(id);
      localStorage.setItem(STORAGE_KEY, id);
      return pubKey;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (!user?.walletAddress) setAddress(null);
    setWalletId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [user?.walletAddress]);

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    if (!walletId) throw new Error('No wallet connected');
    return getAdapter(walletId).signTransaction(xdr);
  }, [walletId]);

  return (
    <StellarWalletContext.Provider
      value={{ address, walletId, connected: !!address, connecting, connect, disconnect, signTransaction }}
    >
      {children}
    </StellarWalletContext.Provider>
  );
}

export function useStellarWallet(): StellarWalletState {
  return useContext(StellarWalletContext);
}
