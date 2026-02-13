'use client';

import { useToastStore } from '@/src/stores/toastStore';

export function ToastContainer() {
  const { message, visible, hide } = useToastStore();

  if (!message) return null;

  return (
    <div
      className={`
        fixed left-1/2 top-5 z-[100] -translate-x-1/2
        transition-all duration-300 ease-out
        ${visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}
      `}
    >
      <button
        onClick={hide}
        className="flex items-center gap-2 rounded-xl border-l-4 border-l-gold bg-bg-elevated px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <p className="text-sm text-text-primary">{message}</p>
      </button>
    </div>
  );
}
