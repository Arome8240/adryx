'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icons, Tabs } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';
import { CAMPAIGNS } from '@/lib/mock-data';
import { CampaignTable } from '../page';

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'In review', value: 'review' },
  { label: 'Ended', value: 'ended' },
];

export default function CampaignsPage() {
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter(c => {
      const matchTab = tab === 'all' || c.status === tab;
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
      return matchTab && matchSearch;
    });
  }, [tab, search]);

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Campaigns']}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icons.download size={14} /> Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/advertiser/campaigns/new')}>
              <Icons.plus size={14} /> New campaign
            </Button>
          </>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Campaigns</h1>
            <p className="muted" style={{ fontSize: 14 }}>
              {CAMPAIGNS.filter(c => c.status === 'active').length} active · {CAMPAIGNS.length} total
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Tabs
            tabs={FILTER_TABS.map(t => ({ label: t.label, value: t.value }))}
            value={tab}
            onChange={setTab}
          />
          <div className="input-group" style={{ width: 240 }}>
            <span className="addon">
              <Icons.search size={14} />
            </span>
            <input
              className="input"
              placeholder="Search campaigns…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 13.5 }}
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <CampaignTable rows={filtered} />
        ) : (
          <div className="empty">
            <Icons.campaign size={28} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--c-fg-4)' }} />
            <div style={{ fontWeight: 530, marginBottom: 6 }}>No campaigns found</div>
            <div className="muted" style={{ fontSize: 13.5 }}>
              {search ? `No campaigns match "${search}"` : 'No campaigns in this status'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
