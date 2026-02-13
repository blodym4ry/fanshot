'use client';

import { useCreateStore } from '@/src/stores/createStore';
import { GoldButton } from '../ui/GoldButton';
import { useT } from '@/src/lib/i18n';

export function ErrorScreen() {
  const { errorMessage, resetGeneration } = useCreateStore();
  const t = useT('create');
  const tc = useT('common');

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      {/* Error icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-red/10">
        <span className="text-4xl">😕</span>
      </div>

      {/* Error message */}
      <div>
        <h2 className="font-oswald text-lg font-bold uppercase tracking-wider text-text-primary">
          {t('errorTitle')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {errorMessage || t('errorDefault')}
        </p>
      </div>

      {/* Retry */}
      <GoldButton size="large" onClick={resetGeneration}>
        {tc('retry')}
      </GoldButton>
    </div>
  );
}
