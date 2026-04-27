const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: {
    email: string;
    password: string;
    name: string;
    role: "advertiser" | "publisher";
    walletAddress?: string;
  }) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async walletLogin(walletAddress: string, signature: string, message: string) {
    return this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>("/auth/wallet-login", {
      method: "POST",
      body: JSON.stringify({ walletAddress, signature, message }),
    });
  }

  async getProfile() {
    return this.request<any>("/auth/me");
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    timezone?: string;
  }) {
    return this.request<any>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>("/auth/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async duplicateCampaign(id: string) {
    return this.request<any>(`/campaigns/${id}/duplicate`, { method: "POST" });
  }

  async getAdvertiserActivity(limit = 10) {
    return this.request<any[]>(`/analytics/advertiser/activity?limit=${limit}`);
  }

  async getAdvertiserTopCampaigns(limit = 10) {
    return this.request<any[]>(
      `/analytics/advertiser/top-campaigns?limit=${limit}`,
    );
  }

  async getHourlyHeatmap(days = 30) {
    return this.request<{ hour: number; clicks: number }[]>(
      `/analytics/advertiser/heatmap?days=${days}`,
    );
  }

  // Publisher — Sites
  async getSites() {
    return this.request<any[]>("/sites");
  }

  async createSite(data: {
    name: string;
    url: string;
    type: "website" | "app";
    category?: string;
  }) {
    return this.request<any>("/sites", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSite(id: string, data: any) {
    return this.request<any>(`/sites/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteSite(id: string) {
    return this.request<void>(`/sites/${id}`, { method: "DELETE" });
  }

  async verifySite(id: string) {
    return this.request<any>(`/sites/${id}/verify`, { method: "POST" });
  }

  // Publisher — Placements
  async getPlacements(siteId?: string) {
    const q = siteId ? `?siteId=${siteId}` : "";
    return this.request<any[]>(`/placements${q}`);
  }

  async createPlacement(data: {
    name: string;
    siteId: string;
    format: string;
    description?: string;
  }) {
    return this.request<any>("/placements", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePlacement(id: string, data: any) {
    return this.request<any>(`/placements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePlacement(id: string) {
    return this.request<void>(`/placements/${id}`, { method: "DELETE" });
  }

  async getPlacementCode(id: string) {
    return this.request<{ code: string }>(`/placements/${id}/code`);
  }

  async getPlacementStats(id: string) {
    return this.request<any>(`/placements/${id}/stats`);
  }

  // Publisher — Analytics
  async getPublisherDashboard() {
    return this.request<{
      totalSites: number;
      totalPlacements: number;
      impressions: number;
      clicks: number;
      ctr: string;
      totalEarnings: string;
    }>("/analytics/publisher/dashboard");
  }

  async getPublisherActivity(limit = 8) {
    return this.request<any[]>(`/analytics/publisher/activity?limit=${limit}`);
  }

  async getPublisherTopPlacements(limit = 10) {
    return this.request<any[]>(
      `/analytics/publisher/top-placements?limit=${limit}`,
    );
  }

  async getPublisherEarningsChart(days = 30) {
    return this.request<{ date: string; earnings: number; clicks: number }[]>(
      `/analytics/publisher/earnings-chart?days=${days}`,
    );
  }

  async getPublisherHeatmap(days = 30) {
    return this.request<{ hour: number; clicks: number }[]>(
      `/analytics/publisher/heatmap?days=${days}`,
    );
  }

  async claimEarnings(
    publisherWallet: string,
    token: "USDC" | "USDT" = "USDC",
    txSignature?: string,
  ) {
    return this.request<{ signature: string; token: string }>(
      "/solana/claim-earnings",
      {
        method: "POST",
        body: JSON.stringify({ publisherWallet, token, txSignature }),
      },
    );
  }

  // Campaigns
  async getCampaigns() {
    return this.request<any[]>("/campaigns");
  }

  async getCampaign(id: string) {
    return this.request<any>(`/campaigns/${id}`);
  }

  async createCampaign(data: {
    name: string;
    description?: string;
    format: string;
    budget: number;
    startDate: string;
    endDate: string;
    targetUrl: string;
    creativeUrl?: string;
  }) {
    return this.request<any>("/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: any) {
    return this.request<any>(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string) {
    return this.request<void>(`/campaigns/${id}`, {
      method: "DELETE",
    });
  }

  async fundCampaign(
    id: string,
    advertiserWallet: string,
    amountUsdc: number,
    txSignature?: string,
  ) {
    return this.request<{
      campaignId: string;
      signature: string;
      escrowPda: string;
      status: string;
    }>(`/campaigns/${id}/fund`, {
      method: "POST",
      body: JSON.stringify({ advertiserWallet, amountUsdc, txSignature }),
    });
  }

  async pauseCampaign(id: string) {
    return this.request<any>(`/campaigns/${id}/pause`, {
      method: "POST",
    });
  }

  async resumeCampaign(id: string) {
    return this.request<any>(`/campaigns/${id}/resume`, {
      method: "POST",
    });
  }

  async getCampaignBalance(id: string) {
    return this.request<{
      campaignId: string;
      budgetTotal: number;
      spent: number;
      remaining: number;
      onChainBalance: number;
    }>(`/campaigns/${id}/balance`);
  }

  async getCampaignStats(id: string) {
    return this.request<{
      campaignId: string;
      name: string;
      status: string;
      budget: number;
      spent: number;
      remaining: number;
      impressions: number;
      clicks: number;
      ctr: string;
      avgCpc: string;
    }>(`/campaigns/${id}/stats`);
  }

  // Analytics
  async getAdvertiserDashboard() {
    return this.request<{
      totalCampaigns: number;
      activeCampaigns: number;
      totalBudget: number;
      totalSpent: number;
      remaining: number;
      impressions: number;
      clicks: number;
      ctr: string;
      avgCpc: string;
    }>("/analytics/advertiser/dashboard");
  }

  async getCampaignAnalytics(id: string, days: number = 30) {
    return this.request<any[]>(`/analytics/campaign/${id}?days=${days}`);
  }

  async getTopCampaigns(limit: number = 10) {
    return this.request<any[]>(`/analytics/top-campaigns?limit=${limit}`);
  }

  // Solana
  async getSolanaInfo() {
    return this.request<{
      wallet: string;
      programId: string;
      platformPda: string;
      treasuryPda: string;
    }>("/solana/info");
  }

  // Tracking — called by ad SDK (no auth required)
  async recordImpression(campaignId: string, placementId: string) {
    return this.request<{ interactionId: string; type: string }>(
      "/interactions/impression",
      {
        method: "POST",
        body: JSON.stringify({ campaignId, placementId }),
      },
    );
  }

  async recordClick(
    campaignId: string,
    placementId: string,
    publisherWallet: string,
  ) {
    return this.request<{
      interactionId: string;
      type: string;
      txHash?: string;
      paid: boolean;
    }>("/interactions/click", {
      method: "POST",
      body: JSON.stringify({ campaignId, placementId, publisherWallet }),
    });
  }

  // Publisher earnings breakdown
  async getPublisherEarningsBreakdown() {
    return this.request<{
      totalEarnings: number;
      totalClicks: number;
      pendingEarnings: number;
      claimedEarnings: number;
    }>("/interactions/earnings/publisher");
  }

  async getPlacementEarnings(placementId: string) {
    return this.request<{
      placementId: string;
      earnings: number;
      clicks: number;
    }>(`/interactions/earnings/placement/${placementId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
