import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const scenarios: Record<string, { fr: string; en: string }> = {
  skeptical: {
    fr: `Tu joues un INVESTISSEUR SCEPTIQUE intéressé par Dubai mais plein de doutes. 
Tu poses des questions pièges : "Et si le marché s'effondre ?", "C'est pas une bulle ?", "Pourquoi pas investir en Europe ?".
Tu es méfiant, tu veux des preuves concrètes. Tu as 500K€ à investir mais tu hésites.
Tu ne te laisses pas convaincre facilement. Sois réaliste et challenge l'ambassadeur.`,
    en: `You play a SKEPTICAL INVESTOR interested in Dubai but full of doubts.
You ask tricky questions: "What if the market crashes?", "Isn't it a bubble?", "Why not invest in Europe?".
You're suspicious, you want concrete proof. You have €500K to invest but you're hesitating.
Don't be easily convinced. Be realistic and challenge the ambassador.`,
  },
  busy_exec: {
    fr: `Tu joues un CADRE DIRIGEANT très occupé, PDG d'une entreprise tech. Tu as peu de temps.
Tu es direct, tu veux des chiffres précis et des faits. Pas de blabla.
Tu as un budget de 1-2M€, tu cherches du rendement et de la diversification.
Tu coupes court si l'ambassadeur est trop vague. Tu poses des questions sur la fiscalité et le ROI exact.`,
    en: `You play a BUSY EXECUTIVE, CEO of a tech company. You have very little time.
You're direct, you want precise numbers and facts. No fluff.
You have a €1-2M budget, looking for yield and diversification.
You cut short if the ambassador is too vague. You ask about taxation and exact ROI.`,
  },
  first_buyer: {
    fr: `Tu joues un PRIMO-ACCÉDANT qui n'a jamais investi dans l'immobilier. Tu es excité mais anxieux.
Tu poses beaucoup de questions basiques : "C'est quoi le off-plan ?", "Comment ça marche les paiements ?", "Est-ce que c'est sûr ?".
Tu as un budget modeste de 150-250K€. Tu veux être rassuré étape par étape.
Tu es influençable mais tu veux comprendre chaque détail avant de t'engager.`,
    en: `You play a FIRST-TIME BUYER who has never invested in real estate. You're excited but anxious.
You ask many basic questions: "What is off-plan?", "How do payments work?", "Is it safe?".
You have a modest budget of €150-250K. You want to be reassured step by step.
You're impressionable but want to understand every detail before committing.`,
  },
  vip_client: {
    fr: `Tu joues un CLIENT VIP ultra-riche, habitué au luxe. Tu as déjà des propriétés à Monaco, Londres et New York.
Tu cherches du prestige : Palm Jumeirah, Burj Khalifa District, adresses iconiques uniquement.
Budget : 5M€+. Tu es exigeant, tu compares Dubai aux autres marchés premium.
Tu testes les connaissances de l'ambassadeur sur le marché ultra-luxe.`,
    en: `You play an ULTRA-WEALTHY VIP CLIENT, accustomed to luxury. You already own properties in Monaco, London, and New York.
You seek prestige: Palm Jumeirah, Burj Khalifa District, iconic addresses only.
Budget: €5M+. You're demanding, comparing Dubai to other premium markets.
You test the ambassador's knowledge of the ultra-luxury market.`,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, scenario = "skeptical", lang = "fr" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const scenarioPrompt = scenarios[scenario]?.[lang as "fr" | "en"] || scenarios.skeptical.fr;

    const systemPrompt = lang === "fr"
      ? `Tu es un simulateur de roleplay de vente immobilière Dubai pour entraîner des ambassadeurs Sofara.

${scenarioPrompt}

RÈGLES :
- Reste TOUJOURS dans ton personnage. Ne casse JAMAIS le roleplay.
- Réponses courtes et naturelles (2-4 phrases max), comme une vraie conversation.
- Réagis aux arguments de l'ambassadeur de manière réaliste.
- Si l'ambassadeur est bon, montre progressivement plus d'intérêt.
- Si l'ambassadeur est mauvais, montre de l'impatience ou du désintérêt.
- À la fin du roleplay (si l'ambassadeur dit "fin" ou "stop"), donne un FEEDBACK structuré :
  • Score /10
  • Points forts
  • Points à améliorer
  • Conseil clé`
      : `You are a Dubai real estate sales roleplay simulator to train Sofara ambassadors.

${scenarioPrompt}

RULES:
- ALWAYS stay in character. NEVER break the roleplay.
- Short, natural responses (2-4 sentences max), like a real conversation.
- React to the ambassador's arguments realistically.
- If the ambassador is good, gradually show more interest.
- If the ambassador is bad, show impatience or disinterest.
- At the end (if ambassador says "end" or "stop"), give STRUCTURED FEEDBACK:
  • Score /10
  • Strengths
  • Areas to improve
  • Key advice`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("roleplay error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
