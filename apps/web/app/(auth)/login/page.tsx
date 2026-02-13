'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoldButton } from '@/src/components/ui/GoldButton';
import { AuthInput } from '@/src/components/auth/AuthInput';
import { useAuth } from '@/src/hooks/useAuth';
import { useT } from '@/src/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isSupabaseConfigured } = useAuth();
  const t = useT('auth');
  const tn = useT('nav');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t('emailPasswordRequired'));
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(
        (err as Error).message || t('loginFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-step flex flex-col items-center gap-8">
      {/* Logo */}
      <div className="text-center">
        <h1 className="text-gold-gradient font-oswald text-4xl font-bold tracking-wider">
          FANSHOT
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t('loginSubtitle')}
        </p>
      </div>

      {/* Supabase offline notice */}
      {!isSupabaseConfigured && (
        <div className="w-full rounded-xl border border-gold/20 bg-gold/[0.05] px-4 py-3 text-center text-xs text-gold">
          {t('devMode')}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <AuthInput
          label={t('emailLabel')}
          type="email"
          placeholder="ornek@email.com"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
        />
        <AuthInput
          label={t('passwordLabel')}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="rounded-lg bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
            {error}
          </p>
        )}

        <GoldButton
          size="large"
          className="mt-1 w-full"
          disabled={loading}
          onClick={() => {
            /* form submit handles it */
          }}
        >
          {loading ? t('loggingIn') : tn('login')}
        </GoldButton>
      </form>

      {/* Divider */}
      <div className="flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-xs text-text-muted">{t('or')}</span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* Social buttons */}
      <div className="flex w-full flex-col gap-2.5">
        <button
          disabled
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-oswald text-sm font-medium uppercase tracking-wider text-gray-800 opacity-50"
          title={t('comingSoon')}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t('googleLogin')}
          <span className="absolute right-3 rounded bg-bg-card px-1.5 py-0.5 text-[9px] text-text-muted">
            {t('comingSoon')}
          </span>
        </button>

        <button
          disabled
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-black px-4 py-3 font-oswald text-sm font-medium uppercase tracking-wider text-white opacity-50"
          title={t('comingSoon')}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          {t('appleLogin')}
          <span className="absolute right-3 rounded bg-bg-elevated px-1.5 py-0.5 text-[9px] text-text-muted">
            {t('comingSoon')}
          </span>
        </button>
      </div>

      {/* Register link */}
      <p className="text-sm text-text-secondary">
        {t('noAccount')}{' '}
        <Link
          href="/register"
          className="font-oswald font-medium tracking-wide text-gold transition-colors hover:text-gold-light"
        >
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
