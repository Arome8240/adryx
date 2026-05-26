'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Badge, Card, Seg, Sparkline, Avatar, Icons } from '@/components/ui';
import { AreaChart, GeoMap, Funnel } from '@/components/charts';
import { Topbar } from '@/components/layouts/AppShell';
import { CAMPAIGNS, fmtNum, fmtMoney } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// CampaignTable — shared helper used here and in campaigns page
// ---------------------------------------------------------------------------

const STATUS_TONE: Record<string, string> = {
  active: 'ok',
  paused: 'warn',
  review: 'neutral',
  ended: 'neutral',
};

interface CampaignTableProps {
  rows: typeof CAMPAIGNS;
  selected?: string[];
  onToggle?: (id: string) => void;
}

export function CampaignTable({ rows, selected, onToggle }: CampaignTableProps) {
  const router = useRouter();
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Campaign</th>
            <th>Status</th>
            <th>Spent / Budget</th>
            <th>Pacing</th>
            <th>Impressions</th>
            <th>CTR</th>
            <th>eCPM</th>
            <th>Trend</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(c => {
            const pct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
            const pacingColor =
              pct >= 85
                ? 'var(--c-bad)'
                : pct < 5
                ? 'var(--c-warn)'
                : 'var(--c-ok)';
            const isChecked = selected?.includes(c.id) ?? false;
            return (
              <tr
                key={c.id}
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/advertiser/campaigns/${c.id}`)}
              >
                <td onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(_e: React.ChangeEvent<HTMLInputElement>) => onToggle?.(c.id)}
                  />
                </td>
                <td>
                  <div style={{ fontWeight: 530 }}>{c.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--c-fg-4)',
                      display: 'flex',
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    <span className="t-mono">{c.id}</span>
                    {c.geos.map(g => (
                      <span
                        key={g}
                        style={{
                          padding: '0 5px',
                          borderRadius: 4,
                          background: 'var(--c-bg-3)',
                          fontSize: 11,
                          color: 'var(--c-fg-3)',
                        }}
                      >
                        {g}
                      </span>
                    ))}
                    <span style={{ marginLeft: 4, color: 'var(--c-fg-5)' }}>{c.updated}</span>
                  </div>
                </td>
                <td>
                  <Badge tone={STATUS_TONE[c.status] as any} dot>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </Badge>
                </td>
                <td>
                  <div style={{ fontSize: 13.5 }}>
                    {fmtMoney(c.spent)}{' '}
                    <span className="muted">/ {fmtMoney(c.budget)}</span>
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      height: 4,
                      borderRadius: 2,
                      background: 'var(--c-bg-3)',
                      overflow: 'hidden',
                      width: 100,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(pct, 100)}%`,
                        borderRadius: 2,
                        background: pct > 90 ? 'var(--c-warn)' : 'var(--c-acc)',
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: pacingColor,
                      display: 'inline-block',
                    }}
                  />
                </td>
                <td className="t-mono" style={{ fontSize: 13.5 }}>
                  {fmtNum(c.imps)}
                </td>
                <td style={{ fontSize: 13.5 }}>{c.ctr > 0 ? `${c.ctr}%` : '—'}</td>
                <td style={{ fontSize: 13.5 }}>{c.ecpm > 0 ? `$${c.ecpm}` : '—'}</td>
                <td>
                  <Sparkline data={c.spark} width={72} height={24} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title={c.status === 'active' ? 'Pause' : 'Play'}
                      onClick={e => e.stopPropagation()}
                    >
                      {c.status === 'active' ? (
                        <Icons.pause size={14} />
                      ) : (
                        <Icons.play size={14} />
                      )}
                    </button>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Duplicate"
                      onClick={e => e.stopPropagation()}
                    >
                      <Icons.copy size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={e => e.stopPropagation()}
                    >
                      <Icons.more size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview page
// ---------------------------------------------------------------------------

const STAT_CARDS = [
  { label: 'Total spend', value: '$24,140.80', delta: '+18.4%', up: true, spark: [8,12,14,18,22,28,32,36,40,46,52,58] },
  { label: 'Impressions', value: '8.41M', delta: '+12.0%', up: true, spark: [12,16,20,22,26,28,32,36,40,42,46,50] },
  { label: 'Avg CTR', value: '1.62%', delta: '+0.18pp', up: true, spark: [10,12,14,13,15,14,16,15,17,16,18,19] },
  { label: 'Avg eCPM', value: '$3.21', delta: '−2.1%', up: false, spark: [22,21,20,21,19,20,18,19,17,18,16,15] },
  { label: 'Active campaigns', value: '3', delta: '2 paused', up: true, spark: [3,3,4,4,3,4,4,3,4,3,3,3] },
];

const GEO_ROWS = [
  { country: 'United States', flag: '🇺🇸', imps: 3210000, pct: 38 },
  { country: 'Germany', flag: '🇩🇪', imps: 1420000, pct: 17 },
  { country: 'United Kingdom', flag: '🇬🇧', imps: 842000, pct: 10 },
  { country: 'Japan', flag: '🇯🇵', imps: 621000, pct: 7 },
  { country: 'Brazil', flag: '🇧🇷', imps: 410000, pct: 5 },
];

const FUNNEL_STAGES = [
  { label: 'Impressions', v: 8410000, pct: 100 },
  { label: 'Viewable', v: 6050000, pct: 72 },
  { label: 'Clicks', v: 152400, pct: 1.8 },
  { label: 'Conversions', v: 8410, pct: 0.1 },
];

const ACTIVITY = [
  { msg: 'Campaign "L2 Migration Push" hit 50% budget', time: '1h ago' },
  { msg: 'cmp_887 "DevTools Audience Test" approved by review', time: '3h ago' },
  { msg: 'Invoice #INV-4821 generated for April', time: '1d ago' },
  { msg: 'Payment method Visa ····4242 updated', time: '2d ago' },
  { msg: '$2,000 USDC deposited to treasury', time: '3d ago' },
];

export default function AdvertiserOverview() {
  const router = useRouter();
  const [range, setRange] = useState('30d');

  const chartData = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ x: i, v: 200 + Math.sin(i / 4) * 60 + i * 22 })),
    []
  );
  const compareData = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ x: i, v: 160 + Math.sin(i / 5) * 40 + i * 14 })),
    []
  );

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Overview']}
        actions={
          <Button variant="primary" size="sm" onClick={() => router.push('/advertiser/campaigns/new')}>
            <Icons.plus size={14} /> New campaign
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Greeting row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1 className="t-h1" style={{ marginBottom: 6 }}>Good evening, Marina.</h1>
            <p className="muted" style={{ fontSize: 15 }}>
              Five campaigns are live. $1,238 will settle to publishers in the next batch.
            </p>
          </div>
          <Seg
            options={[
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: '90d', label: '90d' },
              { value: 'All', label: 'All' },
            ]}
            value={range}
            onChange={setRange}
          />
        </div>

        {/* 5 stat cards */}
        <div className="grid-4">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="stat" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <Sparkline
                  data={s.spark}
                  width={60}
                  height={20}
                  color={s.up ? 'var(--c-ok)' : 'var(--c-bad)'}
                />
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-meta">
                <span className={s.up ? 'delta-up' : 'delta-down'}>{s.delta}</span>
                <span>vs prev period</span>
              </div>
            </div>
          ))}
        </div>

        {/* Performance + Geo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
          <div className="card card-pad">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3 className="t-h4">Performance</h3>
              <div style={{ display: 'flex', gap: 12, fontSize: 12.5, color: 'var(--c-fg-4)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 12,
                      height: 2,
                      background: 'var(--c-acc)',
                      display: 'inline-block',
                      borderRadius: 1,
                    }}
                  />
                  This period
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 12,
                      height: 2,
                      background: 'var(--c-line-3)',
                      display: 'inline-block',
                      borderRadius: 1,
                      borderStyle: 'dashed',
                    }}
                  />
                  Previous
                </span>
              </div>
            </div>
            <AreaChart data={chartData} compare={compareData} height={200} />
          </div>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 12 }}>Top geographies</h3>
            <GeoMap
              data={GEO_ROWS.map(g => ({ country: g.country, v: g.imps }))}
              height={120}
              className=""
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              {GEO_ROWS.map(g => (
                <div
                  key={g.country}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}
                >
                  <span style={{ fontSize: 16 }}>{g.flag}</span>
                  <span style={{ flex: 1 }}>{g.country}</span>
                  <span className="t-mono" style={{ color: 'var(--c-fg-3)' }}>
                    {fmtNum(g.imps)}
                  </span>
                  <span
                    style={{
                      width: 36,
                      textAlign: 'right',
                      color: 'var(--c-fg-2)',
                      fontWeight: 520,
                    }}
                  >
                    {g.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent campaigns */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <h3 className="t-h3">Recent campaigns</h3>
            <Link href="/advertiser/campaigns" className="link" style={{ fontSize: 13.5 }}>
              View all
            </Link>
          </div>
          <CampaignTable rows={CAMPAIGNS.slice(0, 4)} />
        </div>

        {/* Funnel + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 16 }}>Conversion funnel</h3>
            <Funnel stages={FUNNEL_STAGES} />
          </div>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 14 }}>Account activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  {/* Left: vertical line + dot */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: 20,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--c-acc)',
                        flexShrink: 0,
                      }}
                    />
                    {i < ACTIVITY.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          background: 'var(--c-line)',
                          marginTop: 4,
                        }}
                      />
                    )}
                  </div>
                  {/* Right: content */}
                  <div style={{ paddingBottom: 16, flex: 1 }}>
                    <div style={{ fontSize: 13.5 }}>{a.msg}</div>
                    <div style={{ fontSize: 12, color: 'var(--c-fg-4)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
