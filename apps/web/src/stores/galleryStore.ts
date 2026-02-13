import { create } from 'zustand';

export interface Generation {
  id: string;
  outputImageUrl: string;
  sceneType: string;
  playerStyle: string;
  createdAt: string; // ISO date
}

export interface GalleryState {
  generations: Generation[];
  addGeneration: (gen: Generation) => void;
  removeGeneration: (id: string) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  generations: [],

  addGeneration: (gen: Generation) =>
    set((s) => ({
      generations: [gen, ...s.generations],
    })),

  removeGeneration: (id: string) =>
    set((s) => ({
      generations: s.generations.filter((g) => g.id !== id),
    })),
}));
