'use client';

import { useState } from 'react';
import { GoldButton } from '../ui/GoldButton';
import { useT } from '@/src/lib/i18n';

interface AiDisclaimerModalProps {
  onAccept: () => void;
}

/**
 * Full-screen AI disclaimer modal.
 * Cannot be dismissed via backdrop click or X button.
 * User must check the checkbox and click Continue.
 */
export function AiDisclaimerModal({ onAccept }: AiDisclaimerModalProps) {
  const [checked, setChecked] = useState(false);
  const tl = useT('legal');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[420px] rounded-2xl border border-white/[0.06] bg-bg-elevated p-6 shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
        {/* Warning icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-center font-oswald text-xl font-bold uppercase tracking-wider text-text-primary">
          {tl('disclaimerTitle')}
        </h2>

        {/* Disclaimer text */}
        <div className="mb-6 max-h-[240px] overflow-y-auto rounded-xl border border-white/[0.04] bg-bg-primary/50 p-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            {tl('disclaimerText')}
          </p>
        </div>

        {/* Checkbox */}
        <label className="mb-5 flex cursor-pointer items-start gap-3">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-5 w-5 rounded-md border-2 border-white/20 bg-bg-primary transition-all peer-checked:border-gold peer-checked:bg-gold/20" />
            {checked && (
              <svg
                className="absolute left-0.5 top-0.5 h-4 w-4 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm leading-snug text-text-secondary">
            {tl('checkboxLabel')}
          </span>
        </label>

        {/* Continue button */}
        <GoldButton
          size="large"
          className="w-full"
          disabled={!checked}
          onClick={onAccept}
        >
          {tl('continueButton')}
        </GoldButton>
      </div>
    </div>
  );
}
