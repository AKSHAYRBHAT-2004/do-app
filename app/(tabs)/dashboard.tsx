import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import PriorityIndicator from '@/components/ui/PriorityIndicator';
import GlassCard from '@/components/ui/GlassCard';
import EmptyState from '@/components/ui/EmptyState';
import { useUserDataStore } from '@/stores/userDataStore';

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { groceryItems, chores, expenses, budgetLimit } = useUserDataStore();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const pendingGroceries = groceryItems.filter(g => !g.checked).length;
  const pendingChores = chores.filter(c => !c.done).length;
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0F]"
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-white text-3xl font-bold">Today</Text>
        <TouchableOpacity
          onPress={() => router.push('/feature/notifications')}
          className="bg-purple-900/30 px-3 py-1.5 rounded-full border border-purple-500/30 active:opacity-80"
        >
          <Text className="text-purple-300 text-xs font-semibold">Notification Brain ⚡</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-gray-400 text-sm mb-6">{dateStr}</Text>

      {/* Quick Executive Stats */}
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity
          onPress={() => router.push('/feature/money')}
          className="flex-1 bg-white/5 border border-white/10 p-3.5 rounded-2xl"
          activeOpacity={0.8}
        >
          <Text className="text-gray-400 text-[11px] font-medium mb-0.5">Budget Spent</Text>
          <Text className="text-white font-bold text-base">₹{totalSpent.toLocaleString()}</Text>
          <Text className="text-emerald-400 text-[10px] mt-0.5">Limit: ₹{budgetLimit.toLocaleString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/feature/home-autopilot')}
          className="flex-1 bg-white/5 border border-white/10 p-3.5 rounded-2xl"
          activeOpacity={0.8}
        >
          <Text className="text-gray-400 text-[11px] font-medium mb-0.5">Pantry & Chores</Text>
          <Text className="text-white font-bold text-base">{pendingGroceries + pendingChores} Actionable</Text>
          <Text className="text-cyan-300 text-[10px] mt-0.5">{pendingGroceries} items • {pendingChores} chores</Text>
        </TouchableOpacity>
      </View>

      {/* DO NOW */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <PriorityIndicator priority="urgent" />
          <Text className="text-red-400 font-bold ml-2 tracking-widest text-xs uppercase">Do Now</Text>
        </View>

        <GlassCard
          className="p-4 mb-3 border border-red-500/20"
          onPress={() => router.push('/feature/money')}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-2">
              <Text className="text-white text-base font-semibold">Pay Electricity Bill</Text>
              <Text className="text-gray-400 text-sm mt-0.5">Due today • ₹2,850 • Avoid ₹150 penalty</Text>
            </View>
            <View className="bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/30">
              <Text className="text-red-300 text-xs font-bold">PAY NOW</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard
          className="p-4 border border-red-500/20"
          onPress={() => router.push('/chat/call-mom')}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-base font-semibold">Call Mom</Text>
              <Text className="text-gray-400 text-sm mt-0.5">Missed call 2 hours ago • Tap to auto-connect</Text>
            </View>
            <Text className="text-2xl">📞</Text>
          </View>
        </GlassCard>
      </View>

      {/* DO TODAY */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <PriorityIndicator priority="today" />
          <Text className="text-yellow-400 font-bold ml-2 tracking-widest text-xs uppercase">Do Today</Text>
        </View>

        <GlassCard
          className="p-4 mb-3"
          onPress={() => router.push('/feature/home-autopilot')}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-2">
              <Text className="text-white text-base font-semibold">Groceries Restock</Text>
              <Text className="text-gray-400 text-sm mt-0.5">
                {pendingGroceries > 0 ? `${pendingGroceries} items needed` : 'All items stocked!'} • Tap to review
              </Text>
            </View>
            <Text className="text-gray-500 text-base">›</Text>
          </View>
        </GlassCard>

        <GlassCard
          className="p-4"
          onPress={() => router.push('/feature/five-minute-life')}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-2">
              <Text className="text-white text-base font-semibold">5-Minute Life Quick Win</Text>
              <Text className="text-gray-400 text-sm mt-0.5">Time-boxed micro tasks • Tap to start timer</Text>
            </View>
            <Text className="text-gray-500 text-base">›</Text>
          </View>
        </GlassCard>
      </View>

      {/* CAN WAIT */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <PriorityIndicator priority="low" />
          <Text className="text-green-400 font-bold ml-2 tracking-widest text-xs uppercase">Can Wait</Text>
        </View>
        <EmptyState title="All caught up" description="Low priority items are cleared." />
      </View>

      {/* AI HANDLED */}
      <View className="mb-8">
        <View className="flex-row items-center mb-3 opacity-60">
          <Text className="text-gray-400 font-bold tracking-widest text-xs uppercase">🤖 AI Handled</Text>
        </View>
        <GlassCard className="p-4 opacity-70">
          <Text className="text-white text-sm line-through">Scheduled dental check-up</Text>
          <Text className="text-gray-500 text-xs mt-0.5">Confirmed for Thursday 3:00 PM via Calendar</Text>
        </GlassCard>
      </View>

      {/* WHAT SHOULD I DO NOW? */}
      <TouchableOpacity
        className="mt-2 mb-6"
        activeOpacity={0.8}
        onPress={() => router.push('/feature/what-should-i-do')}
      >
        <GlassCard variant="accent" className="p-5 items-center justify-center">
          <Text className="text-purple-300 font-bold text-lg tracking-wide">
            WHAT SHOULD I DO NOW?
          </Text>
          <Text className="text-purple-400/60 text-xs mt-1">
            Let AI prioritize your next action based on context
          </Text>
        </GlassCard>
      </TouchableOpacity>
    </ScrollView>
  );
}
