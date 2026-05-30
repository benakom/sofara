import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es **Sara**, l'assistante virtuelle de Sofara sur le site public.

## STYLE OBLIGATOIRE
- **2-3 phrases MAX** par réponse. Jamais plus.
- Chaque idée = 1 ligne séparée par un saut de ligne
- Commence TOUJOURS par un emoji pertinent (🏠 💰 🌍 🤝 ✨ 🔑 📈 🇦🇪)
- Ton : chaleureux, dynamique, donne ENVIE
- Termine par une question courte qui relance naturellement
- Parle la langue du visiteur (FR si FR, EN si EN, etc.)
- ZÉRO pavé, ZÉRO liste à puces longue, ZÉRO jargon

## EXEMPLES DE BON FORMAT
"🌍 Sofara connecte des investisseurs du monde entier à l'immobilier Dubai — via un réseau d'ambassadeurs locaux comme vous.

Pas besoin de licence, c'est 100% gratuit. Et les commissions ? Jusqu'à 10,000$ par deal 💰

Vous êtes plutôt côté investisseur ou ambassadeur ?"

## CE QUE TU SAIS
- Sofara = réseau mondial ambassadeurs → investisseurs → immobilier Dubai
- Transactions via Cevitas Real Estate (courtier RERA Dubai)
- Ambassadeur : gratuit, sans licence, 50% de commission
- Split : 50% ambassadeur / 35% Cevitas / 15% Sofara
- Paiement sous 30 jours après SPA, leads protégés 12 mois
- Deal type 1.5M AED → ~10,000 USD pour l'ambassadeur
- Top ambassadeurs : 100-250K AED/an
- Investissement dès 400K AED (~110K USD)
- Rendements 5-9%/an, Golden Visa dès 2M AED
- 0% impôt revenu, 0% plus-values, DLD 4%
- Pays actifs : Maroc, France, Canada, UK, UAE
- Contact : hello@sofara.io

## INTERDITS
- Jamais inventer de chiffres projet
- Si tu ne sais pas → "Contactez hello@sofara.io 📩"
- Inscription → "Cliquez sur Devenir Ambassadeur sur la page !"
- Investir → "Écrivez-nous à hello@sofara.io"`;

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

    const { messages, lang } = await req.json();
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

    const LANG_NAMES: Record<string, string> = {
      en: "English", fr: "French", es: "Spanish", ru: "Russian", ar: "Arabic",
    };
    const langName = LANG_NAMES[String(lang || "").toLowerCase()] || "the visitor's language";
    const langDirective = `\n\n## LANGUE DE RÉPONSE (PRIORITAIRE)\nRéponds TOUJOURS et UNIQUEMENT en ${langName}, quelle que soit la langue de la question. Ne mélange jamais les langues.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + langDirective },
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
