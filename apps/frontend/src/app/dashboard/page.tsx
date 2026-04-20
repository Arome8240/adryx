"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdvertiserDashboard } from "@/hooks/useAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  Chart,
  TrendUp,
  AddCircle,
  EmptyWallet,
  MouseCircle,
  PercentageCircle,
  ArrowRight,
} from "iconsax-react";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  paused: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  draft: "bg-white/5 text-white/40 border border-white/10",
  completed: "bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20",
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
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

export default function OverviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { dashboard, isLoading: dashboardLoading } = useAdvertiserDashboard();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();

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
          onClick={() => router.push("/dashboard/create")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold transition-colors"
        >
          <AddCircle size={16} color="white" />
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
            value={`${dashboard.totalBudget.toFixed(2)} SOL`}
            sub={`${dashboard.totalSpent.toFixed(2)} SOL spent`}
            icon={<EmptyWallet size={16} color="#f7931a" />}
            accent="#f7931a"
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
            sub={`Avg CPC: ${dashboard.avgCpc} SOL`}
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
            icon: <AddCircle size={20} color="#f7931a" />,
            accent: "#f7931a",
            href: "/dashboard/create",
          },
          {
            label: "Campaigns",
            desc: "Manage existing campaigns",
            icon: <Chart size={20} color="#a855f7" />,
            accent: "#a855f7",
            href: "/dashboard/campaigns",
          },
          {
            label: "Analytics",
            desc: "View performance reports",
            icon: <TrendUp size={20} color="#3b82f6" />,
            accent: "#3b82f6",
            href: "/dashboard/analytics",
          },
        ].map((action) => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
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
              className="ml-auto shrink-0 group-hover:text-white/40 transition-colors"
            />
          </button>
        ))}
      </div>

      {/* Recent campaigns */}
      <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="text-sm font-semibold text-white">Recent Campaigns</p>
          <button
            onClick={() => router.push("/dashboard/campaigns")}
            className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors"
          >
            View all →
          </button>
        </div>

        {campaignsLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/8 rounded w-1/3" />
                  <div className="h-2.5 bg-white/5 rounded w-1/4" />
                </div>
                <div className="h-3 bg-white/8 rounded w-16" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f7931a]/10 flex items-center justify-center">
              <Chart size={22} color="#f7931a" />
            </div>
            <p className="text-sm text-white/40">No campaigns yet</p>
            <button
              onClick={() => router.push("/dashboard/create")}
              className="text-xs text-[#f7931a] hover:text-[#f7931a]/80 transition-colors"
            >
              Create your first campaign →
            </button>
          </div>
        ) : (
          <ul>
            {campaigns.slice(0, 5).map((c, i) => (
              <li
                key={c._id}
                onClick={() => router.push("/dashboard/campaigns")}
                className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-white/3 transition-colors ${
                  i !== 0 ? "border-t border-white/5" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a]/20 to-[#a855f7]/20 flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-white/30 capitalize">{c.format}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[c.status] ?? STATUS_STYLES.draft}`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs font-semibold text-white/60 tabular-nums">
                    {c.budget.toFixed(2)} SOL
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
