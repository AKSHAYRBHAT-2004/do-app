import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Feature Views
import TellMeBestView from '@/features/tell-me-best/TellMeBestView';
import WhatShouldIDoView from '@/features/what-should-i-do/WhatShouldIDoView';
import SnapSolveView from '@/features/snap-solve/SnapSolveView';
import JustDoItView from '@/features/just-do-it/JustDoItView';
import LazyDayView from '@/features/lazy-day/LazyDayView';
import FiveMinuteLifeView from '@/features/five-minute-life/FiveMinuteLifeView';
import WhatDoIEatView from '@/features/what-do-i-eat/WhatDoIEatView';
import TripPlannerView from '@/features/trip-planner/TripPlannerView';
import ExplainItView from '@/features/explain-it/ExplainItView';
import MoneyAssistantView from '@/features/money/MoneyAssistantView';
import HomeAutopilotView from '@/features/home-autopilot/HomeAutopilotView';
import MemoryView from '@/features/memory/MemoryView';
import NotificationBrain from '@/features/notifications/NotificationBrain';
import SubscriptionView from '@/features/subscription/SubscriptionView';
import LoginScreen from '@/features/auth/LoginScreen';

const FEATURE_TITLES: Record<string, string> = {
  'tell-me-best': 'Tell Me The Best',
  'what-should-i-do': 'What Should I Do?',
  'snap-solve': 'Snap → Solve',
  'just-do-it': 'Just Do It',
  'lazy-day': 'Lazy Day Mode',
  'five-minute-life': '5-Minute Life',
  'what-do-i-eat': 'What Do I Eat?',
  'trip-planner': 'Trip in 30 Seconds',
  'explain-it': "Explain It Like I'm Lazy",
  'money': 'Money Assistant',
  'home-autopilot': 'Home Autopilot',
  'memory': 'Personal Memory',
  'notifications': 'Notification Brain',
  'subscription': 'Subscription Plans',
  'login': 'Sign In / Sign Up',
};

export default function FeatureScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const title = (slug && FEATURE_TITLES[slug]) || 'DO Feature';

  const renderFeatureContent = () => {
    switch (slug) {
      case 'tell-me-best':
        return <TellMeBestView />;
      case 'what-should-i-do':
        return <WhatShouldIDoView />;
      case 'snap-solve':
        return <SnapSolveView />;
      case 'just-do-it':
        return <JustDoItView />;
      case 'lazy-day':
        return <LazyDayView />;
      case 'five-minute-life':
        return <FiveMinuteLifeView />;
      case 'what-do-i-eat':
        return <WhatDoIEatView />;
      case 'trip-planner':
        return <TripPlannerView />;
      case 'explain-it':
        return <ExplainItView />;
      case 'money':
        return <MoneyAssistantView />;
      case 'home-autopilot':
        return <HomeAutopilotView />;
      case 'memory':
        return <MemoryView />;
      case 'notifications':
        return <NotificationBrain />;
      case 'subscription':
        return <SubscriptionView />;
      case 'login':
        return <LoginScreen />;
      default:
        return (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-white text-xl font-bold">Feature not found</Text>
            <Text className="text-gray-400 text-sm mt-2">
              The requested feature &quot;{slug}&quot; is coming soon.
            </Text>
          </View>
        );
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]">
      {/* Universal Header */}
      <View className="flex-row items-center justify-between pt-14 pb-3 px-4 border-b border-white/5 bg-[#12121A]/90">
        <TouchableOpacity onPress={handleBack} className="p-2 flex-row items-center">
          <Text className="text-purple-400 text-base font-semibold mr-1">‹</Text>
          <Text className="text-gray-400 text-sm">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-base font-bold flex-1 text-center mr-12" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Feature Content */}
      <View className="flex-1">{renderFeatureContent()}</View>
    </View>
  );
}
