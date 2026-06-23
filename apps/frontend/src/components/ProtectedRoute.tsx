'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { URLS, navigateTo } from '@/lib/urls';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
  requiredRole?: 'advertiser' | 'publisher';
}

export function ProtectedRoute({
  children,
  requireWallet = false,
  requiredRole
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigateTo(URLS.login);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      navigateTo(user?.role === 'publisher' ? URLS.publishers : URLS.dashboard);
    }
  }, [isAuthenticated, isLoading, user, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
