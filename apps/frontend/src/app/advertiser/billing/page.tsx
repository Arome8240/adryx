'use client';
import React, { useState } from 'react';
import { Button, Badge, Modal, Field, Input, Select, Icons } from '@/components/ui';
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
  const [depositAmt, setDepositAmt] = useState('1000');

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
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="outline" size="sm" onClick={() => setDepositOpen(true)}
              style={{ background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}>
              <Icons.plus size={14} /> Deposit USDC
            </Button>
            <Button variant="ghost" size="sm"
              style={{ color: 'rgba(255,255,255,.7)' }}>
              <Icons.refresh size={14} /> Auto-fund settings
            </Button>
          </div>
        </div>

        {/* Payment methods */}
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="t-h4">Payment methods</h3>
            <Button variant="outline" size="sm">
              <Icons.plus size={14} /> Add method
            </Button>
          </div>
          <div style={{ padding: '0' }}>
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
                    {pm.primary && (
                      <Badge tone="acc">Primary</Badge>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--c-fg-4)', marginTop: 2 }}>{pm.sub}</div>
                </div>
                <button className="btn btn-ghost btn-sm">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="t-h4" style={{ marginBottom: 14 }}>Transaction history</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Tx hash</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map(tx => (
                  <tr key={tx.id}>
                    <td className="t-mono" style={{ fontSize: 12.5, color: 'var(--c-fg-4)' }}>{tx.id}</td>
                    <td style={{ fontSize: 13.5 }}>{tx.desc}</td>
                    <td style={{ fontSize: 13, color: 'var(--c-fg-3)' }}>{tx.date}</td>
                    <td
                      style={{
                        fontSize: 13.5,
                        fontWeight: 530,
                        color: tx.amount > 0 ? 'var(--c-ok)' : tx.type === 'spend' ? 'var(--c-fg)' : 'var(--c-ok)',
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

      {/* Deposit modal */}
      <Modal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        title="Deposit USDC"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDepositOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setDepositOpen(false)}>
              Deposit ${Number(depositAmt).toLocaleString()} USDC
            </Button>
          </>
        }
      >
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
      </Modal>
    </>
  );
}
