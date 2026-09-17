import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createPersistStorage } from '@/lib/persistStorage';

const storage = createPersistStorage('memory-store');

interface Location {
  latitude: number;
  longitude: number;
}

interface MemoryState {
  preferences: Record<string, any>;
  recentSearches: string[];
  favoriteActions: string[];
  dietaryPrefs: string[];
  budgetDefault: number;
  homeLocation: Location | null;
  setPreference: (key: string, value: any) => void;
  getPreference: (key: string) => any;
  addRecentSearch: (search: string) => void;
  setDietaryPrefs: (prefs: string[]) => void;
  setBudgetDefault: (budget: number) => void;
  setHomeLocation: (location: Location | null) => void;
  clearAllMemory: () => void;
  exportMemory: () => string;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      preferences: {},
      recentSearches: [],
      favoriteActions: [],
      dietaryPrefs: [],
      budgetDefault: 1000,
      homeLocation: null,
      setPreference: (key, value) => 
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
      getPreference: (key) => get().preferences[key],
      addRecentSearch: (search) =>
        set((state) => {
          const searches = [search, ...state.recentSearches.filter((s) => s !== search)].slice(0, 10);
          return { recentSearches: searches };
        }),
      setDietaryPrefs: (dietaryPrefs) => set({ dietaryPrefs }),
      setBudgetDefault: (budgetDefault) => set({ budgetDefault }),
      setHomeLocation: (homeLocation) => set({ homeLocation }),
      clearAllMemory: () =>
        set({
          preferences: {},
          recentSearches: [],
          favoriteActions: [],
          dietaryPrefs: [],
          budgetDefault: 1000,
          homeLocation: null,
        }),
      exportMemory: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },
    }),
    {
      name: 'memory-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
