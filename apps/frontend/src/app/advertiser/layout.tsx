'use client';
import React from 'react';
import { Sidebar } from '@/components/layouts/AppShell';
import { A_NAV, ACCT_AD } from '@/lib/mock-data';

export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar section="advertiser" items={A_NAV} account={ACCT_AD} />
      <main className="app-main">{children}</main>
    </div>
  );
}
