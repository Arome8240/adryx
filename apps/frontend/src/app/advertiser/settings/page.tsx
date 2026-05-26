'use client';
import React, { useState } from 'react';
import { Button, Avatar, Field, Input, Select, Modal, Icons } from '@/components/ui';
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

const NOTIF_EVENTS = [
  { id: 'approved', label: 'Campaign approved', sub: 'When a campaign passes review' },
  { id: 'low_budget', label: 'Low budget warning', sub: 'When budget drops below 20%' },
  { id: 'daily', label: 'Daily spend report', sub: 'Daily summary of active campaigns' },
  { id: 'payment', label: 'Payment confirmation', sub: 'When a deposit or charge occurs' },
  { id: 'weekly', label: 'Weekly analytics digest', sub: 'Performance summary every Monday' },
  { id: 'payout', label: 'Payout settled', sub: 'When publishers receive funds' },
];

const ALL_CATS = ['Adult content', 'Gambling', 'Violence', 'Misinformation', 'Alcohol', 'Tobacco', 'Weapons', 'Political'];

export default function AdvertiserSettingsPage() {
  const [section, setSection] = useState('general');
  const [workspaceName, setWorkspaceName] = useState('Forecast Labs');
  const [saved, setSaved] = useState(false);

  // API keys
  const [newKeyOpen, setNewKeyOpen] = useState(false);

  // Notifications
  const [emailPrefs, setEmailPrefs] = useState<string[]>(['approved', 'low_budget', 'payment']);
  const [inAppPrefs, setInAppPrefs] = useState<string[]>(['approved', 'low_budget', 'payment', 'payout']);

  // Brand safety
  const [blockedCats, setBlockedCats] = useState(['Adult content', 'Gambling', 'Violence', 'Misinformation']);

  // Danger zone
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

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
          {/* Sticky side nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'sticky', top: 24 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`nav-item${section === item.id ? ' is-active' : ''}`}
                style={{
                  border: 0,
                  textAlign: 'left',
                  color: item.id === 'danger' ? 'var(--c-bad)' : undefined,
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ---- GENERAL ---- */}
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
                      <Input value={workspaceName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkspaceName(e.target.value)} />
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
                    <Field label="Timezone">
                      <Select defaultValue="UTC-5">
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">UTC</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                      </Select>
                    </Field>
                    <Field label="Language">
                      <Select defaultValue="en">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </Select>
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
                    You&apos;re on the <strong>Pro</strong> plan. Next billing: May 25, 2026.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button variant="outline" size="sm">Manage plan</Button>
                    <Button variant="ghost" size="sm">View invoices</Button>
                  </div>
                </div>
              </>
            )}

            {/* ---- TEAM ---- */}
            {section === 'team' && (
              <>
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

                {/* Pending invites */}
                <div className="card card-pad" style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 className="t-h4">Pending invites</h3>
                  </div>
                  {[
                    { email: 'kai@forecastlabs.io', role: 'Member', sent: '2d ago' },
                    { email: 'dev@forecastlabs.io', role: 'Viewer', sent: '5d ago' },
                  ].map(inv => (
                    <div key={inv.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--c-line)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--c-bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icons.mail size={14} style={{ color: 'var(--c-fg-4)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 520 }}>{inv.email}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)' }}>Invited as {inv.role} · {inv.sent}</div>
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 12.5 }}>Resend</button>
                      <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--c-bad)' }}>
                        <Icons.x size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ---- API KEYS ---- */}
            {section === 'api' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="t-h4">API keys</h3>
                    <Button variant="outline" size="sm" onClick={() => setNewKeyOpen(true)}>
                      <Icons.plus size={14} /> Create new key
                    </Button>
                  </div>
                  {[
                    { name: 'Production key', created: 'Jan 12, 2025', lastUsed: '2 hours ago', perms: 'Read, Campaigns' },
                    { name: 'Analytics export', created: 'Mar 4, 2025', lastUsed: '1 day ago', perms: 'Read' },
                  ].map(key => (
                    <div key={key.name} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--c-line)' }}>
                      <Icons.bolt size={16} style={{ color: 'var(--c-fg-3)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 520, fontSize: 14 }}>{key.name}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 2 }}>
                          Created {key.created} · Last used {key.lastUsed} · {key.perms}
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--c-bad)', fontSize: 13 }}>Revoke</button>
                    </div>
                  ))}
                </div>
                <p className="muted" style={{ fontSize: 13 }}>API keys grant access to your account data. Never share them publicly.</p>
              </div>
            )}

            {/* ---- WEBHOOKS ---- */}
            {section === 'webhooks' && (
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

            {/* ---- NOTIFICATIONS ---- */}
            {section === 'notifications' && (
              <div className="card">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)' }}>
                  <h3 className="t-h4">Notification preferences</h3>
                </div>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', padding: '10px 20px', borderBottom: '1px solid var(--c-line)' }}>
                  <div className="t-eyebrow-n">Event</div>
                  <div className="t-eyebrow-n" style={{ textAlign: 'center' }}>Email</div>
                  <div className="t-eyebrow-n" style={{ textAlign: 'center' }}>In-app</div>
                </div>
                {NOTIF_EVENTS.map(evt => (
                  <div key={evt.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', padding: '12px 20px', alignItems: 'center', borderBottom: '1px solid var(--c-line)' }}>
                    <div>
                      <div style={{ fontWeight: 520, fontSize: 14 }}>{evt.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 2 }}>{evt.sub}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={emailPrefs.includes(evt.id)}
                        onChange={e => setEmailPrefs(e.target.checked ? [...emailPrefs, evt.id] : emailPrefs.filter(id => id !== evt.id))}
                        style={{ accentColor: 'var(--c-acc)', width: 15, height: 15 }}
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={inAppPrefs.includes(evt.id)}
                        onChange={e => setInAppPrefs(e.target.checked ? [...inAppPrefs, evt.id] : inAppPrefs.filter(id => id !== evt.id))}
                        style={{ accentColor: 'var(--c-acc)', width: 15, height: 15 }}
                      />
                    </div>
                  </div>
                ))}
                <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" size="sm">Save preferences</Button>
                </div>
              </div>
            )}

            {/* ---- BRAND SAFETY ---- */}
            {section === 'brand-safety' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card card-pad">
                  <h3 className="t-h4" style={{ marginBottom: 14 }}>Blocked categories</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {ALL_CATS.map(cat => {
                      const blocked = blockedCats.includes(cat);
                      return (
                        <label
                          key={cat}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 10px',
                            borderRadius: 7,
                            border: `1px solid ${blocked ? 'var(--c-bad)' : 'var(--c-line)'}`,
                            cursor: 'pointer',
                            background: blocked ? 'var(--c-bad-soft)' : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={blocked}
                            onChange={e => setBlockedCats(e.target.checked ? [...blockedCats, cat] : blockedCats.filter(c => c !== cat))}
                            style={{ accentColor: 'var(--c-bad)', width: 14, height: 14 }}
                          />
                          <span style={{ fontSize: 13.5, color: blocked ? 'var(--c-bad)' : 'var(--c-fg-2)' }}>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="card card-pad">
                  <h3 className="t-h4" style={{ marginBottom: 4 }}>Keyword blocklist</h3>
                  <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Campaigns will not run near pages containing these keywords.</p>
                  <textarea
                    className="input"
                    style={{ width: '100%', minHeight: 100, resize: 'vertical', fontFamily: 'var(--f-mono)', fontSize: 13 }}
                    placeholder="Enter keywords, one per line…"
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <Button variant="primary" size="sm">Save preferences</Button>
                  </div>
                </div>
              </div>
            )}

            {/* ---- DANGER ZONE ---- */}
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
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ borderColor: 'var(--c-bad)', color: 'var(--c-bad)' }}
                      onClick={() => setDeleteOpen(true)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Create API key modal */}
      <Modal
        open={newKeyOpen}
        onClose={() => setNewKeyOpen(false)}
        title="Create API key"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewKeyOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setNewKeyOpen(false)}>Create key</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Key name">
            <Input placeholder="e.g. Production server" />
          </Field>
          <div>
            <div className="t-eyebrow-n" style={{ marginBottom: 8 }}>Permissions</div>
            {['Read account data', 'Write campaigns', 'Billing access', 'Analytics export'].map(perm => (
              <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13.5, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  defaultChecked={perm === 'Read account data'}
                  style={{ accentColor: 'var(--c-acc)', width: 14, height: 14 }}
                />
                {perm}
              </label>
            ))}
          </div>
        </div>
      </Modal>

      {/* Delete workspace modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteConfirm(''); }}
        title="Delete workspace"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteConfirm(''); }}>Cancel</Button>
            <Button
              variant="outline"
              style={{ borderColor: 'var(--c-bad)', color: 'var(--c-bad)' }}
              onClick={() => {}}
              disabled={deleteConfirm !== 'Forecast Labs'}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--c-fg-3)', lineHeight: 1.5 }}>
            This will permanently delete the <strong>Forecast Labs</strong> workspace and all its data. This action cannot be undone.
          </p>
          <Field label='Type "Forecast Labs" to confirm'>
            <Input
              value={deleteConfirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirm(e.target.value)}
              placeholder="Forecast Labs"
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
