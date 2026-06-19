"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useStellarWallet } from "@/components/providers/WalletProvider";
import { useCampaigns } from "@/hooks/useCampaigns";
import { apiClient } from "@/lib/api-client";
import WalletButton from "@/components/dashboard/WalletButton";
import {
  AddCircle,
  Chart,
  Pause,
  Play,
  Trash,
  TrendUp,
  EmptyWallet,
  CloseCircle,
  Edit2,
  Copy,
  SearchNormal1,
  ArrowDown2,
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

const AD_FORMATS = ["banner", "video", "native", "interstitial"];

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

function daysLeft(endDate: string) {
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
  return diff;
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#EBFF45]/40 transition-colors";

export default function CampaignsPage() {
  const router = useRouter();
  const { address: publicKey } = useStellarWallet();
  const {
    campaigns,
    isLoading,
    fundCampaign,
    pauseCampaign,
    resumeCampaign,
    deleteCampaign,
    updateCampaign,
    refetch,
  } = useCampaigns();

  const [fundingId, setFundingId] = useState<string | null>(null);
  const [fundingAmount, setFundingAmount] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [topUpId, setTopUpId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isTopUp, setIsTopUp] = useState(false);

  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const [detailCampaign, setDetailCampaign] = useState<any | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [search, setSearch] = useState("");

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isBulking, setIsBulking] = useState(false);

  const toast = useToast();

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...campaigns];
    if (filterStatus !== "all")
      list = list.filter((c) => c.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }
    if (sortBy === "newest")
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    if (sortBy === "oldest")
      list.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    if (sortBy === "budget-high") list.sort((a, b) => b.budget - a.budget);
    if (sortBy === "budget-low") list.sort((a, b) => a.budget - b.budget);
    return list;
  }, [campaigns, filterStatus, sortBy, search]);

  // Fund
  async function handleFund() {
    const amount = parseFloat(fundingAmount);
    if (!fundingId || isNaN(amount) || amount <= 0)
      return toast("Enter a valid amount", 'error');
    if (!publicKey) return toast("Connect your Stellar wallet first", 'error');
    setIsFunding(true);
    try {
      await fundCampaign(fundingId, publicKey, amount);
      toast("Campaign funded successfully!", 'ok');
      setFundingId(null); setFundingAmount("");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Funding failed", 'error');
    } finally {
      setIsFunding(false);
    }
  }

  // Top-up
  async function handleTopUp() {
    const amount = parseFloat(topUpAmount);
    if (!topUpId || isNaN(amount) || amount <= 0)
      return toast("Enter a valid amount", 'error');
    if (!publicKey) return toast("Connect your Stellar wallet first", 'error');
    setIsTopUp(true);
    try {
      await apiClient.topUpCampaign(topUpId, parseFloat(topUpAmount), "");
      toast("Campaign topped up!", 'ok');
      setTopUpId(null); setTopUpAmount("");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Top-up failed", 'error');
    } finally {
      setIsTopUp(false);
    }
  }

  // Edit
  function openEdit(c: any) {
    setEditingCampaign(c);
    setEditForm({
      name: c.name,
      description: c.description ?? "",
      format: c.format,
      targetUrl: c.targetUrl ?? "",
      creativeUrl: c.creativeUrl ?? "",
      startDate: c.startDate?.slice(0, 10) ?? "",
      endDate: c.endDate?.slice(0, 10) ?? "",
    });
  }

  async function handleSaveEdit() {
    if (!editingCampaign) return;
    setIsSaving(true);
    try {
      await updateCampaign(editingCampaign._id, editForm);
      toast("Campaign updated");
      setEditingCampaign(null);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  // Duplicate
  async function handleDuplicate(id: string) {
    try {
      await apiClient.duplicateCampaign(id);
      await refetch();
      toast("Campaign duplicated");
    } catch (e: any) {
      toast(e.message, 'error');
    }
  }

  async function handlePause(id: string) {
    try {
      await pauseCampaign(id);
      toast("Campaign paused");
    } catch (e: any) {
      toast(e.message, 'error');
    }
  }

  async function handleResume(id: string) {
    try {
      await resumeCampaign(id);
      toast("Campaign resumed");
    } catch (e: any) {
      toast(e.message, 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCampaign(id);
      toast("Campaign deleted");
    } catch (e: any) {
      toast(e.message, 'error');
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c._id)));
    }
  }

  async function handleBulkPause() {
    setIsBulking(true);
    const active = filtered.filter(
      (c) => selected.has(c._id) && c.status === "active",
    );
    await Promise.allSettled(active.map((c) => pauseCampaign(c._id)));
    setSelected(new Set());
    setIsBulking(false);
    toast(`Paused ${active.length} campaign${active.length !== 1 ? "s" : ""}`);
  }

  async function handleBulkDelete() {
    setIsBulking(true);
    const drafts = filtered.filter(
      (c) => selected.has(c._id) && c.status === "draft",
    );
    await Promise.allSettled(drafts.map((c) => deleteCampaign(c._id)));
    setSelected(new Set());
    setIsBulking(false);
    toast(`Deleted ${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Campaigns</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {campaigns.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <WalletButton />
          <button
            onClick={() => router.push("/dashboard/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold transition-colors"
          >
            <AddCircle size={16} color="#0e0e00" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <SearchNormal1
            size={14}
            color="#ffffff40"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
          {["all", "active", "paused", "draft", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filterStatus === s
                  ? "bg-[#EBFF45]/15 text-[#EBFF45]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="budget-high">Budget ↓</option>
            <option value="budget-low">Budget ↑</option>
          </select>
          <ArrowDown2
            size={12}
            color="#ffffff40"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#13131f] border border-white/10">
          <span className="text-xs text-white/60">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {filtered.some(
              (c) => selected.has(c._id) && c.status === "active",
            ) && (
              <button
                onClick={handleBulkPause}
                disabled={isBulking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-xs font-semibold transition-colors disabled:opacity-40"
              >
                <Pause size={12} color="currentColor" /> Pause active
              </button>
            )}
            {filtered.some(
              (c) => selected.has(c._id) && c.status === "draft",
            ) && (
              <button
                onClick={handleBulkDelete}
                disabled={isBulking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f87171]/10 hover:bg-[#f87171]/20 text-[#f87171] text-xs font-semibold transition-colors disabled:opacity-40"
              >
                <Trash size={12} color="currentColor" /> Delete drafts
              </button>
            )}
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* List */}
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
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10">
          <Chart size={28} color="#f7931a" />
          <p className="text-white font-semibold mt-4 mb-1">
            No campaigns found
          </p>
          <p className="text-sm text-white/40 mb-6">
            {search || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Create your first campaign to start advertising"}
          </p>
          {!search && filterStatus === "all" && (
            <button
              onClick={() => router.push("/dashboard/create")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold transition-colors"
            >
              <AddCircle size={16} color="#0e0e00" />
              Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const status = STATUS_STYLES[c.status] ?? STATUS_STYLES.draft;
            const remaining = (c.budget - c.spent).toFixed(2);
            const dl = c.endDate ? daysLeft(c.endDate) : null;
            return (
              <div
                key={c._id}
                className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 hover:border-white/15 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selected.has(c._id)}
                      onChange={() => toggleSelect(c._id)}
                      className="mt-1 shrink-0 accent-[#EBFF45] cursor-pointer"
                    />
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
                        {/* End date countdown */}
                        {c.status === "active" &&
                          dl !== null &&
                          dl <= 7 &&
                          dl >= 0 && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20">
                              {dl === 0 ? "Ends today" : `${dl}d left`}
                            </span>
                          )}
                      </div>
                      {c.description && (
                        <p className="text-xs text-white/40 mt-1 truncate">
                          {c.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Budget</p>
                    <p className="text-sm font-semibold text-white">
                      {c.budget.toFixed(2)} USDC
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Spent</p>
                    <p className="text-sm font-semibold text-[#f7931a]">
                      {c.spent.toFixed(2)} USDC
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">
                      Remaining
                    </p>
                    <p className="text-sm font-semibold text-white/70">
                      {remaining} USDC
                    </p>
                  </div>
                </div>

                <BudgetBar budget={c.budget} spent={c.spent} />

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {c.status === "draft" && (
                    <button
                      onClick={() => setFundingId(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f7931a]/15 hover:bg-[#f7931a]/25 text-[#f7931a] text-xs font-semibold transition-colors"
                    >
                      <EmptyWallet size={13} color="currentColor" /> Fund
                    </button>
                  )}
                  {c.status === "active" && (
                    <button
                      onClick={() => handlePause(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-xs font-semibold transition-colors"
                    >
                      <Pause size={13} color="currentColor" /> Pause
                    </button>
                  )}
                  {(c.status === "active" || c.status === "paused") && (
                    <button
                      onClick={() => setTopUpId(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4ade80]/10 hover:bg-[#4ade80]/20 text-[#4ade80] text-xs font-semibold transition-colors"
                    >
                      <EmptyWallet size={13} color="currentColor" /> Top Up
                    </button>
                  )}
                  {c.status === "paused" && (
                    <button
                      onClick={() => handleResume(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 text-xs font-semibold transition-colors"
                    >
                      <Play size={13} color="currentColor" /> Resume
                    </button>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/analytics?campaign=${c._id}`)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold transition-colors"
                  >
                    <TrendUp size={13} color="currentColor" /> Stats
                  </button>
                  {c.status !== "completed" && (
                    <button
                      onClick={() => openEdit(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Edit2 size={13} color="currentColor" /> Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDuplicate(c._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Copy size={13} color="currentColor" /> Duplicate
                  </button>
                  <button
                    onClick={() => setDetailCampaign(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Chart size={13} color="currentColor" /> Details
                  </button>
                  {c.status === "draft" && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f87171]/10 hover:bg-[#f87171]/20 text-[#f87171] text-xs font-semibold transition-colors ml-auto"
                    >
                      <Trash size={13} color="currentColor" /> Delete
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
              USDC will be transferred from your wallet to an escrow PDA on
              Solana devnet.
            </p>
            {!publicKey && (
              <div className="mb-4 px-3 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs">
                Connect your wallet to fund this campaign.
              </div>
            )}
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              Amount (USDC)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fundingAmount}
              onChange={(e) => setFundingAmount(e.target.value)}
              placeholder="0.00"
              className={`${inputCls} mb-5`}
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
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isFunding ? "Funding…" : "Fund Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingCampaign(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-white mb-2">
              Edit Campaign
            </h2>
            {editingCampaign?.status === "active" && (
              <p className="text-xs text-yellow-400/80 bg-yellow-400/8 border border-yellow-400/20 rounded-xl px-3 py-2 mb-4">
                Campaign is active — budget and dates cannot be changed. Only
                name, description, URLs, and format can be updated.
              </p>
            )}
            <div className="space-y-4">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Description", key: "description", type: "text" },
                { label: "Target URL", key: "targetUrl", type: "url" },
                { label: "Creative URL", key: "creativeUrl", type: "url" },
                { label: "Start Date", key: "startDate", type: "date" },
                { label: "End Date", key: "endDate", type: "date" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key] ?? ""}
                    onChange={(e) =>
                      setEditForm((p: any) => ({ ...p, [key]: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AD_FORMATS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() =>
                        setEditForm((p: any) => ({ ...p, format: f }))
                      }
                      className={`px-3 py-2 rounded-xl border text-sm capitalize transition-all ${
                        editForm.format === f
                          ? "border-[#EBFF45]/50 bg-[#EBFF45]/8 text-[#EBFF45]"
                          : "border-white/8 text-white/50 hover:border-white/15"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCampaign(null)}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold disabled:opacity-40 transition-colors"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top-up Modal — R05 */}
      {topUpId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setTopUpId(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">
              Top Up Campaign
            </h2>
            <p className="text-xs text-white/40 mb-5">
              Add more USDC budget to this active campaign.
            </p>
            {!publicKey && (
              <div className="mb-4 px-3 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs">
                Connect your wallet to top up.
              </div>
            )}
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              Additional Amount (USDC)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#4ade80]/50 transition-colors mb-5"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTopUpId(null);
                  setTopUpAmount("");
                }}
                disabled={isTopUp}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={isTopUp || !publicKey}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#4ade80] hover:bg-[#4ade80]/90 text-black text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isTopUp ? "Processing…" : "Top Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer — T10 */}
      {detailCampaign && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailCampaign(null)}
          />
          <aside className="relative w-full max-w-md bg-[#0d0d1a] border-l border-white/10 h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <h2 className="text-base font-bold text-white truncate">
                {detailCampaign.name}
              </h2>
              <button
                onClick={() => setDetailCampaign(null)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <CloseCircle size={20} color="currentColor" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${(STATUS_STYLES[detailCampaign.status] ?? STATUS_STYLES.draft).classes}`}
                >
                  {detailCampaign.status}
                </span>
                <span className="text-[10px] text-white/30 capitalize px-2 py-0.5 rounded-full bg-white/5">
                  {detailCampaign.format}
                </span>
              </div>
              {detailCampaign.description && (
                <p className="text-sm text-white/50">
                  {detailCampaign.description}
                </p>
              )}
              <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-3">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                  Budget
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Total",
                      value: `${detailCampaign.budget.toFixed(2)} USDC`,
                      color: "text-white",
                    },
                    {
                      label: "Spent",
                      value: `${detailCampaign.spent.toFixed(2)} USDC`,
                      color: "text-[#f7931a]",
                    },
                    {
                      label: "Left",
                      value: `${(detailCampaign.budget - detailCampaign.spent).toFixed(2)} USDC`,
                      color: "text-emerald-400",
                    },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[10px] text-white/30 mb-0.5">
                        {s.label}
                      </p>
                      <p className={`text-sm font-bold ${s.color}`}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
                <BudgetBar
                  budget={detailCampaign.budget}
                  spent={detailCampaign.spent}
                />
              </div>
              <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                  Schedule
                </p>
                {[
                  { label: "Start", value: detailCampaign.startDate },
                  { label: "End", value: detailCampaign.endDate },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-white/40">{d.label}</span>
                    <span className="text-xs font-medium text-white/70">
                      {d.value
                        ? new Date(d.value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
              {(detailCampaign.targetUrl || detailCampaign.creativeUrl) && (
                <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-2">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                    Links
                  </p>
                  {[
                    { label: "Target URL", value: detailCampaign.targetUrl },
                    {
                      label: "Creative URL",
                      value: detailCampaign.creativeUrl,
                    },
                  ].map(
                    (u) =>
                      u.value && (
                        <div key={u.label}>
                          <p className="text-[10px] text-white/30 mb-0.5">
                            {u.label}
                          </p>
                          <a
                            href={u.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#a855f7] hover:text-[#c084fc] truncate block transition-colors"
                          >
                            {u.value}
                          </a>
                        </div>
                      ),
                  )}
                </div>
              )}
              {detailCampaign.txHash && (
                <div className="rounded-xl bg-white/3 border border-white/8 p-4">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                    On-chain Tx
                  </p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${detailCampaign.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[#a855f7] hover:text-[#c084fc] break-all transition-colors"
                  >
                    {detailCampaign.txHash}
                  </a>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    router.push(
                      `/dashboard/analytics?campaign=${detailCampaign._id}`,
                    );
                    setDetailCampaign(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold transition-colors"
                >
                  <TrendUp size={13} color="currentColor" /> Analytics
                </button>
                {detailCampaign.status !== "completed" && (
                  <button
                    onClick={() => {
                      openEdit(detailCampaign);
                      setDetailCampaign(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs font-semibold transition-colors"
                  >
                    <Edit2 size={13} color="currentColor" /> Edit
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
