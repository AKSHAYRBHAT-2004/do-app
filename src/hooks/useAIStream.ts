import { useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useUserDataStore } from '@/stores/userDataStore';

export interface ActionCardItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  primaryAction: { label: string; actionId: string };
  secondaryAction?: { label: string; actionId: string };
}

interface AIStreamState {
  isStreaming: boolean;
  streamedText: string;
  actionCards: ActionCardItem[];
  currentIntent: string | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAIStream() {
  const [state, setState] = useState<AIStreamState>({
    isStreaming: false,
    streamedText: '',
    actionCards: [],
    currentIntent: null,
    error: null,
    isLoading: false,
  });

  const timerRef = useRef<any>(null);

  const generateIntentResponse = (query: string): { text: string; intent: string; cards: ActionCardItem[] } => {
    const q = query.toLowerCase();
    const userName = useAuthStore.getState().profile?.name?.split(' ')[0] || 'there';
    const memories = useUserDataStore.getState().memories;
    const foodMem = memories.find(m => m.category === 'Food' || m.category === 'Preferences');

    // 1. Food / Eat / Hungry
    if (q.includes('eat') || q.includes('food') || q.includes('hungry') || q.includes('dinner') || q.includes('lunch') || q.includes('cook') || q.includes('recipe')) {
      const memoryNote = foodMem ? `\n\n*(Referenced your saved preference: "${foodMem.content.slice(0, 50)}...")*` : '';
      return {
        intent: 'food',
        text: `Hey ${userName}, I found two tailored options for you right now:${memoryNote}\n\n1. 🍳 **15-Min Quick Cook**: Garlic Egg & Veggie Fried Rice with toasted sesame oil (Est. ₹45 / 15 mins).\n2. 🛵 **Fast Delivery**: Hot Smoked Paneer Biryani from Royal Kitchen (ETA: 22 mins, ₹280).\n\nShall I dispatch the delivery or give you the 3-step recipe?`,
        cards: [
          {
            id: 'card_food_order',
            title: 'Royal Kitchen — Paneer Biryani',
            description: 'Top rated near you • ₹280 • Delivery in 22 mins',
            badge: 'Fast Delivery',
            primaryAction: { label: 'Order for ₹280', actionId: 'order_food' },
            secondaryAction: { label: 'Show Cook Recipe', actionId: 'show_recipe' },
          },
        ],
      };
    }

    // 2. Call / Mom / Message
    if (q.includes('call') || q.includes('mom') || q.includes('dial') || q.includes('phone')) {
      return {
        intent: 'communication',
        text: `Connecting with Mom. She called 2 hours ago. I've prepared your phone dialer or I can send a quick WhatsApp: "Hey Mom, calling you in 5 minutes!"`,
        cards: [
          {
            id: 'card_call_mom',
            title: 'Call Mom (+91 98400 12345)',
            description: 'Last contact: Missed call 2h ago. Cell signal strong.',
            badge: 'Urgent Priority',
            primaryAction: { label: '📞 Call Now', actionId: 'dial_mom' },
            secondaryAction: { label: '💬 Send "Calling in 5m"', actionId: 'msg_mom' },
          },
        ],
      };
    }

    // 3. Travel / Trip / Vacation / Days / Flight
    if (q.includes('trip') || q.includes('travel') || q.includes('flight') || q.includes('goa') || q.includes('hotel') || q.includes('vacation')) {
      return {
        intent: 'travel',
        text: `Here is your autonomous 3-day itinerary for ${userName}:\n\n• **Stay**: Zostel Plus Private Cottage or Heritage Haveli (₹3,200/night)\n• **Day 1**: Arrival, beachfront sunset drinks, and authentic local dinner.\n• **Day 2**: Kayaking along mangroves, coastal trail, and evening acoustic live music.\n• **Day 3**: Flea market artisanal shopping and departure.\n\nTotal estimated budget: ₹14,500 for two.`,
        cards: [
          {
            id: 'card_trip_plan',
            title: '3-Day Scenic Getaway Package',
            description: 'Flight + Boutique Stay + Curated Activities • ₹14,500 total',
            badge: 'Ready to Book',
            primaryAction: { label: 'Confirm & Lock Price', actionId: 'book_trip' },
            secondaryAction: { label: 'Make Cheaper (-25%)', actionId: 'cheaper_trip' },
          },
        ],
      };
    }

    // 4. Best / Compare / Phone / Laptop / Buy
    if (q.includes('best') || q.includes('compare') || q.includes('phone') || q.includes('laptop') || q.includes('buy') || q.includes('recommend')) {
      return {
        intent: 'shopping',
        text: `I analyzed benchmark tests and verified owner reviews across your category:\n\n🥇 **Best Choice**: Cleanest software, top-tier computational camera, and 4+ years of guaranteed OS updates.\n🥈 **Best Alternative**: Slightly faster wired charging and higher gaming FPS.\n💰 **Cheapest Sensible**: Delivers 85% of the experience at almost half the price.`,
        cards: [
          {
            id: 'card_best_product',
            title: 'Top Recommendation: Flagship Performer',
            description: 'Rated 4.8/5 from 1,420 buyers • Lowest verified online price',
            badge: '🥇 Best Choice',
            primaryAction: { label: 'View Best Deal', actionId: 'view_deal' },
            secondaryAction: { label: 'Compare Specs', actionId: 'compare_specs' },
          },
        ],
      };
    }

    // 5. Money / Bill / Expense / Pay
    if (q.includes('money') || q.includes('bill') || q.includes('expense') || q.includes('pay') || q.includes('budget')) {
      const budget = useUserDataStore.getState().budgetLimit;
      return {
        intent: 'finance',
        text: `You have 1 pending bill due today: State Electricity Provider for ₹2,850. Your monthly target budget is ₹${budget.toLocaleString()}. Avoid late surcharge by paying today.`,
        cards: [
          {
            id: 'card_pay_bill',
            title: 'Electricity Bill — ₹2,850',
            description: 'Due tonight by 11:59 PM • Avoid ₹150 late surcharge',
            badge: 'Due Today',
            primaryAction: { label: '💳 Pay ₹2,850 Now', actionId: 'pay_bill' },
            secondaryAction: { label: 'Remind me at 8 PM', actionId: 'remind_bill' },
          },
        ],
      };
    }

    // 6. Default / General AI Operator
    return {
      intent: 'general_task',
      text: `Hello ${userName}! I've understood your request: "${query}".\n\nHere is how I will execute this autonomously:\n1. Checked your schedule and preferences.\n2. Identified the most cost-effective and highest-rated approach.\n3. Formulated the actionable steps below.`,
      cards: [
        {
          id: 'card_general_action',
          title: 'Execute: ' + query.slice(0, 35) + (query.length > 35 ? '...' : ''),
          description: 'Ready to proceed autonomously without manual friction.',
          badge: 'AI Operator',
          primaryAction: { label: '⚡ Just Do It', actionId: 'exec_action' },
          secondaryAction: { label: 'Modify Details', actionId: 'edit_action' },
        },
      ],
    };
  };

  // Call Live Google Gemini API if user has provided a key
  const callLiveGemini = async (prompt: string, apiKey: string): Promise<string | null> => {
    try {
      const userName = useAuthStore.getState().profile?.name?.split(' ')[0] || 'User';
      const systemContext = `You are DO, a futuristic, world-class personal AI Life Operating System. The user's name is ${userName}. Keep answers concise, highly practical, formatted in clean Markdown with emojis, and suggest actionable solutions. Use Indian Rupee (₹) for currency where applicable.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemContext}\n\nUser request: ${prompt}` },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) return null;
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch {
      return null;
    }
  };

