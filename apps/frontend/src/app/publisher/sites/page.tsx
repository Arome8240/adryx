'use client';
import React, { useState } from 'react';
import { Button, Badge, Modal, Field, Input, Select, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';
import { SITES, fmtNum, fmtMoney } from '@/lib/mock-data';

const STATUS_TONE: Record<string, string> = { active: 'ok', warning: 'warn', inactive: 'neutral' };

const CATEGORIES = [
  'Crypto / Web3', 'DeFi / Finance', 'Technology', 'Developer Tools',
  'News / Media', 'Climate / Impact', 'Gaming', 'Other',
];

export default function SitesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ url: '', category: '', wallet: '' });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <Topbar
        crumb={['Tessera Wire', 'Sites']}
        actions={
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <Icons.plus size={14} /> Add site
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="t-h2" style={{ marginBottom: 4 }}>Sites</h1>
          <p className="muted" style={{ fontSize: 14 }}>
            {SITES.length} registered sites · verified domains earn higher eCPMs
          </p>
        </div>

        {/* Site cards grid */}
        <div className="grid-2" style={{ gap: 16 }}>
          {SITES.map(s => (
            <div key={s.d} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'var(--c-bg-3)',
                      border: '1px solid var(--c-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--c-fg-3)',
                    }}
                  >
                    {s.d[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 540, fontSize: 15 }}>{s.d}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 1 }}>
                      {s.units} ad unit{s.units !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Badge tone={STATUS_TONE[s.st] as any} dot>
                    {s.st.charAt(0).toUpperCase() + s.st.slice(1)}
                  </Badge>
                  <button className="btn btn-ghost btn-icon btn-sm">
                    <Icons.more size={14} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {[
                  { label: 'Revenue', v: fmtMoney(s.rev) },
                  { label: 'Impressions', v: fmtNum(s.imps) },
                  { label: 'eCPM', v: `$${s.ecpm}` },
                  { label: 'Fill rate', v: `${s.fill}%` },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{ fontSize: 12, color: 'var(--c-fg-4)', marginBottom: 3 }}>{m.label}</div>
                    <div style={{ fontWeight: 540, fontSize: 15 }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Fill rate bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--c-fg-4)', marginBottom: 5 }}>
                  <span>Fill rate</span>
                  <span>{s.fill}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--c-bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${s.fill}%`,
                      background: s.fill >= 90 ? 'var(--c-ok)' : s.fill >= 80 ? 'var(--c-acc)' : 'var(--c-warn)',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm">
                  <Icons.code size={13} /> Ad unit code
                </Button>
                <Button variant="ghost" size="sm">
                  View analytics
                </Button>
              </div>
            </div>
          ))}

          {/* Add site card */}
          <button
            onClick={() => setAddOpen(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '32px',
              borderRadius: 12,
              border: '2px dashed var(--c-line-2)',
              background: 'var(--c-bg-2)',
              cursor: 'pointer',
              color: 'var(--c-fg-4)',
              transition: 'all .12s',
              minHeight: 180,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c-acc)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--c-line-2)')}
          >
            <Icons.plus size={24} />
            <div style={{ fontWeight: 530 }}>Add a new site</div>
            <div style={{ fontSize: 13 }}>Connect a domain and start earning</div>
          </button>
        </div>
      </div>

      {/* Add site modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add site"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setAddOpen(false)}>
              Add site
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Website URL" required hint="e.g. https://yoursite.com">
            <Input
              value={form.url}
              onChange={e => set('url', e.target.value)}
              placeholder="https://yoursite.com"
              type="url"
            />
          </Field>
          <Field label="Primary category">
            <Select value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Payout wallet (USDC)" hint="Base, Polygon, or Ethereum address">
            <Input
              value={form.wallet}
              onChange={e => set('wallet', e.target.value)}
              placeholder="0x..."
              className="t-mono"
            />
          </Field>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--c-bg-2)',
              border: '1px solid var(--c-line)',
              fontSize: 13,
              color: 'var(--c-fg-4)',
              lineHeight: 1.5,
            }}
          >
            We'll send a DNS TXT verification record after you submit. Most verifications complete in under 5 minutes.
          </div>
        </div>
      </Modal>
    </>
  );
}
