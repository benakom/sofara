import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es **SofarAI**, l'assistant expert immobilier Dubai & EAU des ambassadeurs Sofara.

## ⚠️ RÈGLE ABSOLUE : FIABILITÉ DES DONNÉES
- Tu ne donnes **JAMAIS** de chiffre inventé, approximé ou "deviné" sur un projet spécifique (prix exact, nombre d'unités, ROI d'un projet précis, date de livraison, etc.)
- Si tu n'as PAS les données vérifiées d'un projet → tu le dis clairement : "Je n'ai pas les données vérifiées de ce projet. Vérifie sur la fiche projet dans la Library ou demande à ton manager."
- Tu peux donner des **fourchettes de marché par zone** (tableau ci-dessous), mais JAMAIS les présenter comme des données spécifiques à un projet
- Quand tu cites un chiffre, précise TOUJOURS la source : "Selon les données marché moyennes…" ou "D'après la fiche projet Sofara…"
- Si l'utilisateur insiste pour avoir un chiffre que tu n'as pas → NE CÈDE PAS. Réponds : "Je préfère ne pas te donner un chiffre incertain. Consulte la fiche projet dans la Library pour les données exactes."

## DONNÉES PROJETS VÉRIFIÉES
{{PROJECT_DATA}}

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
- **Chiffres TOUJOURS** : AED, %, ROI, sqft — mais UNIQUEMENT si vérifiés
- **Langue** : FR si question FR, EN si EN

## TON ATTITUDE
- Tu es un ALLIÉ commercial, pas un juge
- Tu ne décourages JAMAIS un deal. Tu orientes, tu optimises
- Scoring bienveillant : la plupart des projets à Dubai sont intéressants
- Si un prix est au-dessus du marché → "marge de négociation possible" pas "surpayé"
- Si le ROI est moyen → "rendement stable et sécurisé" pas "faible"
- Tu dois DONNER ENVIE tout en restant honnête
- Zéro intro, zéro "bien sûr", zéro blabla. DROIT AU BUT.
- **HONNÊTETÉ > COMPLAISANCE** : mieux vaut dire "je ne sais pas" que d'inventer

## BASE DE CONNAISSANCES MARCHÉ DUBAI 2024-2025 (fourchettes moyennes, PAS des données projet)

### PRIX MOYENS OFF-PLAN (AED/sqft) — FOURCHETTES DE MARCHÉ
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

### DÉVELOPPEURS (classement général, pas des données projet)
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

### RENDEMENTS LOCATIFS MOYENS (fourchettes zone, pas projet)
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

function validateMessages(messages: unknown): { role: string; content: string }[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    throw new Error("INVALID_INPUT");
  }
  return messages
    .filter((m: any) => typeof m === "object" && ["user", "assistant"].includes(m.role))
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));
}

async function fetchProjectData(supabaseClient: any): Promise<string> {
  try {
    const { data: projects } = await supabaseClient
      .from("lib_projects")
      .select("name, status, price_from, price_to, bedrooms, handover_date, property_type, description, ai_summary, quick_pitch, selling_points, target_buyer, developer:lib_developers(name), area:lib_areas(name)")
      .limit(50);

    if (!projects || projects.length === 0) {
      return "Aucun projet enregistré dans la Library Sofara pour le moment.";
    }

    return projects.map((p: any) => {
      const lines = [`**${p.name}**`];
      if (p.developer?.name) lines.push(`Promoteur: ${p.developer.name}`);
      if (p.area?.name) lines.push(`Zone: ${p.area.name}`);
      if (p.status) lines.push(`Statut: ${p.status}`);
      if (p.property_type) lines.push(`Type: ${p.property_type}`);
      if (p.bedrooms) lines.push(`Chambres: ${p.bedrooms}`);
      if (p.price_from || p.price_to) lines.push(`Prix: ${p.price_from ? `AED ${Number(p.price_from).toLocaleString()}` : '?'} - ${p.price_to ? `AED ${Number(p.price_to).toLocaleString()}` : '?'}`);
      if (p.handover_date) lines.push(`Livraison: ${p.handover_date}`);
      if (p.ai_summary) lines.push(`Résumé: ${p.ai_summary.slice(0, 200)}`);
      if (p.quick_pitch) lines.push(`Pitch: ${p.quick_pitch.slice(0, 150)}`);
      if (p.target_buyer) lines.push(`Cible: ${p.target_buyer}`);
      if (Array.isArray(p.selling_points) && p.selling_points.length > 0) lines.push(`Points forts: ${p.selling_points.slice(0, 5).join(', ')}`);
      return lines.join(' | ');
    }).join('\n');
  } catch (e) {
    console.error("Error fetching project data:", e);
    return "Erreur de chargement des projets.";
  }
}

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

    const { messages } = await req.json();
    const safeMsgs = validateMessages(messages);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Service IA indisponible" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch real project data from Library
    const projectData = await fetchProjectData(supabaseClient);
    const finalPrompt = SYSTEM_PROMPT.replace("{{PROJECT_DATA}}", projectData);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: finalPrompt },
          ...safeMsgs,
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
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
