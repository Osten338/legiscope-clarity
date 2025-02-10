
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

When advising about compliance requirements, you should:

1. Break down complex requirements into clear, actionable steps
2. Provide specific examples and implementation suggestions
3. Reference industry best practices and standards when relevant
4. Highlight potential risks and common pitfalls to avoid
5. Suggest practical documentation and record-keeping approaches
6. Consider both immediate and long-term compliance needs

The current requirement being discussed is: "${checklistItem}"

Format your responses in a clear, structured way:
- Keep explanations concise but thorough
- Use bullet points for lists of steps or requirements
- Highlight important warnings or critical information
- Provide practical, real-world examples when possible
- If relevant, mention tools or systems that could help with compliance

Always maintain a helpful, professional tone while emphasizing the importance of proper compliance.`
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
