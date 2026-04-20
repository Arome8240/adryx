"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  DollarCircle,
  TrendUp,
  ArrowDown2,
  Link21,
  TickCircle,
  CloseCircle,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import WalletButton from "@/components/dashboard/WalletButton";
import {
  usePublisherDashboard,
  usePublisherEarnings,
} from "@/hooks/usePublisher";
import { apiClient } from "@/lib/api-client";

function truncateTx(sig: string) {
  return `${sig.slice(0, 8)}…${sig.slice(-6)}`;
}

export default function EarningsPage() {
  const { publicKey } = useWallet();
  const { dashboard, isLoading: dashLoading } = usePublisherDashboard();
  const { earningsChart, isLoading: chartLoading } = usePublisherEarnings(30);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleClaim() {
    if (!publicKey) return showToast("Connect your wallet first", false);
    setClaiming(true);
    try {
      const result = await apiClient.claimEarnings(publicKey.toString());
      showToast(`Claimed! Tx: ${result.signature.slice(0, 12)}…`);
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setClaiming(false);
    }
  }

  const totalEarnings = parseFloat(dashboard?.totalEarnings ?? "0");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium ${
            toast.ok
              ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
              : "bg-[#f87171]/10 border-[#f87171]/20 text-[#f87171]"
          }`}
        >
          {toast.ok ? (
            <TickCircle size={16} color="currentColor" />
          ) : (
            <CloseCircle size={16} color="currentColor" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl font-bold text-white">Earnings</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Track your revenue and payout history
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dashLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 animate-pulse"
            >
              <div className="h-3 bg-white/8 rounded w-1/3 mb-3" />
              <div className="h-7 bg-white/8 rounded w-1/2" />
            </div>
          ))
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl bg-[#0d0d1a] border border-[#4ade80]/20 p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#4ade80]/5 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Total Earnings
                  </p>
                  <DollarCircle size={18} color="#4ade80" variant="Bold" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${totalEarnings.toFixed(2)}
                </p>
                <p className="text-xs text-white/40 mt-1">USDC lifetime</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Total Clicks
                </p>
                <TrendUp size={18} color="#22d3ee" variant="Bold" />
              </div>
              <p className="text-3xl font-bold text-white">
                {(dashboard?.clicks ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-white/40 mt-1">Paid interactions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Avg. CPC
                </p>
                <ArrowDown2 size={18} color="#f7931a" variant="Bold" />
              </div>
              <p className="text-3xl font-bold text-white">
                $
                {dashboard && dashboard.clicks > 0
                  ? (totalEarnings / dashboard.clicks).toFixed(4)
                  : "0.0000"}
              </p>
              <p className="text-xs text-white/40 mt-1">USDC per click</p>
            </motion.div>
          </>
        )}
      </div>

      {/* Claim earnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass rounded-2xl p-5 border border-[#4ade80]/15 flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <p className="text-sm font-semibold text-white">
            Claim Your Earnings
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            Withdraw accumulated USDC to your connected wallet
          </p>
        </div>
        <div className="flex items-center gap-3">
          <WalletButton />
          <button
            onClick={handleClaim}
            disabled={claiming || !publicKey}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4ade80] hover:bg-[#4ade80]/90 text-black text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {claiming ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <DollarCircle size={16} color="black" variant="Bold" />
            )}
            {claiming ? "Claiming…" : "Claim Earnings"}
          </button>
        </div>
      </motion.div>

      {/* Earnings chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h3 className="text-base font-semibold text-white mb-1">
          Earnings Trend
        </h3>
        <p className="text-xs text-white/30 mb-5">
          Daily USDC earnings — last 30 days
        </p>
        {chartLoading ? (
          <div className="h-48 bg-white/5 rounded animate-pulse" />
        ) : earningsChart.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-white/30">No earnings data yet.</p>
          </div>
        ) : (
          <PerformanceChart
            data={earningsChart}
            lines={[
              { key: "earnings", color: "#4ade80", label: "Earnings (USDC)" },
            ]}
            height={200}
          />
        )}
      </motion.div>
    </div>
  );
}
