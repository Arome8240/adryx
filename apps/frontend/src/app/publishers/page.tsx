"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DollarCircle,
  Eye,
  MouseCircle,
  TrendUp,
  Code1,
  Clock,
  Flash,
  AddCircle,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import Link from "next/link";
import {
  usePublisherDashboard,
  usePublisherEarnings,
  usePublisherTopPlacements,
  usePublisherActivity,
} from "@/hooks/usePublisher";

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}18` }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-white/40 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PublishersPage() {
  const router = useRouter();
  const { dashboard, isLoading: dashLoading } = usePublisherDashboard();
  const { earningsChart, isLoading: chartLoading } = usePublisherEarnings(30);
  const { topPlacements, isLoading: topLoading } = usePublisherTopPlacements(5);
  const { activity, isLoading: activityLoading } = usePublisherActivity(6);

  const ecpm =
    dashboard && dashboard.impressions > 0
      ? (
          (parseFloat(dashboard.totalEarnings) / dashboard.impressions) *
          1000
        ).toFixed(2)
      : "0.00";

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
          <h1 className="text-xl font-bold text-white">Publisher Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Track your earnings and ad performance
          </p>
        </div>
        <Link
          href="/publishers/integrate"
          className="flex items-center gap-2 px-4 py-2 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Code1 size={16} color="#ffffff" variant="Bold" />
          Integration Guide
        </Link>
      </motion.div>

      {/* Stats */}
      {dashLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 animate-pulse space-y-3"
            >
              <div className="h-3 bg-white/8 rounded w-1/3" />
              <div className="h-7 bg-white/8 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : dashboard ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Earnings"
            value={`$${parseFloat(dashboard.totalEarnings).toFixed(2)}`}
            sub="USDC lifetime"
            icon={<DollarCircle size={16} color="#EBFF45" />}
            accent="#EBFF45"
          />
          <StatCard
            label="Impressions"
            value={dashboard.impressions.toLocaleString()}
            sub={`${dashboard.clicks.toLocaleString()} clicks`}
            icon={<Eye size={16} color="#EBFF45" />}
            accent="#EBFF45"
          />
          <StatCard
            label="CTR"
            value={`${dashboard.ctr}%`}
            sub={`${dashboard.totalPlacements} placements`}
            icon={<MouseCircle size={16} color="#d4e63c" />}
            accent="#d4e63c"
          />
          <StatCard
            label="eCPM"
            value={`$${ecpm}`}
            sub={`${dashboard.totalSites} sites`}
            icon={<TrendUp size={16} color="#f7931a" />}
            accent="#f7931a"
          />
        </div>
      ) : null}

      {/* Earnings chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">
              Earnings Overview
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Last 30 days</p>
          </div>
          <Link
            href="/publishers/analytics"
            className="text-xs text-[#EBFF45] hover:text-[#c084fc] transition-colors"
          >
            Full analytics →
          </Link>
        </div>
        {chartLoading ? (
          <div className="h-48 bg-white/5 rounded animate-pulse" />
        ) : earningsChart.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-white/30">
              No earnings data yet. Add placements to start earning.
            </p>
          </div>
        ) : (
          <PerformanceChart
            data={earningsChart}
            lines={[
              { key: "earnings", color: "#EBFF45", label: "Earnings (USDC)" },
            ]}
            height={200}
          />
        )}
      </motion.div>

      {/* Bottom two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top placements */}
        <div className="rounded-2xl bg-[#0f0f13] border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Flash size={15} color="#EBFF45" />
              <p className="text-sm font-semibold text-white">Top Placements</p>
            </div>
            <Link
              href="/publishers/placements"
              className="text-xs text-[#EBFF45] hover:text-[#c084fc] transition-colors"
            >
              All placements →
            </Link>
          </div>
          {topLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/8 rounded w-1/2" />
                    <div className="h-2 bg-white/5 rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-white/8 rounded w-16" />
                </div>
              ))}
            </div>
          ) : topPlacements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <p className="text-sm text-white/30">No placements yet</p>
              <Link
                href="/publishers/placements"
                className="flex items-center gap-1.5 text-xs text-[#f7931a] hover:text-[#f7931a]/80 transition-colors"
              >
                <AddCircle size={13} color="currentColor" /> Add your first
                placement
              </Link>
            </div>
          ) : (
            <ul>
              {topPlacements.map((p, i) => (
                <li
                  key={String(p.placementId)}
                  onClick={() => router.push("/publishers/placements")}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/3 transition-colors ${i !== 0 ? "border-t border-white/5" : ""}`}
                >
                  <span className="text-xs font-bold text-white/20 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-white/30 capitalize">
                      {p.format} · {p.impressions.toLocaleString()} impr
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#EBFF45]">
                      ${p.earnings.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-white/30">USDC</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl bg-[#0f0f13] border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Clock size={15} color="#EBFF45" />
              <p className="text-sm font-semibold text-white">
                Recent Activity
              </p>
            </div>
            <Link
              href="/publishers/placements"
              className="text-xs text-[#EBFF45] hover:text-[#c084fc] transition-colors"
            >
              All placements →
            </Link>
          </div>
          {activityLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/8 rounded w-2/3" />
                    <div className="h-2 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-white/30">No activity yet</p>
            </div>
          ) : (
            <ul className="p-3 space-y-1">
              {activity.map((item, i) => (
                <li
                  key={String(item.placementId) + i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#EBFF45]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-white/40"> on {item.siteName}</span>
                    </p>
                    <p className="text-xs text-white/30 mt-0.5 capitalize">
                      {item.format} · {timeAgo(item.updatedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
