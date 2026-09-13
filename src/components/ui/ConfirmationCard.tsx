import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GlassCard from './GlassCard';

export interface ConfirmationCardProps {
  title: string;
  description: string;
  details?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'info' | 'danger';
}

export default function ConfirmationCard({
  title,
  description,
  details,
  onConfirm,
  onCancel,
  variant = 'warning'
}: ConfirmationCardProps) {
  const getTheme = () => {
    switch(variant) {
      case 'danger': return { icon: '⚠️', color: 'text-[#EF4444]', btnBg: 'bg-[#EF4444]' };
      case 'info': return { icon: 'ℹ️', color: 'text-[#3B82F6]', btnBg: 'bg-[#3B82F6]' };
      case 'warning': default: return { icon: '⚡', color: 'text-[#F59E0B]', btnBg: 'bg-[#F59E0B]' };
    }
  };

  const theme = getTheme();

  return (
    <GlassCard variant="subtle" className="p-5 border border-white/10">
      <View className="flex-row items-center mb-3">
        <Text className="text-2xl mr-2">{theme.icon}</Text>
        <Text className={`text-lg font-bold ${theme.color}`}>{title}</Text>
      </View>
      
      <Text className="text-white text-base mb-2">{description}</Text>
      
      {details && (
        <View className="bg-[#0A0A0F]/50 p-3 rounded-lg mb-4">
          <Text className="text-[#94A3B8] text-sm">{details}</Text>
        </View>
      )}

      <View className="flex-row space-x-3 mt-4">
        <TouchableOpacity 
          onPress={onCancel}
          className="flex-1 py-3 rounded-xl bg-[#2A2A3E] items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onConfirm}
          className={`flex-1 py-3 rounded-xl items-center ${theme.btnBg}`}
        >
          <Text className="text-white font-bold">Confirm</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}
