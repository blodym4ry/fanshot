'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCreateStore } from '@/src/stores/createStore';
import { useCreditStore } from '@/src/stores/creditStore';
import { useAuthStore } from '@/src/stores/authStore';
import { LoadingScreen } from './LoadingScreen';
import { ResultScreen } from './ResultScreen';
import { ErrorScreen } from './ErrorScreen';
import { GoldButton } from '../ui/GoldButton';
import { useT } from '@/src/lib/i18n';
import { compressImages } from '@/src/lib/imageUtils';
import { players, countries, type Player, type CountryFilter } from '@/src/data/players';

/* ─── Scene data with gradient colors ─────────── */

const scenes = [
  { id: 'vip_tunnel', emoji: '🏟️', nameKey: 'vipTunnel', gradient: 'from-gray-900 to-gray-600' },
  { id: 'locker_room', emoji: '🚪', nameKey: 'lockerRoom', gradient: 'from-indigo-800 to-blue-600' },
  { id: 'corridor', emoji: '🚶', nameKey: 'corridor', gradient: 'from-slate-700 to-gray-500' },
  { id: 'pitchside', emoji: '⚽', nameKey: 'pitchside', gradient: 'from-emerald-700 to-green-500' },
  { id: 'press_area', emoji: '🎙️', nameKey: 'pressArea', gradient: 'from-violet-700 to-blue-500' },
  { id: 'pitch_celebration', emoji: '🎉', nameKey: 'pitchCelebration', gradient: 'from-red-600 to-amber-500' },
  { id: 'bench_area', emoji: '🪑', nameKey: 'benchArea', gradient: 'from-amber-700 to-yellow-500' },
  { id: 'mixed_zone', emoji: '🎤', nameKey: 'mixedZone', gradient: 'from-orange-600 to-rose-400' },
  { id: 'warmup', emoji: '🏃', nameKey: 'warmup', gradient: 'from-green-600 to-lime-400' },
  { id: 'fan_zone', emoji: '🎪', nameKey: 'fanZone', gradient: 'from-sky-700 to-cyan-500' },
];

/* ─── Popular player IDs (top 10 by rating) ───── */

const POPULAR_IDS = [
  'ar-1', 'pt-1', 'fr-1', 'gb-1', 'br-1', 'no-1', 'es-1', 'kr-1', 'be-1', 'eg-1',
];

/* ─── Helpers ─────────────────────────────────── */

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/** Map country code to flagcdn URL */
function getFlagUrl(country: CountryFilter): string {
  if (!country.flagImg) return '';
  return `https://flagcdn.com/w80/${country.flagImg}.png`;
}

