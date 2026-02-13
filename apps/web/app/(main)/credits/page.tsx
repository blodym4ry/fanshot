'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoldButton } from '@/src/components/ui/GoldButton';
import { useCreditStore } from '@/src/stores/creditStore';
import { useT } from '@/src/lib/i18n';

/* ── Package data (4 packages) ───────────────────────── */
interface CreditPackage {
  id: string;
  nameKey: string;
  price: string;
  credits: number;
  perPhoto: string;
  badge?: string;
  featured?: boolean;
}

const packages: CreditPackage[] = [
  {
    id: 'basic',
    nameKey: 'basic',
    price: '$1.99',
    credits: 3,
    perPhoto: '$0.66',
  },
  {
    id: 'popular',
    nameKey: 'popularPack',
    price: '$4.99',
    credits: 10,
    perPhoto: '$0.50',
    badge: '⭐ ',
    featured: true,
  },
  {
    id: 'pro',
    nameKey: 'pro',
    price: '$9.99',
    credits: 30,
    perPhoto: '$0.33',
    badge: '💎 ',
  },
  {
    id: 'ultimate',
    nameKey: 'ultimate',
    price: '$19.99',
    credits: 100,
    perPhoto: '$0.20',
    badge: '🔥 ',
  },
];

export default function CreditsPage() {
  const router = useRouter();
  const { credits } = useCreditStore();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const t = useT('credits');

  const handlePurchase = async (pkg: CreditPackage) => {
    setLoadingPackage(pkg.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName: pkg.id }),
      });
      const data = await res.json();
      if (data.url) router.push(data.url);
    } catch {
      // silently fail -- user can retry
    } finally {
      setLoadingPackage(null);
    }
  };

  return (
    <div className="animate-fade-step flex flex-col gap-6">
      {/* ── Title ──────────────────────────────────── */}
      <div className="text-center">
        <h2 className="font-oswald text-2xl font-bold uppercase tracking-wider text-text-primary">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* ── Current balance card ───────────────────── */}
      <div className="flex items-center gap-4 rounded-2xl border border-gold/15 bg-bg-card px-5 py-4">
        <span className="text-3xl">🪙</span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-text-muted">{t('currentBalance')}</p>
          <p className="font-oswald text-4xl font-bold text-gold">{credits}</p>
        </div>
        <p className="text-sm text-text-muted">
          {credits} {t('generations')}
          <br />
          {t('remaining')}
        </p>
      </div>

      {/* ── Package cards (2x2 grid) ───────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {packages.map((pkg) => {
          const isFeatured = pkg.featured;
          const isLoading = loadingPackage === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative flex flex-col items-center gap-2.5 rounded-2xl border px-3 pb-4 pt-5 text-center transition-all ${
                isFeatured
                  ? '-translate-y-1 border-gold/40 bg-bg-card shadow-[0_4px_24px_rgba(212,175,55,0.12)]'
                  : 'border-white/[0.06] bg-bg-card'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 font-oswald text-[9px] font-semibold uppercase tracking-wider ${
                    isFeatured
                      ? 'bg-gradient-to-r from-gold-dark to-gold text-bg-primary'
                      : pkg.id === 'pro'
                        ? 'bg-accent-blue/15 text-accent-blue'
                        : 'bg-accent-red/15 text-accent-red'
                  }`}
                >
                  {pkg.badge}{t(pkg.nameKey)}
                </span>
              )}

              {/* Package name (only if no badge) */}
              {!pkg.badge && (
                <p className="font-oswald text-[11px] font-light uppercase tracking-[0.2em] text-text-muted">
                  {t(pkg.nameKey)}
                </p>
              )}

              {/* Price */}
              <p className="font-oswald text-2xl font-bold text-text-primary">{pkg.price}</p>

              {/* Details */}
              <p className="text-[11px] leading-tight text-text-secondary">
                {pkg.credits} {t('photos')}
                <br />
                <span className="text-text-muted">{pkg.perPhoto}/{t('perPhoto')}</span>
              </p>

              {/* Buy button */}
              {isFeatured ? (
                <GoldButton size="small" className="mt-1 w-full text-xs" disabled={isLoading} onClick={() => handlePurchase(pkg)}>
                  {isLoading ? '...' : t('buyButton')}
                </GoldButton>
              ) : (
                <GoldButton size="small" variant="outline" className="mt-1 w-full text-xs" disabled={isLoading} onClick={() => handlePurchase(pkg)}>
                  {isLoading ? '...' : t('buyButton')}
                </GoldButton>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Trust badges ───────────────────────────── */}
      <div className="flex items-center justify-center gap-5 py-2 text-[11px] text-text-muted/50">
        <span>🔒 256-bit SSL</span>
        <span>💳 Stripe</span>
        <span>{t('securePayment')}</span>
      </div>
    </div>
  );
}
