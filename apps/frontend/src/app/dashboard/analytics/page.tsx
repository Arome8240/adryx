"use client";
import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendUp,
  Eye,
  MouseCircle,
  DollarCircle,
  ChartCircle,
  ArrowDown2,
  DocumentDownload,
  Flash,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  useAdvertiserDashboard,
  useCampaignAnalytics,
  useTopCampaigns,
  useHourlyHeatmap,
} from "@/hooks/useAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";

const ranges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function exportCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? "")).join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function AnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCampaignId = searchParams.get("campaign");

  const [selectedId, setSelectedId] = useState<string>(urlCampaignId ?? "");
  const [compareId, setCompareId] = useState<string>("");
  const [compareMode, setCompareMode] = useState(false);
  const [rangeIdx, setRangeIdx] = useState(1);
  const days = ranges[rangeIdx].days;

  const { dashboard, isLoading: dashboardLoading } = useAdvertiserDashboard();
  const { analytics, isLoading: analyticsLoading } = useCampaignAnalytics(
    selectedId || null,
    days,
  );
  const { analytics: compareAnalytics } = useCampaignAnalytics(
    compareMode && compareId ? compareId : null,
    days,
  );
  const { campaigns } = useCampaigns();
  const { topCampaigns, isLoading: topLoading } = useTopCampaigns(10);
  const { heatmap, isLoading: heatmapLoading } = useHourlyHeatmap(days);

  const chartData = useMemo(() => {
    if (!analytics || analytics.length === 0) return [];
    const byDate: Record<
      string,
      { date: string; impressions: number; clicks: number; spend: number }
    > = {};
    analytics.forEach((item: any) => {
      const date = item._id.date;
      if (!byDate[date])
        byDate[date] = { date, impressions: 0, clicks: 0, spend: 0 };
      if (item._id.type === "impression") byDate[date].impressions = item.count;
      else if (item._id.type === "click") {
        byDate[date].clicks = item.count;
        byDate[date].spend = item.totalReward || 0;
      }
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [analytics]);

  // T18 — Comparison data: merge both campaigns by date
  const compareChartData = useMemo(() => {
    if (!compareMode || !compareAnalytics?.length) return [];
    const byDate: Record<
      string,
      {
        date: string;
        clicks_a: number;
        clicks_b: number;
        impressions_a: number;
        impressions_b: number;
      }
    > = {};
    const addData = (items: any[], suffix: "a" | "b") => {
      items.forEach((item: any) => {
        const date = item._id.date;
        if (!byDate[date])
          byDate[date] = {
            date,
            clicks_a: 0,
            clicks_b: 0,
            impressions_a: 0,
            impressions_b: 0,
          };
        if (item._id.type === "click")
          (byDate[date] as any)[`clicks_${suffix}`] = item.count;
        if (item._id.type === "impression")
          (byDate[date] as any)[`impressions_${suffix}`] = item.count;
      });
    };
    addData(analytics, "a");
    addData(compareAnalytics, "b");
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [compareMode, analytics, compareAnalytics]);

  const metrics = useMemo(() => {
    if (!dashboard) return [];
    return [
      {
        title: "Total Impressions",
        value: dashboard.impressions.toLocaleString(),
        change: "",
        positive: true,
        icon: <Eye size={20} color="#a855f7" variant="Bold" />,
        iconBg: "bg-[#a855f7]/10",
      },
      {
        title: "Total Clicks",
        value: dashboard.clicks.toLocaleString(),
        change: "",
        positive: true,
        icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
        iconBg: "bg-[#22d3ee]/10",
      },
      {
        title: "Total Spend",
        value: `${dashboard.totalSpent.toFixed(2)} USDC`,
        change: "",
        positive: true,
        icon: <DollarCircle size={20} color="#f7931a" variant="Bold" />,
        iconBg: "bg-[#f7931a]/10",
      },
      {
        title: "Avg. CTR",
        value: `${dashboard.ctr}%`,
        change: "",
        positive: true,
        icon: <ChartCircle size={20} color="#4ade80" variant="Bold" />,
        iconBg: "bg-[#4ade80]/10",
      },
    ];
  }, [dashboard]);

  const selectedCampaign = selectedId
    ? campaigns.find((c) => c._id === selectedId)
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <p className="text-sm text-white/40 mt-0.5">
            {selectedCampaign
              ? `Performance for "${selectedCampaign.name}"`
              : "Track your campaign performance over time"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* T15 — Campaign selector */}
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                if (e.target.value)
                  router.replace(
                    `/dashboard/analytics?campaign=${e.target.value}`,
                  );
                else router.replace("/dashboard/analytics");
              }}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="">All campaigns</option>
              {campaigns.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ArrowDown2
              size={12}
              color="#ffffff40"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-1 glass rounded-xl p-1 border border-white/8">
            <Calendar size={16} color="#EBFF45" className="ml-2" />
            {ranges.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setRangeIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rangeIdx === i
                    ? "bg-[#EBFF45]/15 text-[#EBFF45]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* T17 — Export CSV */}
          {chartData.length > 0 && (
            <button
              onClick={() =>
                exportCSV(
                  chartData,
                  `analytics-${selectedId || "all"}-${ranges[rangeIdx].label}.csv`,
                )
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 text-white/60 hover:text-white text-xs font-medium transition-colors"
            >
              <DocumentDownload size={14} color="currentColor" />
              Export CSV
            </button>
          )}

          {/* T18 — Compare toggle */}
          {selectedId && (
            <button
              onClick={() => {
                setCompareMode((v) => !v);
                setCompareId("");
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                compareMode
                  ? "bg-[#a855f7]/15 border-[#a855f7]/30 text-[#a855f7]"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white"
              }`}
            >
              Compare
            </button>
          )}
        </div>
      </motion.div>

      {/* T18 — Compare campaign selector */}
      {compareMode && selectedId && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#a855f7]/8 border border-[#a855f7]/20">
          <span className="text-xs text-[#a855f7] font-semibold shrink-0">
            Compare with:
          </span>
          <div className="relative flex-1 max-w-xs">
            <select
              value={compareId}
              onChange={(e) => setCompareId(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 outline-none cursor-pointer"
            >
              <option value="">Select a campaign…</option>
              {campaigns
                .filter((c) => c._id !== selectedId)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <ArrowDown2
              size={12}
              color="#ffffff40"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
          {compareId && compareChartData.length > 0 && (
            <div className="flex items-center gap-3 text-xs shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-[#22d3ee] inline-block" />
                <span className="text-white/50">
                  {campaigns
                    .find((c) => c._id === selectedId)
                    ?.name?.slice(0, 12)}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-[#f7931a] inline-block" />
                <span className="text-white/50">
                  {campaigns
                    .find((c) => c._id === compareId)
                    ?.name?.slice(0, 12)}
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Metric cards */}
      {dashboardLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 border border-white/8 animate-pulse"
            >
              <div className="h-3 bg-white/8 rounded w-1/2 mb-3" />
              <div className="h-6 bg-white/8 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Charts */}
      {analyticsLoading ? (
        <div className="glass rounded-2xl p-6 border border-white/8 animate-pulse">
          <div className="h-4 bg-white/8 rounded w-1/4 mb-4" />
          <div className="h-60 bg-white/5 rounded" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="glass rounded-2xl p-12 border border-white/8 text-center">
          <p className="text-white/40 text-sm">
            {selectedId
              ? "No analytics data for this campaign yet."
              : "Select a campaign above or fund one to start tracking."}
          </p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendUp size={18} color="#a855f7" variant="Bold" />
              <h3 className="text-base font-semibold text-white">
                Impressions Over Time
              </h3>
            </div>
            <p className="text-xs text-white/30 mb-6 ml-6">
              {selectedCampaign
                ? `For "${selectedCampaign.name}"`
                : "Daily impressions across all campaigns"}
            </p>
            <PerformanceChart
              data={chartData}
              lines={[
                { key: "impressions", color: "#a855f7", label: "Impressions" },
              ]}
              height={240}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendUp size={18} color="#22d3ee" variant="Bold" />
              <h3 className="text-base font-semibold text-white">
                Clicks Over Time
              </h3>
            </div>
            <p className="text-xs text-white/30 mb-6 ml-6">
              {selectedCampaign
                ? `For "${selectedCampaign.name}"`
                : "Daily clicks across all campaigns"}
            </p>
            <PerformanceChart
              data={chartData}
              lines={[{ key: "clicks", color: "#22d3ee", label: "Clicks" }]}
              height={240}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendUp size={18} color="#f7931a" variant="Bold" />
              <h3 className="text-base font-semibold text-white">
                Spend vs Performance
              </h3>
            </div>
            <p className="text-xs text-white/30 mb-6 ml-6">
              Daily spend correlated with clicks
            </p>
            <PerformanceChart
              data={chartData}
              lines={[
                { key: "spend", color: "#f7931a", label: "Spend (USDC)" },
                { key: "clicks", color: "#4ade80", label: "Clicks" },
              ]}
              height={240}
            />
          </motion.div>
        </>
      )}

      {/* T18 — Comparison chart */}
      {compareMode && compareId && compareChartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-2xl p-6 border border-[#a855f7]/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendUp size={18} color="#a855f7" variant="Bold" />
            <h3 className="text-base font-semibold text-white">
              Campaign Comparison — Clicks
            </h3>
          </div>
          <p className="text-xs text-white/30 mb-6 ml-6">
            Side-by-side daily clicks
          </p>
          <PerformanceChart
            data={compareChartData}
            lines={[
              {
                key: "clicks_a",
                color: "#22d3ee",
                label:
                  campaigns
                    .find((c) => c._id === selectedId)
                    ?.name?.slice(0, 16) ?? "Campaign A",
              },
              {
                key: "clicks_b",
                color: "#f7931a",
                label:
                  campaigns
                    .find((c) => c._id === compareId)
                    ?.name?.slice(0, 16) ?? "Campaign B",
              },
            ]}
            height={240}
          />
        </motion.div>
      )}

      {/* T19 — Time-of-day heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Flash size={18} color="#22d3ee" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Best Hours to Advertise
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-5 ml-6">
          Click volume by hour of day (UTC)
        </p>
        {heatmapLoading ? (
          <div className="h-16 bg-white/5 rounded animate-pulse" />
        ) : heatmap.every((h) => h.clicks === 0) ? (
          <p className="text-sm text-white/30 text-center py-6">
            No click data yet for this period.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-1">
              {heatmap.map(({ hour, clicks }) => {
                const max = Math.max(...heatmap.map((h) => h.clicks), 1);
                const intensity = clicks / max;
                const bg =
                  intensity === 0
                    ? "bg-white/5"
                    : intensity < 0.33
                      ? "bg-[#3b82f6]/30"
                      : intensity < 0.66
                        ? "bg-[#a855f7]/50"
                        : "bg-[#f7931a]/80";
                return (
                  <div
                    key={hour}
                    title={`${hour}:00 — ${clicks} clicks`}
                    className={`flex-1 h-10 rounded-md ${bg} transition-all cursor-default`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-white/20 px-0.5">
              <span>12am</span>
              <span>6am</span>
              <span>12pm</span>
              <span>6pm</span>
              <span>11pm</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/30">Low</span>
              <div className="flex gap-1">
                {[
                  "bg-white/5",
                  "bg-[#3b82f6]/30",
                  "bg-[#a855f7]/50",
                  "bg-[#f7931a]/80",
                ].map((c) => (
                  <span key={c} className={`w-4 h-2 rounded-sm ${c}`} />
                ))}
              </div>
              <span className="text-[10px] text-white/30">High</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* T16 — Top campaigns table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Flash size={15} color="#EBFF45" />
            <h3 className="text-base font-semibold text-white">
              Top Performing Campaigns
            </h3>
          </div>
          {topCampaigns.length > 0 && (
            <button
              onClick={() =>
                exportCSV(
                  topCampaigns.map((c) => ({
                    name: c.name,
                    status: c.status,
                    impressions: c.impressions,
                    clicks: c.clicks,
                    ctr: c.ctr,
                    spent: c.spent,
                  })),
                  "top-campaigns.csv",
                )
              }
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              <DocumentDownload size={13} color="currentColor" /> Export
            </button>
          )}
        </div>

        {topLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-3 bg-white/8 rounded flex-1" />
                <div className="h-3 bg-white/5 rounded w-16" />
                <div className="h-3 bg-white/5 rounded w-16" />
                <div className="h-3 bg-white/8 rounded w-12" />
              </div>
            ))}
          </div>
        ) : topCampaigns.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-white/30">No campaign data yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "#",
                    "Campaign",
                    "Status",
                    "Impressions",
                    "Clicks",
                    "CTR",
                    "Spent",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((c, i) => (
                  <tr
                    key={String(c.campaignId)}
                    onClick={() => {
                      setSelectedId(String(c.campaignId));
                      router.replace(
                        `/dashboard/analytics?campaign=${c.campaignId}`,
                      );
                    }}
                    className={`border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-white/20 font-bold text-xs">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white max-w-[180px] truncate">
                      {c.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          c.status === "active"
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : c.status === "paused"
                              ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                              : "bg-white/5 text-white/40 border border-white/10"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/60 tabular-nums">
                      {c.impressions.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-white/60 tabular-nums">
                      {c.clicks.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-400 tabular-nums">
                      {c.ctr.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3.5 text-[#f7931a] tabular-nums">
                      {c.spent.toFixed(2)} USDC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense>
      <AnalyticsContent />
    </Suspense>
  );
}
