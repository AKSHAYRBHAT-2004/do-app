import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const DURATIONS = [5, 10, 20, 30, 60];

interface TaskOption {
  icon: string;
  title: string;
  description: string;
}

export default function FiveMinuteLifeView() {
  const [duration, setDuration] = useState(5);
  const [activeTask, setActiveTask] = useState<TaskOption | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const getTasksForDuration = (mins: number): TaskOption[] => {
    switch (mins) {
      case 10:
        return [
          { icon: '💪', title: '10-Minute Desk Mobility', description: 'Hip openers, thoracic rotations, and neck relief stretches.' },
          { icon: '📱', title: 'Reply to 3 Pending Messages', description: 'Clear communications backlog without getting sucked into scrolling.' },
          { icon: '☕', title: 'Mindful Pour-over Coffee / Tea', description: 'Zero screen distraction. Just aroma, patience, and warmth.' },
        ];
      case 20:
        return [
          { icon: '🏃', title: 'Brisk 20-Min Cardio Walk', description: 'Outdoor natural light exposure and brisk pace to clear brain fog.' },
          { icon: '📖', title: 'Read 1 Chapter of Non-fiction', description: 'High-leverage knowledge absorption without digital interruptions.' },
          { icon: '🎒', title: 'Prepare & Pack for Tomorrow', description: 'Lay out workout clothes, keys, water bottle, and chargers.' },
        ];
      case 30:
        return [
          { icon: '🍳', title: 'Fresh Nutritious Meal Prep', description: 'Wholesome skillet cooking, high protein, fresh greens.' },
          { icon: '🧘', title: 'Full Body Yoga / Foam Roll', description: 'Relieve fascia tension and reset posture after sitting.' },
          { icon: '📑', title: 'Inbox Zero & Weekly Triage', description: 'Sort starred emails, file invoices, schedule calendar events.' },
        ];
      case 60:
        return [
          { icon: '🎯', title: 'Single-Task Deep Work Sprint', description: 'Airplane mode. Zero interruptions. Complete the hardest task of the day.' },
          { icon: '🏋️', title: 'Full Strength & Conditioning Workout', description: 'Compound lifts or bodyweight progression workout.' },
          { icon: '📊', title: 'Life Review & Financial Balancing', description: 'Audit monthly spending, balance investments, write down wins.' },
        ];
      default: // 5 mins
        return [
          { icon: '✉️', title: 'Quick Inbox Purge', description: 'Archive newsletter clutter, reply to 1 urgent message.' },
          { icon: '🧘', title: 'Physiological Sigh Reset', description: '5 deep breaths with double inhale and slow exhale.' },
          { icon: '🧹', title: 'Clear Physical Desk', description: 'Put away coffee mug, organize cables, wipe laptop screen.' },
          { icon: '💧', title: 'Drink 500ml Chilled Water', description: 'Immediate hydration boost for cognitive speed.' },
        ];
    }
  };

  const tasks = getTasksForDuration(duration);

  // Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, secondsLeft]);

  const handleStartTask = (task: TaskOption) => {
    setActiveTask(task);
    setSecondsLeft(duration * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6 mt-2">
        <Text className="text-3xl font-bold text-white mb-2">5-Minute Life ⏱️</Text>
        <Text className="text-gray-400">Micro-action engine: pick your exact available window</Text>
      </View>

      {!activeTask ? (
        <>
          <Text className="text-xl text-white font-bold mb-3">How much time do you have?</Text>
          
          <View className="flex-row flex-wrap gap-2.5 mb-8">
            {DURATIONS.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => setDuration(d)}
                className={`flex-1 min-w-[55px] py-3.5 rounded-2xl items-center border ${
                  duration === d 
                    ? 'bg-rose-600 border-rose-400 shadow-md shadow-rose-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={duration === d ? 'text-white font-bold text-base' : 'text-gray-300 text-base'}>
                  {d}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg text-white font-bold">Recommended for {duration} mins:</Text>
            <Text className="text-xs text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-500/30">
              {tasks.length} High-Impact Wins
            </Text>
          </View>
          
          <View className="gap-3.5 mb-10">
            {tasks.map((task, idx) => (
              <View key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-row items-center justify-between">
                <Text className="text-3xl mr-3.5">{task.icon}</Text>
                <View className="flex-1 mr-3">
                  <Text className="text-white font-bold text-base mb-1">{task.title}</Text>
                  <Text className="text-gray-400 text-xs leading-4">{task.description}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleStartTask(task)} 
                  className="bg-rose-600 px-4 py-2 rounded-xl shadow-sm shadow-rose-500/30"
                >
                  <Text className="text-white font-bold text-xs">Start {duration}m</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View className="items-center py-8">
          <View className="w-64 h-64 rounded-full border-8 border-rose-500/20 items-center justify-center mb-6 relative bg-white/5">
            <Text className="text-5xl font-bold text-white font-mono tracking-wider">
              {formatTime(secondsLeft)}
            </Text>
            <Text className="text-rose-400 text-sm mt-2 font-semibold">
              {isTimerRunning ? '⚡ In Progress' : '⏸ Paused'}
            </Text>
          </View>
          
          <Text className="text-2xl text-white font-bold mb-1.5 text-center">{activeTask.title}</Text>
          <Text className="text-gray-400 text-center mb-8 px-6 text-sm leading-5">{activeTask.description}</Text>
          
          {/* Controls */}
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => setIsTimerRunning(!isTimerRunning)} 
              className={`px-6 py-3.5 rounded-xl border ${isTimerRunning ? 'bg-white/10 border-white/20' : 'bg-rose-600 border-rose-500'}`}
            >
              <Text className="text-white font-bold text-sm">
                {isTimerRunning ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setIsTimerRunning(false);
                setActiveTask(null);
              }} 
              className="bg-green-600 px-8 py-3.5 rounded-xl shadow-lg shadow-green-500/20"
            >
              <Text className="text-white font-bold text-sm">Complete ✓</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setIsTimerRunning(false);
                setActiveTask(null);
              }} 
              className="bg-white/5 px-5 py-3.5 rounded-xl border border-white/10"
            >
              <Text className="text-gray-400 font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
