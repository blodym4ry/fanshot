import { create } from 'zustand';
import { createClient, isSupabaseConfigured } from '@/src/lib/supabase';

export interface CreditState {
  credits: number;
  isLoading: boolean;

  /* actions */
  setCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
  spendCredit: () => boolean;
  fetchCredits: () => Promise<void>;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: 1, // 1 free credit by default
  isLoading: false,

  setCredits: (amount: number) => set({ credits: amount }),

  addCredits: (amount: number) =>
    set((s) => ({ credits: s.credits + amount })),

  /** Spend 1 credit locally. Returns true if successful. */
  spendCredit: () => {
    const { credits } = get();
    if (credits <= 0) return false;
    set({ credits: credits - 1 });
    return true;
  },

  /** Fetch credits from Supabase. Falls back to local default if offline. */
  fetchCredits: async () => {
    set({ isLoading: true });
    try {
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300));
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ credits: 0 });
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('free_credits, paid_credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[Credits] Fetch error:', error.message);
        return;
      }

      if (data) {
        set({ credits: (data.free_credits ?? 0) + (data.paid_credits ?? 0) });
      }
    } catch {
      // offline — keep default
    } finally {
      set({ isLoading: false });
    }
  },
}));
