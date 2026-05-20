'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Card, Field, Input, Select, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const STEPS = ['Basics', 'Targeting', 'Creative', 'Budget', 'Review'];

const OBJECTIVES = [
  { id: 'awareness', label: 'Brand Awareness', desc: 'Maximize reach and visibility', icon: '📡' },
  { id: 'traffic', label: 'Traffic', desc: 'Drive visitors to your site', icon: '🔗' },
  { id: 'conversions', label: 'Conversions', desc: 'Optimize for actions and sign-ups', icon: '🎯' },
];

const GEO_TAGS = ['US', 'CA', 'UK', 'DE'];

const AUDIENCES = [
  'Crypto natives', 'DeFi users', 'NFT collectors', 'ENS holders',
  'Farcaster active', 'DevTools readers', 'Climate-tech', 'L2 power users',
];

const FORMATS = [
  { id: 'lb', label: 'Leaderboard', size: '728×90' },
  { id: 'mpu', label: 'MPU', size: '300×250' },
  { id: 'sky', label: 'Skyscraper', size: '160×600' },
  { id: 'native', label: 'Native', size: 'Flexible' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    objective: 'traffic',
    schedule: 'asap',
    geos: [...GEO_TAGS],
    audiences: [] as string[],
    format: 'mpu',
    budget: '2000',
    bid: '3.50',
    spendCap: 'daily',
    payment: 'usdc',
    landingUrl: '',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleAudience = (a: string) =>
    set('audiences', form.audiences.includes(a) ? form.audiences.filter(x => x !== a) : [...form.audiences, a]);

  const removeGeo = (g: string) => set('geos', form.geos.filter(x => x !== g));

  const canContinue = step < STEPS.length - 1;
  const isLast = step === STEPS.length - 1;

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Campaigns', 'New campaign']}
        search={false}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push('/advertiser/campaigns')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (canContinue) setStep(s => s + 1);
                else router.push('/advertiser/campaigns');
              }}
            >
              {isLast ? 'Submit campaign' : 'Continue'}
              {!isLast && <Icons.arrow size={14} />}
            </Button>
          </>
        }
      />
      <div
        className="app-body page-enter"
        style={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: 24, alignItems: 'start' }}
      >
        {/* Step rail */}
        <div className="card card-pad" style={{ position: 'sticky', top: 72 }}>
          <div className="t-eyebrow-n" style={{ marginBottom: 12 }}>Progress</div>
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 10px',
                borderRadius: 7,
                border: 0,
                background: i === step ? 'var(--c-acc-soft)' : 'transparent',
                cursor: i <= step ? 'pointer' : 'default',
                textAlign: 'left',
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 560,
                  flexShrink: 0,
                  background: i < step ? 'var(--c-ok)' : i === step ? 'var(--c-acc)' : 'var(--c-bg-3)',
                  color: i <= step ? '#fff' : 'var(--c-fg-4)',
                }}
              >
                {i < step ? '✓' : i + 1}
              </span>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: i === step ? 540 : 400,
                  color: i === step ? 'var(--c-acc-ink)' : i < step ? 'var(--c-fg)' : 'var(--c-fg-4)',
                }}
              >
                {s}
              </span>
            </button>
          ))}
        </div>

        {/* Center: step content */}
        <div className="card card-pad-lg" style={{ minWidth: 0 }}>
          {/* Step 0 — Basics */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <h2 className="t-h3" style={{ marginBottom: 4 }}>Campaign basics</h2>
                <p className="muted" style={{ fontSize: 14 }}>Name your campaign and choose an objective.</p>
              </div>
              <Field label="Campaign name" required>
                <Input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Q3 Product Launch"
                />
              </Field>
              <div>
                <div className="field-label" style={{ marginBottom: 10 }}>Objective</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {OBJECTIVES.map(o => (
                    <button
                      key={o.id}
                      onClick={() => set('objective', o.id)}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 8,
                        border: `2px solid ${form.objective === o.id ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
                        background: form.objective === o.id ? 'var(--c-acc-soft)' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all .12s',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{o.icon}</div>
                      <div style={{ fontWeight: 540, fontSize: 13.5, color: form.objective === o.id ? 'var(--c-acc-ink)' : 'var(--c-fg)' }}>
                        {o.label}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 3 }}>{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Schedule</div>
                {[
                  { id: 'asap', label: 'Start immediately after review' },
                  { id: 'date', label: 'Set start and end dates' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="schedule"
                      value={opt.id}
                      checked={form.schedule === opt.id}
                      onChange={() => set('schedule', opt.id)}
                    />
                    <span style={{ fontSize: 14 }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Targeting */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <h2 className="t-h3" style={{ marginBottom: 4 }}>Targeting</h2>
                <p className="muted" style={{ fontSize: 14 }}>Define where and who sees your ads.</p>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Geographies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {form.geos.map(g => (
                    <span
                      key={g}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        height: 28,
                        padding: '0 10px',
                        borderRadius: 999,
                        background: 'var(--c-acc-soft)',
                        color: 'var(--c-acc-ink)',
                        fontSize: 13,
                        fontWeight: 510,
                        border: '1px solid rgba(37,99,235,.2)',
                      }}
                    >
                      {g}
                      <button
                        onClick={() => removeGeo(g)}
                        style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'var(--c-acc)', display: 'flex' }}
                      >
                        <Icons.x size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      const c = prompt('Add country code (e.g. FR)');
                      if (c) set('geos', [...form.geos, c.toUpperCase()]);
                    }}
                  >
                    <Icons.plus size={12} /> Add country
                  </button>
                </div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Audience cohorts</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {AUDIENCES.map(a => (
                    <label
                      key={a}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 12px',
                        borderRadius: 7,
                        border: `1px solid ${form.audiences.includes(a) ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
                        background: form.audiences.includes(a) ? 'var(--c-acc-soft)' : '#fff',
                        cursor: 'pointer',
                        fontSize: 13.5,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.audiences.includes(a)}
                        onChange={() => toggleAudience(a)}
                        style={{ accentColor: 'var(--c-acc)' }}
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <Field label="Brand safety level">
                <Select value="standard" onChange={() => {}}>
                  <option value="standard">Standard</option>
                  <option value="strict">Strict</option>
                  <option value="relaxed">Relaxed</option>
                </Select>
              </Field>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--c-acc-soft)',
                  border: '1px solid rgba(37,99,235,.15)',
                  fontSize: 13.5,
                }}
              >
                <span style={{ fontWeight: 540, color: 'var(--c-acc-ink)' }}>Estimated reach: </span>
                <span style={{ color: 'var(--c-acc-ink)' }}>2.4M – 3.8M unique users per month</span>
              </div>
            </div>
          )}

          {/* Step 2 — Creative */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <h2 className="t-h3" style={{ marginBottom: 4 }}>Creative</h2>
                <p className="muted" style={{ fontSize: 14 }}>Upload your ad assets and configure format.</p>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Ad format</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  {FORMATS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => set('format', f.id)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: 8,
                        border: `2px solid ${form.format === f.id ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
                        background: form.format === f.id ? 'var(--c-acc-soft)' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all .12s',
                      }}
                    >
                      <div
                        style={{
                          height: 32,
                          background: form.format === f.id ? 'var(--c-acc)' : 'var(--c-bg-3)',
                          borderRadius: 4,
                          marginBottom: 8,
                          opacity: 0.6,
                        }}
                      />
                      <div style={{ fontWeight: 530, fontSize: 13, color: 'var(--c-fg)' }}>{f.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--c-fg-4)', marginTop: 2 }}>{f.size}</div>
                    </button>
                  ))}
                </div>
              </div>
              {/* File drop zone */}
              <div
                style={{
                  border: '2px dashed var(--c-line-2)',
                  borderRadius: 10,
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'var(--c-bg-2)',
                  cursor: 'pointer',
                }}
                onClick={() => {}}
              >
                <Icons.download
                  size={28}
                  style={{ color: 'var(--c-fg-4)', margin: '0 auto 10px', display: 'block' }}
                />
                <div style={{ fontWeight: 530, marginBottom: 4 }}>Drop files here or click to upload</div>
                <div className="muted" style={{ fontSize: 13 }}>PNG, JPG, GIF, WebP — max 2MB</div>
              </div>
              <Field label="Landing URL" required>
                <Input
                  value={form.landingUrl}
                  onChange={e => set('landingUrl', e.target.value)}
                  placeholder="https://yoursite.com/landing"
                  type="url"
                />
              </Field>
            </div>
          )}

          {/* Step 3 — Budget */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <h2 className="t-h3" style={{ marginBottom: 4 }}>Budget &amp; billing</h2>
                <p className="muted" style={{ fontSize: 14 }}>Set your campaign budget and bid strategy.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Total budget (USD)" required>
                  <div className="input-group">
                    <span className="addon">$</span>
                    <input
                      className="input"
                      type="number"
                      value={form.budget}
                      onChange={e => set('budget', e.target.value)}
                      min={100}
                    />
                  </div>
                </Field>
                <Field label="Max CPM bid (USD)">
                  <div className="input-group">
                    <span className="addon">$</span>
                    <input
                      className="input"
                      type="number"
                      value={form.bid}
                      onChange={e => set('bid', e.target.value)}
                      step={0.1}
                    />
                  </div>
                </Field>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Spend cap</div>
                {[
                  { id: 'daily', label: 'Daily budget (auto-distributed)', sub: 'Recommended for most campaigns' },
                  { id: 'total', label: 'Total lifetime budget', sub: 'Control maximum spend over campaign lifetime' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: `1px solid ${form.spendCap === opt.id ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
                      background: form.spendCap === opt.id ? 'var(--c-acc-soft)' : '#fff',
                      cursor: 'pointer',
                      marginBottom: 8,
                      fontSize: 13.5,
                    }}
                  >
                    <input
                      type="radio"
                      name="spendCap"
                      value={opt.id}
                      checked={form.spendCap === opt.id}
                      onChange={() => set('spendCap', opt.id)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontWeight: 520 }}>{opt.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 2 }}>{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Payment method</div>
                {[
                  { id: 'usdc', label: 'USDC treasury wallet', sub: 'Balance: $12,420.10 available', icon: '🪙' },
                  { id: 'card', label: 'Visa ····4242', sub: 'Credit card on file', icon: '💳' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: `1px solid ${form.payment === opt.id ? 'var(--c-acc)' : 'var(--c-line-2)'}`,
                      background: form.payment === opt.id ? 'var(--c-acc-soft)' : '#fff',
                      cursor: 'pointer',
                      marginBottom: 8,
                      fontSize: 13.5,
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={form.payment === opt.id}
                      onChange={() => set('payment', opt.id)}
                      style={{ marginTop: 2 }}
                    />
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontWeight: 520 }}>{opt.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginTop: 2 }}>{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <h2 className="t-h3" style={{ marginBottom: 4 }}>Review &amp; submit</h2>
                <p className="muted" style={{ fontSize: 14 }}>
                  Confirm your campaign details before submission.
                </p>
              </div>
              <dl className="dl" style={{ lineHeight: 1.6 }}>
                <dt>Name</dt>
                <dd>{form.name || '—'}</dd>
                <dt>Objective</dt>
                <dd style={{ textTransform: 'capitalize' }}>{form.objective}</dd>
                <dt>Schedule</dt>
                <dd>{form.schedule === 'asap' ? 'Start immediately after review' : 'Scheduled'}</dd>
                <dt>Geographies</dt>
                <dd>{form.geos.join(', ') || '—'}</dd>
                <dt>Audiences</dt>
                <dd>{form.audiences.length > 0 ? form.audiences.join(', ') : 'All'}</dd>
                <dt>Ad format</dt>
                <dd style={{ textTransform: 'capitalize' }}>{form.format}</dd>
                <dt>Landing URL</dt>
                <dd className="t-mono" style={{ fontSize: 13 }}>{form.landingUrl || '—'}</dd>
                <dt>Budget</dt>
                <dd>${Number(form.budget).toLocaleString()}</dd>
                <dt>Max CPM bid</dt>
                <dd>${form.bid}</dd>
                <dt>Payment</dt>
                <dd>{form.payment === 'usdc' ? 'USDC treasury wallet' : 'Visa ····4242'}</dd>
              </dl>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '14px',
                  borderRadius: 8,
                  background: 'var(--c-ok-soft)',
                  border: '1px solid rgba(21,128,61,.15)',
                  fontSize: 13.5,
                  color: 'var(--c-ok)',
                }}
              >
                <Icons.shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <span style={{ fontWeight: 540 }}>Escrow protection: </span>
                  Budget is held in escrow and only released to publishers after verified impressions.
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--c-line)' }}>
            <Button
              variant="ghost"
              onClick={() => {
                if (step > 0) setStep(s => s - 1);
                else router.push('/advertiser/campaigns');
              }}
            >
              {step > 0 ? (
                <>
                  <Icons.chevLeft size={14} /> Back
                </>
              ) : (
                'Cancel'
              )}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (canContinue) setStep(s => s + 1);
                else router.push('/advertiser/campaigns');
              }}
            >
              {isLast ? (
                'Submit campaign'
              ) : (
                <>
                  Continue <Icons.arrow size={14} />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Live preview */}
        <div style={{ position: 'sticky', top: 72 }}>
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div className="t-eyebrow-n" style={{ marginBottom: 12 }}>Live preview</div>
            <div
              style={{
                background: 'var(--c-bg-3)',
                borderRadius: 8,
                border: '1px solid var(--c-line)',
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              {/* Mock ad unit */}
              <div
                style={{
                  padding: '10px 12px',
                  background: '#fff',
                  borderBottom: '1px solid var(--c-line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--c-acc)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>Ad</span>
              </div>
              <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    height: 80,
                    background: 'linear-gradient(135deg, var(--c-acc-soft), var(--c-bg-3))',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--c-acc)',
                    fontSize: 13,
                    fontWeight: 530,
                  }}
                >
                  {form.name || 'Your ad here'}
                </div>
                <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--c-fg-4)' }}>
                  {FORMATS.find(f => f.id === form.format)?.size} · {form.format.toUpperCase()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Est. impressions / day', v: '14k – 22k' },
                { label: 'Est. CTR', v: '1.4% – 2.1%' },
                { label: 'Est. CPC', v: '$0.14 – $0.26' },
                { label: 'Budget burn rate', v: '~$' + Math.round(Number(form.budget) / 30) + '/day' },
              ].map(m => (
                <div
                  key={m.label}
                  style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}
                >
                  <span className="muted">{m.label}</span>
                  <span style={{ fontWeight: 520 }}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--c-bg-2)',
              border: '1px solid var(--c-line)',
              fontSize: 12.5,
              color: 'var(--c-fg-4)',
              lineHeight: 1.5,
            }}
          >
            Campaigns go through a short review (typically under 2 hours) before going live.
          </div>
        </div>
      </div>
    </>
  );
}
