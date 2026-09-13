import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const MODES = [
  { id: 'bill', label: '📄 Bill / Invoice' },
  { id: 'product', label: '📱 Product' },
  { id: 'menu', label: '🍽️ Menu' },
  { id: 'fridge', label: '🧊 Fridge' },
  { id: 'doc', label: '📑 Document' },
];

export default function SnapSolveView() {
  const [activeMode, setActiveMode] = useState('bill');
  const [analyzing, setAnalyzing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [reminded, setReminded] = useState(false);

  const handleScanAnother = () => {
    setPaid(false);
    setReminded(false);
  };

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">Snap → Solve 📷</Text>
        <Text className="text-gray-400">Photograph or select any real-world object for instant AI solutions</Text>
      </View>

      {/* Mode Switcher */}
      <Text className="text-white font-bold mb-2 ml-1">Scan Type Preset:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        {MODES.map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => {
              setActiveMode(m.id);
              handleScanAnother();
            }}
            className={`px-4 py-2.5 rounded-full mr-2.5 border ${
              activeMode === m.id 
                ? 'bg-blue-600 border-blue-400 shadow-md shadow-blue-500/20' 
                : 'bg-white/5 border-white/10'
            }`}
          >
            <Text className={activeMode === m.id ? 'text-white font-bold text-sm' : 'text-gray-300 text-sm'}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Camera / Upload Mock Box */}
      <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <View className="h-44 bg-black/40 border border-dashed border-blue-500/40 rounded-xl items-center justify-center mb-4">
          <Text className="text-4xl mb-2">
            {activeMode === 'bill' ? '🧾' : activeMode === 'product' ? '🎧' : activeMode === 'menu' ? '📖' : activeMode === 'fridge' ? '🥦' : '📑'}
          </Text>
          <Text className="text-white font-semibold text-base">
            Sample Captured: {MODES.find(m => m.id === activeMode)?.label}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">Multi-modal OCR & Vision AI active</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity 
            onPress={() => {
              setAnalyzing(true);
              setTimeout(() => setAnalyzing(false), 600);
            }}
            className="flex-1 bg-blue-600 py-3 rounded-xl items-center shadow-md shadow-blue-500/20"
          >
            <Text className="text-white font-bold text-sm">
              {analyzing ? 'Analyzing Visual Data...' : '⚡ Re-Analyze'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleScanAnother}
            className="bg-white/10 px-5 py-3 rounded-xl border border-white/10"
          >
            <Text className="text-gray-300 font-semibold text-sm">Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic Results based on activeMode */}
      <View className="mb-12">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-white">Visual AI Intelligence Breakdown</Text>
          <View className="bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
            <Text className="text-blue-300 text-xs font-bold">Confidence 99%</Text>
          </View>
        </View>

        {activeMode === 'bill' && (
          <View className="bg-white/10 rounded-2xl p-5 border border-white/10">
            <View className="flex-row justify-between items-start mb-4 pb-4 border-b border-white/10">
              <View>
                <Text className="text-lg font-bold text-white">Tata Power Utility Invoice</Text>
                <Text className="text-gray-400 text-xs mt-0.5">Consumer No: #893420-192 • Mumbai</Text>
              </View>
              <View className="bg-red-500/20 px-2.5 py-1 rounded-md border border-red-500/30">
                <Text className="text-red-400 text-xs font-bold">DUE TODAY</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-400 text-xs mb-0.5">Amount Payable</Text>
                <Text className="text-red-400 text-3xl font-bold">₹2,450.00</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 text-xs mb-0.5">Late Fee Deadline</Text>
                <Text className="text-white text-base font-semibold">11:59 PM Tonight</Text>
              </View>
            </View>

            <View className="bg-white/5 p-3.5 rounded-xl mb-4">
              <Text className="text-gray-300 text-xs leading-5">
                💡 AI Insight: This bill is 14% higher than September due to air conditioning usage. Pay today to avoid a ₹180 penalty.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setReminded(true)}
                className={`flex-1 py-3 rounded-xl items-center border ${reminded ? 'bg-green-500/20 border-green-500' : 'bg-white/10 border-white/10'}`}
              >
                <Text className={reminded ? 'text-green-300 font-bold text-xs' : 'text-white font-medium text-xs'}>
                  {reminded ? 'Reminder Set ✓' : 'Add to Reminders'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setPaid(true)}
                className={`flex-1 py-3 rounded-xl items-center shadow-lg shadow-blue-500/20 ${paid ? 'bg-green-600' : 'bg-blue-600'}`}
              >
                <Text className="text-white font-bold text-xs">
                  {paid ? 'Paid Successfully! ✓' : 'Pay Now (UPI / GPay)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeMode === 'product' && (
          <View className="bg-white/10 rounded-2xl p-5 border border-white/10">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-lg font-bold text-white">Sony WH-1000XM5 Wireless ANC</Text>
                <Text className="text-gray-400 text-xs mt-0.5">Identified via barcode & silhouette match</Text>
              </View>
              <Text className="text-green-400 text-xl font-bold">₹26,990</Text>
            </View>

            <View className="bg-blue-900/20 border border-blue-500/30 p-3.5 rounded-xl mb-4">
              <Text className="text-blue-200 text-xs leading-5">
                🏷️ Price Comparison: Amazon has it for ₹26,990. Croma has bank discount down to ₹24,990 with HDFC card.
              </Text>
            </View>

            <View className="gap-2">
              <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center">
                <Text className="text-white font-bold text-xs">Find Lowest Online Price (₹24,990)</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/10 py-3 rounded-xl items-center border border-white/10">
                <Text className="text-gray-300 font-medium text-xs">Compare with Sony XM4 (Save ₹7,000)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeMode === 'menu' && (
          <View className="bg-white/10 rounded-2xl p-5 border border-white/10">
            <Text className="text-lg font-bold text-white mb-1">Cafe Bistro Specialty Menu</Text>
            <Text className="text-gray-400 text-xs mb-4">Top 3 dishes filtered for high reviews & balanced taste:</Text>
            
            <View className="gap-3 mb-4">
              <View className="bg-white/5 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-white font-bold text-sm">🥇 Truffle Wild Mushroom Pasta</Text>
                  <Text className="text-gray-400 text-xs">Chef recommendation • Fresh hand-rolled</Text>
                </View>
                <Text className="text-orange-400 font-bold text-sm">₹650</Text>
              </View>
              <View className="bg-white/5 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-white font-bold text-sm">🥈 Burrata Wood-fired Pizza</Text>
                  <Text className="text-gray-400 text-xs">Imported cheese • San Marzano sauce</Text>
                </View>
                <Text className="text-orange-400 font-bold text-sm">₹580</Text>
              </View>
              <View className="bg-white/5 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-white font-bold text-sm">💰 Garlic Olive Oil Penne</Text>
                  <Text className="text-gray-400 text-xs">Classic light lunch</Text>
                </View>
                <Text className="text-green-400 font-bold text-sm">₹380</Text>
              </View>
            </View>
          </View>
        )}

        {activeMode === 'fridge' && (
          <View className="bg-white/10 rounded-2xl p-5 border border-white/10">
            <Text className="text-lg font-bold text-white mb-1">Fridge Inventory Analysis</Text>
            <Text className="text-gray-400 text-xs mb-3">Detected 5 fresh ingredients inside:</Text>
            
            <View className="flex-row flex-wrap gap-2 mb-4">
              {['6 Eggs', 'Cheddar Cheese Block', 'Leftover Steamed Rice', 'Spring Onions', 'Greek Yogurt'].map((ing, i) => (
                <View key={i} className="bg-white/10 px-3 py-1.5 rounded-lg">
                  <Text className="text-cyan-300 text-xs font-medium">✓ {ing}</Text>
                </View>
              ))}
            </View>

            <View className="bg-cyan-950/40 border border-cyan-500/40 p-4 rounded-xl mb-4">
              <Text className="text-cyan-300 font-bold text-sm mb-1">🍳 Instant 10-Minute Meal Solution:</Text>
              <Text className="text-white text-base font-semibold">Cheesy Egg Fried Rice Skillet</Text>
              <Text className="text-gray-300 text-xs mt-1 leading-5">Takes 8 minutes, uses 4 of your items, and prevents leftover rice waste.</Text>
            </View>

            <TouchableOpacity className="bg-cyan-600 py-3 rounded-xl items-center shadow-md shadow-cyan-500/20">
              <Text className="text-white font-bold text-xs">View Step-by-Step Cooking Guide</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeMode === 'doc' && (
          <View className="bg-white/10 rounded-2xl p-5 border border-white/10">
            <Text className="text-lg font-bold text-white mb-1">Residential Lease Agreement</Text>
            <Text className="text-gray-400 text-xs mb-3">12-page document distilled to 3 essentials:</Text>

            <View className="bg-red-950/30 border border-red-500/30 p-3.5 rounded-xl mb-3">
              <Text className="text-red-300 font-bold text-xs mb-1">⚠️ Action Required:</Text>
              <Text className="text-gray-200 text-xs">Transfer ₹50,000 security deposit before Oct 20th and sign pages 4 & 7.</Text>
            </View>

            <View className="bg-white/5 p-3.5 rounded-xl mb-4">
              <Text className="text-gray-300 text-xs mb-1"><Text className="text-white font-bold">Rent:</Text> ₹24,000/mo (due on 5th)</Text>
              <Text className="text-gray-300 text-xs mb-1"><Text className="text-white font-bold">Lock-in:</Text> 6 months</Text>
              <Text className="text-gray-300 text-xs"><Text className="text-white font-bold">Notice period:</Text> 30 days</Text>
            </View>

            <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center shadow-md shadow-blue-500/20">
              <Text className="text-white font-bold text-xs">Open in Document Explainer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
