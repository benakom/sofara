import { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import StepPropertyType from "./steps/StepPropertyType";
import StepBudget from "./steps/StepBudget";
import StepArea from "./steps/StepArea";
import StepPaymentPlan from "./steps/StepPaymentPlan";
import StepHandover from "./steps/StepHandover";
import SimulatorResults from "./SimulatorResults";
import SimulatorAIAnalysis from "./SimulatorAIAnalysis";
import { PROPERTY_TYPES, AREAS, PAYMENT_PLANS } from "./simulator-data";
import type { SimulationData, SimulationResults as SimResults } from "./simulator-types";
import type { Lang } from "@/i18n/translations";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) => n.toFixed(1) + "%";

const STEPS = [
  { key: "type", label: "Property Type" },
  { key: "budget", label: "Budget" },
  { key: "area", label: "Area" },
  { key: "plan", label: "Payment Plan" },
  { key: "handover", label: "Handover" },
];

function computeResults(d: SimulationData): SimResults {
  const propType = PROPERTY_TYPES.find((p) => p.value === d.propertyType);
  const sqft = propType?.sqft || 750;
  const price = d.budget;
  const pricePerSqft = price / sqft;

  const dldFee = price * 0.04;
  const adminFee = 4200;
  const brokerFee = price * 0.02;
  const totalAcquisition = price + dldFee + adminFee + brokerFee;

  const serviceChargeRate = 15;
  const annualServiceCharge = sqft * serviceChargeRate;
  const annualInsurance = price * 0.003;
  const annualRental = price * (d.avgRoi / 100);
  const occupancyRate = 90;
  const effectiveRental = annualRental * (occupancyRate / 100);
  const annualMaintenance = 5000;
  const annualExpenses = annualServiceCharge + annualMaintenance + annualInsurance;
  const netAnnualIncome = effectiveRental - annualExpenses;
  const netMonthlyCashflow = netAnnualIncome / 12;

  const annualAppreciation = 5;
  const now = new Date().getFullYear();
  const investmentHorizon = Math.max(1, d.handoverYear - now + 3);

  const yearlyProjection: SimResults["yearlyProjection"] = [];
  let cumulativeRental = 0;
  let cumulativeExpenses = 0;

  for (let y = 1; y <= investmentHorizon; y++) {
    const futureValue = price * Math.pow(1 + annualAppreciation / 100, y);
    const capitalGain = futureValue - price;
    const yearRental = effectiveRental * Math.pow(1.03, y - 1);
    const yearExpense = annualExpenses * Math.pow(1.02, y - 1);
    cumulativeRental += yearRental;
    cumulativeExpenses += yearExpense;
    const totalReturn = capitalGain + cumulativeRental - cumulativeExpenses;
    const roi = (totalReturn / totalAcquisition) * 100;
    yearlyProjection.push({
      year: y,
      propertyValue: futureValue,
      equity: futureValue,
      totalRental: cumulativeRental,
      totalExpenses: cumulativeExpenses,
      netCashflow: cumulativeRental - cumulativeExpenses,
      roi,
    });
  }

  const futureValue = price * Math.pow(1 + annualAppreciation / 100, investmentHorizon);
  const capitalGain = futureValue - price;
  const totalReturn = capitalGain + cumulativeRental - cumulativeExpenses;
  const totalROI = (totalReturn / totalAcquisition) * 100;
  const annualizedROI = Math.pow(1 + totalROI / 100, 1 / investmentHorizon) * 100 - 100;
  const grossYield = (annualRental / price) * 100;
  const netYield = (netAnnualIncome / price) * 100;
  const breakEvenMonths = netMonthlyCashflow > 0 ? Math.ceil(totalAcquisition / (netMonthlyCashflow * 12) * 12) : null;

  const plan = PAYMENT_PLANS.find((p) => p.value === d.paymentPlan) || PAYMENT_PLANS[2];
  const paymentSchedule = [
    { milestone: "Booking / Down Payment (20%)", amount: price * 0.2, percentage: 20 },
    { milestone: "During Construction", amount: price * (plan.constructionPct / 100) - price * 0.2, percentage: plan.constructionPct - 20 },
    { milestone: "On Handover", amount: price * (plan.handoverPct / 100), percentage: plan.handoverPct },
  ].filter((p) => p.amount > 0);

  return {
    price, sqft, pricePerSqft, dldFee, adminFee, brokerFee, totalAcquisition,
    annualServiceCharge, annualInsurance, annualRental, effectiveRental, annualExpenses,
    netAnnualIncome, grossYield, netYield, netMonthlyCashflow, futureValue, capitalGain,
    totalROI, annualizedROI, breakEvenMonths, yearlyProjection, paymentSchedule,
    propertyType: propType?.label || d.propertyType,
    areaLabel: d.areaLabel,
    paymentPlan: d.paymentPlan,
    handoverYear: d.handoverYear,
    investmentHorizon,
  };
}

