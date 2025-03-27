
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

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

    console.log("Sending request to Perplexity API for documentation generation");
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { 
            role: 'system', 
            content: 'You are a compliance documentation expert that helps organizations implement regulatory requirements effectively.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    console.log("Received response from Perplexity API");
    
    if (data.error) {
      throw new Error(`Perplexity API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    
    const generatedDocumentation = data.choices[0].message.content;

    return new Response(JSON.stringify({ documentation: generatedDocumentation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating documentation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
