"use client";
import { motion } from "framer-motion";
import {
  DollarCircle,
  Eye,
  MouseCircle,
  Code1,
  TrendUp,
  Calendar,
} from "iconsax-react";
import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import {
  publisherMetrics,
  publisherEarningsData,
  publisherPlacements,
} from "@/lib/publisher-mock-data";
import Link from "next/link";

const metrics = [
  {
    title: "Total Earnings",
    value: `$${publisherMetrics.totalEarnings.toLocaleString()}`,
    change: "+18.2%",
    positive: true,
    icon: <DollarCircle size={20} color="#4ade80" variant="Bold" />,
    iconBg: "bg-[#4ade80]/10",
  },
  {
    title: "Impressions",
    value: `${(publisherMetrics.impressions / 1000).toFixed(1)}M`,
    change: "+12.4%",
    positive: true,
    icon: <Eye size={20} color="#a855f7" variant="Bold" />,
    iconBg: "bg-[#a855f7]/10",
  },
  {
    title: "Clicks",
    value: `${(publisherMetrics.clicks / 1000).toFixed(1)}K`,
    change: "+9.8%",
    positive: true,
    icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
    iconBg: "bg-[#22d3ee]/10",
  },
  {
    title: "eCPM",
    value: `$${publisherMetrics.ecpm.toFixed(2)}`,
    change: "+5.1%",
    positive: true,
    icon: <TrendUp size={20} color="#f7931a" variant="Bold" />,
    iconBg: "bg-[#f7931a]/10",
  },
];

export default function PublishersPage() {
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
          <h1 className="text-2xl font-bold text-white">Publisher Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">
            Track your earnings and ad performance
          </p>
        </div>
        <Link
          href="/publishers/integrate"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Code1 size={18} color="#ffffff" variant="Bold" />
          Integration Guide
        </Link>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Earnings Overview
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Last 30 days</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} color="#a855f7" variant="Bold" />
            <span className="text-xs text-white/30 px-3 py-1.5 rounded-lg bg-white/5">
              Mar 1 – Apr 3
            </span>
          </div>
        </div>
        <PerformanceChart
          data={publisherEarningsData}
          lines={[
            { key: "earnings", color: "#4ade80", label: "Earnings ($)" },
            { key: "impressions", color: "#a855f7", label: "Impressions (K)" },
          ]}
        />
      </motion.div>

      {/* Ad Placements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Active Ad Placements
          </h2>
          <Link
            href="/publishers/placements"
            className="text-xs text-[#f7931a] hover:underline"
          >
            Manage placements →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  "Placement",
                  "Format",
                  "Status",
                  "Impressions",
                  "Clicks",
                  "Earnings",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {publisherPlacements.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/1"}`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-xs text-white/40 mt-0.5">
                        {p.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                      {p.format}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        p.status === "Active"
                          ? "bg-[#4ade80]/10 text-[#4ade80]"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${p.status === "Active" ? "bg-[#4ade80]" : "bg-white/40"}`}
                      />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {(p.impressions / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {(p.clicks / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 text-[#4ade80] font-medium">
                    ${p.earnings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Pending Payout
            </h3>
            <DollarCircle size={20} color="#f7931a" variant="Bold" />
          </div>
          <p className="text-2xl font-bold text-white">
            ${publisherMetrics.pendingPayout.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-2">
            Next payout: April 15, 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Active Placements
            </h3>
            <Code1 size={20} color="#a855f7" variant="Bold" />
          </div>
          <p className="text-2xl font-bold text-white">
            {publisherMetrics.activePlacements}
          </p>
          <p className="text-xs text-white/40 mt-2">
            Across {publisherMetrics.totalApps} apps
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">Fill Rate</h3>
            <TrendUp size={20} color="#22d3ee" variant="Bold" />
          </div>
          <p className="text-2xl font-bold text-white">
            {publisherMetrics.fillRate}%
          </p>
          <p className="text-xs text-white/40 mt-2">
            +2.3% from last month
          </p>
        </motion.div>
      </div>
    </div>
  );
}
