"use client";
import { motion } from "framer-motion";
import { DollarCircle, Calendar, TrendUp, ArrowDown2 } from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import {
  publisherEarningsData,
  publisherPayouts,
  publisherMetrics,
} from "@/lib/publisher-mock-data";

export default function EarningsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-sm text-white/40 mt-1">
          Track your revenue and payout history
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Total Earnings (30d)
            </h3>
            <DollarCircle size={20} color="#4ade80" variant="Bold" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${publisherMetrics.totalEarnings.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendUp size={14} color="#4ade80" variant="Bold" />
            <span className="text-xs text-[#4ade80] font-medium">+18.2%</span>
            <span className="text-xs text-white/40">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">
              Pending Payout
            </h3>
            <Calendar size={20} color="#f7931a" variant="Bold" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${publisherMetrics.pendingPayout.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-2">
            Next payout: <span className="text-white">April 15, 2026</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">Avg. eCPM</h3>
            <TrendUp size={20} color="#22d3ee" variant="Bold" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${publisherMetrics.ecpm.toFixed(2)}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendUp size={14} color="#4ade80" variant="Bold" />
            <span className="text-xs text-[#4ade80] font-medium">+5.1%</span>
            <span className="text-xs text-white/40">vs last month</span>
          </div>
        </motion.div>
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Earnings Trend
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Last 30 days</p>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
        <PerformanceChart
          data={publisherEarningsData}
          lines={[{ key: "earnings", color: "#4ade80", label: "Earnings ($)" }]}
        />
      </motion.div>

      {/* Payout History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Payout History
          </h2>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/60 hover:bg-white/8 transition-colors">
            <ArrowDown2 size={14} color="#22d3ee" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Date", "Amount", "Status", "Transaction Hash"].map((h) => (
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
              {publisherPayouts.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/1"}`}
                >
                  <td className="px-6 py-4 text-white/60">{p.date}</td>
                  <td className="px-6 py-4 font-medium text-white">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        p.status === "Completed"
                          ? "bg-[#4ade80]/10 text-[#4ade80]"
                          : p.status === "Processing"
                            ? "bg-[#f7931a]/10 text-[#f7931a]"
                            : "bg-white/5 text-white/40"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "Completed"
                            ? "bg-[#4ade80]"
                            : p.status === "Processing"
                              ? "bg-[#f7931a]"
                              : "bg-white/40"
                        }`}
                      />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.txHash !== "—" ? (
                      <a
                        href={`https://solscan.io/tx/${p.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#22d3ee] hover:underline font-mono text-xs"
                      >
                        {p.txHash}
                      </a>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