const DEFAULT_DATA: SimulationData = {
  propertyType: "1br",
  budget: 1500000,
  area: "dubai_marina",
  areaLabel: "Dubai Marina",
  avgPriceSqft: 2980,
  avgRoi: 7.2,
  paymentPlan: "60/40",
  handoverYear: 2027,
};

const InvestmentSimulator = () => {
  const { lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SimulationData>(DEFAULT_DATA);
  const [showResults, setShowResults] = useState(false);

  const update = <K extends keyof SimulationData>(key: K, value: SimulationData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const canContinue = useMemo(() => {
    if (step === 0) return !!data.propertyType;
    if (step === 1) return data.budget > 0;
    if (step === 2) return !!data.area;
    if (step === 3) return !!data.paymentPlan;
    if (step === 4) return !!data.handoverYear;
    return true;
  }, [step, data]);

  const handleContinue = () => {
    if (step < 4) setStep(step + 1);
    else setShowResults(true);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setShowResults(false);
    setData(DEFAULT_DATA);
  };

  const results = useMemo(() => computeResults(data), [data]);

  const progress = showResults ? 100 : ((step + 1) / 5) * 100;

  if (showResults) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={handleReset} className="flex items-center gap-2 text-sm text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] transition-colors">
            <RotateCcw className="w-4 h-4" />
            {lang === "ar" ? "Nouvelle simulation" : "New Simulation"}
          </button>
        </div>
        <SimulatorResults results={results} data={data} lang={lang} onBack={handleReset} />
        <SimulatorAIAnalysis results={results} data={data} lang={lang} />
        <div className="p-4 rounded-xl border border-[hsl(var(--dash-accent)/.2)] bg-[hsl(var(--dash-accent)/.06)] text-[hsl(var(--dash-muted-fg))] text-xs leading-relaxed">
          <span className="font-semibold text-[hsl(var(--dash-accent))]">⚠️ Disclaimer :</span>{" "}
          {lang === "ar"
            ? "Résultats donnés à titre indicatif. Ils peuvent varier selon le projet, le promoteur et les frais réels."
            : "Results are indicative. They may vary depending on the project, developer, and actual fees."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[hsl(var(--dash-muted-fg))]">
            {lang === "ar" ? `Étape ${step + 1} sur 5` : `Step ${step + 1} of 5`}
          </span>
          <span className="text-sm font-semibold text-[hsl(var(--dash-accent))]">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[hsl(var(--dash-muted))] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[hsl(var(--dash-accent))]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && <StepPropertyType value={data.propertyType} onChange={(v) => update("propertyType", v)} lang={lang} />}
          {step === 1 && <StepBudget value={data.budget} onChange={(v) => update("budget", v)} lang={lang} />}
          {step === 2 && (
            <StepArea
              value={data.area}
              onChange={(area, label, priceSqft, roi) => {
                setData((prev) => ({ ...prev, area, areaLabel: label, avgPriceSqft: priceSqft, avgRoi: roi }));
              }}
              lang={lang}
            />
          )}
          {step === 3 && <StepPaymentPlan value={data.paymentPlan} onChange={(v) => update("paymentPlan", v)} lang={lang} />}
          {step === 4 && <StepHandover value={data.handoverYear} onChange={(v) => update("handoverYear", v)} lang={lang} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "Retour" : "Back"}
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold dash-btn-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {step === 4 ? (lang === "ar" ? "Simuler" : "Simulate") : (lang === "ar" ? "Continuer" : "Continue")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-[hsl(var(--dash-muted-fg))] mt-8 leading-relaxed">
        {lang === "ar"
          ? "Ce simulateur fournit des estimations basées sur des moyennes du marché. Les prix, rendements et retours réels peuvent varier."
          : "This simulator provides estimates based on market averages. Actual prices, yields, and returns may vary."}
        {" "}
        <span className="underline">{lang === "ar" ? "Ceci n'est pas un conseil financier." : "This is not financial advice."}</span>
      </p>
    </div>
  );
};

export { fmt, fmtPct };
export default InvestmentSimulator;
