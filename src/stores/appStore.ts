import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

let storage: any;
try {
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV({ id: 'app-store' });
  storage = {
    setItem: (name: string, value: string) => mmkv.set(name, value),
    getItem: (name: string) => mmkv.getString(name) ?? null,
    removeItem: (name: string) => mmkv.delete(name),
  };
} catch {
  const map = new Map<string, string>();
  storage = {
    setItem: (name: string, value: string) => map.set(name, value),
    getItem: (name: string) => map.get(name) ?? null,
    removeItem: (name: string) => map.delete(name),
  };
}

type AppMode = 'normal' | 'lazy' | 'voice';
type Theme = 'dark' | 'light';

interface AppState {
  theme: Theme;
  isAIProcessing: boolean;
  currentMode: AppMode;
  activeConversationId: string | null;
  isOnboarded: boolean;
  quickSuggestions: string[];
  setTheme: (theme: Theme) => void;
  setAIProcessing: (isProcessing: boolean) => void;
  setCurrentMode: (mode: AppMode) => void;
  setActiveConversation: (id: string | null) => void;
  setOnboarded: (onboarded: boolean) => void;
  setQuickSuggestions: (suggestions: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      isAIProcessing: false,
      currentMode: 'normal',
      activeConversationId: null,
      isOnboarded: false,
      quickSuggestions: ['Order food', 'Book a cab', 'Schedule a meeting', 'Check emails'],
      setTheme: (theme) => set({ theme }),
      setAIProcessing: (isAIProcessing) => set({ isAIProcessing }),
      setCurrentMode: (currentMode) => set({ currentMode }),
      setActiveConversation: (activeConversationId) => set({ activeConversationId }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      setQuickSuggestions: (quickSuggestions) => set({ quickSuggestions }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
