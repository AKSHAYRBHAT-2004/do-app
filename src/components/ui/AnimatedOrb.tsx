import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export interface AnimatedOrbProps {
  isActive: boolean;
  size?: number;
}

export default function AnimatedOrb({ isActive, size = 120 }: AnimatedOrbProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      Animated.timing(opacityAnim, { toValue: 0.5, duration: 500, useNativeDriver: true }).start();
    }
  }, [isActive, scaleAnim, opacityAnim]);

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Animated.View
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: size / 2,
          backgroundColor: '#8B5CF6',
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="absolute"
      />
      <View 
        style={{ width: size * 0.5, height: size * 0.5, borderRadius: size / 2 }}
        className="bg-[#A78BFA] items-center justify-center"
      >
        <View className="w-1/2 h-1/2 bg-white rounded-full opacity-50 blur-md" />
      </View>
    </View>
  );
}
