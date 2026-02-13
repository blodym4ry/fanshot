import { create } from 'zustand';
import type { Player } from '@/src/data/players';
import type { UserDetails } from '@/src/lib/prompts';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

const DEFAULT_USER_DETAILS: UserDetails = {
  gender: null,
  ageRange: null,
  height: null,
  bodyType: null,
  hairColor: null,
  hairStyle: null,
  facialHair: null,
  glasses: false,
  clothing: null,
};

export interface CreateState {
  /* selfies (1-5 photos) */
  selfieFiles: File[];
  selfiePreviews: string[];

  /* user physical details */
  userDetails: UserDetails;

  /* player */
  selectedPlayer: Player | null;

  /* scene */
  selectedScene: string;

  /* generation */
  generationStatus: GenerationStatus;
  generatedImageUrl: string | null;
  errorMessage: string | null;
  /** true when free (no credit spent) — used for watermark logic */
  wasFreeGeneration: boolean;

  /* actions – selfies */
  addSelfie: (file: File) => void;
  removeSelfie: (index: number) => void;
  clearSelfies: () => void;

  /* actions – user details */
  setUserDetail: <K extends keyof UserDetails>(key: K, value: UserDetails[K]) => void;
  resetUserDetails: () => void;

  /* actions – selections */
  setPlayer: (player: Player) => void;
  clearPlayer: () => void;
  setScene: (sceneId: string) => void;

  /* actions – generation */
  startGeneration: (isFree: boolean) => void;
  setResult: (imageUrl: string) => void;
  setError: (message: string) => void;
  resetGeneration: () => void;

  /* full reset */
  reset: () => void;
}

const MAX_SELFIES = 5;

export const useCreateStore = create<CreateState>((set, get) => ({
  selfieFiles: [],
  selfiePreviews: [],
  userDetails: { ...DEFAULT_USER_DETAILS },
  selectedPlayer: null,
  selectedScene: 'tunnel_encounter',
  generationStatus: 'idle',
  generatedImageUrl: null,
  errorMessage: null,
  wasFreeGeneration: false,

  /* ── Selfie actions ──────────────────────────── */

  addSelfie: (file: File) => {
    const { selfieFiles, selfiePreviews } = get();
    if (selfieFiles.length >= MAX_SELFIES) return;
    set({
      selfieFiles: [...selfieFiles, file],
      selfiePreviews: [...selfiePreviews, URL.createObjectURL(file)],
    });
  },

  removeSelfie: (index: number) => {
    const { selfieFiles, selfiePreviews } = get();
    const url = selfiePreviews[index];
    if (url) URL.revokeObjectURL(url);
    set({
      selfieFiles: selfieFiles.filter((_, i) => i !== index),
      selfiePreviews: selfiePreviews.filter((_, i) => i !== index),
    });
  },

  clearSelfies: () => {
    const { selfiePreviews } = get();
    selfiePreviews.forEach((url) => URL.revokeObjectURL(url));
    set({ selfieFiles: [], selfiePreviews: [] });
  },

  /* ── User details actions ──────────────────────── */

  setUserDetail: (key, value) => {
    set((state) => ({
      userDetails: { ...state.userDetails, [key]: value },
    }));
  },

  resetUserDetails: () => set({ userDetails: { ...DEFAULT_USER_DETAILS } }),

  /* ── Selection actions ───────────────────────── */

  setPlayer: (player: Player) => set({ selectedPlayer: player }),

  clearPlayer: () => set({ selectedPlayer: null }),

  setScene: (sceneId: string) => set({ selectedScene: sceneId }),

  /* ── Generation actions ──────────────────────── */

  startGeneration: (isFree: boolean) =>
    set({
      generationStatus: 'loading',
      generatedImageUrl: null,
      errorMessage: null,
      wasFreeGeneration: isFree,
    }),

  setResult: (imageUrl: string) =>
    set({
      generationStatus: 'success',
      generatedImageUrl: imageUrl,
    }),

  setError: (message: string) =>
    set({
      generationStatus: 'error',
      errorMessage: message,
    }),

  resetGeneration: () =>
    set({
      generationStatus: 'idle',
      generatedImageUrl: null,
      errorMessage: null,
    }),

  /* ── Full reset ──────────────────────────────── */

  reset: () => {
    const { selfiePreviews } = get();
    selfiePreviews.forEach((url) => URL.revokeObjectURL(url));
    set({
      selfieFiles: [],
      selfiePreviews: [],
      userDetails: { ...DEFAULT_USER_DETAILS },
      selectedPlayer: null,
      selectedScene: 'tunnel_encounter',
      generationStatus: 'idle',
      generatedImageUrl: null,
      errorMessage: null,
      wasFreeGeneration: false,
    });
  },
}));
