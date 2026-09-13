import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon = '👻', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center p-8 w-full">
      <Text className="text-6xl mb-6">{icon}</Text>
      <Text className="text-white text-xl font-bold mb-2 text-center">{title}</Text>
      <Text className="text-[#94A3B8] text-center text-base mb-8">{description}</Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity 
          onPress={onAction}
          className="bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 px-6 py-3 rounded-full"
        >
          <Text className="text-[#A78BFA] font-semibold text-base">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
