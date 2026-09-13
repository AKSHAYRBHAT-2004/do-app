import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import { useAppStore } from '@/stores/appStore';
import { useMemoryStore } from '@/stores/memoryStore';

export default function SettingsModal() {
  const router = useRouter();
  const { theme, setTheme, currentMode, setCurrentMode } = useAppStore();
  const { clearAllMemory } = useMemoryStore();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-6 border-b border-white/10 bg-[#12121A]">
        <Text className="text-white text-xl font-bold">Settings & Privacy</Text>
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Text className="text-purple-400 font-semibold text-base">Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Appearance */}
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Appearance</Text>
        <GlassCard className="p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-base font-medium">Dark Mode</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Optimized for battery and OLED</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#334155', true: '#8B5CF6' }}
            />
          </View>
        </GlassCard>

        {/* Operating Modes */}
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Operating Mode</Text>
        <GlassCard className="p-2 mb-6">
          <TouchableOpacity
            onPress={() => setCurrentMode('normal')}
            className={`flex-row items-center justify-between p-3 rounded-xl ${
              currentMode === 'normal' ? 'bg-purple-900/30' : ''
            }`}
          >
            <View>
              <Text className="text-white font-semibold">Standard Life Operator</Text>
              <Text className="text-gray-400 text-xs">Balanced proactive & reactive AI</Text>
            </View>
            {currentMode === 'normal' && <Text className="text-purple-400 font-bold">✓</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentMode('lazy')}
            className={`flex-row items-center justify-between p-3 rounded-xl mt-1 ${
              currentMode === 'lazy' ? 'bg-purple-900/30' : ''
            }`}
          >
            <View>
              <Text className="text-white font-semibold">Lazy Day Mode 😴</Text>
              <Text className="text-gray-400 text-xs">Minimum taps, AI handles hard parts</Text>
            </View>
            {currentMode === 'lazy' && <Text className="text-purple-400 font-bold">✓</Text>}
          </TouchableOpacity>
        </GlassCard>

        {/* AI & Memory Controls */}
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">AI Safety & Memory</Text>
        <GlassCard className="p-4 mb-6">
          <View className="mb-4">
            <Text className="text-white font-medium">Local-First PII Masking</Text>
            <Text className="text-gray-400 text-xs mt-1">
              Sensitive identifiers (phone numbers, card numbers) are masked on-device before any cloud processing.
            </Text>
          </View>
          <View className="pt-3 border-t border-white/5">
            <TouchableOpacity
              onPress={() => {
                clearAllMemory();
                alert('Personal Memory cleared.');
              }}
              className="py-2"
            >
              <Text className="text-red-400 font-semibold">Clear All Stored Memory</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Currency & Region */}
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Region & Currency</Text>
        <GlassCard className="p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-medium">Default Currency</Text>
            <Text className="text-purple-400 font-bold">INR (₹)</Text>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}
