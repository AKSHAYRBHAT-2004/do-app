import React from 'react';
import { View, Text, TextInput } from 'react-native';

export interface BudgetSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  currency?: string;
}

export default function BudgetSlider({ min, max, value, onChange, currency = '₹' }: BudgetSliderProps) {
  const percent = Math.min(Math.max((value - min) / (max - min), 0), 1) * 100;

  const handleTextChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      onChange(num);
    } else {
      onChange(min);
    }
  };

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="text-[#94A3B8] text-sm">Budget</Text>
        <View className="flex-row items-center bg-[#2A2A3E] px-3 py-1.5 rounded-lg">
          <Text className="text-[#A78BFA] font-bold mr-1">{currency}</Text>
          <TextInput
            value={value.toString()}
            onChangeText={handleTextChange}
            keyboardType="numeric"
            className="text-white font-bold text-lg p-0 m-0 w-24 text-right"
          />
        </View>
      </View>

      <View className="h-2 bg-[#2A2A3E] rounded-full overflow-hidden w-full mb-2">
        <View 
          className="h-full bg-[#8B5CF6] rounded-full"
          style={{ width: `${percent}%` }}
        />
      </View>
      
      <View className="flex-row justify-between">
        <Text className="text-[#64748B] text-xs">{currency}{min.toLocaleString()}</Text>
        <Text className="text-[#64748B] text-xs">{currency}{max.toLocaleString()}</Text>
      </View>
    </View>
  );
}
