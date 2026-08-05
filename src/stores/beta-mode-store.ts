import { create } from 'zustand';
import type { AppMode } from '../config/feature-flags';

interface BetaModeState {
  mode: AppMode;
  isBeta: boolean;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
}

export const useBetaModeStore = create<BetaModeState>((set) => ({
  mode: 'production',
  isBeta: false,
  toggleMode: () =>
    set((state) => {
      const newMode = state.mode === 'beta' ? 'production' : 'beta';
      return { mode: newMode, isBeta: newMode === 'beta' };
    }),
  setMode: (mode) => set({ mode, isBeta: mode === 'beta' }),
}));
