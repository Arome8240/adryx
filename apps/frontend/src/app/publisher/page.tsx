'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Seg, Icons } from '@/components/ui';
import { AreaChart, Donut } from '@/components/charts';
import { Topbar } from '@/components/layouts/AppShell';
import { SITES, fmtNum, fmtMoney } from '@/lib/mock-data';

const STAT_CARDS = [
  { label: 'Earnings (30d)', value: '$12,847.20', delta: '+14.2%', up: true },
  { label: 'Impressions', value: '4.21M', delta: '+8.6%', up: true },
  { label: 'CTR', value: '1.84%', delta: '+0.12pp', up: true },
  { label: 'eCPM', value: '$3.05', delta: '+1.4%', up: true },
];

const DONUT_DATA = [
  { label: 'tesserawire.com', v: 8420, color: 'var(--c-acc)' },
  { label: 'devbrief.io', v: 2814, color: '#7c3aed' },
  { label: 'forecast.blog', v: 1140, color: '#059669' },
  { label: 'climate.report', v: 472, color: '#d97706' },
];

const STATUS_TONE: Record<string, string> = { active: 'ok', warning: 'warn', inactive: 'neutral' };

export default function PublisherOverview() {
  const router = useRouter();
  const [range, setRange] = useState('30d');

  const earningsData = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ x: i, v: 300 + Math.sin(i / 3.5) * 80 + i * 15 })),
    []
  );

  return (
    <>
      <Topbar
        crumb={['Tessera Wire', 'Overview']}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icons.download size={14} /> Export
            </Button>
            <Button variant="accent" size="sm" onClick={() => router.push('/publisher/payouts')}>
              <Icons.wallet size={14} /> Withdraw USDC
            </Button>
          </>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="t-h1" style={{ marginBottom: 6 }}>Publisher overview</h1>
            <p className="muted" style={{ fontSize: 15 }}>
              4 active sites · earnings settle every Thursday
            </p>
          </div>
          <Seg
            options={[{value:'7d',label:'7d'},{value:'30d',label:'30d'},{value:'90d',label:'90d'},{value:'All',label:'All'}]}
            value={range}
            onChange={setRange}
          />
        </div>

        {/* Balance card */}
        <div
          className="card card-pad-lg"
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
            border: 'none',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Available to withdraw</div>
              <div style={{ fontSize: 42, fontWeight: 560, letterSpacing: '-0.03em', marginBottom: 4 }}>
                $8,420.10
              </div>
              <div style={{ fontSize: 14, opacity: 0.75 }}>USDC · Base network</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ opacity: 0.65, fontSize: 13 }}>Pending (in review)</span>
                <span style={{ fontWeight: 520, fontSize: 13 }}>$1,240.84</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ opacity: 0.65, fontSize: 13 }}>Total earned (all time)</span>
                <span style={{ fontWeight: 520, fontSize: 13 }}>$41,284.20</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ opacity: 0.65, fontSize: 13 }}>Next settlement</span>
                <span style={{ fontWeight: 520, fontSize: 13 }}>May 22, 2026</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="outline" size="sm"
              onClick={() => router.push('/publisher/payouts')}
              style={{ background: 'rgba(255,255,255,.15)', borderColor: 'rgba(255,255,255,.25)', color: '#fff' }}>
              <Icons.wallet size={14} /> Withdraw now
            </Button>
            <Button variant="ghost" size="sm" style={{ color: 'rgba(255,255,255,.7)' }}>
              <Icons.cal size={14} /> Schedule
            </Button>
          </div>
        </div>

        {/* 4 stat cards */}
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

        {/* Earnings chart + Revenue by site donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 16 }}>Earnings trend</h3>
            <AreaChart data={earningsData} height={200} color="#2563eb" />
          </div>
          <div className="card card-pad">
            <h3 className="t-h4" style={{ marginBottom: 16 }}>Revenue by site</h3>
            <Donut data={DONUT_DATA} size={140} />
          </div>
        </div>

        {/* Sites table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 className="t-h3">Sites</h3>
            <Button variant="outline" size="sm" onClick={() => router.push('/publisher/sites')}>
              Manage sites
            </Button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th>Impressions</th>
                  <th>eCPM</th>
                  <th>Fill rate</th>
                  <th>Ad units</th>
                </tr>
              </thead>
              <tbody>
                {SITES.map(s => (
                  <tr key={s.d} style={{ cursor: 'pointer' }} onClick={() => router.push('/publisher/sites')}>
                    <td>
                      <div style={{ fontWeight: 530, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: 'var(--c-bg-3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: 'var(--c-fg-4)',
                          }}
                        >
                          {s.d[0].toUpperCase()}
                        </div>
                        {s.d}
                      </div>
                    </td>
                    <td>
                      <Badge tone={STATUS_TONE[s.st] as any} dot>
                        {s.st.charAt(0).toUpperCase() + s.st.slice(1)}
                      </Badge>
                    </td>
                    <td style={{ fontWeight: 530 }}>{fmtMoney(s.rev)}</td>
                    <td className="t-mono">{fmtNum(s.imps)}</td>
                    <td>${s.ecpm}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ height: 5, width: 60, background: 'var(--c-bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${s.fill}%`,
                              background: s.fill >= 90 ? 'var(--c-ok)' : s.fill >= 80 ? 'var(--c-acc)' : 'var(--c-warn)',
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 13 }}>{s.fill}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13.5 }}>{s.units}</td>
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
