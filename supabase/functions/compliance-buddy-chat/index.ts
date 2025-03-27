
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, checklistItem } = await req.json()

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured')
    }

    const prompt = `As a compliance expert, analyze this requirement: "${checklistItem}"
    
    Consider the user's message: "${messages[messages.length - 1].content}"
    
    Provide a comprehensive response with these three sections:
    1. Legal Analysis: Analyze the legal implications and requirements
    2. Practical Implementation: Provide step-by-step guidance for implementation
    3. Risk Assessment: Identify potential risks and mitigation strategies
    
    Format your response in a clear, organized way with sections.`

    console.log("Sending request to Perplexity API")
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a compliance expert assistant helping users understand and implement compliance requirements.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    })

    const data = await response.json()
    console.log("Received response from Perplexity API")
    
    if (data.error) {
      throw new Error(`Perplexity API error: ${data.error.message || JSON.stringify(data.error)}`)
    }
    
    const fullResponse = data.choices[0].message.content

    // Parse the response into sections
    const sections = {
      legalAnalysis: "",
      practicalSteps: "",
      riskAssessment: "",
      reply: fullResponse
    }

    // Extract sections (basic parsing)
    if (fullResponse.includes("Legal Analysis:")) {
      const start = fullResponse.indexOf("Legal Analysis:") + "Legal Analysis:".length
      const end = fullResponse.indexOf("Practical Implementation:") || fullResponse.length
      sections.legalAnalysis = fullResponse.slice(start, end).trim()
    }

    if (fullResponse.includes("Practical Implementation:")) {
      const start = fullResponse.indexOf("Practical Implementation:") + "Practical Implementation:".length
      const end = fullResponse.indexOf("Risk Assessment:") || fullResponse.length
      sections.practicalSteps = fullResponse.slice(start, end).trim()
    }

    if (fullResponse.includes("Risk Assessment:")) {
      const start = fullResponse.indexOf("Risk Assessment:") + "Risk Assessment:".length
      sections.riskAssessment = fullResponse.slice(start).trim()
    }

    return new Response(JSON.stringify(sections), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in compliance-buddy-chat function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
