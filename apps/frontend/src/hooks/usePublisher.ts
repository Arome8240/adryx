"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

// P08 — Sites
export function useSites() {
  const [sites, setSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getSites();
      setSites(data);
    } catch {
      setSites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const createSite = async (data: {
    name: string;
    url: string;
    type: "website" | "app";
    category?: string;
  }) => {
    const site = await apiClient.createSite(data);
    await fetchSites();
    return site;
  };

  const updateSite = async (id: string, data: any) => {
    const site = await apiClient.updateSite(id, data);
    await fetchSites();
    return site;
  };

  const deleteSite = async (id: string) => {
    await apiClient.deleteSite(id);
    await fetchSites();
  };

  const verifySite = async (id: string) => {
    const result = await apiClient.verifySite(id);
    await fetchSites();
    return result;
  };

  return {
    sites,
    isLoading,
    refetch: fetchSites,
    createSite,
    updateSite,
    deleteSite,
    verifySite,
  };
}

// P09 — Placements
export function usePlacements(siteId?: string) {
  const [placements, setPlacements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlacements = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getPlacements(siteId);
      setPlacements(data);
    } catch {
      setPlacements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [siteId]);

  const createPlacement = async (data: {
    name: string;
    siteId: string;
    format: string;
    description?: string;
  }) => {
    const p = await apiClient.createPlacement(data);
    await fetchPlacements();
    return p;
  };

  const updatePlacement = async (id: string, data: any) => {
    const p = await apiClient.updatePlacement(id, data);
    await fetchPlacements();
    return p;
  };

  const deletePlacement = async (id: string) => {
    await apiClient.deletePlacement(id);
    await fetchPlacements();
  };

  const getEmbedCode = async (id: string) => {
    return apiClient.getPlacementCode(id);
  };

  return {
    placements,
    isLoading,
    refetch: fetchPlacements,
    createPlacement,
    updatePlacement,
    deletePlacement,
    getEmbedCode,
  };
}

// P10 — Publisher dashboard
export function usePublisherDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPublisherDashboard()
      .then(setDashboard)
      .catch(() => setDashboard(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { dashboard, isLoading };
}

// P11 — Publisher earnings
export function usePublisherEarnings(days = 30) {
  const [earningsChart, setEarningsChart] = useState<
    { date: string; earnings: number; clicks: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPublisherEarningsChart(days)
      .then(setEarningsChart)
      .catch(() => setEarningsChart([]))
      .finally(() => setIsLoading(false));
  }, [days]);

  return { earningsChart, isLoading };
}

// P12 — Publisher activity
export function usePublisherActivity(limit = 8) {
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPublisherActivity(limit)
      .then(setActivity)
      .catch(() => setActivity([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { activity, isLoading };
}

// P13 — Publisher top placements
export function usePublisherTopPlacements(limit = 10) {
  const [topPlacements, setTopPlacements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPublisherTopPlacements(limit)
      .then(setTopPlacements)
      .catch(() => setTopPlacements([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { topPlacements, isLoading };
}

// Publisher heatmap
export function usePublisherHeatmap(days = 30) {
  const [heatmap, setHeatmap] = useState<{ hour: number; clicks: number }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPublisherHeatmap(days)
      .then(setHeatmap)
      .catch(() => setHeatmap([]))
      .finally(() => setIsLoading(false));
  }, [days]);

  return { heatmap, isLoading };
}

// Real-time earnings breakdown (pending vs claimed)
export function usePublisherEarningsBreakdown() {
  const [earnings, setEarnings] = useState<{
    totalEarnings: number;
    totalClicks: number;
    pendingEarnings: number;
    claimedEarnings: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPublisherEarningsBreakdown()
      .then(setEarnings)
      .catch(() => setEarnings(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { earnings, isLoading };
}
