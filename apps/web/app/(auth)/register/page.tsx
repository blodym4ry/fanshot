'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoldButton } from '@/src/components/ui/GoldButton';
import { AuthInput } from '@/src/components/auth/AuthInput';
import { useAuth } from '@/src/hooks/useAuth';
import { useT } from '@/src/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isSupabaseConfigured } = useAuth();
  const t = useT('auth');
  const tn = useT('nav');

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName || !email || !password) {
      setError(t('nameEmailPasswordRequired'));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.push('/dashboard');
    } catch (err) {
      setError(
        (err as Error).message || t('registerFailed')
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
          {t('registerSubtitle')}
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
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          value={displayName}
          onChange={setDisplayName}
          required
          autoComplete="name"
        />
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
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={setPassword}
          required
          autoComplete="new-password"
        />
        <AuthInput
          label={t('referralLabel')}
          placeholder={t('referralPlaceholder')}
          value={referralCode}
          onChange={setReferralCode}
          autoComplete="off"
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
          {loading ? t('registering') : t('register')}
        </GoldButton>
      </form>

      {/* Login link */}
      <p className="text-sm text-text-secondary">
        {t('hasAccount')}{' '}
        <Link
          href="/login"
          className="font-oswald font-medium tracking-wide text-gold transition-colors hover:text-gold-light"
        >
          {tn('login')}
        </Link>
      </p>
    </div>
  );
}
