"use client";
import { motion } from "framer-motion";
import { AddCircle, Code1, Eye, MouseCircle, TrendUp, DollarCircle } from "iconsax-react";
import { publisherPlacements } from "@/lib/publisher-mock-data";

export default function PlacementsPage() {
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
          <h1 className="text-2xl font-bold text-white">Ad Placements</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage your ad units and placements
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-medium rounded-xl transition-colors">
          <AddCircle size={18} color="#ffffff" variant="Bold" />
          New Placement
        </button>
      </motion.div>

      {/* Placements Grid */}
      <div className="grid grid-cols-1 gap-4">
        {publisherPlacements.map((placement, i) => (
          <motion.div
            key={placement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass rounded-2xl p-6 border border-white/8 hover:border-white/12 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {placement.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      placement.status === "Active"
                        ? "bg-[#4ade80]/10 text-[#4ade80]"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${placement.status === "Active" ? "bg-[#4ade80]" : "bg-white/40"}`}
                    />
                    {placement.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Code1 size={14} color="#a855f7" />
                    {placement.location}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 text-xs">
                    {placement.format}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/60 hover:bg-white/8 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/60 hover:bg-white/8 transition-colors">
                  {placement.status === "Active" ? "Pause" : "Activate"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={16} color="#a855f7" variant="Bold" />
                  <p className="text-xs text-white/40">Impressions</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {(placement.impressions / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MouseCircle size={16} color="#22d3ee" variant="Bold" />
                  <p className="text-xs text-white/40">Clicks</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {(placement.clicks / 1000).toFixed(1)}K
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendUp size={16} color="#f7931a" variant="Bold" />
                  <p className="text-xs text-white/40">CTR</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {((placement.clicks / placement.impressions) * 100).toFixed(
                    2,
                  )}
                  %
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarCircle size={16} color="#4ade80" variant="Bold" />
                  <p className="text-xs text-white/40">Earnings</p>
                </div>
                <p className="text-lg font-semibold text-[#4ade80]">
                  ${placement.earnings.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fill Rate */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">Fill Rate</span>
                <span className="text-xs font-medium text-white">
                  {placement.fillRate}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#4ade80] to-[#22d3ee] rounded-full"
                  style={{ width: `${placement.fillRate}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