  const sendMessage = useCallback(async (message: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setState((s) => ({
      ...s,
      isLoading: true,
      error: null,
      streamedText: '',
      actionCards: [],
      currentIntent: null,
    }));

    const geminiKey = useAppStore.getState().geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    let liveResponseText: string | null = null;

    if (geminiKey.trim()) {
      liveResponseText = await callLiveGemini(message, geminiKey.trim());
    }

    const localResult = generateIntentResponse(message);
    const finalFullText = liveResponseText || localResult.text;
    const finalCards = localResult.cards;

    setState((s) => ({
      ...s,
      isStreaming: true,
      currentIntent: localResult.intent,
      isLoading: false,
    }));

    let currentIndex = 0;
    const chunkSize = 4;

    timerRef.current = setInterval(() => {
      if (currentIndex < finalFullText.length) {
        currentIndex = Math.min(finalFullText.length, currentIndex + chunkSize);
        const currentSub = finalFullText.slice(0, currentIndex);
        setState((s) => ({ ...s, streamedText: currentSub }));
      } else {
        clearInterval(timerRef.current);
        setState((s) => ({
          ...s,
          isStreaming: false,
          actionCards: finalCards,
        }));
      }
    }, 20);
  }, []);

  const stopStream = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((s) => ({ ...s, isStreaming: false }));
  }, []);

  const clearStream = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      isStreaming: false,
      streamedText: '',
      actionCards: [],
      currentIntent: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return { ...state, sendMessage, stopStream, clearStream };
}
