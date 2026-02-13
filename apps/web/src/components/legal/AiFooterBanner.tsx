'use client';

import { useT } from '@/src/lib/i18n';

/**
 * Global AI disclaimer footer banner.
 * Shown at the bottom of every page in the app layout.
 */
export function AiFooterBanner() {
  const tl = useT('legal');

  return (
    <div className="border-t border-white/[0.04] bg-bg-primary/80 px-4 py-3">
      <p className="mx-auto max-w-[480px] text-center text-[10px] leading-relaxed text-text-muted/40">
        🤖 {tl('footerDisclaimer')}
      </p>
    </div>
  );
}
