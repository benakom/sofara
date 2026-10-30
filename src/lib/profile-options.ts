// Shared options for the ambassador profile (sign-up and the profile completion card).

export const PHONE_CODES = [
  { code: "+971", flag: "🇦🇪", name: "UAE", digits: 9 },
  { code: "+33", flag: "🇫🇷", name: "France", digits: 9 },
  { code: "+44", flag: "🇬🇧", name: "UK", digits: 10 },
  { code: "+1", flag: "🇺🇸", name: "USA", digits: 10 },
  { code: "+212", flag: "🇲🇦", name: "Maroc", digits: 9 },
  { code: "+216", flag: "🇹🇳", name: "Tunisie", digits: 8 },
  { code: "+213", flag: "🇩🇿", name: "Algérie", digits: 9 },
  { code: "+966", flag: "🇸🇦", name: "Arabie S.", digits: 9 },
  { code: "+961", flag: "🇱🇧", name: "Liban", digits: 8 },
  { code: "+41", flag: "🇨🇭", name: "Suisse", digits: 9 },
  { code: "+32", flag: "🇧🇪", name: "Belgique", digits: 9 },
  { code: "+49", flag: "🇩🇪", name: "Allemagne", digits: 11 },
  { code: "+39", flag: "🇮🇹", name: "Italie", digits: 10 },
  { code: "+34", flag: "🇪🇸", name: "Espagne", digits: 9 },
  { code: "+351", flag: "🇵🇹", name: "Portugal", digits: 9 },
  { code: "+31", flag: "🇳🇱", name: "Pays-Bas", digits: 9 },
  { code: "+91", flag: "🇮🇳", name: "Inde", digits: 10 },
  { code: "+86", flag: "🇨🇳", name: "Chine", digits: 11 },
  { code: "+7", flag: "🇷🇺", name: "Russie", digits: 10 },
  { code: "+55", flag: "🇧🇷", name: "Brésil", digits: 11 },
  { code: "+234", flag: "🇳🇬", name: "Nigeria", digits: 10 },
  { code: "+27", flag: "🇿🇦", name: "Afr. du Sud", digits: 9 },
  { code: "+254", flag: "🇰🇪", name: "Kenya", digits: 9 },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Iv.", digits: 10 },
  { code: "+221", flag: "🇸🇳", name: "Sénégal", digits: 9 },
  { code: "+237", flag: "🇨🇲", name: "Cameroun", digits: 9 },
  { code: "+974", flag: "🇶🇦", name: "Qatar", digits: 8 },
  { code: "+965", flag: "🇰🇼", name: "Koweït", digits: 8 },
  { code: "+973", flag: "🇧🇭", name: "Bahreïn", digits: 8 },
  { code: "+968", flag: "🇴🇲", name: "Oman", digits: 8 },
  { code: "+20", flag: "🇪🇬", name: "Égypte", digits: 10 },
  { code: "+962", flag: "🇯🇴", name: "Jordanie", digits: 9 },
  { code: "+90", flag: "🇹🇷", name: "Turquie", digits: 10 },
  { code: "+1", flag: "🇨🇦", name: "Canada", digits: 10 },
];

export const OCCUPATIONS = [
  { value: "real_estate_agent", labelAr: "Agent immobilier", labelEn: "Real Estate Agent" },
  { value: "influencer", labelAr: "Influenceur / Créateur de contenu", labelEn: "Influencer / Content Creator" },
  { value: "entrepreneur", labelAr: "Entrepreneur", labelEn: "Entrepreneur" },
  { value: "investor", labelAr: "Investisseur", labelEn: "Investor" },
  { value: "networker", labelAr: "Networker / Communauté", labelEn: "Networker / Community" },
  { value: "finance", labelAr: "Finance / Banque", labelEn: "Finance / Banking" },
  { value: "consultant", labelAr: "Consultant", labelEn: "Consultant" },
  { value: "other", labelAr: "Autre", labelEn: "Other" },
];

/** Digits-only validation for a local number, given the selected country code. Returns an error message or "". */
export const phoneError = (value: string, code: string, isFr: boolean) => {
  const digits = value.replace(/\D/g, "");
  const entry = PHONE_CODES.find((c) => c.code === code);
  if (!entry || digits.length === 0 || digits.length === entry.digits) return "";
  return isFr ? `${entry.digits} chiffres requis pour ${entry.name}` : `${entry.digits} digits required for ${entry.name}`;
};
