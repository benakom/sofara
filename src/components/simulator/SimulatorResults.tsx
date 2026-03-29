import { ArrowLeft, FileDown, Loader2, TrendingUp, DollarSign, BarChart3, Calendar, Percent, Home, PiggyBank, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { fmt, fmtPct } from "./InvestmentSimulator";
import type { SimulationData, SimulationResults } from "./simulator-types";
import type { Lang } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";

const COLORS = ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

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
    { label: lang === "fr" ? "ROI Total" : "Total ROI", value: fmtPct(results.totalROI), icon: TrendingUp, color: "bg-emerald-100 text-emerald-600", positive: results.totalROI > 0 },
    { label: lang === "fr" ? "ROI Annualisé" : "Annualized ROI", value: fmtPct(results.annualizedROI), icon: Percent, color: "bg-blue-100 text-blue-600", positive: results.annualizedROI > 0 },
    { label: lang === "fr" ? "Rendement Brut" : "Gross Yield", value: fmtPct(results.grossYield), icon: BarChart3, color: "bg-violet-100 text-violet-600", positive: true },
    { label: lang === "fr" ? "Rendement Net" : "Net Yield", value: fmtPct(results.netYield), icon: PiggyBank, color: "bg-amber-100 text-amber-600", positive: results.netYield > 0 },
    { label: lang === "fr" ? "Cashflow Mensuel" : "Monthly Cashflow", value: `AED ${fmt(results.netMonthlyCashflow)}`, icon: DollarSign, color: "bg-cyan-100 text-cyan-600", positive: results.netMonthlyCashflow > 0 },
    { label: lang === "fr" ? "Plus-value" : "Capital Gain", value: `AED ${fmt(results.capitalGain)}`, icon: TrendingUp, color: "bg-pink-100 text-pink-600", positive: results.capitalGain > 0 },
    { label: lang === "fr" ? "Valeur Future" : "Future Value", value: `AED ${fmt(results.futureValue)}`, icon: Home, color: "bg-indigo-100 text-indigo-600", positive: true },
    { label: lang === "fr" ? "Break-even" : "Break-even", value: results.breakEvenMonths ? `${results.breakEvenMonths} ${lang === "fr" ? "mois" : "months"}` : "N/A", icon: Clock, color: "bg-orange-100 text-orange-600", positive: true },
  ];

  const pieData = [
    { name: lang === "fr" ? "Prix du bien" : "Property Price", value: results.price },
    { name: "DLD Fee (4%)", value: results.dldFee },
    { name: lang === "fr" ? "Frais admin" : "Admin Fee", value: results.adminFee },
    { name: lang === "fr" ? "Frais courtier" : "Broker Fee", value: results.brokerFee },
  ];

  const projectionData = results.yearlyProjection.map((y) => ({
    name: `${lang === "fr" ? "An" : "Y"}${y.year}`,
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
      const accent = [99, 102, 241] as [number, number, number];

      doc.setFillColor(...accent);
      doc.rect(0, 0, 210, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SOFARA", 14, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
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
        [`Price/sqft: AED ${fmt(results.pricePerSqft)}`, `Type: ${data.propertyType}`],
        [`Payment Plan: ${data.paymentPlan}`, `Horizon: ${data.investmentHorizon} years`],
        [`Financing: ${data.financingType}`, `Rental Yield: ${data.expectedRentalYield}%`],
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
        headStyles: { fillColor: accent, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 243, 255] },
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
        headStyles: { fillColor: accent, textColor: [255, 255, 255] },
      });

      const fy2 = (doc as any).lastAutoTable?.finalY || ty + 40;
      let dy = fy2 + 10;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(130, 130, 130);
      const disclaimer = "Disclaimer: Results are indicative and approximate. They may vary depending on the project, developer, and actual fees. Sofara does not guarantee accuracy.";
      doc.text(doc.splitTextToSize(disclaimer, 180), 14, dy);

      doc.save("sofara-investment-report.pdf");
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]">
          <ArrowLeft className="w-4 h-4" />
          {lang === "fr" ? "Modifier" : "Edit"}
        </Button>
        <Button onClick={generatePDF} disabled={generating} className="dash-btn-accent rounded-xl gap-2 h-10 px-5 text-sm">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          {lang === "fr" ? "Télécharger PDF" : "Download PDF"}
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] leading-tight mb-1">{kpi.label}</p>
            <p className={`text-lg font-bold font-display ${kpi.positive ? "text-[hsl(var(--dash-fg))]" : "text-red-500"}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Property Value Projection */}
        <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "fr" ? "Projection de valeur" : "Value Projection"}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => [`AED ${fmt(v)}`, ""]} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#colorValue)" strokeWidth={2} name={lang === "fr" ? "Valeur" : "Value"} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown Pie */}
        <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "fr" ? "Répartition des coûts" : "Cost Breakdown"}
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `AED ${fmt(v)}`} />
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

      {/* ROI Projection Bar Chart */}
      <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
          {lang === "fr" ? "ROI cumulé par année" : "Cumulative ROI by Year"}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, "ROI"]} />
            <Bar dataKey="roi" fill="#6366f1" radius={[6, 6, 0, 0]} name="ROI" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Annual Income vs Expenses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "fr" ? "Revenus & Charges annuels" : "Annual Income & Expenses"}
          </h3>
          <div className="space-y-3">
            <BarItem label={lang === "fr" ? "Loyer brut annuel" : "Gross Annual Rental"} value={results.annualRental} max={results.annualRental} color="bg-emerald-500" />
            <BarItem label={lang === "fr" ? "Loyer effectif" : "Effective Rental"} value={results.effectiveRental} max={results.annualRental} color="bg-blue-500" />
            <BarItem label={lang === "fr" ? "Service Charges" : "Service Charges"} value={results.annualServiceCharge} max={results.annualRental} color="bg-amber-500" />
            <BarItem label={lang === "fr" ? "Assurance" : "Insurance"} value={results.annualInsurance} max={results.annualRental} color="bg-red-400" />
            <BarItem label={lang === "fr" ? "Maintenance" : "Maintenance"} value={data.annualMaintenance} max={results.annualRental} color="bg-orange-400" />
            {data.financingType === "mortgage" && (
              <BarItem label={lang === "fr" ? "Hypothèque / an" : "Mortgage / yr"} value={results.monthlyMortgage * 12} max={results.annualRental} color="bg-violet-500" />
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-[hsl(var(--dash-border))]">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-[hsl(var(--dash-fg))]">{lang === "fr" ? "Revenu net annuel" : "Net Annual Income"}</span>
              <span className={results.netAnnualIncome > 0 ? "text-emerald-600" : "text-red-500"}>AED {fmt(results.netAnnualIncome)}</span>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))] mb-4">
            {lang === "fr" ? "Échéancier de paiement" : "Payment Schedule"}
          </h3>
          <div className="space-y-3">
            {results.paymentSchedule.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: COLORS[i] }}>
                  {i + 1}
                </div>
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
              <span className="text-[hsl(var(--dash-fg))]">{lang === "fr" ? "Coût total d'acquisition" : "Total Acquisition Cost"}</span>
              <span className="text-[hsl(var(--dash-accent))]">AED {fmt(results.totalAcquisition)}</span>
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
