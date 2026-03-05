import { useState, useMemo } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Lang } from "@/i18n/translations";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);

const PLAN_PRESETS = [
  { label: "60 / 40", construction: 60, handover: 40 },
  { label: "50 / 50", construction: 50, handover: 50 },
  { label: "70 / 30", construction: 70, handover: 30 },
  { label: "80 / 20", construction: 80, handover: 20 },
];

type Milestone = {
  step: string;
  amount: number;
  date?: string;
};

const PaymentPlanSimulator = ({ lang }: { lang: Lang }) => {
  const { user } = useAuth();
  const [unitPrice, setUnitPrice] = useState("");
  const [constructionPct, setConstructionPct] = useState(60);
  const [handoverPct, setHandoverPct] = useState(40);
  const [postHandover, setPostHandover] = useState(false);
  const [postHandoverPct, setPostHandoverPct] = useState(20);
  const [phDuration, setPhDuration] = useState(24);
  const [phFrequency, setPhFrequency] = useState<"monthly" | "quarterly">("quarterly");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [generating, setGenerating] = useState(false);

  const price = parseFloat(unitPrice.replace(/,/g, "")) || 0;
  const pctSum = constructionPct + handoverPct;
  const valid = price > 0 && pctSum === 100 && (!postHandover || (postHandoverPct > 0 && postHandoverPct <= handoverPct));

  const milestones = useMemo<Milestone[]>(() => {
    if (!valid) return [];
    const dld = price * 0.04;
    const downPayment = price * 0.20;
    const remaining = price * 0.80;
    const constructionAmt = remaining * (constructionPct / 100);

    let handoverAmt = remaining * (handoverPct / 100);
    let phAmt = 0;

    if (postHandover) {
      phAmt = remaining * (postHandoverPct / 100);
      handoverAmt = remaining * ((handoverPct - postHandoverPct) / 100);
    }

    const items: Milestone[] = [
      { step: lang === "fr" ? "Acompte promoteur (20%)" : "Developer Down Payment (20%)", amount: downPayment },
      { step: "DLD Fee (4%)", amount: dld },
      { step: lang === "fr" ? "Pendant construction" : "During Construction", amount: constructionAmt },
      { step: lang === "fr" ? "À la remise des clés" : "On Handover", amount: handoverAmt },
    ];

    if (postHandover && phAmt > 0) {
      const intervalMonths = phFrequency === "monthly" ? 1 : 3;
      const numPayments = Math.floor(phDuration / intervalMonths);
      if (numPayments > 0) {
        const perPayment = phAmt / numPayments;
        const base = new Date(startDate);
        for (let i = 0; i < numPayments; i++) {
          const d = new Date(base);
          d.setMonth(d.getMonth() + intervalMonths * (i + 1));
          items.push({
            step: `Post-handover #${i + 1}`,
            amount: perPayment,
            date: d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
          });
        }
      }
    }

    return items;
  }, [valid, price, constructionPct, handoverPct, postHandover, postHandoverPct, phDuration, phFrequency, startDate, lang]);

  const totals = useMemo(() => {
    if (!valid) return { upfront: 0, total: 0, schedule: 0 };
    const dld = price * 0.04;
    const dp = price * 0.20;
    const scheduleTotal = milestones.reduce((s, m) => s + m.amount, 0);
    return { upfront: dp + dld, total: price + dld, schedule: scheduleTotal };
  }, [valid, price, milestones]);

  const handlePreset = (c: number, h: number) => {
    setConstructionPct(c);
    setHandoverPct(h);
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      const purple = [124, 58, 237] as [number, number, number];

      // Header
      doc.setFillColor(...purple);
      doc.rect(0, 0, 210, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SOFARA", 14, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Payment Plan Estimate", 14, 26);
      doc.text(new Date().toLocaleDateString("en-GB"), 196, 18, { align: "right" });
      if (user?.email) {
        doc.text(user.email, 196, 24, { align: "right" });
      }

      // Inputs
      doc.setTextColor(60, 60, 60);
      let y = 42;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Inputs", 14, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Unit Price: AED ${fmt(price)}`, 14, y); y += 6;
      doc.text(`Plan: ${constructionPct}% / ${handoverPct}%`, 14, y); y += 6;
      if (postHandover) {
        doc.text(`Post-handover: ${postHandoverPct}% over ${phDuration} months (${phFrequency})`, 14, y); y += 6;
      }
      y += 4;

      // Table
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Schedule", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["#", "Milestone", "Amount (AED)"]],
        body: milestones.map((m, i) => [
          String(i + 1),
          m.step + (m.date ? ` — ${m.date}` : ""),
          `AED ${fmt(m.amount)}`,
        ]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: purple, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 246, 255] },
      });

      const finalY = (doc as any).lastAutoTable?.finalY || y + 40;

      // Totals
      let ty = finalY + 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Upfront Total (Down + DLD): AED ${fmt(totals.upfront)}`, 14, ty); ty += 6;
      doc.text(`Total Price incl. DLD: AED ${fmt(totals.total)}`, 14, ty); ty += 6;
      doc.text(`Schedule Total: AED ${fmt(totals.schedule)}`, 14, ty); ty += 12;

      // Disclaimer
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(130, 130, 130);
      const disclaimer = "Disclaimer: Results are indicative and approximate. They may vary depending on the project, developer, and actual fees. Sofara does not guarantee accuracy and recommends validating with the developer / broker.";
      const lines = doc.splitTextToSize(disclaimer, 180);
      doc.text(lines, 14, ty);

      doc.save("sofara-payment-plan.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
          {lang === "fr" ? "Paramètres du plan" : "Plan Parameters"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--dash-fg))]">Unit Price (AED)</label>
            <input
              type="text"
              inputMode="numeric"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value.replace(/[^0-9.,]/g, ""))}
              placeholder="e.g. 2,500,000"
              className="w-full h-10 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-4 text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--dash-fg))]">
              {lang === "fr" ? "Date de début" : "Start Date"}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-10 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-4 text-sm text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] transition-all"
            />
          </div>
        </div>

        {/* Payment Plan presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[hsl(var(--dash-fg))]">
            Payment Plan (Construction / Handover)
          </label>
          <div className="flex flex-wrap gap-2">
            {PLAN_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p.construction, p.handover)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  constructionPct === p.construction && handoverPct === p.handover
                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                    : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-fg))] border-[hsl(var(--dash-border))] hover:border-[hsl(var(--primary)/.4)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="space-y-1">
              <span className="text-xs text-[hsl(var(--dash-muted-fg))]">Construction %</span>
              <input
                type="number"
                min={0}
                max={100}
                value={constructionPct}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(100, Number(e.target.value)));
                  setConstructionPct(v);
                  setHandoverPct(100 - v);
                }}
                className="w-full h-9 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-3 text-sm text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[hsl(var(--dash-muted-fg))]">Handover %</span>
              <input
                type="number"
                min={0}
                max={100}
                value={handoverPct}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(100, Number(e.target.value)));
                  setHandoverPct(v);
                  setConstructionPct(100 - v);
                }}
                className="w-full h-9 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-3 text-sm text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
              />
            </div>
          </div>
          {pctSum !== 100 && (
            <p className="text-xs text-red-500 font-medium">
              {lang === "fr" ? `Total = ${pctSum}% — doit être 100%` : `Total = ${pctSum}% — must equal 100%`}
            </p>
          )}
        </div>

        {/* Post-handover toggle */}
        <div className="space-y-3 pt-2 border-t border-[hsl(var(--dash-border))]">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setPostHandover(!postHandover)}
              className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 cursor-pointer ${
                postHandover ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--dash-border))]"
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${postHandover ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm font-medium text-[hsl(var(--dash-fg))]">
              Post-handover
            </span>
          </label>

          {postHandover && (
            <div className="grid sm:grid-cols-3 gap-3 pl-1">
              <div className="space-y-1">
                <span className="text-xs text-[hsl(var(--dash-muted-fg))]">Post-handover %</span>
                <input
                  type="number"
                  min={1}
                  max={handoverPct}
                  value={postHandoverPct}
                  onChange={(e) => setPostHandoverPct(Math.max(1, Math.min(handoverPct, Number(e.target.value))))}
                  className="w-full h-9 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-3 text-sm text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[hsl(var(--dash-muted-fg))]">
                  {lang === "fr" ? "Durée (mois)" : "Duration (months)"}
                </span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={phDuration}
                  onChange={(e) => setPhDuration(Math.max(1, Number(e.target.value)))}
                  className="w-full h-9 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-3 text-sm text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[hsl(var(--dash-muted-fg))]">
                  {lang === "fr" ? "Fréquence" : "Frequency"}
                </span>
                <select
                  value={phFrequency}
                  onChange={(e) => setPhFrequency(e.target.value as "monthly" | "quarterly")}
                  className="w-full h-9 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-3 text-sm text-[hsl(var(--dash-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                >
                  <option value="monthly">{lang === "fr" ? "Mensuel" : "Monthly"}</option>
                  <option value="quarterly">{lang === "fr" ? "Trimestriel" : "Quarterly"}</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {valid && milestones.length > 0 && (
        <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
              {lang === "fr" ? "Échéancier de paiement" : "Payment Schedule"}
            </h2>
            <Button
              onClick={generatePDF}
              disabled={generating}
              className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/.85)] rounded-xl gap-2 h-9 px-5 text-sm"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              {lang === "fr" ? "Générer PDF" : "Generate PDF"}
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard label={lang === "fr" ? "Upfront (Acompte + DLD)" : "Upfront (Down + DLD)"} value={`AED ${fmt(totals.upfront)}`} accent />
            <SummaryCard label={lang === "fr" ? "Prix total + DLD" : "Total Price + DLD"} value={`AED ${fmt(totals.total)}`} />
            <SummaryCard label={lang === "fr" ? "Total échéancier" : "Schedule Total"} value={`AED ${fmt(totals.schedule)}`} />
          </div>

          {/* Schedule table */}
          <div className="overflow-x-auto rounded-xl border border-[hsl(var(--dash-border))]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--dash-muted))]">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">#</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">
                    {lang === "fr" ? "Étape" : "Milestone"}
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">
                    {lang === "fr" ? "Montant (AED)" : "Amount (AED)"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--dash-border))]">
                {milestones.map((m, i) => (
                  <tr key={i} className="hover:bg-[hsl(var(--dash-muted)/.5)] transition-colors">
                    <td className="py-2.5 px-4 text-[hsl(var(--dash-muted-fg))]">{i + 1}</td>
                    <td className="py-2.5 px-4 text-[hsl(var(--dash-fg))] font-medium">
                      {m.step}
                      {m.date && <span className="ml-2 text-xs text-[hsl(var(--dash-muted-fg))]">— {m.date}</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-[hsl(var(--dash-fg))]">
                      AED {fmt(m.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className={`rounded-xl border p-4 ${accent ? "bg-[hsl(var(--primary)/.06)] border-[hsl(var(--primary)/.15)]" : "bg-[hsl(var(--dash-muted)/.5)] border-[hsl(var(--dash-border))]"}`}>
    <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mb-1 leading-tight">{label}</p>
    <p className={`text-lg font-bold font-display ${accent ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--dash-fg))]"}`}>{value}</p>
  </div>
);

export default PaymentPlanSimulator;
