'use client';
import React, { useState, useMemo } from 'react';
import { Button, Seg, Tabs, Sparkline, Icons } from '@/components/ui';
import { AreaChart, GeoMap, Funnel } from '@/components/charts';
import { Topbar } from '@/components/layouts/AppShell';
import { CAMPAIGNS, fmtNum, fmtMoney } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const makeTimeSeries = (base: number, noise: number, trend: number, len = 30) =>
  Array.from({ length: len }, (_, i) => ({
    x: i,
    v: Math.max(0, base + Math.sin(i / 3.5) * noise + i * trend),
  }));

const SERIES: Record<string, { data: { x: number; v: number }[]; compare: { x: number; v: number }[] }> = {
  impressions: { data: makeTimeSeries(200000, 60000, 8000), compare: makeTimeSeries(160000, 40000, 5000) },
  clicks:      { data: makeTimeSeries(3600, 1200, 140),    compare: makeTimeSeries(2800, 900, 100) },
  spend:       { data: makeTimeSeries(420, 80, 22),        compare: makeTimeSeries(340, 60, 15) },
  ctr:         { data: makeTimeSeries(1.4, 0.3, 0.012),   compare: makeTimeSeries(1.1, 0.25, 0.009) },
  conversions: { data: makeTimeSeries(180, 50, 7),         compare: makeTimeSeries(140, 40, 5) },
};

const GEO_DATA = [
  { country: 'US', v: 3210000, pct: 38, flag: '🇺🇸' },
  { country: 'DE', v: 1420000, pct: 17, flag: '🇩🇪' },
  { country: 'GB', v: 842000,  pct: 10, flag: '🇬🇧' },
  { country: 'JP', v: 621000,  pct: 7,  flag: '🇯🇵' },
  { country: 'BR', v: 410000,  pct: 5,  flag: '🇧🇷' },
];

const FUNNEL_DATA = [
  { label: 'Impressions',  v: 8410000, pct: 100 },
  { label: 'Viewable',     v: 6050000, pct: 72 },
  { label: 'Clicks',       v: 152400,  pct: 1.81 },
  { label: 'Conversions',  v: 8410,    pct: 0.10 },
];

const FORMATS = [
  { label: 'Leaderboard 728×90',   pct: 82, imps: 3200000, color: 'var(--c-acc)' },
  { label: 'MPU 300×250',           pct: 67, imps: 2600000, color: '#7c3aed' },
  { label: 'Native',                pct: 58, imps: 2250000, color: '#059669' },
  { label: 'Skyscraper 160×600',   pct: 44, imps: 1710000, color: '#d97706' },
];

const STAT_CARDS = [
  { label: 'Impressions',  value: '8.41M',   delta: '+12.0%', up: true },
  { label: 'Clicks',       value: '152.4k',  delta: '+8.4%',  up: true },
  { label: 'Conversions',  value: '8,410',   delta: '+5.2%',  up: true },
  { label: 'CPA',          value: '$2.87',   delta: '−4.1%',  up: false },
];

const TABLE_ROWS = [
  { name: 'Q2 — Anchorset Launch',    status: 'active', imps: 1284000, clicks: 23369, ctr: 1.82, conv: 1168, cpa: 4.13, spend: 4820 },
  { name: 'Wallet Onboarding · NA',   status: 'active', imps: 842500,  clicks: 11964, ctr: 1.42, conv: 598,  cpa: 5.37, spend: 3211 },
  { name: 'L2 Migration Push',         status: 'active', imps: 1654000, clicks: 28283, ctr: 1.71, conv: 1414, cpa: 3.62, spend: 5120 },
  { name: 'Spring Brand Awareness',   status: 'paused', imps: 3210000, clicks: 29532, ctr: 0.92, conv: 1476, cpa: 5.31, spend: 7843 },
];

