'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

export interface AuthUser {
  _id: string;
  email?: string;
  name: string;
  role: 'advertiser' | 'publisher';
  walletAddress?: string;
  avatar?: string;
  googleId?: string;
  githubId?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;
  walletLogin: (walletAddress: string, signature: string, message: string) => Promise<AuthUser>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: 'advertiser' | 'publisher';
    walletAddress?: string;
  }) => Promise<AuthUser>;
  setFromOAuth: (accessToken: string, refreshToken?: string) => Promise<AuthUser>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.login(email, password);
          apiClient.setToken(res.accessToken);
          set({
            user: res.user,
            token: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return res.user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      walletLogin: async (walletAddress, signature, message) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.walletLogin(walletAddress, signature, message);
          apiClient.setToken(res.accessToken);
          set({
            user: res.user,
            token: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return res.user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.register(data);
          apiClient.setToken(res.accessToken);
          set({
            user: res.user,
            token: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return res.user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // Called from /auth/callback after OAuth redirect
      setFromOAuth: async (accessToken, refreshToken) => {
        apiClient.setToken(accessToken);
        try {
          const user = await apiClient.getProfile();
          set({
            user,
            token: accessToken,
            refreshToken: refreshToken ?? null,
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch {
          apiClient.clearToken();
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
          throw new Error('Failed to load user after OAuth sign-in');
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      loadUser: async () => {
        const token = get().token;
        if (!token) return;
        apiClient.setToken(token);
        set({ isLoading: true });
        try {
          const user = await apiClient.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          apiClient.clearToken();
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
