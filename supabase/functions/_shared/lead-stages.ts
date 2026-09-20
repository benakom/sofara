// GENERATED copy of src/lib/lead-stages.ts by emails/newsletters/build.mjs. Do not edit here.
// Single source of truth for the lead lifecycle.
// Pure data, no imports: emails/newsletters/build.mjs copies this file verbatim to
// supabase/functions/_shared/lead-stages.ts so edge functions use the same catalog.
// `{lead}` in messages is replaced by the lead's first name at render time.

export type StageKind = "open" | "won" | "lost" | "paused";
export type StagePhase = "contact" | "qualification" | "visit" | "offer" | "closing" | "closed";

export interface LeadStage {
  key: string;
  en: string;
  fr: string;
  /** Funnel step, 1..N for open/won stages, 0 for paused/lost. */
  step: number;
  kind: StageKind;
  phase: StagePhase;
  /** What this stage means, written for the ambassador. */
  msg: { en: string; fr: string };
  /** Optional: what the ambassador can do to help. */
  hint?: { en: string; fr: string };
}

export const LEAD_PHASES: { key: StagePhase; en: string; fr: string }[] = [
  { key: "contact", en: "Contact", fr: "Contact" },
  { key: "qualification", en: "Qualification", fr: "Qualification" },
  { key: "visit", en: "Projects & viewings", fr: "Projets et visites" },
  { key: "offer", en: "Offer", fr: "Offre" },
  { key: "closing", en: "Closing", fr: "Closing" },
  { key: "closed", en: "Paused or lost", fr: "En pause ou perdu" },
];

export const LEAD_STAGES: LeadStage[] = [
  {
    key: "nouveau", en: "New", fr: "Nouveau", step: 1, kind: "open", phase: "contact",
    msg: { en: "Your lead has been received by the Sofara team and will be contacted within 24 hours.", fr: "Votre lead a été reçu par l'équipe Sofara et sera contacté sous 24 heures." },
  },
  {
    key: "contact_tente", en: "Contact attempted", fr: "Tentative de contact", step: 2, kind: "open", phase: "contact",
    msg: { en: "Our advisor tried to reach {lead} but could not get through yet. We keep trying by phone and WhatsApp.", fr: "Notre conseiller a tenté de joindre {lead} sans succès pour l'instant. Nous réessayons par téléphone et WhatsApp." },
    hint: { en: "If you can, let {lead} know that Sofara will call from a Dubai (+971) number.", fr: "Si possible, prévenez {lead} que Sofara appellera depuis un numéro de Dubaï (+971)." },
  },
  {
    key: "premier_appel", en: "First call done", fr: "1er appel effectué", step: 3, kind: "open", phase: "contact",
    msg: { en: "Our advisor had a first conversation with {lead}. We are now confirming budget, timeline and objectives.", fr: "Notre conseiller a eu un premier échange avec {lead}. Nous confirmons maintenant le budget, le calendrier et les objectifs." },
  },
  {
    key: "prequalifie", en: "Prequalified", fr: "Préqualifié", step: 4, kind: "open", phase: "qualification",
    msg: { en: "Budget and timeline are confirmed. Our advisor is preparing a shortlist of projects for {lead}.", fr: "Budget et calendrier confirmés. Notre conseiller prépare une sélection de projets pour {lead}." },
  },
  {
    key: "qualifie", en: "Qualified", fr: "Qualifié", step: 5, kind: "open", phase: "qualification",
    msg: { en: "{lead} is a qualified buyer. Our advisor is now working on the best options and payment plans.", fr: "{lead} est un acheteur qualifié. Notre conseiller travaille sur les meilleures options et plans de paiement." },
  },
  {
    key: "selection_envoyee", en: "Shortlist sent", fr: "Sélection envoyée", step: 6, kind: "open", phase: "visit",
    msg: { en: "A selection of projects has been sent to {lead}. Our advisor follows up within 48 hours.", fr: "Une sélection de projets a été envoyée à {lead}. Notre conseiller relance sous 48 heures." },
    hint: { en: "A quick message from you asking {lead} what they thought of the selection often speeds things up.", fr: "Un petit message de votre part pour demander à {lead} ce qu'il a pensé de la sélection accélère souvent les choses." },
  },
  {
    key: "visite_planifiee", en: "Viewing scheduled", fr: "Visite planifiée", step: 7, kind: "open", phase: "visit",
    msg: { en: "A viewing, on site or virtual, is scheduled with {lead}.", fr: "Une visite, sur place ou virtuelle, est planifiée avec {lead}." },
  },
  {
    key: "visite_effectuee", en: "Viewing done", fr: "Visite effectuée", step: 8, kind: "open", phase: "visit",
    msg: { en: "{lead} has viewed the shortlisted projects. Our advisor is collecting feedback and refining the options.", fr: "{lead} a visité les projets sélectionnés. Notre conseiller recueille ses retours et affine les options." },
  },
  {
    key: "offre_envoyee", en: "Offer sent", fr: "Offre envoyée", step: 9, kind: "open", phase: "offer",
    msg: { en: "An offer has been sent to {lead}. We are awaiting the decision.", fr: "Une offre a été envoyée à {lead}. Nous attendons sa décision." },
  },
  {
    key: "en_negociation", en: "Negotiation", fr: "Négociation", step: 10, kind: "open", phase: "offer",
    msg: { en: "{lead} is negotiating the terms (unit, price, payment plan). Our advisor handles it directly with the developer.", fr: "{lead} négocie les conditions (unité, prix, plan de paiement). Notre conseiller gère cela directement avec le promoteur." },
  },
  {
    key: "offre_acceptee", en: "Offer accepted", fr: "Offre acceptée", step: 11, kind: "won", phase: "closing",
    msg: { en: "{lead} accepted the offer. Your commission is being estimated and will appear in your dashboard.", fr: "{lead} a accepté l'offre. Votre commission est en cours d'estimation et apparaîtra dans votre tableau de bord." },
  },
  {
    key: "booking", en: "Booking paid", fr: "Réservation payée", step: 12, kind: "won", phase: "closing",
    msg: { en: "{lead} paid the booking fee. The developer is preparing the sales agreement.", fr: "{lead} a payé les frais de réservation. Le promoteur prépare le contrat de vente." },
  },
  {
    key: "spa_signe", en: "SPA signed", fr: "SPA signé", step: 13, kind: "won", phase: "closing",
    msg: { en: "The Sales and Purchase Agreement is signed. The transaction is now registered with the developer.", fr: "Le contrat de vente (SPA) est signé. La transaction est enregistrée auprès du promoteur." },
  },
  {
    key: "dp_paye", en: "Down payment paid", fr: "Apport payé", step: 14, kind: "won", phase: "closing",
    msg: { en: "The down payment is paid. Your commission moves to validation, payable within 7 days of the developer's payment to Cevitas.", fr: "L'apport est payé. Votre commission passe en validation, payable sous 7 jours après le paiement du promoteur à Cevitas." },
  },
  {
    key: "injoignable", en: "Unreachable", fr: "Injoignable", step: 0, kind: "paused", phase: "closed",
    msg: { en: "After several attempts our team could not reach {lead}. The lead stays open; a word from you can restart it.", fr: "Après plusieurs tentatives, notre équipe n'a pas pu joindre {lead}. Le lead reste ouvert ; un mot de votre part peut le relancer." },
    hint: { en: "Check with {lead} that the phone number is correct and that they expect our call.", fr: "Vérifiez avec {lead} que le numéro est correct et qu'il attend notre appel." },
  },
  {
    key: "en_pause", en: "On hold", fr: "En pause", step: 0, kind: "paused", phase: "closed",
    msg: { en: "{lead} asked to pause for now. Our advisor will follow up on the agreed date.", fr: "{lead} a demandé une pause pour le moment. Notre conseiller relancera à la date convenue." },
  },
  {
    key: "offre_refusee", en: "Offer declined", fr: "Offre refusée", step: 0, kind: "lost", phase: "closed",
    msg: { en: "{lead} declined the offer. Our advisor will propose alternatives if {lead} remains interested.", fr: "{lead} a refusé l'offre. Notre conseiller proposera des alternatives si {lead} reste intéressé." },
  },
  {
    key: "pas_interesse", en: "Not interested", fr: "Pas intéressé", step: 0, kind: "lost", phase: "closed",
    msg: { en: "{lead} is not interested at this time. The lead stays attributed to you for 12 months if things change.", fr: "{lead} n'est pas intéressé pour le moment. Le lead vous reste attribué pendant 12 mois si la situation évolue." },
  },
  {
    key: "perdu", en: "Lost", fr: "Perdu", step: 0, kind: "lost", phase: "closed",
    msg: { en: "This lead is closed as lost. Thank you for the introduction; the next one may be the right one.", fr: "Ce lead est clôturé comme perdu. Merci pour l'introduction ; le prochain sera peut-être le bon." },
  },
];

