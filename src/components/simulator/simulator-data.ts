import type { AreaOption } from "./simulator-types";

export const PROPERTY_TYPES = [
  { value: "studio", label: "Studio", emoji: "🏢", sqft: 450 },
  { value: "1br", label: "1 Bedroom", emoji: "🛏️", sqft: 750 },
  { value: "2br", label: "2 Bedrooms", emoji: "🏠", sqft: 1100 },
  { value: "3br", label: "3 Bedrooms", emoji: "🏡", sqft: 1600 },
  { value: "4br", label: "4 Bedrooms", emoji: "🏘️", sqft: 2200 },
  { value: "townhouse", label: "Townhouse", emoji: "🏗️", sqft: 1800, vip: true },
  { value: "villa", label: "Villa", emoji: "🏰", sqft: 3500, vip: true },
] as const;

export const AREAS: AreaOption[] = [
  { value: "dubai_marina", label: "Dubai Marina", avgPriceSqft: 2980, avgRoi: 7.2, popular: true },
  { value: "downtown", label: "Downtown Dubai", avgPriceSqft: 3200, avgRoi: 6.5, popular: true },
  { value: "business_bay", label: "Business Bay", avgPriceSqft: 2400, avgRoi: 7.8, popular: true },
  { value: "jvc", label: "Jumeirah Village Circle", avgPriceSqft: 1350, avgRoi: 8.5, popular: true },
  { value: "dubai_hills", label: "Dubai Hills Estate", avgPriceSqft: 2200, avgRoi: 6.8 },
  { value: "palm_jumeirah", label: "Palm Jumeirah", avgPriceSqft: 4200, avgRoi: 5.8 },
  { value: "dubai_creek", label: "Dubai Creek Harbour", avgPriceSqft: 2600, avgRoi: 7.0 },
  { value: "damac_hills", label: "DAMAC Hills", avgPriceSqft: 1600, avgRoi: 7.5 },
  { value: "meydan", label: "Meydan", avgPriceSqft: 1800, avgRoi: 7.3 },
  { value: "arjan", label: "Arjan", avgPriceSqft: 1200, avgRoi: 8.8 },
  { value: "al_furjan", label: "Al Furjan", avgPriceSqft: 1500, avgRoi: 7.6 },
  { value: "jumeirah_lake_towers", label: "JLT", avgPriceSqft: 1900, avgRoi: 7.9 },
  { value: "dubai_south", label: "Dubai South", avgPriceSqft: 1100, avgRoi: 9.0 },
  { value: "town_square", label: "Town Square", avgPriceSqft: 1050, avgRoi: 8.2 },
  { value: "motor_city", label: "Motor City", avgPriceSqft: 1300, avgRoi: 7.4 },
  { value: "sobha_hartland", label: "Sobha Hartland", avgPriceSqft: 2500, avgRoi: 6.9 },
  { value: "emaar_beachfront", label: "Emaar Beachfront", avgPriceSqft: 3600, avgRoi: 6.2 },
  { value: "dubai_sports_city", label: "Dubai Sports City", avgPriceSqft: 1000, avgRoi: 8.6 },
  { value: "mudon", label: "Mudon", avgPriceSqft: 1400, avgRoi: 7.1 },
  { value: "rashid_yachts", label: "Rashid Yachts & Marina", avgPriceSqft: 3100, avgRoi: 6.4 },
];

export const PAYMENT_PLANS = [
  { value: "80/20" as const, label: "80/20", constructionPct: 80, handoverPct: 20, description: "80% during construction, 20% on handover" },
  { value: "70/30" as const, label: "70/30", constructionPct: 70, handoverPct: 30, description: "70% during construction, 30% on handover" },
  { value: "60/40" as const, label: "60/40", constructionPct: 60, handoverPct: 40, description: "Most common — balanced payment structure" },
  { value: "50/50" as const, label: "50/50", constructionPct: 50, handoverPct: 50, description: "Equal split — lower upfront commitment" },
];

export const BUDGET_RANGES = [
  { value: 500000, label: "AED 500K" },
  { value: 750000, label: "AED 750K" },
  { value: 1000000, label: "AED 1M" },
  { value: 1500000, label: "AED 1.5M" },
  { value: 2000000, label: "AED 2M" },
  { value: 3000000, label: "AED 3M" },
  { value: 5000000, label: "AED 5M" },
  { value: 7500000, label: "AED 7.5M" },
  { value: 10000000, label: "AED 10M+" },
];

export const HANDOVER_YEARS = [2026, 2027, 2028, 2029, 2030, 2031];
