import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import { useAppStore } from '@/stores/appStore';
import { useMemoryStore } from '@/stores/memoryStore';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsModal() {
  const router = useRouter();
  const { theme, setTheme, currentMode, setCurrentMode, geminiApiKey, setGeminiApiKey } = useAppStore();
  const { clearAllMemory } = useMemoryStore();
  const { user, profile } = useAuthStore();

  const [inputApiKey, setInputApiKey] = useState(geminiApiKey || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  const handleSaveApiKey = () => {
    setGeminiApiKey(inputApiKey.trim());
    showToast(inputApiKey.trim() ? '✓ Google Gemini API Key saved!' : 'Cleared API Key');
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-6 border-b border-white/10 bg-[#12121A]">
        <Text className="text-white text-xl font-bold">Settings & AI Config</Text>
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Text className="text-purple-400 font-semibold text-base">Done</Text>
        </TouchableOpacity>
      </View>

      {toastMessage && (
        <View className="bg-purple-500/20 border border-purple-500/40 p-3 mx-6 mt-4 rounded-xl items-center">
          <Text className="text-purple-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Account Info */}
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Account</Text>
        <GlassCard className="p-4 mb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-base font-bold">{profile?.name || 'DO User'}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{user?.email || 'Not signed in'}</Text>
            </View>
            <View className="bg-purple-600/30 border border-purple-500/40 px-2.5 py-1 rounded-full">
              <Text className="text-purple-300 text-[10px] font-bold uppercase">
                {profile?.tier || 'Pro'} Tier
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Live Gemini AI Integration */}
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Live AI Engine (Google Gemini)</Text>
        <GlassCard className="p-4 mb-6 border border-purple-500/30 bg-purple-950/20">
          <View className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">✨</Text>
            <Text className="text-white text-base font-bold">Connect Your Gemini API Key</Text>
          </View>
          <Text className="text-gray-300 text-xs leading-5 mb-3">
            Paste your free Google Gemini API key here to unlock unlimited live AI responses, real-time web knowledge, and visual photo reasoning.
          </Text>

          <TextInput
            className="bg-black/50 border border-white/15 text-white p-3 rounded-xl text-sm font-mono mb-3"
            placeholder="AIzaSy..."
            placeholderTextColor="#64748B"
            secureTextEntry
            value={inputApiKey}
            onChangeText={setInputApiKey}
          />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleSaveApiKey}
              className="flex-1 bg-purple-600 py-2.5 rounded-xl items-center shadow-md shadow-purple-500/20"
            >
              <Text className="text-white font-bold text-xs">
                {inputApiKey.trim() ? 'Save Gemini Key' : 'Remove Key'}
              </Text>
            </TouchableOpacity>
            {inputApiKey.trim().length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setInputApiKey('');
                  setGeminiApiKey('');
                  showToast('Removed Gemini Key');
                }}
                className="px-4 py-2.5 bg-white/10 rounded-xl border border-white/10"
              >
                <Text className="text-gray-300 font-semibold text-xs">Clear</Text>
              </TouchableOpacity>
            )}
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
                showToast('Personal Memory cleared.');
              }}
              className="py-2"
            >
              <Text className="text-red-400 font-semibold text-xs">Clear All Stored Memory</Text>
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
