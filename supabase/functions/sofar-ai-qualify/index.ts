import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es SofarAI Qualifier, un agent expert en qualification de leads immobilier à Dubai/EAU pour la plateforme Sofara.

## TON RÔLE
Tu es un agent de qualification intelligent. Tu analyses les leads, scores leur potentiel, recommandes des actions, et génères des messages personnalisés.

## MODES D'OPÉRATION

### Mode QUALIFIER (par défaut quand un lead est fourni)
Analyse le lead et fournis :
1. **Score recommandé** (A/B/C/D) avec justification
   - A = Prêt à acheter (budget confirmé, timeline < 3 mois, motivation forte)
   - B = Intéressé sérieux (budget approximatif, timeline 3-6 mois)
   - C = En exploration (pas de budget clair, timeline > 6 mois)
   - D = Froid (pas de réponse, pas intéressé, info insuffisante)
2. **Analyse du profil** : points forts et lacunes
3. **Prochaine action recommandée** avec priorité
4. **Questions à poser** pour mieux qualifier

### Mode EMAIL
Génère un email professionnel personnalisé selon le profil du lead :
- Objet accrocheur
- Corps adapté au stage et score
- Call-to-action clair
- Ton professionnel mais chaleureux

### Mode SCRIPT_APPEL
Génère un script d'appel structuré :
- Introduction personnalisée
- Questions de découverte
- Réponses aux objections courantes
- Technique de closing adaptée au score

### Mode WHATSAPP
Message WhatsApp court, direct, professionnel :
- Max 3-4 lignes
- Emoji modérés
- CTA clair

### Mode RECOMMANDATION
Analyse le pipeline complet et recommande :
- Leads prioritaires à contacter
- Leads dormants à réactiver
- Actions groupées optimales
- Zones/projets à proposer selon les profils

### Mode KYC_CHECK
Guide la vérification KYC/AML :
- Documents requis selon la nationalité
- Checklist de conformité
- Points d'attention réglementaires UAE

## RÈGLES DE STYLE
- **CONCISION ABSOLUE** : Réponses courtes, directes, percutantes. Pas de blabla. Max 8-10 lignes sauf si analyse complète demandée.
- Utilise des emojis intelligemment pour structurer et donner envie de lire (🎯 📊 🔥 💰 ✅ ⚡ 📞 📧 🏠 👤)
- Bullet points courts, pas de paragraphes longs
- Données marché réalistes Dubai 2024-2025
- Français si question en français, anglais si en anglais
- Toujours actionnable : chaque réponse = 1 action concrète claire
- Ne modifie JAMAIS les données directement, tu SUGGÈRES uniquement
- Pas d'introduction inutile, va droit au but

## CONNAISSANCE MARCHÉ DUBAI
- Zones premium : Downtown, Marina, Palm Jumeirah, DIFC, Business Bay
- Zones ROI élevé : JVC, Dubai Hills, Dubai Creek, MBR City
- Zones accessibles : Sports City, Dubai South, Arjan, Town Square
- Prix moyens 2024 : Studio JVC ~450K AED, 1BR Marina ~1.2M, Villa Hills ~3.5M+
- ROI locatif moyen : 6-9% selon zone
- DLD fees : 4% + admin fees
- Pas d'impôt sur le revenu, pas de taxe foncière récurrente`;

function validateMessages(messages: unknown): { role: string; content: string }[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    throw new Error("INVALID_INPUT");
  }
  return messages
    .filter((m: any) => typeof m === "object" && ["user", "assistant"].includes(m.role))
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));
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

    const userId = user.id;
    const { messages, mode, leadId } = await req.json();
    const safeMsgs = validateMessages(messages);

    // Fetch user's leads for context
    let leadsContext = "";
    if (leadId) {
      const { data: lead } = await supabaseClient
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .eq("user_id", userId)
        .single();

      if (lead) {
        leadsContext = `\n\n## LEAD SÉLECTIONNÉ\n- Nom: ${lead.first_name} ${lead.last_name}\n- Email: ${lead.email || "N/A"}\n- Téléphone: ${lead.phone || "N/A"}\n- Source: ${lead.source || "N/A"}\n- Stage actuel: ${lead.stage || "N/A"}\n- Score actuel: ${lead.score || "N/A"}\n- Statut KYC: ${lead.kyc_status || "N/A"}\n- Notes: ${lead.notes || "Aucune"}\n- Prochaine action: ${lead.next_action || "Non définie"}\n- Créé le: ${lead.created_at}\n- Dernière mise à jour: ${lead.updated_at}`;
      }
    } else if (mode === "recommandation") {
      const { data: leads } = await supabaseClient
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (leads && leads.length > 0) {
        leadsContext = `\n\n## PIPELINE COMPLET (${leads.length} leads)\n` +
          leads.map((l: any) => `- ${l.first_name} ${l.last_name} | Score: ${l.score} | Stage: ${l.stage} | Source: ${l.source} | KYC: ${l.kyc_status} | Dernière MAJ: ${l.updated_at}`).join("\n");
      }
    }

    const modeInstruction = mode ? `\n\nMODE ACTIF: ${mode.toUpperCase()}. Réponds selon ce mode.` : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Service IA indisponible" }), {
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
          { role: "system", content: SYSTEM_PROMPT + leadsContext + modeInstruction },
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
    console.error("qualify error:", e);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
