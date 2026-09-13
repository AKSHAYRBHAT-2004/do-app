import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubIntent {
  action: string;
  target?: string;
  parameters?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, userId, context } = await req.json();

    if (!query || !userId) {
      return new Response(JSON.stringify({ error: 'Missing query or userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let domains: string[] = [];
    let urgency = 'normal';
    let subIntents: SubIntent[] = [];
    let clarificationNeeded: string | undefined;

    // Tier 0: Regex matching for simple commands
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.match(/^(remind|timer|set|toggle)/)) {
      domains.push('PRODUCTIVITY');
      urgency = 'high';
      subIntents.push({ action: 'create_reminder' });
    } else {
      // Tier 1: Keyword-based domain classification
      const keywords: Record<string, string[]> = {
        FOOD: ['food', 'eat', 'restaurant', 'meal', 'recipe', 'grocery', 'menu'],
        SHOPPING: ['buy', 'shop', 'purchase', 'cheap', 'price'],
        TRAVEL: ['trip', 'flight', 'travel', 'hotel', 'itinerary', 'vacation'],
        FINANCE: ['spend', 'budget', 'bill', 'money', 'pay'],
        PRODUCTIVITY: ['task', 'schedule', 'plan', 'organize', 'event'],
        HOUSEHOLD: ['restock', 'supplies', 'clean', 'house'],
        ENTERTAINMENT: ['movie', 'fun', 'game', 'watch', 'play'],
        HEALTH: ['workout', 'health', 'sleep', 'exercise']
      };

      for (const [domain, words] of Object.entries(keywords)) {
        if (words.some(word => lowercaseQuery.includes(word))) {
          domains.push(domain);
        }
      }

      // Tier 2: LLM-based classification (Mocked for simplicity, in reality call OpenAI/Gemini)
      if (domains.length === 0) {
        // Fallback or complex LLM logic here
        domains.push('GENERAL');
      }
    }

    const responseData = {
      domains: [...new Set(domains)],
      urgency,
      subIntents,
      clarificationNeeded
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
