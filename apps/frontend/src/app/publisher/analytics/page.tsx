'use client';
import React, { useState } from 'react';
import { Button, Badge, Seg, Tabs, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';
import { AreaChart, BarChart, GeoMap, Funnel } from '@/components/charts';

const RANGE_OPTIONS = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'custom', label: 'Custom' },
];

const DAILY_REV = [
  { x: 1, v: 320 }, { x: 2, v: 410 }, { x: 3, v: 380 }, { x: 4, v: 490 },
  { x: 5, v: 520 }, { x: 6, v: 460 }, { x: 7, v: 540 }, { x: 8, v: 610 },
  { x: 9, v: 580 }, { x: 10, v: 640 }, { x: 11, v: 720 }, { x: 12, v: 680 },
  { x: 13, v: 760 }, { x: 14, v: 820 }, { x: 15, v: 790 }, { x: 16, v: 860 },
  { x: 17, v: 900 }, { x: 18, v: 840 }, { x: 19, v: 920 }, { x: 20, v: 980 },
  { x: 21, v: 1020 }, { x: 22, v: 960 }, { x: 23, v: 1080 }, { x: 24, v: 1140 },
  { x: 25, v: 1100 }, { x: 26, v: 1200 }, { x: 27, v: 1160 }, { x: 28, v: 1240 },
  { x: 29, v: 1300 }, { x: 30, v: 1280 },
];

const DAILY_IMP = DAILY_REV.map(d => ({ x: d.x, v: d.v * 420 }));

const ECPM_BARS = [
  { label: 'tesserawire', v: 312 },
  { label: 'devbrief', v: 228 },
  { label: 'forecast', v: 222 },
  { label: 'climate', v: 198 },
];

const GEO_DATA = [
  { country: 'US', v: 5420 },
  { country: 'GB', v: 2140 },
  { country: 'DE', v: 1840 },
  { country: 'CA', v: 1240 },
  { country: 'AU', v: 980 },
];

const SITE_STATS = [
  { site: 'tesserawire.com', rev: 8420.10, imps: 2840000, ecpm: 2.96, fill: 94, delta: '+14%' },
  { site: 'devbrief.io', rev: 2814.40, imps: 1240000, ecpm: 2.27, fill: 91, delta: '+8%' },
  { site: 'forecast.blog', rev: 1140.20, imps: 512000, ecpm: 2.22, fill: 88, delta: '+3%' },
  { site: 'climate.report', rev: 472.50, imps: 204000, ecpm: 2.31, fill: 84, delta: '-5%' },
];

export default function PublisherAnalyticsPage() {
  const [range, setRange] = useState('30d');
  const [tab, setTab] = useState('revenue');

  return (
    <>
      <Topbar
        crumb={['Tessera Wire', 'Analytics']}
        actions={
          <Button variant="outline" size="sm">
            <Icons.download size={14} /> Export CSV
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Analytics</h1>
            <p className="muted" style={{ fontSize: 14 }}>Revenue and traffic breakdown across all sites.</p>
          </div>
          <Seg options={RANGE_OPTIONS} value={range} onChange={setRange} />
        </div>

        {/* Top stats row */}
        <div className="grid-4">
          {[
            { label: 'Total revenue', value: '$12,847.20', delta: '+18.4%', up: true },
            { label: 'Impressions', value: '4.80M', delta: '+12.1%', up: true },
            { label: 'Avg. eCPM', value: '$2.66', delta: '+4.2%', up: true },
            { label: 'Fill rate', value: '91.5%', delta: '-0.8%', up: false },
          ].map(s => (
            <div key={s.label} className="stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <span style={{ fontSize: 12.5, color: s.up ? 'var(--c-ok)' : 'var(--c-err)', fontWeight: 520 }}>
                {s.delta}
              </span>
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Tabs
              tabs={[
                { value: 'revenue', label: 'Revenue' },
                { value: 'impressions', label: 'Impressions' },
                { value: 'ecpm', label: 'eCPM' },
              ]}
              value={tab}
              onChange={setTab}
            />
          </div>
          {tab === 'revenue' && <AreaChart data={DAILY_REV} height={200} color="var(--c-acc)" />}
          {tab === 'impressions' && <AreaChart data={DAILY_IMP} height={200} color="#7c3aed" />}
          {tab === 'ecpm' && (
            <AreaChart data={DAILY_REV.map(d => ({ x: d.x, v: +(d.v / 400).toFixed(2) }))} height={200} color="#059669" />
          )}
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* eCPM by site */}
          <div className="card card-pad">
            <div className="t-h4" style={{ marginBottom: 16 }}>eCPM by site (¢)</div>
            <BarChart data={ECPM_BARS} height={140} color="var(--c-acc)" />
          </div>

          {/* Geo map */}
          <div className="card card-pad">
            <div className="t-h4" style={{ marginBottom: 16 }}>Geographic distribution</div>
            <GeoMap data={GEO_DATA} height={140} />
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GEO_DATA.slice(0, 4).map(g => (
                <div key={g.country} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span className="muted">{g.country}</span>
                  <span style={{ fontWeight: 520 }}>${g.v.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Per-site breakdown */}
        <div>
          <h3 className="t-h4" style={{ marginBottom: 14 }}>By site</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Revenue</th>
                  <th>Impressions</th>
                  <th>eCPM</th>
                  <th>Fill rate</th>
                  <th>vs last period</th>
                </tr>
              </thead>
              <tbody>
                {SITE_STATS.map(s => (
                  <tr key={s.site}>
                    <td style={{ fontWeight: 530 }}>{s.site}</td>
                    <td style={{ fontWeight: 520 }}>${s.rev.toFixed(2)}</td>
                    <td className="t-mono">{(s.imps / 1e6).toFixed(2)}M</td>
                    <td>${s.ecpm}</td>
                    <td>{s.fill}%</td>
                    <td>
                      <span style={{
                        fontSize: 12.5, fontWeight: 520,
                        color: s.delta.startsWith('+') ? 'var(--c-ok)' : 'var(--c-err)',
                      }}>
                        {s.delta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
