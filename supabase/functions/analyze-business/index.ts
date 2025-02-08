
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { description } = await req.json()

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API Key')
    }

    console.log('Making OpenAI API request...')

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a business compliance analyst. Analyze the business description and identify applicable regulations. For each regulation, provide:
            1. The name and brief description of the regulation
            2. Why it applies to this business (motivation)
            3. Key requirements
            4. A checklist of specific compliance measures

            Format the response as a JSON object with this structure:
            {
              "analysis": "Brief overall analysis",
              "regulations": [
                {
                  "name": "Regulation name",
                  "description": "Brief description",
                  "motivation": "Why it applies",
                  "requirements": "Key requirements",
                  "checklist_items": ["measure 1", "measure 2", ...]
                }
              ]
            }`
          },
          {
            role: "user",
            content: description
          }
        ],
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const openAIData = await openAIResponse.json();
    const analysisResult = JSON.parse(openAIData.choices[0]?.message?.content || "{}");

    // Store the analysis in the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Start a transaction
    const { data: analysis, error: analysisError } = await supabaseClient
      .from('business_analyses')
      .insert([
        { description, analysis: analysisResult.analysis }
      ])
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Store regulations and their checklist items
    for (const reg of analysisResult.regulations) {
      const { data: regulation, error: regError } = await supabaseClient
        .from('regulations')
        .insert([
          {
            name: reg.name,
            description: reg.description,
            motivation: reg.motivation,
            requirements: reg.requirements
          }
        ])
        .select()
        .single();

      if (regError) throw regError;

      // Link regulation to business analysis
      await supabaseClient
        .from('business_regulations')
        .insert([
          {
            business_analysis_id: analysis.id,
            regulation_id: regulation.id
          }
        ]);

      // Store checklist items
      const checklistItems = reg.checklist_items.map((item: string) => ({
        regulation_id: regulation.id,
        description: item
      }));

      await supabaseClient
        .from('checklist_items')
        .insert(checklistItems);
    }

    return new Response(
      JSON.stringify({ analysis: analysis.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
