'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/authStore';
import { useCreditStore } from '@/src/stores/creditStore';
import { useGalleryStore } from '@/src/stores/galleryStore';
import { useT, useLocaleStore, LOCALES } from '@/src/lib/i18n';

/* ── Language Selector Sheet ───────────────────────── */

function LanguageSheet({ onClose }: { onClose: () => void }) {
  const { locale, setLocale } = useLocaleStore();
  const tl = useT('language');

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[480px] rounded-t-2xl border-t border-white/[0.06] bg-bg-elevated pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <h3 className="px-5 pb-3 font-oswald text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
          {tl('selectLanguage')}
        </h3>
        <div className="scrollbar-none max-h-[60vh] overflow-y-auto px-2">
          {LOCALES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); onClose(); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                locale === lang.code ? 'bg-gold/10 text-gold' : 'text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-oswald text-sm font-medium">{lang.name}</span>
              {locale === lang.code && <span className="ml-auto text-sm text-gold">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Settings Row ──────────────────────────────────── */
function SettingsRow({
  icon, label, value, onClick, danger, isLast,
}: {
  icon: string; label: string; value?: string; onClick?: () => void; danger?: boolean; isLast?: boolean;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/[0.02] active:bg-white/[0.04]"
      >
        <span className="text-base">{icon}</span>
        <span className={`flex-1 text-left text-sm ${danger ? 'text-red-400' : 'text-text-primary'}`}>{label}</span>
        {value && <span className="text-xs text-text-muted">{value}</span>}
        <span className={`text-xs ${danger ? 'text-red-400/50' : 'text-text-muted/50'}`}>›</span>
      </button>
      {!isLast && <div className="mx-4 h-px bg-white/[0.04]" />}
    </>
  );
}

/* ── Toggle Switch (visual only) ───────────────────── */
function ToggleSwitch({ checked }: { checked: boolean }) {
  return (
    <div className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-gold/60' : 'bg-white/10'}`}>
      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </div>
  );
}

/* ── Main Profile View ─────────────────────────────── */
export function ProfileView() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const { credits } = useCreditStore();
  const { generations } = useGalleryStore();
  const { locale } = useLocaleStore();
  const tp = useT('profile');
  const tl = useT('language');

  const [showLanguage, setShowLanguage] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const displayName = user?.displayName || 'FanShot User';
  const email = user?.email || 'user@fanshot.app';
  const initials = displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const totalGenerations = generations.length;
  const totalShares = 0;

  const handleLogout = () => {
    clearUser();
    router.push('/login');
  };

  const currentLang = LOCALES.find((l) => l.code === locale)?.name || tl('current');

  return (
    <div className="flex flex-col gap-5">
      {/* ── Profile Card ───────────────────────────── */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-bg-card p-4">
        <div className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light">
          <span className="font-oswald text-xl font-bold text-bg-primary">{initials}</span>
        </div>
        <div className="flex-1">
          <h2 className="font-oswald text-lg font-bold text-text-primary">{displayName}</h2>
          <p className="text-xs text-text-secondary">{email}</p>
        </div>
        <button disabled className="rounded-lg border border-white/[0.06] px-3 py-1.5 font-oswald text-[10px] font-medium uppercase tracking-wider text-text-muted opacity-40">
          {tp('edit')}
        </button>
      </div>

      {/* ── Stats Row ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { emoji: '📸', value: totalGenerations, label: tp('totalGenerations') },
          { emoji: '🪙', value: credits, label: tp('currentCredits') },
          { emoji: '📤', value: totalShares, label: tp('totalShares') },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.04] bg-bg-card px-3 py-4">
            <span className="text-base">{stat.emoji}</span>
            <span className="font-oswald text-2xl font-bold text-gold">{stat.value}</span>
            <span className="text-center font-oswald text-[9px] font-medium uppercase tracking-wider text-text-muted">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Settings ───────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-bg-card">
        <button
          onClick={() => setShowLanguage(true)}
          className="flex w-full items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/[0.02] active:bg-white/[0.04]"
        >
          <span className="text-base">🌍</span>
          <span className="flex-1 text-left text-sm text-text-primary">{tp('language')}</span>
          <span className="text-xs text-text-muted">{currentLang}</span>
          <span className="text-xs text-text-muted/50">›</span>
        </button>
        <div className="mx-4 h-px bg-white/[0.04]" />

        <button
          onClick={() => setNotificationsOn(!notificationsOn)}
          className="flex w-full items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/[0.02] active:bg-white/[0.04]"
        >
          <span className="text-base">🔔</span>
          <span className="flex-1 text-left text-sm text-text-primary">{tp('notifications')}</span>
          <ToggleSwitch checked={notificationsOn} />
        </button>
        <div className="mx-4 h-px bg-white/[0.04]" />

        <SettingsRow icon="📄" label={tp('privacy')} onClick={() => {}} />
        <SettingsRow icon="📋" label={tp('terms')} onClick={() => {}} />
        <SettingsRow icon="📧" label={tp('contact')} onClick={() => { if (typeof window !== 'undefined') window.location.href = 'mailto:hello@fanshot.app'; }} />
        <div className="mx-4 h-px bg-white/[0.04]" />
        <SettingsRow icon="🚪" label={tp('logout')} onClick={handleLogout} danger isLast />
      </div>

      {/* ── Version ────────────────────────────────── */}
      <p className="pb-4 text-center text-[10px] text-text-muted/30">FanShot v1.0.0</p>

      {showLanguage && <LanguageSheet onClose={() => setShowLanguage(false)} />}
    </div>
  );
}
