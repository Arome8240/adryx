'use client';
import React, { useState } from 'react';
import { Button, Badge, Modal, Field, Input, Select, Icons } from '@/components/ui';
import { Topbar } from '@/components/layouts/AppShell';
import { fmtNum } from '@/lib/mock-data';

const AD_UNITS = [
  { id: 'au_01', site: 'tesserawire.com', name: 'Homepage leaderboard', format: 'Leaderboard', size: '728×90', imps: 1240000, ecpm: 3.12, rev: 3870.00, status: 'active' },
  { id: 'au_02', site: 'tesserawire.com', name: 'Article MPU right', format: 'MPU', size: '300×250', imps: 840000, ecpm: 3.40, rev: 2856.00, status: 'active' },
  { id: 'au_03', site: 'tesserawire.com', name: 'In-content native', format: 'Native', size: 'Flexible', imps: 420000, ecpm: 2.88, rev: 1209.60, status: 'active' },
  { id: 'au_04', site: 'devbrief.io', name: 'Top banner', format: 'Leaderboard', size: '728×90', imps: 620000, ecpm: 2.46, rev: 1525.20, status: 'active' },
  { id: 'au_05', site: 'devbrief.io', name: 'Sidebar skyscraper', format: 'Skyscraper', size: '160×600', imps: 380000, ecpm: 2.10, rev: 798.00, status: 'active' },
  { id: 'au_06', site: 'forecast.blog', name: 'Post footer', format: 'MPU', size: '300×250', imps: 310000, ecpm: 2.28, rev: 706.80, status: 'active' },
  { id: 'au_07', site: 'climate.report', name: 'Article banner', format: 'Leaderboard', size: '728×90', imps: 140000, ecpm: 1.98, rev: 277.20, status: 'warning' },
  { id: 'au_08', site: 'tesserawire.com', name: 'Sticky footer', format: 'Banner', size: '320×50', imps: 0, ecpm: 0, rev: 0, status: 'paused' },
];

const SNIPPET = `<script async src="https://cdn.adryx.io/tag.js"
  data-unit="{{UNIT_ID}}">
</script>`;

export default function AdUnitsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [snippetUnit, setSnippetUnit] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function copySnippet(unitId: string) {
    const code = SNIPPET.replace('{{UNIT_ID}}', unitId);
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <Topbar
        crumb={['Tessera Wire', 'Ad units']}
        actions={
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Icons.plus size={14} /> New ad unit
          </Button>
        }
      />
      <div className="app-body page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="t-h2" style={{ marginBottom: 4 }}>Ad units</h1>
          <p className="muted" style={{ fontSize: 14 }}>
            {AD_UNITS.length} units across {[...new Set(AD_UNITS.map(u => u.site))].length} sites
          </p>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Unit name</th>
                <th>Site</th>
                <th>Format</th>
                <th>Size</th>
                <th>Impressions</th>
                <th>eCPM</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {AD_UNITS.map(unit => (
                <tr key={unit.id}>
                  <td style={{ fontWeight: 530 }}>{unit.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--c-fg-3)' }}>{unit.site}</td>
                  <td>{unit.format}</td>
                  <td className="t-mono" style={{ fontSize: 12.5 }}>{unit.size}</td>
                  <td className="t-mono">{unit.imps > 0 ? fmtNum(unit.imps) : '—'}</td>
                  <td>{unit.ecpm > 0 ? `$${unit.ecpm}` : '—'}</td>
                  <td style={{ fontWeight: 520 }}>{unit.rev > 0 ? `$${unit.rev.toFixed(2)}` : '—'}</td>
                  <td>
                    <Badge tone={unit.status === 'active' ? 'ok' : unit.status === 'warning' ? 'warn' : 'neutral'} dot>
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ gap: 4, fontSize: 12 }}
                      onClick={() => setSnippetUnit(unit.id)}
                    >
                      <Icons.code size={12} /> Get tag
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create ad unit modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New ad unit"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setCreateOpen(false)}>Create unit</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Unit name">
            <Input placeholder="e.g. Homepage leaderboard" />
          </Field>
          <Field label="Site">
            <Select defaultValue="tesserawire.com">
              <option value="tesserawire.com">tesserawire.com</option>
              <option value="devbrief.io">devbrief.io</option>
              <option value="forecast.blog">forecast.blog</option>
              <option value="climate.report">climate.report</option>
            </Select>
          </Field>
          <Field label="Format">
            <Select defaultValue="Leaderboard">
              <option value="Leaderboard">Leaderboard (728×90)</option>
              <option value="MPU">MPU (300×250)</option>
              <option value="Skyscraper">Skyscraper (160×600)</option>
              <option value="Native">Native (flexible)</option>
              <option value="Banner">Mobile banner (320×50)</option>
            </Select>
          </Field>
        </div>
      </Modal>

      {/* Tag snippet modal */}
      <Modal
        open={!!snippetUnit}
        onClose={() => setSnippetUnit(null)}
        title="Ad unit tag"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSnippetUnit(null)}>Close</Button>
            <Button variant="primary" onClick={() => snippetUnit && copySnippet(snippetUnit)}>
              {copied ? <><Icons.check size={14} /> Copied!</> : <><Icons.copy size={14} /> Copy tag</>}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13.5, color: 'var(--c-fg-3)', lineHeight: 1.5 }}>
            Paste this tag before the closing <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12, background: 'var(--c-bg-3)', padding: '1px 4px', borderRadius: 3 }}>&lt;/body&gt;</code> tag on every page where you want ads to appear.
          </p>
          <pre
            style={{
              padding: '14px 16px',
              borderRadius: 8,
              background: 'var(--c-bg-3)',
              border: '1px solid var(--c-line)',
              fontFamily: 'var(--f-mono)',
              fontSize: 12.5,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: 0,
            }}
          >
            {SNIPPET.replace('{{UNIT_ID}}', snippetUnit || '')}
          </pre>
        </div>
      </Modal>
    </>
  );
}
