
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cleanContextForChat } from "../shared/contextUtils.ts";
import { corsHeaders } from "../shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const systemMessage = {
  role: 'system',
  content: `You are a legal compliance assistant that analyzes legal documents with a deep understanding of legal document structure, particularly EU legislation. 

Use the following context from the uploaded legal documents to answer the user's question. If the context doesn't contain relevant information, clearly explain this.

When analyzing EU legislation, understand that:
1. Articles contain the binding legal requirements and operative provisions
2. Recitals provide context and reasoning for the articles, helping interpret their purpose
3. Recitals are numbered differently (in parentheses) from Articles
4. Cross-references between articles are common and important for full understanding

**LEGAL SOURCE HIERARCHY AND CITATION METHODOLOGY:**

When analyzing legal questions, you must properly identify, categorize and cite different types of legal sources according to their hierarchy and authority:

**1. PRIMARY LEGISLATION:**
- EU Treaties (e.g., TEU, TFEU): Cite by treaty name, article, and paragraph (e.g., "Article 16 TFEU")
- Regulations: Fully binding in all Member States; cite by regulation number, year and full name on first mention (e.g., "Regulation (EU) 2016/679 (GDPR)")
- Directives: Require national implementation; cite by directive number, year, and name (e.g., "Directive 2002/58/EC (ePrivacy Directive)")
- Decisions: Binding on those to whom they are addressed; cite by decision number and year

**2. CASE LAW:**
- Court of Justice of the European Union (CJEU) judgments: Cite by case number, parties, and ECLI identifier
- National court judgments: Cite by jurisdiction, court, case reference, and date
- Apply the principle of precedent appropriately based on jurisdiction

**3. SECONDARY SOURCES:**
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

**1. APPLICABLE LEGISLATION:** First, identify which law(s), regulation(s), directive(s), or legal framework(s) are most likely relevant to the question, based on the provided context.
- For EU legislation, specify relevant Articles and their corresponding Recitals
- Note any cross-references between Articles that are relevant

**2. RELEVANT LEGAL ELEMENTS:** From the applicable legislation, extract the specific:
- Binding requirements from Articles
- Interpretative guidance from corresponding Recitals
- Rights, obligations, conditions, or exceptions

**3. APPLICATION TO QUESTION:** Use the extracted legal elements to reason through the scenario:
- Apply the binding requirements from Articles
- Use Recitals to understand the purpose and context
- Arrive at a clear answer with proper legal justification

**4. LIMITATIONS:** If the context does not provide enough information:
- Explain what information is missing
- Specify which additional Articles or Recitals would be needed
- Indicate what would be required to make a complete legal assessment

**5. EXECUTIVE SUMMARY:** Always conclude with a brief executive summary that condenses your key findings and recommendations in 3-4 sentences.

MANDATORY FORMATTING GUIDELINES:
- Use two line breaks before section headings and one line break after
- Use bold (**) for section headings, not HTML tags
- Begin with a brief introduction (2-3 sentences) of your approach
- Write in a narrative flow using full paragraphs with clear topic sentences
- Keep paragraphs to 3-5 sentences each, with one blank line between paragraphs
- Use simple dash (-) for bullet points, not asterisks or plus signs
- For legal references, use a consistent inline format (e.g., "GDPR, Article 9") within sentences
- All content MUST be left-aligned - never center text
- Do NOT use any HTML tags or special formatting
- The final output should resemble a professional memo that could be presented to executives

Structure your answer in these clear sections, always showing your reasoning process. Be factual and grounded in the provided legal documents.

If you don't find useful information in the context, be honest and tell the user you can't answer based on the available documents.

CONTEXT:
{context}`
};

// Create a custom fetch function that adds the Supabase service role key
const fetchWithAuth = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
    },
  });
};

// Function to query document embeddings from Supabase
async function queryDocumentEmbeddings(query) {
  try {
    // Generate embedding for user query
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      console.error("Error generating embeddings:", await embeddingResponse.text());
      throw new Error("Failed to generate embeddings");
    }

    const { data } = await embeddingResponse.json();
    const embedding = data[0].embedding;

    // Query Supabase for similar documents
    const rpcUrl = `${SUPABASE_URL}/rest/v1/rpc/match_documents`;
    const rpcResponse = await fetchWithAuth(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
      }),
    });

    if (!rpcResponse.ok) {
      console.error("Error matching documents:", await rpcResponse.text());
      throw new Error("Failed to match documents");
    }

    const matches = await rpcResponse.json();
    return matches;
  } catch (error) {
    console.error("Error querying document embeddings:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, checklistItem } = await req.json();

    // Get the latest user message
    const latestUserMessage = messages.filter(msg => msg.role === "user").pop();
    
    // Query for relevant document embeddings
    const relevantDocuments = await queryDocumentEmbeddings(
      `${checklistItem} ${latestUserMessage.content}`
    );

    // Extract context from relevant documents
    const context = relevantDocuments.map(doc => doc.content).join("\n\n");
    
    // Clean the context
    const cleanedContext = cleanContextForChat(context);

    // Update the system message with the retrieved context
    const systemMessageWithContext = {
      ...systemMessage,
      content: systemMessage.content.replace("{context}", cleanedContext || "No relevant context found.")
    };

    // Prepare the messages array for OpenAI
    const openaiMessages = [
      systemMessageWithContext,
      ...messages
    ];

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      console.error("Error from OpenAI API:", await openaiResponse.text());
      throw new Error("Failed to generate response from OpenAI");
    }

    const result = await openaiResponse.json();
    const reply = result.choices[0].message.content;

    return new Response(
      JSON.stringify({
        reply,
        retrievedContext: relevantDocuments.map(doc => ({
          content: doc.content,
          similarity: doc.similarity
        }))
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in compliance-buddy-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
