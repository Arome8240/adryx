'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, ExportSquare } from 'iconsax-react';
import { WALLET_ADAPTERS, type WalletId } from '@/lib/wallet-adapters';
import { useStellarWallet } from '@/components/providers/WalletProvider';

// ── Inline wallet brand SVG icons ─────────────────────────────────────────

function FreighterIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#1E3A5F"/>
      <path d="M14 5L19.5 10.5L14 16L8.5 10.5L14 5Z" fill="#5E9DFF" opacity="0.9"/>
      <path d="M14 12L19.5 17.5L14 23L8.5 17.5L14 12Z" fill="#5E9DFF" opacity="0.5"/>
    </svg>
  );
}

function LobstrIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#2A1A10"/>
      <circle cx="14" cy="13" r="5" fill="#FF6B35" opacity="0.9"/>
      <path d="M9 18 Q14 22 19 18" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
      <circle cx="11.5" cy="11.5" r="1" fill="white" opacity="0.8"/>
    </svg>
  );
}

function XBullIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#0A1929"/>
      <path d="M8 8L14 14L8 20M20 8L14 14L20 20" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RabetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#1A0D2E"/>
      <path d="M10 8H16C18.2 8 20 9.8 20 12C20 14.2 18.2 16 16 16H10V8Z" fill="#A855F7" opacity="0.9"/>
      <path d="M10 16L14 20" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

const ICONS: Record<WalletId, React.ReactNode> = {
  freighter: <FreighterIcon />,
  lobstr: <LobstrIcon />,
  xbull: <XBullIcon />,
  rabet: <RabetIcon />,
};

// ── Component ─────────────────────────────────────────────────────────────

interface WalletSelectorModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletSelectorModal({ open, onClose }: WalletSelectorModalProps) {
  const { connect, connecting } = useStellarWallet();
  const [connectingId, setConnectingId] = useState<WalletId | null>(null);
  const [error, setError] = useState('');
  // Detect available wallets on the client side only
  const [available, setAvailable] = useState<Record<WalletId, boolean>>({
    freighter: false, lobstr: false, xbull: false, rabet: false,
  });

  useEffect(() => {
    if (!open) return;
    const map = {} as Record<WalletId, boolean>;
    WALLET_ADAPTERS.forEach(a => { map[a.id] = a.isAvailable(); });
    setAvailable(map);
    setError('');
    setConnectingId(null);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSelect(id: WalletId) {
    setError('');
    setConnectingId(id);
    try {
      await connect(id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setConnectingId(null);
    }
  }

  const hasAny = WALLET_ADAPTERS.some(a => available[a.id]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(10,10,16,0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div>
                  <h2 className="text-sm font-bold text-white">Connect Wallet</h2>
                  <p className="text-xs text-white/40 mt-0.5">Choose a Stellar wallet to connect</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                >
                  <CloseCircle size={16} color="currentColor" />
                </button>
              </div>

              {/* Wallet grid */}
              <div className="p-3 grid grid-cols-2 gap-2">
                {WALLET_ADAPTERS.map(adapter => {
                  const isAvailable = available[adapter.id];
                  const isConnecting = connectingId === adapter.id;

                  return (
                    <button
                      key={adapter.id}
                      onClick={() => isAvailable && !connecting && handleSelect(adapter.id)}
                      disabled={!isAvailable || (connecting && !isConnecting)}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        isAvailable
                          ? 'border-white/8 bg-white/4 hover:border-[#EBFF45]/30 hover:bg-[#EBFF45]/5 cursor-pointer'
                          : 'border-white/5 bg-white/2 cursor-default opacity-50'
                      } ${isConnecting ? 'border-[#EBFF45]/40 bg-[#EBFF45]/8' : ''}`}
                    >
                      {/* Icon */}
                      <div className="shrink-0">
                        {isConnecting ? (
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                            <span
                              className="w-5 h-5 rounded-full border-2 border-white/15 border-t-[#EBFF45] animate-spin"
                              style={{ display: 'block' }}
                            />
                          </div>
                        ) : (
                          ICONS[adapter.id]
                        )}
                      </div>

                      {/* Name + status */}
                      <div className="w-full min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight truncate">
                          {adapter.name}
                        </p>
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-[#4ade80]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                            Detected
                          </span>
                        ) : (
                          <a
                            href={adapter.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-white/30 hover:text-white/60 transition-colors"
                          >
                            Install
                            <ExportSquare size={9} color="currentColor" />
                          </a>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Error */}
              {error && (
                <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-[#FF4545]/10 border border-[#FF4545]/20">
                  <p className="text-xs text-[#FF4545] leading-relaxed">{error}</p>
                </div>
              )}

              {/* Footer */}
              <div className="px-5 py-3.5 border-t border-white/5">
                {!hasAny ? (
                  <p className="text-xs text-white/30 text-center">
                    No Stellar wallet detected.{' '}
                    <a
                      href="https://freighter.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EBFF45]/70 hover:text-[#EBFF45] underline"
                    >
                      Install Freighter
                    </a>{' '}
                    to get started.
                  </p>
                ) : (
                  <p className="text-[11px] text-white/20 text-center">
                    Only browser extension wallets are shown. Your keys never leave your wallet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
