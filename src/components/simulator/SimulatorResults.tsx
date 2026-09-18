import { ArrowLeft, FileDown, Loader2, TrendingUp, DollarSign, BarChart3, Percent, Home, PiggyBank, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { fmt, fmtPct } from "./InvestmentSimulator";
import type { SimulationData, SimulationResults } from "./simulator-types";
import type { Lang } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";

const COLORS = ["#D2F34C", "#a3c93a", "#7a9f2d", "#526e1f", "#3b5216", "#2a3b10"];

type Props = {
  results: SimulationResults;
  data: SimulationData;
  lang: Lang;
  onBack: () => void;
};

const SimulatorResults = ({ results, data, lang, onBack }: Props) => {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);

  const kpis = [
    { label: lang === "ar" ? "ROI Total" : "Total ROI", value: fmtPct(results.totalROI), icon: TrendingUp, positive: results.totalROI > 0 },
    { label: lang === "ar" ? "ROI Annualisé" : "Annualized ROI", value: fmtPct(results.annualizedROI), icon: Percent, positive: results.annualizedROI > 0 },
    { label: lang === "ar" ? "Rendement Brut" : "Gross Yield", value: fmtPct(results.grossYield), icon: BarChart3, positive: true },
    { label: lang === "ar" ? "Rendement Net" : "Net Yield", value: fmtPct(results.netYield), icon: PiggyBank, positive: results.netYield > 0 },
    { label: lang === "ar" ? "Cashflow Mensuel" : "Monthly Cashflow", value: `AED ${fmt(results.netMonthlyCashflow)}`, icon: DollarSign, positive: results.netMonthlyCashflow > 0 },
    { label: lang === "ar" ? "Plus-value" : "Capital Gain", value: `AED ${fmt(results.capitalGain)}`, icon: TrendingUp, positive: results.capitalGain > 0 },
    { label: lang === "ar" ? "Valeur Future" : "Future Value", value: `AED ${fmt(results.futureValue)}`, icon: Home, positive: true },
    { label: lang === "ar" ? "Break-even" : "Break-even", value: results.breakEvenMonths ? `${results.breakEvenMonths} ${lang === "ar" ? "mois" : "months"}` : "N/A", icon: Clock, positive: true },
  ];

  const pieData = [
    { name: lang === "ar" ? "Prix du bien" : "Property Price", value: results.price },
    { name: "DLD Fee (4%)", value: results.dldFee },
    { name: lang === "ar" ? "Frais admin" : "Admin Fee", value: results.adminFee },
    { name: lang === "ar" ? "Frais courtier" : "Broker Fee", value: results.brokerFee },
  ];

  const projectionData = results.yearlyProjection.map((y) => ({
    name: `${lang === "ar" ? "An" : "Y"}${y.year}`,
    value: y.propertyValue,
    rental: y.totalRental,
    roi: y.roi,
  }));

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();
      const accent = [210, 243, 76] as [number, number, number];

      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 210, 32, "F");
      doc.setTextColor(...accent);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SOFARA", 14, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      doc.text("Off-Plan Investment Report", 14, 26);
      doc.text(new Date().toLocaleDateString("en-GB"), 196, 18, { align: "right" });
      if (user?.email) doc.text(user.email, 196, 24, { align: "right" });

      let y = 42;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Summary", 14, y); y += 8;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      const summaryItems = [
        [`Property Price: AED ${fmt(results.price)}`, `Area: ${fmt(results.sqft)} sqft`],
        [`Price/sqft: AED ${fmt(results.pricePerSqft)}`, `Type: ${results.propertyType}`],
        [`Payment Plan: ${results.paymentPlan}`, `Horizon: ${results.investmentHorizon} years`],
        [`Location: ${results.areaLabel}`, `Handover: ${results.handoverYear}`],
      ];
      summaryItems.forEach(([a, b]) => {
        doc.text(a, 14, y);
        doc.text(b, 110, y);
        y += 5;
      });
      y += 4;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Key Performance Indicators", 14, y); y += 4;

      autoTable(doc, {
        startY: y,
        head: [["KPI", "Value"]],
        body: kpis.map(k => [k.label, k.value]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [10, 10, 10], textColor: accent },
        alternateRowStyles: { fillColor: [245, 250, 230] },
      });

      const fy = (doc as any).lastAutoTable?.finalY || y + 50;
      let ty = fy + 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Cost Breakdown", 14, ty); ty += 4;

      autoTable(doc, {
        startY: ty,
        head: [["Item", "Amount (AED)"]],
        body: [
          ["Property Price", `AED ${fmt(results.price)}`],
          ["DLD Fee (4%)", `AED ${fmt(results.dldFee)}`],
          ["Admin Fee", `AED ${fmt(results.adminFee)}`],
          ["Broker Fee (2%)", `AED ${fmt(results.brokerFee)}`],
          ["Total Acquisition", `AED ${fmt(results.totalAcquisition)}`],
        ],
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [10, 10, 10], textColor: accent },
      });

      const fy2 = (doc as any).lastAutoTable?.finalY || ty + 40;
      let dy = fy2 + 10;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(130, 130, 130);
      doc.text(doc.splitTextToSize("Disclaimer: Results are indicative. Sofara does not guarantee accuracy.", 180), 14, dy);
      doc.save("sofara-investment-report.pdf");
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]">
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "Nouvelle simulation" : "New Simulation"}
        </Button>
        <Button onClick={generatePDF} disabled={generating} className="dash-btn-accent rounded-xl gap-2 h-10 px-5 text-sm">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          {lang === "ar" ? "Télécharger PDF" : "Download PDF"}
        </Button>
      </div>

      {/* Summary banner */}
      <div className="bg-[hsl(var(--dash-accent))] rounded-2xl p-6 text-[hsl(var(--dash-accent-fg))]">
        <h2 className="text-xl font-bold font-display mb-2">
          {lang === "ar" ? "Résultat de votre simulation" : "Your Simulation Results"}
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm opacity-80">
          <span>{results.propertyType} · {results.areaLabel}</span>
          <span>AED {fmt(results.price)}</span>
          <span>{results.paymentPlan} plan</span>
          <span>{lang === "ar" ? "Livraison" : "Handover"} {results.handoverYear}</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="dash-card rounded-2xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--dash-accent)/.12)]">
                <kpi.icon className="w-4 h-4 text-[hsl(var(--dash-accent-ink))]" />
              </div>
            </div>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] leading-tight mb-1">{kpi.label}</p>
            <p className={`text-lg font-bold font-display ${kpi.positive ? "text-[hsl(var(--dash-fg))]" : "text-red-400"}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dash-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "ar" ? "Projection de valeur" : "Value Projection"}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D2F34C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D2F34C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                formatter={(v: number) => [`AED ${fmt(v)}`, ""]}
              />
              <Area type="monotone" dataKey="value" stroke="#6B8F1F" fill="url(#colorValue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="dash-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "ar" ? "Répartition des coûts" : "Cost Breakdown"}
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                  formatter={(v: number) => `AED ${fmt(v)}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[hsl(var(--dash-muted-fg))]">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROI Bar */}
      <div className="dash-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
          {lang === "ar" ? "ROI cumulé par année" : "Cumulative ROI by Year"}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
              formatter={(v: number) => [`${v.toFixed(1)}%`, "ROI"]}
            />
            <Bar dataKey="roi" fill="#D2F34C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income & Payment */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dash-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "ar" ? "Revenus & Charges annuels" : "Annual Income & Expenses"}
          </h3>
          <div className="space-y-3">
            <BarItem label={lang === "ar" ? "Loyer brut annuel" : "Gross Annual Rental"} value={results.annualRental} max={results.annualRental} color="bg-[hsl(var(--dash-accent))]" />
            <BarItem label={lang === "ar" ? "Loyer effectif" : "Effective Rental"} value={results.effectiveRental} max={results.annualRental} color="bg-[hsl(var(--dash-accent)/.7)]" />
            <BarItem label={lang === "ar" ? "Service Charges" : "Service Charges"} value={results.annualServiceCharge} max={results.annualRental} color="bg-amber-500" />
            <BarItem label={lang === "ar" ? "Assurance" : "Insurance"} value={results.annualInsurance} max={results.annualRental} color="bg-red-400" />
          </div>
          <div className="mt-4 pt-3 border-t border-[hsl(var(--dash-border))]">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-[hsl(var(--dash-fg))]">{lang === "ar" ? "Revenu net annuel" : "Net Annual Income"}</span>
              <span className={results.netAnnualIncome > 0 ? "text-[hsl(var(--dash-accent-ink))]" : "text-red-400"}>AED {fmt(results.netAnnualIncome)}</span>
            </div>
          </div>
        </div>
        <div className="dash-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "ar" ? "Échéancier de paiement" : "Payment Schedule"}
          </h3>
          <div className="space-y-3">
            {results.paymentSchedule.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent-fg))]">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--dash-fg))]">{p.milestone}</p>
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))]">{p.percentage}%</p>
                </div>
                <p className="text-sm font-bold text-[hsl(var(--dash-fg))]">AED {fmt(p.amount)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[hsl(var(--dash-border))]">
            <div className="flex justify-between text-sm font-semibold">
              <span>{lang === "ar" ? "Coût total" : "Total Acquisition"}</span>
              <span className="text-[hsl(var(--dash-accent-ink))]">AED {fmt(results.totalAcquisition)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarItem = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-[hsl(var(--dash-muted-fg))]">{label}</span>
      <span className="font-medium text-[hsl(var(--dash-fg))]">AED {fmt(value)}</span>
    </div>
    <div className="h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  </div>
);

export default SimulatorResults;
