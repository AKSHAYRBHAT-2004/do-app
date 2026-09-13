import { useCallback, useMemo } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { Notification } from '@/types';

export function useNotificationBrain() {
  const { urgent, today, canWait, aiHandled, unreadCount, addNotification } = useNotificationStore();

  const categorize = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const text = (notification.title + ' ' + (notification.body || '')).toLowerCase();
    
    let category: 'urgent' | 'today' | 'canWait' | 'aiHandled' = 'today';
    
    if (text.includes('urgent') || text.includes('asap') || text.includes('emergency')) {
      category = 'urgent';
    } else if (text.includes('tomorrow') || text.includes('later') || text.includes('someday')) {
      category = 'canWait';
    }
    
    addNotification({ ...notification, category });
  }, [addNotification]);

  const getNextAction = useCallback(() => {
    const allUrgent = urgent.filter(n => !n.read);
    if (allUrgent.length > 0) {
      return allUrgent[0];
    }
    
    const allToday = today.filter(n => !n.read);
    if (allToday.length > 0) {
      return allToday[0];
    }
    
    return null;
  }, [urgent, today]);

  const getSummary = useCallback(() => {
    return {
      urgent: urgent.filter(n => !n.read).length,
      today: today.filter(n => !n.read).length,
      canWait: canWait.filter(n => !n.read).length,
      aiHandled: aiHandled.filter(n => !n.read).length,
    };
  }, [urgent, today, canWait, aiHandled]);

  const urgentCount = useMemo(() => urgent.filter(n => !n.read).length, [urgent]);
  const todayCount = useMemo(() => today.filter(n => !n.read).length, [today]);
  
  return { categorize, getNextAction, getSummary, urgentCount, todayCount, totalUnread: unreadCount };
}
