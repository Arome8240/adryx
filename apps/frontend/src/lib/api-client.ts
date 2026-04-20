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
}

export const apiClient = new ApiClient(API_BASE_URL);
