"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendUp,
  Eye,
  MouseCircle,
  DollarCircle,
  ChartCircle,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  useAdvertiserDashboard,
  useCampaignAnalytics,
} from "@/hooks/useAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";

const ranges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign");
  const [rangeIdx, setRangeIdx] = useState(1); // Default 30D
  const days = ranges[rangeIdx].days;

  const { dashboard, isLoading: dashboardLoading } = useAdvertiserDashboard();
  const { analytics, isLoading: analyticsLoading } = useCampaignAnalytics(
    campaignId,
    days,
  );
  const { campaigns } = useCampaigns();

  // Transform analytics data for charts
  const chartData = useMemo(() => {
    if (!analytics || analytics.length === 0) return [];

    // Group by date
    const byDate: Record<
      string,
      { date: string; impressions: number; clicks: number; spend: number }
    > = {};

    analytics.forEach((item: any) => {
      const date = item._id.date;
      if (!byDate[date]) {
        byDate[date] = { date, impressions: 0, clicks: 0, spend: 0 };
      }
      if (item._id.type === "impression") {
        byDate[date].impressions = item.count;
      } else if (item._id.type === "click") {
        byDate[date].clicks = item.count;
        byDate[date].spend = item.totalReward || 0;
      }
    });

    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [analytics]);

  const metrics = useMemo(() => {
    if (!dashboard) return [];
    return [
      {
        title: "Total Impressions",
        value: dashboard.impressions.toLocaleString(),
        change: "+8.1%",
        positive: true,
        icon: <Eye size={20} color="#a855f7" variant="Bold" />,
        iconBg: "bg-[#a855f7]/10",
      },
      {
        title: "Total Clicks",
        value: dashboard.clicks.toLocaleString(),
        change: "+5.3%",
        positive: true,
        icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
        iconBg: "bg-[#22d3ee]/10",
      },
      {
        title: "Total Spend",
        value: `${dashboard.totalSpent.toFixed(2)} SOL`,
        change: "+12.4%",
        positive: true,
        icon: <DollarCircle size={20} color="#f7931a" variant="Bold" />,
        iconBg: "bg-[#f7931a]/10",
      },
      {
        title: "Avg. CTR",
        value: `${dashboard.ctr}%`,
        change: "-0.2%",
        positive: false,
        icon: <ChartCircle size={20} color="#4ade80" variant="Bold" />,
        iconBg: "bg-[#4ade80]/10",
      },
    ];
  }, [dashboard]);

  const selectedCampaign = campaignId
    ? campaigns.find((c) => c._id === campaignId)
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <p className="text-sm text-white/40 mt-0.5">
            {selectedCampaign
              ? `Performance for "${selectedCampaign.name}"`
              : "Track your campaign performance over time"}
          </p>
        </div>

        {/* Date range filter */}
        <div className="flex items-center gap-1 glass rounded-xl p-1 border border-white/8">
          <Calendar size={16} color="#f7931a" className="ml-2" />
          {ranges.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setRangeIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                rangeIdx === i
                  ? "bg-[#f7931a]/20 text-[#f7931a]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metric cards */}
      {dashboardLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 border border-white/8 animate-pulse"
            >
              <div className="h-3 bg-white/8 rounded w-1/2 mb-3" />
              <div className="h-6 bg-white/8 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Charts */}
      {analyticsLoading ? (
        <div className="glass rounded-2xl p-6 border border-white/8 animate-pulse">
          <div className="h-4 bg-white/8 rounded w-1/4 mb-4" />
          <div className="h-60 bg-white/5 rounded" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="glass rounded-2xl p-12 border border-white/8 text-center">
          <p className="text-white/40 text-sm">
            {campaignId
              ? "No analytics data available for this campaign yet."
              : "No analytics data available. Create and fund a campaign to start tracking."}
          </p>
        </div>
      ) : (
        <>
          {/* Impressions chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendUp size={18} color="#a855f7" variant="Bold" />
              <h3 className="text-base font-semibold text-white">
                Impressions Over Time
              </h3>
            </div>
            <p className="text-xs text-white/30 mb-6 ml-6">
              {selectedCampaign
                ? `For "${selectedCampaign.name}"`
                : "Daily impressions across all campaigns"}
            </p>
            <PerformanceChart
              data={chartData}
              lines={[
                { key: "impressions", color: "#a855f7", label: "Impressions" },
              ]}
              height={240}
            />
          </motion.div>

          {/* Clicks chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendUp size={18} color="#22d3ee" variant="Bold" />
              <h3 className="text-base font-semibold text-white">
                Clicks Over Time
              </h3>
            </div>
            <p className="text-xs text-white/30 mb-6 ml-6">
              {selectedCampaign
                ? `For "${selectedCampaign.name}"`
                : "Daily clicks across all campaigns"}
            </p>
            <PerformanceChart
              data={chartData}
              lines={[{ key: "clicks", color: "#22d3ee", label: "Clicks" }]}
              height={240}
            />
          </motion.div>

          {/* Spend vs performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.46 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendUp size={18} color="#f7931a" variant="Bold" />
              <h3 className="text-base font-semibold text-white">
                Spend vs Performance
              </h3>
            </div>
            <p className="text-xs text-white/30 mb-6 ml-6">
              Daily spend correlated with clicks
            </p>
            <PerformanceChart
              data={chartData}
              lines={[
                { key: "spend", color: "#f7931a", label: "Spend (SOL)" },
                { key: "clicks", color: "#4ade80", label: "Clicks" },
              ]}
              height={240}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
