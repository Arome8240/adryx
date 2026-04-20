"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Wallet,
  ArrowCircleUp,
  ArrowCircleDown,
  Copy,
  TickCircle,
  Link21,
} from "iconsax-react";
import WalletButton from "@/components/dashboard/WalletButton";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/components/dashboard/Toast";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAdvertiserDashboard } from "@/hooks/useAnalytics";

function truncateTx(sig: string) {
  return `${sig.slice(0, 8)}…${sig.slice(-6)}`;
}

export default function WalletPage() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { dashboard } = useAdvertiserDashboard();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Fetch on-chain SOL balance
  useEffect(() => {
    if (!publicKey || !connection) {
      setSolBalance(null);
      return;
    }
    setBalanceLoading(true);
    connection
      .getBalance(publicKey)
      .then((lamports) => setSolBalance(lamports / LAMPORTS_PER_SOL))
      .catch(() => setSolBalance(null))
      .finally(() => setBalanceLoading(false));
  }, [publicKey, connection]);

  // T20 — Fetch live SOL/USD price from CoinGecko
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    )
      .then((r) => r.json())
      .then((data) => setSolPrice(data?.solana?.usd ?? null))
      .catch(() => setSolPrice(null));
  }, []);

  function handleCopyAddress() {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Derive transactions from funded campaigns
  const txRows = campaigns
    .filter((c) => c.solanaTxHash)
    .map((c) => ({
      id: c._id,
      type: "Fund" as const,
      description: `Funded "${c.name}"`,
      amount: c.budget,
      status: c.status,
      txHash: c.solanaTxHash as string,
      date: c.updatedAt ?? c.createdAt,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalFunded = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
  const totalSpent =
    dashboard?.totalSpent ?? campaigns.reduce((s, c) => s + (c.spent || 0), 0);
  const totalRemaining = totalFunded - totalSpent;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-6 border border-[#f7931a]/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f7931a]/5 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f7931a]/15 flex items-center justify-center shrink-0">
                <Wallet size={24} color="#f7931a" variant="Bold" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Wallet Balance
                </p>
                {balanceLoading ? (
                  <div className="h-8 w-32 bg-white/8 rounded animate-pulse mt-1" />
                ) : connected && solBalance !== null ? (
                  <>
                    <p className="text-3xl font-bold text-white mt-0.5">
                      {solBalance.toFixed(4)}{" "}
                      <span className="text-lg text-white/50">SOL</span>
                    </p>
                    {solPrice !== null && (
                      <p className="text-sm text-white/30 mt-0.5">
                        ≈ $
                        {(solBalance * solPrice).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        USD
                        <span className="ml-2 text-[10px] text-white/20">
                          @ ${solPrice.toLocaleString()} / SOL
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xl font-semibold text-white/30 mt-0.5">
                    —
                  </p>
                )}
              </div>
            </div>
            <WalletButton />
          </div>

          {/* Wallet address */}
          {connected && publicKey && (
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 transition-colors group"
            >
              <span className="text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors">
                {publicKey.toString()}
              </span>
              {copied ? (
                <TickCircle size={14} color="#4ade80" />
              ) : (
                <Copy size={14} color="#ffffff40" />
              )}
            </button>
          )}

          {!connected && (
            <p className="text-xs text-white/30 mt-2">
              Connect your wallet to view your on-chain balance.
            </p>
          )}
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Funded",
            value: `${totalFunded.toFixed(2)} SOL`,
            usd: solPrice ? `$${(totalFunded * solPrice).toFixed(2)}` : null,
            color: "text-[#4ade80]",
            icon: <ArrowCircleDown size={18} color="#4ade80" variant="Bold" />,
          },
          {
            label: "Total Spent",
            value: `${totalSpent.toFixed(2)} SOL`,
            usd: solPrice ? `$${(totalSpent * solPrice).toFixed(2)}` : null,
            color: "text-red-400",
            icon: <ArrowCircleUp size={18} color="#f87171" variant="Bold" />,
          },
          {
            label: "Remaining",
            value: `${totalRemaining.toFixed(2)} SOL`,
            usd: solPrice ? `$${(totalRemaining * solPrice).toFixed(2)}` : null,
            color: "text-[#f7931a]",
            icon: <Wallet size={18} color="#f7931a" variant="Bold" />,
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass rounded-2xl p-4 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-2">
              {s.icon}
              <p className="text-xs text-white/40">{s.label}</p>
            </div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            {s.usd && <p className="text-xs text-white/25 mt-0.5">{s.usd}</p>}
          </motion.div>
        ))}
      </div>

      {/* Campaign funding history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Campaign Funding History
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              {txRows.length} on-chain transaction
              {txRows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {campaignsLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/8 rounded w-1/3" />
                  <div className="h-2.5 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : txRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <Wallet size={28} color="#ffffff20" variant="Bold" />
            <p className="text-sm text-white/30">No funded campaigns yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Campaign", "Amount", "Status", "Date", "Tx Hash"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {txRows.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-white/80 max-w-[180px] truncate font-medium">
                      {tx.description}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#4ade80]">
                      +{tx.amount.toFixed(2)} SOL
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          tx.status === "active"
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : tx.status === "paused"
                              ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                              : "bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/40 whitespace-nowrap text-xs">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[#a855f7] bg-[#a855f7]/10 hover:bg-[#a855f7]/20 px-2 py-1 rounded-lg transition-colors"
                      >
                        {truncateTx(tx.txHash)}
                        <Link21 size={11} color="currentColor" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
