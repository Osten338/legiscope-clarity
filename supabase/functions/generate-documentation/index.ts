
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
    const userId = req.headers.get('x-user-id');
    
    console.log("Generating documentation for regulation:", regulation.name);
    console.log("Checklist item:", checklistItem.description);
    console.log("User ID:", userId || "anonymous");

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
    console.log("Generating embeddings for query:", query.substring(0, 100) + "...");
    
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
      console.error("OpenAI API error:", embeddingData.error);
      throw new Error(`OpenAI API error: ${embeddingData.error.message}`);
    }

    const queryEmbedding = embeddingData.data[0].embedding;
    
    // Fetch relevant documents using vector similarity
    console.log("Retrieving relevant documents for documentation generation...");
    
    const similarDocuments = await findSimilarDocumentsFromDb(
      supabaseClient,
      queryEmbedding,
      10,  // Get top 10 relevant documents
      0.01  // Low threshold to ensure we get some results
    );
    
    // Extract context from similar documents
    let relevantContext = "";
    if (similarDocuments && similarDocuments.length > 0) {
      console.log(`Found ${similarDocuments.length} relevant documents`);
      
      // Log similarity scores to help with debugging
      similarDocuments.forEach((doc, index) => {
        console.log(`Document ${index + 1} similarity: ${doc.similarity.toFixed(4)}`);
      });
      
      relevantContext = similarDocuments.map(doc => doc.content).join("\n\n");
    } else {
      console.log("No relevant documents found in the knowledge base");
    }
    
    // Clean and format context for optimal use
    const cleanedContext = cleanContextForChat(relevantContext) || "";
    console.log(`Cleaned context length: ${cleanedContext.length} characters`);

    // EU Legal Method Chain of Thought Prompt
    const chainOfThoughtPrompt = `
You are an EU compliance documentation specialist. Your task is to generate a detailed implementation guide for the following compliance requirement:

REGULATION:
Name: ${regulation.name}
Description: ${regulation.description}

SPECIFIC REQUIREMENT: ${checklistItem.description}

Please follow this structured EU legal method chain of thought in your analysis:

1. INPUT ANALYSIS & BUSINESS CLASSIFICATION:
   - Identify the key aspects of the compliance requirement
   - Determine which industry sectors this applies to
   - Note any special business activities, products/services, or technologies involved

2. MAPPING GENERAL AND SECTOR-SPECIFIC LAWS:
   - Identify the general EU legislation relevant to this requirement
   - Determine any sector-specific regulations that apply
   - Map the requirement to known regulated sectors if applicable

3. LEGAL SOURCE IDENTIFICATION:
   - Identify primary law (treaties, EU Charter provisions) applicable
   - Identify secondary law (regulations, directives, decisions)
   - Reference relevant guidance (guidelines, regulatory communications, standards)
   - Note whether each source is a directly applicable Regulation or a Directive requiring national transposition

4. INTERPRETATION OF LEGAL TEXTS:
   - Perform textual (literal) reading of relevant provisions
   - Apply contextual interpretation considering structure and related provisions
   - Use teleological (purpose-oriented) interpretation to capture the spirit of the rules

5. HIERARCHY AND CONSISTENCY CHECK:
   - Ensure alignment with the hierarchy of norms in EU law
   - Apply lex specialis vs. lex generalis to resolve conflicts/overlaps
   - Prioritize the most directly applicable EU rules

6. APPLICABILITY ASSESSMENT:
   - Determine direct applicability of regulations
   - Evaluate implementation requirements for directives
   - Consider direct effect principles for enforcement strength

7. IDENTIFYING ENFORCEMENT MECHANISMS & OBLIGATIONS:
   - Extract specific compliance obligations:
     * Reporting and notification duties
     * Technical or security requirements
     * Operational procedures and policies
   - Identify relevant enforcement mechanisms and oversight bodies
   - Reference EU official guidance documents or standards

8. STRUCTURED IMPLEMENTATION GUIDE OUTPUT:
   Organize the implementation guide into these sections:
   - Executive Summary: Brief overview of the requirement and its importance
   - Legal Background: Summary of applicable EU legal framework
   - Implementation Plan: Step-by-step implementation guidance
   - Technical Requirements: Specific technical measures needed
   - Operational Procedures: Internal processes and policies required
   - Documentation Requirements: Records and evidence to maintain
   - Timeline and Resources: Estimated timeline and resources needed
   - Verification and Testing: How to verify compliance
   - Common Challenges and Solutions: Typical implementation challenges and how to address them

${cleanedContext ? `\nRELEVANT KNOWLEDGE (Use this to inform your response):\n${cleanedContext}\n` : ""}

Based on your EU legal method analysis, provide a comprehensive implementation guide that is practical, actionable, and aligned with EU legal requirements.`;

    console.log("Sending request to Perplexity API for documentation generation");
    console.log("Using model: llama-3.1-sonar-small-128k-online with large context window");
    
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
            content: 'You are an EU compliance documentation expert that helps organizations implement regulatory requirements effectively. You follow a structured EU legal method in your analysis and provide detailed, practical implementation guidance.' 
          },
          { 
            role: 'user', 
            content: chainOfThoughtPrompt 
          }
        ],
        temperature: 0.2,
        max_tokens: 10000,  // Increased token limit for more comprehensive documentation
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", errorText);
      throw new Error(`Perplexity API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("Received response from Perplexity API");
    
    if (data.error) {
      throw new Error(`Perplexity API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    
    const generatedDocumentation = data.choices[0].message.content;
    console.log("Documentation generated successfully, length:", generatedDocumentation.length);

    // Store the generated documentation for future reference
    try {
      if (userId) {
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
            user_id: userId,
            status: 'generated'
          })
        });
        console.log("Stored generated documentation in database");
      } else {
        console.log("No user ID provided, skipping documentation storage");
      }
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
