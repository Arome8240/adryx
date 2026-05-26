'use client';
import React, { useState } from 'react';
import { Button, Badge, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const CREATIVES = [
  { id: 'cr_01', name: 'Anchorset Launch — Banner', format: 'Leaderboard', size: '728×90', status: 'active', campaigns: 2, ctr: 1.82 },
  { id: 'cr_02', name: 'Anchorset Launch — MPU', format: 'MPU', size: '300×250', status: 'active', campaigns: 3, ctr: 2.14 },
  { id: 'cr_03', name: 'Wallet Onboarding — Hero', format: 'MPU', size: '300×250', status: 'active', campaigns: 1, ctr: 1.42 },
  { id: 'cr_04', name: 'L2 Migration — Sidebar', format: 'Skyscraper', size: '160×600', status: 'active', campaigns: 2, ctr: 1.71 },
  { id: 'cr_05', name: 'Spring Brand — Native', format: 'Native', size: 'Flexible', status: 'paused', campaigns: 0, ctr: 0.92 },
  { id: 'cr_06', name: 'DevTools — Banner', format: 'Leaderboard', size: '728×90', status: 'review', campaigns: 0, ctr: 0 },
  { id: 'cr_07', name: 'Retarget Holders — Small', format: 'MPU', size: '300×250', status: 'ended', campaigns: 0, ctr: 2.10 },
  { id: 'cr_08', name: 'Brand Kit — Tall', format: 'Skyscraper', size: '160×600', status: 'active', campaigns: 1, ctr: 1.44 },
];

const STATUS_TONE: Record<string, string> = {
  active: 'ok', paused: 'warn', review: 'neutral', ended: 'neutral',
};

const DIM_RATIOS: Record<string, { w: number; h: number }> = {
  '728×90': { w: 728, h: 90 },
  '300×250': { w: 300, h: 250 },
  '160×600': { w: 160, h: 600 },
  'Flexible': { w: 1, h: 1 },
};

const FORMAT_TABS = ['all', 'Leaderboard', 'MPU', 'Skyscraper', 'Native', 'Banner'];

export default function CreativesPage() {
  const [formatFilter, setFormatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = CREATIVES.filter(c =>
    (formatFilter === 'all' || c.format === formatFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.format.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Creatives']}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icons.download size={14} /> Export
            </Button>
            <Button variant="primary" size="sm">
              <Icons.plus size={14} /> Upload creative
            </Button>
          </>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header + search row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Creative library</h1>
            <p className="muted" style={{ fontSize: 14 }}>{CREATIVES.length} assets · {CREATIVES.filter(c => c.status === 'active').length} active</p>
          </div>
          <div className="input-group" style={{ width: 240 }}>
            <span className="addon"><Icons.search size={14} /></span>
            <input className="input" placeholder="Search creatives…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13.5 }} />
          </div>
        </div>

        {/* Format filter tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--c-line)', marginBottom: 20 }}>
          {FORMAT_TABS.map(f => (
            <button
              key={f}
              onClick={() => setFormatFilter(f)}
              style={{
                padding: '8px 14px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: 510,
                borderBottom: formatFilter === f ? '2px solid var(--c-fg)' : '2px solid transparent',
                color: formatFilter === f ? 'var(--c-fg)' : 'var(--c-fg-3)',
                marginBottom: -1,
              }}
            >
              {f === 'all' ? 'All' : f}
              {' '}
              <span style={{ fontSize: 11, color: 'var(--c-fg-4)' }}>
                ({f === 'all' ? CREATIVES.length : CREATIVES.filter(c => c.format === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {filtered.map(cr => {
            const dim = DIM_RATIOS[cr.size] || { w: 1, h: 1 };
            const ratio = dim.h / dim.w;
            const previewH = Math.min(Math.max(ratio * 180, 48), 120);
            return (
              <div
                key={cr.id}
                className="card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                {/* Status dot */}
                <div style={{
                  position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%',
                  background: cr.status === 'active' ? 'var(--c-ok)' : cr.status === 'paused' ? 'var(--c-warn)' : 'var(--c-fg-4)',
                }} />

                {/* Preview box */}
                <div
                  style={{
                    height: previewH,
                    background: 'linear-gradient(135deg, var(--c-bg-3), var(--c-bg-4))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--c-line)',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--c-fg-4)', fontFamily: 'var(--f-mono)' }}>
                    {cr.size}
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 6,
                      border: '1px dashed var(--c-line-2)',
                      borderRadius: 4,
                      opacity: 0.5,
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontWeight: 530, fontSize: 13.5, lineHeight: 1.3 }}>{cr.name}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Badge tone={STATUS_TONE[cr.status] as 'ok' | 'warn' | 'neutral' | 'acc'} dot>
                      {cr.status.charAt(0).toUpperCase() + cr.status.slice(1)}
                    </Badge>
                    <span style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>{cr.format}</span>
                  </div>

                  {/* Performance row */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {cr.ctr > 0 && (
                      <span style={{ padding: '1px 8px', borderRadius: 4, background: 'var(--c-bg-3)', fontSize: 12, color: 'var(--c-fg-3)' }}>
                        CTR {cr.ctr}%
                      </span>
                    )}
                    <span style={{ padding: '1px 8px', borderRadius: 4, background: 'var(--c-bg-3)', fontSize: 12, color: 'var(--c-fg-3)' }}>
                      {cr.campaigns} campaign{cr.campaigns !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Actions row */}
                  <div style={{ display: 'flex', gap: 6, paddingTop: 6, borderTop: '1px solid var(--c-line)', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(cr.id)}
                      onChange={e => {
                        e.stopPropagation();
                        setSelected(s => e.target.checked ? [...s, cr.id] : s.filter(id => id !== cr.id));
                      }}
                      style={{ accentColor: 'var(--c-acc)', width: 13, height: 13 }}
                    />
                    <Button variant="outline" size="sm" style={{ flex: 1, fontSize: 12 }}>Use</Button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.stopPropagation(); }}>
                      <Icons.copy size={12} />
                    </button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.stopPropagation(); }}>
                      <Icons.external size={12} />
                    </button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.stopPropagation(); }}>
                      <Icons.more size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Upload card */}
          <div
            className="empty"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              minHeight: 220,
              gap: 10,
              border: '2px dashed var(--c-line-2)',
            }}
          >
            <Icons.download size={28} style={{ color: 'var(--c-fg-4)' }} />
            <div style={{ fontWeight: 530, fontSize: 14 }}>Upload creative</div>
            <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)' }}>PNG · JPG · GIF · WebP · max 2 MB</div>
            <Button variant="ghost" size="sm">Browse files</Button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--c-fg)', color: '#fff', borderRadius: 10, padding: '10px 18px',
          display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--sh-pop)',
          zIndex: 100, fontSize: 13.5, whiteSpace: 'nowrap',
        }}>
          <span style={{ opacity: .7 }}>{selected.length} selected</span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.2)' }} />
          <button className="btn btn-ghost btn-sm" style={{ color: '#fff' }}>Assign to campaign</button>
          <button className="btn btn-ghost btn-sm" style={{ color: '#fff' }}>Archive</button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(185,28,28,.8)' }} onClick={() => setSelected([])}>✕ Clear</button>
        </div>
      )}
    </>
  );
}
