'use client';
import React, { useState } from 'react';
import { Button, Badge, Modal, Field, Input, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const TRANSACTIONS = [
  { id: 'tx_4821', type: 'deposit', desc: 'USDC deposit from wallet', amount: 5000, date: 'May 18, 2026', hash: '0x4f2a...9c1e', status: 'confirmed' },
  { id: 'tx_4818', type: 'spend', desc: 'Q2 — Anchorset Launch · daily', amount: -340.20, date: 'May 18, 2026', hash: '0x8b3c...2d4f', status: 'confirmed' },
  { id: 'tx_4812', type: 'spend', desc: 'Wallet Onboarding · NA · daily', amount: -210.80, date: 'May 17, 2026', hash: '0x1e9d...7a2b', status: 'confirmed' },
  { id: 'tx_4809', type: 'spend', desc: 'L2 Migration Push · daily', amount: -380.00, date: 'May 17, 2026', hash: '0x5a2c...3f9d', status: 'confirmed' },
  { id: 'tx_4801', type: 'refund', desc: 'DevTools Audience Test · escrow return', amount: 1500, date: 'May 16, 2026', hash: '0x6c7e...3f1a', status: 'pending' },
  { id: 'tx_4798', type: 'deposit', desc: 'USDC deposit from wallet', amount: 2000, date: 'May 14, 2026', hash: '0x9a1b...5e8c', status: 'confirmed' },
  { id: 'tx_4792', type: 'spend', desc: 'Spring Brand Awareness · final', amount: -430.00, date: 'May 12, 2026', hash: '0x3d5f...8b2e', status: 'confirmed' },
];

const PAYMENT_METHODS = [
  { id: 'pm_usdc', label: 'USDC Treasury', sub: '0x8f4a...2c91 · Base network', primary: true, icon: '🪙' },
  { id: 'pm_visa', label: 'Visa ····4242', sub: 'Expires 08/28', primary: false, icon: '💳' },
];

export default function BillingPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositStep, setDepositStep] = useState<'amount' | 'confirm' | 'done'>('amount');
  const [depositAmt, setDepositAmt] = useState('1000');
  const [txFilter, setTxFilter] = useState('all');
  const [alertBalance, setAlertBalance] = useState(true);
  const [autoFund, setAutoFund] = useState(false);

  const handleDepositClose = () => {
    setDepositOpen(false);
    setDepositStep('amount');
    setDepositAmt('1000');
  };

  const filteredTx = TRANSACTIONS.filter(tx => txFilter === 'all' || tx.type === txFilter);

  return (
    <>
      <Topbar
        crumb={['Forecast Labs', 'Billing']}
        actions={
          <Button variant="primary" size="sm" onClick={() => setDepositOpen(true)}>
            <Icons.plus size={14} /> Add funds
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="t-h2" style={{ marginBottom: 4 }}>Billing</h1>
          <p className="muted" style={{ fontSize: 14 }}>Manage treasury funds, payment methods, and transaction history.</p>
        </div>

        {/* Treasury wallet card */}
        <div
          className="card card-pad-lg"
          style={{
            background: 'linear-gradient(135deg, var(--c-fg) 0%, #1e293b 100%)',
            border: 'none',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 8 }}>Treasury balance</div>
              <div style={{ fontSize: 40, fontWeight: 560, letterSpacing: '-0.03em', marginBottom: 4 }}>
                $12,420.10
              </div>
              <div style={{ fontSize: 13.5, opacity: 0.7 }}>USDC · Base network</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 180 }}>
              {[
                { label: 'In escrow', v: '$8,240.60' },
                { label: 'Spent (30d)', v: '$24,140.80' },
                { label: 'Next auto-fund', v: 'May 25, 2026' },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ opacity: 0.6, fontSize: 13 }}>{m.label}</span>
                  <span style={{ fontWeight: 520, fontSize: 13 }}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly budget usage bar */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.15)' }}>
            <div style={{ fontSize: 12.5, opacity: .7, marginBottom: 6 }}>Monthly budget usage</div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,.15)', overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: '68%', borderRadius: 3, background: 'rgba(255,255,255,.7)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: .6 }}>
              <span>68% used · $24,140 of $35,000</span>
              <span>Burning ~$340/day</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDepositOpen(true)}
              style={{ background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}
            >
              <Icons.plus size={14} /> Deposit USDC
            </Button>
            <Button variant="ghost" size="sm" style={{ color: 'rgba(255,255,255,.7)' }}>
              <Icons.refresh size={14} /> Auto-fund settings
            </Button>
          </div>
        </div>

        {/* Budget alerts card */}
        <div className="card card-pad">
          <h3 className="t-h4" style={{ marginBottom: 16 }}>Budget alerts</h3>
          {[
            { id: 'alert1', label: 'Notify when balance drops below $1,000', sub: 'Email + in-app notification', state: alertBalance, set: setAlertBalance },
            { id: 'alert2', label: 'Auto-fund when balance < $500', sub: 'Add $2,000 USDC automatically', state: autoFund, set: setAutoFund },
          ].map(alert => (
            <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--c-line)' }}>
              <div>
                <div style={{ fontWeight: 520, fontSize: 14 }}>{alert.label}</div>
                <div style={{ fontSize: 13, color: 'var(--c-fg-4)', marginTop: 2 }}>{alert.sub}</div>
              </div>
              <label style={{ cursor: 'pointer', marginLeft: 16, flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={alert.state}
                  onChange={e => alert.set(e.target.checked)}
                  style={{ accentColor: 'var(--c-acc)', width: 16, height: 16 }}
                />
              </label>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="t-h4">Payment methods</h3>
            <Button variant="outline" size="sm">
              <Icons.plus size={14} /> Add method
            </Button>
          </div>
          <div>
            {PAYMENT_METHODS.map(pm => (
              <div
                key={pm.id}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderBottom: '1px solid var(--c-line)',
                }}
              >
                <span style={{ fontSize: 24 }}>{pm.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 530, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {pm.label}
                    {pm.primary && <Badge tone="acc">Primary</Badge>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--c-fg-4)', marginTop: 2 }}>{pm.sub}</div>
                </div>
                <button className="btn btn-ghost btn-sm">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices */}
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="t-h4">Invoices</h3>
          </div>
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: 'May 2026', amount: 24140.80, status: 'pending' },
                  { period: 'Apr 2026', amount: 18420.40, status: 'paid' },
                  { period: 'Mar 2026', amount: 15840.20, status: 'paid' },
                ].map(inv => (
                  <tr key={inv.period}>
                    <td>{inv.period}</td>
                    <td style={{ fontWeight: 520 }}>${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>
                      <Badge tone={inv.status === 'paid' ? 'ok' : 'warn'} dot>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}>
                        <Icons.download size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 className="t-h4">Transaction history</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'deposit', 'spend', 'refund'].map(f => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: txFilter === f ? 'var(--c-acc)' : 'var(--c-line)',
                    background: txFilter === f ? 'var(--c-acc-soft)' : 'transparent',
                    color: txFilter === f ? 'var(--c-acc-ink)' : 'var(--c-fg-3)',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th></th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Tx hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map(tx => (
                  <tr key={tx.id}>
                    <td className="t-mono" style={{ fontSize: 12.5, color: 'var(--c-fg-4)' }}>{tx.id}</td>
                    <td>
                      {tx.type === 'deposit' ? <Icons.plus size={14} style={{ color: 'var(--c-ok)' }} /> :
                       tx.type === 'refund' ? <Icons.refresh size={14} style={{ color: 'var(--c-acc)' }} /> :
                       <Icons.minus size={14} style={{ color: 'var(--c-fg-4)' }} />}
                    </td>
                    <td style={{ fontSize: 13.5 }}>{tx.desc}</td>
                    <td style={{ fontSize: 13, color: 'var(--c-fg-3)' }}>{tx.date}</td>
                    <td
                      style={{
                        fontSize: 13.5,
                        fontWeight: 530,
                        color: tx.amount > 0 ? 'var(--c-ok)' : 'var(--c-fg)',
                      }}
                    >
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td>
                      <Badge tone={tx.status === 'confirmed' ? 'ok' : 'warn'} dot>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="t-mono" style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>
                      <a href="#" className="link">{tx.hash}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deposit modal — 3-step */}
      <Modal
        open={depositOpen}
        onClose={handleDepositClose}
        title="Deposit USDC"
        footer={
          depositStep === 'amount' ? (
            <>
              <Button variant="ghost" onClick={handleDepositClose}>Cancel</Button>
              <Button variant="primary" onClick={() => setDepositStep('confirm')}>
                Continue
              </Button>
            </>
          ) : depositStep === 'confirm' ? (
            <>
              <Button variant="ghost" onClick={() => setDepositStep('amount')}>Back</Button>
              <Button variant="primary" onClick={() => setDepositStep('done')}>
                Confirm deposit
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleDepositClose}>Done</Button>
          )
        }
      >
        {depositStep === 'amount' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Amount (USDC)">
              <div className="input-group">
                <span className="addon">$</span>
                <input
                  className="input"
                  type="number"
                  value={depositAmt}
                  onChange={e => setDepositAmt(e.target.value)}
                  min={10}
                />
                <span className="addon">USDC</span>
              </div>
            </Field>
            <Field label="Source wallet">
              <Input value="0x8f4a...2c91 (Base)" readOnly />
            </Field>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: 'var(--c-bg-2)',
                border: '1px solid var(--c-line)',
                fontSize: 13,
                color: 'var(--c-fg-3)',
              }}
            >
              Funds will be available for campaigns immediately after on-chain confirmation (typically ~15 seconds on Base).
            </div>
          </div>
        )}

        {depositStep === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Amount', v: `$${Number(depositAmt).toFixed(2)} USDC` },
              { label: 'Source wallet', v: '0x8f4a...2c91 (Base)' },
              { label: 'Network fee', v: '~$0.02' },
              { label: 'You receive', v: `$${(Number(depositAmt) - 0.02).toFixed(2)} USDC` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="muted">{r.label}</span>
                <span style={{ fontWeight: 520 }}>{r.v}</span>
              </div>
            ))}
            <div style={{
              padding: '12px 14px', borderRadius: 8,
              background: 'var(--c-acc-soft)',
              border: '1px solid rgba(37,99,235,.12)',
              fontSize: 13, color: 'var(--c-acc-ink)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <Icons.shield size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              Funds held in escrow — released to publishers per verified impression.
            </div>
          </div>
        )}

        {depositStep === 'done' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--c-ok-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Icons.check size={24} style={{ color: 'var(--c-ok)' }} />
            </div>
            <div style={{ fontWeight: 560, fontSize: 16, marginBottom: 8 }}>Deposit initiated</div>
            <div style={{ fontSize: 13.5, color: 'var(--c-fg-3)', lineHeight: 1.5 }}>
              ${Number(depositAmt).toFixed(2)} USDC will be available within 15 seconds of on-chain confirmation.
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
