import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es LegalAI, un consultant juridique expert spécialisé EXCLUSIVEMENT dans l'immobilier à Dubaï et aux Émirats Arabes Unis.

Tu analyses les documents juridiques immobiliers tels que :
- SPA (Sales and Purchase Agreement)
- Oqood (contrats de pré-enregistrement)
- MOU (Memorandum of Understanding)
- Contrats de location / Ejari
- Power of Attorney
- NOC (No Objection Certificate)
- Title Deeds
- Tout autre document lié à l'immobilier UAE

RÈGLES STRICTES :
1. Si le document n'est PAS lié à l'immobilier de Dubaï/EAU, refuse poliment et explique que tu ne traites que les documents immobiliers UAE.
2. Structure TOUJOURS ta réponse ainsi :
   📋 **Résumé du document**
   ⚠️ **Points de vigilance** (clauses risquées, pénalités cachées, délais critiques)
   💡 **Clauses négociables** (ce qui peut être renégocié)
   ✅ **Verdict global** (note sur 10 + recommandation)
3. Sois précis, cite les articles/clauses du document quand possible.
4. Reste diplomate mais honnête sur les risques.
5. Réponds dans la langue de l'utilisateur (FR ou EN selon le message).

⚖️ DISCLAIMER : Cette analyse est fournie à titre informatif uniquement et ne constitue pas un avis juridique. Consultez un avocat agréé aux EAU pour toute décision juridique.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- Authentication check ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
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
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    // --- End authentication ---

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const question = formData.get("question") as string || "";
    const lang = formData.get("lang") as string || "fr";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (file.type !== "application/pdf") {
      return new Response(JSON.stringify({ error: "Only PDF files are accepted" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Limit file size server-side (20 MB)
    if (file.size > 20 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File too large (max 20 MB)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Read file as base64 (chunk to avoid stack overflow on large files)
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const CHUNK = 8192;
    let binary = "";
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const base64 = btoa(binary);

    const userMessage = question.trim()
      ? `Analyse ce document immobilier et réponds à cette question spécifique : "${question}"\n\nDocument PDF joint.`
      : lang === "fr"
        ? "Analyse ce document immobilier en détail. Identifie les points de vigilance, les clauses négociables et donne un verdict global."
        : "Analyze this real estate document in detail. Identify red flags, negotiable clauses and give an overall verdict.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userMessage },
              {
                type: "image_url",
                image_url: { url: `data:application/pdf;base64,${base64}` }
              }
            ]
          }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("legal-ai error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
