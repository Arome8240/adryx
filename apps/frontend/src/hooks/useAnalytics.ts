'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

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

export function useCampaignAnalytics(campaignId: string | null, days: number = 30) {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

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
