import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import GlassCard from './GlassCard';

export interface CommandInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onVoicePress: () => void;
  onCameraPress: () => void;
  onUploadPress: () => void;
  autoFocus?: boolean;
}

export default function CommandInput({
  value,
  onChangeText,
  onSubmit,
  onVoicePress,
  onCameraPress,
  onUploadPress,
  autoFocus = false,
}: CommandInputProps) {
  return (
    <GlassCard variant="default" className="p-4 w-full">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="What do you need?"
        placeholderTextColor="#94A3B8"
        autoFocus={autoFocus}
        returnKeyType="send"
        className="text-white text-lg font-medium min-h-[60px] mb-4 px-2"
        multiline={true}
        style={{ textAlignVertical: 'top' }}
      />
      <View className="flex-row items-center justify-between px-2 pt-2 border-t border-white/10">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={onCameraPress} className="p-2 bg-[#2A2A3E] rounded-full">
            <Text className="text-xl">📷</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUploadPress} className="p-2 bg-[#2A2A3E] rounded-full">
            <Text className="text-xl">📎</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onVoicePress} className="p-3 bg-[#8B5CF6]/20 rounded-full border border-[#8B5CF6]/40">
          <Text className="text-xl">🎤</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}
