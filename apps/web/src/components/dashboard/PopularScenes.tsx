'use client';

import { useRouter } from 'next/navigation';
import { useT } from '@/src/lib/i18n';

const scenes = [
  {
    id: 'celebration',
    nameKey: 'goalCelebration',
    emoji: '🎉',
    gradient: 'from-accent-red/25 to-accent-red/5',
  },
  {
    id: 'trophy',
    nameKey: 'trophyPose',
    emoji: '🏆',
    gradient: 'from-gold/25 to-gold/5',
  },
  {
    id: 'stadium_pitch',
    nameKey: 'pitchSide',
    emoji: '⚽',
    gradient: 'from-pitch-green/25 to-pitch-green/5',
  },
  {
    id: 'press_conference',
    nameKey: 'pressRoom',
    emoji: '🎙️',
    gradient: 'from-accent-blue/25 to-accent-blue/5',
  },
];

export function PopularScenes() {
  const router = useRouter();
  const t = useT('dashboard');

  return (
    <div>
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-oswald text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t('popularScenes')}
        </h3>
        <button
          onClick={() => router.push('/create')}
          className="font-oswald text-xs font-medium tracking-wide text-gold transition-colors hover:text-gold-light"
        >
          {t('seeAll')}
        </button>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => router.push(`/create?scene=${scene.id}`)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.08] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] active:scale-[0.97]"
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient}`} />
            <div className="absolute inset-0 bg-bg-card/60" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
              <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                {scene.emoji}
              </span>
              <span className="font-oswald text-xs font-medium uppercase tracking-wider text-text-secondary transition-colors group-hover:text-text-primary">
                {t(scene.nameKey)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
