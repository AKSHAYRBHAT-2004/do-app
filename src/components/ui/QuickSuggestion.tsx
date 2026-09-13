import React, { useRef } from 'react';
import { Text, TouchableWithoutFeedback, Animated } from 'react-native';
import GlassCard from './GlassCard';

export interface QuickSuggestionProps {
  icon?: string;
  label: string;
  onPress: () => void;
}

export default function QuickSuggestion({ icon, label, onPress }: QuickSuggestionProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="self-start">
        <GlassCard variant="subtle" className="flex-row items-center px-4 py-2 rounded-full border border-white/5">
          {icon && <Text className="mr-2 text-base">{icon}</Text>}
          <Text className="text-white text-sm font-medium">{label}</Text>
        </GlassCard>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
