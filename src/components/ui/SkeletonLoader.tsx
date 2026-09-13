import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

export interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'action';
  width?: number | string;
  height?: number | string;
  count?: number;
}

export default function SkeletonLoader({ 
  variant = 'text', 
  width, 
  height, 
  count = 1 
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const getStyle = (): any => {
    switch(variant) {
      case 'card': return { width: (width || '100%') as any, height: (height || 120) as any, borderRadius: 16 };
      case 'circle': return { width: (width || 48) as any, height: (height || 48) as any, borderRadius: 9999 };
      case 'action': return { width: (width || '100%') as any, height: (height || 48) as any, borderRadius: 12 };
      case 'text': default: return { width: (width || '100%') as any, height: (height || 20) as any, borderRadius: 4, marginBottom: 8 };
    }
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View className="space-y-3">
      {items.map((i) => (
        <Animated.View
          key={i}
          style={[
            getStyle(),
            { opacity: shimmerAnim },
          ]}
          className="bg-[#2A2A3E]"
        />
      ))}
    </View>
  );
}
