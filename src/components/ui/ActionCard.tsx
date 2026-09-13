import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GlassCard from './GlassCard';

export type ActionStatus = 'pending' | 'in_progress' | 'completed';

export interface ActionCardProps {
  title: string;
  description: string;
  icon?: string;
  actions: { label: string; variant?: 'primary' | 'secondary'; onPress: () => void }[];
  status?: ActionStatus;
  details?: string;
}

export default function ActionCard({
  title,
  description,
  icon = '✨',
  actions,
  status = 'pending',
  details
}: ActionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch(status) {
      case 'completed': return 'bg-[#10B981]';
      case 'in_progress': return 'bg-[#F59E0B]';
      default: return 'bg-[#94A3B8]';
    }
  };

  return (
    <GlassCard variant="default" className="p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-[#2A2A3E] items-center justify-center mr-3">
            <Text className="text-xl">{icon}</Text>
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-white text-base font-semibold">{title}</Text>
            <Text className="text-[#94A3B8] text-sm mt-1">{description}</Text>
          </View>
        </View>
        <View className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
      </View>
      
      {details && expanded && (
        <View className="mt-4 p-3 bg-[#12121A]/50 rounded-xl">
          <Text className="text-[#E2E8F0] text-sm leading-5">{details}</Text>
        </View>
      )}

      {details && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="mt-2 py-2">
          <Text className="text-[#8B5CF6] text-sm font-medium">{expanded ? 'Show Less' : 'Show Details'}</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row space-x-3 mt-4 pt-4 border-t border-white/10">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={action.onPress}
            className={`flex-1 py-3 rounded-xl items-center justify-center ${
              action.variant === 'primary' || !action.variant
                ? 'bg-[#8B5CF6]' 
                : 'bg-[#2A2A3E]'
            }`}
          >
            <Text className={`font-semibold ${action.variant === 'primary' || !action.variant ? 'text-white' : 'text-[#E2E8F0]'}`}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </GlassCard>
  );
}
