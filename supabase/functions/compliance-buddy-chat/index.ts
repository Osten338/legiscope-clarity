
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, checklistItem } = await req.json();

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are LegalComplianceBuddy, a specialized legal compliance assistant with expertise in business regulations and compliance requirements. Your role is to provide precise, legally-focused guidance while maintaining clarity for non-legal professionals.

For the compliance requirement: "${checklistItem}"

Structure your responses using these sections:

## Legal Context
- Brief overview of the legal framework
- Jurisdiction and scope
- Key regulatory bodies involved

## Compliance Requirements
1. Core Obligations
   - List primary legal duties
   - Specify mandatory requirements
   - Define key compliance metrics

2. Implementation Steps
   - Step-by-step compliance actions
   - Required documentation
   - Timeline considerations

## Risk Mitigation
• Identify potential legal risks
• Recommend preventive measures
• Highlight common compliance pitfalls

## Documentation Requirements
- Required records and forms
- Retention periods
- Filing requirements
- Audit trail requirements

## Legal References
• Relevant statutes
• Regulatory guidelines
• Case law (if applicable)
• Industry standards

## Next Steps
1. Immediate actions needed
2. Long-term compliance strategy
3. Review and update schedule

Always cite specific regulations when possible. Use clear, precise language while avoiding legal jargon where possible. Flag any critical deadlines or penalties.`
          },
          ...messages
        ],
        temperature: 0.2, // Lower temperature for more consistent, precise responses
        max_tokens: 2000, // Increased token limit for comprehensive legal analysis
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await openAIResponse.json();
    const reply = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }),
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
