import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GlassCard from './GlassCard';

export interface PlanStep {
  title: string;
  description?: string;
  timeEstimate?: string;
  completed: boolean;
}

export interface PlanCardProps {
  title: string;
  steps: PlanStep[];
  onToggleStep: (index: number) => void;
}

export default function PlanCard({ title, steps, onToggleStep }: PlanCardProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <GlassCard variant="default" className="p-4">
      <Text className="text-white text-lg font-bold mb-3">{title}</Text>
      
      <View className="h-2 bg-[#2A2A3E] rounded-full mb-4 overflow-hidden">
        <View 
          className="h-full bg-[#10B981]" 
          style={{ width: `${progressPercent}%` }} 
        />
      </View>

      <View className="space-y-3">
        {steps.map((step, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex-row items-start"
            onPress={() => onToggleStep(index)}
          >
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 mt-0.5 ${
              step.completed ? 'bg-[#10B981] border-[#10B981]' : 'border-[#64748B]'
            }`}>
              {step.completed && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <View className="flex-1">
              <Text className={`text-base font-medium ${step.completed ? 'text-[#94A3B8] line-through' : 'text-white'}`}>
                {step.title}
              </Text>
              {step.description && (
                <Text className="text-[#64748B] text-sm mt-1">{step.description}</Text>
              )}
              {step.timeEstimate && (
                <Text className="text-[#8B5CF6] text-xs font-medium mt-1 mt-1">⏱ {step.timeEstimate}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </GlassCard>
  );
}
