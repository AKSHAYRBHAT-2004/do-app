import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  priority: 'DO_NOW' | 'DO_TODAY' | 'AI_HANDLED' | 'CAN_WAIT';
  actionLabel?: string;
  actionDone?: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Credit Card Bill Due Today',
    subtitle: '₹12,450 • HDFC Regalia • Avoid late fee before 11:59 PM',
    priority: 'DO_NOW',
    actionLabel: 'Pay Now',
    actionDone: false,
  },
  {
    id: 'n2',
    title: 'Emergency Medicine Refill',
    subtitle: 'Asthma inhaler low on doses • Order via Apollo',
    priority: 'DO_NOW',
    actionLabel: 'Order',
    actionDone: false,
  },
  {
    id: 'n3',
    title: 'Reply to Engineering Manager',
    subtitle: 'Subject: Q3 Roadmap & Capacity estimates',
    priority: 'DO_TODAY',
    actionLabel: 'Draft Email',
    actionDone: false,
  },
  {
    id: 'n4',
    title: 'Flight Fare Alert: Delhi → Goa',
    subtitle: 'Prices jumped by ₹1,200. Best deal at ₹4,150 today',
    priority: 'DO_TODAY',
    actionLabel: 'View Deal',
    actionDone: false,
  },
  {
    id: 'n5',
    title: 'Categorized 15 new bank expenses',
    subtitle: 'Saved into Money Assistant with tags',
    priority: 'AI_HANDLED',
    actionDone: true,
  },
  {
    id: 'n6',
    title: 'Auto-accepted calendar invite: Design Sync',
    subtitle: 'No conflict detected with your focus slot',
    priority: 'AI_HANDLED',
    actionDone: true,
  },
  {
    id: 'n7',
    title: 'The Ken Weekly Tech Deep Dive',
    subtitle: 'New issue: AI Chip wars in 2026',
    priority: 'CAN_WAIT',
    actionLabel: 'Read Later',
    actionDone: false,
  },
];

export default function NotificationBrain() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAction = (id: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, actionDone: true };
        }
        return item;
      })
    );
    const target = items.find(i => i.id === id);
    if (target?.priority === 'DO_NOW') {
      showToast(`✓ Resolved: ${target.title}`);
    } else if (target?.actionLabel === 'Draft Email') {
      showToast('✍️ AI drafted response and sent to Gmail drafts');
    } else {
      showToast(`⚡ Action completed for: ${target?.title}`);
    }
  };

  const handleDismiss = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    showToast('All notifications cleared from brain');
  };

  const doNow = items.filter(i => i.priority === 'DO_NOW');
  const doToday = items.filter(i => i.priority === 'DO_TODAY');
  const aiHandled = items.filter(i => i.priority === 'AI_HANDLED');
  const canWait = items.filter(i => i.priority === 'CAN_WAIT');

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      {/* Header */}
      <View className="mb-6 mt-2 flex-row justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-white mb-1">Notification Brain ⚡</Text>
          <Text className="text-gray-400">AI-triaged priority hierarchy</Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} className="bg-white/10 px-3 py-1.5 rounded-lg">
            <Text className="text-gray-300 text-xs font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Toast */}
      {toastMessage && (
        <View className="bg-purple-500/20 border border-purple-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-purple-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {items.length === 0 ? (
        <View className="bg-white/5 rounded-3xl p-10 items-center justify-center my-8 border border-white/5">
          <Text className="text-4xl mb-3">🧘</Text>
          <Text className="text-white font-bold text-lg">Brain is clear</Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Zero pending alerts or urgent interruptions. Enjoy your peace of mind.
          </Text>
        </View>
      ) : (
        <>
          {/* DO NOW */}
          {doNow.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-lg shadow-red-500" />
                <Text className="text-red-400 font-bold tracking-widest text-xs uppercase">
                  DO NOW ({doNow.filter(i => !i.actionDone).length} urgent)
                </Text>
              </View>
              {doNow.map(item => (
                <View
                  key={item.id}
                  className={`rounded-2xl border p-4 mb-3 ${
                    item.actionDone
                      ? 'bg-white/5 border-white/5 opacity-50'
                      : 'bg-red-950/20 border-red-500/40'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-3">
                      <Text
                        className={`font-bold text-sm ${
                          item.actionDone ? 'text-gray-400 line-through' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-gray-400 text-xs mt-1">{item.subtitle}</Text>
                    </View>
                    <View className="flex-row gap-2">
                      {!item.actionDone ? (
                        <TouchableOpacity
                          onPress={() => handleAction(item.id)}
                          className="bg-red-600 px-3 py-1.5 rounded-xl"
                        >
                          <Text className="text-white font-bold text-xs">{item.actionLabel || 'Fix'}</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => handleDismiss(item.id)}>
                          <Text className="text-gray-500 text-xs">✕ Dismiss</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* DO TODAY */}
          {doToday.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2" />
                <Text className="text-yellow-400 font-bold tracking-widest text-xs uppercase">
                  DO TODAY ({doToday.filter(i => !i.actionDone).length} pending)
                </Text>
              </View>
              {doToday.map(item => (
                <View
                  key={item.id}
                  className={`rounded-2xl border p-4 mb-3 ${
                    item.actionDone
                      ? 'bg-white/5 border-white/5 opacity-50'
                      : 'bg-yellow-950/20 border-yellow-500/30'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-3">
                      <Text
                        className={`font-bold text-sm ${
                          item.actionDone ? 'text-gray-400 line-through' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-gray-400 text-xs mt-1">{item.subtitle}</Text>
                    </View>
                    {!item.actionDone ? (
                      <TouchableOpacity
                        onPress={() => handleAction(item.id)}
                        className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
                      >
                        <Text className="text-yellow-300 font-bold text-xs">{item.actionLabel}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => handleDismiss(item.id)}>
                        <Text className="text-gray-500 text-xs">✕ Dismiss</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* AI HANDLED */}
          {aiHandled.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-sm mr-2">🤖</Text>
                <Text className="text-purple-400 font-bold tracking-widest text-xs uppercase">
                  AI HANDLED (Autonomous)
                </Text>
              </View>
              {aiHandled.map(item => (
                <View
                  key={item.id}
                  className="bg-purple-950/10 rounded-2xl border border-purple-500/20 p-4 mb-2 flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-purple-200 font-semibold text-xs">{item.title}</Text>
                    <Text className="text-purple-300/60 text-[11px] mt-0.5">{item.subtitle}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDismiss(item.id)}>
                    <Text className="text-purple-400 text-xs">Clear</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* CAN WAIT */}
          {canWait.length > 0 && (
            <View className="mb-10">
              <View className="flex-row items-center mb-3">
                <View className="w-2.5 h-2.5 rounded-full bg-gray-500 mr-2" />
                <Text className="text-gray-400 font-bold tracking-widest text-xs uppercase">
                  CAN WAIT (Low Urgency)
                </Text>
              </View>
              {canWait.map(item => (
                <View
                  key={item.id}
                  className="bg-white/5 rounded-2xl border border-white/5 p-4 mb-2 flex-row justify-between items-center opacity-70"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-white font-medium text-xs">{item.title}</Text>
                    <Text className="text-gray-400 text-[11px] mt-0.5">{item.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDismiss(item.id)}
                    className="bg-white/10 px-2.5 py-1 rounded-lg"
                  >
                    <Text className="text-gray-400 text-xs">Dismiss</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
