'use client';
import React, { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function pts(data: {x:number;v:number}[], width: number, height: number, pad = 4): string {
  if (!data.length) return '';
  const xs = data.map(d => d.x);
  const vs = data.map(d => d.v);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minV = Math.min(...vs), maxV = Math.max(...vs);
  const rx = maxX === minX ? 1 : maxX - minX;
  const rv = maxV === minV ? 1 : maxV - minV;
  return data
    .map(d => {
      const px = pad + ((d.x - minX) / rx) * (width - pad * 2);
      const py = height - pad - ((d.v - minV) / rv) * (height - pad * 2);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(' ');
}

function ptsArea(data: {x:number;v:number}[], width: number, height: number, pad = 4): string {
  if (!data.length) return '';
  const xs = data.map(d => d.x);
  const vs = data.map(d => d.v);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minV = Math.min(...vs), maxV = Math.max(...vs);
  const rx = maxX === minX ? 1 : maxX - minX;
  const rv = maxV === minV ? 1 : maxV - minV;
  const ptArr = data.map(d => {
    const px = pad + ((d.x - minX) / rx) * (width - pad * 2);
    const py = height - pad - ((d.v - minV) / rv) * (height - pad * 2);
    return { px, py };
  });
  const linePts = ptArr.map(p => `${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ');
  const first = ptArr[0], last = ptArr[ptArr.length - 1];
  return `${linePts} ${last.px.toFixed(1)},${(height - pad).toFixed(1)} ${first.px.toFixed(1)},${(height - pad).toFixed(1)}`;
}

// ---------------------------------------------------------------------------
// AreaChart
// ---------------------------------------------------------------------------

export interface AreaChartPoint { x: number; v: number }

export function AreaChart({
  data,
  height = 180,
  color = 'var(--c-acc)',
  label,
  compare,
  className = '',
}: {
  data: AreaChartPoint[];
  height?: number;
  color?: string;
  label?: string;
  compare?: AreaChartPoint[];
  className?: string;
}) {
  const id = useMemo(() => `ag-${Math.random().toString(36).slice(2)}`, []);
  return (
    <div className={className} style={{ width: '100%', position: 'relative' }}>
      {label && <div className="t-xs muted" style={{ marginBottom: 8 }}>{label}</div>}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 600 ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {data.length > 1 && (
          <>
            <polygon
              points={ptsArea(data, 600, height)}
              fill={`url(#${id})`}
              strokeWidth={0}
            />
            <polyline
              points={pts(data, 600, height)}
              fill="none"
              stroke={color}
              strokeWidth={1.75}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}
        {compare && compare.length > 1 && (
          <polyline
            points={pts(compare, 600, height)}
            fill="none"
            stroke="var(--c-line-3)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BarChart
// ---------------------------------------------------------------------------

export function BarChart({
  data,
  height = 160,
  color = 'var(--c-acc)',
  className = '',
}: {
  data: { label: string; v: number }[];
  height?: number;
  color?: string;
  className?: string;
}) {
  const max = Math.max(...data.map(d => d.v), 1);
  const barW = Math.max(4, Math.floor(560 / data.length) - 6);
  return (
    <div className={className} style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height + 24}
        viewBox={`0 0 600 ${height + 24}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {data.map((d, i) => {
          const x = 20 + i * (560 / data.length);
          const barH = Math.max(2, (d.v / max) * (height - 10));
          const y = 8 + (height - 10) - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={3}
                fill={color}
                opacity={0.85}
              />
              {data.length <= 12 && (
                <text
                  x={x + barW / 2}
                  y={height + 20}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--c-fg-4)"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Donut
// ---------------------------------------------------------------------------

export function Donut({
  data,
  size = 120,
  className = '',
}: {
  data: { label: string; v: number; color?: string }[];
  size?: number;
  className?: string;
}) {
  const COLORS = ['var(--c-acc)', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];
  const total = data.reduce((s, d) => s + d.v, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10, strokeW = 16;
  let offset = 0;

  const slices = data.map((d, i) => {
    const pct = d.v / total;
    const slice = { pct, offset, color: d.color || COLORS[i % COLORS.length], label: d.label };
    offset += pct;
    return slice;
  });

  const circumference = 2 * Math.PI * r;

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--c-line)"
          strokeWidth={strokeW}
        />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${s.pct * circumference} ${circumference}`}
            strokeDashoffset={-s.offset * circumference}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--c-fg-3)' }}>{s.label}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 520, color: 'var(--c-fg)', paddingLeft: 8 }}>
              {(s.pct * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GeoMap — simplified world-ish map placeholder
// ---------------------------------------------------------------------------

export function GeoMap({
  data,
  height = 160,
  className = '',
}: {
  data?: { country: string; v: number }[];
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        height,
        background: 'var(--c-bg-3)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--c-line)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Simplified SVG world silhouette */}
      <svg
        width="100%"
        height={height}
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0.18, position: 'absolute', inset: 0 }}
      >
        {/* rough landmass blobs */}
        <ellipse cx="200" cy="180" rx="160" ry="80" fill="var(--c-fg)" />
        <ellipse cx="420" cy="160" rx="120" ry="70" fill="var(--c-fg)" />
        <ellipse cx="560" cy="200" rx="80" ry="60" fill="var(--c-fg)" />
        <ellipse cx="680" cy="180" rx="80" ry="55" fill="var(--c-fg)" />
        <ellipse cx="310" cy="280" rx="60" ry="40" fill="var(--c-fg)" />
        <ellipse cx="590" cy="300" rx="50" ry="40" fill="var(--c-fg)" />
      </svg>
      {/* Hotspots */}
      {data &&
        [
          { cx: 200, cy: 160 },
          { cx: 430, cy: 150 },
          { cx: 560, cy: 190 },
          { cx: 680, cy: 170 },
          { cx: 640, cy: 220 },
        ].map((pos, i) =>
          data[i] ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(pos.cx / 800) * 100}%`,
                top: `${(pos.cy / 400) * 100}%`,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--c-acc)',
                opacity: 0.7 + (data[i].v / (data[0]?.v || 1)) * 0.3,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ) : null
        )}
      <span className="t-xs muted" style={{ position: 'relative', zIndex: 1 }}>
        Geographic distribution
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export function Funnel({
  stages,
  className = '',
}: {
  stages: { label: string; v: number; pct?: number }[];
  className?: string;
}) {
  const max = Math.max(...stages.map(s => s.v), 1);
  const COLORS = ['var(--c-acc)', '#7c3aed', '#059669', '#d97706'];
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {stages.map((s, i) => {
        const w = (s.v / max) * 100;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span style={{ color: 'var(--c-fg-3)' }}>{s.label}</span>
              <span style={{ fontWeight: 520 }}>
                {s.v.toLocaleString()}
                {s.pct !== undefined && (
                  <span className="muted" style={{ fontWeight: 400, marginLeft: 6 }}>
                    {s.pct}%
                  </span>
                )}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: 'var(--c-bg-3)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${w}%`,
                  background: COLORS[i % COLORS.length],
                  borderRadius: 4,
                  transition: 'width .4s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
