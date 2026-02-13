'use client';

import { useT } from '@/src/lib/i18n';

export function MascotsBanner() {
  const t = useT('dashboard');

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-r from-accent-red/[0.06] via-accent-green/[0.06] to-accent-blue/[0.06]">
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Mascot emojis */}
        <div className="flex -space-x-1 text-2xl">
          <span>🫎</span>
          <span>🐆</span>
          <span>🦅</span>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="font-oswald text-sm font-semibold tracking-wide text-text-primary">
            {t('mascots')}
          </p>
          <p className="text-xs text-text-muted">
            {t('mascotsNames')}
          </p>
        </div>

        {/* NEW badge */}
        <span className="flex-shrink-0 rounded-md bg-gold/15 px-2.5 py-1 font-oswald text-[10px] font-bold uppercase tracking-widest text-gold">
          {t('new')}
        </span>
      </div>
    </div>
  );
}
