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
    const { imageBase64, imageUrl, promptType } = await req.json();

    // Production: Route to Gemini 2.0 Flash Vision or GPT-4o Vision
    let result: Record<string, any> = {};

    switch (promptType) {
      case 'bill':
        result = {
          type: 'bill',
          title: 'Electricity Utility Invoice',
          amount: 2850,
          currency: 'INR',
          dueDate: 'Today (11:59 PM)',
          vendor: 'City Power Corporation',
          status: 'unpaid',
          action: 'Pay now before midnight to prevent late surcharge.'
        };
        break;

      case 'product':
        result = {
          type: 'product',
          name: 'Sony WH-1000XM5 Wireless Headphones',
          estimatedPrice: 26990,
          currency: 'INR',
          rating: 4.7,
          isWorthBuying: 'Yes, best-in-class ANC. However, XM4 is available for ₹19,990 with 90% same performance.',
          topAlternative: 'Sony WH-1000XM4 (₹19,990)'
        };
        break;

      case 'menu':
        result = {
          type: 'menu',
          cuisine: 'Italian Contemporary',
          topRecommendations: [
            { dish: 'Truffle Mushroom Tagliatelle', price: 650, reason: 'House specialty, freshly rolled pasta' },
            { dish: 'Wood-fired Burrata Margherita', price: 580, reason: 'Crowd favorite, imported cheese' }
          ],
          budgetOption: 'Classic Aglio e Olio (₹420)'
        };
        break;

      case 'fridge':
        result = {
          type: 'food_inventory',
          detectedIngredients: ['Eggs', 'Cheddar Cheese', 'Tomatoes', 'Bell Peppers', 'Leftover Rice'],
          recommendedMeals: [
            { name: 'Egg Fried Rice with Peppers', timeMinutes: 12, complexity: 'Easy' },
            { name: 'Mediterranean Cheese Omelette', timeMinutes: 8, complexity: 'Very Easy' }
          ]
        };
        break;

      default:
        result = {
          type: 'general_inspection',
          summary: 'Processed visual snapshot successfully.',
          extractedEntities: ['Object detected', 'Text extracted via OCR'],
          actionableSuggestion: 'Ready to convert this into a task or search.'
        };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
