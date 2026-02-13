import { create } from 'zustand';

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

  /** Spend 1 credit. Returns true if successful, false if insufficient. */
  spendCredit: () => {
    const { credits } = get();
    if (credits <= 0) return false;
    set({ credits: credits - 1 });
    return true;
  },

  /** Fetch credits from Supabase. Falls back to mock (1) if offline. */
  fetchCredits: async () => {
    set({ isLoading: true });
    try {
      // TODO: fetch from Supabase when connected
      // const { data } = await supabase
      //   .from('users')
      //   .select('free_credits, paid_credits')
      //   .single();
      // set({ credits: (data?.free_credits ?? 0) + (data?.paid_credits ?? 0) });

      // Mock: keep current credits (default 1)
      await new Promise((r) => setTimeout(r, 300));
    } catch {
      // offline — keep default
    } finally {
      set({ isLoading: false });
    }
  },
}));
