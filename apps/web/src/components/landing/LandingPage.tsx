'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/authStore';
import { GoldButton } from '@/src/components/ui/GoldButton';
import { useT } from '@/src/lib/i18n';

/* ── Data ──────────────────────────────────────────── */

const GALLERY_KEYS = [
  { emoji: '🎉', key: 'goalCelebration' },
  { emoji: '🏆', key: 'trophyPose' },
  { emoji: '⚽', key: 'pitchSide' },
  { emoji: '👕', key: 'lockerRoom' },
  { emoji: '🚶', key: 'tunnel' },
  { emoji: '🎙️', key: 'pressRoom' },
] as const;

const PACKAGES = [
  { name: 'STARTER', price: '$2.99', credits: 5, per: '$0.60/foto' },
  {
    name: 'FAN PACK',
    price: '$6.99',
    credits: 15,
    per: '$0.47/foto',
    featured: true,
    badgeKey: 'popular',
  },
  {
    name: 'SUPER FAN',
    price: '$14.99',
    credits: 50,
    per: '$0.30/foto',
    badgeKey: 'bestValue',
  },
];

/* ── FAQ Item ──────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="pr-4 font-oswald text-sm font-medium uppercase tracking-wide text-text-primary">
          {q}
        </span>
        <span
          className={`flex-shrink-0 text-lg text-text-muted transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-text-secondary">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────── */

