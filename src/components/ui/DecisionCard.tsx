import React from 'react';
import { View, Text } from 'react-native';
import GlassCard from './GlassCard';

export interface OptionDetail {
  name: string;
  price: string;
  reason: string;
}

export interface DecisionCardProps {
  category: string;
  bestChoice: OptionDetail;
  alternative: OptionDetail;
  cheapest: OptionDetail;
}

export default function DecisionCard({ category, bestChoice, alternative, cheapest }: DecisionCardProps) {
  const renderOption = (title: string, icon: string, option: OptionDetail, isHighlight = false) => (
    <View className={`p-4 rounded-xl mb-3 border ${isHighlight ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50' : 'bg-[#2A2A3E]/40 border-white/5'}`}>
      <View className="flex-row justify-between items-center mb-1">
        <View className="flex-row items-center">
          <Text className="text-xl mr-2">{icon}</Text>
          <Text className={`font-semibold ${isHighlight ? 'text-[#A78BFA]' : 'text-[#E2E8F0]'}`}>{title}</Text>
        </View>
        <Text className="text-white font-bold">{option.price}</Text>
      </View>
      <Text className="text-white text-lg font-medium mb-1">{option.name}</Text>
      <Text className="text-[#94A3B8] text-sm leading-5">{option.reason}</Text>
    </View>
  );

  return (
    <GlassCard variant="default" className="p-4">
      <Text className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-4">Comparison: {category}</Text>
      {renderOption('Best Choice', '🥇', bestChoice, true)}
      {renderOption('Great Alternative', '🥈', alternative)}
      {renderOption('Most Affordable', '💰', cheapest)}
    </GlassCard>
  );
}
