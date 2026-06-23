"use client";
import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { SearchNormal1, Chart, Refresh } from "iconsax-react";

const STATUSES = ["", "active", "paused", "draft", "completed"];

const STATUS_COLORS: Record<string, string> = {
  active:    "#4ade80",
  paused:    "#f7931a",
  draft:     "#6b7280",
  completed: "#EBFF45",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminCampaignsPage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [search, setSearch]             = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.getAdminCampaigns({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search       || undefined,
      });
      setData(res);
    } catch {}
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function handleStatusChange(campaignId: string, status: string) {
    setActionLoading(campaignId);
    try {
      await apiClient.updateCampaignStatus(campaignId, status);
      await fetchCampaigns();
    } catch {}
    setActionLoading(null);
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Chart size={22} color="#EBFF45" />
            Campaigns
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {data ? `${data.total.toLocaleString()} total campaigns` : "Loading…"}
          </p>
        </div>
        <button
          onClick={fetchCampaigns}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Refresh"
        >
          <Refresh size={16} color="#ffffff80" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <SearchNormal1 size={14} color="#ffffff40" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search campaign name…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-sm text-white placeholder-white/25 outline-none focus:border-[#EBFF45]/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#0f0f13] border border-white/10 rounded-xl p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? "bg-[#EBFF45]/15 text-[#EBFF45]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0f0f13] border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/30 uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">Campaign</th>
                <th className="px-5 py-3 text-left font-semibold">Advertiser</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Budget</th>
                <th className="px-5 py-3 text-right font-semibold">Spent</th>
                <th className="px-5 py-3 text-left font-semibold">Dates</th>
                <th className="px-5 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(7)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-white/5 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">
                    No campaigns match your filters
                  </td>
                </tr>
              ) : (
                data?.campaigns.map((c: any) => {
                  const pct = c.budget > 0 ? Math.min((c.spent / c.budget) * 100, 100) : 0;
                  const barColor = pct >= 85 ? "#f87171" : pct >= 60 ? "#f7931a" : "#4ade80";
                  return (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white truncate max-w-[180px]">{c.name}</p>
                        <p className="text-[10px] text-white/30 uppercase mt-0.5">{c.format}</p>
                      </td>

                      <td className="px-5 py-3.5">
                        {c.advertiser ? (
                          <div>
                            <p className="text-white/80 truncate max-w-[140px]">{c.advertiser.name}</p>
                            <p className="text-xs text-white/30 truncate max-w-[140px]">{c.advertiser.email}</p>
                          </div>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ backgroundColor: `${STATUS_COLORS[c.status] ?? "#6b7280"}15`, color: STATUS_COLORS[c.status] ?? "#6b7280" }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[c.status] ?? "#6b7280" }} />
                          {c.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <p className="text-white font-medium">${c.budget.toFixed(2)}</p>
                        <p className="text-[10px] text-white/30">USDC</p>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <p className="font-medium" style={{ color: barColor }}>${c.spent.toFixed(2)}</p>
                        <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden mt-1 ml-auto">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-white/30">
                        {formatDate(c.startDate)} →<br />{formatDate(c.endDate)}
                      </td>

                      <td className="px-5 py-3.5">
                        <select
                          value={c.status}
                          disabled={actionLoading === c._id}
                          onChange={(e) => handleStatusChange(c._id, e.target.value)}
                          className="px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/70 outline-none cursor-pointer hover:border-white/20 disabled:opacity-40 transition-colors"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="draft">Draft</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/8">
            <p className="text-xs text-white/30">
              Page {data.page} of {data.pages} · {data.total} campaigns
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
