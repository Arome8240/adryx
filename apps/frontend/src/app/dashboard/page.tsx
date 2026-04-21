"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
  active: { dot: "bg-success-500", label: "Funded & activated" },
  paused: { dot: "bg-warning-500", label: "Paused" },
  draft: { dot: "bg-text-tertiary", label: "Created" },
  completed: { dot: "bg-purple-500", label: "Completed" },
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
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="label-xs text-text-tertiary">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}18` }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="heading-3">{value}</p>
        <p className="label-xs text-text-tertiary mt-1">{sub}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse space-y-3">
      <div className="h-3 bg-bg-tertiary rounded w-1/3" />
      <div className="h-7 bg-bg-tertiary rounded w-1/2" />
      <div className="h-3 bg-bg-secondary rounded w-2/3" />
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
  const router = useRouter();
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
          <h1 className="heading-2">
            {greeting}
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="body-sm text-text-secondary mt-1">
            Here's what's happening with your campaigns.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/create")}
          className="btn-primary"
        >
          <AddCircle size={16} color="#000000" variant="Bold" />
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
            icon={<Chart size={16} color="#a855f7" variant="Bold" />}
            accent="#a855f7"
          />
          <StatCard
            label="Total Budget"
            value={`${dashboard.totalBudget.toFixed(2)} USDC`}
            sub={`${dashboard.totalSpent.toFixed(2)} USDC spent`}
            icon={<EmptyWallet size={16} color="#f97316" variant="Bold" />}
            accent="#f97316"
          />
          <StatCard
            label="Impressions"
            value={dashboard.impressions.toLocaleString()}
            sub={`${dashboard.clicks.toLocaleString()} clicks`}
            icon={<MouseCircle size={16} color="#06b6d4" variant="Bold" />}
            accent="#06b6d4"
          />
          <StatCard
            label="CTR"
            value={`${dashboard.ctr}%`}
            sub={`Avg CPC: ${dashboard.avgCpc} USDC`}
            icon={<PercentageCircle size={16} color="#22c55e" variant="Bold" />}
            accent="#22c55e"
          />
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "New Campaign",
            desc: "Launch a new ad campaign",
            icon: <AddCircle size={18} color="#f97316" variant="Bold" />,
            accent: "#f97316",
            href: "/dashboard/create",
          },
          {
            label: "Campaigns",
            desc: "Manage existing campaigns",
            icon: <Chart size={18} color="#a855f7" variant="Bold" />,
            accent: "#a855f7",
            href: "/dashboard/campaigns",
          },
          {
            label: "Analytics",
            desc: "View performance reports",
            icon: <TrendUp size={18} color="#06b6d4" variant="Bold" />,
            accent: "#06b6d4",
            href: "/dashboard/analytics",
          },
        ].map((action) => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
            className="flex items-center gap-3 px-4 py-3 card hover:border-border-hover transition-all duration-200 text-left group"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${action.accent}15` }}
            >
              {action.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="label-sm text-text-primary">{action.label}</p>
              <p className="label-xs text-text-tertiary">{action.desc}</p>
            </div>
            <ArrowRight
              size={14}
              color="#a1a1aa"
              className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>

      {/* T01 — Spending velocity + T02 — Budget health */}
      {campaigns.filter((c) => c.status === "active").length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* T01 Velocity chart */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendUp size={16} color="#f97316" variant="Bold" />
              <p className="label-sm text-text-primary">
                Daily Burn Rate
              </p>
              <span className="label-xs text-text-tertiary ml-auto">USDC / day</span>
            </div>
            {velocityData.length === 0 ? (
              <p className="body-sm text-text-tertiary text-center py-8">
                No spend data yet
              </p>
            ) : (
              <PerformanceChart
                data={velocityData}
                lines={[
                  { key: "dailyBurn", color: "#f97316", label: "USDC/day" },
                ]}
                height={160}
              />
            )}
          </div>

          {/* T02 Budget health */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <EmptyWallet size={16} color="#a855f7" variant="Bold" />
              <p className="label-sm text-text-primary">Budget Health</p>
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
                    pct >= 85 ? "#ef4444" : pct >= 60 ? "#f97316" : "#22c55e";
                  return (
                    <div key={c._id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="label-xs text-text-secondary truncate max-w-[140px]">
                          {c.name}
                        </span>
                        <span
                          className="label-xs font-semibold tabular-nums"
                          style={{ color }}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-200"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* T04 — Top performing campaigns */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Flash size={16} color="#f97316" variant="Bold" />
              <p className="label-sm text-text-primary">Top Campaigns</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/analytics")}
              className="label-xs text-primary hover:text-primary-600 transition-colors"
            >
              Full analytics →
            </button>
          </div>

          {topLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-bg-tertiary shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                    <div className="h-2 bg-bg-secondary rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-bg-tertiary rounded w-12" />
                </div>
              ))}
            </div>
          ) : topCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="body-sm text-text-tertiary">No campaign data yet</p>
            </div>
          ) : (
            <ul>
              {topCampaigns.map((c, i) => (
                <li
                  key={String(c.campaignId)}
                  onClick={() =>
                    router.push(`/dashboard/analytics?campaign=${c.campaignId}`)
                  }
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-bg-tertiary transition-colors duration-200 ${i !== 0 ? "border-t border-border" : ""}`}
                >
                  <span className="label-xs font-semibold text-text-tertiary w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="label-sm text-text-primary truncate">
                      {c.name}
                    </p>
                    <p className="label-xs text-text-tertiary">
                      {c.impressions.toLocaleString()} impr ·{" "}
                      {c.clicks.toLocaleString()} clicks
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="label-sm font-semibold text-success-500">
                      {c.ctr.toFixed(2)}%
                    </p>
                    <p className="label-xs text-text-tertiary">CTR</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* T03 — Activity feed */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock size={16} color="#a855f7" variant="Bold" />
              <p className="label-sm text-text-primary">
                Recent Activity
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/campaigns")}
              className="label-xs text-primary hover:text-primary-600 transition-colors"
            >
              All campaigns →
            </button>
          </div>

          {activityLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-bg-tertiary shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-bg-tertiary rounded w-2/3" />
                    <div className="h-2 bg-bg-secondary rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="body-sm text-text-tertiary">No activity yet</p>
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
                    className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-bg-tertiary cursor-pointer transition-colors duration-200"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ac.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="body-sm text-text-secondary truncate">
                        <span className="font-medium text-text-primary">{item.name}</span>
                        <span className="text-text-tertiary"> — {ac.label}</span>
                      </p>
                      <p className="label-xs text-text-tertiary mt-0.5">
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