export function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const t = useT('landing');
  const tn = useT('nav');
  const tl = useT('legal');

  /* If authenticated, redirect to dashboard */
  if (isAuthenticated) {
    router.replace('/dashboard');
    return null;
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const STEPS = [
    {
      emoji: '📸',
      num: 1,
      title: t('step1Title'),
      desc: t('step1Desc'),
      accent: 'from-gold/20 to-gold/5',
    },
    {
      emoji: '⚽',
      num: 2,
      title: t('step2Title'),
      desc: t('step2Desc'),
      accent: 'from-pitch-green/20 to-pitch-green/5',
    },
    {
      emoji: '🖼️',
      num: 3,
      title: t('step3Title'),
      desc: t('step3Desc'),
      accent: 'from-accent-blue/20 to-accent-blue/5',
    },
  ];

  const FAQ = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
    { q: t('faq6q'), a: t('faq6a') },
  ];

  return (
    <div className="relative min-h-screen bg-bg-primary">
      {/* Floodlights */}
      <div className="floodlight-left" />
      <div className="floodlight-right" />
      <div className="noise-overlay" />

      {/* ────────────────────────────────────────────── */}
      {/* 1. NAVBAR                                      */}
      {/* ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <span className="text-gold-gradient font-oswald text-xl font-bold tracking-wider">
              FANSHOT
            </span>
            <span className="rounded-md bg-pitch-green/15 px-2 py-0.5 font-oswald text-[10px] font-semibold tracking-wider text-pitch-green">
              WC 2026
            </span>
          </div>
          <Link
            href="/login"
            className="font-oswald text-sm font-medium uppercase tracking-wider text-gold transition-colors hover:text-gold-light"
          >
            {tn('login')}
          </Link>
        </div>
      </nav>

      {/* ────────────────────────────────────────────── */}
      {/* 2. HERO                                        */}
      {/* ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-pitch-green/[0.07] via-bg-primary to-bg-primary" />
        {/* Trophy watermark */}
        <div className="pointer-events-none absolute right-0 top-0 select-none text-[280px] leading-none opacity-[0.04]">
          🏆
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            {/* Top label */}
            <p className="mb-4 font-oswald text-xs font-medium uppercase tracking-[0.3em] text-gold-light">
              {t('heroLabel')}
            </p>

            {/* Headline */}
            <h1 className="font-oswald text-4xl font-bold uppercase leading-tight tracking-wide text-text-primary md:text-5xl">
              {t('heroTitle')}
              <br />
              <span className="text-gold-gradient text-[44px] md:text-[56px]">
                {t('heroTitleHighlight')}
              </span>
            </h1>

            {/* Subtext */}
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary md:text-lg">
              {t('heroSubtitle')}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <GoldButton size="large" className="min-w-[200px]">
                  {t('ctaPrimary')}
                </GoldButton>
              </Link>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="min-w-[200px] rounded-xl border border-white/[0.08] bg-transparent px-8 py-3.5 font-oswald text-base font-semibold uppercase tracking-wider text-text-secondary transition-all hover:-translate-y-0.5 hover:border-white/[0.15] hover:text-text-primary"
              >
                {t('ctaSecondary')}
              </button>
            </div>

            {/* Flags */}
            <p className="mt-8 text-sm text-text-muted">
              🇺🇸 🇨🇦 🇲🇽 — {t('stats48teams')}
            </p>

            {/* Stats */}
            <div className="mt-6 flex items-center justify-center gap-6 md:gap-10">
              <div className="text-center">
                <p className="font-oswald text-xl font-bold text-gold md:text-2xl">
                  {t('statsPhotos')}
                </p>
                <p className="text-[11px] text-text-muted">{t('statsPhotosLabel')}</p>
              </div>
              <div className="text-center">
                <p className="font-oswald text-xl font-bold text-gold md:text-2xl">
                  {t('statsUsers')}
                </p>
                <p className="text-[11px] text-text-muted">{t('statsUsersLabel')}</p>
              </div>
              <div className="text-center">
                <p className="font-oswald text-xl font-bold text-gold md:text-2xl">
                  {t('statsRating')}
                </p>
                <p className="text-[11px] text-text-muted">{t('statsRatingLabel')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* 3. HOW IT WORKS                                */}
      {/* ────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-oswald text-2xl font-bold uppercase tracking-wider text-text-primary md:text-3xl">
            {t('howItWorksTitle')}
          </h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-bg-card"
              >
                {/* Top accent stripe */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${step.accent}`}
                />

                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  {/* Emoji */}
                  <span className="text-4xl">{step.emoji}</span>

                  {/* Number badge */}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 font-oswald text-sm font-bold text-gold">
                    {step.num}
                  </span>

                  {/* Title */}
                  <h3 className="font-oswald text-base font-semibold uppercase tracking-wider text-text-primary">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* 4. GALLERY                                     */}
      {/* ────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wider text-text-primary md:text-3xl">
              {t('galleryTitle')}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t('gallerySubtitle')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GALLERY_KEYS.map((item) => (
              <div
                key={item.key}
                className="group flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.04] bg-bg-elevated transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                  {item.emoji}
                </span>
                <span className="font-oswald text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t(item.key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* 5. PRICING                                     */}
      {/* ────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wider text-text-primary md:text-3xl">
              {t('pricingTitle')}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t('pricingSubtitle')}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border px-3 pb-5 pt-6 text-center transition-all ${
                  pkg.featured
                    ? '-translate-y-1 border-gold/40 bg-bg-card shadow-[0_4px_24px_rgba(212,175,55,0.12)]'
                    : 'border-white/[0.06] bg-bg-card'
                }`}
              >
                {/* Badge */}
                {pkg.badgeKey && (
                  <span
                    className={`absolute -top-2.5 right-2 rounded-md px-2 py-0.5 font-oswald text-[9px] font-semibold uppercase tracking-wider ${
                      pkg.featured
                        ? 'bg-gradient-to-r from-gold-dark to-gold text-bg-primary'
                        : 'bg-accent-green/15 text-accent-green'
                    }`}
                  >
                    {t(pkg.badgeKey)}
                  </span>
                )}

                <p className="font-oswald text-[10px] font-light uppercase tracking-[0.2em] text-text-muted">
                  {pkg.name}
                </p>
                <p className="font-oswald text-2xl font-bold text-text-primary">
                  {pkg.price}
                </p>
                <p className="text-[11px] leading-tight text-text-secondary">
                  {pkg.credits} {t('photos')}
                  <br />
                  <span className="text-text-muted">{pkg.per}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Trust line */}
          <p className="mt-8 text-center text-xs text-text-muted">
            {t('pricingTrust')}
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* 6. FAQ                                         */}
      {/* ────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-oswald text-2xl font-bold uppercase tracking-wider text-text-primary md:text-3xl">
            {t('faqTitle')}
          </h2>

          <div className="mt-12">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* 7. CTA BANNER                                  */}
      {/* ────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-pitch-green/20 via-pitch-green/10 to-bg-card px-6 py-12 text-center md:px-12 md:py-16">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wider text-text-primary md:text-3xl">
              {t('ctaBannerTitle')}
              <br />
              <span className="text-gold-gradient">
                {t('ctaBannerHighlight')}
              </span>
            </h2>
            <div className="mt-8">
              <Link href="/register">
                <GoldButton size="large" className="min-w-[220px]">
                  {t('ctaBannerButton')}
                </GoldButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* 8. FOOTER                                      */}
      {/* ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <span className="text-gold-gradient font-oswald text-lg font-bold tracking-wider">
              FANSHOT
            </span>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-muted">
              <a href="#" className="transition-colors hover:text-text-secondary">
                {t('footerPrivacy')}
              </a>
              <span className="text-white/10">·</span>
              <a href="#" className="transition-colors hover:text-text-secondary">
                {t('footerTerms')}
              </a>
              <span className="text-white/10">·</span>
              <a href="#" className="transition-colors hover:text-text-secondary">
                {t('footerContact')}
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <a href="#" className="transition-colors hover:text-text-secondary">
                Twitter
              </a>
              <a href="#" className="transition-colors hover:text-text-secondary">
                Instagram
              </a>
              <a href="#" className="transition-colors hover:text-text-secondary">
                TikTok
              </a>
            </div>

            {/* FIFA Disclaimer */}
            <p className="max-w-md text-center text-[10px] leading-relaxed text-text-muted/50">
              {t('footerDisclaimer')}
            </p>

            {/* AI Disclaimer */}
            <p className="max-w-md text-center text-[10px] leading-relaxed text-text-muted/50">
              🤖 {tl('footerDisclaimer')}
            </p>

            {/* Copyright */}
            <p className="text-[11px] text-text-muted/40">
              {t('copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom pitch grass line */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pitch-green/40 to-transparent" />
    </div>
  );
}
