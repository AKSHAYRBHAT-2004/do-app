import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Stressed' },
  { emoji: '🎉', label: 'Social' },
  { emoji: '🧘', label: 'Calm' }
];

const TIME_OPTIONS = ['15m', '30m', '1h', '3h', 'All Day'];
const BUDGET_OPTIONS = [
  { label: 'Free', value: 0 },
  { label: '₹200', value: 200 },
  { label: '₹500', value: 500 },
  { label: '₹1,500', value: 1500 },
  { label: '₹3,000+', value: 3000 },
];

interface Suggestion {
  title: string;
  badge?: string;
  description: string;
  time: string;
  cost: string;
  actionText: string;
}

export default function WhatShouldIDoView() {
  const [time, setTime] = useState('1h');
  const [budget, setBudget] = useState(0);
  const [mood, setMood] = useState('Tired');
  const [showResults, setShowResults] = useState(true);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const generateSuggestions = (): Suggestion[] => {
    // Dynamic rule-based AI recommendations based on context
    if (mood === 'Tired') {
      if (time === '15m') {
        return [
          { title: 'Power Nap / Restorative Eyes Closed', badge: 'Best Match', description: 'Lie flat in a dim room with binaural beats for 12 minutes. Resets alertness.', time: '⏱️ 15 mins', cost: '💰 Free', actionText: 'Start 12m Timer' },
          { title: 'Electrolyte Hydration Reset', description: 'Drink warm water with pinch of sea salt and lemon. Quick cognitive lift.', time: '⏱️ 5 mins', cost: '💰 Free', actionText: 'Log Hydration' },
          { title: 'Neck & Spine Decompression', description: 'Gentle wall-supported child pose to release lumbar tension.', time: '⏱️ 10 mins', cost: '💰 Free', actionText: 'View Poses' },
        ];
      }
      if (budget >= 1000) {
        return [
          { title: 'Deep Tissue / Foot Reflexology', badge: 'Luxury Relax', description: 'Book a certified therapist to visit or drop by nearby UrbanSpa.', time: '⏱️ 60 mins', cost: '💰 ₹1,200', actionText: 'Find Nearby Spa' },
          { title: 'Hot Bowl of Ramen / Comfort Broth', description: 'Order rich warm broth to nourish and induce restful sleep.', time: '⏱️ 35 mins', cost: '💰 ₹450', actionText: 'Order Food' },
          { title: 'Warm Bath with Epsom Salts', description: 'Soak muscles in magnesium warm bath to release cortisol.', time: '⏱️ 40 mins', cost: '💰 Free', actionText: 'Prepare' },
        ];
      }
      return [
        { title: 'Guided Yoga Nidra for Deep Rest', badge: 'Best Match', description: 'Non-sleep deep rest (NSDR) practice. Zero physical effort, maximum mental recovery.', time: '⏱️ 30 mins', cost: '💰 Free', actionText: 'Play Audio' },
        { title: 'Watch Cozy Feel-Good Comfort Show', description: 'Watch an episode of Ted Lasso or nature documentary under a warm blanket.', time: '⏱️ 45 mins', cost: '💰 Free', actionText: 'Open Streaming' },
        { title: 'Herbal Chamomile Tea & Light Reading', description: 'Brew caffeine-free tea and read 10 pages of light fiction.', time: '⏱️ 25 mins', cost: '💰 Free', actionText: 'Done' },
      ];
    }

    if (mood === 'Stressed') {
      return [
        { title: '4-7-8 Physiological Sigh Breathing', badge: 'Instant Calmer', description: 'Double inhale through nose, long exhale through mouth. Lowers heart rate in 180s.', time: '⏱️ 5 mins', cost: '💰 Free', actionText: 'Start Breath Guide' },
        { title: 'Brain Dump & Priority Triage', description: 'Write down all swirling thoughts on paper. Pick just ONE thing to complete.', time: '⏱️ 15 mins', cost: '💰 Free', actionText: 'Open Scratchpad' },
        { title: 'Outdoor Walking Meditation', description: 'Brisk walk without headphones. Look at horizon to stimulate optic flow.', time: '⏱️ 20 mins', cost: '💰 Free', actionText: 'Start Walk Tracker' },
      ];
    }

    if (mood === 'Social') {
      if (budget >= 1500) {
        return [
          { title: 'Sunset Cocktails & Tapas', badge: 'High Energy', description: 'Hit a rooftop patio with 2-3 friends for craft drinks and appetizers.', time: '⏱️ 2 hours', cost: '💰 ₹1,800', actionText: 'Reserve Table' },
          { title: 'Escape Room / Board Game Lounge', description: 'Collaborative fun with friends at a dedicated games cafe.', time: '⏱️ 90 mins', cost: '💰 ₹800/person', actionText: 'Find Venues' },
          { title: 'Group Dinner at New Thai Spot', description: 'Try spicy street noodles and mango sticky rice with company.', time: '⏱️ 1 hour', cost: '💰 ₹950', actionText: 'Browse Menu' },
        ];
      }
      return [
        { title: 'Coffee Walk in the Park with a Friend', badge: 'Great Value', description: 'Grab cold brew and catch up while walking through botanical grounds.', time: '⏱️ 45 mins', cost: '💰 ₹150', actionText: 'Invite Friend' },
        { title: 'Host a Casual Game Night at Home', description: 'Bring over snacks, put on a lo-fi playlist, and play Catan or Uno.', time: '⏱️ 2 hours', cost: '💰 ₹300', actionText: 'Create Event' },
        { title: 'Catch Up Phone Call to Old Pal', description: 'Call someone you haven’t spoken to in 3 months just to say hi.', time: '⏱️ 20 mins', cost: '💰 Free', actionText: 'Dial Contact' },
      ];
    }

    if (mood === 'Happy') {
      return [
        { title: 'Creative Passion Sprint', badge: 'Peak Flow', description: 'Channel high positive energy into painting, coding, writing, or cooking a new recipe.', time: `⏱️ ${time}`, cost: budget > 0 ? `💰 ₹${budget}` : '💰 Free', actionText: 'Start Session' },
        { title: 'Outdoor Trail Exploration / Cycling', description: 'Rent a bike or take a scenic trail run in the sun for maximum endorphins.', time: '⏱️ 1 hour', cost: '💰 Free', actionText: 'Open Map' },
        { title: 'Treat Yourself to Favorite Meal', description: 'Celebrate your good mood with your favorite dessert or delicacy.', time: '⏱️ 40 mins', cost: budget > 0 ? `💰 ₹${budget}` : '💰 ₹250', actionText: 'Find Spots' },
      ];
    }

    // Calm
    return [
      { title: 'Deep Mindful Reading Session', badge: 'Serenity', description: 'Make a pour-over coffee or green tea and immerse yourself in a philosophical book.', time: '⏱️ 45 mins', cost: '💰 Free', actionText: 'Log Reading' },
      { title: 'Journaling & 90-Day Visioning', description: 'Reflect on personal wins this month and write down 3 intentions for next month.', time: '⏱️ 20 mins', cost: '💰 Free', actionText: 'Open Journal' },
      { title: 'Acoustic Guitar / Ambient Music Immersion', description: 'Listen to ambient Brian Eno album with noise-canceling headphones.', time: '⏱️ 30 mins', cost: '💰 Free', actionText: 'Play Music' },
    ];
  };

  const suggestions = generateSuggestions();

  const handleToggleAction = (title: string) => {
    setCompletedActions(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">What Should I Do?</Text>
        <Text className="text-gray-400">Context-aware suggestions customized to your exact situation</Text>
      </View>

      {/* Control Card */}
      <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
        {/* Time Selector */}
        <Text className="text-white font-bold mb-3 flex-row items-center">
          ⏱️ How much time do you have? <Text className="text-cyan-400 font-normal">({time})</Text>
        </Text>
        <View className="flex-row justify-between mb-6 flex-wrap gap-2">
          {TIME_OPTIONS.map(t => (
            <TouchableOpacity 
              key={t}
              onPress={() => setTime(t)}
              className={`py-2.5 px-4 rounded-xl border ${time === t ? 'bg-cyan-600 border-cyan-400 shadow-md shadow-cyan-500/30' : 'bg-white/5 border-white/10'}`}
            >
              <Text className={time === t ? 'text-white font-bold' : 'text-gray-300'}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget Selector */}
        <Text className="text-white font-bold mb-3">
          💰 What's your budget? <Text className="text-cyan-400 font-normal">({budget === 0 ? 'Free' : `Up to ₹${budget.toLocaleString()}`})</Text>
        </Text>
        <View className="flex-row justify-between mb-6 flex-wrap gap-2">
          {BUDGET_OPTIONS.map(b => (
            <TouchableOpacity 
              key={b.label}
              onPress={() => setBudget(b.value)}
              className={`py-2 px-3.5 rounded-xl border ${budget === b.value ? 'bg-cyan-600 border-cyan-400' : 'bg-white/5 border-white/10'}`}
            >
              <Text className={budget === b.value ? 'text-white font-bold text-sm' : 'text-gray-300 text-sm'}>
                {b.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood Selector */}
        <Text className="text-white font-bold mb-3">
          🎭 How are you feeling? <Text className="text-cyan-400 font-normal">({mood})</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {MOODS.map(m => (
            <TouchableOpacity 
              key={m.label}
              onPress={() => setMood(m.label)}
              className={`flex-row items-center py-2.5 px-4 rounded-full mr-2 border ${
                mood === m.label 
                  ? 'bg-cyan-600/30 border-cyan-400 shadow-sm shadow-cyan-500/20' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className="text-xl mr-2">{m.emoji}</Text>
              <Text className={mood === m.label ? 'text-cyan-200 font-bold' : 'text-gray-300'}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        onPress={() => setShowResults(true)}
        className="bg-cyan-600 py-4 rounded-xl items-center shadow-lg shadow-cyan-500/30 mb-8 active:opacity-90"
      >
        <Text className="text-white font-bold text-lg">Suggest Something ({mood} • {time} • {budget === 0 ? 'Free' : `₹${budget}`})</Text>
      </TouchableOpacity>

      {/* Dynamic Results */}
      {showResults && (
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-white">Top Suggestions for You</Text>
            <Text className="text-xs text-cyan-400 bg-cyan-900/30 px-2.5 py-1 rounded-full border border-cyan-500/30">
              Matched for {mood}
            </Text>
          </View>

          {suggestions.map((item, idx) => {
            const isDone = !!completedActions[item.title];
            return (
              <View 
                key={idx} 
                className={`rounded-2xl p-5 mb-4 border transition-all ${
                  isDone 
                    ? 'bg-white/5 border-green-500/30 opacity-70' 
                    : idx === 0 
                      ? 'bg-cyan-950/40 border-cyan-500/40' 
                      : 'bg-white/5 border-white/10'
                }`}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className={`text-lg font-bold flex-1 ${isDone ? 'text-green-300 line-through' : 'text-white'}`}>
                    {item.title}
                  </Text>
                  {item.badge && !isDone && (
                    <View className="bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-1 rounded-full ml-2">
                      <Text className="text-cyan-300 text-xs font-semibold">{item.badge}</Text>
                    </View>
                  )}
                  {isDone && (
                    <View className="bg-green-500/20 border border-green-500/40 px-2.5 py-1 rounded-full ml-2">
                      <Text className="text-green-300 text-xs font-semibold">Done ✓</Text>
                    </View>
                  )}
                </View>

                <Text className="text-gray-300 mb-4 leading-5">{item.description}</Text>

                <View className="flex-row justify-between items-center pt-2 border-t border-white/10">
                  <View className="flex-row gap-4">
                    <Text className="text-gray-400 text-sm font-medium">{item.time}</Text>
                    <Text className="text-cyan-400 text-sm font-semibold">{item.cost}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleToggleAction(item.title)}
                    className={`px-4 py-2 rounded-xl ${isDone ? 'bg-white/10' : 'bg-cyan-600'}`}
                  >
                    <Text className="text-white font-bold text-xs">
                      {isDone ? 'Undo' : item.actionText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
