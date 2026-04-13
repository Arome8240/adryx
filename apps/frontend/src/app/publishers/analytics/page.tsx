"use client";
import { motion } from "framer-motion";
import { Eye, MouseCircle, DollarCircle, TrendUp } from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { publisherEarningsData, publisherPlacements } from "@/lib/publisher-mock-data";

export default function AnalyticsPage() {
  const topPerformers = [...publisherPlacements]
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 3);

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
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-1">
            Deep dive into your performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#4ade80]/15 text-[#4ade80]">
            30 Days
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/40 hover:bg-white/8 transition-colors">
            90 Days
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/40 hover:bg-white/8 transition-colors">
            1 Year
          </button>
        </div>
      </motion.div>

      {/* Multi-metric Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">
            Performance Overview
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            Earnings and impressions over time
          </p>
        </div>
        <PerformanceChart
          data={publisherEarningsData}
          lines={[
            { key: "earnings", color: "#4ade80", label: "Earnings ($)" },
            { key: "impressions", color: "#a855f7", label: "Impressions (K)" },
          ]}
        />
      </motion.div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Top Performing Placements
        </h2>
        <div className="space-y-4">
          {topPerformers.map((placement, i) => (
            <div
              key={placement.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4ade80]/10 text-[#4ade80] font-bold text-sm">
                  #{i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {placement.name}
                  </h3>
                  <p className="text-xs text-white/40">{placement.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-white/40">Impressions</p>
                  <p className="text-sm font-medium text-white">
                    {(placement.impressions / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">CTR</p>
                  <p className="text-sm font-medium text-white">
                    {((placement.clicks / placement.impressions) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Earnings</p>
                  <p className="text-sm font-medium text-[#4ade80]">
                    ${placement.earnings.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Avg. Impressions/Day
            </h3>
            <Eye size={20} color="#a855f7" variant="Bold" />
          </div>
          <p className="text-2xl font-bold text-white">44.3K</p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendUp size={14} color="#4ade80" variant="Bold" />
            <span className="text-xs text-[#4ade80] font-medium">+12.4%</span>
            <span className="text-xs text-white/40">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Avg. Clicks/Day
            </h3>
            <MouseCircle size={20} color="#22d3ee" variant="Bold" />
          </div>
          <p className="text-2xl font-bold text-white">1.6K</p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendUp size={14} color="#4ade80" variant="Bold" />
            <span className="text-xs text-[#4ade80] font-medium">+9.8%</span>
            <span className="text-xs text-white/40">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Avg. Earnings/Day
            </h3>
            <DollarCircle size={20} color="#4ade80" variant="Bold" />
          </div>
          <p className="text-2xl font-bold text-white">$262</p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendUp size={14} color="#4ade80" variant="Bold" />
            <span className="text-xs text-[#4ade80] font-medium">+18.2%</span>
            <span className="text-xs text-white/40">vs last period</span>
          </div>
        </motion.div>
      </div>

      {/* Format Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Performance by Format
        </h2>
        <div className="space-y-3">
          {[
            { format: "Banner", impressions: 730000, earnings: 3580, color: "#f7931a" },
            { format: "Native", impressions: 320000, earnings: 1890, color: "#a855f7" },
            { format: "Video", impressions: 195000, earnings: 1620, color: "#22d3ee" },
            { format: "Interstitial", impressions: 85000, earnings: 780, color: "#4ade80" },
          ].map((item) => (
            <div
              key={item.format}
              className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-white">
                  {item.format}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-white/40">Impressions</p>
                  <p className="text-sm font-medium text-white">
                    {(item.impressions / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Earnings</p>
                  <p className="text-sm font-medium text-[#4ade80]">
                    ${item.earnings.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">eCPM</p>
                  <p className="text-sm font-medium text-white">
                    ${((item.earnings / item.impressions) * 1000).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
