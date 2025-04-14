
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { findSimilarDocumentsFromDb } from "../shared/similarityUtils.ts";
import { cleanContextForChat } from "../shared/contextUtils.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { regulation, checklistItem } = await req.json();

    // Create a client with the service role key for RAG operations
    const supabaseClient = {
      async rpc(functionName: string, params: any) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify(params)
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error in RPC call: ${error}`);
          }

          return { data: await response.json(), error: null };
        } catch (error) {
          console.error("RPC error:", error);
          return { data: null, error };
        }
      }
    };

    // Generate embeddings for the query
    const query = `${regulation.name} ${regulation.description} ${checklistItem.description}`;
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    });

    const embeddingData = await embeddingResponse.json();
    if (embeddingData.error) {
      throw new Error(`OpenAI API error: ${embeddingData.error.message}`);
    }

    const queryEmbedding = embeddingData.data[0].embedding;
    
    // Fetch relevant documents using vector similarity
    console.log("Retrieving relevant documents for documentation generation...");
    
    const similarDocuments = await findSimilarDocumentsFromDb(
      supabaseClient,
      queryEmbedding,
      5,  // Get top 5 relevant documents
      0.05  // Low threshold to ensure we get some results
    );
    
    // Extract context from similar documents
    let relevantContext = "";
    if (similarDocuments && similarDocuments.length > 0) {
      console.log(`Found ${similarDocuments.length} relevant documents`);
      relevantContext = similarDocuments.map(doc => doc.content).join("\n\n");
    } else {
      console.log("No relevant documents found in the knowledge base");
    }
    
    // Clean and format context for optimal use
    const cleanedContext = cleanContextForChat(relevantContext) || "";

    const prompt = `Please generate comprehensive documentation for implementing the following compliance requirement:

Regulation: ${regulation.name}
Regulation Description: ${regulation.description}

Specific Requirement: ${checklistItem.description}

${cleanedContext ? `\nRelevant Knowledge:\n${cleanedContext}\n` : ""}

Please provide:
1. A detailed implementation plan
2. Key considerations and potential challenges
3. Best practices and guidelines
4. Required resources and estimated timeline
5. Success criteria and verification methods`;

    console.log("Sending request to Perplexity API for documentation generation");
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',  // Using 128k context window model
        messages: [
          { 
            role: 'system', 
            content: 'You are a compliance documentation expert that helps organizations implement regulatory requirements effectively. Provide detailed, actionable guidance based on both general best practices and the specific context provided.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,  // Increased token limit for more comprehensive documentation
        top_p: 0.9,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    console.log("Received response from Perplexity API");
    
    if (data.error) {
      throw new Error(`Perplexity API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    
    const generatedDocumentation = data.choices[0].message.content;

    // Store the generated documentation for future reference
    try {
      await fetch(`${supabaseUrl}/rest/v1/generated_documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          title: `Implementation Guide: ${checklistItem.description.substring(0, 100)}...`,
          content: generatedDocumentation,
          regulation_id: regulation.id,
          user_id: req.headers.get('x-user-id') || 'system',
          status: 'generated'
        })
      });
      console.log("Stored generated documentation in database");
    } catch (storeError) {
      console.error("Error storing documentation:", storeError);
      // Continue even if storage fails - don't block the response
    }

    return new Response(JSON.stringify({ documentation: generatedDocumentation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating documentation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
