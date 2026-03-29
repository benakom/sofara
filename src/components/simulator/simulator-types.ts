export type SimulationData = {
  // Step 1: Property Type
  propertyType: "studio" | "1br" | "2br" | "3br" | "4br" | "townhouse" | "villa";
  // Step 2: Budget
  budget: number;
  // Step 3: Area
  area: string;
  areaLabel: string;
  avgPriceSqft: number;
  avgRoi: number;
  // Step 4: Payment Plan
  paymentPlan: "80/20" | "70/30" | "60/40" | "50/50";
  // Step 5: Handover
  handoverYear: number;
};

export type AreaOption = {
  value: string;
  label: string;
  avgPriceSqft: number;
  avgRoi: number;
  popular?: boolean;
};

export type YearlyProjection = {
  year: number;
  propertyValue: number;
  equity: number;
  totalRental: number;
  totalExpenses: number;
  netCashflow: number;
  roi: number;
};

export type PaymentMilestone = {
  milestone: string;
  amount: number;
  percentage: number;
};

export type SimulationResults = {
  price: number;
  sqft: number;
  pricePerSqft: number;
  dldFee: number;
  adminFee: number;
  brokerFee: number;
  totalAcquisition: number;
  annualServiceCharge: number;
  annualInsurance: number;
  annualRental: number;
  effectiveRental: number;
  annualExpenses: number;
  netAnnualIncome: number;
  grossYield: number;
  netYield: number;
  netMonthlyCashflow: number;
  futureValue: number;
  capitalGain: number;
  totalROI: number;
  annualizedROI: number;
  breakEvenMonths: number | null;
  yearlyProjection: YearlyProjection[];
  paymentSchedule: PaymentMilestone[];
  // Extra context
  propertyType: string;
  areaLabel: string;
  paymentPlan: string;
  handoverYear: number;
  investmentHorizon: number;
};
