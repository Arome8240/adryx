"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStellarWallet } from "@/components/providers/WalletProvider";
import {
  DollarCircle,
  TrendUp,
  ArrowDown2,
  TickCircle,
  CloseCircle,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import WalletButton from "@/components/dashboard/WalletButton";
import {
  usePublisherDashboard,
  usePublisherEarnings,
  usePublisherEarningsBreakdown,
} from "@/hooks/usePublisher";
import { apiClient } from "@/lib/api-client";
import {
  TOKEN_COLORS,
  formatToken,
  type StablecoinSymbol,
} from "@/lib/tokens";

export default function EarningsPage() {
  const { address: publicKey } = useStellarWallet();
  const { dashboard, isLoading: dashLoading } = usePublisherDashboard();
  const { earningsChart, isLoading: chartLoading } = usePublisherEarnings(30);
  const { earnings: breakdown } = usePublisherEarningsBreakdown();

  const [selectedToken, setSelectedToken] = useState<StablecoinSymbol>("USDC");
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleClaim() {
    if (!publicKey) return showToast("Connect your Stellar wallet first", false);
    setClaiming(true);
    try {
      await apiClient.claimEarnings(publicKey, "USDC");
      showToast("Earnings claimed successfully!", true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Claim failed", false);
    } finally {
      setClaiming(false);
    }
  }

  const totalEarnings = parseFloat(dashboard?.totalEarnings ?? "0");
  const tokenColor = TOKEN_COLORS[selectedToken];

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
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 animate-pulse"
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
              className="rounded-2xl bg-[#0f0f13] border p-5 relative overflow-hidden"
              style={{ borderColor: `${tokenColor}30` }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: `${tokenColor}10` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Total Earnings
                  </p>
                  <DollarCircle size={18} color={tokenColor} variant="Bold" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${formatToken(totalEarnings)}
                </p>
                <p className="text-xs text-white/40 mt-1">Lifetime</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Total Clicks
                </p>
                <TrendUp size={18} color="#d4e63c" variant="Bold" />
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
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5"
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
              <p className="text-xs text-white/40 mt-1">Per click</p>
            </motion.div>
          </>
        )}
      </div>

      {/* Claim earnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderColor: `${tokenColor}25` }}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            Claim Your Earnings
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            Withdraw ${formatToken(totalEarnings)} to your connected wallet as{" "}
            {selectedToken}
          </p>
          {breakdown && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-[#EBFF45] font-semibold">
                ${formatToken(breakdown.pendingEarnings)} pending
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/40">
                ${formatToken(breakdown.claimedEarnings)} claimed
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Token selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5">
            {(["USDC", "USDT"] as StablecoinSymbol[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedToken(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedToken === t
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
                style={
                  selectedToken === t
                    ? {
                        backgroundColor: `${TOKEN_COLORS[t]}25`,
                        color: TOKEN_COLORS[t],
                      }
                    : {}
                }
              >
                {t}
              </button>
            ))}
          </div>

          <WalletButton />

          <button
            onClick={handleClaim}
            disabled={claiming || !publicKey || totalEarnings <= 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-black text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: tokenColor }}
          >
            {claiming ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <DollarCircle size={16} color="black" variant="Bold" />
            )}
            {claiming ? "Claiming…" : `Claim as ${selectedToken}`}
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
          Daily earnings — last 30 days
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
              {
                key: "earnings",
                color: tokenColor,
                label: `Earnings (${selectedToken})`,
              },
            ]}
            height={200}
          />
        )}
      </motion.div>
    </div>
  );
}
