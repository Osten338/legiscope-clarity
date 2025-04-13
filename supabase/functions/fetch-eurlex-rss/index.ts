
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Updated EUR-Lex RSS feed URL - this is the correctly working URL for EU legislation
    const rssUrl = "https://eur-lex.europa.eu/rss/new_celex_feed.xml";
    
    console.log("Fetching EUR-Lex RSS feed from updated URL...");
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log("Parsing RSS XML content...");
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    if (!xmlDoc) {
      throw new Error("Failed to parse XML document");
    }
    
    const items = xmlDoc.querySelectorAll("item");
    const entries = Array.from(items).map((item) => {
      return {
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
        celex: item.querySelector("eurlex\\:celexNumber")?.textContent || 
              item.querySelector("celexNumber")?.textContent || "",
      };
    });
    
    console.log(`Parsed ${entries.length} RSS entries`);
    
    return new Response(JSON.stringify({ entries }), { 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      } 
    });
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch or parse RSS feed", 
      details: error.message 
    }), { 
      status: 500,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      } 
    });
  }
});
