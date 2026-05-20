'use client';
import React, { useState } from 'react';
import { Button, Badge, Modal, Field, Input, Select, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';

const PAYOUTS = [
  { id: 'pay_281', period: 'May 1–15, 2026', amount: 8420.10, status: 'settled', date: 'May 18, 2026', hash: '0x4f2a...9c1e' },
  { id: 'pay_264', period: 'Apr 16–30, 2026', amount: 7140.80, status: 'settled', date: 'May 3, 2026', hash: '0x8b3c...2d4f' },
  { id: 'pay_248', period: 'Apr 1–15, 2026', amount: 6820.30, status: 'settled', date: 'Apr 18, 2026', hash: '0x1e9d...7a2b' },
  { id: 'pay_231', period: 'Mar 16–31, 2026', amount: 6210.40, status: 'settled', date: 'Apr 3, 2026', hash: '0x5a2c...3f9d' },
  { id: 'pay_214', period: 'Mar 1–15, 2026', amount: 5840.90, status: 'settled', date: 'Mar 19, 2026', hash: '0x6c7e...3f1a' },
];

const NEXT_PAYOUT = {
  period: 'May 16–31, 2026',
  estimated: 4280.40,
  settles: 'Jun 3, 2026',
};

type WithdrawStep = 'amount' | 'wallet' | 'confirm' | 'done';

export default function PayoutsPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [step, setStep] = useState<WithdrawStep>('amount');
  const [amount, setAmount] = useState('4280.40');

  function handleClose() {
    setWithdrawOpen(false);
    setStep('amount');
  }

  function handleNext() {
    if (step === 'amount') setStep('wallet');
    else if (step === 'wallet') setStep('confirm');
    else if (step === 'confirm') setStep('done');
    else handleClose();
  }

  const stepTitles: Record<WithdrawStep, string> = {
    amount: 'Withdraw earnings',
    wallet: 'Select destination',
    confirm: 'Confirm withdrawal',
    done: 'Withdrawal initiated',
  };

  return (
    <>
      <Topbar
        crumb={['Tessera Wire', 'Payouts']}
        actions={
          <Button variant="primary" size="sm" onClick={() => setWithdrawOpen(true)}>
            <Icons.wallet size={14} /> Withdraw earnings
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="t-h2" style={{ marginBottom: 4 }}>Payouts</h1>
          <p className="muted" style={{ fontSize: 14 }}>All earnings are settled in USDC on Base network.</p>
        </div>

        {/* Summary cards */}
        <div className="grid-3">
          <div className="stat">
            <div className="stat-label">Total earned</div>
            <div className="stat-value">$34,432.50</div>
            <div className="muted" style={{ fontSize: 12 }}>All time</div>
          </div>
          <div className="stat">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{NEXT_PAYOUT.estimated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' })}</div>
            <div className="muted" style={{ fontSize: 12 }}>Settles {NEXT_PAYOUT.settles}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Payout wallet</div>
            <div style={{ fontSize: 15, fontWeight: 540, marginTop: 4, fontFamily: 'var(--f-mono)' }}>0x8f4a...2c91</div>
            <div className="muted" style={{ fontSize: 12 }}>Base network</div>
          </div>
        </div>

        {/* Upcoming payout */}
        <div
          className="card card-pad"
          style={{
            background: 'linear-gradient(135deg, var(--c-fg) 0%, #1e3a8a 100%)',
            border: 'none',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>Upcoming payout · {NEXT_PAYOUT.period}</div>
              <div style={{ fontSize: 32, fontWeight: 560, letterSpacing: '-0.03em' }}>
                ${NEXT_PAYOUT.estimated.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
                Estimated · settles {NEXT_PAYOUT.settles}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWithdrawOpen(true)}
              style={{ background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}
            >
              <Icons.wallet size={14} /> Withdraw now
            </Button>
          </div>
        </div>

        {/* Payout history */}
        <div>
          <h3 className="t-h4" style={{ marginBottom: 14 }}>Payout history</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Settled</th>
                  <th>Status</th>
                  <th>Tx hash</th>
                </tr>
              </thead>
              <tbody>
                {PAYOUTS.map(p => (
                  <tr key={p.id}>
                    <td className="t-mono" style={{ fontSize: 12.5, color: 'var(--c-fg-4)' }}>{p.id}</td>
                    <td style={{ fontSize: 13.5 }}>{p.period}</td>
                    <td style={{ fontWeight: 530 }}>${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: 'var(--c-fg-3)', fontSize: 13 }}>{p.date}</td>
                    <td>
                      <Badge tone="ok" dot>Settled</Badge>
                    </td>
                    <td className="t-mono" style={{ fontSize: 12, color: 'var(--c-fg-4)' }}>
                      <a href="#" className="link">{p.hash}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdraw modal */}
      <Modal
        open={withdrawOpen}
        onClose={handleClose}
        title={stepTitles[step]}
        footer={
          step === 'done' ? (
            <Button variant="primary" onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" onClick={handleNext}>
                {step === 'confirm' ? 'Confirm withdrawal' : 'Continue'}
              </Button>
            </>
          )
        }
      >
        {step === 'amount' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Amount (USDC)">
              <div className="input-group">
                <span className="addon">$</span>
                <input
                  className="input"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min={10}
                />
                <span className="addon">USDC</span>
              </div>
            </Field>
            <button
              className="btn btn-ghost btn-sm"
              style={{ alignSelf: 'flex-start', fontSize: 12.5 }}
              onClick={() => setAmount('4280.40')}
            >
              Use max ($4,280.40)
            </button>
          </div>
        )}
        {step === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Destination wallet">
              <Select defaultValue="0x8f4a...2c91">
                <option value="0x8f4a...2c91">0x8f4a...2c91 · Base (primary)</option>
                <option value="add">+ Add new wallet</option>
              </Select>
            </Field>
            <p style={{ fontSize: 13, color: 'var(--c-fg-3)', lineHeight: 1.5 }}>
              Funds arrive within ~15 seconds on Base network after confirmation.
            </p>
          </div>
        )}
        {step === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Amount', v: `$${Number(amount).toFixed(2)} USDC` },
              { label: 'Destination', v: '0x8f4a...2c91 (Base)' },
              { label: 'Network fee', v: '~$0.02' },
              { label: 'You receive', v: `$${(Number(amount) - 0.02).toFixed(2)} USDC` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="muted">{r.label}</span>
                <span style={{ fontWeight: 520 }}>{r.v}</span>
              </div>
            ))}
          </div>
        )}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--c-ok-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Icons.check size={24} style={{ color: 'var(--c-ok)' }} />
            </div>
            <div style={{ fontWeight: 560, fontSize: 16, marginBottom: 8 }}>Withdrawal initiated</div>
            <div style={{ fontSize: 13.5, color: 'var(--c-fg-3)', lineHeight: 1.5 }}>
              ${Number(amount).toFixed(2)} USDC will arrive in your wallet within 15 seconds.
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
