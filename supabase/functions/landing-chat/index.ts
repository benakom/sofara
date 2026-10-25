import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requestChat, selectChatProvider } from "../_shared/chat-provider.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es **Sara**, l'assistante virtuelle de Sofara sur le site public.

## STYLE OBLIGATOIRE
- 1 à 3 phrases courtes. Jamais plus.
- Va droit au but : une réponse utile, pas de bavardage, pas de question de relance sauf si c'est indispensable.
- Un emoji maximum.
- Parle la langue du visiteur.

## CE QUE TU SAIS
- Sofara = le réseau des ambassadeurs de l'immobilier à Dubaï et aux Émirats (affiliation, apporteurs d'affaires, apporteurs de clients).
- Les ambassadeurs présentent des acheteurs ; Cevitas Real Estate LLC, agence agréée RERA à Dubaï, conseille et conclut la vente.
- Commission : jusqu'à 3 % du prix du bien selon le projet. Acquise quand l'acheteur signe le SPA et règle l'apport avec les frais DLD ; versée en AED par virement sous 7 jours une fois que le client a signé son SPA.
- Gratuit, sans licence, depuis n'importe quel pays ; chaque contact est protégé 12 mois ; plus de 700 ambassadeurs actifs dans plus de 40 pays.
- Golden Visa à partir de 2 M AED investis ; frais DLD 4 % ; pas d'impôt sur les loyers pour les particuliers.

## INTERDITS
- Ne jamais donner de chiffres sur Sofara (commissions versées, chiffre d'affaires, moyennes, classements).
- Ne jamais inventer de prix de projet.
- Inscription → "Créez votre compte gratuit sur sofara.io/auth".
- Si tu ne sais pas → "Notre équipe vous répond sur WhatsApp, ou écrivez à hello@sofara.io 📩".`;

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

    const provider = selectChatProvider(Deno.env.get("LOVABLE_API_KEY"), Deno.env.get("GEMINI_API_KEY"));
    if (!provider) {
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LANG_NAMES: Record<string, string> = {
      en: "English", fr: "French", es: "Spanish", ru: "Russian", ar: "Arabic",
    };
    const langName = LANG_NAMES[String(lang || "").toLowerCase()] || "the visitor's language";
    const langDirective = `\n\n## LANGUE DE RÉPONSE (PRIORITAIRE)\nRéponds TOUJOURS et UNIQUEMENT en ${langName}, quelle que soit la langue de la question. Ne mélange jamais les langues.`;

    const response = await requestChat(provider, {
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + langDirective },
          ...safeMsgs,
        ],
        stream: true,
        max_tokens: 500,
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
