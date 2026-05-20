'use client';
import React, { useState, useMemo } from 'react';
import { Button, Seg, Icons } from '@/components/ui';
import { AreaChart, BarChart } from '@/components/charts';
import { Topbar } from '@/components/layouts/AppShell';
import { fmtNum } from '@/lib/mock-data';

const STAT_CARDS = [
  { label: 'Impressions', value: '8.41M', delta: '+12.0%', up: true },
  { label: 'Clicks', value: '152.4k', delta: '+8.4%', up: true },
  { label: 'Conversions', value: '8,410', delta: '+5.2%', up: true },
  { label: 'CPA', value: '$2.87', delta: '−4.1%', up: false },
];

const FORMATS = [
  { label: 'Leaderboard 728×90', v: 82, color: 'var(--c-acc)' },
  { label: 'MPU 300×250', v: 67, color: '#7c3aed' },
  { label: 'Skyscraper 160×600', v: 44, color: '#059669' },
  { label: 'Native', v: 58, color: '#d97706' },
];

export default function AdvertiserAnalytics() {
  const [range, setRange] = useState('30d');

  const spendData = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ x: i, v: 180 + Math.sin(i / 3.5) * 70 + i * 18 })),
    []
  );

  const dailyData = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        label: `${i + 1}`,
        v: Math.floor(150000 + Math.random() * 120000),
      })),
    []
  );

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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Analytics</h1>
            <p className="muted" style={{ fontSize: 14 }}>Performance metrics across all campaigns</p>
          </div>
          <Seg options={[{value:'7d',label:'7d'},{value:'30d',label:'30d'},{value:'90d',label:'90d'},{value:'All',label:'All'}]} value={range} onChange={setRange} />
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

        {/* Spend trend */}
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="t-h4">Spend trend</h3>
            <div style={{ fontSize: 13, color: 'var(--c-fg-4)' }}>30-day rolling</div>
          </div>
          <AreaChart data={spendData} height={200} />
        </div>

        {/* Format performance + Daily breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 16 }}>Format performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FORMATS.map(f => (
                <div key={f.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}>
                    <span>{f.label}</span>
                    <span style={{ fontWeight: 520 }}>{f.v}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--c-bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${f.v}%`,
                        background: f.color,
                        borderRadius: 3,
                        transition: 'width .4s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 16 }}>Daily impressions</h3>
            <BarChart data={dailyData} height={160} />
          </div>
        </div>

        {/* Top campaigns table */}
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)' }}>
            <h3 className="t-h4">Campaign breakdown</h3>
          </div>
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Conversions</th>
                  <th>CPA</th>
                  <th>Spend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Q2 — Anchorset Launch', imps: 1284000, clicks: 23369, ctr: 1.82, conv: 1168, cpa: 4.13, spend: 4820 },
                  { name: 'Wallet Onboarding · NA', imps: 842500, clicks: 11964, ctr: 1.42, conv: 598, cpa: 5.37, spend: 3211 },
                  { name: 'L2 Migration Push', imps: 1654000, clicks: 28283, ctr: 1.71, conv: 1414, cpa: 3.62, spend: 5120 },
                  { name: 'Spring Brand Awareness', imps: 3210000, clicks: 29532, ctr: 0.92, conv: 1476, cpa: 5.31, spend: 7843 },
                ].map(row => (
                  <tr key={row.name}>
                    <td style={{ fontWeight: 520 }}>{row.name}</td>
                    <td className="t-mono">{fmtNum(row.imps)}</td>
                    <td className="t-mono">{fmtNum(row.clicks)}</td>
                    <td>{row.ctr}%</td>
                    <td className="t-mono">{fmtNum(row.conv)}</td>
                    <td>${row.cpa}</td>
                    <td className="t-mono">${fmtNum(row.spend)}</td>
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
