'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, ExportSquare } from 'iconsax-react';
import { WALLET_ADAPTERS, type WalletId } from '@/lib/wallet-adapters';
import { useStellarWallet } from '@/components/providers/WalletProvider';

// ── Inline wallet brand SVG icons ─────────────────────────────────────────

function FreighterIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#1E3A5F"/>
      <path d="M16 5L22 11L16 17L10 11L16 5Z" fill="#5E9DFF" opacity="0.95"/>
      <path d="M16 13L22 19L16 25L10 19L16 13Z" fill="#5E9DFF" opacity="0.45"/>
    </svg>
  );
}

function LobstrIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#2A1208"/>
      <circle cx="16" cy="14" r="6" fill="#FF6B35" opacity="0.9"/>
      <path d="M10 21 Q16 26 22 21" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65"/>
      <circle cx="13" cy="12" r="1.2" fill="white" opacity="0.85"/>
    </svg>
  );
}

function XBullIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#071521"/>
      <path d="M9 9L16 16L9 23M23 9L16 16L23 23" stroke="#00C2FF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RabetIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#170B2A"/>
      <path d="M11 9H18C20.8 9 23 11.2 23 14C23 16.8 20.8 19 18 19H11V9Z" fill="#A855F7" opacity="0.92"/>
      <path d="M11 19L15.5 24" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round"/>
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
  const { connect } = useStellarWallet();
  const [connectingId, setConnectingId] = useState<WalletId | null>(null);
  const [error, setError] = useState('');
  // detected = wallets where window.X was found; purely informational, never gates clicking
  const [detected, setDetected] = useState<Set<WalletId>>(new Set());

  const checkDetection = useCallback(() => {
    setDetected(prev => {
      const next = new Set(prev);
      WALLET_ADAPTERS.forEach(a => {
        if (a.isAvailable()) next.add(a.id);
      });
      // only update state if something changed
      return next.size !== prev.size ? next : prev;
    });
  }, []);

  // Poll for wallet injection when modal opens.
  // Extensions inject asynchronously — Freighter is immediate, others can take up to ~800ms.
  useEffect(() => {
    if (!open) return;
    setError('');
    setConnectingId(null);
    // Immediate + staggered checks
    checkDetection();
    const timers = [100, 300, 600, 1000, 1800].map(ms =>
      setTimeout(checkDetection, ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [open, checkDetection]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSelect(id: WalletId) {
    if (connectingId) return; // already connecting to another wallet
    setError('');
    setConnectingId(id);
    try {
      await connect(id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    } finally {
      setConnectingId(null);
    }
  }

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
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(9,9,15,0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div>
                  <h2 className="text-sm font-bold text-white">Connect Wallet</h2>
                  <p className="text-xs text-white/40 mt-0.5">Select your Stellar wallet</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                >
                  <CloseCircle size={16} color="currentColor" />
                </button>
              </div>

              {/* Wallet grid — always clickable */}
              <div className="p-3 grid grid-cols-2 gap-2">
                {WALLET_ADAPTERS.map(adapter => {
                  const isDetected = detected.has(adapter.id);
                  const isConnecting = connectingId === adapter.id;
                  const isBusy = !!connectingId && !isConnecting;

                  return (
                    <button
                      key={adapter.id}
                      onClick={() => handleSelect(adapter.id)}
                      disabled={isBusy}
                      className={`
                        relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left
                        transition-all duration-150 disabled:opacity-40
                        ${isConnecting
                          ? 'border-[#EBFF45]/40 bg-[#EBFF45]/8'
                          : isDetected
                            ? 'border-white/12 bg-white/5 hover:border-[#EBFF45]/35 hover:bg-[#EBFF45]/6 cursor-pointer'
                            : 'border-white/7 bg-white/3 hover:border-white/15 hover:bg-white/5 cursor-pointer'
                        }
                      `}
                    >
                      {/* Brand icon / spinner */}
                      <div className="shrink-0">
                        {isConnecting ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <span className="w-5 h-5 rounded-full border-2 border-white/15 border-t-[#EBFF45] animate-spin block" />
                          </div>
                        ) : (
                          ICONS[adapter.id]
                        )}
                      </div>

                      {/* Name + status */}
                      <div className="w-full min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">
                          {adapter.name}
                        </p>
                        {isConnecting ? (
                          <span className="text-[10px] text-[#EBFF45]/70 font-medium mt-0.5 block">
                            Connecting…
                          </span>
                        ) : isDetected ? (
                          <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-medium text-[#4ade80]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                            Detected
                          </span>
                        ) : (
                          <a
                            href={adapter.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 mt-0.5 text-[10px] text-white/30 hover:text-white/60 transition-colors"
                          >
                            Get extension
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
                <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-[#FF4545]/10 border border-[#FF4545]/20 flex items-start gap-2">
                  <span className="text-[#FF4545] mt-0.5 shrink-0">✕</span>
                  <p className="text-xs text-[#FF4545]/90 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Footer */}
              <div className="px-5 py-3.5 border-t border-white/5">
                <p className="text-[11px] text-white/20 text-center leading-relaxed">
                  Only browser extension wallets shown.{' '}
                  Your keys never leave your wallet.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
