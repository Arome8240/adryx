"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export function useAdvertiserDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getAdvertiserDashboard();
      setDashboard(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboard, isLoading, error, refetch: fetchDashboard };
}

export function useAdvertiserActivity(limit = 8) {
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getAdvertiserActivity(limit)
      .then(setActivity)
      .catch(() => setActivity([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { activity, isLoading };
}

export function useTopCampaigns(limit = 5) {
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getAdvertiserTopCampaigns(limit)
      .then(setTopCampaigns)
      .catch(() => setTopCampaigns([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { topCampaigns, isLoading };
}

export function useCampaignAnalytics(
  campaignId: string | null,
  days: number = 30,
) {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) {
      setAnalytics([]);
      setIsLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getCampaignAnalytics(campaignId, days);
        setAnalytics(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [campaignId, days]);

  return { analytics, isLoading, error };
}
