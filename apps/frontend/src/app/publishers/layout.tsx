"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PublisherSidebar from "@/components/publishers/PublisherSidebar";
import PublisherNav from "@/components/publishers/PublisherNav";
import { useAuth } from "@/hooks/useAuth";

export default function PublishersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
      router.push("/login");
      return;
    }
    if (user?.role !== "publisher") {
      router.push("/dashboard");
    }
  }, [hydrated, isAuthenticated, isLoading, user, router]);

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-screen bg-[#07070f] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "publisher") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#07070f]">
      <PublisherSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PublisherNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
