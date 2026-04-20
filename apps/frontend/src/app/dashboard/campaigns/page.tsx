"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  AddCircle,
  Chart,
  Pause,
  Play,
  Trash,
  TrendUp,
  EmptyWallet,
  CloseCircle,
} from "iconsax-react";

const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  active: {
    label: "Active",
    classes: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  },
  paused: {
    label: "Paused",
    classes: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  },
  draft: {
    label: "Draft",
    classes: "bg-white/5 text-white/40 border border-white/10",
  },
  completed: {
    label: "Completed",
    classes: "bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20",
  },
};

function BudgetBar({ budget, spent }: { budget: number; spent: number }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const color = pct >= 85 ? "#f87171" : pct >= 60 ? "#f7931a" : "#4ade80";
  return (
    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function CampaignsPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const {
    campaigns,
    isLoading,
    fundCampaign,
    pauseCampaign,
    resumeCampaign,
    deleteCampaign,
  } = useCampaigns();
  const [fundingId, setFundingId] = useState<string | null>(null);
  const [fundingAmount, setFundingAmount] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFund() {
    if (!publicKey) return showToast("Connect your wallet first", false);
    const amount = parseFloat(fundingAmount);
    if (!fundingId || isNaN(amount) || amount <= 0)
      return showToast("Enter a valid amount", false);
    setIsFunding(true);
    try {
      const res = await fundCampaign(fundingId, publicKey.toString(), amount);
      showToast(`Funded! Tx: ${res.signature.slice(0, 12)}…`);
      setFundingId(null);
      setFundingAmount("");
    } catch (e: any) {
      showToast(e.message, false);
    } finally {
      setIsFunding(false);
    }
  }

  async function handlePause(id: string) {
    try {
      await pauseCampaign(id);
      showToast("Campaign paused");
    } catch (e: any) {
      showToast(e.message, false);
    }
  }

  async function handleResume(id: string) {
    try {
      await resumeCampaign(id);
      showToast("Campaign resumed");
    } catch (e: any) {
      showToast(e.message, false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCampaign(id);
      showToast("Campaign deleted");
    } catch (e: any) {
      showToast(e.message, false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all ${
            toast.ok
              ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
              : "bg-[#f87171]/10 border-[#f87171]/20 text-[#f87171]"
          }`}
        >
          {toast.ok ? (
            <TrendUp size={16} color="currentColor" />
          ) : (
            <CloseCircle size={16} color="currentColor" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Campaigns</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Manage your advertising campaigns
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/create")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold transition-colors"
        >
          <AddCircle size={16} color="white" />
          New Campaign
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/3 border border-white/8 p-5 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-[#f7931a]/10 flex items-center justify-center mb-4">
            <Chart size={28} color="#f7931a" />
          </div>
          <p className="text-white font-semibold mb-1">No campaigns yet</p>
          <p className="text-sm text-white/40 mb-6">
            Create your first campaign to start advertising
          </p>
          <button
            onClick={() => router.push("/dashboard/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold transition-colors"
          >
            <AddCircle size={16} color="white" />
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const status = STATUS_STYLES[c.status] ?? STATUS_STYLES.draft;
            const remaining = (c.budget - c.spent).toFixed(2);
            return (
              <div
                key={c._id}
                className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 hover:border-white/15 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {c.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${status.classes}`}
                      >
                        {status.label}
                      </span>
                      <span className="text-[10px] text-white/30 capitalize px-2 py-0.5 rounded-full bg-white/5">
                        {c.format}
                      </span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-white/40 mt-1 truncate">
                        {c.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Budget row */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Budget</p>
                    <p className="text-sm font-semibold text-white">
                      {c.budget.toFixed(2)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Spent</p>
                    <p className="text-sm font-semibold text-[#f7931a]">
                      {c.spent.toFixed(2)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">
                      Remaining
                    </p>
                    <p className="text-sm font-semibold text-white/70">
                      {remaining} SOL
                    </p>
                  </div>
                </div>

                <BudgetBar budget={c.budget} spent={c.spent} />

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  {c.status === "draft" && (
                    <button
                      onClick={() => setFundingId(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f7931a]/15 hover:bg-[#f7931a]/25 text-[#f7931a] text-xs font-semibold transition-colors"
                    >
                      <EmptyWallet size={13} color="currentColor" />
                      Fund
                    </button>
                  )}
                  {c.status === "active" && (
                    <button
                      onClick={() => handlePause(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-xs font-semibold transition-colors"
                    >
                      <Pause size={13} color="currentColor" />
                      Pause
                    </button>
                  )}
                  {c.status === "paused" && (
                    <button
                      onClick={() => handleResume(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 text-xs font-semibold transition-colors"
                    >
                      <Play size={13} color="currentColor" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/analytics?campaign=${c._id}`)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold transition-colors"
                  >
                    <TrendUp size={13} color="currentColor" />
                    Stats
                  </button>
                  {c.status === "draft" && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f87171]/10 hover:bg-[#f87171]/20 text-[#f87171] text-xs font-semibold transition-colors ml-auto"
                    >
                      <Trash size={13} color="currentColor" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fund Modal */}
      {fundingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setFundingId(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">
              Fund Campaign
            </h2>
            <p className="text-xs text-white/40 mb-5">
              Funds are held in escrow on Solana devnet until the campaign runs.
            </p>

            {!publicKey && (
              <div className="mb-4 px-3 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs">
                Connect your wallet to fund this campaign.
              </div>
            )}

            <label className="block text-xs font-medium text-white/50 mb-1.5">
              Amount (SOL)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fundingAmount}
              onChange={(e) => setFundingAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#f7931a]/50 transition-colors mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFundingId(null);
                  setFundingAmount("");
                }}
                disabled={isFunding}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFund}
                disabled={isFunding || !publicKey}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isFunding ? "Funding…" : "Fund Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
