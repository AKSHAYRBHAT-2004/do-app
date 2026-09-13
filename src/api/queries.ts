import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTasks = (filter?: any) => {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('conversations').select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const { data: conversation, error: convError } = await supabase.from('conversations').select('*').eq('id', id).single();
      if (convError) throw convError;
      
      const { data: messages, error: msgError } = await supabase.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true });
      if (msgError) throw msgError;
      
      return { ...conversation, messages };
    },
    enabled: !!id,
  });
};

export const useMemories = (category?: string) => {
  return useQuery({
    queryKey: ['memories', category],
    queryFn: async () => {
      let query = supabase.from('memories').select('*').order('created_at', { ascending: false });
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useBills = () => {
  return useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bills').select('*').order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useShoppingLists = () => {
  return useQuery({
    queryKey: ['shoppingLists'],
    queryFn: async () => {
      const { data, error } = await supabase.from('shopping_lists').select('*, items:shopping_items(*)');
      if (error) throw error;
      return data;
    },
  });
};

export const useSpendingRecords = (dateRange?: { start: string, end: string }) => {
  return useQuery({
    queryKey: ['spending', dateRange],
    queryFn: async () => {
      let query = supabase.from('spending').select('*').order('date', { ascending: false });
      if (dateRange) {
        query = query.gte('date', dateRange.start).lte('date', dateRange.end);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useTodaySummary = () => {
  return useQuery({
    queryKey: ['todaySummary'],
    queryFn: async () => {
      const [tasksRes, billsRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('is_completed', false).limit(5),
        supabase.from('bills').select('*').gte('due_date', new Date().toISOString()).limit(3)
      ]);
      
      return {
        tasks: tasksRes.data || [],
        bills: billsRes.data || [],
        weather: { temp: 24, condition: 'Sunny' }, // Mock weather
      };
    },
    staleTime: 1000 * 60 * 15,
  });
};
