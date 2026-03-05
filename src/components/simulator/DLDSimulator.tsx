import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/i18n/translations";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);

const SERVICE_CHARGE_MIN = 12;
const SERVICE_CHARGE_MAX = 19;
const SERVICE_CHARGE_DEFAULT = 15;

const DLDSimulator = ({ lang }: { lang: Lang }) => {
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [scRate, setScRate] = useState(SERVICE_CHARGE_DEFAULT);
  const [copied, setCopied] = useState(false);

  const price = parseFloat(unitPrice.replace(/,/g, "")) || 0;
  const sqf = parseFloat(area.replace(/,/g, "")) || 0;

  const dldFee = useMemo(() => price * 0.04, [price]);
  const annualSC = useMemo(() => sqf * scRate, [sqf, scRate]);

  const valid = price > 0 && sqf > 0;

  const handleCopy = () => {
    const text = `DLD Fee: AED ${fmt(dldFee)}\nAnnual Service Charges: AED ${fmt(annualSC)}\nTotal Upfront: AED ${fmt(dldFee)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
          {lang === "fr" ? "Paramètres" : "Parameters"}
        </h2>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[hsl(var(--dash-fg))]">
            Unit Price (AED)
          </label>
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
            Area (Sqf)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={area}
            onChange={(e) => setArea(e.target.value.replace(/[^0-9.,]/g, ""))}
            placeholder="e.g. 1,200"
            className="w-full h-10 rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted))] px-4 text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[hsl(var(--dash-fg))]">
              Service Charge Rate (AED/Sqf)
            </label>
            <span className="text-sm font-bold text-[hsl(var(--primary))]">{scRate}</span>
          </div>
          <input
            type="range"
            min={SERVICE_CHARGE_MIN}
            max={SERVICE_CHARGE_MAX}
            step={1}
            value={scRate}
            onChange={(e) => setScRate(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))] h-2 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[hsl(var(--dash-muted-fg))]">
            <span>{SERVICE_CHARGE_MIN}</span>
            <span>{SERVICE_CHARGE_MAX}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultCard
            label="DLD Fee (4%)"
            value={valid ? `AED ${fmt(dldFee)}` : "—"}
            accent
          />
          <ResultCard
            label={lang === "fr" ? "Charges annuelles" : "Annual Service Charges"}
            value={valid ? `AED ${fmt(annualSC)}` : "—"}
          />
        </div>

        <div className="bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[hsl(var(--dash-fg))]">
              {lang === "fr" ? "Récapitulatif" : "Summary"}
            </h3>
            {valid && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 text-xs text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (lang === "fr" ? "Copié" : "Copied") : (lang === "fr" ? "Copier" : "Copy")}
              </Button>
            )}
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[hsl(var(--dash-border))]">
              <Row label="Unit Price" value={valid ? `AED ${fmt(price)}` : "—"} />
              <Row label="Area" value={valid ? `${fmt(sqf)} Sqf` : "—"} />
              <Row label="SC Rate" value={`${scRate} AED/Sqf`} />
              <Row label="DLD Fee (4%)" value={valid ? `AED ${fmt(dldFee)}` : "—"} bold />
              <Row label={lang === "fr" ? "Charges annuelles" : "Annual SC"} value={valid ? `AED ${fmt(annualSC)}` : "—"} bold />
              <Row label={lang === "fr" ? "Total Upfront" : "Total Upfront"} value={valid ? `AED ${fmt(dldFee)}` : "—"} bold accent />
            </tbody>
          </table>
          {valid && (
            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-3 italic">
              {lang === "fr" ? "Hors autres frais éventuels" : "Excluding other potential fees"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className={`rounded-2xl border p-5 ${accent ? "bg-[hsl(var(--primary)/.06)] border-[hsl(var(--primary)/.15)]" : "bg-white border-[hsl(var(--dash-border))]"}`}>
    <p className="text-xs text-[hsl(var(--dash-muted-fg))] mb-1">{label}</p>
    <p className={`text-xl font-bold font-display ${accent ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--dash-fg))]"}`}>{value}</p>
  </div>
);

const Row = ({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) => (
  <tr>
    <td className="py-2 text-[hsl(var(--dash-muted-fg))]">{label}</td>
    <td className={`py-2 text-right ${bold ? "font-semibold" : ""} ${accent ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--dash-fg))]"}`}>{value}</td>
  </tr>
);

export default DLDSimulator;
