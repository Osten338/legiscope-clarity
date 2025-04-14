
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
    const { query, threshold = 0.05 } = await req.json();
    
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
    console.log(`Embedding is an array: ${Array.isArray(embedding)}, Length: ${embedding.length}`);
    
    // 2. Query the database using the function
    try {
      // Create a Supabase client
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      
      // Count total embeddings for diagnostics
      const { count: totalEmbeddings } = await supabase
        .from('document_embeddings')
        .select('*', { count: 'exact', head: true }) as any;
        
      console.log(`Total embeddings in database: ${totalEmbeddings}`);
      
      if (totalEmbeddings === 0) {
        console.log("No embeddings found in the database!");
        return new Response(
          JSON.stringify({ 
            success: true, 
            matches: [],
            manualMatches: [],
            totalEmbeddings: 0,
            message: "No embeddings found in database"
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Fetch sample embeddings for manual similarity calculation (for diagnostics)
      console.log("Fetching sample embeddings for diagnostics...");
      const { data: sampleData, error: sampleError } = await supabase
        .from('document_embeddings')
        .select('id, content, embedding')
        .limit(20) as any;
      
      if (sampleError) {
        console.error("Error fetching sample embeddings:", sampleError);
      } else if (!sampleData || sampleData.length === 0) {
        console.log("No sample data returned despite count being > 0");
      } else {
        // Log the format of the first embedding to check structure
        const firstEmbedding = sampleData[0].embedding;
        console.log(`First embedding sample format: ${typeof firstEmbedding}`);
        console.log(`First embedding is null or undefined: ${firstEmbedding === null || firstEmbedding === undefined}`);
        
        try {
          if (typeof firstEmbedding === 'object') {
            console.log("First few dimensions:", Object.values(firstEmbedding).slice(0, 5));
          } else if (Array.isArray(firstEmbedding)) {
            console.log("First few dimensions:", firstEmbedding.slice(0, 5));
          } else if (typeof firstEmbedding === 'string') {
            console.log("First few characters:", firstEmbedding.substring(0, 50));
          }
        } catch (err) {
          console.error("Error parsing embedding:", err);
        }
      }
      
      // Manual similarity calculation to validate
      let manualMatches = [];
      if (sampleData && sampleData.length > 0) {
        console.log("Computing manual similarity with sample embeddings...");
        
        for (const doc of sampleData) {
          try {
            // Check if embedding is available
            if (!doc.embedding) {
              console.log(`Document ${doc.id} has no embedding`);
              continue;
            }
            
            // Calculate cosine similarity manually
            const similarity = cosineSimilarity(embedding, doc.embedding);
            
            const shortContent = doc.content?.substring(0, 30) + "...";
            console.log(`Manual similarity for "${shortContent}": ${similarity}`);
            
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
        
        // Sort manual matches by similarity
        manualMatches.sort((a, b) => b.similarity - a.similarity);
      }
      
      console.log(`Found ${manualMatches.length} manual matches`);
      console.log("Now calling the RPC function with threshold:", threshold);
      
      // Call the RPC function with the user-provided threshold
      const { data: matches, error: matchError } = await supabase.rpc(
        'match_documents',
        {
          query_embedding: embedding,
          match_threshold: threshold,
          match_count: 50
        }
      );

      if (matchError) {
        console.error("Error in match_documents RPC:", matchError);
        
        // Use manual matches if RPC fails
        if (manualMatches.length > 0) {
          console.log("Using manual matches as fallback");
          return new Response(
            JSON.stringify({ 
              success: true,
              matches: manualMatches,
              manualMatches: [],
              totalEmbeddings,
              note: "Used manual calculation due to RPC error"
            }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
        
        // Attempt direct query as a fallback
        console.log("Attempting direct calculation as primary method failed...");
        
        const { data: allEmbeddings, error: directError } = await supabase
          .from('document_embeddings')
          .select('id, content, embedding')
          .limit(50);
          
        if (directError) {
          console.error("Direct embeddings query failed:", directError);
        } else if (allEmbeddings) {
          const directResults = [];
          for (const doc of allEmbeddings) {
            try {
              if (doc.embedding) {
                const similarity = cosineSimilarity(embedding, doc.embedding);
                if (similarity > threshold) {
                  directResults.push({
                    id: doc.id,
                    content: doc.content,
                    similarity
                  });
                }
              }
            } catch (err) {
              console.error(`Error processing doc ${doc.id}:`, err);
            }
          }
          
          directResults.sort((a, b) => b.similarity - a.similarity);
          
          return new Response(
            JSON.stringify({ 
              success: true,
              matches: directResults,
              manualMatches: [],
              totalEmbeddings,
              note: "Used direct calculation due to RPC error"
            }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `RPC error: ${matchError.message}`,
            diagnostics: {
              totalEmbeddings,
              manualMatches
            }
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      console.log(`Found ${matches ? matches.length : 0} matches via RPC`);
      console.log(`Found ${manualMatches.length} matches via manual calculation`);
      
      if (matches && matches.length === 0 && manualMatches.length > 0) {
        console.log("WARNING: Found manual matches but RPC returned none. There might be an issue with the RPC function.");
        
        // If RPC returned no matches but we found manual matches, return those instead
        return new Response(
          JSON.stringify({ 
            success: true, 
            matches: manualMatches,
            manualMatches: [],
            totalEmbeddings,
            note: "Using manual matches as RPC found none"
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          matches: matches || [],
          manualMatches, 
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
