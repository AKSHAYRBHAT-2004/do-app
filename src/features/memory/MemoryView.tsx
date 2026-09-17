import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useUserDataStore, MemoryEntry } from '@/stores/userDataStore';

const CATEGORIES = ['All', 'Preferences', 'Routines', 'Important Dates', 'Food', 'Work'] as const;

const CATEGORY_COLORS: Record<MemoryEntry['category'], { border: string; bg: string; text: string }> = {
  Preferences: { border: 'bg-purple-500', bg: 'bg-purple-500/20', text: 'text-purple-300' },
  Routines: { border: 'bg-blue-500', bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'Important Dates': { border: 'bg-pink-500', bg: 'bg-pink-500/20', text: 'text-pink-300' },
  Food: { border: 'bg-amber-500', bg: 'bg-amber-500/20', text: 'text-amber-300' },
  Work: { border: 'bg-emerald-500', bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
};

export default function MemoryView() {
  // ── Persisted store (data survives refresh) ──
  const { memories, addMemory, deleteMemory } = useUserDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCat, setNewCat] = useState<MemoryEntry['category']>('Preferences');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = (id: string) => {
    const item = memories.find(m => m.id === id);
    deleteMemory(id);
    showToast(`🗑️ Forgotten: "${item?.content.slice(0, 30)}..."`);
  };

  const handleAddMemory = () => {
    if (!newContent.trim()) return;
    addMemory({ category: newCat, content: newContent.trim() });
    setNewContent('');
    setShowAddForm(false);
    showToast('🧠 Memory saved — DO will now reference this!');
  };

  const handleClearAll = () => {
    memories.forEach(m => deleteMemory(m.id));
    showToast('Cleared all memories from AI knowledge graph');
  };

  const handleExport = () => {
    const json = JSON.stringify(memories, null, 2);
    if (typeof window !== 'undefined') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'do-memories-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast('📥 Memory backup downloaded');
  };

  const filteredMemories = memories.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
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
          <Text className="text-gray-400">Everything DO knows & references for you</Text>
          <Text className="text-gray-600 text-xs mt-0.5">{memories.length} memories saved • Persisted</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 px-3.5 py-2 rounded-xl border border-purple-400/40"
          activeOpacity={0.8}
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
          placeholder="Search memories (e.g., birthday, allergic, routine)..."
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
            className="bg-black/40 text-white p-3 rounded-xl mb-3 border border-white/10 text-sm"
            placeholder="Tell DO about your preferences, routines, or important facts..."
            placeholderTextColor="#6B7280"
            multiline
            textAlignVertical="top"
            style={{ minHeight: 80 }}
            value={newContent}
            onChangeText={setNewContent}
          />

          <Text className="text-gray-400 text-xs font-semibold mb-2">Category:</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {(['Preferences', 'Routines', 'Important Dates', 'Food', 'Work'] as MemoryEntry['category'][]).map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setNewCat(cat)}
                className={`px-3 py-1.5 rounded-lg border ${
                  newCat === cat ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10'
                }`}
                activeOpacity={0.8}
              >
                <Text className={`text-xs font-bold ${newCat === cat ? 'text-white' : 'text-gray-400'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => { setShowAddForm(false); setNewContent(''); }}
              className="flex-1 py-2.5 rounded-xl bg-white/10 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-gray-400 font-semibold text-xs">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddMemory}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-xs">Store Memory ✓</Text>
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
              activeOpacity={0.8}
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
            <Text className="text-white font-bold text-sm">
              {memories.length === 0 ? 'No memories yet' : 'No memories match your search'}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              {memories.length === 0
                ? 'Tap "+ Remember" to teach DO about yourself'
                : 'Try a different search or filter'}
            </Text>
          </View>
        ) : (
          filteredMemories.map(item => {
            const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Preferences;
            return (
              <View
                key={item.id}
                className="bg-white/5 p-4 rounded-2xl border border-white/10 relative overflow-hidden"
              >
                <View className={`absolute top-0 left-0 w-1.5 h-full ${colors.border}`} />
                <View className="flex-row justify-between items-center mb-2">
                  <View className={`${colors.bg} px-2.5 py-0.5 rounded-md`}>
                    <Text className={`${colors.text} text-[10px] font-bold uppercase tracking-wider`}>
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
            );
          })
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
