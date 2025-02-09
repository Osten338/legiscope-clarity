
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

    console.log('Making OpenAI API request with business description:', description)

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

            Focus on the most relevant regulations for this business. Order them by importance.
            Consider GDPR and data protection if personal data is involved.
            Consider industry-specific regulations based on the business type.
            Consider local regulations based on the business location.

            Format the response as a JSON object with this structure:
            {
              "analysis": "Brief high-level analysis of key compliance needs",
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
        temperature: 0.7,
        max_tokens: 2000,
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response:', openAIData);

    const analysisResult = JSON.parse(openAIData.choices[0]?.message?.content || "{}");
    console.log('Parsed analysis result:', analysisResult);

    if (!analysisResult.regulations || !Array.isArray(analysisResult.regulations) || analysisResult.regulations.length === 0) {
      console.error('No regulations found in analysis result');
      throw new Error('No regulations found in analysis');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First insert the business analysis
    console.log('Inserting business analysis...');
    const { data: analysis, error: analysisError } = await supabaseClient
      .from('business_analyses')
      .insert([
        { 
          description, 
          analysis: analysisResult.analysis 
        }
      ])
      .select()
      .single();

    if (analysisError) {
      console.error('Error inserting business analysis:', analysisError);
      throw analysisError;
    }

    console.log('Successfully inserted business analysis:', analysis);

    // Now process each regulation
    for (const reg of analysisResult.regulations) {
      console.log('Processing regulation:', reg);

      // First insert the regulation
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

      if (regError) {
        console.error('Error inserting regulation:', regError);
        throw regError;
      }

      console.log('Successfully inserted regulation:', regulation);

      // Then link it to the business analysis
      const { error: linkError } = await supabaseClient
        .from('business_regulations')
        .insert([
          {
            business_analysis_id: analysis.id,
            regulation_id: regulation.id
          }
        ]);

      if (linkError) {
        console.error('Error linking regulation to analysis:', linkError);
        throw linkError;
      }

      console.log('Successfully linked regulation to analysis:', {
        business_analysis_id: analysis.id,
        regulation_id: regulation.id
      });

      // Finally, insert checklist items if any
      if (reg.checklist_items && reg.checklist_items.length > 0) {
        const checklistItems = reg.checklist_items.map((item: string) => ({
          regulation_id: regulation.id,
          description: item
        }));

        const { error: checklistError } = await supabaseClient
          .from('checklist_items')
          .insert(checklistItems);

        if (checklistError) {
          console.error('Error inserting checklist items:', checklistError);
          throw checklistError;
        }

        console.log('Successfully inserted checklist items for regulation:', reg.name);
      }
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
