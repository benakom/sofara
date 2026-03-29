import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Target, Loader2, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  score: string | null;
  stage: string | null;
  source: string | null;
  notes: string | null;
}

interface ScoreResult {
  lead_id: string;
  name: string;
  current_score: string;
  ai_score: string;
  probability: number;
  reasoning: string;
  priority_action: string;
}

const QUALIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-qualify`;

const scoreColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700 border-emerald-300",
  B: "bg-sky-100 text-sky-700 border-sky-300",
  C: "bg-amber-100 text-amber-700 border-amber-300",
  D: "bg-red-100 text-red-700 border-red-300",
};

export default function AutoScoreTool() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [results, setResults] = useState<ScoreResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("id, first_name, last_name, email, phone, score, stage, source, notes")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setLeads(data);
    setLoadingLeads(false);
  };

  const scoreAllLeads = async () => {
    if (leads.length === 0) return;
    setIsLoading(true);
    setResults([]);
    setProgress(0);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      toast({ variant: "destructive", title: "Erreur", description: "Connectez-vous." });
      setIsLoading(false);
      return;
    }

    const scoredResults: ScoreResult[] = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setProgress(Math.round(((i + 1) / leads.length) * 100));

      try {
        const resp = await fetch(QUALIFY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: `Score ce lead de manière concise. Lead: ${lead.first_name} ${lead.last_name}, Score actuel: ${lead.score || "N/A"}, Stage: ${lead.stage || "N/A"}, Source: ${lead.source || "N/A"}, Email: ${lead.email || "N/A"}, Phone: ${lead.phone || "N/A"}, Notes: ${lead.notes || "Aucune"}. Réponds UNIQUEMENT au format JSON: {"ai_score":"A/B/C/D","probability":0-100,"reasoning":"courte explication","priority_action":"action recommandée"}`,
            }],
            mode: "qualifier",
            leadId: lead.id,
          }),
        });

        if (resp.ok && resp.body) {
          const reader = resp.body.getReader();
          const decoder = new TextDecoder();
          let fullText = "";
          let buf = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buf.indexOf("\n")) !== -1) {
              let line = buf.slice(0, idx);
              buf = buf.slice(idx + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const json = line.slice(6).trim();
              if (json === "[DONE]") break;
              try {
                const parsed = JSON.parse(json);
                const c = parsed.choices?.[0]?.delta?.content;
                if (c) fullText += c;
              } catch { buf = line + "\n" + buf; break; }
            }
          }

          // Parse JSON from response
          const jsonMatch = fullText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              const result: ScoreResult = {
                lead_id: lead.id,
                name: `${lead.first_name} ${lead.last_name}`,
                current_score: lead.score || "N/A",
                ai_score: parsed.ai_score || "C",
                probability: parsed.probability || 0,
                reasoning: parsed.reasoning || "",
                priority_action: parsed.priority_action || "",
              };
              scoredResults.push(result);
              setResults([...scoredResults]);
            } catch {}
          }
        }
      } catch (e) {
        console.error(`Error scoring lead ${lead.id}:`, e);
      }

      // Small delay to avoid rate limiting
      if (i < leads.length - 1) {
        await new Promise(r => setTimeout(r, 800));
      }
    }

    setIsLoading(false);
  };

  if (loadingLeads) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-display font-bold dash-text mb-1">
          {lang === "ar" ? "🎯 Smart Scoring AI" : "🎯 AI Smart Scoring"}
        </h2>
        <p className="text-xs dash-muted-text">
          {lang === "ar"
            ? `${leads.length} leads détectés — L'IA analyse chaque profil et attribue un score prédictif`
            : `${leads.length} leads detected — AI analyzes each profile and assigns a predictive score`}
        </p>
      </div>

      {!isLoading && results.length === 0 && (
        <button
          onClick={scoreAllLeads}
          disabled={leads.length === 0}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 mb-4"
        >
          <Target className="w-4 h-4" />
          {lang === "ar" ? `Scorer ${leads.length} leads` : `Score ${leads.length} leads`}
        </button>
      )}

      {isLoading && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs dash-muted-text mb-2">
            <span>{lang === "ar" ? "Analyse en cours…" : "Analyzing…"}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {["A", "B", "C", "D"].map(s => {
              const count = results.filter(r => r.ai_score === s).length;
              return (
                <div key={s} className={`rounded-lg p-3 text-center border ${scoreColors[s]}`}>
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-[10px] font-medium">Score {s}</p>
                </div>
              );
            })}
          </div>

          {/* Lead list */}
          {results
            .sort((a, b) => {
              const order = { A: 0, B: 1, C: 2, D: 3 };
              return (order[a.ai_score as keyof typeof order] || 3) - (order[b.ai_score as keyof typeof order] || 3);
            })
            .map((r) => (
            <div key={r.lead_id} className="dash-card rounded-xl p-4 border border-[hsl(var(--dash-border))]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${scoreColors[r.ai_score]}`}>
                    {r.ai_score}
                  </span>
                  <span className="text-sm font-medium dash-text">{r.name}</span>
                  {r.current_score !== r.ai_score && (
                    <span className="text-[10px] dash-muted-text">
                      ({lang === "ar" ? "était" : "was"} {r.current_score})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">{r.probability}%</span>
                </div>
              </div>
              <p className="text-xs dash-muted-text mb-1">{r.reasoning}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-3 h-3 text-[hsl(var(--primary))]" />
                <p className="text-[11px] text-[hsl(var(--primary))] font-medium">{r.priority_action}</p>
              </div>
            </div>
          ))}

          {!isLoading && (
            <button
              onClick={scoreAllLeads}
              className="w-full py-2.5 rounded-xl border border-[hsl(var(--dash-border))] text-xs font-medium dash-text hover:bg-[hsl(var(--dash-muted)/.3)] transition-colors mt-2"
            >
              {lang === "ar" ? "🔄 Rescorer tous les leads" : "🔄 Rescore all leads"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
