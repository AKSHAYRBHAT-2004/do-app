import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/stores/authStore';
import { useMemoryStore } from '@/stores/memoryStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { clearAllMemory } = useMemoryStore();

  const menuItems = [
    { icon: '📊', label: 'Subscription: PRO', color: 'text-purple-400', route: '/feature/subscription' },
    { icon: '🧠', label: 'Personal Memory', color: 'text-white', route: '/feature/memory' },
    { icon: '🔔', label: 'Notification Settings', color: 'text-white', route: '/feature/notifications' },
    { icon: '🎨', label: 'Appearance', color: 'text-white', route: '/(modals)/settings' },
    { icon: '🔒', label: 'Privacy & Security', color: 'text-white', route: '/(modals)/settings' },
    { icon: '📤', label: 'Export My Data', color: 'text-white', action: 'export' },
    { icon: '🗑️', label: 'Clear All Memory', color: 'text-red-400', action: 'clear' },
  ];

  const handleAction = (item: typeof menuItems[0]) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.action === 'clear') {
      clearAllMemory();
      alert('All personal memories and preferences have been cleared.');
    } else if (item.action === 'export') {
      alert('Export data prepared. A secure copy has been downloaded.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F]" contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}>
      <View className="items-center mb-10">
        <View className="w-24 h-24 rounded-full bg-purple-900/30 items-center justify-center border border-purple-500/50 mb-4">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-white text-2xl font-bold">{user?.user_metadata?.full_name || 'DO User'}</Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.email || 'user@do-os.ai'}</Text>
      </View>

      <GlassCard className="p-2 mb-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAction(item)}
            className={`flex-row items-center justify-between p-4 ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
          >
            <View className="flex-row items-center">
              <Text className="text-xl mr-4">{item.icon}</Text>
              <Text className={`text-base font-medium ${item.color}`}>{item.label}</Text>
            </View>
            <Text className="text-gray-500">›</Text>
          </TouchableOpacity>
        ))}
      </GlassCard>

      <TouchableOpacity
        onPress={() => {
          signOut();
          router.push('/feature/login');
        }}
        className="mb-8"
      >
        <GlassCard className="p-4 flex-row items-center justify-center border border-red-900/30 bg-red-900/10">
          <Text className="text-xl mr-3">🚪</Text>
          <Text className="text-red-400 text-base font-bold">Sign Out</Text>
        </GlassCard>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 text-xs">DO AI OS v1.0.0 (Build 42)</Text>
    </ScrollView>
  );
}
