'use client';

import { useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCreateStore } from '@/src/stores/createStore';
import { useGalleryStore } from '@/src/stores/galleryStore';
import { showToast } from '@/src/stores/toastStore';
import { GoldButton } from '../ui/GoldButton';
import { useT } from '@/src/lib/i18n';

export function ResultScreen() {
  const { generatedImageUrl, selectedScene, selectedPlayer, wasFreeGeneration, reset } = useCreateStore();
  const { addGeneration } = useGalleryStore();
  const t = useT('create');
  const ts = useT('share');
  const tl = useT('legal');
  const tg = useT('gallery');
  const tr = useT('result');

  /* Save to gallery store once when result arrives */
  const savedRef = useRef(false);
  useEffect(() => {
    if (generatedImageUrl && !savedRef.current) {
      savedRef.current = true;
      addGeneration({
        id: `gen-${Date.now()}`,
        outputImageUrl: generatedImageUrl,
        sceneType: selectedScene || 'celebration',
        playerStyle: selectedPlayer?.name || 'unknown',
        createdAt: new Date().toISOString(),
      });
    }
  }, [generatedImageUrl, selectedScene, selectedPlayer, addGeneration]);

  /* Generate a mock share URL for this generation */
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const id = `mock-${Date.now()}`;
    return `${window.location.origin}/share/${id}`;
  }, []);

  /* ── Download as PNG ─────────────────────────────── */
  const handleDownload = useCallback(async () => {
    if (!generatedImageUrl) return;
    try {
      const res = await fetch(generatedImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fanshot-wc2026-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(ts('downloadSuccess'));
    } catch {
      window.open(generatedImageUrl, '_blank');
    }
  }, [generatedImageUrl, ts]);

  /* ── Instagram: download + copy caption ──────────── */
  const handleInstagram = useCallback(async () => {
    if (!generatedImageUrl) return;
    try {
      const res = await fetch(generatedImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fanshot-wc2026-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      await navigator.clipboard.writeText(`${ts('shareCaption')}\n${shareUrl}`);
      showToast(ts('instagramSuccess'));
    } catch {
      showToast(ts('downloadFailed'));
    }
  }, [generatedImageUrl, shareUrl, ts]);

  /* ── X / Twitter ─────────────────────────────────── */
  const handleTwitter = useCallback(async () => {
    const text = encodeURIComponent(ts('shareCaption'));
    const url = encodeURIComponent(shareUrl);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FanShot - World Cup 2026', text: ts('shareCaption'), url: shareUrl });
        return;
      } catch { /* user cancelled */ }
    }
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
  }, [shareUrl, ts]);

  /* ── WhatsApp ────────────────────────────────────── */
  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`${ts('shareCaption')}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, [shareUrl, ts]);

  /* ── Copy share link ─────────────────────────── */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(ts('linkCopied'));
    } catch {
      showToast(ts('copyFailed'));
    }
  }, [shareUrl, ts]);

  /* ── New photo ───────────────────────────────────── */
  const handleNewPhoto = () => { reset(); };

  if (!generatedImageUrl) return null;

  const shareButtons = [
    { emoji: '💾', labelKey: 'download', onClick: handleDownload },
    { emoji: '📸', labelKey: 'instagram', onClick: handleInstagram },
    { emoji: '🐦', labelKey: 'twitter', onClick: handleTwitter },
    { emoji: '💬', labelKey: 'whatsapp', onClick: handleWhatsApp },
    { emoji: '📋', labelKey: 'copyLink', onClick: handleCopyLink },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Generated image with watermark */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-gold/15 shadow-[0_8px_40px_rgba(212,175,55,0.1)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={generatedImageUrl} alt="AI World Cup Photo" className="h-auto w-full" />

        {/* ── WATERMARK OVERLAY ─── */}
        {wasFreeGeneration ? (
          <>
            {/* Big center watermark for FREE generations */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none font-oswald text-5xl font-extrabold tracking-[0.3em] text-white/25 [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]">
                FANSHOT
              </span>
            </div>
            {/* Bottom banner */}
            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center backdrop-blur-sm">
              <p className="font-oswald text-[11px] font-medium tracking-wider text-white/80">
                AI Generated · Upgrade to remove watermark
              </p>
            </div>
          </>
        ) : (
          /* Minimal watermark for PAID generations */
          <div className="absolute bottom-2 right-2 rounded bg-black/30 px-2 py-0.5 backdrop-blur-sm">
            <span className="font-oswald text-[9px] font-medium tracking-wider text-white/40">
              FanShot
            </span>
          </div>
        )}
      </div>

      {/* Watermark notice for free users */}
      {wasFreeGeneration && (
        <Link
          href="/credits"
          className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-2.5 transition-all hover:bg-gold/10"
        >
          <span className="text-sm">🪙</span>
          <p className="text-xs font-medium text-gold">{tr('watermarkNotice')}</p>
          <span className="text-xs text-gold/50">→</span>
        </Link>
      )}

      {/* AI Generated banner */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-bg-card px-4 py-2.5">
        <span className="text-sm">🤖</span>
        <p className="text-xs text-text-muted">{tl('resultBanner')}</p>
      </div>

      {/* Share buttons -- horizontal scroll */}
      <div className="-mx-4 w-[calc(100%+32px)]">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4">
          {shareButtons.map((btn) => (
            <button
              key={btn.labelKey}
              onClick={btn.onClick}
              className="flex min-w-[72px] flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-bg-card px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-white/[0.12] active:scale-[0.95]"
            >
              <span className="text-2xl">{btn.emoji}</span>
              <span className="whitespace-nowrap font-oswald text-[9px] font-medium uppercase tracking-wider text-text-secondary">
                {ts(btn.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Go to Gallery link */}
      <Link href="/gallery" className="text-center text-xs text-gold/70 underline underline-offset-2 transition-colors hover:text-gold">
        {tg('goToGallery')}
      </Link>

      {/* New photo CTA */}
      <GoldButton size="large" className="w-full" onClick={handleNewPhoto}>
        {t('newPhoto')}
      </GoldButton>

      {/* Branding */}
      <p className="text-center text-xs text-text-muted">{t('madeWith')}</p>
    </div>
  );
}
