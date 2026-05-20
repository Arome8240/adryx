'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Brand, Avatar, Icons, Button } from '@/components/ui';

type NavItem = { route: string; label: string; ico: string; badge?: number };
type Account = { name: string; short: string; role: string; color?: string };

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export function Sidebar({
  section,
  items,
  account,
}: {
  section: 'advertiser' | 'publisher';
  items: NavItem[];
  account: Account;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="app-side">
      {/* Brand */}
      <div style={{ padding: '4px 2px 12px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Brand />
        </Link>
      </div>

      {/* Workspace switcher */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid var(--c-line-2)',
          background: '#fff',
          cursor: 'pointer',
          marginBottom: 8,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: account.color || 'var(--c-fg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {account.short}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 540,
              color: 'var(--c-fg)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {account.name}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--c-fg-4)' }}>{account.role}</div>
        </div>
        <Icons.chevDown size={14} style={{ color: 'var(--c-fg-4)', flexShrink: 0 }} />
      </button>

      {/* Section switcher */}
      <div
        style={{
          display: 'flex',
          background: 'var(--c-bg-3)',
          borderRadius: 8,
          padding: 3,
          gap: 2,
          marginBottom: 14,
        }}
      >
        {(['advertiser', 'publisher'] as const).map(s => (
          <button
            key={s}
            onClick={() => router.push(`/${s}`)}
            style={{
              flex: 1,
              border: 0,
              borderRadius: 6,
              padding: '5px 0',
              fontSize: 12.5,
              fontWeight: 510,
              cursor: 'pointer',
              transition: 'all .12s',
              background: section === s ? '#fff' : 'transparent',
              color: section === s ? 'var(--c-fg)' : 'var(--c-fg-3)',
              boxShadow: section === s ? 'var(--sh-2)' : 'none',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Workspace nav */}
      <div className="t-eyebrow-n" style={{ padding: '4px 10px', marginBottom: 4 }}>
        Workspace
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map(item => {
          const isActive = pathname === item.route;
          const Icon = getIcon(item.ico);
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`nav-item${isActive ? ' is-active' : ''}`}
            >
              <span className="nav-ico">
                <Icon size={15} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  style={{
                    height: 18,
                    minWidth: 18,
                    padding: '0 5px',
                    borderRadius: 9,
                    background: 'var(--c-acc-soft)',
                    color: 'var(--c-acc-ink)',
                    fontSize: 11,
                    fontWeight: 560,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom support section */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div className="t-eyebrow-n" style={{ padding: '4px 10px', marginBottom: 4 }}>
          Support
        </div>
        <Link href="/docs" className="nav-item">
          <span className="nav-ico">
            <Icons.doc size={15} />
          </span>
          Documentation
        </Link>
        <Link href="/contact" className="nav-item">
          <span className="nav-ico">
            <Icons.inbox size={15} />
          </span>
          Help center
        </Link>
        {/* Refer card */}
        <div
          style={{
            marginTop: 10,
            padding: '12px 12px',
            background: 'var(--c-acc-soft)',
            borderRadius: 8,
            border: '1px solid rgba(37,99,235,.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icons.zap size={14} style={{ color: 'var(--c-acc)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 560, color: 'var(--c-acc-ink)', marginBottom: 4 }}>
                Refer &amp; earn
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-acc-ink)', opacity: 0.7, lineHeight: 1.45 }}>
                Get 5% of every dollar your referrals spend for 12 months.
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------

export function Topbar({
  title,
  crumb,
  actions,
  search = true,
}: {
  title?: string;
  crumb?: string[];
  actions?: React.ReactNode;
  search?: boolean;
}) {
  return (
    <header className="app-topbar">
      {/* Left: breadcrumb / title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {crumb && crumb.length > 0 && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {crumb.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <Icons.chev
                    size={12}
                    style={{ color: 'var(--c-fg-4)', flexShrink: 0 }}
                  />
                )}
                <span
                  style={{
                    fontSize: 13.5,
                    color: i === crumb.length - 1 ? 'var(--c-fg)' : 'var(--c-fg-4)',
                    fontWeight: i === crumb.length - 1 ? 530 : 400,
                  }}
                >
                  {c}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        {title && (
          <span style={{ fontSize: 14, fontWeight: 540, color: 'var(--c-fg)' }}>{title}</span>
        )}
      </div>

      {/* Right: search + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {search && (
          <div
            className="input-group"
            style={{ width: 280, gap: 6 }}
          >
            <span className="addon">
              <Icons.search size={14} />
            </span>
            <input
              className="input"
              placeholder="Search…"
              style={{ fontSize: 13.5 }}
            />
            <kbd className="kbd">⌘K</kbd>
          </div>
        )}
        <button className="btn btn-ghost btn-icon" aria-label="Notifications">
          <Icons.bell size={16} />
        </button>
        <button className="btn btn-ghost btn-icon" aria-label="Settings">
          <Icons.settings size={16} />
        </button>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {actions}
          </div>
        )}
        <Avatar initials="MV" size="sm" />
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Icon resolver
// ---------------------------------------------------------------------------

function getIcon(ico: string): (props: any) => React.ReactElement {
  const map: Record<string, (props: any) => React.ReactElement> = {
    home: Icons.home,
    campaign: Icons.campaign,
    chart: Icons.chart,
    audience: Icons.audience,
    layers: Icons.layers,
    layers2: Icons.layers,
    card: Icons.card,
    settings: Icons.settings,
    globe: Icons.globe,
    wallet: Icons.wallet,
  };
  return map[ico] || Icons.home;
}
