import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/stores/authStore';
import { useMemoryStore } from '@/stores/memoryStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut, updateProfile } = useAuthStore();
  const { clearAllMemory } = useMemoryStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || user?.user_metadata?.full_name || 'Akshay Bhat');
  const [editEmail, setEditEmail] = useState(profile?.email || user?.email || 'akshayrbhat25@gmail.com');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      showToast('Name and email cannot be empty');
      return;
    }
    await updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
    });
    setIsEditing(false);
    showToast('✓ Profile updated successfully!');
  };

  const currentTier = (profile?.tier || 'pro').toUpperCase();

  const menuItems = [
    { icon: '📊', label: `Subscription: ${currentTier}`, color: 'text-purple-400', route: '/feature/subscription' },
    { icon: '🧠', label: 'Personal Memory Vault', color: 'text-white', route: '/feature/memory' },
    { icon: '🔔', label: 'Notification Brain', color: 'text-white', route: '/feature/notifications' },
    { icon: '🤖', label: 'AI Model & Gemini Key', color: 'text-cyan-300', route: '/(modals)/settings' },
    { icon: '🎨', label: 'Appearance & System', color: 'text-white', route: '/(modals)/settings' },
    { icon: '📤', label: 'Export Memory Data', color: 'text-white', action: 'export' },
    { icon: '🗑️', label: 'Clear All Memory', color: 'text-red-400', action: 'clear' },
  ];

  const handleAction = (item: typeof menuItems[0]) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.action === 'clear') {
      clearAllMemory();
      showToast('🗑️ All personal memories cleared');
    } else if (item.action === 'export') {
      const data = JSON.stringify({ user, profile }, null, 2);
      if (typeof window !== 'undefined') {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'do-profile-export.json';
        a.click();
        URL.revokeObjectURL(url);
      }
      showToast('📥 Profile & memory data exported');
    }
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || 'Akshay Bhat';
  const displayEmail = profile?.email || user?.email || 'akshayrbhat25@gmail.com';

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F]" contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 60 }}>
      {/* Toast Alert */}
      {toastMessage && (
        <View className="bg-purple-500/20 border border-purple-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-purple-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* User Header Card */}
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-3xl bg-purple-900/30 items-center justify-center border-2 border-purple-500/40 mb-3 shadow-xl shadow-purple-500/20">
          <Text className="text-4xl">👑</Text>
        </View>
        <Text className="text-white text-2xl font-bold">{displayName}</Text>
        <Text className="text-gray-400 text-sm mt-0.5">{displayEmail}</Text>

        <View className="flex-row items-center gap-2 mt-3">
          <View className="bg-purple-600/30 border border-purple-400/40 px-3 py-1 rounded-full">
            <Text className="text-purple-300 text-[11px] font-bold tracking-wider">{currentTier} PLAN</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEditName(displayName);
              setEditEmail(displayEmail);
              setIsEditing(!isEditing);
            }}
            className="bg-white/10 px-3 py-1 rounded-full border border-white/10"
          >
            <Text className="text-gray-300 text-[11px] font-semibold">
              {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Profile Panel */}
      {isEditing && (
        <GlassCard className="p-4 mb-6 border border-purple-500/40">
          <Text className="text-white font-bold text-sm mb-3">Edit Profile Details</Text>
          
          <Text className="text-gray-400 text-xs mb-1 font-medium">Display Name</Text>
          <TextInput
            className="bg-black/40 border border-white/10 text-white p-3 rounded-xl text-sm mb-3 font-medium"
            value={editName}
            onChangeText={setEditName}
            placeholder="Your Full Name"
            placeholderTextColor="#64748B"
          />

          <Text className="text-gray-400 text-xs mb-1 font-medium">Email / Gmail</Text>
          <TextInput
            className="bg-black/40 border border-white/10 text-white p-3 rounded-xl text-sm mb-4 font-medium"
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder="your.email@gmail.com"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity
            onPress={handleSaveProfile}
            className="bg-purple-600 py-3 rounded-xl items-center shadow-lg shadow-purple-500/20"
          >
            <Text className="text-white font-bold text-xs">Save Changes ✓</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Menu Options */}
      <GlassCard className="p-2 mb-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAction(item)}
            className={`flex-row items-center justify-between p-4 ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-4">{item.icon}</Text>
              <Text className={`text-sm font-semibold ${item.color}`}>{item.label}</Text>
            </View>
            <Text className="text-gray-600 text-base">›</Text>
          </TouchableOpacity>
        ))}
      </GlassCard>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={() => {
          signOut();
          router.push('/feature/login');
        }}
        className="mb-8"
        activeOpacity={0.8}
      >
        <GlassCard className="p-4 flex-row items-center justify-center border border-red-900/40 bg-red-950/20">
          <Text className="text-xl mr-3">🚪</Text>
          <Text className="text-red-400 text-base font-bold">Sign Out</Text>
        </GlassCard>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 text-xs">DO AI OS • Version 1.0.0 (Production)</Text>
    </ScrollView>
  );
}
