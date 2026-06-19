'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Freighter browser extension API (injected as window.freighter)
declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<{ isConnected: boolean }>;
      getPublicKey: () => Promise<string>;
      signMessage: (opts: { message: string; networkPassphrase?: string }) => Promise<{ signedMessage: string }>;
      signTransaction: (xdr: string, opts?: { network?: string; networkPassphrase?: string }) => Promise<{ signedTransaction: string }>;
    };
  }
}

interface StellarWalletState {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<string>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const StellarWalletContext = createContext<StellarWalletState>({
  address: null,
  connected: false,
  connecting: false,
  connect: async () => { throw new Error('WalletProvider not mounted'); },
  disconnect: () => {},
  signTransaction: async () => { throw new Error('WalletProvider not mounted'); },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Seed address from the auth user's linked Stellar wallet on mount / user change
  useEffect(() => {
    if (user?.walletAddress) setAddress(user.walletAddress);
  }, [user?.walletAddress]);

  const connect = useCallback(async (): Promise<string> => {
    if (!window.freighter) {
      throw new Error('Freighter extension is not installed. Visit freighter.app to install it.');
    }
    setConnecting(true);
    try {
      const { isConnected } = await window.freighter.isConnected();
      if (!isConnected) throw new Error('Freighter is locked. Please unlock your wallet first.');
      const pubKey = await window.freighter.getPublicKey();
      setAddress(pubKey);
      return pubKey;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (!user?.walletAddress) setAddress(null);
  }, [user?.walletAddress]);

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    if (!window.freighter) throw new Error('Freighter not available');
    const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'MAINNET' : 'TESTNET';
    const { signedTransaction } = await window.freighter.signTransaction(xdr, { network });
    return signedTransaction;
  }, []);

  return (
    <StellarWalletContext.Provider
      value={{ address, connected: !!address, connecting, connect, disconnect, signTransaction }}
    >
      {children}
    </StellarWalletContext.Provider>
  );
}

export function useStellarWallet(): StellarWalletState {
  return useContext(StellarWalletContext);
}
