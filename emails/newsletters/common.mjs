// Blocks reused across every issue: the two standing calls to action.
// 1. Share your referral link with your network.
// 2. Real estate agents abroad can hand over Dubai-bound clients; Cevitas closes.

export const REFERRAL = "{{referral_link}}";
export const SIGNUP = "https://sofara.io/auth?mode=signup&source=newsletter";
export const DASHBOARD = "https://sofara.io/dashboard";

export const ctaShare = {
  en: ["cta", { label: "Share your referral link", url: REFERRAL }],
  fr: ["cta", { label: "Partager mon lien de parrainage", url: REFERRAL }],
};

export const ctaDashboard = {
  en: ["cta", { label: "Open my dashboard", url: DASHBOARD }],
  fr: ["cta", { label: "Ouvrir mon tableau de bord", url: DASHBOARD }],
};

export const networkNudge = {
  en: [
    "callout",
    "**Your network is the asset.** Send your link to three people this week: a colleague, a family member abroad, a friend who keeps talking about Dubai. Every buyer they introduce is tracked to you for 12 months.",
  ],
  fr: [
    "callout",
    "**Votre réseau est votre capital.** Envoyez votre lien à trois personnes cette semaine : un collègue, un proche à l'étranger, un ami qui parle sans cesse de Dubaï. Chaque acheteur introduit vous est attribué pendant 12 mois.",
  ],
};

export const agentNudge = {
  en: [
    "callout",
    "**Real estate agent outside the UAE?** You do not need a Dubai licence to earn here. Hand your Dubai-bound clients to Sofara: Cevitas Real Estate, our RERA-licensed brokerage, runs the viewings, the negotiation and the closing. You keep your local business and earn up to 3% of the property value on top.",
  ],
  fr: [
    "callout",
    "**Agent immobilier hors des Émirats ?** Vous n'avez pas besoin de licence à Dubaï pour gagner ici. Confiez vos clients intéressés par Dubaï à Sofara : Cevitas Real Estate, notre agence licenciée RERA, gère les visites, la négociation et le closing. Vous gardez votre activité locale et touchez jusqu'à 3 % de la valeur du bien en plus.",
  ],
};

export const signature = {
  en: ["sig", ["Ahmed Benjas", "Founder, Sofara", "Cevitas Real Estate LLC, Dubai"]],
  fr: ["sig", ["Ahmed Benjas", "Fondateur, Sofara", "Cevitas Real Estate LLC, Dubaï"]],
};

// Standard closing: share CTA, agent nudge, signature.
export const closing = (lang) => [ctaShare[lang], agentNudge[lang], signature[lang]];
