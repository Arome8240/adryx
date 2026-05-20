'use client';
import React from 'react';
import { Sidebar } from '@/components/layouts/AppShell';
import { P_NAV, ACCT_PUB } from '@/lib/mock-data';

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar section="publisher" items={P_NAV} account={ACCT_PUB} />
      <main className="app-main">{children}</main>
    </div>
  );
}
