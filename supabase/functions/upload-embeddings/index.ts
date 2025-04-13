
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

// Validates embedding format
function isValidEmbedding(item: any): boolean {
  if (!item || typeof item !== 'object') return false;
  
  // Must have content and embedding fields
  if (!item.content || !Array.isArray(item.embedding)) return false;
  
  // Content must be a string
  if (typeof item.content !== 'string') return false;
  
  // Embedding must be an array of numbers
  return item.embedding.every((num: any) => typeof num === 'number');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { embeddings } = await req.json();
    
    if (!Array.isArray(embeddings)) {
      return new Response(
        JSON.stringify({ error: "Embeddings must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate and prepare embeddings
    const validEmbeddings = [];
    const invalidEmbeddings = [];

    for (const item of embeddings) {
      if (isValidEmbedding(item)) {
        validEmbeddings.push({
          content: item.content,
          embedding: item.embedding,
          metadata: item.metadata || {},
        });
      } else {
        invalidEmbeddings.push(item);
      }
    }
    
    let uploaded = 0;
    
    // Insert valid embeddings into the database
    if (validEmbeddings.length > 0) {
      const { data, error } = await supabase
        .from('document_embeddings')
        .insert(validEmbeddings);
      
      if (error) {
        console.error("Error inserting embeddings:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      uploaded = validEmbeddings.length;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        uploaded,
        failed: invalidEmbeddings.length,
        totalProcessed: embeddings.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing embeddings upload:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
