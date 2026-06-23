"use client";

import { useAuth } from "@/hooks/useAuth";
import { URLS, navigateTo } from "@/lib/urls";
import {
  useAdvertiserDashboard,
  useAdvertiserActivity,
  useTopCampaigns,
} from "@/hooks/useAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  Chart,
  TrendUp,
  AddCircle,
  EmptyWallet,
  MouseCircle,
  PercentageCircle,
  ArrowRight,
  Clock,
  Flash,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";

const ACTIVITY_COLORS: Record<string, { dot: string; label: string }> = {
  active: { dot: "bg-emerald-400", label: "Funded & activated" },
  paused: { dot: "bg-yellow-400", label: "Paused" },
  draft: { dot: "bg-white/30", label: "Created" },
  completed: { dot: "bg-[#a855f7]", label: "Completed" },
};

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
    <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 flex flex-col gap-3">
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

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 animate-pulse space-y-3">
      <div className="h-3 bg-white/8 rounded w-1/3" />
      <div className="h-7 bg-white/8 rounded w-1/2" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
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

export default function OverviewPage() {
  const { user } = useAuth();
  const { dashboard, isLoading: dashboardLoading } = useAdvertiserDashboard();
  const { campaigns } = useCampaigns();
  const { activity, isLoading: activityLoading } = useAdvertiserActivity(6);
  const { topCampaigns, isLoading: topLoading } = useTopCampaigns(5);

  // T01 — Spending velocity: derive daily spend from campaigns (budget / days active)
  const velocityData = campaigns
    .filter((c) => c.status === "active" && c.spent > 0)
    .map((c) => {
      const start = new Date(c.startDate ?? c.createdAt);
      const daysActive = Math.max(
        1,
        Math.ceil((Date.now() - start.getTime()) / 86400000),
      );
      return {
        name: c.name.slice(0, 12),
        dailyBurn: parseFloat((c.spent / daysActive).toFixed(4)),
      };
    })
    .sort((a, b) => b.dailyBurn - a.dailyBurn)
    .slice(0, 6);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {greeting}
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Here's what's happening with your campaigns.
          </p>
        </div>
        <button
          onClick={() => navigateTo(URLS.dashboardCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold transition-colors"
        >
          <AddCircle size={16} color="#0e0e00" />
          New Campaign
        </button>
      </div>

      {/* Stats grid */}
      {dashboardLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : dashboard ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Campaigns"
            value={dashboard.totalCampaigns}
            sub={`${dashboard.activeCampaigns} active`}
            icon={<Chart size={16} color="#a855f7" />}
            accent="#a855f7"
          />
          <StatCard
            label="Total Budget"
            value={`${dashboard.totalBudget.toFixed(2)} USDC`}
            sub={`${dashboard.totalSpent.toFixed(2)} USDC spent`}
            icon={<EmptyWallet size={16} color="#EBFF45" />}
            accent="#EBFF45"
          />
          <StatCard
            label="Impressions"
            value={dashboard.impressions.toLocaleString()}
            sub={`${dashboard.clicks.toLocaleString()} clicks`}
            icon={<MouseCircle size={16} color="#3b82f6" />}
            accent="#3b82f6"
          />
          <StatCard
            label="CTR"
            value={`${dashboard.ctr}%`}
            sub={`Avg CPC: ${dashboard.avgCpc} USDC`}
            icon={<PercentageCircle size={16} color="#4ade80" />}
            accent="#4ade80"
          />
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "New Campaign",
            desc: "Launch a new ad campaign",
            icon: <AddCircle size={20} color="#EBFF45" />,
            accent: "#EBFF45",
            href: URLS.dashboardCreate,
          },
          {
            label: "Campaigns",
            desc: "Manage existing campaigns",
            icon: <Chart size={20} color="#a855f7" />,
            accent: "#a855f7",
            href: URLS.dashboardCampaigns,
          },
          {
            label: "Analytics",
            desc: "View performance reports",
            icon: <TrendUp size={20} color="#3b82f6" />,
            accent: "#3b82f6",
            href: URLS.dashboardAnalytics,
          },
        ].map((action) => (
          <button
            key={action.href}
            onClick={() => navigateTo(action.href)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#0d0d1a] border border-white/8 hover:border-white/15 transition-colors text-left group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${action.accent}15` }}
            >
              {action.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{action.label}</p>
              <p className="text-xs text-white/40">{action.desc}</p>
            </div>
            <ArrowRight
              size={14}
              color="#ffffff20"
              className="ml-auto shrink-0"
            />
          </button>
        ))}
      </div>

      {/* T01 — Spending velocity + T02 — Budget health */}
      {campaigns.filter((c) => c.status === "active").length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* T01 Velocity chart */}
          <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendUp size={15} color="#f7931a" />
              <p className="text-sm font-semibold text-white">
                Daily Burn Rate
              </p>
              <span className="text-xs text-white/30 ml-auto">USDC / day</span>
            </div>
            {velocityData.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-8">
                No spend data yet
              </p>
            ) : (
              <PerformanceChart
                data={velocityData}
                lines={[
                  { key: "dailyBurn", color: "#f7931a", label: "USDC/day" },
                ]}
                height={160}
              />
            )}
          </div>

          {/* T02 Budget health */}
          <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5">
            <div className="flex items-center gap-2 mb-4">
              <EmptyWallet size={15} color="#a855f7" />
              <p className="text-sm font-semibold text-white">Budget Health</p>
            </div>
            <div className="space-y-3">
              {campaigns
                .filter((c) => c.status === "active" || c.status === "paused")
                .slice(0, 5)
                .map((c) => {
                  const pct =
                    c.budget > 0
                      ? Math.min((c.spent / c.budget) * 100, 100)
                      : 0;
                  const color =
                    pct >= 85 ? "#f87171" : pct >= 60 ? "#f7931a" : "#4ade80";
                  return (
                    <div key={c._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60 truncate max-w-[140px]">
                          {c.name}
                        </span>
                        <span
                          className="text-xs font-semibold tabular-nums"
                          style={{ color }}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* T04 — Top performing campaigns */}
        <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Flash size={15} color="#EBFF45" />
              <p className="text-sm font-semibold text-white">Top Campaigns</p>
            </div>
            <button
              onClick={() => navigateTo(URLS.dashboardAnalytics)}
              className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors"
            >
              Full analytics →
            </button>
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
                  <div className="h-3 bg-white/8 rounded w-12" />
                </div>
              ))}
            </div>
          ) : topCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-sm text-white/30">No campaign data yet</p>
            </div>
          ) : (
            <ul>
              {topCampaigns.map((c, i) => (
                <li
                  key={String(c.campaignId)}
                  onClick={() =>
                    router.push(`/dashboard/analytics?campaign=${c.campaignId}`)
                  }
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/3 transition-colors ${i !== 0 ? "border-t border-white/5" : ""}`}
                >
                  <span className="text-xs font-bold text-white/20 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-white/30">
                      {c.impressions.toLocaleString()} impr ·{" "}
                      {c.clicks.toLocaleString()} clicks
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-400">
                      {c.ctr.toFixed(2)}%
                    </p>
                    <p className="text-[10px] text-white/30">CTR</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* T03 — Activity feed */}
        <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Clock size={15} color="#a855f7" />
              <p className="text-sm font-semibold text-white">
                Recent Activity
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/campaigns")}
              className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors"
            >
              All campaigns →
            </button>
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
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-sm text-white/30">No activity yet</p>
            </div>
          ) : (
            <ul className="p-3 space-y-1">
              {activity.map((item, i) => {
                const ac =
                  ACTIVITY_COLORS[item.status] ?? ACTIVITY_COLORS.draft;
                return (
                  <li
                    key={String(item.campaignId) + i}
                    onClick={() => router.push("/dashboard/campaigns")}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 cursor-pointer transition-colors"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ac.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-white/40"> — {ac.label}</span>
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        {item.budget.toFixed(2)} USDC budget ·{" "}
                        {timeAgo(item.updatedAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
