import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

let storage: any;
try {
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV({ id: 'auth-store' });
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

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      profile: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          set({ user: data.user, session: data.session, isAuthenticated: true });
          await get().loadProfile();
        } finally {
          set({ isLoading: false });
        }
      },
      signUp: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          set({ user: data.user, session: data.session, isAuthenticated: !!data.user });
        } finally {
          set({ isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          set({ user: null, session: null, isAuthenticated: false, profile: null });
        } finally {
          set({ isLoading: false });
        }
      },
      signInWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
          if (error) throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      signInWithApple: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
          if (error) throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      loadProfile: async () => {
        const user = get().user;
        if (!user) return;
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (error) throw error;
          set({ profile: data as UserProfile });
        } catch (error) {
          console.error('Failed to load profile', error);
        }
      },
      updateProfile: async (updates) => {
        const user = get().user;
        if (!user) return;
        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);
          if (error) throw error;
          await get().loadProfile();
        } catch (error) {
          console.error('Failed to update profile', error);
        }
      },
      initialize: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            set({ session, user: session.user, isAuthenticated: true });
            await get().loadProfile();
          }
          
          supabase.auth.onAuthStateChange(async (_event, session) => {
            set({ session, user: session?.user || null, isAuthenticated: !!session });
            if (session?.user) {
              await get().loadProfile();
            } else {
              set({ profile: null });
            }
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
