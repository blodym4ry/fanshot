'use client';

import { useRouter } from 'next/navigation';
import { useT } from '@/src/lib/i18n';

export function QuickActions() {
  const router = useRouter();
  const t = useT('dashboard');

  const actions = [
    { icon: '📸', labelKey: 'selfie', bg: 'bg-accent-red' },
    { icon: '🏟️', labelKey: 'scenes', bg: 'bg-accent-green' },
    { icon: '⚽', labelKey: 'styles', bg: 'bg-accent-blue' },
    { icon: '🎨', labelKey: 'jerseys', bg: 'bg-gold' },
    { icon: '🌟', labelKey: 'popular', bg: 'bg-[#E040FB]' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
      {actions.map((action) => (
        <button
          key={action.labelKey}
          onClick={() => router.push('/create')}
          className="group flex flex-col items-center gap-2"
        >
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${action.bg} text-2xl transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-active:scale-90`}
          >
            {action.icon}
          </div>
          <span className="whitespace-nowrap font-oswald text-[10px] font-medium uppercase tracking-wider text-text-secondary transition-colors group-hover:text-text-primary">
            {t(action.labelKey)}
          </span>
        </button>
      ))}
    </div>
  );
}
