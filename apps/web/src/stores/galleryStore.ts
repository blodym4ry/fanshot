import { create } from 'zustand';
import { createClient, isSupabaseConfigured } from '@/src/lib/supabase';

export interface Generation {
  id: string;
  outputImageUrl: string;
  sceneType: string;
  playerStyle: string;
  createdAt: string; // ISO date
}

export interface GalleryState {
  generations: Generation[];
  isLoading: boolean;

  addGeneration: (gen: Generation) => void;
  removeGeneration: (id: string) => void;
  fetchGenerations: () => Promise<void>;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  generations: [],
  isLoading: false,

  addGeneration: (gen: Generation) =>
    set((s) => ({
      generations: [gen, ...s.generations],
    })),

  removeGeneration: (id: string) =>
    set((s) => ({
      generations: s.generations.filter((g) => g.id !== id),
    })),

  /** Fetch user's generations from Supabase. */
  fetchGenerations: async () => {
    set({ isLoading: true });
    try {
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300));
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ generations: [] });
        return;
      }

      const { data, error } = await supabase
        .from('generations')
        .select('id, output_image_url, scene_type, player_style, created_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[Gallery] Fetch error:', error.message);
        return;
      }

      if (data) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        set({
          generations: data.map((row) => {
            let imageUrl = row.output_image_url || '';
            // Legacy fix: convert storage paths to full public URLs
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `${supabaseUrl}/storage/v1/object/public/generated/${imageUrl}`;
            }
            return {
              id: row.id,
              outputImageUrl: imageUrl,
              sceneType: row.scene_type,
              playerStyle: row.player_style,
              createdAt: row.created_at,
            };
          }),
        });
      }
    } catch {
      // offline — keep empty
    } finally {
      set({ isLoading: false });
    }
  },
}));
