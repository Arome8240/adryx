'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowDown2, TickCircle } from 'iconsax-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder = 'Select…', className = '' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
          open
            ? 'bg-white/8 border-[#EBFF45]/40 text-white'
            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:bg-white/8'
        }`}
      >
        <span className={`truncate ${!selected ? 'text-white/30' : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ArrowDown2
          size={14}
          color="currentColor"
          style={{
            opacity: 0.4,
            flexShrink: 0,
            transition: 'transform 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 top-full mt-1.5 w-full min-w-[160px] rounded-xl border border-white/10 shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(10,10,16,0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
          }}
        >
          <div className="max-h-52 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
            {options.map(opt => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-left transition-colors ${
                    active
                      ? 'bg-[#EBFF45]/10 text-[#EBFF45]'
                      : 'text-white/55 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <TickCircle size={13} color="currentColor" variant="Bold" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
