import React from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';

export interface GlassCardProps extends ViewProps {
  variant?: 'default' | 'accent' | 'subtle';
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-[#1A1A2E]/60 border border-[#8B5CF6]/20',
  accent: 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/40',
  subtle: 'bg-[#12121A]/40 border border-white/10',
};

export default function GlassCard({
  variant = 'default',
  onPress,
  className = '',
  children,
  ...props
}: GlassCardProps) {
  const baseClasses = `rounded-2xl overflow-hidden ${variantStyles[variant]} ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} className={baseClasses} {...(props as any)}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={baseClasses} {...props}>
      {children}
    </View>
  );
}
