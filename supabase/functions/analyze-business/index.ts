
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
            content: `You are a business compliance analyst specializing in identifying regulatory requirements. 
            Given a business description, you MUST identify at least 2-3 relevant regulations, even for brief descriptions.
            Always consider basic business regulations that apply broadly (e.g., data protection, business licensing).
            If the description is vague, make reasonable assumptions and explain them in the analysis.

            Respond with a JSON object with this structure ONLY (no markdown, no explanation):
            {
              "analysis": "Brief high-level analysis of key compliance needs and assumptions made",
              "regulations": [
                {
                  "name": "Regulation name",
                  "description": "Brief description",
                  "motivation": "Why it applies",
                  "requirements": "Key requirements",
                  "checklist_items": ["measure 1", "measure 2"]
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
    console.log('OpenAI raw response:', openAIData);

    let analysisResult;
    try {
      const content = openAIData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }
      console.log('Raw content from OpenAI:', content);
      
      const cleanedContent = content.replace(/```json\n|\n```/g, '');
      console.log('Cleaned content:', cleanedContent);
      
      analysisResult = JSON.parse(cleanedContent);
      console.log('Parsed analysis result:', analysisResult);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse OpenAI response: ' + parseError.message);
    }

    if (!analysisResult || typeof analysisResult !== 'object') {
      throw new Error('Invalid analysis result structure');
    }

    if (!analysisResult.regulations || !Array.isArray(analysisResult.regulations)) {
      throw new Error('No regulations array in analysis result');
    }

    if (analysisResult.regulations.length === 0) {
      throw new Error('No regulations found in analysis');
    }

    analysisResult.regulations.forEach((reg, index) => {
      if (!reg.name || !reg.description || !reg.motivation || !reg.requirements || !Array.isArray(reg.checklist_items)) {
        throw new Error(`Invalid regulation structure at index ${index}`);
      }
    });

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

    // Insert regulations and create links in a transaction
    const { data: transaction, error: transactionError } = await supabaseClient.rpc(
      'process_analysis_regulations',
      { 
        p_analysis_id: analysis.id,
        p_regulations: analysisResult.regulations
      }
    );

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      throw transactionError;
    }

    console.log('Transaction completed successfully:', transaction);

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
