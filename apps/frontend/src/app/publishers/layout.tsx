"use client";

import { useEffect, useState } from "react";
import PublisherSidebar from "@/components/publishers/PublisherSidebar";
import PublisherNav from "@/components/publishers/PublisherNav";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { useAuth } from "@/hooks/useAuth";
import { URLS, navigateTo } from "@/lib/urls";

export default function PublishersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  // Zustand persist rehydrates from localStorage asynchronously.
  // On the first render user is null even for logged-in publishers,
  // so we must wait for hydration before checking the role.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isLoading) return;
    if (!isAuthenticated) {
      navigateTo(URLS.login);
      return;
    }
    if (user?.role !== "publisher") {
      navigateTo(URLS.dashboard);
    }
  }, [hydrated, isAuthenticated, isLoading, user]);

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-screen bg-[#08080a] items-center justify-center">
        <div style={{width:32,height:32,borderRadius:'50%',border:'2.5px solid rgba(235,255,69,.15)',borderTopColor:'#EBFF45',animation:'spin 0.7s linear infinite'}} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "publisher") {
    return null;
  }

  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-[#08080a]">
        <PublisherSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <PublisherNav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </WalletProvider>
  );
}
