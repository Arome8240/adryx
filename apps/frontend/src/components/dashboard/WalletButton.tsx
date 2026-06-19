"use client";
import { useState, useRef, useEffect } from "react";
import { useStellarWallet } from "@/components/providers/WalletProvider";
import { EmptyWallet, Copy, LogoutCurve, TickCircle } from "iconsax-react";

function truncate(address: string) {
  // Stellar G-addresses are 56 chars — show first 6 and last 4
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function WalletButton() {
  const { address, connected, connecting, connect, disconnect } = useStellarWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleConnect() {
    setError("");
    try {
      await connect();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setTimeout(() => setError(""), 4000);
    }
  }

  function handleCopy() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (connecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/40 text-sm">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-[#EBFF45] animate-spin" />
        <span>Connecting…</span>
      </div>
    );
  }

  if (!connected) {
    return (
      <div>
        <button
          onClick={handleConnect}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
        >
          <EmptyWallet size={15} color="#EBFF45" />
          <span>Connect wallet</span>
        </button>
        {error && (
          <p className="text-xs text-red-400 mt-1 max-w-[220px]">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#EBFF45]/25 bg-[#EBFF45]/8 hover:bg-[#EBFF45]/12 hover:border-[#EBFF45]/40 transition-all"
      >
        <div className="w-5 h-5 rounded-full bg-[#EBFF45]/15 flex items-center justify-center shrink-0">
          <EmptyWallet size={12} color="#EBFF45" />
        </div>
        <span className="text-sm font-mono font-medium text-white/80">
          {address ? truncate(address) : ""}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[#13131f] border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/8">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-4 h-4 rounded bg-[#EBFF45]/20 flex items-center justify-center">
                <span style={{ fontSize: 8, fontWeight: 900, color: "#EBFF45" }}>A</span>
              </div>
              <span className="text-xs font-semibold text-white/60">Freighter · Stellar</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>
            <p className="text-[11px] font-mono text-white/35 truncate">{address}</p>
          </div>
          <div className="p-2 flex flex-col gap-0.5">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {copied ? <TickCircle size={15} color="#4ade80" /> : <Copy size={15} color="currentColor" />}
              {copied ? "Copied!" : "Copy address"}
            </button>
            <button
              onClick={() => { disconnect(); setOpen(false); }}
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
