import type { Metadata } from 'next';
import Link from 'next/link';
import { GoldButton } from '@/src/components/ui/GoldButton';
import en from '@/src/messages/en.json';

/* ── SEO Meta Tags ─────────────────────────────────── */

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;

  // TODO: Fetch actual generation data from Supabase when connected
  const ogImage = `https://placehold.co/1200x630/08080F/D4AF37?text=FanShot+WC2026&font=oswald`;

  const title = 'FanShot — AI World Cup 2026 Photo';
  const description = en.share.shareCaption;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'FanShot AI World Cup Photo',
        },
      ],
      siteName: 'FanShot',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    other: {
      'generation-id': id,
    },
  };
}

/* ── Page Component ────────────────────────────────── */

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  // TODO: Fetch generation from Supabase by id
  const photoUrl = `https://placehold.co/800x1000/08080F/D4AF37?text=FanShot%0AWC2026%0A${id.slice(0, 8)}&font=oswald`;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4 py-8">
      {/* Stadium floodlight effects */}
      <div className="floodlight-left" />
      <div className="floodlight-right" />
      <div className="noise-overlay" />

      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center gap-8">
        {/* ── Logo + Badge ──────────────────────────── */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-gold-gradient font-oswald text-3xl font-bold tracking-wider">
            FANSHOT
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-base">⚽</span>
            <span className="font-oswald text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
              {en.common.worldCup}
            </span>
          </div>
        </div>

        {/* ── Shared Photo ──────────────────────────── */}
        <div className="w-full overflow-hidden rounded-2xl border border-gold/20 shadow-[0_0_60px_rgba(212,175,55,0.08)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="FanShot AI World Cup Photo"
            className="h-auto w-full"
          />
        </div>

        {/* ── Caption ───────────────────────────────── */}
        <p className="text-center text-sm text-text-secondary">
          {en.share.madeWith}{' '}
          <span className="font-semibold text-gold">{en.share.madeWithBrand}</span>
        </p>

        {/* ── AI Disclaimer ───────────────────────────── */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-bg-card px-4 py-2.5">
          <span className="text-sm">🤖</span>
          <p className="text-xs text-text-muted">
            {en.legal.resultBanner}
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <Link href="/" className="w-full">
          <GoldButton size="large" className="w-full">
            {en.share.tryIt}
          </GoldButton>
        </Link>

        {/* ── Stats ─────────────────────────────────── */}
        <p className="text-xs text-text-muted">
          🌍{' '}
          <span className="font-oswald font-semibold text-text-secondary">
            {en.share.usersCount}
          </span>{' '}
          {en.share.usersCountLabel}
        </p>
      </div>

      {/* ── Bottom pitch grass line ─────────────────── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pitch-green/40 to-transparent" />
    </div>
  );
}
