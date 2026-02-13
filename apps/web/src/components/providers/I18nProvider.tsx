'use client';

import { useEffect } from 'react';
import { useLocaleStore, RTL_LOCALES } from '@/src/lib/i18n';
import type { LocaleCode } from '@/src/lib/i18n';

/**
 * Initializes locale from localStorage on app load.
 * Place in root layout alongside ToastProvider.
 */
export function I18nProvider() {
  const { setLocale, isLoaded } = useLocaleStore();

  useEffect(() => {
    if (isLoaded) return;
    const stored = localStorage.getItem('fanshot-locale') as LocaleCode | null;
    const locale = stored || 'en';

    // Set RTL immediately to avoid flash
    document.documentElement.dir = RTL_LOCALES.includes(locale as LocaleCode)
      ? 'rtl'
      : 'ltr';

    setLocale(locale as LocaleCode);
  }, [setLocale, isLoaded]);

  return null;
}
