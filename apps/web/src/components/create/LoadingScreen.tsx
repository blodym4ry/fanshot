'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/src/lib/i18n';

interface LoadingScreenProps {
  isComplete: boolean;
}

export function LoadingScreen({ isComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [triviaIdx, setTriviaIdx] = useState(0);
  const t = useT('create');
  const tt = useT('trivia');

  const triviaKeys = ['t1', 't2', 't3', 't4', 't5'];

  /* Progress simulation: climb to ~90, snap to 100 on complete */
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        const increment = Math.random() * 8 + 2; // 2-10
        return Math.min(p + increment, 90);
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isComplete]);

  /* Trivia rotation every 3.5 s */
  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaIdx((i) => (i + 1) % triviaKeys.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [triviaKeys.length]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
      {/* Spinning football + gold ring */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-spin-slow rounded-full border-[3px] border-transparent border-t-gold border-r-gold/30" />
        <span className="text-5xl">⚽</span>
      </div>

      {/* Title */}
      <div>
        <h2 className="font-oswald text-xl font-bold uppercase tracking-wider text-text-primary">
          {t('generatingTitle')}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary">
          {t('generatingSubtitle')}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[280px]">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-accent-green transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 font-oswald text-xs font-medium tracking-wider text-text-muted">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Trivia card */}
      <div className="w-full max-w-[320px] rounded-xl border border-gold/10 bg-bg-card/60 p-4">
        <p
          key={triviaIdx}
          className="animate-fade-step text-sm leading-relaxed text-text-secondary"
        >
          {tt(triviaKeys[triviaIdx])}
        </p>
      </div>
    </div>
  );
}
