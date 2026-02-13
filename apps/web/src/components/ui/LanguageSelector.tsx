'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocaleStore, LOCALES, getLocaleInfo } from '@/src/lib/i18n';
import type { LocaleCode } from '@/src/lib/i18n';

export function LanguageSelector() {
  const { locale, setLocale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = getLocaleInfo(locale);

  /* Close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = async (code: LocaleCode) => {
    await setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-bg-card px-2 py-1.5 text-xs transition-all hover:border-white/[0.12]"
      >
        <span className="text-sm">{current?.flag}</span>
        <span className="font-oswald text-[10px] font-medium uppercase tracking-wider text-text-secondary">
          {locale.toUpperCase()}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[320px] w-48 overflow-y-auto rounded-xl border border-white/[0.06] bg-bg-elevated shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04] ${
                l.code === locale ? 'bg-gold/[0.06]' : ''
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span
                className={`text-sm ${
                  l.code === locale
                    ? 'font-medium text-gold'
                    : 'text-text-secondary'
                }`}
              >
                {l.name}
              </span>
              {l.code === locale && (
                <span className="ml-auto text-xs text-gold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
