'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useGalleryStore, Generation } from '@/src/stores/galleryStore';
import { useCreditStore } from '@/src/stores/creditStore';
import { showToast } from '@/src/stores/toastStore';
import { GoldButton } from '../ui/GoldButton';
import { useT } from '@/src/lib/i18n';

/* ── Scene label map (current + legacy backward-compat) ── */
const sceneMap: Record<string, { emoji: string; nameKey: string }> = {
  /* Current scenes */
  vip_tunnel: { emoji: '🏟️', nameKey: 'vipTunnel' },
  locker_room: { emoji: '🚪', nameKey: 'lockerRoom' },
  corridor: { emoji: '🚶', nameKey: 'corridor' },
  pitchside: { emoji: '⚽', nameKey: 'pitchside' },
  press_area: { emoji: '🎙️', nameKey: 'pressArea' },
  pitch_celebration: { emoji: '🎉', nameKey: 'pitchCelebration' },
  bench_area: { emoji: '🪑', nameKey: 'benchArea' },
  mixed_zone: { emoji: '🎤', nameKey: 'mixedZone' },
  warmup: { emoji: '🏃', nameKey: 'warmup' },
  fan_zone: { emoji: '🎪', nameKey: 'fanZone' },
  /* Legacy scene IDs for backward compat */
  tunnel_encounter: { emoji: '🏟️', nameKey: 'vipTunnel' },
  pitchside_quick: { emoji: '⚽', nameKey: 'pitchside' },
  training_ground: { emoji: '🏃', nameKey: 'warmup' },
  hotel_encounter: { emoji: '🚪', nameKey: 'lockerRoom' },
  stadium_exit: { emoji: '🏟️', nameKey: 'vipTunnel' },
  celebration_moment: { emoji: '🎉', nameKey: 'pitchCelebration' },
  autograph_line: { emoji: '🪑', nameKey: 'benchArea' },
  warmup_pitch: { emoji: '🏃', nameKey: 'warmup' },
  airport_arrival: { emoji: '🎪', nameKey: 'fanZone' },
  corner_flag: { emoji: '⚽', nameKey: 'pitchside' },
  celebration: { emoji: '🎉', nameKey: 'pitchCelebration' },
  tunnel: { emoji: '🏟️', nameKey: 'vipTunnel' },
  trophy: { emoji: '🎉', nameKey: 'pitchCelebration' },
  press_conference: { emoji: '🎙️', nameKey: 'pressArea' },
};

