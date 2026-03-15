import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_SEQUENCE_TYPES = ["nurture", "reactivation", "closing", "onboarding"];
const VALID_LANGS = ["fr", "en"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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

    const { lead, sequenceType = "nurture", lang = "fr" } = await req.json();
    const safeType = VALID_SEQUENCE_TYPES.includes(sequenceType) ? sequenceType : "nurture";
    const safeLang = VALID_LANGS.includes(lang) ? lang : "fr";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Service IA indisponible" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const leadContext = lead
      ? `Lead: ${String(lead.first_name || "").slice(0, 50)} ${String(lead.last_name || "").slice(0, 50)}, Score: ${String(lead.score || "N/A").slice(0, 5)}, Stage: ${String(lead.stage || "N/A").slice(0, 20)}, Source: ${String(lead.source || "N/A").slice(0, 20)}`
      : "No lead selected";

    const systemPrompt = safeLang === "fr"
      ? `Tu es un expert en séquences de follow-up immobilier Dubai. Génère une séquence de relance complète et personnalisée.

Contexte lead : ${leadContext}
Type de séquence : ${safeType}

Tu DOIS utiliser la fonction generate_sequence pour retourner le résultat.`
      : `You are a Dubai real estate follow-up sequence expert. Generate a complete, personalized follow-up sequence.

Lead context: ${leadContext}
Sequence type: ${safeType}

You MUST use the generate_sequence function to return the result.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: safeLang === "fr"
            ? `Génère une séquence de follow-up de 5 étapes pour ce lead. Adapte le ton et le contenu au profil.`
            : `Generate a 5-step follow-up sequence for this lead. Adapt tone and content to the profile.`
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_sequence",
              description: "Generate a structured follow-up sequence",
              parameters: {
                type: "object",
                properties: {
                  steps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "number", description: "Day number in sequence" },
                        channel: { type: "string", enum: ["email", "whatsapp", "call", "sms"] },
                        subject: { type: "string", description: "Subject line or message title" },
                        content: { type: "string", description: "Full message content" },
                        objective: { type: "string", description: "Goal of this touchpoint" },
                        tips: { type: "string", description: "Pro tips for this step" },
                      },
                      required: ["day", "channel", "subject", "content", "objective"],
                      additionalProperties: false,
                    },
                  },
                  strategy_summary: { type: "string", description: "Overall strategy explanation" },
                },
                required: ["steps", "strategy_summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_sequence" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", response.status);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const sequence = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(sequence), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Échec de génération" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sequences error:", e);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
