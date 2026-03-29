import { Building2, MapPin, Calendar, TrendingUp, Wallet, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SimulationData } from "./simulator-types";
import type { Lang } from "@/i18n/translations";

const LOCATIONS = [
  { value: "dubai_marina", label: "Dubai Marina" },
  { value: "downtown", label: "Downtown Dubai" },
  { value: "business_bay", label: "Business Bay" },
  { value: "jvc", label: "JVC" },
  { value: "dubai_hills", label: "Dubai Hills" },
  { value: "palm_jumeirah", label: "Palm Jumeirah" },
  { value: "dubai_creek", label: "Dubai Creek Harbour" },
  { value: "damac_hills", label: "DAMAC Hills" },
  { value: "meydan", label: "Meydan" },
  { value: "arjan", label: "Arjan" },
  { value: "al_furjan", label: "Al Furjan" },
  { value: "other", label: "Other" },
];

const PAYMENT_PLANS = [
  { value: "80/20", label: "80/20", c: 80, h: 20 },
  { value: "70/30", label: "70/30", c: 70, h: 30 },
  { value: "60/40", label: "60/40", c: 60, h: 40 },
  { value: "50/50", label: "50/50", c: 50, h: 50 },
];

const inputClass = "w-full h-11 rounded-xl border border-[hsl(var(--dash-border))] bg-white px-4 text-sm text-[hsl(var(--dash-fg))] placeholder:text-[hsl(var(--dash-muted-fg))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--dash-accent)/.25)] focus:border-[hsl(var(--dash-accent))] transition-all";
const labelClass = "text-sm font-medium text-[hsl(var(--dash-fg))] flex items-center gap-2";
const sectionClass = "bg-white rounded-2xl border border-[hsl(var(--dash-border))] p-6 space-y-5 shadow-sm";

type Props = {
  data: SimulationData;
  setData: React.Dispatch<React.SetStateAction<SimulationData>>;
  onSimulate: () => void;
  isValid: boolean;
  lang: Lang;
};

