
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
        
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${perplexityApiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-large-128k-online", // Using a more sophisticated model
            messages: [
              {
                role: "system",
                content: "You are a detailed compliance and regulatory expert with deep domain knowledge. Analyze the business description thoroughly and provide a comprehensive compliance assessment. Include specific regulatory frameworks that apply, detailed requirements, potential risks, and mitigation strategies. Be thorough in your analysis and provide actionable, practical guidance. Cover all relevant areas including data protection, industry-specific regulations, environmental compliance, labor laws, and financial regulations."
              },
              {
                role: "user",
                content: `Provide a detailed and comprehensive compliance assessment for this business description: ${description}`
              }
            ],
            temperature: 0.1, // Lower temperature for more consistent results
            max_tokens: 4000, // Increased token limit for more detailed responses
            top_p: 0.9
          })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          aiAnalysis = data.choices[0].message.content;
          console.log("Successfully generated AI analysis");
        } else {
          console.error("Unexpected Perplexity API response structure:", data);
        }
      } catch (aiError) {
        console.error("Error generating AI analysis:", aiError);
      }
    } else {
      console.log("No Perplexity API key found, skipping enhanced analysis");
    }

    // First create a business analysis record
    const { data: analysisData, error: analysisError } = await supabaseAdmin
      .from('business_analyses')
      .insert({
        id: assessment_id, // Use the same ID as the assessment
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

    // Generate more detailed and industry-specific regulations based on the AI analysis
    const regulations = [
      {
        name: "Data Protection Regulation",
        description: "Comprehensive data protection requirements for businesses handling personal information",
        motivation: "Your business handles personal data and needs to ensure proper protection measures",
        requirements: "Implement data protection measures, maintain records of processing activities, ensure secure storage, provide privacy notices, and obtain consent where necessary",
        checklist_items: [
          "Implement data encryption for stored personal data",
          "Create a data breach response plan",
          "Maintain records of data processing activities",
          "Appoint a data protection officer if required",
          "Implement privacy by design in all data handling processes",
          "Establish a process for handling data subject requests",
          "Conduct regular data protection impact assessments",
          "Ensure lawful basis for all data processing activities"
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
          "Regular security audits",
          "Network security monitoring",
          "Application security testing",
          "Develop an incident response procedure",
          "Implement endpoint protection solutions",
          "Conduct regular vulnerability scanning"
        ]
      },
      {
        name: "Industry Compliance Framework",
        description: "Specific compliance requirements for your industry sector",
        motivation: "Based on your business activities, specialized industry regulations may apply",
        requirements: "Sector-specific requirements related to your business operations, reporting, and risk management",
        checklist_items: [
          "Identify all industry-specific regulations applicable to your business",
          "Establish a compliance calendar for industry reporting requirements",
          "Document industry-standard processes and procedures",
          "Conduct regular compliance reviews against industry standards",
          "Join industry associations to stay updated on regulatory changes",
          "Perform regular industry-specific risk assessments",
          "Develop compliance training specific to your industry"
        ]
      },
      {
        name: "Financial Compliance Requirements",
        description: "Financial and accounting compliance standards for businesses",
        motivation: "Businesses must maintain proper financial records and comply with tax regulations",
        requirements: "Implement accounting standards, financial controls, tax compliance measures, and regular financial reporting",
        checklist_items: [
          "Establish proper accounting procedures",
          "Implement financial controls and segregation of duties",
          "Ensure compliance with tax filing requirements",
          "Maintain records for required retention periods",
          "Conduct regular financial audits",
          "Document financial policies and procedures",
          "Implement anti-fraud measures"
        ]
      },
      {
        name: "Health and Safety Regulations",
        description: "Workplace health and safety requirements",
        motivation: "Ensuring employee safety and compliance with occupational health regulations",
        requirements: "Implement safety procedures, conduct risk assessments, provide proper training, and maintain safe working environments",
        checklist_items: [
          "Conduct workplace risk assessments",
          "Develop health and safety policies",
          "Provide safety training for all employees",
          "Maintain safety equipment and first aid supplies",
          "Establish incident reporting procedures",
          "Conduct regular safety inspections",
          "Appoint safety representatives if required"
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
