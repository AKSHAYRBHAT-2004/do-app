import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createPersistStorage } from '@/lib/persistStorage';

const storage = createPersistStorage('app-store');

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
