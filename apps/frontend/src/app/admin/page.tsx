"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { URLS } from "@/lib/urls";
import { useAdminStats } from "@/hooks/useAdmin";
import {
  People,
  Chart,
  Eye,
  DollarCircle,
  TrendUp,
  ArrowRight,
  Flash,
} from "iconsax-react";

function StatCard({
  label, value, sub, icon, accent,
}: {
  label: string; value: string | number; sub: string; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}18` }}>
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

const ROLE_COLORS: Record<string, string> = {
  admin:      "#a855f7",
  advertiser: "#EBFF45",
  publisher:  "#f7931a",
};

export default function AdminOverviewPage() {
  const { stats, isLoading, error } = useAdminStats();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-xl font-bold text-white">Platform Overview</h1>
        <p className="text-sm text-white/40 mt-0.5">Real-time metrics across all users and campaigns</p>
      </motion.div>

      {error && (
        <div className="rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 p-4">
          <p className="text-sm text-[#f87171]">{error}</p>
        </div>
      )}

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 animate-pulse space-y-3">
              <div className="h-3 bg-white/8 rounded w-1/3" />
              <div className="h-7 bg-white/8 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Total Users"
              value={stats.totalUsers.toLocaleString()}
              sub={`${stats.advertiserCount} advertisers · ${stats.publisherCount} publishers`}
              icon={<People size={16} color="#a855f7" />}
              accent="#a855f7"
            />
            <StatCard
              label="Campaigns"
              value={stats.totalCampaigns.toLocaleString()}
              sub={`${stats.activeCampaigns} active`}
              icon={<Chart size={16} color="#EBFF45" />}
              accent="#EBFF45"
            />
            <StatCard
              label="Impressions"
              value={stats.totalImpressions.toLocaleString()}
              sub="platform-wide"
              icon={<Eye size={16} color="#3b82f6" />}
              accent="#3b82f6"
            />
            <StatCard
              label="Total Spend"
              value={`$${stats.totalSpent.toFixed(2)}`}
              sub={`of $${stats.totalBudget.toFixed(2)} total budget`}
              icon={<DollarCircle size={16} color="#4ade80" />}
              accent="#4ade80"
            />
          </div>

          {/* Budget utilisation */}
          {stats.totalBudget > 0 && (
            <div className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendUp size={15} color="#4ade80" />
                  <p className="text-sm font-semibold text-white">Budget Utilisation</p>
                </div>
                <span className="text-xs text-white/40">
                  ${stats.totalSpent.toFixed(2)} / ${stats.totalBudget.toFixed(2)} USDC
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4ade80] transition-all"
                  style={{ width: `${Math.min((stats.totalSpent / stats.totalBudget) * 100, 100).toFixed(1)}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-1.5">
                {((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of all budgets consumed
              </p>
            </div>
          )}

          {/* Quick nav */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Manage Users",  desc: `${stats.totalUsers} registered users`,  href: URLS.adminUsers,     accent: "#a855f7", icon: <People size={20} color="#a855f7" /> },
              { label: "All Campaigns", desc: `${stats.totalCampaigns} campaigns`,      href: URLS.adminCampaigns, accent: "#3b82f6", icon: <Chart  size={20} color="#3b82f6" /> },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#0f0f13] border border-white/8 hover:border-white/15 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.accent}15` }}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{card.label}</p>
                  <p className="text-xs text-white/40">{card.desc}</p>
                </div>
                <ArrowRight size={14} color="#ffffff20" className="ml-auto shrink-0" />
              </Link>
            ))}
          </div>

          {/* Recent sign-ups */}
          {stats.recentUsers?.length > 0 && (
            <div className="rounded-2xl bg-[#0f0f13] border border-white/8 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Flash size={15} color="#a855f7" />
                  <p className="text-sm font-semibold text-white">Recent Sign-ups</p>
                </div>
                <Link href={URLS.adminUsers} className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
                  All users →
                </Link>
              </div>
              <ul>
                {stats.recentUsers.map((u: any, i: number) => (
                  <li key={u._id} className={`flex items-center gap-3 px-5 py-3 ${i !== 0 ? "border-t border-white/5" : ""}`}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: `${ROLE_COLORS[u.role] ?? "#6b7280"}20`, color: ROLE_COLORS[u.role] ?? "#6b7280" }}
                    >
                      {u.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{u.name}</p>
                      <p className="text-xs text-white/30 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize"
                        style={{ backgroundColor: `${ROLE_COLORS[u.role] ?? "#6b7280"}15`, color: ROLE_COLORS[u.role] ?? "#6b7280" }}
                      >
                        {u.role}
                      </span>
                      <span className="text-xs text-white/25">{timeAgo(u.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
