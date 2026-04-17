'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PublisherSidebar from "@/components/publishers/PublisherSidebar";
import PublisherNav from "@/components/publishers/PublisherNav";
import { useAuth } from "@/hooks/useAuth";

export default function PublishersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#07070f] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
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
