"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role === "publisher") {
      router.push("/publishers");
    }
  }, [hydrated, isAuthenticated, isLoading, user, router]);

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-screen bg-[#07070f] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role === "publisher") {
    return null;
  }

  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-[#07070f]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardNav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </WalletProvider>
  );
}
