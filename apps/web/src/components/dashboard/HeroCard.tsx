'use client';

import { useRouter } from 'next/navigation';
import { GoldButton } from '../ui/GoldButton';
import { useT } from '@/src/lib/i18n';

export function HeroCard() {
  const router = useRouter();
  const t = useT('dashboard');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-pitch-green/20 to-bg-card p-6">
      {/* Background trophy watermark */}
      <span className="pointer-events-none absolute -right-4 -top-2 select-none text-[120px] opacity-[0.08] rotate-12">
        🏆
      </span>

      {/* Content */}
      <div className="relative z-10">
        {/* Tournament label */}
        <p className="font-oswald text-[11px] font-light uppercase tracking-[0.25em] text-gold-light">
          {t('wcLabel')}
        </p>

        {/* Main headline */}
        <h2 className="mt-3 font-oswald text-2xl font-bold leading-tight text-text-primary">
          {t('heroTitle')}
        </h2>
        <h2 className="text-gold-gradient font-oswald text-2xl font-bold leading-tight">
          {t('heroHighlight')}
        </h2>

        {/* Subtext */}
        <p className="mt-2.5 text-[13px] leading-relaxed text-text-primary/60">
          {t('heroSubtitle')}
        </p>

        {/* CTA */}
        <div className="mt-5">
          <GoldButton size="large" onClick={() => router.push('/create')}>
            {t('createButton')}
          </GoldButton>
        </div>

        {/* Host countries */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex gap-1.5">
            {['🇺🇸', '🇨🇦', '🇲🇽'].map((flag) => (
              <span
                key={flag}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-sm"
              >
                {flag}
              </span>
            ))}
          </div>
          <span className="font-oswald text-[11px] font-light tracking-wider text-text-muted">
            {t('teamsInfo')}
          </span>
        </div>
      </div>
    </div>
  );
}
