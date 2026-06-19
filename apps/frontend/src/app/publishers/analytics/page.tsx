"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  MouseCircle,
  DollarCircle,
  TrendUp,
  Calendar,
  DocumentDownload,
  Flash,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import {
  usePublisherDashboard,
  usePublisherEarnings,
  usePublisherTopPlacements,
  usePublisherHeatmap,
} from "@/hooks/usePublisher";

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

export default function PublisherAnalyticsPage() {
  const [rangeIdx, setRangeIdx] = useState(1);
  const days = ranges[rangeIdx].days;

  const { dashboard } = usePublisherDashboard();
  const { earningsChart, isLoading: chartLoading } = usePublisherEarnings(days);
  const { topPlacements, isLoading: topLoading } =
    usePublisherTopPlacements(10);
  const { heatmap, isLoading: heatmapLoading } = usePublisherHeatmap(days);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Deep dive into your performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 glass rounded-xl p-1 border border-white/8">
            <Calendar size={16} color="#EBFF45" className="ml-2" />
            {ranges.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setRangeIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rangeIdx === i
                    ? "bg-[#EBFF45]/20 text-[#EBFF45]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {earningsChart.length > 0 && (
            <button
              onClick={() =>
                exportCSV(
                  earningsChart,
                  `publisher-analytics-${ranges[rangeIdx].label}.csv`,
                )
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 text-white/60 hover:text-white text-xs font-medium transition-colors"
            >
              <DocumentDownload size={14} color="currentColor" /> Export
            </button>
          )}
        </div>
      </motion.div>

      {/* Metric cards */}
      {dashboard && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total Earnings",
              value: `$${parseFloat(dashboard.totalEarnings).toFixed(2)}`,
              icon: <DollarCircle size={16} color="#EBFF45" />,
              accent: "#EBFF45",
            },
            {
              label: "Impressions",
              value: dashboard.impressions.toLocaleString(),
              icon: <Eye size={16} color="#EBFF45" />,
              accent: "#EBFF45",
            },
            {
              label: "Clicks",
              value: dashboard.clicks.toLocaleString(),
              icon: <MouseCircle size={16} color="#d4e63c" />,
              accent: "#d4e63c",
            },
            {
              label: "CTR",
              value: `${dashboard.ctr}%`,
              icon: <TrendUp size={16} color="#f7931a" />,
              accent: "#f7931a",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {s.label}
                </p>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.accent}18` }}
                >
                  {s.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Earnings chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendUp size={18} color="#EBFF45" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Earnings Over Time
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-5 ml-6">Daily USDC earnings</p>
        {chartLoading ? (
          <div className="h-56 bg-white/5 rounded animate-pulse" />
        ) : earningsChart.length === 0 ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-sm text-white/30">
              No earnings data for this period.
            </p>
          </div>
        ) : (
          <PerformanceChart
            data={earningsChart}
            lines={[
              { key: "earnings", color: "#EBFF45", label: "Earnings (USDC)" },
              { key: "clicks", color: "#d4e63c", label: "Clicks" },
            ]}
            height={240}
          />
        )}
      </motion.div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Flash size={18} color="#d4e63c" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Best Hours for Clicks
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-5 ml-6">
          Click volume by hour of day (UTC)
        </p>
        {heatmapLoading ? (
          <div className="h-16 bg-white/5 rounded animate-pulse" />
        ) : heatmap.every((h) => h.clicks === 0) ? (
          <p className="text-sm text-white/30 text-center py-6">
            No click data yet.
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
                      ? "bg-[#d4e63c]/30"
                      : intensity < 0.66
                        ? "bg-[#EBFF45]/50"
                        : "bg-[#EBFF45]/80";
                return (
                  <div
                    key={hour}
                    title={`${hour}:00 — ${clicks} clicks`}
                    className={`flex-1 h-10 rounded-md ${bg} cursor-default`}
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
          </div>
        )}
      </motion.div>

      {/* Top placements table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Flash size={15} color="#EBFF45" />
            <h3 className="text-base font-semibold text-white">
              Top Performing Placements
            </h3>
          </div>
          {topPlacements.length > 0 && (
            <button
              onClick={() =>
                exportCSV(
                  topPlacements.map((p) => ({
                    name: p.name,
                    format: p.format,
                    impressions: p.impressions,
                    clicks: p.clicks,
                    ctr: p.ctr,
                    earnings: p.earnings,
                  })),
                  "top-placements.csv",
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
              <div key={i} className="animate-pulse h-3 bg-white/8 rounded" />
            ))}
          </div>
        ) : topPlacements.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-white/30">No placement data yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "#",
                    "Placement",
                    "Format",
                    "Impressions",
                    "Clicks",
                    "CTR",
                    "Earnings",
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
                {topPlacements.map((p, i) => (
                  <tr
                    key={String(p.placementId)}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-white/20 font-bold text-xs">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white max-w-[160px] truncate">
                      {p.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-white/40 capitalize">
                        {p.format}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/60 tabular-nums">
                      {p.impressions.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-white/60 tabular-nums">
                      {p.clicks.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#d4e63c] tabular-nums">
                      {p.ctr.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#EBFF45] tabular-nums">
                      ${p.earnings.toFixed(4)}
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
