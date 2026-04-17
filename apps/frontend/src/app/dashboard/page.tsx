'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/hooks/useAuth';
import { useAdvertiserDashboard } from '@/hooks/useAnalytics';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function AdvertiserDashboard() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { user } = useAuth();
  const { dashboard, isLoading: dashboardLoading } = useAdvertiserDashboard();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();

  const activeCampaigns = campaigns.filter((c) => c.status === 'active');
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <WalletMultiButton />
      </div>

      {/* Stats Grid */}
      {dashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : dashboard ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Campaigns</p>
            <p className="text-3xl font-bold text-gray-900">{dashboard.totalCampaigns}</p>
            <p className="text-sm text-green-600 mt-2">
              {dashboard.activeCampaigns} active
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboard.totalBudget.toFixed(2)} SOL
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {dashboard.totalSpent.toFixed(2)} spent
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Impressions</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboard.impressions.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {dashboard.clicks.toLocaleString()} clicks
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">CTR</p>
            <p className="text-3xl font-bold text-gray-900">{dashboard.ctr}%</p>
            <p className="text-sm text-gray-600 mt-2">
              Avg CPC: {dashboard.avgCpc} SOL
            </p>
          </div>
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/dashboard/create')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">+</div>
              <p className="font-semibold text-gray-900">Create Campaign</p>
              <p className="text-sm text-gray-600">Start a new ad campaign</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/dashboard/campaigns')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-gray-900">View Campaigns</p>
              <p className="text-sm text-gray-600">Manage your campaigns</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/dashboard/analytics')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="font-semibold text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">View detailed reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Campaigns</h2>
        </div>
        <div className="p-6">
          {campaignsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No campaigns yet</p>
              <button
                onClick={() => router.push('/dashboard/create')}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-500 cursor-pointer"
                  onClick={() => router.push(`/dashboard/campaigns`)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">
                      {campaign.format} • {campaign.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {campaign.budget.toFixed(2)} SOL
                    </p>
                    <p className="text-sm text-gray-600">
                      {campaign.spent.toFixed(2)} spent
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
