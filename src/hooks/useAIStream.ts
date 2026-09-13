import { useState, useCallback, useRef } from 'react';

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

    // 1. Food / Eat / Hungry
    if (q.includes('eat') || q.includes('food') || q.includes('hungry') || q.includes('dinner') || q.includes('lunch') || q.includes('cook') || q.includes('recipe')) {
      return {
        intent: 'food',
        text: `I found two great options for you right now:\n\n1. 🍳 **15-Min Quick Cook**: Garlic Egg Fried Rice with scallions and soy glaze (Est. ₹40 / 15 mins).\n2. 🛵 **Fast Delivery**: Hot Smoked Paneer Biryani from Royal Kitchen (ETA: 22 mins, ₹280).\n\nShall I dispatch the delivery or give you the 3-step recipe?`,
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
        text: `Here is your autonomous 3-day itinerary:\n\n• **Stay**: Zostel Plus Private Cottage or Heritage Haveli (₹3,200/night)\n• **Day 1**: Arrival, beachfront sunset drinks, and authentic local dinner.\n• **Day 2**: Kayaking along mangroves, coastal trail, and evening acoustic live music.\n• **Day 3**: Flea market artisanal shopping and departure.\n\nTotal estimated budget: ₹14,500 for two.`,
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
      return {
        intent: 'finance',
        text: `You have 1 pending bill due today: State Electricity Provider for ₹2,850. Your monthly spending is currently ₹14,850 with ₹3,580 remaining in your budget buffer.`,
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
      text: `I've understood your intent: "${query}".\n\nI broke this down into executable steps:\n1. Checked your preferences and current schedule.\n2. Identified the fastest path to achieve this with minimal effort.\n3. Prepared autonomous execution ready for your confirmation.`,
      cards: [
        {
          id: 'card_general_action',
          title: 'Execute: ' + query.slice(0, 35) + (query.length > 35 ? '...' : ''),
          description: 'Ready to proceed autonomously without tedious manual steps.',
          badge: 'AI Operator',
          primaryAction: { label: '⚡ Just Do It', actionId: 'exec_action' },
          secondaryAction: { label: 'Modify Details', actionId: 'edit_action' },
        },
      ],
    };
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

    const response = generateIntentResponse(message);

    setTimeout(() => {
      setState((s) => ({
        ...s,
        isStreaming: true,
        currentIntent: response.intent,
        isLoading: false,
      }));

      const fullText = response.text;
      let currentIndex = 0;
      const chunkSize = 3;

      timerRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentIndex = Math.min(fullText.length, currentIndex + chunkSize);
          const currentSub = fullText.slice(0, currentIndex);
          setState((s) => ({ ...s, streamedText: currentSub }));
        } else {
          clearInterval(timerRef.current);
          setState((s) => ({
            ...s,
            isStreaming: false,
            actionCards: response.cards,
          }));
        }
      }, 25);
    }, 400);
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
