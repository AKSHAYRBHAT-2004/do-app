import React from 'react';
import { View, Text } from 'react-native';

export type PriorityLevel = 'urgent' | 'today' | 'low' | 'handled';

export interface PriorityIndicatorProps {
  priority: PriorityLevel;
  showLabel?: boolean;
}

export default function PriorityIndicator({ priority, showLabel = true }: PriorityIndicatorProps) {
  const getProps = () => {
    switch(priority) {
      case 'urgent': return { color: 'bg-[#EF4444]', label: 'DO NOW', textColor: 'text-[#EF4444]' };
      case 'today': return { color: 'bg-[#F59E0B]', label: 'DO TODAY', textColor: 'text-[#F59E0B]' };
      case 'handled': return { color: 'bg-[#8B5CF6]', label: 'AI HANDLED', textColor: 'text-[#8B5CF6]' };
      case 'low': default: return { color: 'bg-[#10B981]', label: 'CAN WAIT', textColor: 'text-[#10B981]' };
    }
  };

  const { color, label, textColor } = getProps();

  return (
    <View className="flex-row items-center space-x-2">
      <View className={`w-3 h-3 rounded-full ${color}`} />
      {showLabel && (
        <Text className={`text-xs font-bold tracking-wider ${textColor}`}>
          {label}
        </Text>
      )}
    </View>
  );
}
