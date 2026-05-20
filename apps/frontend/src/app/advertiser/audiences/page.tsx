'use client';
import React, { useState } from 'react';
import { Button, Badge, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';
import { fmtNum } from '@/lib/mock-data';

const AUDIENCES = [
  { id: 'aud_01', name: 'Crypto natives', size: 4200000, desc: 'Users actively engaging with crypto apps and dApps weekly', tags: ['Web3', 'DeFi'], type: 'Behavioral' },
  { id: 'aud_02', name: 'DeFi users', size: 2100000, desc: 'Liquidity providers and traders on major DeFi protocols', tags: ['DeFi', 'Finance'], type: 'Behavioral' },
  { id: 'aud_03', name: 'NFT collectors', size: 1400000, desc: 'Active buyers and sellers on NFT marketplaces', tags: ['NFT', 'Art'], type: 'Behavioral' },
  { id: 'aud_04', name: 'ENS holders', size: 2800000, desc: 'Verified Ethereum Name Service domain owners', tags: ['Ethereum', 'Identity'], type: 'Onchain' },
  { id: 'aud_05', name: 'Farcaster active', size: 540000, desc: 'Daily active users of the Farcaster social protocol', tags: ['Social', 'Web3'], type: 'Social' },
  { id: 'aud_06', name: 'DevTools readers', size: 1200000, desc: 'Developers reading programming and tooling content', tags: ['Dev', 'Tech'], type: 'Contextual' },
  { id: 'aud_07', name: 'Climate-tech', size: 420000, desc: 'Readers and supporters of climate technology solutions', tags: ['Climate', 'Impact'], type: 'Contextual' },
  { id: 'aud_08', name: 'L2 power users', size: 860000, desc: 'High-frequency users of Layer 2 networks (Base, Arbitrum, OP)', tags: ['L2', 'Ethereum'], type: 'Onchain' },
  { id: 'aud_09', name: 'Retarget — visitors', size: 180000, desc: 'Users who visited your landing pages in the last 30 days', tags: ['Retargeting', 'Custom'], type: 'Custom' },
];

const TYPE_COLORS: Record<string, string> = {
  Behavioral: 'acc',
  Onchain: 'ok',
  Social: 'neutral',
  Contextual: 'warn',
  Custom: 'neutral',
};

export default function AudiencesPage() {
  const [search, setSearch] = useState('');
  const filtered = AUDIENCES.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Audiences']}
        actions={
          <Button variant="primary" size="sm">
            <Icons.plus size={14} /> Build audience
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="t-h2" style={{ marginBottom: 4 }}>Audiences</h1>
            <p className="muted" style={{ fontSize: 14 }}>
              {AUDIENCES.length} segments · select to attach to campaigns
            </p>
          </div>
          <div className="input-group" style={{ width: 240 }}>
            <span className="addon">
              <Icons.search size={14} />
            </span>
            <input
              className="input"
              placeholder="Search audiences…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 13.5 }}
            />
          </div>
        </div>

        <div className="grid-3">
          {filtered.map(a => (
            <div key={a.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 540, fontSize: 15 }}>{a.name}</div>
                <Badge tone={TYPE_COLORS[a.type] as any}>{a.type}</Badge>
              </div>
              <div style={{ fontSize: 28, fontWeight: 560, letterSpacing: '-0.02em', color: 'var(--c-fg)' }}>
                {fmtNum(a.size)}
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--c-fg-3)', lineHeight: 1.5, flex: 1 }}>{a.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {a.tags.map(t => (
                  <span
                    key={t}
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'var(--c-bg-3)',
                      fontSize: 12,
                      color: 'var(--c-fg-3)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: '1px solid var(--c-line)' }}>
                <Button variant="outline" size="sm" style={{ flex: 1 }}>
                  Add to campaign
                </Button>
                <button className="btn btn-ghost btn-icon btn-sm">
                  <Icons.more size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
