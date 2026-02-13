'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { GoldButton } from '@/src/components/ui/GoldButton';
import { useCreditStore } from '@/src/stores/creditStore';
import { useT } from '@/src/lib/i18n';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addCredits } = useCreditStore();
  const t = useT('credits');

  const isMock = searchParams.get('mock') === 'true';
  const creditsAdded = Number(searchParams.get('credits')) || 0;
  const packageName = searchParams.get('package') || '';

  /* Add credits to local store on mount */
  useEffect(() => {
    if (creditsAdded > 0) {
      addCredits(creditsAdded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const packageLabels: Record<string, string> = {
    starter: 'Starter',
    fan_pack: 'Fan Pack',
    super_fan: 'Super Fan',
  };

  return (
    <div className="animate-fade-step flex flex-col items-center gap-6 py-8 text-center">
      {/* Success icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-green/10">
        <span className="text-5xl">🎉</span>
      </div>

      {/* Title */}
      <h2 className="font-oswald text-3xl font-bold uppercase tracking-wider text-gold">
        {t('successTitle')}
      </h2>

      {/* Credits info */}
      <div className="flex flex-col gap-1">
        {creditsAdded > 0 && (
          <p className="text-lg text-text-primary">
            <span className="font-oswald text-2xl font-bold text-gold">
              {creditsAdded}
            </span>{' '}
            {t('creditsAdded')}
          </p>
        )}
        {packageLabels[packageName] && (
          <p className="text-sm text-text-secondary">
            {packageLabels[packageName]} {t('package')}
          </p>
        )}
      </div>

      {/* Mock warning */}
      {isMock && (
        <div className="w-full rounded-xl border border-gold/20 bg-gold/[0.05] px-4 py-3 text-xs text-gold">
          {t('mockWarning')}
        </div>
      )}

      {/* CTA */}
      <GoldButton
        size="large"
        className="mt-2 w-full"
        onClick={() => router.push('/create')}
      >
        {t('startCreating')}
      </GoldButton>

      {/* Back link */}
      <button
        onClick={() => router.push('/credits')}
        className="text-sm text-text-muted transition-colors hover:text-text-secondary"
      >
        {t('backToCredits')}
      </button>
    </div>
  );
}

export default function CreditsSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
