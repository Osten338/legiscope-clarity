
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { generateEmbedding } from "../shared/embeddingsUtils.ts"
import { findSimilarDocuments } from "../shared/similarityUtils.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simplified in-memory document store for demonstration
// In a real implementation, this would be stored in Supabase
const complianceDocuments = [
  {
    id: "doc1",
    content: "Companies must implement proper data security measures to protect personal information. This includes encryption, access controls, and regular security audits.",
    embedding: [] as number[] // Will be populated at runtime
  },
  {
    id: "doc2",
    content: "Organizations handling customer data must provide clear privacy policies explaining how data is collected, used, and shared. Users must have options to access and delete their data.",
    embedding: [] as number[] // Will be populated at runtime
  },
  {
    id: "doc3",
    content: "Businesses must report security breaches affecting personal data within 72 hours of discovery. The report must include the nature of the breach and mitigation measures.",
    embedding: [] as number[] // Will be populated at runtime
  },
  {
    id: "doc4",
    content: "Companies that process large amounts of sensitive data must appoint a Data Protection Officer (DPO) responsible for overseeing compliance with data protection regulations.",
    embedding: [] as number[] // Will be populated at runtime
  }
];

let documentsInitialized = false;

// Initialize document embeddings
async function initializeDocumentEmbeddings(apiKey: string) {
  if (documentsInitialized) return;
  
  try {
    console.log("Initializing document embeddings...");
    for (const doc of complianceDocuments) {
      doc.embedding = await generateEmbedding(doc.content, apiKey);
    }
    documentsInitialized = true;
    console.log("Document embeddings initialized successfully");
  } catch (error) {
    console.error("Failed to initialize document embeddings:", error);
    // Continue execution even if embedding initialization fails
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, checklistItem } = await req.json();
    const userQuery = messages[messages.length - 1].content;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize document embeddings if not already done
    await initializeDocumentEmbeddings(openaiApiKey);

    // Generate embedding for the user query
    console.log("Generating embedding for user query");
    const queryEmbedding = await generateEmbedding(userQuery, openaiApiKey);

    // Find relevant documents
    console.log("Finding relevant documents");
    const relevantDocs = findSimilarDocuments(queryEmbedding, complianceDocuments, 2);
    
    const retrievedContext = relevantDocs.map(doc => doc.content).join("\n\n");
    console.log("Retrieved context:", retrievedContext);

    // Construct chain of thought prompt with RAG context
    const prompt = `As a compliance expert, analyze this requirement: "${checklistItem}"
    
    Consider the user's question: "${userQuery}"
    
    Here is relevant context from our compliance knowledge base:
    ${retrievedContext}
    
    Using the context above and your expertise, provide a comprehensive response with these three sections:
    
    1. Legal Analysis: 
       - Start by analyzing the legal implications
       - Consider relevant regulations and precedents
       - Explain how the requirement applies to the user's question
    
    2. Practical Implementation: 
       - Provide step-by-step guidance
       - Include specific actions with timelines
       - Consider resource requirements and constraints
    
    3. Risk Assessment: 
       - Identify potential compliance risks
       - Rate risks by likelihood and impact
       - Suggest specific mitigation strategies
    
    Format your response in a clear, organized way with sections. Explain your reasoning at each step.`;

    console.log("Sending request to OpenAI");
    
    // Call OpenAI API instead of Perplexity
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a compliance expert assistant specializing in legal analysis and practical guidance. You analyze requirements thoroughly and provide detailed, structured responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    console.log("Received response from OpenAI");
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    
    const fullResponse = data.choices[0].message.content;

    // Parse the response into sections
    const sections = {
      legalAnalysis: "",
      practicalSteps: "",
      riskAssessment: "",
      reply: fullResponse
    };

    // Extract sections (basic parsing)
    if (fullResponse.includes("Legal Analysis:")) {
      const start = fullResponse.indexOf("Legal Analysis:") + "Legal Analysis:".length;
      const end = fullResponse.indexOf("Practical Implementation:") || fullResponse.length;
      sections.legalAnalysis = fullResponse.slice(start, end).trim();
    }

    if (fullResponse.includes("Practical Implementation:")) {
      const start = fullResponse.indexOf("Practical Implementation:") + "Practical Implementation:".length;
      const end = fullResponse.indexOf("Risk Assessment:") || fullResponse.length;
      sections.practicalSteps = fullResponse.slice(start, end).trim();
    }

    if (fullResponse.includes("Risk Assessment:")) {
      const start = fullResponse.indexOf("Risk Assessment:") + "Risk Assessment:".length;
      sections.riskAssessment = fullResponse.slice(start).trim();
    }

    // Store the interaction in the database using the calling context's Supabase client
    return new Response(JSON.stringify({
      ...sections,
      retrievedContext: relevantDocs.map(doc => ({ content: doc.content, similarity: doc.similarity }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in compliance-buddy-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
