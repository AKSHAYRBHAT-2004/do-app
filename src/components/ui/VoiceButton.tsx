import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, Text } from 'react-native';

export interface VoiceButtonProps {
  isRecording: boolean;
  onPress: () => void;
  size?: number;
}

export default function VoiceButton({ isRecording, onPress, size = 64 }: VoiceButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isRecording, pulseAnim]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`items-center justify-center rounded-full ${isRecording ? 'bg-[#8B5CF6]' : 'bg-[#2A2A3E]'}`}
      style={{
        width: size,
        height: size,
        shadowColor: isRecording ? '#8B5CF6' : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isRecording ? 0.8 : 0,
        shadowRadius: isRecording ? 10 : 0,
        elevation: isRecording ? 10 : 0,
      }}
    >
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Text style={{ fontSize: size * 0.4 }}>🎤</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
