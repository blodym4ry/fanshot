'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GoldButton } from '@/src/components/ui/GoldButton';
import { useCreditStore } from '@/src/stores/creditStore';
import { useT } from '@/src/lib/i18n';

/* ─── Mock Data ──────────────────────────────────────── */

interface Match {
  flag1Code: string;
  country1: string;
  flag2Code: string;
  country2: string;
  time: string;
  stadium: string;
}

const todayMatches: Match[] = [
  { flag1Code: 'ar', country1: 'Argentina', flag2Code: 'fr', country2: 'France', time: '18:00', stadium: 'MetLife Stadium' },
  { flag1Code: 'br', country1: 'Brazil', flag2Code: 'de', country2: 'Germany', time: '21:00', stadium: 'SoFi Stadium' },
  { flag1Code: 'es', country1: 'Spain', flag2Code: 'gb-eng', country2: 'England', time: '15:00', stadium: 'AT&T Stadium' },
];

interface FixtureDay {
  date: string;
  label?: string;
  matches: { flag1: string; country1: string; flag2: string; country2: string; stadium: string }[];
}

const fixtures: FixtureDay[] = [
  {
    date: 'June 11',
    label: 'Opening Day',
    matches: [
      { flag1: 'mx', country1: 'Mexico', flag2: 'jp', country2: 'Japan', stadium: 'Azteca Stadium' },
    ],
  },
  {
    date: 'June 12',
    matches: [
      { flag1: 'us', country1: 'USA', flag2: 'kr', country2: 'South Korea', stadium: 'Rose Bowl' },
      { flag1: 'tr', country1: 'Turkey', flag2: 'sn', country2: 'Senegal', stadium: 'BMO Stadium' },
    ],
  },
  {
    date: 'June 13',
    matches: [
      { flag1: 'pt', country1: 'Portugal', flag2: 'ng', country2: 'Nigeria', stadium: 'Hard Rock Stadium' },
      { flag1: 'nl', country1: 'Netherlands', flag2: 'ec', country2: 'Ecuador', stadium: 'NRG Stadium' },
    ],
  },
];

const tournamentStats = [
  { emoji: '🏟️', value: '16', label: 'Cities' },
  { emoji: '⚽', value: '104', label: 'Matches' },
  { emoji: '👥', value: '48', label: 'Teams' },
  { emoji: '📅', value: '39', label: 'Days' },
  { emoji: '🌎', value: '3', label: 'Countries' },
];

const newsItems = [
  { gradient: 'from-emerald-700 to-blue-600', text: 'World Cup 2026 squads announced!' },
  { gradient: 'from-gold-dark to-amber-500', text: 'Most expensive XI: The star squad of the tournament' },
  { gradient: 'from-violet-700 to-rose-500', text: 'Stadiums ready: Views from 16 cities' },
];

function getFlagUrl(code: string): string {
  return `https://flagcdn.com/w80/${code}.png`;
}

