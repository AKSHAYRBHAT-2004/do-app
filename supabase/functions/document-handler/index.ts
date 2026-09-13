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
    const { documentText, documentUrl, mode } = await req.json();

    // Mode can be: 'lazy' (30 sec), 'eli10', 'actions_only', 'full'
    const analysis = {
      whatIsThis: 'Residential Tenancy Agreement between Landlord and Tenant for a 12-month period.',
      whatActuallyMatters: 'Rent is due on the 5th of each month. 2 months security deposit. Landlord gives 30 days notice before entry.',
      whatDoINeedToDo: [
        'Sign page 4 and page 7.',
        'Transfer initial deposit of ₹50,000 via NEFT.',
        'Take photo evidence of apartment condition on move-in day.'
      ],
      importantDates: [
        { label: 'Commencement Date', date: 'October 1, 2026' },
        { label: 'Lock-in Period Ends', date: 'March 31, 2027' },
        { label: 'Notice Period', date: '30 days prior to vacating' }
      ],
      importantNumbers: [
        { label: 'Monthly Rent', value: '₹25,000' },
        { label: 'Security Deposit', value: '₹50,000' },
        { label: 'Maintenance Fee', value: '₹2,200 / month' },
        { label: 'Late Payment Penalty', value: '₹200 / day after 10th' }
      ],
      canIgnore: [
        'Standard boilerplates regarding municipal tax legislation',
        'Arbitration clauses using standard high court jurisdiction'
      ],
      questionsToAsk: [
        'Is painting fee deducted upon exit regardless of condition?',
        'Who covers major plumbing repairs over ₹1,000?'
      ]
    };

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
