import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedOrb from '@/components/ui/AnimatedOrb';
import { useAIStream, ActionCardItem } from '@/hooks/useAIStream';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cards?: ActionCardItem[];
}

const CHAT_PROMPTS = [
  'What should I eat for dinner?',
  'Plan a 3-day trip to Goa',
  'Tell me the best phone under ₹40,000',
  'Pay electricity bill',
  'Call Mom',
];

export default function ChatScreen() {
  const { id, query, initialMessage } = useLocalSearchParams<{ id: string; query?: string; initialMessage?: string }>();
  const router = useRouter();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm DO, your AI life operating system. Tell me what you need, and I'll figure out the rest.",
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { streamedText, isStreaming, isLoading, actionCards, sendMessage } = useAIStream();
  const hasInitialized = useRef(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // If passed initial query from home screen or voice
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const initialPrompt = query || initialMessage;
      if (initialPrompt && initialPrompt.trim()) {
        handleUserSend(initialPrompt.trim());
      } else if (id === 'call-mom') {
        handleUserSend('Call Mom');
      }
    }
  }, [query, initialMessage, id]);

  // When streaming completes, append to messages list
  useEffect(() => {
    if (!isStreaming && streamedText) {
      setMessages(prev => {
        // Prevent duplicate append
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant' && last.content === streamedText) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'ai_' + Date.now(),
            role: 'assistant',
            content: streamedText,
            cards: actionCards.length > 0 ? actionCards : undefined,
          },
        ];
      });
    }
  }, [isStreaming, streamedText, actionCards]);

  const handleUserSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    sendMessage(textToSend.trim());
  };

  const handleCardAction = (label: string, actionId: string) => {
    // Route each actionId to a meaningful destination
    switch (actionId) {
      case 'order_food':
        showToast('🛵 Navigating to order food...');
        setTimeout(() => router.push('/feature/what-do-i-eat' as any), 400);
        break;
      case 'show_recipe':
        router.push('/feature/what-do-i-eat' as any);
        break;
      case 'pay_bill':
        showToast('💳 Opening Money Assistant...');
        setTimeout(() => router.push('/feature/money' as any), 400);
        break;
      case 'remind_bill':
        showToast('⏰ Reminder set for 8 PM tonight!');
        break;
      case 'book_trip':
        showToast('✈️ Opening Trip Planner...');
        setTimeout(() => router.push('/feature/trip-planner' as any), 400);
        break;
      case 'cheaper_trip':
        router.push('/feature/trip-planner' as any);
        break;
      case 'dial_mom': {
        // Open native phone dialer
        const { Linking } = require('react-native');
        Linking.openURL('tel:+919840012345').catch(() => {
          showToast('📞 Opening dialer...');
        });
        break;
      }
      case 'msg_mom': {
        const { Linking } = require('react-native');
        const msg = encodeURIComponent("Hey Mom, calling you in 5 minutes!");
        Linking.openURL(`https://wa.me/919840012345?text=${msg}`).catch(() => {
          showToast('💬 Message sent to Mom!');
        });
        break;
      }
      case 'view_deal':
      case 'compare_specs':
        showToast('🛍️ Opening Tell Me Best...');
        setTimeout(() => router.push('/feature/tell-me-best' as any), 400);
        break;
      case 'exec_action':
        showToast(`⚡ Executing: "${label}"`);
        break;
      case 'edit_action':
        showToast('✏️ Modify your request below:');
        break;
      default:
        showToast(`⚡ Done: "${label}"`);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View className={`mb-4 max-w-[90%] ${isUser ? 'self-end' : 'self-start'}`}>
        <GlassCard
          className={`p-4 rounded-2xl ${
            isUser ? 'bg-purple-900/40 border-purple-500/30' : 'bg-[#161622] border-white/10'
          }`}
        >
          <Text className="text-white text-base leading-6">{item.content}</Text>
        </GlassCard>

        {/* Action Cards attached to this message */}
        {item.cards && item.cards.length > 0 && (
          <View className="mt-2.5 gap-2">
            {item.cards.map(card => (
              <View
                key={card.id}
                className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 shadow-lg"
              >
                {card.badge && (
                  <View className="self-start bg-purple-500/30 px-2.5 py-0.5 rounded-full mb-1.5 border border-purple-400/40">
                    <Text className="text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                      {card.badge}
                    </Text>
                  </View>
                )}
                <Text className="text-white font-bold text-base mb-1">{card.title}</Text>
                <Text className="text-gray-300 text-xs mb-3">{card.description}</Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleCardAction(card.primaryAction.label, card.primaryAction.actionId)}
                    className="flex-1 bg-purple-600 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-white font-bold text-xs">{card.primaryAction.label}</Text>
                  </TouchableOpacity>

                  {card.secondaryAction && (
                    <TouchableOpacity
                      onPress={() =>
                        handleCardAction(card.secondaryAction!.label, card.secondaryAction!.actionId)
                      }
                      className="px-3 py-2.5 rounded-xl bg-white/10 items-center border border-white/10"
                    >
                      <Text className="text-gray-300 font-semibold text-xs">
                        {card.secondaryAction.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0A0A0F]"
    >
      {/* Header */}
      <View className="flex-row items-center pt-14 pb-4 px-4 border-b border-white/5 bg-[#12121A]/80">
        <TouchableOpacity onPress={handleBack} className="p-2 mr-2">
          <Text className="text-gray-400 text-lg">‹ Back</Text>
        </TouchableOpacity>
        <View className="flex-1 items-center mr-6">
          <Text className="text-white text-base font-bold">DO Life Operator</Text>
          <Text className="text-gray-400 text-[11px]">Autonomous Execution</Text>
        </View>
      </View>

      {/* Toast Alert */}
      {toastMessage && (
        <View className="bg-purple-500/30 border border-purple-400/50 p-3 mx-4 mt-2 rounded-xl items-center">
          <Text className="text-purple-200 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* Messages Feed */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          <>
            {/* Live Streaming Indicator & Bubble */}
            {isStreaming && (
              <View className="mb-4 max-w-[90%] self-start">
                <GlassCard className="p-4 rounded-2xl bg-[#161622] border-purple-500/30">
                  <Text className="text-white text-base leading-6">
                    {streamedText}
                    <Text className="text-purple-400"> ▋</Text>
                  </Text>
                </GlassCard>
              </View>
            )}

            {isLoading && (
              <View className="px-3 py-2 flex-row items-center">
                <AnimatedOrb size={20} isActive={true} />
                <Text className="text-purple-300 text-xs ml-3 font-medium">DO is formulating the plan...</Text>
              </View>
            )}
          </>
        }
      />

      {/* Quick Suggestion Chips */}
      <View className="px-3 pb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CHAT_PROMPTS.map((prompt, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleUserSend(prompt)}
              className="mr-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              <Text className="text-gray-300 text-xs">{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View className="p-4 border-t border-white/5 bg-[#12121A]">
        <View className="flex-row items-center bg-[#1A1A24] rounded-full px-4 py-2 border border-white/10">
          <TextInput
            className="flex-1 text-white text-base py-2"
            placeholder="Tell us what you need..."
            placeholderTextColor="#64748B"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleUserSend(input)}
          />
          <TouchableOpacity onPress={() => router.push('/(modals)/voice')} className="p-2 mx-1">
            <Text className="text-xl">🎤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUserSend(input)}
            className="bg-purple-600 rounded-full p-2 ml-1 w-10 h-10 items-center justify-center"
          >
            <Text className="text-white font-bold">↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