/** Map player name to ui-avatars URL */
function getAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=random&color=fff&bold=true`;
}

/** Position abbreviation */
const posAbbr: Record<string, string> = {
  Forward: 'FW',
  Midfielder: 'MF',
  Defender: 'DF',
  Goalkeeper: 'GK',
};

/* ─── Group players by country ────────────────── */

function groupByCountry(allPlayers: Player[]): Map<string, Player[]> {
  const map = new Map<string, Player[]>();
  for (const p of allPlayers) {
    const arr = map.get(p.countryCode) || [];
    arr.push(p);
    map.set(p.countryCode, arr);
  }
  map.forEach((arr) => {
    arr.sort((a, b) => b.rating - a.rating);
  });
  return map;
}

/* ═══ MAIN COMPONENT ═══════════════════════════ */

export function CreateFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useT('create');
  const tl = useT('legal');

  const {
    selfieFiles,
    selfiePreviews,
    selectedPlayer,
    selectedScene,
    generationStatus,
    addSelfie,
    removeSelfie,
    clearSelfies,
    setPlayer,
    setScene,
    startGeneration,
    setSubmitted,
    setError,
    reset,
  } = useCreateStore();

  const { credits, spendCredit } = useCreditStore();
  const { user } = useAuthStore();
  const hasCredits = credits > 0;
  const hasSelfies = selfieFiles.length > 0;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 200);
  const [openCountry, setOpenCountry] = useState<string | null>(null);
  const [aiChecked, setAiChecked] = useState(false);

  /* ── Horizontal scroll touch handler (prevents vertical scroll jank on mobile) ── */
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
    if (deltaX > deltaY) {
      e.stopPropagation();
    }
  }, []);

  /* Read ?scene= from URL on first mount */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const sceneParam = searchParams.get('scene');
    if (sceneParam) setScene(sceneParam);
  }, [searchParams, setScene]);

  /* Reset store on unmount */
  useEffect(() => {
    return () => { reset(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Popular players ─────────────────────────── */
  const popularPlayers = useMemo(
    () => POPULAR_IDS.map((id) => players.find((p) => p.id === id)).filter(Boolean) as Player[],
    []
  );

  /* ── Grouped players + search filtering ──────── */
  const playersByCountry = useMemo(() => groupByCountry(players), []);

  const filteredCountryCodes = useMemo(() => {
    const sorted = countries.filter((c) => c.code !== 'ALL').sort((a, b) => a.name.localeCompare(b.name));
    if (!debouncedSearch.trim()) return sorted.map((c) => c.code);
    const q = debouncedSearch.toLowerCase();
    return sorted
      .filter((c) => {
        if (c.name.toLowerCase().includes(q)) return true;
        const cp = playersByCountry.get(c.code);
        return cp?.some((p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q));
      })
      .map((c) => c.code);
  }, [debouncedSearch, playersByCountry]);

  useEffect(() => {
    if (debouncedSearch.trim() && filteredCountryCodes.length > 0) {
      setOpenCountry(filteredCountryCodes[0]);
    }
  }, [debouncedSearch, filteredCountryCodes]);

  const getCountryPlayers = useCallback(
    (code: string): Player[] => {
      const all = playersByCountry.get(code) || [];
      if (!debouncedSearch.trim()) return all;
      const q = debouncedSearch.toLowerCase();
      return all.filter(
        (p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
      );
    },
    [playersByCountry, debouncedSearch]
  );

  /* ── File handlers (multi-photo) ─────────────── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 5 - selfieFiles.length;
    const toAdd = Array.from(files).slice(0, remaining);
    toAdd.forEach((file) => addSelfie(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const openFilePicker = () => fileInputRef.current?.click();

  /* ── Generate handler (fire-and-forget: show submitted screen immediately) ── */
  const handleGenerate = useCallback(async () => {
    if (selfieFiles.length === 0 || !selectedPlayer) return;
    const isFree = credits === 1;
    if (!spendCredit()) return;
    setAiChecked(false);
    startGeneration(isFree);

    try {
      // Compress images client-side: max 1024px, quality 0.8 → ~200-500KB each
      const selfieBase64Array = await compressImages(selfieFiles, 1024, 0.8);

      // Fire the API call — show submitted screen immediately
      setSubmitted();

      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieBase64: selfieBase64Array[0],
          scene: selectedScene,
          playerName: selectedPlayer.name,
          playerCountry: selectedPlayer.country,
          playerTeamColors: selectedPlayer.teamColors?.join(' and ') || '',
          userId: user?.id || 'anonymous',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.imageUrl) {
            console.log('[FanShot] ✅ Generation complete');
          } else {
            console.warn('[FanShot] ⚠️ Generation returned no image:', data.error);
          }
        })
        .catch((err) => {
          console.error('[FanShot] ❌ Generation error:', err);
        });
    } catch {
      setError(t('errorConnection'));
    }
  }, [selfieFiles, selectedPlayer, selectedScene, startGeneration, setSubmitted, setError, spendCredit, credits, t, user?.id]);

  const canGenerate = hasSelfies && selectedPlayer && aiChecked && hasCredits;

  const getMissingText = (): string => {
    if (!hasSelfies) return t('uploadSelfie');
    if (!selectedPlayer) return t('selectPlayer');
    if (!aiChecked) return tl('inlineCheckbox');
    return '';
  };

  /* ═══ Render: Loading / Submitted / Success / Error ════════ */
  if (generationStatus === 'loading') return <LoadingScreen isComplete={false} />;
  if (generationStatus === 'submitted') return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center animate-fade-step">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-spin-slow rounded-full border-[3px] border-transparent border-t-gold border-r-gold/30" />
        <span className="text-5xl">⚽</span>
      </div>
      <div>
        <h2 className="font-oswald text-xl font-bold uppercase tracking-wider text-text-primary">
          {t('submittedTitle')}
        </h2>
        <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-text-secondary">
          {t('submittedDesc')}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/gallery')}
          className="rounded-xl bg-gradient-to-r from-gold to-amber-500 px-6 py-3 font-oswald text-sm font-bold uppercase tracking-wider text-bg-primary shadow-lg shadow-gold/20 transition-all hover:shadow-gold/40"
        >
          {t('goToGallery')}
        </button>
        <button
          onClick={() => reset()}
          className="rounded-xl border border-white/[0.1] bg-bg-card px-6 py-3 font-oswald text-sm font-medium uppercase tracking-wider text-text-secondary transition-all hover:border-white/[0.2]"
        >
          {t('createAnother')}
        </button>
      </div>
    </div>
  );
  if (generationStatus === 'success') return <div className="animate-fade-step"><ResultScreen /></div>;
  if (generationStatus === 'error') return <div className="animate-fade-step"><ErrorScreen /></div>;

  /* ═══ Render: Create Flow ═════════════════════ */
  return (
    <div className="flex flex-col gap-5 pb-40">
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

      {/* ═══ SECTION 1: SELFIE UPLOAD (1-5 photos) ═══ */}
      <section>
        <h3 className="mb-2.5 font-oswald text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          📸 {t('uploadMultiple')}
        </h3>

        {selfiePreviews.length > 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-bg-card px-3 py-3">
            <div className="scrollbar-none -mx-1 mb-2 flex gap-2 overflow-x-auto px-1">
              {selfiePreviews.map((url, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <div className="h-[44px] w-[44px] overflow-hidden rounded-full border-2 border-gold/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Selfie ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <button
                    onClick={() => removeSelfie(i)}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {selfieFiles.length < 5 && (
                <button
                  onClick={openFilePicker}
                  className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gold/25 text-lg text-gold/50 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  +
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-text-muted">{t('uploadTip')}</p>
              <button
                onClick={() => { clearSelfies(); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="rounded-lg border border-white/[0.08] px-2 py-1 font-oswald text-[10px] font-medium uppercase tracking-wider text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
              >
                {t('change')}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={openFilePicker}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gold/25 bg-bg-card/50 px-4 py-5 transition-all duration-300 hover:border-gold/50 hover:bg-bg-card active:scale-[0.98]"
          >
            <span className="text-3xl transition-transform duration-300 group-hover:scale-110">📸</span>
            <div className="text-left">
              <p className="font-oswald text-sm font-semibold uppercase tracking-wider text-text-primary">{t('uploadMultiple')}</p>
              <p className="text-xs text-text-muted">{t('uploadTip')}</p>
            </div>
          </button>
        )}
      </section>

      {/* ═══ SECTION 2: PLAYER SELECT ════════════ */}
      <section>
        <h3 className="mb-2.5 font-oswald text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          ⚽ {t('selectPlayer')}
        </h3>

        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input
            type="text"
            placeholder={t('searchPlayer')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-gold/40"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              ✕
            </button>
          )}
        </div>

        {!debouncedSearch.trim() && (
          <div className="mb-4">
            <p className="mb-2 font-oswald text-[11px] font-semibold uppercase tracking-[0.15em] text-gold/70">
              ⭐ {t('popular')}
            </p>
            <div className="scrollbar-none -mx-4 overflow-x-auto px-4">
              <div className="flex gap-2.5">
                {popularPlayers.map((p) => (
                  <MiniPlayerCard key={p.id} player={p} isSelected={selectedPlayer?.id === p.id} onSelect={() => setPlayer(p)} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          {filteredCountryCodes.map((code, idx) => {
            const country = countries.find((c) => c.code === code);
            if (!country) return null;
            const countryPlayers = getCountryPlayers(code);
            if (countryPlayers.length === 0) return null;
            const isOpen = openCountry === code;
            return (
              <div key={code}>
                {idx > 0 && <div className="mx-3 h-px bg-white/[0.04]" />}
                <button
                  onClick={() => setOpenCountry(isOpen ? null : code)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="h-7 w-10 flex-shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
                    <Image src={getFlagUrl(country)} alt={country.name} width={40} height={28} className="h-full w-full object-cover" unoptimized />
                  </div>
                  <span className="flex-1 text-left font-oswald text-sm font-medium text-text-primary">{country.name}</span>
                  <span className="text-[11px] text-text-muted">{countryPlayers.length} {countryPlayers.length === 1 ? 'player' : 'players'}</span>
                  <svg className={`h-4 w-4 flex-shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[160px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="scrollbar-none overflow-x-auto px-3 pb-3 pt-1">
                    <div className="flex gap-2">
                      {countryPlayers.map((p) => (
                        <MiniPlayerCard key={p.id} player={p} isSelected={selectedPlayer?.id === p.id} onSelect={() => setPlayer(p)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCountryCodes.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm text-text-muted">{t('noPlayersFound')}</p>
          </div>
        )}
      </section>

      {/* ═══ SECTION 3: SCENE SELECT ═════════════ */}
      <section>
        <h3 className="mb-2.5 font-oswald text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          🎬 {t('selectScene')}
        </h3>
        <div
          className="scrollbar-none -mx-4 snap-x snap-mandatory overflow-x-auto overflow-y-hidden px-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="flex gap-2.5">
            {scenes.map((scene) => {
              const isActive = selectedScene === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => setScene(scene.id)}
                  className={`flex w-[100px] flex-shrink-0 snap-center flex-col overflow-hidden rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'scale-105 border-gold/60 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`relative flex h-[80px] items-center justify-center bg-gradient-to-br ${scene.gradient}`}>
                    <span className="text-4xl opacity-60">{scene.emoji}</span>
                    {isActive && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-bg-primary">✓</div>
                    )}
                  </div>
                  <div className="bg-bg-card px-1.5 py-2">
                    <p className="line-clamp-2 text-center font-oswald text-[10px] font-medium uppercase leading-tight tracking-wider text-text-primary">{t(scene.nameKey)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ STICKY BOTTOM BAR (above BottomTabBar) ═══ */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-white/[0.06] bg-bg-secondary/95 backdrop-blur-lg">
        <div className="mx-auto max-w-[480px] px-4 py-2.5">
          {/* AI Disclaimer */}
          <label className="mb-2 flex cursor-pointer items-start gap-2.5">
            <div className="relative mt-0.5 flex-shrink-0">
              <input type="checkbox" checked={aiChecked} onChange={(e) => setAiChecked(e.target.checked)} className="peer sr-only" />
              <div className="h-4 w-4 rounded border-2 border-white/20 bg-bg-primary transition-all peer-checked:border-gold peer-checked:bg-gold/20" />
              {aiChecked && (
                <svg className="absolute left-0.5 top-0.5 h-3 w-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-[11px] leading-relaxed text-text-muted">{tl('inlineCheckbox')}</span>
          </label>

          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 overflow-hidden">
              {selfiePreviews.length > 0 && (
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-gold/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selfiePreviews[0]} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              {hasSelfies && selectedPlayer ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate font-oswald text-xs font-medium text-text-primary">
                    {selectedPlayer.countryFlag} {selectedPlayer.name}
                  </p>
                  <p className="truncate text-[10px] text-text-muted">
                    {scenes.find((s) => s.id === selectedScene)?.emoji}{' '}
                    {t(scenes.find((s) => s.id === selectedScene)?.nameKey || 'vipTunnel')}
                    {selfieFiles.length > 1 && ` · ${selfieFiles.length} photos`}
                  </p>
                </div>
              ) : (
                <p className="truncate text-xs text-text-muted">{getMissingText()}</p>
              )}
            </div>
            {hasCredits ? (
              <GoldButton size="small" disabled={!canGenerate} onClick={handleGenerate} className="flex-shrink-0">
                ⚡ {t('generateShort')}
              </GoldButton>
            ) : (
              <Link href="/credits">
                <GoldButton size="small" variant="outline" className="flex-shrink-0">{t('buyCreditsShort')}</GoldButton>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ MINI PLAYER CARD ═══ */

function MiniPlayerCard({ player, isSelected, onSelect }: { player: Player; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`relative flex w-[70px] flex-shrink-0 flex-col items-center gap-1 rounded-xl border p-1.5 pt-2 transition-all duration-200 active:scale-[0.95] ${
        isSelected
          ? 'border-gold/60 bg-gold/[0.06] shadow-[0_0_16px_rgba(212,175,55,0.15)]'
          : 'border-white/[0.04] bg-bg-card hover:border-white/[0.1]'
      }`}
    >
      <div className="relative h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-full" style={{ border: `2px solid ${player.teamColors[0]}` }}>
        <Image src={getAvatarUrl(player.name)} alt={player.name} width={52} height={52} className="h-full w-full object-cover" unoptimized />
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gold/30">
            <span className="text-sm font-bold text-white drop-shadow">✓</span>
          </div>
        )}
      </div>
      <p className="line-clamp-2 w-full text-center font-oswald text-[10px] font-bold leading-tight text-text-primary">{player.name}</p>
      <p className="text-[9px] text-text-muted">{posAbbr[player.position] || 'FW'} · #{player.number}</p>
    </button>
  );
}
