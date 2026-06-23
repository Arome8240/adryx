"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { useAuth } from "@/hooks/useAuth";
import { URLS, navigateTo } from "@/lib/urls";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, setFromOAuth } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function init() {
      if (typeof window === "undefined") { setHydrated(true); return; }
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("_t");
      if (urlToken) {
        try {
          await setFromOAuth(urlToken, params.get("_r") ?? undefined);
        } catch {}
        const clean = new URL(window.location.href);
        clean.searchParams.delete("_t");
        clean.searchParams.delete("_r");
        window.history.replaceState({}, "", clean.toString());
      }
      setHydrated(true);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated || isLoading) return;
    if (!isAuthenticated) {
      navigateTo(URLS.login);
      return;
    }
    if (user?.role === "publisher") {
      navigateTo(URLS.publishers);
    }
  }, [hydrated, isAuthenticated, isLoading, user]);

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-screen bg-[#08080a] items-center justify-center flex-col gap-4">
        <div style={{width:32,height:32,borderRadius:'50%',border:'2.5px solid rgba(235,255,69,.15)',borderTopColor:'#EBFF45',animation:'spin 0.7s linear infinite'}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated || user?.role === "publisher") {
    return null;
  }

  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-[#08080a]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardNav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </WalletProvider>
  );
}
