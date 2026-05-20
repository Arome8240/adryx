'use client';
import React, { useState } from 'react';
import { Button, Avatar, Field, Input, Select, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const NAV_ITEMS = [
  { id: 'general', label: 'General' },
  { id: 'team', label: 'Team' },
  { id: 'api', label: 'API keys' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'brand-safety', label: 'Brand safety' },
  { id: 'danger', label: 'Danger zone' },
];

const TEAM = [
  { name: 'Marina Voss', email: 'marina@forecastlabs.io', role: 'Owner', initials: 'MV', joined: 'Jan 2025' },
  { name: 'Takeshi Ono', email: 'takeshi@forecastlabs.io', role: 'Admin', initials: 'TO', joined: 'Mar 2025' },
  { name: 'Priya Sharma', email: 'priya@forecastlabs.io', role: 'Member', initials: 'PS', joined: 'Apr 2025' },
];

export default function AdvertiserSettingsPage() {
  const [section, setSection] = useState('general');
  const [workspaceName, setWorkspaceName] = useState('Forecast Labs');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Topbar crumb={['Forecast Labs', 'Settings']} />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="t-h2" style={{ marginBottom: 4 }}>Settings</h1>
          <p className="muted" style={{ fontSize: 14 }}>Manage workspace preferences and team access.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Side nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`nav-item${section === item.id ? ' is-active' : ''}`}
                style={{
                  border: 0,
                  textAlign: 'left',
                  color: item.id === 'danger' ? (section === item.id ? 'var(--c-bad)' : 'var(--c-bad)') : undefined,
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {section === 'general' && (
              <>
                <div className="card card-pad">
                  <h3 className="t-h4" style={{ marginBottom: 18 }}>Workspace</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          background: 'var(--c-fg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 18,
                        }}
                      >
                        FL
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change logo</Button>
                        <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 4 }}>
                          PNG or JPG, max 400×400px
                        </div>
                      </div>
                    </div>
                    <Field label="Workspace name">
                      <Input value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} />
                    </Field>
                    <Field label="Industry">
                      <Select>
                        <option>Crypto / Web3</option>
                        <option>DeFi</option>
                        <option>NFTs</option>
                        <option>Infrastructure</option>
                        <option>Other</option>
                      </Select>
                    </Field>
                    <Field label="Website">
                      <Input defaultValue="https://forecastlabs.io" />
                    </Field>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <Button variant="ghost">Discard</Button>
                      <Button variant="primary" onClick={save}>
                        {saved ? <><Icons.check size={14} /> Saved</> : 'Save changes'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="card card-pad">
                  <h3 className="t-h4" style={{ marginBottom: 4 }}>Plan</h3>
                  <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>
                    You're on the <strong>Pro</strong> plan. Next billing: May 25, 2026.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button variant="outline" size="sm">Manage plan</Button>
                    <Button variant="ghost" size="sm">View invoices</Button>
                  </div>
                </div>
              </>
            )}

            {section === 'team' && (
              <div className="card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="t-h4">Team members</h3>
                  <Button variant="primary" size="sm">
                    <Icons.plus size={14} /> Invite member
                  </Button>
                </div>
                {TEAM.map(m => (
                  <div key={m.email} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--c-line)' }}>
                    <Avatar initials={m.initials} size="md" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 530, fontSize: 14 }}>{m.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)' }}>{m.email} · Joined {m.joined}</div>
                    </div>
                    <Select style={{ width: 120, fontSize: 13 }}>
                      <option selected={m.role === 'Owner'}>Owner</option>
                      <option selected={m.role === 'Admin'}>Admin</option>
                      <option selected={m.role === 'Member'}>Member</option>
                    </Select>
                    {m.role !== 'Owner' && (
                      <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--c-bad)' }}>
                        <Icons.x size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section === 'api' && (
              <div className="card card-pad">
                <h3 className="t-h4" style={{ marginBottom: 14 }}>API keys</h3>
                <p className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>
                  Use API keys to authenticate requests from your server. Keep them secret.
                </p>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 7,
                    border: '1px solid var(--c-line-2)',
                    background: 'var(--c-bg-2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <code style={{ flex: 1, fontSize: 13, fontFamily: 'var(--f-mono)', color: 'var(--c-fg-3)' }}>
                    ak_live_••••••••••••••••••••••••••••4291
                  </code>
                  <button className="btn btn-ghost btn-sm">
                    <Icons.copy size={13} />
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--c-bad)' }}>
                    Revoke
                  </button>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.plus size={14} /> Generate new key
                </Button>
              </div>
            )}

            {section === 'notifications' && (
              <div className="card card-pad">
                <h3 className="t-h4" style={{ marginBottom: 16 }}>Notification preferences</h3>
                {[
                  { label: 'Campaign approved', sub: 'When a campaign passes review', checked: true },
                  { label: 'Low budget warning', sub: 'When budget drops below 20%', checked: true },
                  { label: 'Daily spend report', sub: 'Daily summary of all active campaigns', checked: false },
                  { label: 'Payment confirmation', sub: 'When a deposit or charge occurs', checked: true },
                  { label: 'Weekly analytics', sub: 'Weekly performance digest', checked: false },
                ].map(n => (
                  <label
                    key={n.label}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--c-line)',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 520, fontSize: 14 }}>{n.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--c-fg-4)', marginTop: 2 }}>{n.sub}</div>
                    </div>
                    <input type="checkbox" defaultChecked={n.checked} style={{ accentColor: 'var(--c-acc)', width: 16, height: 16 }} />
                  </label>
                ))}
              </div>
            )}

            {section === 'brand-safety' && (
              <div className="card card-pad">
                <h3 className="t-h4" style={{ marginBottom: 16 }}>Brand safety settings</h3>
                <Field label="Default safety level">
                  <Select>
                    <option>Standard — most publisher sites</option>
                    <option>Strict — vetted premium sites only</option>
                    <option>Relaxed — broader reach</option>
                  </Select>
                </Field>
                <Field label="Category exclusions" hint="Campaigns will not run on sites in these categories">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {['Adult content', 'Gambling', 'Violence', 'Misinformation'].map(cat => (
                      <span key={cat} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--c-bad-soft)', color: 'var(--c-bad)', fontSize: 13, border: '1px solid rgba(185,28,28,.15)' }}>
                        {cat}
                      </span>
                    ))}
                    <Button variant="outline" size="sm">+ Add</Button>
                  </div>
                </Field>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" size="sm">Save preferences</Button>
                </div>
              </div>
            )}

            {section === 'danger' && (
              <div className="card card-pad" style={{ border: '1px solid rgba(185,28,28,.3)' }}>
                <h3 className="t-h4" style={{ marginBottom: 4, color: 'var(--c-bad)' }}>Danger zone</h3>
                <p className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>
                  Destructive actions that cannot be undone.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: 8, border: '1px solid var(--c-line)' }}>
                    <div>
                      <div style={{ fontWeight: 520 }}>Pause all campaigns</div>
                      <div style={{ fontSize: 13, color: 'var(--c-fg-4)' }}>Immediately pause every active campaign</div>
                    </div>
                    <Button variant="outline" size="sm" style={{ borderColor: 'var(--c-warn)', color: 'var(--c-warn)' }}>
                      Pause all
                    </Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: 8, border: '1px solid var(--c-line)' }}>
                    <div>
                      <div style={{ fontWeight: 520 }}>Delete workspace</div>
                      <div style={{ fontSize: 13, color: 'var(--c-fg-4)' }}>Permanently delete this workspace and all data</div>
                    </div>
                    <Button variant="outline" size="sm" style={{ borderColor: 'var(--c-bad)', color: 'var(--c-bad)' }}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(section === 'webhooks') && (
              <div className="card card-pad">
                <h3 className="t-h4" style={{ marginBottom: 14 }}>Webhooks</h3>
                <p className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>
                  Receive real-time HTTP POST notifications for campaign events.
                </p>
                <div className="empty" style={{ padding: 28 }}>
                  <Icons.send size={22} style={{ color: 'var(--c-fg-4)', margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontWeight: 520, marginBottom: 4 }}>No webhooks configured</div>
                  <Button variant="outline" size="sm" style={{ marginTop: 10 }}>
                    <Icons.plus size={14} /> Add endpoint
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
