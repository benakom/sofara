import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check superadmin
    const { data: roleData } = await supabaseClient.rpc("is_superadmin");
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { url, type } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL requise" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Scrape the webpage
    console.log("Scraping URL:", url);
    const pageResp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,fr;q=0.8,ar;q=0.7",
      },
    });

    if (!pageResp.ok) {
      return new Response(JSON.stringify({ error: `Impossible d'accéder à la page (${pageResp.status})` }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = await pageResp.text();
    // Extract text content (strip HTML tags, limit size)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000);

    // Extract image URLs from HTML
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
    const imageUrls = imgMatches
      .map(m => {
        const match = m.match(/src=["']([^"']+)["']/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
      .slice(0, 10);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Service IA indisponible" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let systemPrompt = "";
    let toolDef: any = null;

    if (type === "project") {
      systemPrompt = `Tu es un expert en immobilier Dubai. Analyse le contenu d'une page web de projet immobilier et extrais TOUTES les informations disponibles de manière structurée. Déduis les informations manquantes si possible. Sois exhaustif et précis. Réponds en français pour les descriptions et anglais pour les noms propres.`;
      toolDef = {
        type: "function",
        function: {
          name: "extract_project",
          description: "Extract structured real estate project data from webpage content",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Project name" },
              developer_name: { type: "string", description: "Developer name" },
              area_name: { type: "string", description: "Area/neighborhood name (e.g. Dubai Marina, JVC)" },
              city_name: { type: "string", description: "City name (Dubai, Abu Dhabi, RAK...)" },
              status: { type: "string", enum: ["new_launch", "under_construction", "ready", "sold_out"], description: "Project status" },
              property_type: { type: "string", enum: ["apartment", "villa", "townhouse", "penthouse", "plot", "mixed"], description: "Property type" },
              handover_date: { type: "string", description: "Expected handover date (e.g. Q4 2026)" },
              price_from: { type: "number", description: "Starting price in AED" },
              price_to: { type: "number", description: "Maximum price in AED" },
              bedrooms: { type: "string", description: "Available bedroom configurations (e.g. Studio, 1BR, 2BR, 3BR)" },
              description: { type: "string", description: "Full project description in French, 3-5 sentences" },
              hero_image_url: { type: "string", description: "Main project image URL found on the page" },
              ai_summary: { type: "string", description: "AI-generated executive summary for ambassadors, 2-3 sentences in French" },
              quick_pitch: { type: "string", description: "One-liner sales pitch in French" },
              whatsapp_summary: { type: "string", description: "WhatsApp-ready message summarizing the project in French, with emojis" },
              target_buyer: { type: "string", description: "Ideal buyer profile in French" },
              selling_points: { type: "array", items: { type: "string" }, description: "5-8 key selling points in French" },
              faq: { type: "array", items: { type: "object", properties: { q: { type: "string" }, a: { type: "string" } } }, description: "5-8 FAQ items in French" },
              objection_handling: { type: "array", items: { type: "object", properties: { objection: { type: "string" }, answer: { type: "string" } } }, description: "3-5 common objections and answers in French" },
              social_captions: { type: "array", items: { type: "string" }, description: "3 social media captions in French with emojis" },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      };
    } else if (type === "developer") {
      systemPrompt = `Tu es un expert en immobilier Dubai. Analyse le contenu de la page web d'un promoteur immobilier et extrais toutes les informations pertinentes.`;
      toolDef = {
        type: "function",
        function: {
          name: "extract_developer",
          description: "Extract developer information from webpage",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Developer name" },
              description: { type: "string", description: "Developer description in French, 2-3 sentences" },
              website: { type: "string", description: "Official website URL" },
              logo_url: { type: "string", description: "Logo image URL found on the page" },
              trust_points: { type: "array", items: { type: "string" }, description: "5-8 trust/credibility points in French" },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      };
    } else if (type === "area") {
      systemPrompt = `Tu es un expert en immobilier Dubai. Analyse le contenu d'une page web concernant un quartier/zone et extrais les informations pertinentes pour un guide investisseur.`;
      toolDef = {
        type: "function",
        function: {
          name: "extract_area",
          description: "Extract area/neighborhood information from webpage",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Area/neighborhood name" },
              city_name: { type: "string", description: "City name (Dubai, Abu Dhabi, RAK...)" },
              description: { type: "string", description: "Area description in French, 3-5 sentences" },
              image_url: { type: "string", description: "Area image URL found on page" },
              highlights: { type: "array", items: { type: "string" }, description: "5-8 investment highlights in French" },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      };
    } else {
      return new Response(JSON.stringify({ error: "Type invalide. Utiliser: project, developer, area" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const toolName = toolDef.function.name;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `URL source: ${url}\n\nImages trouvées sur la page:\n${imageUrls.join("\n")}\n\nContenu de la page:\n${textContent}`,
          },
        ],
        tools: [toolDef],
        tool_choice: { type: "function", function: { name: toolName } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", aiResponse.status);
      return new Response(JSON.stringify({ error: "Erreur IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "L'IA n'a pas pu extraire les données" }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const extracted = JSON.parse(toolCall.function.arguments);
    console.log("Extracted data:", JSON.stringify(extracted).slice(0, 500));

    return new Response(JSON.stringify({ success: true, data: extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scrape error:", e);
    return new Response(JSON.stringify({ error: "Erreur interne" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
