import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

export interface TimeSlotPickerProps {
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
}

const slots = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
];

export default function TimeSlotPicker({ selectedMinutes, onSelect }: TimeSlotPickerProps) {
  return (
    <View className="py-2">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {slots.map((slot) => {
          const isSelected = selectedMinutes === slot.value;
          return (
            <TouchableOpacity
              key={slot.value}
              onPress={() => onSelect(slot.value)}
              className={`mr-3 px-5 py-2.5 rounded-full border ${
                isSelected 
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]' 
                  : 'bg-[#12121A] border-white/10'
              }`}
            >
              <Text className={`font-medium ${
                isSelected ? 'text-[#A78BFA]' : 'text-[#94A3B8]'
              }`}>
                {slot.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
