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
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter(c => {
      const matchTab = tab === 'all' || c.status === tab;
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
      return matchTab && matchSearch;
    });
  }, [tab, search]);

  function handleToggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  if (CAMPAIGNS.length === 0) {
    return (
      <>
        <Topbar
          crumb={['Forecast Labs', 'Campaigns']}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Icons.download size={14} /> Export
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/advertiser/campaigns/new')}
              >
                <Icons.plus size={14} /> New campaign
              </Button>
            </>
          }
        />
        <div className="app-body page-enter">
          <div className="empty" style={{ padding: '48px 24px' }}>
            <Icons.campaign
              size={40}
              style={{ color: 'var(--c-fg-4)', margin: '0 auto 16px', display: 'block' }}
            />
            <div style={{ fontWeight: 540, fontSize: 16, marginBottom: 6 }}>No campaigns yet</div>
            <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
              Create your first campaign to start serving ads
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/advertiser/campaigns/new')}
            >
              <Icons.plus size={14} /> New campaign
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Campaigns']}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icons.download size={14} /> Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/advertiser/campaigns/new')}
            >
              <Icons.plus size={14} /> New campaign
            </Button>
          </>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Campaigns</h1>
            <p className="muted" style={{ fontSize: 14 }}>
              {CAMPAIGNS.filter(c => c.status === 'active').length} active · {CAMPAIGNS.length} total
            </p>
          </div>
        </div>

        {/* Status summary strip */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['all', 'active', 'paused', 'review', 'ended'] as const).map(s => {
            const count =
              s === 'all'
                ? CAMPAIGNS.length
                : CAMPAIGNS.filter(c => c.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setTab(s)}
                style={{
                  padding: '3px 12px',
                  borderRadius: 999,
                  border: '1px solid',
                  borderColor: tab === s ? 'var(--c-acc)' : 'var(--c-line)',
                  background: tab === s ? 'var(--c-acc-soft)' : 'transparent',
                  color: tab === s ? 'var(--c-acc-ink)' : 'var(--c-fg-3)',
                  fontSize: 12.5,
                  fontWeight: 520,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background:
                      s === 'active'
                        ? 'var(--c-ok)'
                        : s === 'paused'
                        ? 'var(--c-warn)'
                        : 'var(--c-fg-4)',
                  }}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)} {count}
              </button>
            );
          })}
        </div>

        {/* Tabs with counts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Tabs
            tabs={FILTER_TABS.map(t => ({
              label: t.label,
              value: t.value,
              count:
                t.value === 'all'
                  ? CAMPAIGNS.length
                  : CAMPAIGNS.filter(c => c.status === t.value).length,
            }))}
            value={tab}
            onChange={setTab}
          />
        </div>

        {/* Toolbar row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Left: search */}
          <div className="input-group" style={{ width: 240 }}>
            <span className="addon">
              <Icons.search size={14} />
            </span>
            <input
              className="input"
              placeholder="Search campaigns…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              style={{ fontSize: 13.5 }}
            />
          </div>

          {/* Right: sort + export + new */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant="ghost" size="sm">
              <Icons.filter size={14} /> Sort
            </Button>
            <Button variant="outline" size="sm">
              <Icons.download size={14} /> Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/advertiser/campaigns/new')}
            >
              <Icons.plus size={14} /> New campaign
            </Button>
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <CampaignTable
            rows={filtered}
            selected={selected}
            onToggle={handleToggle}
          />
        ) : (
          <div className="empty">
            <Icons.campaign
              size={28}
              style={{ margin: '0 auto 12px', display: 'block', color: 'var(--c-fg-4)' }}
            />
            <div style={{ fontWeight: 530, marginBottom: 6 }}>No campaigns found</div>
            <div className="muted" style={{ fontSize: 13.5 }}>
              {search ? `No campaigns match "${search}"` : 'No campaigns in this status'}
            </div>
          </div>
        )}
      </div>

      {/* Bulk selection bar */}
      {selected.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--c-fg)',
            color: '#fff',
            borderRadius: 10,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: 'var(--sh-pop)',
            zIndex: 100,
            fontSize: 13.5,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ opacity: 0.7 }}>{selected.length} selected</span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.2)' }} />
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: '#fff' }}
            onClick={() => {}}
          >
            Pause
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: '#fff' }}
            onClick={() => {}}
          >
            Archive
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'rgba(185,28,28,.8)' }}
            onClick={() => setSelected([])}
          >
            ✕ Clear
          </button>
        </div>
      )}
    </>
  );
}
