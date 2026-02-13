import { create } from 'zustand';

export interface ToastState {
  message: string | null;
  visible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  visible: false,

  show: (message: string) => {
    if (timer) clearTimeout(timer);
    set({ message, visible: true });
    timer = setTimeout(() => {
      set({ visible: false });
      // Clear message after fade-out animation
      setTimeout(() => set({ message: null }), 300);
    }, 3000);
  },

  hide: () => {
    if (timer) clearTimeout(timer);
    set({ visible: false });
    setTimeout(() => set({ message: null }), 300);
  },
}));

/** Shorthand to show a toast from anywhere */
export const showToast = (message: string) => {
  useToastStore.getState().show(message);
};