const DUMMY_SPARK = [10, 12, 14, 13, 15, 16, 18, 17, 19, 20, 22, 21];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdvertiserAnalytics() {
  const [range, setRange] = useState('30d');
  const [metric, setMetric] = useState('impressions');
  const [campaignId, setCampaignId] = useState('all');
  const [compare, setCompare] = useState(false);

  const seriesData = SERIES[metric].data;
  const total = useMemo(() => seriesData.reduce((s, d) => s + d.v, 0), [seriesData]);
  const avg = total / seriesData.length;
  const peak = Math.max(...seriesData.map(d => d.v));

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Analytics']}
        actions={
          <Button variant="outline" size="sm">
            <Icons.download size={14} /> Export CSV
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Analytics</h1>
            <p className="muted" style={{ fontSize: 14 }}>Performance metrics across all campaigns</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Campaign filter */}
            <select
              className="input"
              style={{ width: 200, fontSize: 13.5 }}
              value={campaignId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCampaignId(e.target.value)}
            >
              <option value="all">All campaigns</option>
              {CAMPAIGNS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {/* Range seg */}
            <Seg
              options={[
                { value: '7d',  label: '7d' },
                { value: '30d', label: '30d' },
                { value: '90d', label: '90d' },
                { value: 'All', label: 'All' },
              ]}
              value={range}
              onChange={setRange}
            />
            {/* Compare toggle */}
            <button
              className="btn btn-ghost btn-sm"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: compare ? 'var(--c-acc-soft)' : undefined,
                color: compare ? 'var(--c-acc-ink)' : undefined,
              }}
              onClick={() => setCompare(v => !v)}
            >
              <Icons.trend size={13} />
              Compare
            </button>
            {/* Export */}
            <button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icons.download size={13} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid-4">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-meta">
                <span className={s.up ? 'delta-up' : 'delta-down'}>{s.delta}</span>
                <span>vs prev period</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main chart card */}
        <div className="card card-pad">
          <Tabs
            tabs={[
              { value: 'impressions',  label: 'Impressions' },
              { value: 'clicks',       label: 'Clicks' },
              { value: 'spend',        label: 'Spend' },
              { value: 'ctr',          label: 'CTR' },
              { value: 'conversions',  label: 'Conversions' },
            ]}
            value={metric}
            onChange={setMetric}
          />
          {/* Pill stats */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Total', val: fmtNum(Math.round(total)) },
              { label: 'Avg/day', val: fmtNum(Math.round(avg)) },
              { label: 'Peak', val: fmtNum(Math.round(peak)) },
            ].map(pill => (
              <span
                key={pill.label}
                style={{
                  fontSize: 12.5,
                  padding: '2px 10px',
                  borderRadius: 999,
                  background: 'var(--c-bg-3)',
                  color: 'var(--c-fg-3)',
                }}
              >
                {pill.label}: <strong style={{ color: 'var(--c-fg)', fontWeight: 530 }}>{pill.val}</strong>
              </span>
            ))}
          </div>
          <AreaChart
            data={SERIES[metric].data}
            height={220}
            compare={compare ? SERIES[metric].compare : undefined}
          />
          {/* Compare legend */}
          {compare && (
            <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 12.5, color: 'var(--c-fg-3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width={24} height={2} style={{ flexShrink: 0 }}>
                  <line x1="0" y1="1" x2="24" y2="1" stroke="var(--c-acc)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Current period
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width={24} height={2} style={{ flexShrink: 0 }}>
                  <line x1="0" y1="1" x2="24" y2="1" stroke="var(--c-line-3)" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                </svg>
                Previous period
              </span>
            </div>
          )}
        </div>

        {/* Two-col: format + geo */}
        <div className="grid-2">
          {/* By format */}
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 16 }}>By format</h3>
            {FORMATS.map(f => (
              <div key={f.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13.5 }}>
                  <span>{f.label}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span className="muted">{fmtNum(f.imps)}</span>
                    <span style={{ fontWeight: 520 }}>{f.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--c-bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${f.pct}%`,
                      background: f.color,
                      borderRadius: 3,
                      transition: 'width .4s',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* By geography */}
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 12 }}>By geography</h3>
            <GeoMap data={GEO_DATA} height={120} />
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GEO_DATA.map(geo => (
                <div key={geo.country} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{geo.flag}</span>
                  <span style={{ fontWeight: 510, width: 28 }}>{geo.country}</span>
                  <span className="muted" style={{ flex: 1 }}>{fmtNum(geo.v)}</span>
                  <div style={{ width: 60, height: 4, background: 'var(--c-bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${geo.pct}%`,
                        background: 'var(--c-acc)',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--c-fg-3)', width: 30, textAlign: 'right' }}>{geo.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="card card-pad">
          <h3 className="t-h4" style={{ marginBottom: 16 }}>Conversion funnel</h3>
          <Funnel stages={FUNNEL_DATA} />
          {/* Drop-off labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
            {FUNNEL_DATA.slice(0, -1).map((stage, i) => {
              const next = FUNNEL_DATA[i + 1];
              const dropPct = (((stage.v - next.v) / stage.v) * 100).toFixed(1);
              return (
                <div key={i} className="muted" style={{ fontSize: 12.5, paddingLeft: 4 }}>
                  <span>&#8595; {dropPct}% drop-off</span>
                  <span style={{ color: 'var(--c-fg-4)', marginLeft: 8 }}>
                    ({stage.label} → {next.label})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign breakdown table */}
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)' }}>
            <h3 className="t-h4">Campaign breakdown</h3>
          </div>
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Conversions</th>
                  <th>CPA</th>
                  <th>Spend</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map(row => {
                  const campaignMatch = CAMPAIGNS.find(c => c.name === row.name);
                  const sparkData = campaignMatch ? campaignMatch.spark : DUMMY_SPARK;
                  return (
                    <tr key={row.name}>
                      <td style={{ fontWeight: 520 }}>{row.name}</td>
                      <td>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            fontSize: 11.5,
                            fontWeight: 510,
                            background:
                              row.status === 'active' ? 'var(--c-ok-soft)' :
                              row.status === 'paused' ? 'var(--c-warn-soft)' :
                              'var(--c-bg-3)',
                            color:
                              row.status === 'active' ? 'var(--c-ok)' :
                              row.status === 'paused' ? 'var(--c-warn)' :
                              'var(--c-fg-3)',
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="t-mono">{fmtNum(row.imps)}</td>
                      <td className="t-mono">{fmtNum(row.clicks)}</td>
                      <td>{row.ctr}%</td>
                      <td className="t-mono">{fmtNum(row.conv)}</td>
                      <td>${row.cpa}</td>
                      <td className="t-mono">{fmtMoney(row.spend)}</td>
                      <td>
                        <Sparkline data={sparkData} width={72} height={26} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
