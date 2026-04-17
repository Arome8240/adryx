'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

interface User {
  _id: string;
  email?: string;
  name: string;
  role: 'advertiser' | 'publisher';
  walletAddress?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  walletLogin: (walletAddress: string, signature: string, message: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: 'advertiser' | 'publisher';
    walletAddress?: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.login(email, password);
          apiClient.setToken(response.accessToken);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      walletLogin: async (walletAddress: string, signature: string, message: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.walletLogin(walletAddress, signature, message);
          apiClient.setToken(response.accessToken);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.register(data);
          apiClient.setToken(response.accessToken);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      loadUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await apiClient.getProfile();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          apiClient.clearToken();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
