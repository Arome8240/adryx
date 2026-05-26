'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Field, Input, Select, Icons } from '@/components/ui';
import { Sparkline } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const STEPS = ['Basics', 'Targeting', 'Creative', 'Budget', 'Review'];

const OBJECTIVES = [
  { id: 'awareness', label: 'Brand Awareness', desc: 'Maximize reach and visibility', icon: '📡' },
  { id: 'traffic', label: 'Traffic', desc: 'Drive visitors to your site', icon: '🔗' },
  { id: 'conversions', label: 'Conversions', desc: 'Optimize for actions and sign-ups', icon: '🎯' },
];

const AUDIENCES = [
  { name: 'Crypto natives', reach: '4.2M reach' },
  { name: 'DeFi users', reach: '2.1M reach' },
  { name: 'NFT collectors', reach: '1.4M reach' },
  { name: 'ENS holders', reach: '2.8M reach' },
  { name: 'Farcaster active', reach: '540K reach' },
  { name: 'DevTools readers', reach: '1.2M reach' },
  { name: 'Climate-tech', reach: '420K reach' },
  { name: 'L2 power users', reach: '860K reach' },
];

const GEO_REGIONS = [
  { id: 'global', label: 'Global', flag: '🌐' },
  { id: 'na', label: 'North America', flag: '🌎' },
  { id: 'eu', label: 'Europe', flag: '🌍' },
  { id: 'apac', label: 'Asia-Pacific', flag: '🌏' },
  { id: 'latam', label: 'LatAm', flag: '🌎' },
  { id: 'mena', label: 'MENA', flag: '🌍' },
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
  const [geoRegions, setGeoRegions] = useState<string[]>(['global']);
  const [form, setForm] = useState({
    name: '',
    objective: 'traffic',
    category: 'crypto',
    schedule: 'asap',
    audiences: [] as string[],
    format: 'mpu',
    budget: '2000',
    bid: '3.50',
    dailyCap: '',
    startDate: '',
    endDate: '',
    spendCap: 'daily',
    payment: 'usdc',
    landingUrl: '',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleAudience = (a: string) =>
    set('audiences', form.audiences.includes(a) ? form.audiences.filter((x: string) => x !== a) : [...form.audiences, a]);

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
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={s}
                onClick={() => done && setStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 10px', borderRadius: 7, border: 0,
                  background: active ? 'var(--c-acc-soft)' : 'transparent',
                  cursor: done ? 'pointer' : 'default',
                  textAlign: 'left',
                  marginBottom: 2,
                }}
              >
                {/* Circle */}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--c-ok-soft)' : active ? 'var(--c-acc)' : 'var(--c-bg-3)',
                  border: done ? 'none' : active ? 'none' : '1px solid var(--c-line-2)',
                  fontSize: 11, fontWeight: 600,
                  color: done ? 'var(--c-ok)' : active ? '#fff' : 'var(--c-fg-4)',
                }}>
                  {done ? <Icons.check size={12} /> : i + 1}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 560 : 430,
                  color: active ? 'var(--c-acc-ink)' : done ? 'var(--c-fg-3)' : 'var(--c-fg-4)',
                }}>
                  {s}
                </span>
              </button>
            );
          })}
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
                  onChange={(e: any) => set('name', e.target.value)}
                  placeholder="e.g. Q3 Product Launch"
                />
              </Field>
              <Field label="Category">
                <Select value={form.category} onChange={(e: any) => set('category', e.target.value)}>
                  <option value="crypto">Crypto / DeFi</option>
                  <option value="nft">NFT &amp; Digital Art</option>
                  <option value="developer">Developer Tools</option>
                  <option value="news">News &amp; Media</option>
                  <option value="other">Other</option>
                </Select>
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
                        background: form.objective === o.id ? 'var(--c-acc-soft)' : 'var(--c-bg)',
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 8 }}>
                  {GEO_REGIONS.map(g => {
                    const on = geoRegions.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGeoRegions(prev => prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                        style={{
                          padding: '8px 10px', borderRadius: 8, border: '1px solid',
                          borderColor: on ? 'var(--c-acc)' : 'var(--c-line)',
                          background: on ? 'var(--c-acc-soft)' : 'transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{g.flag}</span>
                        <span style={{ fontSize: 12.5, fontWeight: on ? 550 : 430, color: on ? 'var(--c-acc-ink)' : 'var(--c-fg-3)' }}>{g.label}</span>
                        {on && <Icons.check size={11} style={{ marginLeft: 'auto', color: 'var(--c-acc)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>Audience cohorts</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {AUDIENCES.map(a => {
                    const on = form.audiences.includes(a.name);
                    return (
                      <button key={a.name} onClick={() => toggleAudience(a.name)} style={{
                        padding: '10px 12px', borderRadius: 8, border: '1px solid',
                        borderColor: on ? 'var(--c-acc)' : 'var(--c-line)',
                        background: on ? 'var(--c-acc-soft)' : 'var(--c-bg)',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all .12s',
                      }}>
                        <div style={{ fontWeight: on ? 560 : 500, fontSize: 13, color: on ? 'var(--c-acc-ink)' : 'var(--c-fg)', marginBottom: 3 }}>{a.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--c-fg-4)' }}>{a.reach}</div>
                      </button>
                    );
                  })}
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
              {/* Upload zone */}
              <div className="empty" style={{ border: '2px dashed var(--c-line-2)', borderRadius: 10, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                <Icons.download size={28} style={{ color: 'var(--c-fg-4)' }} />
                <div style={{ fontWeight: 530, fontSize: 14 }}>Drop your creative here or browse</div>
                <div className="muted" style={{ fontSize: 12.5 }}>PNG · JPG · GIF · WebP · max 2 MB</div>
                <Button variant="outline" size="sm">Browse files</Button>
              </div>
              {/* Format selector */}
              <div className="t-eyebrow-n" style={{ marginBottom: 10 }}>Ad format</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                {FORMATS.map(f => {
                  const active = form.format === f.id;
                  return (
                    <button key={f.id} onClick={() => set('format', f.id)} style={{
                      padding: '12px 14px', borderRadius: 8, border: '1px solid',
                      borderColor: active ? 'var(--c-acc)' : 'var(--c-line)',
                      background: active ? 'var(--c-acc-soft)' : 'var(--c-bg)',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ fontWeight: active ? 560 : 500, fontSize: 13.5, color: active ? 'var(--c-acc-ink)' : 'var(--c-fg)', marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--c-fg-4)', fontFamily: 'var(--f-mono)' }}>{f.size}</div>
                    </button>
                  );
                })}
              </div>
              <Field label="Landing URL" required>
                <Input
                  value={form.landingUrl}
                  onChange={(e: any) => set('landingUrl', e.target.value)}
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
                      onChange={(e: any) => set('budget', e.target.value)}
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
                      onChange={(e: any) => set('bid', e.target.value)}
                      step={0.1}
                    />
                  </div>
                </Field>
              </div>
              <Field label="Daily spend cap">
                <div className="input-group">
                  <span className="addon">$</span>
                  <input className="input" type="number" value={form.dailyCap} placeholder="e.g. 100" onChange={(e: any) => set('dailyCap', e.target.value)} />
                  <span className="addon">/ day</span>
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Start date">
                  <input className="input" type="date" defaultValue="2026-06-01" onChange={(e: any) => set('startDate', e.target.value)} />
                </Field>
                <Field label="End date">
                  <input className="input" type="date" defaultValue="2026-06-30" onChange={(e: any) => set('endDate', e.target.value)} />
                </Field>
              </div>
              {/* Projected reach estimate */}
              {form.budget && (
                <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--c-bg-2)', border: '1px solid var(--c-line)', marginTop: 4 }}>
                  <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginBottom: 4 }}>Estimated reach</div>
                  <div style={{ fontSize: 15, fontWeight: 540 }}>
                    ~{Math.round(Number(form.budget) / 3.2 / 1000)}K – {Math.round(Number(form.budget) / 2.8 / 1000)}K impressions
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                    Based on avg eCPM $3.00 · {form.budget ? Math.ceil(Number(form.budget) / (form.dailyCap ? Number(form.dailyCap) : Number(form.budget))) : 30} days
                  </div>
                </div>
              )}
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
                      background: form.spendCap === opt.id ? 'var(--c-acc-soft)' : 'var(--c-bg)',
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
                      background: form.payment === opt.id ? 'var(--c-acc-soft)' : 'var(--c-bg)',
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
              <dl className="dl">
                <dt>Campaign name</dt><dd>{form.name || '—'}</dd>
                <dt>Objective</dt><dd>{OBJECTIVES.find(o => o.id === form.objective)?.label || '—'}</dd>
                <dt>Category</dt><dd>{form.category === 'crypto' ? 'Crypto / DeFi' : form.category === 'nft' ? 'NFT & Digital Art' : form.category === 'developer' ? 'Developer Tools' : form.category === 'news' ? 'News & Media' : 'Other'}</dd>
                <dt>Audiences</dt><dd>{form.audiences.length > 0 ? form.audiences.join(', ') : 'All audiences'}</dd>
                <dt>Geographies</dt><dd>{geoRegions.join(', ') || 'Global'}</dd>
                <dt>Ad format</dt><dd>{FORMATS.find(f => f.id === form.format)?.label || '—'}</dd>
                <dt>Total budget</dt><dd>${Number(form.budget).toLocaleString()} USDC</dd>
                <dt>Daily cap</dt><dd>{form.dailyCap ? `$${form.dailyCap}/day` : 'No cap'}</dd>
                <dt>Landing URL</dt><dd className="t-mono" style={{ fontSize: 13 }}>{form.landingUrl || '—'}</dd>
              </dl>
              {/* Escrow notice */}
              <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 8, background: 'var(--c-acc-soft)', border: '1px solid rgba(37,99,235,.15)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Icons.shield size={16} style={{ color: 'var(--c-acc)', flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, color: 'var(--c-acc-ink)', lineHeight: 1.5 }}>
                  <strong>On-chain escrow.</strong> Funds will be held in a smart contract and released to publishers per verified impression. Unspent funds are returned automatically.
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
                  background: 'var(--c-bg)',
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
            {/* Projected daily spend sparkline */}
            {form.budget && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--c-line)' }}>
                <div style={{ fontSize: 12.5, color: 'var(--c-fg-4)', marginBottom: 8 }}>Projected daily spend</div>
                <Sparkline
                  data={Array.from({ length: 30 }, (_: any, i: number) => Math.min(Number(form.dailyCap) || Number(form.budget) / 30, (Number(form.budget) / 30) * (0.8 + Math.sin(i / 4) * 0.2)))}
                  width={240} height={48} color="var(--c-acc)"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-fg-4)', marginTop: 4 }}>
                  <span>Day 1</span>
                  <span>Day 30</span>
                </div>
              </div>
            )}
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
