import { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import SimulatorInputs from "./SimulatorInputs";
import SimulatorResults from "./SimulatorResults";
import SimulatorAIAnalysis from "./SimulatorAIAnalysis";
import type { SimulationData, SimulationResults } from "./simulator-types";

const DEFAULT_DATA: SimulationData = {
  propertyPrice: "",
  areaSqft: "",
  bedrooms: "1",
  propertyType: "apartment",
  location: "dubai_marina",
  paymentPlan: "60/40",
  constructionPct: 60,
  handoverPct: 40,
  handoverDate: "",
  annualAppreciation: 5,
  expectedRentalYield: 7,
  serviceChargeRate: 15,
  occupancyRate: 90,
  annualMaintenance: 5000,
  investmentHorizon: 5,
  financingType: "cash",
  mortgageRate: 4.5,
  mortgageLTV: 75,
  mortgageTerm: 25,
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => n.toFixed(1) + "%";

function computeResults(d: SimulationData): SimulationResults | null {
  const price = parseFloat(d.propertyPrice.replace(/,/g, "")) || 0;
  const sqft = parseFloat(d.areaSqft.replace(/,/g, "")) || 0;
  if (price <= 0 || sqft <= 0) return null;

  const dldFee = price * 0.04;
  const adminFee = 4200;
  const brokerFee = price * 0.02;
  const totalAcquisition = price + dldFee + adminFee + brokerFee;

  const annualServiceCharge = sqft * d.serviceChargeRate;
  const annualInsurance = price * 0.003;
  const annualRental = price * (d.expectedRentalYield / 100);
  const effectiveRental = annualRental * (d.occupancyRate / 100);
  const annualExpenses = annualServiceCharge + d.annualMaintenance + annualInsurance;
  const netAnnualIncome = effectiveRental - annualExpenses;

  // Mortgage calculations
  let monthlyMortgage = 0;
  let totalMortgagePayments = 0;
  let downPayment = price;
  let loanAmount = 0;
  if (d.financingType === "mortgage") {
    loanAmount = price * (d.mortgageLTV / 100);
    downPayment = price - loanAmount;
    const monthlyRate = d.mortgageRate / 100 / 12;
    const nPayments = d.mortgageTerm * 12;
    monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1);
    totalMortgagePayments = monthlyMortgage * nPayments;
  }

  const netMonthlyCashflow = (netAnnualIncome / 12) - monthlyMortgage;

  // Multi-year projection
  const years = d.investmentHorizon;
  const yearlyProjection: { year: number; propertyValue: number; equity: number; totalRental: number; totalExpenses: number; netCashflow: number; roi: number }[] = [];
  let cumulativeRental = 0;
  let cumulativeExpenses = 0;
  let cumulativeMortgage = 0;

  for (let y = 1; y <= years; y++) {
    const futureValue = price * Math.pow(1 + d.annualAppreciation / 100, y);
    const capitalGain = futureValue - price;
    const yearRental = effectiveRental * Math.pow(1.03, y - 1); // 3% annual rent increase
    const yearExpense = annualExpenses * Math.pow(1.02, y - 1); // 2% annual cost increase
    cumulativeRental += yearRental;
    cumulativeExpenses += yearExpense;
    cumulativeMortgage += monthlyMortgage * 12;

    const totalReturn = capitalGain + cumulativeRental - cumulativeExpenses - cumulativeMortgage;
    const invested = d.financingType === "mortgage" ? downPayment + dldFee + adminFee + brokerFee : totalAcquisition;
    const roi = (totalReturn / invested) * 100;

    yearlyProjection.push({
      year: y,
      propertyValue: futureValue,
      equity: futureValue - (d.financingType === "mortgage" ? Math.max(0, loanAmount - (monthlyMortgage * 12 * y - loanAmount * d.mortgageRate / 100 * y)) : 0),
      totalRental: cumulativeRental,
      totalExpenses: cumulativeExpenses + cumulativeMortgage,
      netCashflow: cumulativeRental - cumulativeExpenses - cumulativeMortgage,
      roi,
    });
  }

  const futureValue = price * Math.pow(1 + d.annualAppreciation / 100, years);
  const capitalGain = futureValue - price;
  const totalRentalIncome = cumulativeRental;
  const totalExpensesAll = cumulativeExpenses + cumulativeMortgage + dldFee + adminFee + brokerFee;
  const invested = d.financingType === "mortgage" ? downPayment + dldFee + adminFee + brokerFee : totalAcquisition;
  const totalReturn = capitalGain + totalRentalIncome - cumulativeExpenses - cumulativeMortgage;
  const totalROI = (totalReturn / invested) * 100;
  const annualizedROI = Math.pow(1 + totalROI / 100, 1 / years) * 100 - 100;

  const grossYield = (annualRental / price) * 100;
  const netYield = (netAnnualIncome / price) * 100;
  const pricePerSqft = price / sqft;

  // Break-even in months
  const monthlyNet = netMonthlyCashflow;
  const breakEvenMonths = monthlyNet > 0 ? Math.ceil(invested / (monthlyNet * 12) * 12) : null;

  // Payment schedule
  const constructionAmt = price * (d.constructionPct / 100);
  const handoverAmt = price * (d.handoverPct / 100);
  const paymentSchedule = [
    { milestone: "Booking / Down Payment (20%)", amount: price * 0.2, percentage: 20 },
    { milestone: "During Construction", amount: constructionAmt - price * 0.2, percentage: d.constructionPct - 20 },
    { milestone: "On Handover", amount: handoverAmt, percentage: d.handoverPct },
  ].filter(p => p.amount > 0);

  return {
    price,
    sqft,
    pricePerSqft,
    dldFee,
    adminFee,
    brokerFee,
    totalAcquisition,
    annualServiceCharge,
    annualInsurance,
    annualRental,
    effectiveRental,
    annualExpenses,
    netAnnualIncome,
    grossYield,
    netYield,
    monthlyMortgage,
    downPayment,
    loanAmount,
    netMonthlyCashflow,
    futureValue,
    capitalGain,
    totalROI,
    annualizedROI,
    breakEvenMonths,
    yearlyProjection,
    paymentSchedule,
  };
}

const InvestmentSimulator = () => {
  const { lang } = useLanguage();
  const [data, setData] = useState<SimulationData>(DEFAULT_DATA);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => computeResults(data), [data]);

  const handleSimulate = () => {
    if (results) setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
          {lang === "fr" ? "Simulateur d'Investissement Off-Plan" : "Off-Plan Investment Simulator"}
        </h1>
        <p className="text-sm text-[hsl(var(--dash-muted-fg))] mt-1">
          {lang === "fr"
            ? "Analysez le ROI, le cashflow, le plan de paiement et le rendement locatif de votre investissement."
            : "Analyze ROI, cashflow, payment plans & rental yields for your investment."}
        </p>
      </div>

      {!showResults ? (
        <SimulatorInputs
          data={data}
          setData={setData}
          onSimulate={handleSimulate}
          isValid={!!results}
          lang={lang}
        />
      ) : (
        results && (
          <div className="space-y-6">
            <SimulatorResults results={results} data={data} lang={lang} onBack={handleReset} />
            <SimulatorAIAnalysis results={results} data={data} lang={lang} />
            <div className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/80 text-amber-800 text-xs leading-relaxed">
              <span className="font-semibold">⚠️ Disclaimer :</span>{" "}
              {lang === "fr"
                ? "Résultats donnés à titre indicatif. Ils peuvent varier selon le projet, le promoteur et les frais réels. Sofara recommande de valider avec le promoteur."
                : "Results are indicative. They may vary depending on the project, developer, and actual fees. Sofara recommends validating with the developer."}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export { fmt, fmtPct };
export default InvestmentSimulator;
