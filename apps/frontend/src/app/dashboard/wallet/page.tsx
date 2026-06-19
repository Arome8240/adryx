"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useStellarWallet } from "@/components/providers/WalletProvider";
import {
  Wallet,
  ArrowCircleUp,
  ArrowCircleDown,
  Copy,
  TickCircle,
  Link21,
  SearchNormal1,
  Setting2,
  CloseCircle,
} from "iconsax-react";
import WalletButton from "@/components/dashboard/WalletButton";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/components/dashboard/Toast";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAdvertiserDashboard } from "@/hooks/useAnalytics";
import { getUsdcBalance, getXlmBalance, formatUsdc } from "@/lib/tokens";
import { txExplorerUrl } from "@/lib/stellar";

const AUTO_RELOAD_KEY = "adryx_auto_reload_threshold";

function truncateTx(sig: string) {
  return `${sig.slice(0, 8)}…${sig.slice(-6)}`;
}

export default function WalletPage() {
  const { address: publicKey, connected } = useStellarWallet();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { dashboard } = useAdvertiserDashboard();

  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [xlmBalance, setXlmBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // T21 — Filter state
  const [filterCampaign, setFilterCampaign] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // T22 — Auto-reload threshold (in USDC)
  const [autoReload, setAutoReload] = useState<number>(0);
  const [showReloadSettings, setShowReloadSettings] = useState(false);
  const [reloadInput, setReloadInput] = useState("");

  // Fetch USDC + XLM balances via Stellar Horizon
  useEffect(() => {
    if (!publicKey) {
      setUsdcBalance(null);
      setXlmBalance(null);
      return;
    }
    setBalanceLoading(true);
    Promise.all([getUsdcBalance(publicKey), getXlmBalance(publicKey)])
      .then(([usdc, xlm]) => {
        setUsdcBalance(usdc);
        setXlmBalance(xlm);
      })
      .catch(() => {})
      .finally(() => setBalanceLoading(false));
  }, [publicKey]);

  // T22 — Load auto-reload threshold
  useEffect(() => {
    const saved = localStorage.getItem(AUTO_RELOAD_KEY);
    if (saved) {
      setAutoReload(parseFloat(saved));
      setReloadInput(saved);
    }
  }, []);

  function saveAutoReload() {
    const val = parseFloat(reloadInput);
    if (!isNaN(val) && val >= 0) {
      setAutoReload(val);
      localStorage.setItem(AUTO_RELOAD_KEY, String(val));
      setShowReloadSettings(false);
      setToast({
        message:
          val === 0 ? "Auto-reload disabled" : `Alert set at $${val} USDC`,
        type: "success",
      });
    }
  }

  function handleCopyAddress() {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const allTxRows = campaigns
    .filter((c) => c.txHash ?? (c as any).solanaTxHash)
    .map((c) => ({
      id: c._id,
      description: `Funded "${c.name}"`,
      campaignName: c.name,
      amount: c.budget,
      status: c.status,
      txHash: (c.txHash ?? (c as any).solanaTxHash) as string,
      date: c.updatedAt ?? c.createdAt,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // T21 — Apply filters
  const txRows = useMemo(
    () =>
      allTxRows.filter((tx) => {
        if (
          filterCampaign &&
          !tx.campaignName.toLowerCase().includes(filterCampaign.toLowerCase())
        )
          return false;
        if (filterFrom && new Date(tx.date) < new Date(filterFrom))
          return false;
        if (filterTo && new Date(tx.date) > new Date(filterTo + "T23:59:59"))
          return false;
        return true;
      }),
    [allTxRows, filterCampaign, filterFrom, filterTo],
  );

  // T22 — Auto-reload alert (USDC threshold)
  const showAutoReloadAlert =
    autoReload > 0 && usdcBalance !== null && usdcBalance < autoReload;

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
        className="glass rounded-2xl p-6 border border-[#4ade80]/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4ade80]/5 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#4ade80]/15 flex items-center justify-center shrink-0">
                <Wallet size={24} color="#4ade80" variant="Bold" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  USDC Balance
                </p>
                {balanceLoading ? (
                  <div className="h-8 w-36 bg-white/8 rounded animate-pulse mt-1" />
                ) : connected && usdcBalance !== null ? (
                  <>
                    <p className="text-3xl font-bold text-white mt-0.5">
                      ${formatUsdc(usdcBalance)}{" "}
                      <span className="text-lg text-white/50">USDC</span>
                    </p>
                    {xlmBalance !== null && (
                      <p className="text-xs text-white/30 mt-1">
                        {xlmBalance.toFixed(4)} XLM for fees
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

          {connected && publicKey && (
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 transition-colors group"
            >
              <span className="text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors">
                {publicKey}
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
              Connect your wallet to view your USDC balance.
            </p>
          )}
        </div>
      </motion.div>

      {/* T22 — Auto-reload alert */}
      {showAutoReloadAlert && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm">
          <Wallet size={16} color="currentColor" />
          <span>
            USDC balance below ${autoReload} threshold — consider topping up
            your wallet.
          </span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Funded",
            value: `$${formatUsdc(totalFunded)}`,
            sub: "USDC",
            color: "text-[#4ade80]",
            icon: <ArrowCircleDown size={18} color="#4ade80" variant="Bold" />,
          },
          {
            label: "Total Spent",
            value: `$${formatUsdc(totalSpent)}`,
            sub: "USDC",
            color: "text-red-400",
            icon: <ArrowCircleUp size={18} color="#f87171" variant="Bold" />,
          },
          {
            label: "Remaining",
            value: `$${formatUsdc(totalRemaining)}`,
            sub: "USDC",
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
            <p className="text-xs text-white/25 mt-0.5">{s.sub}</p>
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
          <button
            onClick={() => setShowReloadSettings((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              showReloadSettings
                ? "bg-[#f7931a]/15 border-[#f7931a]/30 text-[#f7931a]"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
            }`}
          >
            <Setting2 size={13} color="currentColor" />
            Alert {autoReload > 0 ? `@ $${autoReload}` : "off"}
          </button>
        </div>

        {/* T22 — Auto-reload settings */}
        {showReloadSettings && (
          <div className="px-6 py-4 border-b border-white/8 bg-white/2 flex items-center gap-3 flex-wrap">
            <p className="text-xs text-white/50">
              Alert when USDC balance drops below:
            </p>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-white/30">
                $
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={reloadInput}
                onChange={(e) => setReloadInput(e.target.value)}
                placeholder="0"
                className="w-24 pl-6 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#f7931a]/50 transition-colors"
              />
            </div>
            <span className="text-xs text-white/30">USDC (0 = disabled)</span>
            <button
              onClick={saveAutoReload}
              className="px-3 py-1.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-xs font-semibold transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowReloadSettings(false)}
              className="text-white/30 hover:text-white transition-colors"
            >
              <CloseCircle size={16} color="currentColor" />
            </button>
          </div>
        )}

        {/* T21 — Filters */}
        <div className="px-6 py-3 border-b border-white/5 flex flex-wrap items-center gap-3">
          <div className="relative">
            <SearchNormal1
              size={13}
              color="#ffffff30"
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
            />
            <input
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
              placeholder="Filter by campaign…"
              className="pl-7 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/25 outline-none focus:border-white/20 transition-colors w-44"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">From</span>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">To</span>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 outline-none focus:border-white/20 transition-colors"
            />
          </div>
          {(filterCampaign || filterFrom || filterTo) && (
            <button
              onClick={() => {
                setFilterCampaign("");
                setFilterFrom("");
                setFilterTo("");
              }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Clear
            </button>
          )}
          <span className="text-xs text-white/20 ml-auto">
            {txRows.length} result{txRows.length !== 1 ? "s" : ""}
          </span>
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
                      +${formatUsdc(tx.amount)} USDC
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
                        href={txExplorerUrl(tx.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[#EBFF45] bg-[#EBFF45]/10 hover:bg-[#EBFF45]/20 px-2 py-1 rounded-lg transition-colors"
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
