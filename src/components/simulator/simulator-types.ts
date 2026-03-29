export type SimulationData = {
  propertyPrice: string;
  areaSqft: string;
  bedrooms: string;
  propertyType: "apartment" | "villa" | "townhouse" | "penthouse";
  location: string;
  paymentPlan: string;
  constructionPct: number;
  handoverPct: number;
  handoverDate: string;
  annualAppreciation: number;
  expectedRentalYield: number;
  serviceChargeRate: number;
  occupancyRate: number;
  annualMaintenance: number;
  investmentHorizon: number;
  financingType: "cash" | "mortgage";
  mortgageRate: number;
  mortgageLTV: number;
  mortgageTerm: number;
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
  monthlyMortgage: number;
  downPayment: number;
  loanAmount: number;
  netMonthlyCashflow: number;
  futureValue: number;
  capitalGain: number;
  totalROI: number;
  annualizedROI: number;
  breakEvenMonths: number | null;
  yearlyProjection: YearlyProjection[];
  paymentSchedule: PaymentMilestone[];
};
