import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { intent, userId, context } = await req.json();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        sendEvent('status', { message: 'Assembling context...' });
        await new Promise(r => setTimeout(r, 500));
        
        sendEvent('intent.detected', intent);
        
        sendEvent('status', { message: 'Planning actions...' });
        await new Promise(r => setTimeout(r, 500));
        
        sendEvent('text.delta', { text: 'I understand you want to ' + intent.domains.join(', ') });
        
        sendEvent('plan.delta', { steps: ['Analyze request', 'Execute tools'] });

        if (intent.domains.includes('FOOD')) {
          sendEvent('tool.started', { tool: 'recommend_meal' });
          await new Promise(r => setTimeout(r, 800));
          sendEvent('tool.completed', { tool: 'recommend_meal', result: 'Suggested Pasta' });
        }
        
        sendEvent('action_card.ready', { type: 'summary', data: 'Done!' });
        sendEvent('finished', { success: true });
        
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
