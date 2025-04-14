
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { cosineSimilarity } from "../shared/similarityUtils.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Create a custom fetch function that adds the Supabase service role key
const fetchWithAuth = (url: string, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
    },
  });
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, threshold = 0.5 } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Query must be a non-empty string" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log("Generating embedding for query:", query);
    console.log("Using similarity threshold:", threshold);

    // 1. Generate embedding for the query
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
      const errorText = await embeddingResponse.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Error generating embedding: ${errorText}` 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    const { data } = await embeddingResponse.json();
    const embedding = data[0].embedding;

    console.log("Embedding generated successfully. Querying database...");
    
    // 2. Query the database using the function
    try {
      // Create a Supabase client
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      
      // Count total embeddings for diagnostics
      const { count: totalEmbeddings } = await supabase
        .from('document_embeddings')
        .select('*', { count: 'exact', head: true }) as any;
        
      console.log(`Total embeddings in database: ${totalEmbeddings}`);
      
      // Fetch sample embeddings for manual similarity calculation (for diagnostics)
      const { data: sampleData } = await supabase
        .from('document_embeddings')
        .select('id, content, embedding')
        .limit(5) as any;
      
      // Manual similarity calculation to validate
      let manualMatches = [];
      if (sampleData && sampleData.length > 0) {
        console.log("Computing manual similarity with sample embeddings...");
        
        for (const doc of sampleData) {
          try {
            // Calculate cosine similarity manually
            const similarity = cosineSimilarity(embedding, doc.embedding);
            console.log(`Manual similarity for document "${doc.content.substring(0, 30)}...": ${similarity}`);
            
            if (similarity > threshold) {
              manualMatches.push({
                id: doc.id,
                content: doc.content,
                similarity: similarity
              });
            }
          } catch (err) {
            console.error(`Error calculating manual similarity for document ${doc.id}:`, err);
          }
        }
      }
      
      // Call the RPC function with the user-provided threshold
      const { data: matches, error: matchError } = await supabase.rpc(
        'match_documents',
        {
          query_embedding: embedding,
          match_threshold: threshold,
          match_count: 20
        }
      );

      if (matchError) {
        console.error("Error in match_documents RPC:", matchError);
        
        // Try direct SQL query with LIMIT as a fallback
        console.log("Attempting direct SQL query as fallback...");
        
        const { data: directMatches, error: directError } = await supabase
          .from('document_embeddings')
          .select('id, content, embedding')
          .limit(10);
          
        if (directError) {
          console.error("Direct SQL query failed:", directError);
          throw new Error(`RPC failed: ${matchError.message}, Direct query failed: ${directError.message}`);
        }
        
        console.log(`Direct query returned ${directMatches?.length || 0} embeddings`);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `RPC error: ${matchError.message}`,
            diagnostics: {
              totalEmbeddings,
              directQueryResults: directMatches?.length || 0,
              manualMatches
            }
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      console.log(`Found ${matches ? matches.length : 0} matches`);
      
      if (matches && matches.length === 0 && manualMatches.length > 0) {
        console.log("WARNING: Found manual matches but RPC returned none. There might be an issue with the RPC function.");
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          matches: matches || [],
          manualMatches, // Include manually calculated matches for comparison
          totalEmbeddings
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
      
    } catch (error) {
      console.error("Error in vector search:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Database query error: ${error.message}` 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
