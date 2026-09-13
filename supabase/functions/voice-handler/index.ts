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
    const { audioBase64, audioUrl, action } = await req.json();

    if (action === 'transcribe') {
      // Production: Pipe to Deepgram Nova-2 WebSockets or Whisper endpoint
      // Mock high-speed transcription
      const mockTranscripts = [
        "I need dinner under ₹500 in 30 minutes.",
        "Remind me to call Dad tomorrow evening at 7.",
        "Find the best noise-cancelling headphones under ₹15,000.",
        "I have 20 minutes free. What should I do?"
      ];
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];

      return new Response(JSON.stringify({
        transcript: randomTranscript,
        confidence: 0.98,
        language: 'en',
        detectedIntentDomain: 'lifestyle'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'synthesize') {
      // Production: Pipe to Cartesia Sonic or ElevenLabs Turbo v2.5
      return new Response(JSON.stringify({
        audioUrl: "https://assets.do-app.ai/voice/response-sample.mp3",
        durationMs: 1400,
        provider: "cartesia-sonic"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
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
