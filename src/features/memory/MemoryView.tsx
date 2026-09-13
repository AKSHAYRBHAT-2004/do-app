import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

interface MemoryItem {
  id: string;
  category: 'Preferences' | 'Routines' | 'Important Dates' | 'Food' | 'Work';
  content: string;
  dateAdded: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'm1',
    category: 'Preferences',
    content: 'Allergic to peanuts and prefers vegetarian or Mediterranean food for weekday lunches.',
    dateAdded: 'Added 2 days ago',
    borderColor: 'bg-purple-500',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
  },
  {
    id: 'm2',
    category: 'Routines',
    content: 'Usually wakes up at 6:45 AM and hits the gym on Mon, Wed, Fri for 45 minutes.',
    dateAdded: 'Added 1 week ago',
    borderColor: 'bg-blue-500',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
  },
  {
    id: 'm3',
    category: 'Important Dates',
    content: "Mom's birthday is on November 14th. Buy flowers & handwritten card 3 days prior.",
    dateAdded: 'Auto-extracted from email',
    borderColor: 'bg-pink-500',
    badgeBg: 'bg-pink-500/20',
    badgeText: 'text-pink-300',
  },
  {
    id: 'm4',
    category: 'Food',
    content: 'Prefers oat milk over whole milk in espresso drinks; enjoys spicy Sichuan & South Indian food.',
    dateAdded: 'Added 3 weeks ago',
    borderColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
  },
  {
    id: 'm5',
    category: 'Work',
    content: 'Prefers asynchronous Slack/WhatsApp messages before noon. Deep focus time between 10 AM - 1 PM.',
    dateAdded: 'Added 1 month ago',
    borderColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
  },
];

const CATEGORIES = ['All', 'Preferences', 'Routines', 'Important Dates', 'Food', 'Work'] as const;

export default function MemoryView() {
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Add memory state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCat, setNewCat] = useState<MemoryItem['category']>('Preferences');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = (id: string) => {
    const item = memories.find(m => m.id === id);
    setMemories(prev => prev.filter(m => m.id !== id));
    showToast(`🗑️ Forgotten: "${item?.content.slice(0, 30)}..."`);
  };

  const handleAddMemory = () => {
    if (!newContent.trim()) return;

    const colorConfig: Record<MemoryItem['category'], { border: string; bg: string; text: string }> = {
      Preferences: { border: 'bg-purple-500', bg: 'bg-purple-500/20', text: 'text-purple-300' },
      Routines: { border: 'bg-blue-500', bg: 'bg-blue-500/20', text: 'text-blue-300' },
      'Important Dates': { border: 'bg-pink-500', bg: 'bg-pink-500/20', text: 'text-pink-300' },
      Food: { border: 'bg-amber-500', bg: 'bg-amber-500/20', text: 'text-amber-300' },
      Work: { border: 'bg-emerald-500', bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
    };

    const cfg = colorConfig[newCat];
    const newItem: MemoryItem = {
      id: Date.now().toString(),
      category: newCat,
      content: newContent.trim(),
      dateAdded: 'Just now',
      borderColor: cfg.border,
      badgeBg: cfg.bg,
      badgeText: cfg.text,
    };

    setMemories([newItem, ...memories]);
    setNewContent('');
    setShowAddForm(false);
    showToast('🧠 Saved new memory to AI context!');
  };

  const handleClearAll = () => {
    setMemories([]);
    showToast('Cleared all memories from AI knowledge graph');
  };

  const handleExport = () => {
    showToast('📥 Memory backup downloaded (JSON format)');
  };

  // Filter logic
  const filteredMemories = memories.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      {/* Header */}
      <View className="mb-6 mt-2 flex-row justify-between items-start">
        <View>
          <Text className="text-3xl font-bold text-white mb-1">My Memory 🧠</Text>
          <Text className="text-gray-400">Everything the AI knows & references for you</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 px-3.5 py-2 rounded-xl border border-purple-400/40"
        >
          <Text className="text-white font-bold text-xs">+ Remember</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Alert */}
      {toastMessage && (
        <View className="bg-purple-500/20 border border-purple-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-purple-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* Search Input */}
      <View className="relative mb-4">
        <TextInput
          className="bg-white/10 text-white p-3.5 rounded-xl border border-white/10 text-sm font-medium pr-10"
          placeholder="Search personal memory (e.g., birthday, allergic, routine)..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            className="absolute right-3 top-3.5 bg-white/20 w-6 h-6 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xs font-bold">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Memory Form */}
      {showAddForm && (
        <View className="bg-white/10 rounded-2xl p-4 border border-purple-500/40 mb-6">
          <Text className="text-white font-bold text-base mb-2">Teach AI Something New</Text>
          <TextInput
            className="bg-black/40 text-white p-3 rounded-xl mb-3 border border-white/10 text-sm h-20"
            placeholder="Tell DO about your preferences, routines, constraints, or favorite places..."
            placeholderTextColor="#6B7280"
            multiline
            textAlignVertical="top"
            value={newContent}
            onChangeText={setNewContent}
          />

          <Text className="text-gray-400 text-xs font-semibold mb-2">Category:</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {(['Preferences', 'Routines', 'Important Dates', 'Food', 'Work'] as MemoryItem['category'][]).map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setNewCat(cat)}
                className={`px-3 py-1.5 rounded-lg border ${
                  newCat === cat ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-bold ${newCat === cat ? 'text-white' : 'text-gray-400'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowAddForm(false)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 items-center"
            >
              <Text className="text-gray-400 font-semibold text-xs">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddMemory}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 items-center"
            >
              <Text className="text-white font-bold text-xs">Store Memory</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Category Pills Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
        {CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full mr-2 border ${
                isSelected ? 'bg-purple-600 border-purple-500' : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Memories List */}
      <View className="gap-3 mb-8">
        {filteredMemories.length === 0 ? (
          <View className="bg-white/5 rounded-2xl p-8 items-center justify-center border border-white/5">
            <Text className="text-3xl mb-2">🔍</Text>
            <Text className="text-white font-bold text-sm">No memories found</Text>
            <Text className="text-gray-500 text-xs mt-1">Try a different search or filter category</Text>
          </View>
        ) : (
          filteredMemories.map(item => (
            <View
              key={item.id}
              className="bg-white/5 p-4 rounded-2xl border border-white/10 relative overflow-hidden"
            >
              <View className={`absolute top-0 left-0 w-1.5 h-full ${item.borderColor}`} />
              <View className="flex-row justify-between items-center mb-2">
                <View className={`${item.badgeBg} px-2.5 py-0.5 rounded-md`}>
                  <Text className={`${item.badgeText} text-[10px] font-bold uppercase tracking-wider`}>
                    {item.category}
                  </Text>
                </View>
                <Text className="text-gray-500 text-[11px]">{item.dateAdded}</Text>
              </View>

              <Text className="text-white text-sm font-medium leading-5 mb-3">
                {item.content}
              </Text>

              <View className="flex-row justify-end items-center gap-4 pt-2 border-t border-white/5">
                <TouchableOpacity onPress={() => showToast('Memory will be reinforced in upcoming prompts')}>
                  <Text className="text-gray-400 text-xs font-medium">Pin 📌</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text className="text-red-400 text-xs font-bold">Forget 🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Footer Utilities */}
      <View className="flex-row justify-center gap-6 mb-12 pb-6 border-t border-white/10 pt-4">
        <TouchableOpacity onPress={handleExport}>
          <Text className="text-gray-400 text-xs font-semibold">📤 Export All Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearAll}>
          <Text className="text-red-400 text-xs font-semibold">⚠️ Clear All Memory</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
