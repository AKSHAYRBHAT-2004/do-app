import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ConfirmationCard from '@/components/ui/ConfirmationCard';

export default function ConfirmationModal() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = (params.title as string) || 'Confirm Action';
  const description =
    (params.description as string) ||
    'DO needs your approval before performing this action.';
  const details =
    (params.details as string) ||
    'Irreversible operations, external communications, and transactions require explicit user consent.';
  const variant = (params.variant as 'warning' | 'info' | 'danger') || 'warning';

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleConfirm = () => {
    safeBack();
  };

  const handleCancel = () => {
    safeBack();
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]/90 justify-center p-6">
      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-full bg-purple-900/30 items-center justify-center border border-purple-500/40 mb-3">
          <Text className="text-3xl">🛡️</Text>
        </View>
        <Text className="text-white text-xl font-bold">Safety & Trust Gate</Text>
        <Text className="text-gray-400 text-xs text-center mt-1">
          Zero surprise actions. You maintain complete control.
        </Text>
      </View>

      <ConfirmationCard
        title={title}
        description={description}
        details={details}
        variant={variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <TouchableOpacity onPress={() => router.back()} className="mt-6 items-center">
        <Text className="text-gray-500 text-sm">Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}
