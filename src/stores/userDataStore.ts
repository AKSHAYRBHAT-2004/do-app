/**
 * userDataStore.ts
 * Persisted store for user-generated data: memories, expenses, grocery items, chores.
 * Uses localStorage on web, MMKV on native.
 * All data survives page refresh.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createPersistStorage } from '@/lib/persistStorage';

const storage = createPersistStorage('user-data');

// ── Types ──

export interface MemoryEntry {
  id: string;
  category: 'Preferences' | 'Routines' | 'Important Dates' | 'Food' | 'Work';
  content: string;
  dateAdded: string;
}

export interface Expense {
  id: string;
  name: string;
  category: 'Food' | 'Shopping' | 'Transport' | 'Utilities' | 'Fun';
  amount: number;
  date: string;
  icon: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface ChoreItem {
  id: string;
  name: string;
  frequency: string;
  done: boolean;
}

// ── Store ──

interface UserDataState {
  // Memories
  memories: MemoryEntry[];
  addMemory: (memory: Omit<MemoryEntry, 'id' | 'dateAdded'>) => void;
  deleteMemory: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  budgetLimit: number;
  setBudgetLimit: (limit: number) => void;

  // Grocery items
  groceryItems: GroceryItem[];
  addGroceryItem: (name: string) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;

  // Chores
  chores: ChoreItem[];
  toggleChore: (id: string) => void;
}

const DEFAULT_MEMORIES: MemoryEntry[] = [
  {
    id: 'm1',
    category: 'Preferences',
    content: 'Allergic to peanuts. Prefers vegetarian or Mediterranean food for weekday lunches.',
    dateAdded: 'Added 2 days ago',
  },
  {
    id: 'm2',
    category: 'Routines',
    content: 'Usually wakes up at 6:45 AM. Gym on Mon, Wed, Fri for 45 minutes.',
    dateAdded: 'Added 1 week ago',
  },
  {
    id: 'm3',
    category: 'Important Dates',
    content: "Mom's birthday is November 14th. Buy flowers & card 3 days in advance.",
    dateAdded: 'Auto-extracted',
  },
];

const DEFAULT_EXPENSES: Expense[] = [
  { id: 'e1', name: 'Groceries — Whole Foods', category: 'Food', amount: 4850, date: 'Yesterday', icon: '🍔' },
  { id: 'e2', name: 'Zara Autumn Jacket', category: 'Shopping', amount: 3100, date: '3 days ago', icon: '🛍️' },
  { id: 'e3', name: 'Uber & Metro Passes', category: 'Transport', amount: 2420, date: 'This week', icon: '🚗' },
  { id: 'e4', name: 'Electricity & WiFi', category: 'Utilities', amount: 2850, date: 'Oct 4', icon: '⚡' },
  { id: 'e5', name: 'Cinema & Weekend Drinks', category: 'Fun', amount: 1630, date: 'Oct 2', icon: '🎉' },
];

const DEFAULT_GROCERIES: GroceryItem[] = [
  { id: 'g1', name: 'Oat Milk (2L)', checked: false },
  { id: 'g2', name: 'Greek Yogurt', checked: false },
  { id: 'g3', name: 'Eggs (12-pack)', checked: false },
  { id: 'g4', name: 'Brown Rice (2kg)', checked: true },
  { id: 'g5', name: 'Whey Protein — Vanilla', checked: false },
];

const DEFAULT_CHORES: ChoreItem[] = [
  { id: 'c1', name: 'Vacuum Living Room', frequency: 'Weekly', done: false },
  { id: 'c2', name: 'Clean Bathroom', frequency: 'Weekly', done: false },
  { id: 'c3', name: 'Wipe Kitchen Counters', frequency: 'Daily', done: true },
  { id: 'c4', name: 'Take Out Trash', frequency: 'Twice a week', done: false },
];

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      // ── Memories ──
      memories: DEFAULT_MEMORIES,
      addMemory: (memory) => {
        const now = new Date();
        const dateStr = `Added ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        set((s) => ({
          memories: [
            { id: `m_${Date.now()}`, dateAdded: dateStr, ...memory },
            ...s.memories,
          ],
        }));
      },
      deleteMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      // ── Expenses ──
      expenses: DEFAULT_EXPENSES,
      addExpense: (expense) =>
        set((s) => ({
          expenses: [{ id: `e_${Date.now()}`, ...expense }, ...s.expenses],
        })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
      budgetLimit: 25000,
      setBudgetLimit: (budgetLimit) => set({ budgetLimit }),

      // ── Grocery Items ──
      groceryItems: DEFAULT_GROCERIES,
      addGroceryItem: (name) =>
        set((s) => ({
          groceryItems: [
            ...s.groceryItems,
            { id: `gi_${Date.now()}`, name, checked: false },
          ],
        })),
      toggleGroceryItem: (id) =>
        set((s) => ({
          groceryItems: s.groceryItems.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
      removeGroceryItem: (id) =>
        set((s) => ({ groceryItems: s.groceryItems.filter((item) => item.id !== id) })),

      // ── Chores ──
      chores: DEFAULT_CHORES,
      toggleChore: (id) =>
        set((s) => ({
          chores: s.chores.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
        })),
    }),
    {
      name: 'user-data-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
