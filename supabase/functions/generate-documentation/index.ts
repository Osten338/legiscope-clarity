
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { regulation, checklistItem } = await req.json();

    const prompt = `Please generate comprehensive documentation for implementing the following compliance requirement:

Regulation: ${regulation.name}
Regulation Description: ${regulation.description}

Specific Requirement: ${checklistItem.description}

Please provide:
1. A detailed implementation plan
2. Key considerations and potential challenges
3. Best practices and guidelines
4. Required resources and estimated timeline
5. Success criteria and verification methods`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a compliance documentation expert that helps organizations implement regulatory requirements effectively.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const generatedDocumentation = data.choices[0].message.content;

    return new Response(JSON.stringify({ documentation: generatedDocumentation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
