import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Mail, MessageCircle, Phone, Smartphone, Loader2, Copy, Check, ChevronDown } from "lucide-react";
import LeadSelector from "@/components/sofar-ai/LeadSelector";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  score: string | null;
  stage: string | null;
  source: string | null;
}

interface SequenceStep {
  day: number;
  channel: string;
  subject: string;
  content: string;
  objective: string;
  tips?: string;
}

interface SequenceResult {
  steps: SequenceStep[];
  strategy_summary: string;
}

const SEQUENCES_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-sequences`;

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  call: Phone,
  sms: Smartphone,
};

const channelColors: Record<string, string> = {
  email: "bg-sky-100 text-sky-700",
  whatsapp: "bg-green-100 text-green-700",
  call: "bg-violet-100 text-violet-700",
  sms: "bg-amber-100 text-amber-700",
};

export default function SequencesTool() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [result, setResult] = useState<SequenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!selectedLead) {
      toast({ variant: "destructive", title: "Erreur", description: lang === "fr" ? "Sélectionnez un lead." : "Select a lead." });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const resp = await fetch(SEQUENCES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ lead: selectedLead, lang }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur" }));
        toast({ variant: "destructive", title: "Erreur", description: err.error });
        setIsLoading(false);
        return;
      }

      const data: SequenceResult = await resp.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de générer la séquence." });
    }
    setIsLoading(false);
  };

  const copyContent = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    toast({ title: lang === "fr" ? "Copié !" : "Copied!" });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-display font-bold dash-text mb-1">
          {lang === "fr" ? "⚡ Séquences Follow-up AI" : "⚡ AI Follow-up Sequences"}
        </h2>
        <p className="text-xs dash-muted-text">
          {lang === "fr"
            ? "Sélectionnez un lead et générez une séquence de relance complète en un clic"
            : "Select a lead and generate a complete follow-up sequence in one click"}
        </p>
      </div>

      <div className="mb-4">
        <LeadSelector selectedLead={selectedLead} onSelectLead={setSelectedLead} />
      </div>

      {!result && (
        <button
          onClick={generate}
          disabled={!selectedLead || isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {lang === "fr" ? "Génération en cours…" : "Generating…"}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              {lang === "fr" ? "Générer la séquence" : "Generate sequence"}
            </>
          )}
        </button>
      )}

      {result && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Strategy */}
          <div className="dash-card rounded-xl p-4 border border-amber-200 bg-amber-50/50">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">
              {lang === "fr" ? "📋 Stratégie" : "📋 Strategy"}
            </h3>
            <p className="text-xs text-amber-700 leading-relaxed">{result.strategy_summary}</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[hsl(var(--dash-border))]" />
            {result.steps.map((step, i) => {
              const Icon = channelIcons[step.channel] || Mail;
              const isExpanded = expandedIdx === i;
              return (
                <div key={i} className="relative pl-12 pb-4">
                  <div className={`absolute left-3 w-5 h-5 rounded-full flex items-center justify-center ${channelColors[step.channel] || "bg-gray-100 text-gray-600"} ring-2 ring-white`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="dash-card rounded-xl border border-[hsl(var(--dash-border))] overflow-hidden">
                    <button
                      onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[hsl(var(--dash-muted)/.3)] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-[10px] font-bold dash-muted-text">J+{step.day}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${channelColors[step.channel]}`}>
                          {step.channel}
                        </span>
                        <span className="text-xs font-medium dash-text">{step.subject}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 dash-muted-text transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    {isExpanded && (
                      <div className="border-t border-[hsl(var(--dash-border))] p-4 space-y-3">
                        <div>
                          <p className="text-[10px] font-semibold dash-muted-text uppercase mb-1">
                            {lang === "fr" ? "Objectif" : "Objective"}
                          </p>
                          <p className="text-xs dash-text">{step.objective}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-semibold dash-muted-text uppercase">
                              {lang === "fr" ? "Contenu" : "Content"}
                            </p>
                            <button
                              onClick={() => copyContent(step.content, i)}
                              className="flex items-center gap-1 text-[10px] text-[hsl(var(--primary))] hover:underline"
                            >
                              {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedIdx === i ? (lang === "fr" ? "Copié" : "Copied") : (lang === "fr" ? "Copier" : "Copy")}
                            </button>
                          </div>
                          <div className="bg-[hsl(var(--dash-muted)/.3)] rounded-lg p-3 text-xs dash-text whitespace-pre-wrap leading-relaxed">
                            {step.content}
                          </div>
                        </div>
                        {step.tips && (
                          <div className="bg-amber-50 rounded-lg p-3">
                            <p className="text-[10px] font-semibold text-amber-700 mb-0.5">💡 Pro tip</p>
                            <p className="text-xs text-amber-600">{step.tips}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regenerate */}
          <button
            onClick={generate}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl border border-[hsl(var(--dash-border))] text-xs font-medium dash-text hover:bg-[hsl(var(--dash-muted)/.3)] transition-colors"
          >
            {lang === "fr" ? "🔄 Régénérer la séquence" : "🔄 Regenerate sequence"}
          </button>
        </div>
      )}
    </div>
  );
}
