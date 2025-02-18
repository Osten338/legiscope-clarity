
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

    // First create a business analysis record
    const { data: analysisData, error: analysisError } = await supabaseAdmin
      .from('business_analyses')
      .insert({
        id: assessment_id, // Use the same ID as the assessment
        description,
        analysis: "Analysis in progress..."
      })
      .select()
      .single();

    if (analysisError) {
      console.error("Error creating analysis:", analysisError);
      throw analysisError;
    }

    console.log("Created analysis record:", analysisData);

    // Generate some example regulations (in a real app, this would be more sophisticated)
    const regulations = [
      {
        name: "Data Protection Regulation",
        description: "Basic data protection requirements for businesses handling personal information",
        motivation: "Your business handles personal data and needs to ensure proper protection measures",
        requirements: "Implement data protection measures, maintain records of processing activities, ensure secure storage",
        checklist_items: [
          "Implement data encryption for stored personal data",
          "Create a data breach response plan",
          "Maintain records of data processing activities",
          "Appoint a data protection officer if required"
        ]
      },
      {
        name: "Digital Security Standards",
        description: "Security standards for digital business operations",
        motivation: "Your business operates online and handles sensitive information",
        requirements: "Implement cybersecurity measures, regular security audits, incident response planning",
        checklist_items: [
          "Implement strong password policies",
          "Regular security training for employees",
          "Setup multi-factor authentication",
          "Regular security audits"
        ]
      }
    ];

    console.log("Processing regulations:", regulations);

    // Use the process_analysis_regulations function to insert the regulations
    const { data: regulationsData, error: regulationsError } = await supabaseAdmin.rpc(
      'process_analysis_regulations',
      {
        p_analysis_id: assessment_id,
        p_regulations: regulations
      }
    );

    if (regulationsError) {
      console.error("Error processing regulations:", regulationsError);
      throw regulationsError;
    }

    console.log("Regulations processed successfully:", regulationsData);

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis_id: assessment_id
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
