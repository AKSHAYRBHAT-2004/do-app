import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import CommandInput from '@/components/ui/CommandInput';
import AnimatedOrb from '@/components/ui/AnimatedOrb';
import QuickSuggestion from '@/components/ui/QuickSuggestion';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/stores/authStore';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [inputText, setInputText] = useState('');
  const { user, profile } = useAuthStore();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || '';

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

  // Today summary — tap each to navigate to the right feature
  const todayItems = [
    {
      icon: '💰',
      label: 'Check bills & expenses',
      sublabel: 'Money Assistant',
      route: '/feature/money',
    },
    {
      icon: '🏠',
      label: 'Grocery & chore status',
      sublabel: 'Home Autopilot',
      route: '/feature/home-autopilot',
    },
    {
      icon: '🧠',
      label: 'Your saved memories',
      sublabel: 'Memory Vault',
      route: '/feature/memory',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F]" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      {/* Header with Animated Orb */}
      <Animated.View style={{ opacity: fadeAnim }} className="items-center mb-8">
        <AnimatedOrb isActive={false} size={60} />
        <Text className="text-white text-3xl font-bold mt-4 tracking-wider">DO</Text>
        {firstName ? (
          <Text className="text-gray-400 text-sm mt-1">
            {getGreeting()}, {firstName} 👋
          </Text>
        ) : (
          <Text className="text-gray-400 text-sm mt-1">AI Life Operating System</Text>
        )}
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

      {/* Today Summary — tappable, navigates to real features */}
      <View className="mb-6">
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3 ml-1">Today</Text>
        <View className="gap-2.5">
          {todayItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <GlassCard className="px-5 py-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-xl mr-3">{item.icon}</Text>
                    <View>
                      <Text className="text-white text-sm font-semibold">{item.label}</Text>
                      <Text className="text-gray-500 text-xs mt-0.5">{item.sublabel}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-lg">›</Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>
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
