"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNav from "@/components/admin/AdminNav";
import { useAuth } from "@/hooks/useAuth";
import { URLS, navigateTo } from "@/lib/urls";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, setFromOAuth } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  // All hooks must run unconditionally — effects guard themselves internally.
  useEffect(() => {
    if (isLoginPage) return;
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
  }, [isLoginPage]);

  useEffect(() => {
    if (isLoginPage || !hydrated || isLoading) return;
    if (!isAuthenticated) {
      navigateTo(URLS.adminLogin);
      return;
    }
    if (user?.role !== "admin") {
      navigateTo(user?.role === "publisher" ? URLS.publishers : URLS.dashboard);
    }
  }, [isLoginPage, hydrated, isAuthenticated, isLoading, user]);

  // Login page: render without auth guard or layout chrome.
  if (isLoginPage) return <>{children}</>;

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-screen bg-[#08080a] items-center justify-center flex-col gap-4">
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2.5px solid rgba(168,85,247,.15)", borderTopColor: "#a855f7", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#08080a]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
