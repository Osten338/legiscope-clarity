
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModelResponse {
  role: string;
  content: string;
}

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getLegalAnalysis(messages: any[], checklistItem: string): Promise<ModelResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are LegalComplianceBuddy, a specialized legal compliance assistant. Focus on providing a detailed legal analysis with citations and requirements.

For the compliance requirement: "${checklistItem}"

Structure your response with:
- Legal Context and Framework
- Core Legal Requirements
- Compliance Steps
- Documentation Requirements
- Legal References and Citations`
        },
        ...messages
      ],
      temperature: 0.2,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices[0].message;
}

async function getPracticalImplementation(messages: any[], checklistItem: string): Promise<ModelResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are ImplementationBuddy, focused on practical implementation steps. Provide concrete, actionable steps and best practices.

For the requirement: "${checklistItem}"

Focus on:
- Step-by-step Implementation Guide
- Tools and Resources Needed
- Timeline and Milestones
- Best Practices and Tips
- Common Pitfalls to Avoid`
        },
        ...messages
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  return data.choices[0].message;
}

async function getRiskAssessment(messages: any[], checklistItem: string): Promise<ModelResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are RiskAnalysisBuddy, specialized in risk assessment and mitigation strategies.

For the requirement: "${checklistItem}"

Focus on:
- Key Risk Factors
- Potential Compliance Gaps
- Risk Mitigation Strategies
- Monitoring and Review Plans
- Risk Management Best Practices`
        },
        ...messages
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  return data.choices[0].message;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = performance.now();

  try {
    const { messages, checklistItem } = await req.json();
    
    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Run all analyses in parallel
    const [legalAnalysis, practicalSteps, riskAnalysis] = await Promise.all([
      getLegalAnalysis(messages, checklistItem),
      getPracticalImplementation(messages, checklistItem),
      getRiskAssessment(messages, checklistItem),
    ]);

    // Combine and structure the responses
    const combinedResponse = `# Comprehensive Compliance Analysis

## Legal Framework and Requirements
${legalAnalysis.content}

## Implementation Guide
${practicalSteps.content}

## Risk Assessment and Mitigation
${riskAnalysis.content}
`;

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    // Store the response data in the database
    const { error: insertError } = await supabaseClient
      .from('ai_responses')
      .insert({
        checklist_item: checklistItem,
        user_query: messages[messages.length - 1].content,
        legal_analysis: legalAnalysis.content,
        practical_implementation: practicalSteps.content,
        risk_assessment: riskAnalysis.content,
        combined_response: combinedResponse,
        user_id: user.id,
        response_time_ms: responseTime,
        model_version: 'v1.0-multi-model'
      });

    if (insertError) {
      console.error('Error storing response:', insertError);
    }

    return new Response(
      JSON.stringify({ 
        reply: combinedResponse,
        metrics: {
          responseTime,
          modelVersion: 'v1.0-multi-model'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
