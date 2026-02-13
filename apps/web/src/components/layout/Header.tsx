'use client';

import Link from 'next/link';
import { CreditBadge } from '../ui/CreditBadge';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useAuthStore } from '@/src/stores/authStore';
import { useCreditStore } from '@/src/stores/creditStore';
import { useT } from '@/src/lib/i18n';

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const { credits } = useCreditStore();
  const t = useT('nav');

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[480px] items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <h1 className="text-gold-gradient font-oswald text-xl font-bold tracking-wider">
            FANSHOT
          </h1>
          <span className="rounded-md bg-pitch-green/15 px-2 py-0.5 font-oswald text-[10px] font-semibold tracking-wider text-pitch-green">
            WC 2026
          </span>
        </Link>

        {/* Right: Auth-aware section */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {isAuthenticated && user ? (
            <>
              <Link href="/credits">
                <CreditBadge amount={credits} />
              </Link>
              <Link
                href="/profile"
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gold/30 bg-gold/10 transition-colors hover:border-gold/50"
              >
                <span className="font-oswald text-xs font-semibold uppercase text-gold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                </span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-gold/30 bg-gold/[0.08] px-3.5 py-1.5 font-oswald text-xs font-medium uppercase tracking-wider text-gold transition-all hover:border-gold/50 hover:bg-gold/[0.15]"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
