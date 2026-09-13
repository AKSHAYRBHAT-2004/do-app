import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const tools = [
  { name: 'recommend_meal', domain: 'FOOD', impact: 'read_only' },
  { name: 'find_restaurants', domain: 'FOOD', impact: 'read_only' },
  { name: 'create_grocery_list', domain: 'FOOD', impact: 'mutating_safe' },
  { name: 'analyze_menu', domain: 'FOOD', impact: 'read_only' },
  
  { name: 'find_best_product', domain: 'SHOPPING', impact: 'read_only' },
  { name: 'create_goal_basket', domain: 'SHOPPING', impact: 'read_only' },
  { name: 'compare_prices', domain: 'SHOPPING', impact: 'read_only' },
  
  { name: 'plan_trip', domain: 'TRAVEL', impact: 'read_only' },
  { name: 'find_transport', domain: 'TRAVEL', impact: 'read_only' },
  { name: 'create_itinerary', domain: 'TRAVEL', impact: 'mutating_safe' },
  
  { name: 'analyze_spending', domain: 'FINANCE', impact: 'read_only' },
  { name: 'track_budget', domain: 'FINANCE', impact: 'read_only' },
  { name: 'explain_bill', domain: 'FINANCE', impact: 'read_only' },
  
  { name: 'create_task', domain: 'PRODUCTIVITY', impact: 'mutating_safe' },
  { name: 'create_reminder', domain: 'PRODUCTIVITY', impact: 'mutating_safe' },
  { name: 'organize_day', domain: 'PRODUCTIVITY', impact: 'mutating_safe' },
  { name: 'prepare_for_event', domain: 'PRODUCTIVITY', impact: 'mutating_safe' },
  
  { name: 'track_supplies', domain: 'HOUSEHOLD', impact: 'read_only' },
  { name: 'suggest_restock', domain: 'HOUSEHOLD', impact: 'read_only' },
  
  { name: 'suggest_activity', domain: 'ENTERTAINMENT', impact: 'read_only' },
  { name: 'plan_evening', domain: 'ENTERTAINMENT', impact: 'read_only' },
  { name: 'recommend_content', domain: 'ENTERTAINMENT', impact: 'read_only' },
  
  { name: 'track_wellness', domain: 'HEALTH', impact: 'mutating_safe' },
  { name: 'suggest_activities', domain: 'HEALTH', impact: 'read_only' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    if (action === 'get_tools') {
      const { domains } = await req.json();
      const availableTools = tools.filter(t => domains.includes(t.domain));
      return new Response(JSON.stringify({ tools: availableTools }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'execute') {
      const { toolName, parameters } = await req.json();
      const toolDef = tools.find(t => t.name === toolName);

      if (!toolDef) {
        throw new Error('Tool not found');
      }

      if (toolDef.impact === 'high_impact') {
        return new Response(JSON.stringify({
          status: 'confirmation_required',
          message: `Are you sure you want to execute ${toolName}?`
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Mock tool execution
      return new Response(JSON.stringify({
        status: 'success',
        result: `Executed ${toolName} successfully`
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
