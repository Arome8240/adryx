'use client';
import React, { useState } from 'react';
import { Button, Badge, Field, Input, Select, Tabs, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const TEAM = [
  { name: 'Marina Voss', email: 'marina@tesserawire.com', role: 'Owner', avatar: 'MV' },
  { name: 'Alex Huang', email: 'alex@tesserawire.com', role: 'Admin', avatar: 'AH' },
  { name: 'Jordan Kim', email: 'jordan@tesserawire.com', role: 'Viewer', avatar: 'JK' },
];

export default function PublisherSettingsPage() {
  const [tab, setTab] = useState('profile');
  const [minPayout, setMinPayout] = useState('100');
  const [payoutFreq, setPayoutFreq] = useState('bi-weekly');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <Topbar crumb={['Tessera Wire', 'Settings']} />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="t-h2" style={{ marginBottom: 4 }}>Settings</h1>
          <p className="muted" style={{ fontSize: 14 }}>Manage your publisher account and payout preferences.</p>
        </div>

        <Tabs
          tabs={[
            { value: 'profile', label: 'Profile' },
            { value: 'payouts', label: 'Payouts' },
            { value: 'team', label: 'Team' },
            { value: 'api', label: 'API' },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'profile' && (
          <div className="card card-pad" style={{ maxWidth: 560 }}>
            <h3 className="t-h4" style={{ marginBottom: 20 }}>Publisher profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Field label="Publisher name">
                <Input defaultValue="Tessera Wire" />
              </Field>
              <Field label="Website">
                <Input defaultValue="https://tesserawire.com" />
              </Field>
              <Field label="Primary contact email">
                <Input defaultValue="marina@tesserawire.com" type="email" />
              </Field>
              <Field label="Content category">
                <Select defaultValue="crypto">
                  <option value="crypto">Crypto &amp; Web3</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="news">News</option>
                </Select>
              </Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" onClick={handleSave}>
                  {saved ? <><Icons.check size={14} /> Saved</> : 'Save changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === 'payouts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
            <div className="card card-pad">
              <h3 className="t-h4" style={{ marginBottom: 20 }}>Payout wallet</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--c-bg-3)',
                    border: '1px solid var(--c-line)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Icons.wallet size={18} style={{ color: 'var(--c-acc)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 530, fontFamily: 'var(--f-mono)', fontSize: 13.5 }}>0x8f4a2c91...d4b7</div>
                    <div style={{ fontSize: 12, color: 'var(--c-fg-4)', marginTop: 2 }}>Base network · Primary</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <Badge tone="ok">Verified</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.plus size={14} /> Add wallet
                </Button>
              </div>
            </div>

            <div className="card card-pad">
              <h3 className="t-h4" style={{ marginBottom: 20 }}>Payout schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Field label="Minimum payout threshold (USDC)">
                  <div className="input-group">
                    <span className="addon">$</span>
                    <input
                      className="input"
                      type="number"
                      value={minPayout}
                      onChange={e => setMinPayout(e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Payout frequency">
                  <Select
                    value={payoutFreq}
                    onChange={e => setPayoutFreq(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly (default)</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </Field>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" onClick={handleSave}>
                    {saved ? <><Icons.check size={14} /> Saved</> : 'Save preferences'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'team' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--c-line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 className="t-h4">Team members</h3>
              <Button variant="outline" size="sm">
                <Icons.plus size={14} /> Invite member
              </Button>
            </div>
            {TEAM.map(member => (
              <div
                key={member.email}
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderBottom: '1px solid var(--c-line)',
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--c-fg)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 560, fontSize: 12, flexShrink: 0,
                  }}
                >
                  {member.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 530, fontSize: 14 }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--c-fg-4)' }}>{member.email}</div>
                </div>
                <Badge tone={member.role === 'Owner' ? 'acc' : 'neutral'}>{member.role}</Badge>
                {member.role !== 'Owner' && (
                  <button className="btn btn-ghost btn-icon btn-sm">
                    <Icons.more size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'api' && (
          <div className="card card-pad" style={{ maxWidth: 560 }}>
            <h3 className="t-h4" style={{ marginBottom: 20 }}>API access</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Field label="API key">
                <div className="input-group">
                  <input
                    className="input"
                    type="password"
                    readOnly
                    value="sk_pub_live_a7f3b29d1e4c8f2a6b0d5e9c3d"
                    style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5 }}
                  />
                  <button className="addon" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <Icons.copy size={13} />
                  </button>
                </div>
              </Field>
              <p style={{ fontSize: 13, color: 'var(--c-fg-3)', lineHeight: 1.5 }}>
                Use this key to access the Adryx Publisher API. Keep it secret — it grants full read access to your account data.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="outline" size="sm">
                  <Icons.refresh size={14} /> Rotate key
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.doc size={14} /> View API docs
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
