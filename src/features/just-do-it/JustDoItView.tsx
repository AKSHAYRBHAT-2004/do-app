import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const QUICK_COMMANDS = [
  'Plan Tomorrow',
  'Deep Clean Room',
  'Prepare Presentation',
  'Gym Workout Prep',
  'Grocery Run'
];

interface TaskItem {
  id: number;
  text: string;
  time: string;
  done: boolean;
}

export default function JustDoItView() {
  const [command, setCommand] = useState('Plan Tomorrow');
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, text: 'Review calendar commitments & meeting links', time: '5 min', done: false },
    { id: 2, text: 'Identify top 2 non-negotiable MITs (Most Important Tasks)', time: '5 min', done: false },
    { id: 3, text: 'Draft reply to 2 critical client messages', time: '10 min', done: false },
    { id: 4, text: 'Lay out clothes & gym essentials by the door', time: '5 min', done: false },
    { id: 5, text: 'Set alarms and activate phone Sleep Focus', time: '2 min', done: false },
  ]);
  const [customTaskInput, setCustomTaskInput] = useState('');

  const generateTasksForCommand = (cmd: string) => {
    setCommand(cmd);
    const lower = cmd.toLowerCase();

    if (lower.includes('clean') || lower.includes('room')) {
      setTasks([
        { id: Date.now() + 1, text: 'Pick up all clothes & place in laundry bin', time: '5 min', done: false },
        { id: Date.now() + 2, text: 'Make bed and fluff pillows', time: '3 min', done: false },
        { id: Date.now() + 3, text: 'Clear cups, plates, and trash off desk', time: '5 min', done: false },
        { id: Date.now() + 4, text: 'Wipe down main desk & table surfaces', time: '5 min', done: false },
        { id: Date.now() + 5, text: 'Open windows for 10 minutes of fresh cross-breeze', time: '2 min', done: false },
      ]);
    } else if (lower.includes('presentation') || lower.includes('slide') || lower.includes('work')) {
      setTasks([
        { id: Date.now() + 1, text: 'Outline the core 3 takeaway bullet points', time: '10 min', done: false },
        { id: Date.now() + 2, text: 'Format title slides and verify data charts', time: '15 min', done: false },
        { id: Date.now() + 3, text: 'Do 1 dry-run speaking aloud with timer', time: '12 min', done: false },
        { id: Date.now() + 4, text: 'Prepare backup PDF export & test screen share', time: '5 min', done: false },
      ]);
    } else if (lower.includes('gym') || lower.includes('workout')) {
      setTasks([
        { id: Date.now() + 1, text: 'Fill 750ml water bottle and pack electrolyte powder', time: '2 min', done: false },
        { id: Date.now() + 2, text: 'Pack shoes, lifting straps, and fresh towel in gym bag', time: '4 min', done: false },
        { id: Date.now() + 3, text: 'Queue up high-energy workout playlist on headphones', time: '2 min', done: false },
        { id: Date.now() + 4, text: 'Drink quick pre-workout or espresso shot', time: '3 min', done: false },
      ]);
    } else if (lower.includes('grocery') || lower.includes('shop')) {
      setTasks([
        { id: Date.now() + 1, text: 'Check fridge & pantry for depleted staple foods', time: '4 min', done: false },
        { id: Date.now() + 2, text: 'Categorize list: Produce, Dairy, Protein, Snacks', time: '3 min', done: false },
        { id: Date.now() + 3, text: 'Grab 2 reusable shopping tote bags by door', time: '1 min', done: false },
        { id: Date.now() + 4, text: 'Review supermarket weekly discount flyers', time: '3 min', done: false },
      ]);
    } else {
      setTasks([
        { id: Date.now() + 1, text: `Deconstruct "${cmd}" into first immediate 2-minute step`, time: '3 min', done: false },
        { id: Date.now() + 2, text: 'Gather required tools, documents, and credentials', time: '5 min', done: false },
        { id: Date.now() + 3, text: 'Execute uninterrupted 25-minute focus sprint', time: '25 min', done: false },
        { id: Date.now() + 4, text: 'Review progress and log completion status', time: '2 min', done: false },
      ]);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddStep = () => {
    if (customTaskInput.trim()) {
      setTasks(prev => [
        ...prev,
        { id: Date.now(), text: customTaskInput.trim(), time: '5 min', done: false }
      ]);
      setCustomTaskInput('');
    }
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? completedCount / tasks.length : 0;

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">Just Do It ⚡</Text>
        <Text className="text-gray-400">Tell us what you want done. We generate the actionable plan.</Text>
      </View>

      {/* Command Input Box */}
      <View className="mb-6">
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl p-2 mb-3">
          <TextInput
            className="flex-1 text-white p-3 text-base"
            placeholder="What do you need done right now?..."
            placeholderTextColor="#9CA3AF"
            value={command}
            onChangeText={setCommand}
            onSubmitEditing={() => generateTasksForCommand(command)}
          />
          <TouchableOpacity 
            onPress={() => generateTasksForCommand(command)}
            className="bg-yellow-500 px-4 py-2.5 rounded-xl shadow-md shadow-yellow-500/20"
          >
            <Text className="text-black font-bold text-sm">Plan</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick presets */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {QUICK_COMMANDS.map(quick => (
            <TouchableOpacity 
              key={quick}
              onPress={() => generateTasksForCommand(quick)}
              className={`border px-3.5 py-2 rounded-full mr-2.5 ${
                command === quick 
                  ? 'bg-yellow-500/20 border-yellow-500' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={command === quick ? 'text-yellow-300 font-bold text-xs' : 'text-gray-300 text-xs'}>
                {quick}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Active Task Plan Card */}
      <View className="mb-10">
        <View className="bg-yellow-950/30 border border-yellow-500/30 rounded-3xl p-5 mb-6 shadow-lg shadow-yellow-500/10">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-white flex-1 mr-2">{command}</Text>
            <View className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/40">
              <Text className="text-yellow-300 font-bold text-sm">{Math.round(progress * 100)}% Done</Text>
            </View>
          </View>
          
          {/* Progress bar */}
          <View className="h-2.5 bg-black/60 rounded-full mb-6 overflow-hidden p-0.5">
            <View 
              className="h-full bg-yellow-500 rounded-full transition-all" 
              style={{ width: `${progress * 100}%` }} 
            />
          </View>

          {/* Steps */}
          <View className="gap-2.5 mb-4">
            {tasks.map((task, idx) => (
              <TouchableOpacity 
                key={task.id}
                onPress={() => toggleTask(task.id)}
                className={`flex-row items-center p-3.5 rounded-2xl border ${
                  task.done 
                    ? 'bg-white/5 border-white/5 opacity-50' 
                    : 'bg-white/10 border-white/10'
                }`}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                  task.done ? 'border-yellow-500 bg-yellow-500' : 'border-gray-500'
                }`}>
                  {task.done && <Text className="text-black text-xs font-black">✓</Text>}
                </View>
                <Text className={`flex-1 text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {idx + 1}. {task.text}
                </Text>
                <Text className="text-yellow-300 text-xs font-semibold ml-2">{task.time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add custom step */}
          <View className="flex-row items-center gap-2 pt-3 border-t border-white/10">
            <TextInput
              className="flex-1 bg-black/40 text-white px-3.5 py-2 rounded-xl border border-white/10 text-xs"
              placeholder="Add another step to this plan..."
              placeholderTextColor="#6B7280"
              value={customTaskInput}
              onChangeText={setCustomTaskInput}
              onSubmitEditing={handleAddStep}
            />
            <TouchableOpacity 
              onPress={handleAddStep}
              className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
            >
              <Text className="text-yellow-300 font-bold text-xs">+ Step</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {progress === 1 && (
          <View className="bg-green-900/30 border border-green-500/30 p-5 rounded-2xl items-center">
            <Text className="text-3xl mb-2">🎉</Text>
            <Text className="text-green-400 font-bold text-lg mb-1">Execution Complete!</Text>
            <Text className="text-green-200/80 text-xs text-center">Every single step for &quot;{command}&quot; has been executed.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
