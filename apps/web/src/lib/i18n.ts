import { create } from 'zustand';

/* ── Supported locales ─────────────────────────────── */
export const LOCALES = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'sv', flag: '🇸🇪', name: 'Svenska' },
  { code: 'da', flag: '🇩🇰', name: 'Dansk' },
  { code: 'no', flag: '🇳🇴', name: 'Norsk' },
  { code: 'ro', flag: '🇷🇴', name: 'Română' },
  { code: 'id', flag: '🇮🇩', name: 'Bahasa Indonesia' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

export const RTL_LOCALES: LocaleCode[] = ['ar'];

/* ── Message loading ───────────────────────────────── */
type Messages = Record<string, Record<string, string>>;

const messageCache: Partial<Record<LocaleCode, Messages>> = {};

export async function loadMessages(locale: LocaleCode): Promise<Messages> {
  if (messageCache[locale]) return messageCache[locale]!;

  try {
    const messages = (await import(`@/src/messages/${locale}.json`)).default;
    messageCache[locale] = messages;
    return messages;
  } catch {
    // Fallback to English
    if (locale !== 'en') return loadMessages('en');
    throw new Error('Failed to load English messages');
  }
}

/* ── Locale store ──────────────────────────────────── */
export interface LocaleState {
  locale: LocaleCode;
  messages: Messages;
  isLoaded: boolean;
  setLocale: (locale: LocaleCode) => Promise<void>;
}

// Pre-load English messages synchronously for SSR/initial render
import enMessages from '@/src/messages/en.json';

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en',
  messages: enMessages as unknown as Messages,
  isLoaded: false,

  setLocale: async (locale: LocaleCode) => {
    const messages = await loadMessages(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fanshot-locale', locale);
      // RTL support
      document.documentElement.dir = RTL_LOCALES.includes(locale)
        ? 'rtl'
        : 'ltr';
    }
    set({ locale, messages, isLoaded: true });
  },
}));

/* ── Translation hook ──────────────────────────────── */

/**
 * Hook to get translated strings.
 * Usage: const t = useT('landing');  t('heroTitle')
 */
export function useT(namespace: string) {
  const { messages } = useLocaleStore();

  return (key: string, params?: Record<string, string | number>): string => {
    const ns = messages[namespace];
    if (!ns) return key;
    let value = ns[key];
    if (!value) return key;

    // Simple parameter interpolation: {count} → value
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }

    return value;
  };
}

/** Get locale metadata by code */
export function getLocaleInfo(code: LocaleCode) {
  return LOCALES.find((l) => l.code === code);
}
