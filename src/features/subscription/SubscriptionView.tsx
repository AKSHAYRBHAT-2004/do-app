import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function SubscriptionView() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTier, setActiveTier] = useState<'free' | 'pro' | 'premium'>('pro');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectTier = (tier: 'free' | 'pro' | 'premium') => {
    setActiveTier(tier);
    if (tier === 'free') {
      showToast('Switched to Free plan');
    } else {
      showToast(`🎉 Upgraded to ${tier.toUpperCase()} (${billingCycle})!`);
    }
  };

  const proPrice = billingCycle === 'monthly' ? '₹299' : '₹2,799';
  const proPeriod = billingCycle === 'monthly' ? '/mo' : '/yr (Save 22%)';

  const premPrice = billingCycle === 'monthly' ? '₹599' : '₹5,699';
  const premPeriod = billingCycle === 'monthly' ? '/mo' : '/yr (Save 20%)';

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      {/* Header */}
      <View className="mb-6 mt-4 items-center">
        <Text className="text-3xl font-bold text-white mb-2">Choose Your Plan</Text>
        <Text className="text-gray-400 text-center text-xs">
          Unlock the full autonomous power of your AI Life Operating System
        </Text>
      </View>

      {/* Toast Alert */}
      {toastMessage && (
        <View className="bg-purple-500/20 border border-purple-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-purple-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* Billing Cycle Switcher */}
      <View className="flex-row justify-center mb-6">
        <View className="flex-row bg-white/5 p-1 rounded-2xl border border-white/10">
          <TouchableOpacity
            onPress={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl ${billingCycle === 'monthly' ? 'bg-purple-600' : ''}`}
          >
            <Text className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl flex-row items-center ${billingCycle === 'annual' ? 'bg-purple-600' : ''}`}
          >
            <Text className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-white' : 'text-gray-400'}`}>
              Annual
            </Text>
            <View className="ml-1.5 bg-emerald-500/30 px-1.5 py-0.5 rounded">
              <Text className="text-emerald-300 text-[9px] font-bold">-20%</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="gap-5 mb-8">
        {/* FREE TIER */}
        <View
          className={`border rounded-3xl p-5 ${
            activeTier === 'free'
              ? 'bg-white/10 border-white/30'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-white">FREE STARTER</Text>
            {activeTier === 'free' && (
              <View className="bg-white/10 px-3 py-1 rounded-full">
                <Text className="text-gray-300 text-xs font-bold">Active Plan</Text>
              </View>
            )}
          </View>
          <Text className="text-3xl font-black text-white mb-4">
            ₹0<Text className="text-gray-500 text-sm font-normal">/forever</Text>
          </Text>

          <View className="gap-2 mb-5">
            <Text className="text-gray-300 text-xs">• 50 AI requests per day</Text>
            <Text className="text-gray-300 text-xs">• Basic decision comparisons</Text>
            <Text className="text-gray-300 text-xs">• Standard text memory storage</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleSelectTier('free')}
            disabled={activeTier === 'free'}
            className={`py-3 rounded-xl items-center border ${
              activeTier === 'free'
                ? 'bg-white/5 border-white/10 opacity-50'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Text className="text-white font-bold text-xs">
              {activeTier === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PRO TIER */}
        <View
          className={`border-2 rounded-3xl p-6 relative overflow-hidden ${
            activeTier === 'pro'
              ? 'bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-500/20'
              : 'bg-white/5 border-purple-500/40'
          }`}
        >
          <View className="absolute top-0 right-0 bg-purple-600 px-3 py-1 rounded-bl-xl">
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Most Popular</Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Text className="text-xl font-bold text-purple-300">PRO OPERATOR</Text>
            {activeTier === 'pro' && (
              <View className="ml-3 bg-purple-500/30 px-2.5 py-0.5 rounded-full border border-purple-400">
                <Text className="text-purple-200 text-[10px] font-bold">Active Plan</Text>
              </View>
            )}
          </View>

          <Text className="text-4xl font-black text-white my-3">
            {proPrice}
            <Text className="text-purple-300/60 text-xs font-medium ml-1"> {proPeriod}</Text>
          </Text>

          <View className="gap-2.5 mb-6">
            <Text className="text-white text-xs font-semibold">⚡ Unlimited AI tasks & streaming</Text>
            <Text className="text-white text-xs font-semibold">🧠 Full Context Autonomous Memory</Text>
            <Text className="text-white text-xs font-semibold">📷 Visual Snap & Solve (Bills & Documents)</Text>
            <Text className="text-white text-xs font-semibold">✈️ 30-Second Travel & Itinerary Engine</Text>
            <Text className="text-white text-xs font-semibold">💰 Proactive Budget & Expense Guard</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleSelectTier('pro')}
            className={`py-3.5 rounded-xl items-center shadow-lg shadow-purple-500/30 ${
              activeTier === 'pro' ? 'bg-purple-600' : 'bg-purple-600'
            }`}
          >
            <Text className="text-white font-bold text-sm">
              {activeTier === 'pro' ? '✓ Manage Active Pro Plan' : 'Start 7-Day Free Trial'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PREMIUM TIER */}
        <View
          className={`border rounded-3xl p-6 ${
            activeTier === 'premium'
              ? 'bg-amber-950/30 border-amber-500'
              : 'bg-white/5 border-amber-500/20'
          }`}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xl font-bold text-amber-400">PREMIUM CONCIERGE</Text>
            {activeTier === 'premium' && (
              <View className="bg-amber-500/30 px-2.5 py-0.5 rounded-full border border-amber-400">
                <Text className="text-amber-200 text-[10px] font-bold">Active Plan</Text>
              </View>
            )}
          </View>

          <Text className="text-3xl font-black text-white my-2">
            {premPrice}
            <Text className="text-gray-400 text-xs font-normal ml-1"> {premPeriod}</Text>
          </Text>

          <View className="gap-2 mb-5">
            <Text className="text-gray-300 text-xs">• Everything in Pro plan</Text>
            <Text className="text-gray-300 text-xs">• Ultra-low latency priority AI model access</Text>
            <Text className="text-gray-300 text-xs">• Autonomous background execution agents</Text>
            <Text className="text-gray-300 text-xs">• Family sharing up to 4 accounts</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleSelectTier('premium')}
            className={`py-3.5 rounded-xl items-center border ${
              activeTier === 'premium'
                ? 'bg-amber-500 border-amber-400'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Text className={`font-bold text-sm ${activeTier === 'premium' ? 'text-black' : 'text-white'}`}>
              {activeTier === 'premium' ? '✓ Active Premium Concierge' : 'Upgrade to Concierge'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => showToast('Purchases restored from App Store / Google Play')}
        className="mb-12 self-center py-2"
      >
        <Text className="text-gray-500 text-xs font-medium">Restore Purchases</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
