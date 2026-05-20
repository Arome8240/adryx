'use client'
import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react'

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function Svg({ size = 16, className = '', children, ...rest }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  )
}

const arrow       = (p: any) => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Svg>
const arrowUp     = (p: any) => <Svg {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></Svg>
const arrowDown   = (p: any) => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></Svg>
const arrowUR     = (p: any) => <Svg {...p}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></Svg>
const check       = (p: any) => <Svg {...p}><polyline points="20 6 9 17 4 12"/></Svg>
const plus        = (p: any) => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>
const minus       = (p: any) => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>
const x           = (p: any) => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>
const search      = (p: any) => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>
const bell        = (p: any) => <Svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Svg>
const user        = (p: any) => <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>
const settings    = (p: any) => <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>
const home        = (p: any) => <Svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>
const chart       = (p: any) => <Svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></Svg>
const campaign    = (p: any) => <Svg {...p}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></Svg>
const audience    = (p: any) => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>
const card        = (p: any) => <Svg {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>
const globe       = (p: any) => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Svg>
const layers      = (p: any) => <Svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></Svg>
const wallet      = (p: any) => <Svg {...p}><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8L4 7h16l-4-4z"/><circle cx="16" cy="13" r="1" fill="currentColor"/></Svg>
const code        = (p: any) => <Svg {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Svg>
const copy        = (p: any) => <Svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Svg>
const download    = (p: any) => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>
const external    = (p: any) => <Svg {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></Svg>
const filter      = (p: any) => <Svg {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Svg>
const more        = (p: any) => <Svg {...p}><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></Svg>
const play        = (p: any) => <Svg {...p}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></Svg>
const pause       = (p: any) => <Svg {...p}><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></Svg>
const shield      = (p: any) => <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>
const bolt        = (p: any) => <Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></Svg>
const lock        = (p: any) => <Svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>
const mail        = (p: any) => <Svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></Svg>
const eye         = (p: any) => <Svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Svg>
const chev        = (p: any) => <Svg {...p}><polyline points="9 18 15 12 9 6"/></Svg>
const chevDown    = (p: any) => <Svg {...p}><polyline points="6 9 12 15 18 9"/></Svg>
const chevLeft    = (p: any) => <Svg {...p}><polyline points="15 18 9 12 15 6"/></Svg>
const cal         = (p: any) => <Svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>
const trend       = (p: any) => <Svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>
const pin         = (p: any) => <Svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Svg>
const flag        = (p: any) => <Svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></Svg>
const target      = (p: any) => <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></Svg>
const send        = (p: any) => <Svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Svg>
const github      = (p: any) => <Svg {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></Svg>
const spark       = (p: any) => <Svg {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></Svg>
const link        = (p: any) => <Svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Svg>
const doc         = (p: any) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Svg>
const inbox       = (p: any) => <Svg {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></Svg>
const zap         = (p: any) => <Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth={1.5}/></Svg>
const bookmark    = (p: any) => <Svg {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></Svg>
const layers2     = (p: any) => <Svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/></Svg>
const refresh     = (p: any) => <Svg {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Svg>
const network     = (p: any) => <Svg {...p}><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><line x1="12" y1="12" x2="12" y2="8"/></Svg>
const star        = (p: any) => <Svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>
const quote       = (p: any) => <Svg {...p}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></Svg>
const logout      = (p: any) => <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>

export const Icons = {
  arrow, arrowUp, arrowDown, arrowUR,
  check, plus, minus, x,
  search, bell, user, settings,
  home, chart, campaign, audience,
  card, globe, layers, wallet,
  code, copy, download, external,
  filter, more, play, pause,
  shield, bolt, lock, mail,
  eye, chev, chevDown, chevLeft,
  cal, trend, pin, flag,
  target, send, github, spark,
  link, doc, inbox, zap,
  bookmark, layers2, refresh, network,
  star, quote, logout,
}

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export function Brand({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const textCls = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-xl' : 'text-[17px]'
  const markSize = size === 'sm' ? 18 : size === 'lg' ? 32 : 24
  return (
    <span className={`inline-flex items-center gap-2 font-[560] tracking-tight ${textCls} text-[var(--c-fg)] ${className}`}>
      <span
        className="rounded-[5px] bg-[var(--c-fg)] relative flex-shrink-0 flex items-center justify-center"
        style={{ width: markSize, height: markSize }}
      >
        <span
          className="absolute bg-[var(--c-bg)] rounded-tl-[2px]"
          style={{ top: Math.round(markSize * 0.17), left: Math.round(markSize * 0.17), width: Math.round(markSize * 0.33), height: Math.round(markSize * 0.33) }}
        />
      </span>
      Adryx
    </span>
  )
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'outline' | 'soft'
type ButtonSize = 'lg' | 'md' | 'sm'

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--c-fg)] text-[var(--c-bg)] hover:opacity-80',
  accent:  'bg-[var(--c-acc)] text-white hover:bg-[var(--c-acc-2)]',
  ghost:   'bg-transparent text-[var(--c-fg-3)] hover:bg-[var(--c-bg-3)] hover:text-[var(--c-fg)]',
  outline: 'bg-transparent border border-[var(--c-line-2)] text-[var(--c-fg-2)] hover:bg-[var(--c-bg-3)]',
  soft:    'bg-[var(--c-bg-3)] text-[var(--c-fg-2)] hover:bg-[var(--c-bg-4)]',
}

const BTN_SIZE: Record<ButtonSize, string> = {
  lg: 'h-11 px-5 text-[15px] gap-2.5 rounded-[var(--r-6)]',
  md: 'h-9  px-4 text-[13.5px] gap-2 rounded-[var(--r-5)]',
  sm: 'h-7  px-3 text-[12px] gap-1.5 rounded-[var(--r-4)]',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: boolean
  block?: boolean
  loading?: boolean
  children?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon = false,
  block = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const iconCls = icon ? (size === 'lg' ? 'w-11 px-0' : size === 'sm' ? 'w-7 px-0' : 'w-9 px-0') : ''
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-[510] transition-all select-none',
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        iconCls,
        block ? 'w-full' : '',
        (disabled || loading) ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
        </svg>
      ) : children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

type BadgeTone = 'ok' | 'warn' | 'bad' | 'neutral' | 'acc' | 'outline'

const BADGE_TONE: Record<BadgeTone, string> = {
  ok:      'bg-[var(--c-ok-soft)] text-[var(--c-ok)]',
  warn:    'bg-[var(--c-warn-soft)] text-[var(--c-warn)]',
  bad:     'bg-[var(--c-bad-soft)] text-[var(--c-bad)]',
  neutral: 'bg-[var(--c-bg-3)] text-[var(--c-fg-3)]',
  acc:     'bg-[var(--c-acc-soft)] text-[var(--c-acc-ink)]',
  outline: 'border border-[var(--c-line-2)] text-[var(--c-fg-3)] bg-transparent',
}

const BADGE_DOT: Record<BadgeTone, string> = {
  ok:      'bg-[var(--c-ok)]',
  warn:    'bg-[var(--c-warn)]',
  bad:     'bg-[var(--c-bad)]',
  neutral: 'bg-[var(--c-fg-4)]',
  acc:     'bg-[var(--c-acc)]',
  outline: 'bg-[var(--c-fg-4)]',
}

interface BadgeProps {
  tone?: BadgeTone
  dot?: boolean
  children: React.ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', dot = false, children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11.5px] font-[510] ${BADGE_TONE[tone]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${BADGE_DOT[tone]}`} />}
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardProps {
  pad?: boolean
  padLg?: boolean
  className?: string
  children: React.ReactNode
  [key: string]: any
}

export function Card({ pad = false, padLg = false, className = '', children, ...rest }: CardProps) {
  const padCls = padLg ? 'p-6' : pad ? 'p-5' : ''
  return (
    <div
      className={`bg-[var(--c-surface)] border border-[var(--c-line)] rounded-[var(--r-5)] shadow-[var(--sh-card)] ${padCls} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

const AVATAR_PALETTES = [
  ['#dbeafe', '#1d4ed8'],
  ['#dcfce7', '#15803d'],
  ['#fef9c3', '#a16207'],
  ['#fce7f3', '#be185d'],
  ['#ede9fe', '#6d28d9'],
  ['#ffedd5', '#c2410c'],
  ['#e0f2fe', '#0369a1'],
  ['#d1fae5', '#065f46'],
]

interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  src?: string
  className?: string
}

export function Avatar({ initials, size = 'md', src, className = '' }: AvatarProps) {
  const hash = useMemo(() => {
    let h = 0
    for (let i = 0; i < initials.length; i++) h = (h * 31 + initials.charCodeAt(i)) & 0xffff
    return h % AVATAR_PALETTES.length
  }, [initials])
  const [bg, fg] = AVATAR_PALETTES[hash]
  const sizeCls = size === 'sm' ? 'w-6 h-6 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-[14px]' : 'w-8 h-8 text-[12px]'
  if (src) {
    return (
      <img
        src={src}
        alt={initials}
        className={`rounded-full object-cover border border-[var(--c-line-2)] ${sizeCls} ${className}`}
      />
    )
  }
  return (
    <span
      className={`rounded-full inline-flex items-center justify-center font-[540] flex-shrink-0 border border-[var(--c-line-2)] ${sizeCls} ${className}`}
      style={{ background: bg, color: fg }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Seg (segmented control)
// ---------------------------------------------------------------------------

interface SegProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  className?: string
}

export function Seg({ options, value, onChange, className = '' }: SegProps) {
  return (
    <div className={`inline-flex bg-[var(--c-bg-3)] p-[3px] rounded-[var(--r-3)] gap-0.5 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={[
            'border-0 px-2.5 py-[5px] rounded-[6px] text-[12.5px] font-[510] transition-all',
            o.value === value
              ? 'bg-white text-[var(--c-fg)] shadow-[var(--sh-2)]'
              : 'bg-transparent text-[var(--c-fg-3)] hover:text-[var(--c-fg)]',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

interface TabsProps {
  tabs: { label: string; value: string; count?: number }[]
  value: string
  onChange: (v: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 border-b border-[var(--c-line)] ${className}`}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={[
            'flex items-center gap-1.5 px-3 py-[10px] text-[13.5px] font-[510] border-b-2 -mb-px transition-colors',
            t.value === value
              ? 'border-[var(--c-fg)] text-[var(--c-fg)]'
              : 'border-transparent text-[var(--c-fg-3)] hover:text-[var(--c-fg)]',
          ].join(' ')}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="px-1.5 py-0.5 rounded-full bg-[var(--c-bg-3)] text-[var(--c-fg-4)] text-[10.5px] font-[530]">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: number
  children: React.ReactNode
}

export function Modal({ open, onClose, title, footer, maxWidth = 640, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: 'rgba(15,15,20,.32)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-[var(--r-6)] shadow-[var(--sh-4)] w-full flex flex-col overflow-hidden"
        style={{ maxWidth, maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined && (
          <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--c-line)]">
            <div className="t-h4 font-[550]">{title}</div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-[var(--r-2)] flex items-center justify-center text-[var(--c-fg-4)] hover:bg-[var(--c-bg-3)] hover:text-[var(--c-fg)] transition-colors"
            >
              {Icons.x({ size: 15 })}
            </button>
          </div>
        )}
        <div className="px-[22px] py-[22px] overflow-y-auto flex-1">
          {children}
        </div>
        {footer !== undefined && (
          <div className="flex items-center justify-between gap-3 px-[22px] py-[14px] border-t border-[var(--c-line)] bg-[var(--c-bg-2)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Form controls: Field, Input, Select, Textarea
// ---------------------------------------------------------------------------

interface FieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function Field({ label, hint, error, required, children, className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-[510] text-[var(--c-fg-2)]">
          {label}
          {required && <span className="text-[var(--c-bad)] ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] text-[var(--c-bad)]">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-[var(--c-fg-4)]">{hint}</p>
      ) : null}
    </div>
  )
}

const INPUT_BASE = [
  'w-full h-9 px-3 text-[13.5px] bg-white border border-[var(--c-line-2)] rounded-[var(--r-4)]',
  'text-[var(--c-fg)] placeholder:text-[var(--c-fg-4)]',
  'transition-colors outline-none',
  'focus:border-[var(--c-acc)] focus:ring-2 focus:ring-[var(--c-acc)]/20',
  'disabled:bg-[var(--c-bg-3)] disabled:text-[var(--c-fg-4)] disabled:cursor-not-allowed',
].join(' ')

export function Input({ className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${INPUT_BASE} ${className}`} {...rest} />
}

export function Select({ className = '', children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${INPUT_BASE} pr-8 appearance-none bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8a94' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_10px_center] ${className}`} {...rest}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[
        'w-full px-3 py-2 text-[13.5px] bg-white border border-[var(--c-line-2)] rounded-[var(--r-4)]',
        'text-[var(--c-fg)] placeholder:text-[var(--c-fg-4)]',
        'transition-colors outline-none resize-y min-h-[80px]',
        'focus:border-[var(--c-acc)] focus:ring-2 focus:ring-[var(--c-acc)]/20',
        'disabled:bg-[var(--c-bg-3)] disabled:text-[var(--c-fg-4)] disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      {...rest}
    />
  )
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

type ToastTone = 'ok' | 'bad' | 'warn' | 'info'

interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

interface ToastCtx {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const TONE_STYLES: Record<ToastTone, { bar: string; icon: string }> = {
    ok:   { bar: 'bg-[var(--c-ok)]',   icon: '✓' },
    bad:  { bar: 'bg-[var(--c-bad)]',  icon: '✕' },
    warn: { bar: 'bg-[var(--c-warn)]', icon: '!' },
    info: { bar: 'bg-[var(--c-acc)]',  icon: 'i' },
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 items-end" aria-live="polite">
        {toasts.map((t) => {
          const s = TONE_STYLES[t.tone]
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 bg-white border border-[var(--c-line)] rounded-[var(--r-5)] shadow-[var(--sh-4)] overflow-hidden min-w-[260px] max-w-[380px]"
              style={{ animation: 'fadeUp .2s ease both' }}
            >
              <div className={`w-1 self-stretch flex-shrink-0 ${s.bar}`} />
              <span className="text-[13.5px] text-[var(--c-fg-2)] py-3 flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="pr-3 text-[var(--c-fg-4)] hover:text-[var(--c-fg)] text-lg leading-none"
                aria-label="Dismiss"
              >
                {Icons.x({ size: 13 })}
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fill?: boolean
  className?: string
}

export function Sparkline({ data, width = 80, height = 28, color = 'var(--c-acc)', fill = true, className = '' }: SparklineProps) {
  const points = useMemo(() => {
    if (!data || data.length < 2) return { line: '', area: '' }
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const xs = data.map((_, i) => (i / (data.length - 1)) * width)
    const ys = data.map((v) => height - ((v - min) / range) * (height - 2) - 1)
    const pts = xs.map((x, i) => `${x},${ys[i]}`).join(' ')
    const line = `M ${pts.replace(/,/g, ' ').replace(/ (\d)/g, ' L $1')}`
    const area = `${line} L ${xs[xs.length - 1]} ${height} L ${xs[0]} ${height} Z`
    return { line: `M ${xs[0]} ${ys[0]} ` + xs.slice(1).map((x, i) => `L ${x} ${ys[i + 1]}`).join(' '), area: `M ${xs[0]} ${ys[0]} ` + xs.slice(1).map((x, i) => `L ${x} ${ys[i + 1]}`).join(' ') + ` L ${xs[xs.length - 1]} ${height} L ${xs[0]} ${height} Z` }
  }, [data, width, height])

  if (!data || data.length < 2) return null

  const id = useMemo(() => `spk-${Math.random().toString(36).slice(2)}`, [])

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ overflow: 'visible' }}>
      {fill && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={points.area} fill={`url(#${id})`} stroke="none" />}
      <path d={points.line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

export function fmtNum(n: number, compact = true): string {
  if (n == null || isNaN(n)) return '—'
  if (!compact || n < 1000) return n.toLocaleString()
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  return `${(n / 1_000_000_000).toFixed(1)}B`
}

export function fmtMoney(n: number, currency = 'USD'): string {
  if (n == null || isNaN(n)) return '—'
  if (Math.abs(n) < 1000) return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

export function fmtPct(n: number, decimals = 2): string {
  if (n == null || isNaN(n)) return '—'
  return `${n.toFixed(decimals)}%`
}

export function shortAddr(addr: string, head = 4, tail = 4): string {
  if (!addr) return '—'
  if (addr.length <= head + tail + 3) return addr
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`
}
