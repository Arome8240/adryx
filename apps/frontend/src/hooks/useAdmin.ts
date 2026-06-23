"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

// ── Platform stats ────────────────────────────────────────────────────────────

export function useAdminStats() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    advertiserCount: number;
    publisherCount: number;
    adminCount: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalImpressions: number;
    totalSpent: number;
    totalBudget: number;
    recentUsers: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getAdminStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { stats, isLoading, error, refetch };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUsersParams {
  page?:   number;
  limit?:  number;
  role?:   string;
  search?: string;
  status?: string;
}

export function useAdminUsers(params: AdminUsersParams = {}) {
  const [data, setData] = useState<{
    users: any[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getAdminUsers(params);
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  // key captures all param values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);

  async function updateRole(userId: string, role: string) {
    await apiClient.updateUserRole(userId, role);
    await refetch();
  }

  async function updateStatus(userId: string, isActive: boolean) {
    await apiClient.updateUserStatus(userId, isActive);
    await refetch();
  }

  return { data, isLoading, error, refetch, updateRole, updateStatus };
}

// ── Campaigns ─────────────────────────────────────────────────────────────────

export interface AdminCampaignsParams {
  page?:   number;
  limit?:  number;
  status?: string;
  search?: string;
}

export function useAdminCampaigns(params: AdminCampaignsParams = {}) {
  const [data, setData] = useState<{
    campaigns: any[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getAdminCampaigns(params);
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to load campaigns");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);

  async function updateStatus(campaignId: string, status: string) {
    await apiClient.updateCampaignStatus(campaignId, status);
    await refetch();
  }

  return { data, isLoading, error, refetch, updateStatus };
}
