import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, userId, tier, paymentMethodId } = await req.json();

    if (action === 'get_plans') {
      return new Response(JSON.stringify({
        plans: [
          {
            id: 'free',
            name: 'DO Free',
            priceINR: 0,
            period: 'forever',
            features: ['Standard AI assistance', 'Basic tasks & reminders', '10 quick intents / day', 'On-device security']
          },
          {
            id: 'pro',
            name: 'DO Pro',
            priceINR: 299,
            period: 'monthly',
            features: ['Unlimited AI intents', 'Tell Me The Best comparison engine', 'Snap → Solve multimodal vision', 'Persistent personal memory', 'Smart Restock & Travel Planner']
          },
          {
            id: 'premium',
            name: 'DO Max Life Operator',
            priceINR: 599,
            period: 'monthly',
            features: ['All Pro features', 'Sub-300ms ultra-low latency voice loop', 'Autonomous multi-step calendar & booking orchestrator', 'Proactive life dashboard & bill autopay reminders', 'Zero Data Retention enterprise privacy guarantee']
          }
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'upgrade') {
      return new Response(JSON.stringify({
        success: true,
        newTier: tier,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        message: `Successfully upgraded to ${tier.toUpperCase()}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
