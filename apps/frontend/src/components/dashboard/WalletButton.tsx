"use client";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { EmptyWallet, Copy, LogoutCurve, TickCircle } from "iconsax-react";

function truncate(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function WalletButton() {
  const { publicKey, disconnect, connecting, connected, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleCopy() {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Not connected
  if (!connected && !connecting) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
      >
        <EmptyWallet size={15} color="#f7931a" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  // Connecting
  if (connecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/40 text-sm">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-[#f7931a] animate-spin" />
        <span>Connecting…</span>
      </div>
    );
  }

  // Connected
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#f7931a]/25 bg-[#f7931a]/8 hover:bg-[#f7931a]/12 hover:border-[#f7931a]/40 transition-all"
      >
        {/* Wallet icon or logo */}
        <div className="w-5 h-5 rounded-full bg-[#f7931a]/20 flex items-center justify-center shrink-0">
          <EmptyWallet size={12} color="#f7931a" />
        </div>
        <span className="text-sm font-mono font-medium text-white/80">
          {publicKey ? truncate(publicKey.toString()) : ""}
        </span>
        {/* Live dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#13131f] border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-50">
          {/* Wallet info */}
          <div className="px-4 py-3 border-b border-white/8">
            <div className="flex items-center gap-2 mb-2">
              {wallet?.adapter.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-4 h-4 rounded-sm"
                />
              )}
              <span className="text-xs font-semibold text-white/60">
                {wallet?.adapter.name}
              </span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>
            <p className="text-xs font-mono text-white/40 truncate">
              {publicKey?.toString()}
            </p>
          </div>

          {/* Actions */}
          <div className="p-2 flex flex-col gap-0.5">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {copied ? (
                <TickCircle size={15} color="#4ade80" />
              ) : (
                <Copy size={15} color="currentColor" />
              )}
              {copied ? "Copied!" : "Copy address"}
            </button>
            <button
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
            >
              <LogoutCurve size={15} color="currentColor" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
