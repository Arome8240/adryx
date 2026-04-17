'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useCampaigns, useCampaignStats } from '@/hooks/useCampaigns';
import { Notification } from 'iconsax-react';

export default function CampaignsPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { campaigns, isLoading, fundCampaign, pauseCampaign, resumeCampaign, deleteCampaign } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [fundingAmount, setFundingAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const { stats } = useCampaignStats(selectedCampaign);

  const handleFund = async (campaignId: string) => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(fundingAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsFunding(true);
    try {
      const result = await fundCampaign(campaignId, publicKey.toString(), amount);
      alert(`Campaign funded successfully! Transaction: ${result.signature}`);
      setFundingAmount('');
      setSelectedCampaign(null);
    } catch (error: any) {
      alert(`Failed to fund campaign: ${error.message}`);
    } finally {
      setIsFunding(false);
    }
  };

  const handlePause = async (campaignId: string) => {
    if (confirm('Are you sure you want to pause this campaign?')) {
      try {
        await pauseCampaign(campaignId);
        alert('Campaign paused successfully');
      } catch (error: any) {
        alert(`Failed to pause campaign: ${error.message}`);
      }
    }
  };

  const handleResume = async (campaignId: string) => {
    try {
      await resumeCampaign(campaignId);
      alert('Campaign resumed successfully');
    } catch (error: any) {
      alert(`Failed to resume campaign: ${error.message}`);
    }
  };

  const handleDelete = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        await deleteCampaign(campaignId);
        alert('Campaign deleted successfully');
      } catch (error: any) {
        alert(`Failed to delete campaign: ${error.message}`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your advertising campaigns</p>
        </div>
        <div className="flex gap-4">
          <WalletMultiButton />
          <button
            onClick={() => router.push('/dashboard/create')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="flex justify-center mb-4">
            <Notification size={64} color="#f97316" variant="Bold" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No campaigns yet</h2>
          <p className="text-gray-600 mb-6">Create your first campaign to start advertising</p>
          <button
            onClick={() => router.push('/dashboard/create')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                    <p className="text-gray-600 mt-1">{campaign.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Format</p>
                    <p className="font-semibold text-gray-900">{campaign.format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold text-gray-900">{campaign.budget.toFixed(2)} SOL</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spent</p>
                    <p className="font-semibold text-gray-900">{campaign.spent.toFixed(2)} SOL</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="font-semibold text-gray-900">
                      {(campaign.budget - campaign.spent).toFixed(2)} SOL
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => setSelectedCampaign(campaign._id)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Fund Campaign
                    </button>
                  )}
                  {campaign.status === 'active' && (
                    <button
                      onClick={() => handlePause(campaign._id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Pause
                    </button>
                  )}
                  {campaign.status === 'paused' && (
                    <button
                      onClick={() => handleResume(campaign._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/dashboard/analytics?campaign=${campaign._id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Stats
                  </button>
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Funding Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fund Campaign</h2>
            <p className="text-gray-600 mb-6">
              Enter the amount of SOL you want to fund this campaign with. This will create an escrow on Solana devnet.
            </p>
            
            {!publicKey && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Please connect your wallet first</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedCampaign(null);
                  setFundingAmount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isFunding}
              >
                Cancel
              </button>
              <button
                onClick={() => handleFund(selectedCampaign)}
                disabled={isFunding || !publicKey}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFunding ? 'Funding...' : 'Fund Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
