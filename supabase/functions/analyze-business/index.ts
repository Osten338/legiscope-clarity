
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessment_id, description } = await req.json();

    console.log("Processing analysis for assessment:", assessment_id);
    console.log("Business description:", description);

    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate an enhanced AI analysis of the business description
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    let aiAnalysis = "Analysis in progress...";

    if (perplexityApiKey) {
      try {
        console.log("Generating AI analysis using Perplexity API");
        
        // First analyze the business description for a comprehensive assessment
        const analysisResponse = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${perplexityApiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-large-128k-online",
            messages: [
              {
                role: "system",
                content: "You are a detailed compliance and regulatory expert with deep domain knowledge. Analyze the business description thoroughly and provide a comprehensive compliance assessment. Include potential risks, and mitigation strategies. Be thorough in your analysis and provide actionable, practical guidance. Cover all relevant areas including data protection, industry-specific regulations, environmental compliance, labor laws, and financial regulations."
              },
              {
                role: "user",
                content: `Provide a detailed and comprehensive compliance assessment for this business description: ${description}`
              }
            ],
            temperature: 0.1,
            max_tokens: 4000,
            top_p: 0.9
          })
        });

        const analysisData = await analysisResponse.json();
        
        if (analysisData.choices && analysisData.choices[0] && analysisData.choices[0].message) {
          aiAnalysis = analysisData.choices[0].message.content;
          console.log("Successfully generated AI analysis");
        } else {
          console.error("Unexpected Perplexity API response structure:", analysisData);
        }
        
        // Now, identify which regulations from our catalog apply to this business
        console.log("Fetching available regulations catalog");
        const { data: regulationsCatalog, error: catalogError } = await supabaseAdmin
          .from('regulations')
          .select('id, name, description, motivation, requirements');
          
        if (catalogError) {
          throw new Error(`Failed to fetch regulations catalog: ${catalogError.message}`);
        }
        
        console.log(`Found ${regulationsCatalog.length} regulations in catalog`);
        
        // Use AI to determine which regulations apply to this business
        const regulationPrompt = `
          I have a business described as: "${description}"
          
          Below is a list of possible regulations that might apply to this business:
          ${regulationsCatalog.map(reg => `ID: ${reg.id}, Name: ${reg.name}, Description: ${reg.description}`).join('\n\n')}
          
          For each regulation, respond with ONLY the regulation ID if it applies to this business, or "N/A" if it doesn't apply.
          Format your response as a simple JSON array of regulation IDs that apply, like this:
          ["id1", "id2", "id3"]
          If no regulations apply, return an empty array: []
        `;
        
        console.log("Determining applicable regulations with AI");
        
        const regulationResponse = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${perplexityApiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-large-128k-online",
            messages: [
              {
                role: "system",
                content: "You are a regulatory compliance expert. Your task is to determine which regulations apply to a business based on its description. Respond ONLY with the IDs of applicable regulations in a JSON array format."
              },
              {
                role: "user",
                content: regulationPrompt
              }
            ],
            temperature: 0.1,
            max_tokens: 1000,
            top_p: 0.9
          })
        });

        const regulationData = await regulationResponse.json();
        
        if (regulationData.choices && regulationData.choices[0] && regulationData.choices[0].message) {
          try {
            // Extract just the JSON array from the response
            const responseText = regulationData.choices[0].message.content;
            // Find anything that looks like a JSON array in the response
            const jsonMatch = responseText.match(/\[.*\]/s);
            
            if (jsonMatch) {
              const applicableRegulationIds = JSON.parse(jsonMatch[0]);
              console.log("Identified applicable regulations:", applicableRegulationIds);
              
              // Filter the catalog to just the applicable regulations
              const applicableRegulations = regulationsCatalog.filter(reg => 
                applicableRegulationIds.includes(reg.id)
              );
              
              // Create a business analysis record with the AI assessment
              const { data: analysisData, error: analysisError } = await supabaseAdmin
                .from('business_analyses')
                .insert({
                  id: assessment_id,
                  description,
                  analysis: aiAnalysis
                })
                .select()
                .single();

              if (analysisError) {
                console.error("Error creating analysis:", analysisError);
                throw analysisError;
              }

              console.log("Created analysis record:", analysisData);

              // Link the applicable regulations to the business analysis
              if (applicableRegulations.length > 0) {
                const businessRegulationsData = applicableRegulations.map(reg => ({
                  business_analysis_id: assessment_id,
                  regulation_id: reg.id
                }));
                
                const { error: linkError } = await supabaseAdmin
                  .from('business_regulations')
                  .insert(businessRegulationsData);
                
                if (linkError) {
                  console.error("Error linking regulations to analysis:", linkError);
                  throw linkError;
                }
                
                console.log(`Linked ${applicableRegulations.length} regulations to analysis`);
              } else {
                console.log("No applicable regulations found for this business");
              }
            } else {
              throw new Error("Failed to extract JSON array from AI response");
            }
          } catch (parseError) {
            console.error("Error parsing regulation IDs:", parseError);
            console.log("Raw response:", regulationData.choices[0].message.content);
            
            // Fallback: Create analysis without linking regulations
            const { data: analysisData, error: analysisError } = await supabaseAdmin
              .from('business_analyses')
              .insert({
                id: assessment_id,
                description,
                analysis: aiAnalysis
              })
              .select()
              .single();

            if (analysisError) {
              throw analysisError;
            }
          }
        } else {
          console.error("Unexpected Perplexity API response structure for regulations:", regulationData);
          throw new Error("Failed to determine applicable regulations");
        }
      } catch (aiError) {
        console.error("Error in AI processing:", aiError);
        
        // Create a business analysis record even if AI processing fails
        const { data: analysisData, error: analysisError } = await supabaseAdmin
          .from('business_analyses')
          .insert({
            id: assessment_id,
            description,
            analysis: "Failed to generate analysis due to an error. Please try again later."
          })
          .select()
          .single();

        if (analysisError) {
          throw analysisError;
        }
      }
    } else {
      console.log("No Perplexity API key found, creating basic analysis without AI");
      
      // Create a basic business analysis record without AI enhancement
      const { data: analysisData, error: analysisError } = await supabaseAdmin
        .from('business_analyses')
        .insert({
          id: assessment_id,
          description,
          analysis: "Analysis pending. Please check back later."
        })
        .select()
        .single();

      if (analysisError) {
        throw analysisError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis_id: assessment_id,
        has_enhanced_analysis: !!perplexityApiKey
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error("Error in analyze-business function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
