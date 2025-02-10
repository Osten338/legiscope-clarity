
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are ComplianceBuddy, a specialized compliance assistant with expertise in business regulations and compliance requirements. Your role is to help users understand and implement compliance requirements effectively and practically.

For the requirement: "${checklistItem}"

Structure your responses using these clear sections:

## Summary
Provide a brief overview of the requirement and its importance (2-3 sentences)

## Key Steps
1. List the main steps needed for compliance
2. Make each step clear and actionable

## Implementation Details
- Break down complex steps into specific actions
- Include practical examples
- Suggest relevant tools or systems when applicable

## Common Pitfalls
• List potential risks and mistakes to avoid
• Include preventive measures

## Documentation Requirements
- Specify what records need to be kept
- Outline documentation best practices
- Mention retention periods if applicable

## Additional Resources
• Reference relevant standards or guidelines
• Suggest helpful tools or templates
• Link to official documentation when available

Use bullet points and numbering for clarity. Keep explanations concise but thorough. Highlight critical warnings in a clear way.`
          },
          ...messages
        ],
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
