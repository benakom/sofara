import { useState } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { fmt, fmtPct } from "./InvestmentSimulator";
import type { SimulationData, SimulationResults } from "./simulator-types";
import type { Lang } from "@/i18n/translations";

type Props = {
  results: SimulationResults;
  data: SimulationData;
  lang: Lang;
};

const SimulatorAIAnalysis = ({ results, data, lang }: Props) => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setAnalysis("");
    setDone(false);

    const prompt = `Analyze this Dubai off-plan property investment and provide a comprehensive assessment.

**Property:**
- Price: AED ${fmt(results.price)} | Area: ${fmt(results.sqft)} sqft | Price/sqft: AED ${fmt(results.pricePerSqft)}
- Type: ${results.propertyType} | Location: ${results.areaLabel}
- Payment Plan: ${results.paymentPlan} | Handover: ${results.handoverYear}

**Financial KPIs (${results.investmentHorizon}-year horizon):**
- Total ROI: ${fmtPct(results.totalROI)} | Annualized ROI: ${fmtPct(results.annualizedROI)}
- Gross Yield: ${fmtPct(results.grossYield)} | Net Yield: ${fmtPct(results.netYield)}
- Monthly Cashflow: AED ${fmt(results.netMonthlyCashflow)}
- Capital Gain: AED ${fmt(results.capitalGain)} | Future Value: AED ${fmt(results.futureValue)}
- Break-even: ${results.breakEvenMonths ?? "N/A"} months

**Costs:**
- Total Acquisition: AED ${fmt(results.totalAcquisition)}
- Annual Service Charges: AED ${fmt(results.annualServiceCharge)}
- Net Annual Income: AED ${fmt(results.netAnnualIncome)}

Provide your analysis in ${lang === "fr" ? "French" : "English"} with these sections:
1. **${lang === "fr" ? "Score Global" : "Overall Score"}** (give a score /10 with emoji)
2. **${lang === "fr" ? "Points Forts" : "Strengths"}** (3-4 bullet points)
3. **${lang === "fr" ? "Points de Vigilance" : "Risk Factors"}** (3-4 bullet points)
4. **${lang === "fr" ? "Comparaison Marché" : "Market Comparison"}** (how this compares to Dubai average)
5. **${lang === "fr" ? "Recommandation" : "Recommendation"}** (clear buy/hold/avoid with reasoning)
6. **${lang === "fr" ? "Arguments de Vente" : "Selling Points"}** (3 key talking points the ambassador can use with the client)

Be specific, use real Dubai market data (2024-2025 benchmarks), and be direct.`;

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sofar-ai-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a senior Dubai real estate investment analyst. Provide data-driven, actionable analysis." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("AI analysis failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setAnalysis(fullText); }
          } catch {}
        }
      }
      setDone(true);
    } catch (err) {
      console.error("AI analysis error:", err);
      setAnalysis(lang === "fr" ? "Erreur lors de l'analyse. Veuillez réessayer." : "Error during analysis. Please try again.");
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Bot className="w-4 h-4 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
            {lang === "fr" ? "Analyse IA" : "AI Analysis"}
          </h3>
        </div>
        {!done && (
          <Button onClick={runAnalysis} disabled={loading} className="dash-btn-accent rounded-xl gap-2 h-9 px-5 text-sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? (lang === "fr" ? "Analyse en cours..." : "Analyzing...") : (lang === "fr" ? "Lancer l'analyse IA" : "Run AI Analysis")}
          </Button>
        )}
      </div>
      {!analysis && !loading && (
        <p className="text-sm text-[hsl(var(--dash-muted-fg))] italic">
          {lang === "fr"
            ? "Cliquez sur \"Lancer l'analyse IA\" pour obtenir une évaluation détaillée."
            : "Click \"Run AI Analysis\" to get a detailed AI-powered evaluation."}
        </p>
      )}
      {analysis && (
        <div className="prose prose-sm max-w-none text-[hsl(var(--dash-fg))]">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default SimulatorAIAnalysis;
