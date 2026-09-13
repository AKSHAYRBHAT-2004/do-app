import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import CommandInput from '@/components/ui/CommandInput';
import AnimatedOrb from '@/components/ui/AnimatedOrb';
import QuickSuggestion from '@/components/ui/QuickSuggestion';
import GlassCard from '@/components/ui/GlassCard';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubmit = () => {
    if (inputText.trim()) {
      const q = inputText.trim();
      setInputText('');
      router.push({
        pathname: '/chat/[id]',
        params: { id: Date.now().toString(), query: q },
      });
    }
  };

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  const suggestions = [
    { icon: '🍕', label: 'What should I eat?', route: '/feature/what-do-i-eat' },
    { icon: '🏆', label: 'Tell me the best', route: '/feature/tell-me-best' },
    { icon: '✈️', label: 'Plan something', route: '/feature/trip-planner' },
    { icon: '🤔', label: 'What should I do?', route: '/feature/what-should-i-do' },
    { icon: '⚡', label: 'Save me time', route: '/feature/five-minute-life' },
    { icon: '😴', label: 'Lazy Day', route: '/feature/lazy-day' },
    { icon: '📷', label: 'Snap → Solve', route: '/feature/snap-solve' },
    { icon: '📄', label: 'Explain this', route: '/feature/explain-it' },
    { icon: '💰', label: 'Money Assistant', route: '/feature/money' },
    { icon: '🏠', label: 'Home Autopilot', route: '/feature/home-autopilot' },
  ];

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F]" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      {/* Header with Animated Orb */}
      <Animated.View style={{ opacity: fadeAnim }} className="items-center mb-8">
        <AnimatedOrb isActive={false} size={60} />
        <Text className="text-white text-3xl font-bold mt-4 tracking-wider">DO</Text>
        <Text className="text-gray-400 text-sm mt-1">AI Life Operating System</Text>
      </Animated.View>

      {/* Main Command Input */}
      <View className="mb-6">
        <CommandInput
          value={inputText}
          onChangeText={setInputText}
          onSubmit={handleSubmit}
          onVoicePress={() => router.push('/(modals)/voice')}
          onCameraPress={() => router.push('/(modals)/camera')}
          onUploadPress={() => router.push('/feature/explain-it')}
        />
      </View>

      {/* Quick Actions Grid */}
      <View className="mb-6">
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {suggestions.map((item, index) => (
            <View key={index} className="w-[48%] mb-3">
              <QuickSuggestion
                icon={item.icon}
                label={item.label}
                onPress={() => handleQuickAction(item.route)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Today Summary */}
      <View className="mb-6">
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Today</Text>
        <GlassCard className="p-5" onPress={() => router.push('/(tabs)/dashboard')}>
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-3">📋</Text>
            <Text className="text-white text-base">3 tasks pending</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-3">💰</Text>
            <Text className="text-white text-base">1 bill due tomorrow</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xl mr-3">📅</Text>
            <Text className="text-white text-base">2 events today</Text>
          </View>
        </GlassCard>
      </View>

      {/* What Should I Do Now? Button */}
      <TouchableOpacity
        className="mt-2 mb-10"
        activeOpacity={0.8}
        onPress={() => router.push('/feature/what-should-i-do')}
      >
        <GlassCard variant="accent" className="p-5 items-center justify-center">
          <Text className="text-purple-300 font-bold text-lg tracking-wide">
            WHAT SHOULD I DO NOW?
          </Text>
          <Text className="text-purple-400/60 text-xs mt-1">
            AI will suggest your best next action
          </Text>
        </GlassCard>
      </TouchableOpacity>
    </ScrollView>
  );
}
