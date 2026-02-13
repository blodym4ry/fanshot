'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCreditStore } from '@/src/stores/creditStore';
import { useT } from '@/src/lib/i18n';

const tabs = [
  { id: 'home', labelKey: 'home', icon: '🏠', route: '/dashboard' },
  { id: 'gallery', labelKey: 'gallery', icon: '🖼️', route: '/gallery' },
  { id: 'create', labelKey: 'create', icon: '➕', route: '/create' },
  { id: 'credits', labelKey: 'credits', icon: '🪙', route: '/credits' },
  { id: 'profile', labelKey: 'profile', icon: '👤', route: '/profile' },
];

const routeToTab: Record<string, string> = {
  '/dashboard': 'home',
  '/gallery': 'gallery',
  '/create': 'create',
  '/credits': 'credits',
  '/profile': 'profile',
};

export function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { credits } = useCreditStore();
  const t = useT('nav');

  const activeTab = routeToTab[pathname] || 'home';

  const handleTabClick = (route: string) => {
    router.push(route);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.04] bg-bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around px-2 pb-safe">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCreate = tab.id === 'create';
          const isCredits = tab.id === 'credits';

          if (isCreate) {
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.route)}
                className="group -mt-5 flex flex-col items-center gap-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-green-gradient text-xl shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_28px_rgba(212,175,55,0.4)] group-active:scale-95">
                  {tab.icon}
                </div>
                <span className={`font-oswald text-[10px] font-medium tracking-wide ${isActive ? 'text-gold' : 'text-text-muted'}`}>
                  {t(tab.labelKey)}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.route)}
              className="group relative flex flex-col items-center gap-0.5 py-1"
            >
              <span className={`text-xl transition-transform duration-200 group-active:scale-90 ${isActive ? '' : 'opacity-50 grayscale'}`}>
                {tab.icon}
              </span>
              {isCredits && (
                <span className="absolute -right-1 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 font-oswald text-[9px] font-bold text-bg-primary">
                  {credits}
                </span>
              )}
              <span className={`font-oswald text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-gold' : 'text-text-muted'}`}>
                {t(tab.labelKey)}
              </span>
              {isActive && <div className="h-0.5 w-4 rounded-full bg-gold" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
