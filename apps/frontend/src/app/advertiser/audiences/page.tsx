'use client';
import React, { useState } from 'react';
import { Button, Badge, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';
import { fmtNum } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Constants & data
// ---------------------------------------------------------------------------

const ALL_TYPES = ['Behavioral', 'Onchain', 'Social', 'Contextual', 'Custom'] as const;
const ALL_TAGS  = ['Web3', 'DeFi', 'NFT', 'Dev', 'Social', 'Climate', 'L2', 'Ethereum', 'Retargeting'];

const TYPE_COLORS: Record<string, string> = {
  Behavioral:  'acc',
  Onchain:     'ok',
  Social:      'neutral',
  Contextual:  'warn',
  Custom:      'neutral',
};

const AUDIENCES = [
  {
    id:   'aud_01',
    name: 'Crypto natives',
    size: 4200000,
    desc: 'Users actively engaging with crypto apps and dApps weekly',
    tags: ['Web3', 'DeFi'],
    type: 'Behavioral',
  },
  {
    id:   'aud_02',
    name: 'DeFi users',
    size: 2100000,
    desc: 'Liquidity providers and traders on major DeFi protocols',
    tags: ['DeFi', 'Finance'],
    type: 'Behavioral',
  },
  {
    id:   'aud_03',
    name: 'NFT collectors',
    size: 1400000,
    desc: 'Active buyers and sellers on NFT marketplaces',
    tags: ['NFT', 'Art'],
    type: 'Behavioral',
  },
  {
    id:   'aud_04',
    name: 'ENS holders',
    size: 2800000,
    desc: 'Verified Ethereum Name Service domain owners',
    tags: ['Ethereum', 'Identity'],
    type: 'Onchain',
  },
  {
    id:   'aud_05',
    name: 'Farcaster active',
    size: 540000,
    desc: 'Daily active users of the Farcaster social protocol',
    tags: ['Social', 'Web3'],
    type: 'Social',
  },
  {
    id:   'aud_06',
    name: 'DevTools readers',
    size: 1200000,
    desc: 'Developers reading programming and tooling content',
    tags: ['Dev', 'Tech'],
    type: 'Contextual',
  },
  {
    id:   'aud_07',
    name: 'Climate-tech',
    size: 420000,
    desc: 'Readers and supporters of climate technology solutions',
    tags: ['Climate', 'Impact'],
    type: 'Contextual',
  },
  {
    id:   'aud_08',
    name: 'L2 power users',
    size: 860000,
    desc: 'High-frequency users of Layer 2 networks (Base, Arbitrum, OP)',
    tags: ['L2', 'Ethereum'],
    type: 'Onchain',
  },
  {
    id:   'aud_09',
    name: 'Retarget — visitors',
    size: 180000,
    desc: 'Users who visited your landing pages in the last 30 days',
    tags: ['Retargeting', 'Custom'],
    type: 'Custom',
  },
] as const;

type Audience = typeof AUDIENCES[number];

const maxAudienceSize = Math.max(...AUDIENCES.map(a => a.size));

// ---------------------------------------------------------------------------
// AudienceCard
// ---------------------------------------------------------------------------

function AudienceCard({
  a,
  selected,
  onToggle,
  maxSize,
}: {
  a: Audience;
  selected: boolean;
  onToggle: () => void;
  maxSize: number;
}) {
  const reachPct = (a.size / maxSize) * 100;
  return (
    <div
      className="card card-pad"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        outline: selected ? '2px solid var(--c-acc)' : 'none',
        outlineOffset: -1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 540, fontSize: 14.5 }}>{a.name}</div>
        <Badge tone={TYPE_COLORS[a.type] as 'acc' | 'ok' | 'neutral' | 'warn' | 'bad' | 'outline'}>
          {a.type}
        </Badge>
      </div>
      <div style={{ fontSize: 26, fontWeight: 560, letterSpacing: '-0.02em' }}>{fmtNum(a.size)}</div>
      {/* Reach bar */}
      <div style={{ height: 4, background: 'var(--c-bg-3)', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${reachPct}%`,
            background: 'var(--c-acc)',
            borderRadius: 2,
            transition: 'width .4s',
          }}
        />
      </div>
      <p style={{ fontSize: 13, color: 'var(--c-fg-3)', lineHeight: 1.45, flex: 1 }}>{a.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {a.tags.map(t => (
          <span
            key={t}
            style={{
              padding: '2px 7px',
              borderRadius: 4,
              background: 'var(--c-bg-3)',
              fontSize: 11.5,
              color: 'var(--c-fg-3)',
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, paddingTop: 6, borderTop: '1px solid var(--c-line)' }}>
        <Button
          variant={selected ? 'primary' : 'outline'}
          size="sm"
          style={{ flex: 1 }}
          onClick={onToggle}
        >
          {selected ? (
            <>
              <Icons.check size={13} /> Added
            </>
          ) : (
            'Add to campaign'
          )}
        </Button>
        <button className="btn btn-ghost btn-icon btn-sm">
          <Icons.bookmark size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AudiencesPage() {
  const [search, setSearch] = useState('');
  const [activeTypes, setActiveTypes] = useState<string[]>([
    'Behavioral', 'Onchain', 'Social', 'Contextual', 'Custom',
  ]);
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = AUDIENCES.filter(a => {
    if (!activeTypes.includes(a.type)) return false;
    if (
      search &&
      !a.name.toLowerCase().includes(search.toLowerCase()) &&
      !a.type.toLowerCase().includes(search.toLowerCase())
    ) return false;
    if (minSize && a.size < Number(minSize.replace(/[^0-9]/g, ''))) return false;
    if (maxSize && a.size > Number(maxSize.replace(/[^0-9]/g, ''))) return false;
    if (activeTags.length > 0 && !activeTags.some(tag => (a.tags as readonly string[]).includes(tag))) return false;
    return true;
  });

  const toggleSelected = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

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
      <div className="app-body page-enter">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* Filter sidebar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'sticky',
              top: 72,
            }}
          >
            {/* Search */}
            <div className="input-group">
              <span className="addon">
                <Icons.search size={14} />
              </span>
              <input
                className="input"
                placeholder="Search audiences…"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                style={{ fontSize: 13.5 }}
              />
            </div>

            {/* Type filter */}
            <div>
              <div className="t-eyebrow-n" style={{ marginBottom: 8 }}>Type</div>
              {ALL_TYPES.map(type => (
                <label
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 0',
                    cursor: 'pointer',
                    fontSize: 13.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={activeTypes.includes(type)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setActiveTypes(
                        e.target.checked
                          ? [...activeTypes, type]
                          : activeTypes.filter(t => t !== type)
                      );
                    }}
                    style={{ accentColor: 'var(--c-acc)', width: 14, height: 14 }}
                  />
                  {type}
                  <span className="muted" style={{ marginLeft: 'auto', fontSize: 12 }}>
                    {AUDIENCES.filter(a => a.type === type).length}
                  </span>
                </label>
              ))}
            </div>

            {/* Size range */}
            <div>
              <div className="t-eyebrow-n" style={{ marginBottom: 8 }}>Reach</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Min"
                  value={minSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinSize(e.target.value)}
                  style={{ fontSize: 13 }}
                />
                <input
                  className="input"
                  placeholder="Max"
                  value={maxSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxSize(e.target.value)}
                  style={{ fontSize: 13 }}
                />
              </div>
              {(minSize || maxSize) && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 4 }}
                  onClick={() => { setMinSize(''); setMaxSize(''); }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Tags */}
            <div>
              <div className="t-eyebrow-n" style={{ marginBottom: 8 }}>Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ALL_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTags(
                        activeTags.includes(tag)
                          ? activeTags.filter(t => t !== tag)
                          : [...activeTags, tag]
                      )
                    }
                    style={{
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: activeTags.includes(tag) ? 'var(--c-acc)' : 'var(--c-line)',
                      background: activeTags.includes(tag) ? 'var(--c-acc-soft)' : 'transparent',
                      color: activeTags.includes(tag) ? 'var(--c-acc-ink)' : 'var(--c-fg-3)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card grid */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div className="t-h2" style={{ marginBottom: 4 }}>Audiences</div>
              <p className="muted" style={{ fontSize: 14 }}>
                {filtered.length} segments · select to attach to campaigns
              </p>
            </div>
            <div className="grid-3">
              {filtered.map(a => (
                <AudienceCard
                  key={a.id}
                  a={a}
                  selected={selected.includes(a.id)}
                  onToggle={() => toggleSelected(a.id)}
                  maxSize={maxAudienceSize}
                />
              ))}
              {/* Create audience card */}
              <div
                className="empty"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 180,
                  gap: 10,
                }}
              >
                <Icons.plus size={24} style={{ color: 'var(--c-fg-4)' }} />
                <div style={{ fontWeight: 530 }}>Build custom audience</div>
                <Badge tone="neutral">Coming soon</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky selection bar */}
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
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: 'var(--sh-pop)',
            zIndex: 100,
            fontSize: 13.5,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ opacity: 0.7 }}>
            {selected.length} audience{selected.length !== 1 ? 's' : ''} selected
          </span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.2)' }} />
          <Button
            variant="primary"
            size="sm"
            style={{ background: 'var(--c-acc)', color: '#fff' }}
          >
            Attach to campaign
          </Button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'rgba(255,255,255,.7)' }}
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
}
