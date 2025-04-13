
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
    // Try a more reliable URL for EUR-Lex legislation feed
    const rssUrl = "https://eur-lex.europa.eu/oj/direct-access.html?rss=true";
    
    console.log(`Fetching EUR-Lex legislation from ${rssUrl}...`);
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
    
    // If no items found, try to get any content available
    if (!items || items.length === 0) {
      console.log("No RSS items found, returning HTML content with fallback structure");
      
      // Create a fallback structure with the HTML content
      return new Response(JSON.stringify({ 
        entries: [{
          title: "EUR-Lex Latest Updates",
          link: rssUrl,
          description: "The EUR-Lex feed format has changed. Please visit the EUR-Lex website for the latest updates.",
          pubDate: new Date().toUTCString(),
          celex: ""
        }]
      }), { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      });
    }
    
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
    
    // Return a fallback response with mock data instead of an error
    // This ensures the UI always has something to display
    return new Response(JSON.stringify({ 
      entries: [
        {
          title: "EU Legislation Update Service",
          link: "https://eur-lex.europa.eu/homepage.html",
          description: "We're currently experiencing difficulties connecting to the EUR-Lex feed. Please check back later or visit EUR-Lex directly for the latest legislation updates.",
          pubDate: new Date().toUTCString(),
          celex: ""
        }
      ],
      status: "fallback"
    }), { 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      } 
    });
  }
});
