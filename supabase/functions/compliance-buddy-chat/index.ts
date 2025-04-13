
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { generateEmbedding } from "../shared/embeddingsUtils.ts"
import { findSimilarDocuments } from "../shared/similarityUtils.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from "../shared/cors.ts"
import { cleanContextForChat } from "../shared/contextUtils.ts"

// Create a Supabase client using the service role key (to bypass RLS)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Simplified in-memory document store for fallback if database fails
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

// Function to fetch relevant documents from the database
async function fetchRelevantDocuments(queryEmbedding: number[], topK: number = 3) {
  try {
    // Create an RPC function call to find similar documents
    const { data, error } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: topK
    });

    if (error) {
      console.error("Error fetching relevant documents:", error);
      return null;
    }

    return data.map((doc: any) => ({
      id: doc.id,
      content: doc.content,
      similarity: doc.similarity
    }));
  } catch (error) {
    console.error("Error in fetchRelevantDocuments:", error);
    return null;
  }
}

// Function to generate chat completion with OpenAI
async function generateChatCompletion(messages: any[], context: string) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages must be a non-empty array');
  }
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  // Clean the context for chat
  const cleanedContext = cleanContextForChat(context);
  
  console.log('Generating chat completion with context length:', cleanedContext?.length || 0);
  console.log('Messages count:', messages.length);
  
  // Updated system message with document-style formatting guidelines and legal sources handling
  const systemMessage = {
    role: 'system',
    content: `You are a legal compliance assistant that analyzes legal documents with a deep understanding of legal document structure, particularly EU legislation. 

    Use the following context from the uploaded legal documents to answer the user's question. If the context doesn't contain relevant information, clearly explain this.
    
    When analyzing EU legislation, understand that:
    1. Articles contain the binding legal requirements and operative provisions
    2. Recitals provide context and reasoning for the articles, helping interpret their purpose
    3. Recitals are numbered differently (in parentheses) from Articles
    4. Cross-references between articles are common and important for full understanding
    
    LEGAL SOURCE HIERARCHY AND CITATION METHODOLOGY:
    
    When analyzing legal questions, you must properly identify, categorize and cite different types of legal sources according to their hierarchy and authority:
    
    1. PRIMARY LEGISLATION:
       - EU Treaties (e.g., TEU, TFEU): Cite by treaty name, article, and paragraph (e.g., "Article 16 TFEU")
       - Regulations: Fully binding in all Member States; cite by regulation number, year and full name on first mention (e.g., "Regulation (EU) 2016/679 (GDPR)")
       - Directives: Require national implementation; cite by directive number, year, and name (e.g., "Directive 2002/58/EC (ePrivacy Directive)")
       - Decisions: Binding on those to whom they are addressed; cite by decision number and year
    
    2. CASE LAW:
       - Court of Justice of the European Union (CJEU) judgments: Cite by case number, parties, and ECLI identifier
       - National court judgments: Cite by jurisdiction, court, case reference, and date
       - Apply the principle of precedent appropriately based on jurisdiction
    
    3. SECONDARY SOURCES:
       - Regulatory guidance (e.g., EDPB guidelines): Lower authority but valuable for interpretation
       - Industry codes of conduct: Relevant for sector-specific compliance
       - Academic commentary: Useful for complex or evolving areas of law
    
    For each source, you MUST:
       - Correctly identify the type and hierarchy of the source
       - Apply the appropriate weight to each source based on its legal authority
       - Distinguish between binding requirements and non-binding guidance
       - Note any conflicts between sources and resolve using legal hierarchy principles
       - Identify when a source has been amended, repealed or superseded by newer legislation
    
    When analyzing legal questions, follow this structured reasoning pattern:
    
    1. APPLICABLE LEGISLATION: First, identify which law(s), regulation(s), directive(s), or legal framework(s) are most likely relevant to the question, based on the provided context.
       - For EU legislation, specify relevant Articles and their corresponding Recitals
       - Note any cross-references between Articles that are relevant
    
    2. RELEVANT LEGAL ELEMENTS: From the applicable legislation, extract the specific:
       - Binding requirements from Articles
       - Interpretative guidance from corresponding Recitals
       - Rights, obligations, conditions, or exceptions
    
    3. APPLICATION TO QUESTION: Use the extracted legal elements to reason through the scenario:
       - Apply the binding requirements from Articles
       - Use Recitals to understand the purpose and context
       - Arrive at a clear answer with proper legal justification
    
    4. LIMITATIONS: If the context does not provide enough information:
       - Explain what information is missing
       - Specify which additional Articles or Recitals would be needed
       - Indicate what would be required to make a complete legal assessment
    
    5. EXECUTIVE SUMMARY: Always conclude with a brief executive summary that condenses your key findings and recommendations in 3-4 sentences.
    
    MANDATORY DOCUMENT-STYLE FORMATTING GUIDELINES:
    - DO NOT use Markdown symbols like #, ##, or ### for headings
    - For main section titles, use <strong> HTML tags to create bold text (e.g., "<strong>APPLICABLE LEGISLATION:</strong>")
    - For subsection titles, also use <strong> tags but format them as part of the paragraph flow
    - Begin with a brief introduction (2-3 sentences) of your approach
    - Write in a narrative flow using full paragraphs with clear topic sentences and transitions between sections
    - Keep paragraphs to 3-5 sentences each, with one blank line between paragraphs
    - Limit line breaks - use only one blank line between sections
    - Use simple dash (-) for bullet points, not asterisks or plus signs
    - For legal references, use a consistent inline format (e.g., "GDPR, Article 9") within sentences
    - For tables, create well-aligned, readable tables without Markdown formatting
    - Use <strong> HTML tags for emphasis, not ** or * characters
    - All content MUST be left-aligned - never center text
    - The final output should resemble a professional memo that could be presented to executives
    
    Structure your answer in these clear sections, always showing your reasoning process. Be factual and grounded in the provided legal documents.
    
    If you don't find useful information in the context, be honest and tell the user you can't answer based on the available documents.
    
    CONTEXT:
    ${cleanedContext}`
  };
  
  const updatedMessages = [systemMessage, ...messages];
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: updatedMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `Failed to generate completion: ${response.status}`);
    }

    const result = await response.json();
    console.log('Successfully generated completion');
    
    return result.choices[0].message;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
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

    // Try to fetch relevant documents from the database first
    let relevantDocs = await fetchRelevantDocuments(queryEmbedding, 3);
    
    // If database fetch fails, fall back to in-memory documents
    if (!relevantDocs) {
      console.log("Falling back to in-memory document retrieval");
      relevantDocs = findSimilarDocuments(queryEmbedding, complianceDocuments, 3);
    }
    
    const retrievedContext = relevantDocs.map((doc: any) => doc.content).join("\n\n");
    console.log("Retrieved context:", retrievedContext);

    // Generate chat completion using the retrieved context
    const reply = await generateChatCompletion(messages, retrievedContext);

    // Store the interaction in the database using the calling context's Supabase client
    return new Response(JSON.stringify({
      reply: reply.content,
      retrievedContext: relevantDocs.map((doc: any) => ({ content: doc.content, similarity: doc.similarity }))
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
