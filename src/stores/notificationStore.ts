import { create } from 'zustand';
import { Notification } from '@/types';

type NotificationCategory = 'urgent' | 'today' | 'canWait' | 'aiHandled';

interface NotificationState {
  urgent: Notification[];
  today: Notification[];
  canWait: Notification[];
  aiHandled: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'> & { category?: NotificationCategory }) => void;
  markRead: (id: string, category: NotificationCategory) => void;
  markAllRead: () => void;
  dismissNotification: (id: string, category: NotificationCategory) => void;
  categorizeNotification: (id: string, fromCategory: NotificationCategory, toCategory: NotificationCategory) => void;
  getUrgentCount: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useNotificationStore = create<NotificationState>((set, get) => ({
  urgent: [],
  today: [],
  canWait: [],
  aiHandled: [],
  unreadCount: 0,
  
  addNotification: (notif) => set((state) => {
    const category = notif.category || 'today';
    const newNotification = {
      ...notif,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    } as Notification;
    
    return {
      [category]: [newNotification, ...state[category]],
      unreadCount: state.unreadCount + 1,
    };
  }),

  markRead: (id, category) => set((state) => {
    const updatedList = state[category].map((n) => {
      if (n.id === id && !n.read) {
        return { ...n, read: true };
      }
      return n;
    });
    
    const wasUnread = state[category].find((n) => n.id === id && !n.read);
    
    return {
      [category]: updatedList,
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),

  markAllRead: () => set((state) => {
    const markReadList = (list: Notification[]) => list.map((n) => ({ ...n, read: true }));
    return {
      urgent: markReadList(state.urgent),
      today: markReadList(state.today),
      canWait: markReadList(state.canWait),
      aiHandled: markReadList(state.aiHandled),
      unreadCount: 0,
    };
  }),

  dismissNotification: (id, category) => set((state) => {
    const notification = state[category].find((n) => n.id === id);
    const isUnread = notification && !notification.read;
    
    return {
      [category]: state[category].filter((n) => n.id !== id),
      unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),

  categorizeNotification: (id, fromCategory, toCategory) => set((state) => {
    if (fromCategory === toCategory) return state;
    
    const notification = state[fromCategory].find((n) => n.id === id);
    if (!notification) return state;
    
    return {
      [fromCategory]: state[fromCategory].filter((n) => n.id !== id),
      [toCategory]: [notification, ...state[toCategory]],
    };
  }),

  getUrgentCount: () => {
    return get().urgent.filter((n) => !n.read).length;
  },
}));
