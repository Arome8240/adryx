'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'ok' | 'error' | 'warn' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const ToastCtx = createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

const ACCENT: Record<ToastType, string> = {
  ok:    '#EBFF45',
  error: '#FF4545',
  warn:  '#FF9F45',
  info:  'rgba(255,255,255,0.45)',
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 5V7.5M7 9.5V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M6.134 2.5L1.402 10.75A1 1 0 002.268 12.25H11.732a1 1 0 00.866-1.5L7.866 2.5a1 1 0 00-1.732 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 6.5V10M7 4.5V5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const TYPE_ICON: Record<ToastType, React.ReactNode> = {
  ok:    <CheckIcon />,
  error: <XIcon />,
  warn:  <WarnIcon />,
  info:  <InfoIcon />,
};

function SingleToast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const accent = ACCENT[item.type];
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const t = setTimeout(onDismiss, item.duration);
    return () => clearTimeout(t);
  }, [item.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 56, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.93, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      style={{
        position: 'relative',
        background: 'rgba(11,11,16,0.97)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 14,
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
        overflow: 'hidden',
        minWidth: 272,
        maxWidth: 400,
        cursor: 'default',
      }}
    >
      {/* Left accent strip */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent,
          borderRadius: '14px 0 0 14px',
        }}
      />

      {/* Body */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px 11px 18px' }}>
        {/* Accent icon */}
        <div style={{ color: accent, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {TYPE_ICON[item.type]}
        </div>

        {/* Message */}
        <span
          style={{
            fontSize: 13.5,
            color: 'rgba(245,245,245,0.88)',
            fontWeight: 450,
            lineHeight: 1.45,
            flex: 1,
            fontFamily: 'var(--font-manrope, sans-serif)',
          }}
        >
          {item.message}
        </span>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            color: 'rgba(245,245,245,0.25)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            borderRadius: 4,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.25)')}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Progress drain bar */}
      <motion.div
        style={{
          height: 2,
          background: accent,
          opacity: 0.35,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: item.duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    const duration = type === 'error' ? 5000 : 4000;
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {mounted && <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents: 'auto' }}>
              <SingleToast item={t} onDismiss={() => dismiss(t.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>}
    </ToastCtx.Provider>
  );
}
