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
  credits: 0, // start at 0 — free credit comes from Supabase on first signup only
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

  /** Fetch credits from Supabase. Only gives free credit on first signup. */
  fetchCredits: async () => {
    set({ isLoading: true });
    try {
      if (!isSupabaseConfigured) {
        // Dev mode — give 1 free credit for testing
        await new Promise((r) => setTimeout(r, 300));
        set({ credits: 1 });
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

      if (error && error.code === 'PGRST116') {
        // No row found — first signup. Create row with 1 free credit.
        console.log('[Credits] First signup — granting 1 free credit');
        await supabase.from('users').insert({
          id: user.id,
          free_credits: 1,
          paid_credits: 0,
        });
        set({ credits: 1 });
        return;
      }

      if (error) {
        console.error('[Credits] Fetch error:', error.message);
        return;
      }

      if (data) {
        set({ credits: (data.free_credits ?? 0) + (data.paid_credits ?? 0) });
      }
    } catch {
      // offline — keep at 0
    } finally {
      set({ isLoading: false });
    }
  },
}));