/* ── Photo Detail Modal ────────────────────────────── */
function PhotoDetailModal({
  generation,
  onClose,
  onDelete,
}: {
  generation: Generation;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const tg = useT('gallery');
  const tc = useT('create');
  const ts = useT('share');

  const scene = sceneMap[generation.sceneType];
  const playerName = generation.playerStyle;

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch(generation.outputImageUrl);
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
      window.open(generation.outputImageUrl, '_blank');
    }
  }, [generation.outputImageUrl, ts]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FanShot - World Cup 2026',
          text: ts('shareCaption'),
          url: window.location.origin,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.origin);
      showToast(ts('linkCopied'));
    } catch {
      showToast(ts('copyFailed'));
    }
  }, [ts]);

  const handleDelete = () => {
    onDelete(generation.id);
    onClose();
  };

  const createdDate = new Date(generation.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-elevated">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:text-white"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generation.outputImageUrl}
            alt="AI World Cup Photo"
            className="h-auto w-full"
          />
          {/* AI badge */}
          <div className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 backdrop-blur-sm">
            <span className="font-oswald text-[10px] font-medium tracking-wider text-white/60">
              AI
            </span>
          </div>
        </div>

        {/* Info section */}
        <div className="flex flex-col gap-3 p-4">
          {/* Scene & Style */}
          <div className="flex gap-3">
            {scene && (
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5">
                <span className="text-sm">{scene.emoji}</span>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-text-muted">{tg('scene')}</p>
                  <p className="font-oswald text-xs font-medium text-text-primary">{tc(scene.nameKey)}</p>
                </div>
              </div>
            )}
            {playerName && (
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5">
                <span className="text-sm">⚽</span>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-text-muted">{tg('scene')}</p>
                  <p className="font-oswald text-xs font-medium text-text-primary">{playerName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <p className="text-[10px] text-text-muted">
            {tg('created')}: {createdDate}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-bg-card px-3 py-2.5 transition-all hover:border-white/[0.12]"
            >
              <span className="text-base">💾</span>
              <span className="font-oswald text-xs font-medium uppercase tracking-wider text-text-secondary">
                {ts('download')}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-bg-card px-3 py-2.5 transition-all hover:border-white/[0.12]"
            >
              <span className="text-base">🔗</span>
              <span className="font-oswald text-xs font-medium uppercase tracking-wider text-text-secondary">
                {ts('copyLink')}
              </span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-bg-card px-3 py-2.5 transition-all hover:border-red-500/40"
            >
              <span className="text-base">🗑️</span>
              <span className="font-oswald text-xs font-medium uppercase tracking-wider text-red-400">
                {tg('delete')}
              </span>
            </button>
          </div>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
              <p className="mb-3 text-center text-xs text-red-300">
                {tg('deleteConfirm')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-lg border border-white/[0.06] bg-bg-card py-2 font-oswald text-xs font-medium uppercase tracking-wider text-text-secondary transition-all hover:border-white/[0.12]"
                >
                  {tg('cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-500/20 py-2 font-oswald text-xs font-medium uppercase tracking-wider text-red-400 transition-all hover:bg-red-500/30"
                >
                  {tg('delete')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Gallery View ─────────────────────────────── */
export function GalleryView() {
  const { generations, removeGeneration, fetchGenerations } = useGalleryStore();
  const { credits } = useCreditStore();
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
  const tg = useT('gallery');
  const tc = useT('create');

  // Refresh on mount + poll every 10s for new generations
  useEffect(() => {
    fetchGenerations();
    const interval = setInterval(fetchGenerations, 10000);
    return () => clearInterval(interval);
  }, [fetchGenerations]);

  const showWatermarkOverlay = credits === 0;

  /* ── Empty state ──────────────────────────────────── */
  if (generations.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-oswald text-lg font-bold uppercase tracking-[0.15em] text-text-primary">
            {tg('title')}
          </h2>
          <span className="font-oswald text-sm text-text-muted">
            0 {tg('photoCount')}
          </span>
        </div>

        {/* Empty visual */}
        <div className="flex flex-col items-center gap-4 py-16">
          <span className="text-6xl opacity-30">🖼️</span>
          <h3 className="font-oswald text-lg font-semibold text-text-primary">
            {tg('empty')}
          </h3>
          <p className="text-sm text-text-secondary">
            {tg('emptySubtitle')}
          </p>
          <Link href="/create">
            <GoldButton size="large">
              {tg('createButton')}
            </GoldButton>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Gallery grid ─────────────────────────────────── */
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-oswald text-lg font-bold uppercase tracking-[0.15em] text-text-primary">
          {tg('title')}
        </h2>
        <span className="font-oswald text-sm text-text-muted">
          {generations.length} {tg('photoCount')}
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-2">
        {generations.map((gen) => {
          const scene = sceneMap[gen.sceneType];
          return (
            <button
              key={gen.id}
              onClick={() => setSelectedGen(gen)}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/[0.04] transition-all hover:border-white/[0.12] active:scale-[0.97]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gen.outputImageUrl}
                alt="AI Photo"
                className="h-full w-full object-cover"
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
              {/* Scene label */}
              {scene && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="text-xs">{scene.emoji}</span>
                  <span className="font-oswald text-[10px] font-medium tracking-wider text-white/80">
                    {tc(scene.nameKey)}
                  </span>
                </div>
              )}
              {/* AI badge */}
              <div className="absolute bottom-2 right-2 rounded bg-white/10 px-1.5 py-0.5 backdrop-blur-sm">
                <span className="font-oswald text-[9px] font-bold tracking-wider text-white/50">
                  AI
                </span>
              </div>

              {/* Watermark removal overlay — shown when user has 0 credits */}
              {showWatermarkOverlay && (
                <Link
                  href="/credits"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-1 right-1 top-2 z-10 flex items-center justify-center gap-1 rounded-lg bg-black/60 px-2 py-1.5 backdrop-blur-sm transition-all hover:bg-black/75"
                >
                  <span className="text-[10px]">🪙</span>
                  <span className="font-oswald text-[9px] font-semibold uppercase tracking-wider text-gold">
                    {tg('removeWatermark')}
                  </span>
                </Link>
              )}
            </button>
          );
        })}
      </div>

      {/* Photo detail modal */}
      {selectedGen && (
        <PhotoDetailModal
          generation={selectedGen}
          onClose={() => setSelectedGen(null)}
          onDelete={removeGeneration}
        />
      )}
    </div>
  );
}
