import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import GlassCard from '@/components/ui/GlassCard';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { setOnboarded } = useAppStore();

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  const completeOnboarding = () => {
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const nextSlide = () => {
    if (activeIndex < 2) {
      scrollViewRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      completeOnboarding();
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row justify-end pt-14 px-6 z-10 absolute w-full top-0">
        <TouchableOpacity onPress={completeOnboarding}>
          <Text className="text-gray-400 font-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {/* Page 1 */}
        <View style={{ width }} className="flex-1 items-center justify-center px-8">
          <View className="w-32 h-32 rounded-full bg-purple-900/20 items-center justify-center border border-purple-500/30 mb-10">
            <Text className="text-white text-5xl font-bold tracking-wider">DO</Text>
          </View>
          <Text className="text-white text-3xl font-bold text-center mb-4">Meet your new</Text>
          <Text className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-3xl font-bold text-center mb-6">AI Life Operator</Text>
          <Text className="text-gray-400 text-center text-lg leading-relaxed">
            Tell us what you need. We'll handle the logistics, planning, and execution.
          </Text>
        </View>

        {/* Page 2 */}
        <View style={{ width }} className="flex-1 items-center justify-center px-8">
          <View className="flex-row flex-wrap justify-center mb-10 w-full gap-4">
            <GlassCard className="w-[45%] aspect-square items-center justify-center p-4">
              <Text className="text-4xl mb-2">🎤</Text>
              <Text className="text-white font-medium">Talk</Text>
            </GlassCard>
            <GlassCard className="w-[45%] aspect-square items-center justify-center p-4">
              <Text className="text-4xl mb-2">📷</Text>
              <Text className="text-white font-medium">Snap</Text>
            </GlassCard>
            <GlassCard className="w-[45%] aspect-square items-center justify-center p-4">
              <Text className="text-4xl mb-2">⌨️</Text>
              <Text className="text-white font-medium">Type</Text>
            </GlassCard>
            <GlassCard className="w-[45%] aspect-square items-center justify-center p-4">
              <Text className="text-4xl mb-2">📎</Text>
              <Text className="text-white font-medium">Upload</Text>
            </GlassCard>
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-4">Express yourself freely</Text>
          <Text className="text-gray-400 text-center text-lg leading-relaxed">
            Multiple ways to communicate. Choose whatever feels most natural to you.
          </Text>
        </View>

        {/* Page 3 */}
        <View style={{ width }} className="flex-1 items-center justify-center px-8">
          <View className="w-full mb-10">
            <GlassCard className="p-6 mb-4 border border-purple-500/30">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-3">✨</Text>
                <Text className="text-white font-bold text-lg">Smart Routing</Text>
              </View>
              <Text className="text-gray-400">Instantly categorized and prioritized.</Text>
            </GlassCard>
            <GlassCard className="p-6 border border-cyan-500/30">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-3">⚡</Text>
                <Text className="text-white font-bold text-lg">Auto Execution</Text>
              </View>
              <Text className="text-gray-400">Tasks are completed before you even ask.</Text>
            </GlassCard>
          </View>
          <Text className="text-white text-3xl font-bold text-center mb-4">We'll figure out the rest</Text>
        </View>
      </ScrollView>

      <View className="pb-12 pt-6 px-8 items-center">
        <View className="flex-row space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={`h-2 rounded-full mx-1 transition-all duration-300 ${activeIndex === i ? 'w-8 bg-purple-500' : 'w-2 bg-gray-700'}`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={nextSlide}
          className="w-full bg-white rounded-2xl py-4 items-center"
        >
          <Text className="text-black font-bold text-lg">{activeIndex === 2 ? 'Get Started' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