export const LOST_REASONS: { key: string; en: string; fr: string }[] = [
  { key: "budget", en: "Budget too low", fr: "Budget insuffisant" },
  { key: "timing", en: "Not the right time", fr: "Pas le bon moment" },
  { key: "bought_elsewhere", en: "Bought elsewhere", fr: "A acheté ailleurs" },
  { key: "not_interested", en: "Not interested in Dubai", fr: "Pas intéressé par Dubaï" },
  { key: "unreachable", en: "Never reachable", fr: "Jamais joignable" },
  { key: "other", en: "Other", fr: "Autre" },
];

/** Legacy values still present in older rows → canonical keys. */
export const LEGACY_LEAD_STAGE: Record<string, string> = {
  "contacté": "premier_appel", contacte: "premier_appel", "qualifié": "qualifie", "négociation": "en_negociation", negociation: "en_negociation",
  closing: "dp_paye", lost: "perdu", new: "nouveau",
};

export const normalizeLeadStage = (key?: string | null): string => (key && (LEGACY_LEAD_STAGE[key] ?? key)) || "nouveau";
export const leadStage = (key?: string | null): LeadStage => LEAD_STAGES.find((s) => s.key === normalizeLeadStage(key)) ?? LEAD_STAGES[0];
export const leadStageText = (key: string | null | undefined, lang: "en" | "fr", leadFirstName: string) => {
  const s = leadStage(key);
  const fill = (t: string) => t.split("{lead}").join(leadFirstName || (lang === "fr" ? "votre lead" : "your lead"));
  return { label: s[lang], msg: fill(s.msg[lang]), hint: s.hint ? fill(s.hint[lang]) : null };
};
