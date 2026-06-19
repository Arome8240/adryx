// Stellar multi-wallet adapter layer
// Each adapter wraps the window API injected by that wallet's browser extension.

export type WalletId = 'freighter' | 'lobstr' | 'xbull' | 'rabet';

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'MAINNET' : 'TESTNET';
const NETWORK_PASSPHRASE =
  NETWORK === 'MAINNET'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015';

// ── Window type augmentations ──────────────────────────────────────────────

declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<{ isConnected: boolean }>;
      getPublicKey: () => Promise<string>;
      signMessage: (opts: { message: string; networkPassphrase?: string }) => Promise<{ signedMessage: string }>;
      signTransaction: (xdr: string, opts?: { network?: string; networkPassphrase?: string }) => Promise<{ signedTransaction: string }>;
    };
    lobstr?: {
      isConnected: () => boolean;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string) => Promise<{ signedXDR: string }>;
    };
    xBull?: {
      getPublicKey: () => Promise<string>;
      signXDR: (xdr: string, opts?: { network?: string; networkPassphrase?: string }) => Promise<{ xdr: string }>;
    };
    rabet?: {
      connect: () => Promise<{ publicKey: string; network: string }>;
      sign: (xdr: string, network: string) => Promise<{ xdr: string }>;
    };
  }
}

// ── Adapter interface ──────────────────────────────────────────────────────

export interface WalletMeta {
  id: WalletId;
  name: string;
  description: string;
  website: string;
  /** hex brand color for the icon bg tint */
  color: string;
}

export interface WalletAdapter extends WalletMeta {
  isAvailable: () => boolean;
  getPublicKey: () => Promise<string>;
  signTransaction: (xdr: string) => Promise<string>;
}

// ── Freighter ─────────────────────────────────────────────────────────────

const freighter: WalletAdapter = {
  id: 'freighter',
  name: 'Freighter',
  description: 'Browser extension by Stellar Development Foundation',
  website: 'https://freighter.app',
  color: '#5E9DFF',
  isAvailable: () => typeof window !== 'undefined' && !!window.freighter,
  getPublicKey: async () => {
    if (!window.freighter) throw new Error('Freighter is not installed.');
    const { isConnected } = await window.freighter.isConnected();
    if (!isConnected) throw new Error('Freighter is locked — please unlock it first.');
    return window.freighter.getPublicKey();
  },
  signTransaction: async (xdr) => {
    if (!window.freighter) throw new Error('Freighter is not installed.');
    const { signedTransaction } = await window.freighter.signTransaction(xdr, {
      network: NETWORK,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    return signedTransaction;
  },
};

// ── LOBSTR ────────────────────────────────────────────────────────────────

const lobstr: WalletAdapter = {
  id: 'lobstr',
  name: 'LOBSTR',
  description: 'Popular Stellar wallet with WalletConnect support',
  website: 'https://lobstr.co',
  color: '#FF6B35',
  isAvailable: () => typeof window !== 'undefined' && !!window.lobstr,
  getPublicKey: async () => {
    if (!window.lobstr) throw new Error('LOBSTR extension is not installed.');
    return window.lobstr.getPublicKey();
  },
  signTransaction: async (xdr) => {
    if (!window.lobstr) throw new Error('LOBSTR extension is not installed.');
    const { signedXDR } = await window.lobstr.signTransaction(xdr);
    return signedXDR;
  },
};

// ── xBull ─────────────────────────────────────────────────────────────────

const xbull: WalletAdapter = {
  id: 'xbull',
  name: 'xBull',
  description: 'Open-source Stellar browser extension',
  website: 'https://xbull.app',
  color: '#00C2FF',
  isAvailable: () => typeof window !== 'undefined' && !!window.xBull,
  getPublicKey: async () => {
    if (!window.xBull) throw new Error('xBull is not installed.');
    return window.xBull.getPublicKey();
  },
  signTransaction: async (xdr) => {
    if (!window.xBull) throw new Error('xBull is not installed.');
    const { xdr: signed } = await window.xBull.signXDR(xdr, {
      network: NETWORK,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    return signed;
  },
};

// ── Rabet ─────────────────────────────────────────────────────────────────

const rabet: WalletAdapter = {
  id: 'rabet',
  name: 'Rabet',
  description: 'Stellar browser extension wallet',
  website: 'https://rabet.io',
  color: '#A855F7',
  isAvailable: () => typeof window !== 'undefined' && !!window.rabet,
  getPublicKey: async () => {
    if (!window.rabet) throw new Error('Rabet is not installed.');
    const { publicKey } = await window.rabet.connect();
    return publicKey;
  },
  signTransaction: async (xdr) => {
    if (!window.rabet) throw new Error('Rabet is not installed.');
    const network = NETWORK === 'MAINNET' ? 'mainnet' : 'testnet';
    const { xdr: signed } = await window.rabet.sign(xdr, network);
    return signed;
  },
};

// ── Registry ──────────────────────────────────────────────────────────────

export const WALLET_ADAPTERS: WalletAdapter[] = [freighter, lobstr, xbull, rabet];

export function getAdapter(id: WalletId): WalletAdapter {
  const adapter = WALLET_ADAPTERS.find(a => a.id === id);
  if (!adapter) throw new Error(`Unknown wallet: ${id}`);
  return adapter;
}