const SimulatorInputs = ({ data, setData, onSimulate, isValid, lang }: Props) => {
  const update = <K extends keyof SimulationData>(key: K, value: SimulationData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const selectPlan = (plan: typeof PAYMENT_PLANS[0]) => {
    setData((prev) => ({ ...prev, paymentPlan: plan.value, constructionPct: plan.c, handoverPct: plan.h }));
  };

  return (
    <div className="space-y-6">
      {/* Property Details */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
            {lang === "fr" ? "Détails du bien" : "Property Details"}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Prix du bien (AED)" : "Property Price (AED)"}</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.propertyPrice}
              onChange={(e) => update("propertyPrice", e.target.value.replace(/[^0-9.,]/g, ""))}
              placeholder="e.g. 2,500,000"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Surface (Sqft)" : "Area (Sqft)"}</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.areaSqft}
              onChange={(e) => update("areaSqft", e.target.value.replace(/[^0-9.,]/g, ""))}
              placeholder="e.g. 1,200"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Type de bien" : "Property Type"}</label>
            <select value={data.propertyType} onChange={(e) => update("propertyType", e.target.value as any)} className={inputClass}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Chambres" : "Bedrooms"}</label>
            <select value={data.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass}>
              <option value="studio">Studio</option>
              <option value="1">1 BR</option>
              <option value="2">2 BR</option>
              <option value="3">3 BR</option>
              <option value="4">4 BR</option>
              <option value="5+">5+ BR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-violet-600" />
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
            {lang === "fr" ? "Localisation & Calendrier" : "Location & Timeline"}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Emplacement" : "Location"}</label>
            <select value={data.location} onChange={(e) => update("location", e.target.value)} className={inputClass}>
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>
              <Calendar className="w-3.5 h-3.5" />
              {lang === "fr" ? "Date de remise" : "Handover Date"}
            </label>
            <input type="date" value={data.handoverDate} onChange={(e) => update("handoverDate", e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Payment Plan */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
            {lang === "fr" ? "Plan de paiement" : "Payment Plan"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_PLANS.map((p) => (
            <button
              key={p.value}
              onClick={() => selectPlan(p)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                data.paymentPlan === p.value
                  ? "bg-[hsl(var(--dash-accent))] text-white border-[hsl(var(--dash-accent))] shadow-md"
                  : "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-fg))] border-[hsl(var(--dash-border))] hover:border-[hsl(var(--dash-accent)/.4)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-2">
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Financement" : "Financing"}</label>
            <select value={data.financingType} onChange={(e) => update("financingType", e.target.value as any)} className={inputClass}>
              <option value="cash">{lang === "fr" ? "Cash" : "Cash"}</option>
              <option value="mortgage">{lang === "fr" ? "Hypothèque" : "Mortgage"}</option>
            </select>
          </div>
          {data.financingType === "mortgage" && (
            <>
              <div className="space-y-1.5">
                <label className={labelClass}>LTV (%)</label>
                <input type="number" min={50} max={80} value={data.mortgageLTV} onChange={(e) => update("mortgageLTV", Number(e.target.value))} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>{lang === "fr" ? "Taux (%)" : "Rate (%)"}</label>
                <input type="number" min={1} max={10} step={0.1} value={data.mortgageRate} onChange={(e) => update("mortgageRate", Number(e.target.value))} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>{lang === "fr" ? "Durée (ans)" : "Term (years)"}</label>
                <input type="number" min={5} max={30} value={data.mortgageTerm} onChange={(e) => update("mortgageTerm", Number(e.target.value))} className={inputClass} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Investment Parameters */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--dash-fg))] font-display">
            {lang === "fr" ? "Paramètres d'investissement" : "Investment Parameters"}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SliderInput
            label={lang === "fr" ? "Appréciation annuelle" : "Annual Appreciation"}
            value={data.annualAppreciation}
            onChange={(v) => update("annualAppreciation", v)}
            min={0} max={15} step={0.5} suffix="%"
          />
          <SliderInput
            label={lang === "fr" ? "Rendement locatif" : "Rental Yield"}
            value={data.expectedRentalYield}
            onChange={(v) => update("expectedRentalYield", v)}
            min={3} max={12} step={0.5} suffix="%"
          />
          <SliderInput
            label={lang === "fr" ? "Taux d'occupation" : "Occupancy Rate"}
            value={data.occupancyRate}
            onChange={(v) => update("occupancyRate", v)}
            min={50} max={100} step={5} suffix="%"
          />
          <SliderInput
            label={lang === "fr" ? "Service Charge (AED/sqft)" : "Service Charge (AED/sqft)"}
            value={data.serviceChargeRate}
            onChange={(v) => update("serviceChargeRate", v)}
            min={8} max={30} step={1} suffix=" AED"
          />
          <SliderInput
            label={lang === "fr" ? "Horizon d'investissement" : "Investment Horizon"}
            value={data.investmentHorizon}
            onChange={(v) => update("investmentHorizon", v)}
            min={1} max={10} step={1} suffix={lang === "fr" ? " ans" : " yrs"}
          />
          <div className="space-y-1.5">
            <label className={labelClass}>{lang === "fr" ? "Maintenance annuelle (AED)" : "Annual Maintenance (AED)"}</label>
            <input
              type="number"
              min={0}
              value={data.annualMaintenance}
              onChange={(e) => update("annualMaintenance", Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={onSimulate}
        disabled={!isValid}
        className="w-full h-14 rounded-2xl text-base font-bold gap-3 dash-btn-accent shadow-lg hover:shadow-xl transition-all"
      >
        <Home className="w-5 h-5" />
        {lang === "fr" ? "Lancer la Simulation" : "Run Simulation"}
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

const SliderInput = ({ label, value, onChange, min, max, step, suffix }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-[hsl(var(--dash-fg))]">{label}</label>
      <span className="text-sm font-bold text-[hsl(var(--dash-accent))]">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full cursor-pointer accent-[hsl(var(--dash-accent))]"
    />
    <div className="flex justify-between text-[10px] text-[hsl(var(--dash-muted-fg))]">
      <span>{min}{suffix}</span>
      <span>{max}{suffix}</span>
    </div>
  </div>
);

export default SimulatorInputs;
