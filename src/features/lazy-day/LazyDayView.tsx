import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const INITIAL_TASKS = [
  { id: 1, text: 'Pay electricity / internet bill', time: '2 min', done: false },
  { id: 2, text: 'Reply to mom\'s / friend\'s message', time: '1 min', done: false },
  { id: 3, text: 'Drink 2 full glasses of fresh water', time: '30 sec', done: false },
  { id: 4, text: 'Take 5 deep belly breaths at window', time: '1 min', done: false },
  { id: 5, text: 'Toss junk mail & empty coffee mugs', time: '3 min', done: false },
];

export default function LazyDayView() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTaskInput, setNewTaskInput] = useState('');
  
  const completedCount = tasks.filter(t => t.done).length;
  
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      setTasks(prev => [
        ...prev,
        { id: Date.now(), text: newTaskInput.trim(), time: '2 min', done: false }
      ]);
      setNewTaskInput('');
    }
  };

  const handleMoreWins = () => {
    const extra = [
      { id: Date.now() + 1, text: 'Step outside for 3 minutes of fresh air', time: '3 min', done: false },
      { id: Date.now() + 2, text: 'Delete 10 useless screenshots from photo roll', time: '2 min', done: false },
      { id: Date.now() + 3, text: 'Stretch calves and hamstrings while waiting for tea', time: '2 min', done: false },
    ];
    setTasks(prev => [...prev, ...extra]);
  };

  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6 mt-2 items-center">
        <Text className="text-4xl mb-2">😴</Text>
        <Text className="text-3xl font-bold text-white mb-2">Lazy Day Mode</Text>
        <Text className="text-indigo-300 text-center text-sm leading-5">
          "I'll handle the hard part. You just knock out the easy wins."
        </Text>
      </View>

      {/* Progress Bar Card */}
      <View className="bg-indigo-950/40 border border-indigo-500/30 p-5 rounded-3xl mb-6 items-center shadow-lg shadow-indigo-500/10">
        <Text className="text-indigo-200 text-lg font-bold">
          {completedCount} of {tasks.length} small wins knocked out
        </Text>
        <Text className="text-indigo-400 text-xs mt-1">
          {completedCount === tasks.length ? '🎉 All wins complete! Maximum chill mode unlocked.' : 'Zero guilt. Low pressure progress.'}
        </Text>
        <View className="w-full h-3 bg-black/60 rounded-full mt-4 overflow-hidden p-0.5">
          <View 
            className="h-full bg-indigo-500 rounded-full transition-all" 
            style={{ width: `${progressPercent}%` }} 
          />
        </View>
      </View>

      {/* Add Custom Win */}
      <View className="flex-row gap-2 mb-6">
        <TextInput
          className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-white text-sm"
          placeholder="Add a tiny 1-minute win..."
          placeholderTextColor="#6B7280"
          value={newTaskInput}
          onChangeText={setNewTaskInput}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity 
          onPress={handleAddTask}
          className="bg-indigo-600 px-5 rounded-2xl items-center justify-center shadow-sm shadow-indigo-500/30"
        >
          <Text className="text-white font-bold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Active Tasks List */}
      <View className="mb-6 gap-3">
        {tasks.filter(t => !t.done).map(task => (
          <TouchableOpacity 
            key={task.id} 
            onPress={() => toggleTask(task.id)}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row justify-between items-center active:bg-white/10"
          >
            <View className="flex-1 mr-4">
              <Text className="text-white text-base font-medium mb-1">{task.text}</Text>
              <Text className="text-indigo-300 text-xs">⏱ {task.time}</Text>
            </View>
            <View className="bg-indigo-600/80 px-4 py-2 rounded-xl">
              <Text className="text-white font-bold text-xs">Done ✓</Text>
            </View>
          </TouchableOpacity>
        ))}

        {tasks.filter(t => !t.done).length === 0 && (
          <View className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl items-center my-2">
            <Text className="text-3xl mb-2">🌴</Text>
            <Text className="text-white font-bold text-lg mb-1">You're All Caught Up</Text>
            <Text className="text-gray-400 text-xs text-center">Every single small win has been completed. Enjoy your rest.</Text>
          </View>
        )}
      </View>

      {/* Generate More Button */}
      <TouchableOpacity 
        onPress={handleMoreWins}
        className="bg-white/5 border border-white/10 py-3.5 rounded-2xl items-center mb-6"
      >
        <Text className="text-indigo-300 font-semibold text-sm">✨ Generate 3 More Micro Wins</Text>
      </TouchableOpacity>
      
      {/* Completed Section */}
      {completedCount > 0 && (
        <View className="mb-10">
          <Text className="text-gray-500 font-bold mb-3 ml-2 text-xs uppercase tracking-widest">Completed Today ({completedCount})</Text>
          {tasks.filter(t => t.done).map(task => (
            <TouchableOpacity 
              key={task.id} 
              onPress={() => toggleTask(task.id)}
              className="bg-white/5 opacity-50 rounded-2xl p-3.5 flex-row items-center mb-2 border border-white/5"
            >
              <Text className="text-green-400 font-bold mr-3 text-base">✓</Text>
              <Text className="text-gray-400 line-through text-sm flex-1">{task.text}</Text>
              <Text className="text-gray-600 text-xs">Undo</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