/* ─── Dashboard Page ─────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const { credits } = useCreditStore();
  const t = useT('dashboard');

  /** Navigate to /create if user has credits, /credits otherwise */
  const handleCreateClick = () => {
    router.push(credits > 0 ? '/create' : '/credits');
  };

  return (
    <div className="space-y-5">
      {/* ═══ HERO — Create CTA (compact) ═══════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-pitch-green/20 to-bg-card p-5">
        <span className="pointer-events-none absolute -right-4 -top-2 select-none text-[100px] opacity-[0.08] rotate-12">🏆</span>
        <div className="relative z-10">
          <p className="font-oswald text-[10px] font-light uppercase tracking-[0.25em] text-gold-light">{t('wcLabel')}</p>
          <h2 className="mt-2 font-oswald text-xl font-bold leading-tight text-text-primary">{t('heroTitle')}</h2>
          <h2 className="text-gold-gradient font-oswald text-xl font-bold leading-tight">{t('heroHighlight')}</h2>
          <p className="mt-2 text-xs leading-relaxed text-text-primary/60">{t('heroSubtitle')}</p>
          <div className="mt-4">
            <GoldButton size="small" onClick={() => handleCreateClick()}>{t('createButton')}</GoldButton>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {['🇺🇸', '🇨🇦', '🇲🇽'].map((f) => (
              <span key={f} className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06] text-xs">{f}</span>
            ))}
            <span className="font-oswald text-[10px] font-light tracking-wider text-text-muted">{t('teamsInfo')}</span>
          </div>
        </div>
      </div>

      {/* ═══ SECTION A: Today's Matches ════════════════ */}
      <section>
        <h3 className="mb-3 font-oswald text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t('todayMatches')}
        </h3>
        <div className="space-y-2">
          {todayMatches.map((m, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-bg-card px-3 py-2.5">
              {/* Team 1 */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-7 overflow-hidden rounded-sm bg-white/[0.04]">
                  <Image src={getFlagUrl(m.flag1Code)} alt={m.country1} width={28} height={20} className="h-full w-full object-cover" unoptimized />
                </div>
                <span className="font-oswald text-xs font-medium text-text-primary">{m.country1}</span>
              </div>

              <span className="font-oswald text-[10px] font-bold text-text-muted">vs</span>

              {/* Team 2 */}
              <div className="flex items-center gap-2">
                <span className="font-oswald text-xs font-medium text-text-primary">{m.country2}</span>
                <div className="h-5 w-7 overflow-hidden rounded-sm bg-white/[0.04]">
                  <Image src={getFlagUrl(m.flag2Code)} alt={m.country2} width={28} height={20} className="h-full w-full object-cover" unoptimized />
                </div>
              </div>

              {/* Time + Stadium */}
              <div className="ml-auto flex-shrink-0 text-right">
                <p className="font-oswald text-[10px] font-medium text-gold">{m.time}</p>
                <p className="text-[9px] text-text-muted">{m.stadium}</p>
              </div>

              {/* Photo button */}
              <button
                onClick={() => handleCreateClick()}
                className="flex-shrink-0 rounded-lg bg-gold/10 px-2 py-1.5 text-[10px] font-medium text-gold transition-colors hover:bg-gold/20"
              >
                📸
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION B: Upcoming Fixtures ═════════════ */}
      <section>
        <h3 className="mb-3 font-oswald text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t('fixtures')}
        </h3>
        <div className="space-y-3">
          {fixtures.map((day, di) => (
            <div key={di}>
              <p className="mb-1.5 font-oswald text-[11px] font-semibold uppercase tracking-wider text-gold/70">
                {day.date}{day.label ? ` — ${day.label}` : ''}
              </p>
              <div className="space-y-1.5">
                {day.matches.map((m, mi) => (
                  <div key={mi} className="flex items-center gap-2.5 rounded-lg border border-white/[0.04] bg-bg-card/50 px-3 py-2">
                    <div className="h-4 w-6 overflow-hidden rounded-sm bg-white/[0.04]">
                      <Image src={getFlagUrl(m.flag1)} alt={m.country1} width={24} height={16} className="h-full w-full object-cover" unoptimized />
                    </div>
                    <span className="font-oswald text-[11px] font-medium text-text-primary">{m.country1}</span>
                    <span className="text-[9px] text-text-muted">vs</span>
                    <span className="font-oswald text-[11px] font-medium text-text-primary">{m.country2}</span>
                    <div className="h-4 w-6 overflow-hidden rounded-sm bg-white/[0.04]">
                      <Image src={getFlagUrl(m.flag2)} alt={m.country2} width={24} height={16} className="h-full w-full object-cover" unoptimized />
                    </div>
                    <span className="ml-auto text-[9px] text-text-muted">{m.stadium}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION C: Tournament Stats ═════════════ */}
      <section>
        <h3 className="mb-3 font-oswald text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t('stats')}
        </h3>
        <div className="scrollbar-none -mx-4 overflow-x-auto px-4">
          <div className="flex gap-2.5">
            {tournamentStats.map((stat) => (
              <div key={stat.label} className="flex w-[90px] flex-shrink-0 flex-col items-center gap-1.5 rounded-xl border border-white/[0.04] bg-bg-card px-3 py-4">
                <span className="text-lg">{stat.emoji}</span>
                <span className="font-oswald text-2xl font-bold text-gold">{stat.value}</span>
                <span className="font-oswald text-[9px] font-medium uppercase tracking-wider text-text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION D: News Placeholder ═════════════ */}
      <section>
        <h3 className="mb-3 font-oswald text-sm font-semibold uppercase tracking-widest text-text-muted">
          {t('news')}
        </h3>
        <div className="space-y-2.5">
          {newsItems.map((item, i) => (
            <div key={i} className={`overflow-hidden rounded-xl bg-gradient-to-r ${item.gradient} p-4`}>
              <p className="font-oswald text-sm font-semibold leading-snug text-white">{item.text}</p>
              <p className="mt-2 text-[10px] text-white/40">FanShot News · Coming Soon</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM: Create CTA Repeat ══════════════ */}
      <div className="rounded-2xl border border-gold/15 bg-bg-card p-5 text-center">
        <p className="mb-3 font-oswald text-sm font-medium text-text-primary">
          {t('ctaRepeat')}
        </p>
        <GoldButton size="small" onClick={() => handleCreateClick()}>
          {t('createButton')}
        </GoldButton>
      </div>
    </div>
  );
}
