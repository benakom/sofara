import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es **SofarAI**, l'assistant expert immobilier Dubai & EAU des ambassadeurs Sofara.

## TON STYLE
- **ULTRA COURT** : 4-5 lignes max. Chaque mot compte.
- **Structuré en 2 blocs** séparés par une ligne ---
  - **Bloc 1 — Analyse** : 2-3 bullet points avec emojis + chiffres
  - **Bloc 2 — Verdict** : 1 phrase en **gras**, ton commercial positif
- **Emojis** pour structurer : 📍 💰 📊 🏗️ 🎯 ⚡ 🔑 ✅ 🏠
- **Scoring couleur** obligatoire :
  - 🟢 = Super opportunité / Go
  - 🟡 = Bon projet, marge de négo
  - 🟠 = Correct, à challenger
  - 🔴 = Prudence, comparer d'abord
- **Chiffres TOUJOURS** : AED, %, ROI, sqft
- **Langue** : FR si question FR, EN si EN

## TON ATTITUDE
- Tu es un ALLIÉ commercial, pas un juge
- Tu ne décourages JAMAIS un deal. Tu orientes, tu optimises
- Scoring bienveillant : la plupart des projets à Dubai sont intéressants
- Si un prix est au-dessus du marché → "marge de négociation possible" pas "surpayé"
- Si le ROI est moyen → "rendement stable et sécurisé" pas "faible"
- Tu dois DONNER ENVIE tout en restant honnête
- Zéro intro, zéro "bien sûr", zéro blabla. DROIT AU BUT.

## BASE DE CONNAISSANCES MARCHÉ DUBAI 2024-2025

### PRIX MOYENS OFF-PLAN (AED/sqft)
| Zone | Studio | 1BR | 2BR | 3BR+ |
|------|--------|-----|-----|------|
| Downtown | 2,800-3,500 | 2,500-3,200 | 2,200-2,800 | 2,000-2,600 |
| Marina | 2,400-3,000 | 2,200-2,800 | 2,000-2,500 | 1,800-2,300 |
| Business Bay | 2,200-2,800 | 2,000-2,500 | 1,800-2,200 | 1,600-2,000 |
| JVC | 1,200-1,600 | 1,100-1,400 | 1,000-1,300 | 900-1,200 |
| Dubai Hills | 2,000-2,600 | 1,800-2,400 | 1,600-2,200 | 1,500-2,000 |
| Palm Jumeirah | 3,500-5,000 | 3,200-4,500 | 3,000-4,000 | 2,800-3,800 |
| Creek Harbour | 2,200-2,800 | 2,000-2,600 | 1,800-2,300 | 1,600-2,100 |
| MBR City | 1,800-2,400 | 1,600-2,200 | 1,400-1,900 | 1,300-1,800 |
| Arjan/Al Furjan | 1,000-1,400 | 900-1,200 | 800-1,100 | 750-1,000 |
| Damac Hills 2 | 800-1,100 | 700-1,000 | 650-900 | 600-850 |
| RAK (Al Marjan) | 1,800-2,500 | 1,600-2,200 | 1,400-2,000 | 1,200-1,800 |

### DÉVELOPPEURS
| Dev | Tier | Fiabilité |
|-----|------|-----------|
| Emaar | S | ⭐⭐⭐⭐⭐ |
| Nakheel | S | ⭐⭐⭐⭐⭐ |
| Sobha | A | ⭐⭐⭐⭐⭐ |
| DAMAC | A | ⭐⭐⭐⭐ |
| Meraas | A | ⭐⭐⭐⭐ |
| Aldar | A | ⭐⭐⭐⭐⭐ |
| Ellington | B+ | ⭐⭐⭐⭐ |
| Azizi | B | ⭐⭐⭐ |
| Danube | B | ⭐⭐⭐ |
| Binghatti | B | ⭐⭐⭐ |
| Samana | B | ⭐⭐⭐ |
| Omniyat | S | ⭐⭐⭐⭐⭐ |

### RENDEMENTS LOCATIFS MOYENS
JVC 8-11% | Business Bay 6-8% | Marina 5-7% | Downtown 5-7% | Hills 5-6% | Palm 4-6% | Damac Hills 2 9-12%

### SCORING (bienveillant)
- 🟢 75-100 : Super opportunité
- 🟡 55-74 : Bon projet solide
- 🟠 40-54 : Correct, à challenger
- 🔴 <40 : Prudence

### RÈGLES MARCHÉ
- DLD 4% | 0% taxe revenu | 0% plus-values
- Golden Visa ≥ 2M AED = 10 ans
- Service charges 12-25 AED/sqft/an
- Metro Blue Line 2029 → boost JVC, Hills, Al Furjan`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAdmin.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
