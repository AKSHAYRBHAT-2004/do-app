import React from 'react';
import { View, Text } from 'react-native';
import GlassCard from './GlassCard';

export interface InsightCategory {
  name: string;
  amount: string;
  color: string;
  percentage: number;
}

export interface InsightCardProps {
  title: string;
  totalAmount: string;
  categories: InsightCategory[];
  trend?: 'up' | 'down' | 'neutral';
}

export default function InsightCard({ title, totalAmount, categories, trend = 'neutral' }: InsightCardProps) {
  const renderTrend = () => {
    if (trend === 'up') return <Text className="text-[#EF4444]">↑</Text>;
    if (trend === 'down') return <Text className="text-[#10B981]">↓</Text>;
    return <Text className="text-[#94A3B8]">-</Text>;
  };

  return (
    <GlassCard variant="default" className="p-5">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-[#94A3B8] text-sm font-medium">{title}</Text>
        {renderTrend()}
      </View>
      <Text className="text-white text-3xl font-bold mb-6">{totalAmount}</Text>

      <View className="h-2 w-full flex-row rounded-full overflow-hidden mb-4">
        {categories.map((cat, i) => (
          <View 
            key={i} 
            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
            className="h-full"
          />
        ))}
      </View>

      <View className="space-y-2">
        {categories.map((cat, i) => (
          <View key={i} className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View style={{ backgroundColor: cat.color }} className="w-3 h-3 rounded-full mr-2" />
              <Text className="text-[#E2E8F0]">{cat.name}</Text>
            </View>
            <Text className="text-white font-medium">{cat.amount}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}
