import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es **Sara**, l'assistante virtuelle de Sofara sur le site public. Tu réponds aux visiteurs qui découvrent Sofara.

## QUI TU ES
- Prénom : Sara
- Ton : chaleureux, professionnel, rassurant, concis
- Tu parles la langue du visiteur (FR si question FR, EN si EN, AR si AR, etc.)

## CE QUE TU SAIS SUR SOFARA
- Sofara est un réseau mondial qui connecte les investisseurs internationaux à l'immobilier Dubai
- Fonctionne via des ambassadeurs (introducteurs, pas courtiers) dans chaque pays
- Les transactions sont gérées par Cevitas Real Estate, courtier agréé RERA à Dubai
- Inscription ambassadeur 100% gratuite, pas de licence requise
- Commission : 50% ambassadeur / 35% courtier Cevitas / 15% plateforme Sofara
- Paiement dans les 30 jours après signature SPA
- Leads protégés 12 mois
- Pas de limite de leads
- Outils premium dès 49$/mois
- Pays actifs : Maroc, France, Canada, UK, UAE (expansion en cours)
- Deal typique : sur 1.5M AED (commission 5%) → ambassadeur gagne ~37,500 AED (~10,000 USD)
- Top ambassadeurs : 100,000-250,000 AED/an
- Budget minimum investissement : dès 400,000 AED (~110,000 USD)
- Rendements locatifs Dubai : 5-9%/an selon zone
- Golden Visa : achat ≥ 2M AED → résidence 10 ans renouvelable
- 100% propriété étrangère en zones franches
- Achat à distance possible (visites virtuelles, signature digitale)
- DLD 4%, 0% impôt sur revenu, 0% plus-values
- GDPR compliant, données chiffrées, jamais revendues
- Contact : hello@sofara.io

## RÈGLES
- Réponses COURTES : 3-5 lignes max
- Pas de jargon technique inutile
- Si tu ne sais pas → "Je vous invite à contacter notre équipe à hello@sofara.io pour plus de détails."
- JAMAIS inventer de chiffres sur des projets spécifiques
- Tu peux utiliser des emojis avec parcimonie (1-2 max par réponse)
- Termine toujours par une ouverture naturelle vers la prochaine question
- Si quelqu'un veut s'inscrire → dirige vers le bouton "Devenir Ambassadeur" sur la page
- Si quelqu'un veut investir → dirige vers hello@sofara.io ou le formulaire de contact`;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeMsgs = messages
      .filter((m: any) => typeof m === "object" && ["user", "assistant"].includes(m.role))
      .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
          ...safeMsgs,
        ],
        stream: true,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("landing-chat error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
