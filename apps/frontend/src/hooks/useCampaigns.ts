"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getCampaigns();
      setCampaigns(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const createCampaign = async (data: any) => {
    const campaign = await apiClient.createCampaign(data);
    await fetchCampaigns();
    return campaign;
  };

  const updateCampaign = async (id: string, data: any) => {
    const campaign = await apiClient.updateCampaign(id, data);
    await fetchCampaigns();
    return campaign;
  };

  const deleteCampaign = async (id: string) => {
    await apiClient.deleteCampaign(id);
    await fetchCampaigns();
  };

  const fundCampaign = async (
    id: string,
    walletAddress: string,
    amount: number,
    txSignature?: string,
  ) => {
    const result = await apiClient.fundCampaign(
      id,
      walletAddress,
      amount,
      txSignature,
    );
    await fetchCampaigns();
    return result;
  };

  const pauseCampaign = async (id: string) => {
    await apiClient.pauseCampaign(id);
    await fetchCampaigns();
  };

  const resumeCampaign = async (id: string) => {
    await apiClient.resumeCampaign(id);
    await fetchCampaigns();
  };

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fundCampaign,
    pauseCampaign,
    resumeCampaign,
  };
}

export function useCampaignStats(campaignId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getCampaignStats(campaignId);
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [campaignId]);

  return { stats, isLoading, error };
}
