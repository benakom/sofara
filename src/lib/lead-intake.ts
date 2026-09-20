// Lead intake catalog: how the ambassador knows the lead, how consent was obtained,
// buyer intent options, and the consent-first policy. Pure data + validation.

export type L2 = { en: string; fr: string };

export const RELATIONSHIPS: { key: string; label: L2; hint: L2; needsCampaign?: boolean; needsProfile?: boolean }[] = [
  { key: "personal", label: { en: "Personal network (family, friend, colleague)", fr: "Réseau personnel (famille, ami, collègue)" }, hint: { en: "Tell us how you know them and since when.", fr: "Dites-nous comment vous le connaissez et depuis quand." } },
  { key: "client", label: { en: "My own client (agent, advisor, consultant)", fr: "Mon propre client (agent, conseiller, consultant)" }, hint: { en: "Describe the service you provide them and the context of the Dubai request.", fr: "Décrivez le service que vous lui rendez et le contexte de sa demande pour Dubaï." } },
  { key: "community", label: { en: "Member of a community or group I run", fr: "Membre d'une communauté ou d'un groupe que j'anime" }, hint: { en: "Name the community and explain how this person asked about Dubai.", fr: "Nommez la communauté et expliquez comment cette personne a demandé des informations sur Dubaï." } },
  { key: "campaign", label: { en: "Captured by my marketing campaign (ads, landing page)", fr: "Capté par ma campagne marketing (publicités, page d'atterrissage)" }, hint: { en: "Give the campaign name, the platform and the form or page the person filled.", fr: "Indiquez le nom de la campagne, la plateforme et le formulaire ou la page remplie." }, needsCampaign: true },
  { key: "content", label: { en: "Follower of my content (influencer, creator)", fr: "Abonné à mon contenu (influenceur, créateur)" }, hint: { en: "Give your profile link and explain how this person asked you to be put in touch.", fr: "Indiquez le lien de votre profil et expliquez comment cette personne vous a demandé la mise en relation." }, needsProfile: true },
  { key: "event", label: { en: "Met at an event or meeting", fr: "Rencontré lors d'un événement ou d'un rendez-vous" }, hint: { en: "Which event, when, and what did they ask?", fr: "Quel événement, quand, et qu'a demandé cette personne ?" } },
  { key: "other", label: { en: "Other", fr: "Autre" }, hint: { en: "Explain precisely how you know this person.", fr: "Expliquez précisément comment vous connaissez cette personne." } },
];

export const CONSENT_METHODS: { key: string; label: L2; desc: L2 }[] = [
  { key: "written", label: { en: "In writing (WhatsApp, DM, email)", fr: "Par écrit (WhatsApp, DM, email)" }, desc: { en: "The person wrote that Sofara may contact them. Keep the message.", fr: "La personne a écrit que Sofara peut la contacter. Conservez le message." } },
  { key: "form", label: { en: "Through a form or opt-in", fr: "Via un formulaire ou un opt-in" }, desc: { en: "The person filled a form mentioning Sofara or a Dubai property advisor.", fr: "La personne a rempli un formulaire mentionnant Sofara ou un conseiller immobilier à Dubaï." } },
  { key: "verbal", label: { en: "Verbally (call or in person)", fr: "Oralement (appel ou en personne)" }, desc: { en: "The person explicitly agreed, and expects a call from Sofara.", fr: "La personne a explicitement accepté et attend un appel de Sofara." } },
];

export const BUDGET_RANGES: { key: string; label: L2 }[] = [
  { key: "lt_1m", label: { en: "Under AED 1M", fr: "Moins de AED 1M" } },
  { key: "1m_2m", label: { en: "AED 1M – 2M", fr: "AED 1M – 2M" } },
  { key: "2m_4m", label: { en: "AED 2M – 4M", fr: "AED 2M – 4M" } },
  { key: "4m_8m", label: { en: "AED 4M – 8M", fr: "AED 4M – 8M" } },
  { key: "gt_8m", label: { en: "Above AED 8M", fr: "Plus de AED 8M" } },
  { key: "unknown", label: { en: "Not discussed yet", fr: "Pas encore abordé" } },
];

export const TIMELINES: { key: string; label: L2 }[] = [
  { key: "0_3", label: { en: "Within 3 months", fr: "Sous 3 mois" } },
  { key: "3_6", label: { en: "3 to 6 months", fr: "3 à 6 mois" } },
  { key: "6_12", label: { en: "6 to 12 months", fr: "6 à 12 mois" } },
  { key: "gt_12", label: { en: "More than a year", fr: "Plus d'un an" } },
  { key: "unknown", label: { en: "Not discussed yet", fr: "Pas encore abordé" } },
];

export const PURPOSES: { key: string; label: L2 }[] = [
  { key: "investment", label: { en: "Investment (rental yield, resale)", fr: "Investissement (rendement, revente)" } },
  { key: "residence", label: { en: "Own residence / relocation", fr: "Résidence principale / expatriation" } },
  { key: "golden_visa", label: { en: "Golden Visa", fr: "Golden Visa" } },
  { key: "holiday_home", label: { en: "Holiday home", fr: "Résidence secondaire" } },
  { key: "unknown", label: { en: "Not sure yet", fr: "Pas encore défini" } },
];

export const CHANNELS: { key: string; label: L2 }[] = [
  { key: "whatsapp", label: { en: "WhatsApp", fr: "WhatsApp" } },
  { key: "call", label: { en: "Phone call", fr: "Appel téléphonique" } },
  { key: "email", label: { en: "Email", fr: "Email" } },
];

export const LEAD_LANGUAGES: { key: string; label: L2 }[] = [
  { key: "en", label: { en: "English", fr: "Anglais" } },
  { key: "fr", label: { en: "French", fr: "Français" } },
  { key: "ar", label: { en: "Arabic", fr: "Arabe" } },
  { key: "other", label: { en: "Other", fr: "Autre" } },
];

export const CONSENT_STATUS: Record<string, { label: L2; className: string }> = {
  unverified: { label: { en: "Consent to verify", fr: "Consentement à vérifier" }, className: "bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]" },
  verified: { label: { en: "Consent verified", fr: "Consentement vérifié" }, className: "bg-[#22C55E]/12 text-[#22C55E]" },
  disputed: { label: { en: "Consent disputed", fr: "Consentement contesté" }, className: "bg-[#EF4444]/12 text-[#EF4444]" },
};

/** The consent-first policy, shown before any lead is submitted. */
export const CONSENT_POLICY: { title: L2; intro: L2; rules: L2[]; consequences: L2 } = {
  title: { en: "Consent-first policy", fr: "Règle du consentement d'abord" },
  intro: {
    en: "Sofara only contacts people who asked to be contacted. A lead is a person who knows you, has expressed interest in buying in Dubai, and has explicitly agreed that you share their contact with Sofara.",
    fr: "Sofara ne contacte que des personnes qui ont demandé à l'être. Un lead est une personne qui vous connaît, a exprimé son intérêt pour un achat à Dubaï, et a explicitement accepté que vous partagiez son contact avec Sofara.",
  },
  rules: [
    { en: "Never submit contacts found in groups, forums, comment threads, listings, purchased lists or scraped from social media.", fr: "Ne soumettez jamais des contacts trouvés dans des groupes, forums, fils de commentaires, annonces, listes achetées ou extraits des réseaux sociaux." },
    { en: "Never submit a person who has not been told that Sofara will call them.", fr: "Ne soumettez jamais une personne qui n'a pas été prévenue que Sofara l'appellera." },
    { en: "Media buyers: the person must have filled your form or ad, and you must name the campaign.", fr: "Media buyers : la personne doit avoir rempli votre formulaire ou publicité, et vous devez nommer la campagne." },
    { en: "Influencers and creators: the person must have asked you, in a message you can show, to be put in touch.", fr: "Influenceurs et créateurs : la personne doit vous avoir demandé, dans un message que vous pouvez montrer, d'être mise en relation." },
  ],
  consequences: {
    en: "Our advisors confirm consent on the first call. A lead who did not agree is closed as \"Rejected: no consent\", earns no commission, and repeated cases lead to suspension of the ambassador account.",
    fr: "Nos conseillers confirment le consentement dès le premier appel. Un lead qui n'a pas donné son accord est clôturé \"Refusé : pas de consentement\", ne génère aucune commission, et les cas répétés entraînent la suspension du compte ambassadeur.",
  },
};

export const ATTESTATIONS: L2[] = [
  { en: "This person knows me, has shown a real interest in buying property in Dubai, and explicitly agreed that I share their contact details with Sofara and Cevitas Real Estate.", fr: "Cette personne me connaît, a montré un intérêt réel pour un achat immobilier à Dubaï, et a explicitement accepté que je partage ses coordonnées avec Sofara et Cevitas Real Estate." },
  { en: "I did not obtain this contact from a group, forum, listing, purchased list, scraping, or any source where the person did not agree to be contacted.", fr: "Je n'ai pas obtenu ce contact via un groupe, un forum, une annonce, une liste achetée, du scraping, ou toute source où la personne n'a pas accepté d'être contactée." },
  { en: "I understand that Sofara verifies consent on the first call, that a lead without consent earns no commission, and that repeated cases lead to the suspension of my account.", fr: "Je comprends que Sofara vérifie le consentement dès le premier appel, qu'un lead sans consentement ne génère aucune commission, et que les cas répétés entraînent la suspension de mon compte." },
];

export interface LeadIntakeForm {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  lead_country: string;
  lead_language: string;
  relationship: string;
  relationship_details: string;
  campaign_name: string;
  campaign_link: string;
  consent_method: string;
  consent_date: string;
  consent_evidence_url: string;
  budget_range: string;
  timeline: string;
  purpose: string;
  preferred_channel: string;
  best_time: string;
  notes: string;
  attest: boolean[];
}

export const emptyLeadIntake = (): LeadIntakeForm => ({
  first_name: "", last_name: "", phone: "", email: "", lead_country: "", lead_language: "en",
  relationship: "", relationship_details: "", campaign_name: "", campaign_link: "",
  consent_method: "", consent_date: new Date().toISOString().slice(0, 10), consent_evidence_url: "",
  budget_range: "unknown", timeline: "unknown", purpose: "unknown", preferred_channel: "whatsapp", best_time: "", notes: "",
  attest: ATTESTATIONS.map(() => false),
});

export type IntakeErrors = Partial<Record<keyof LeadIntakeForm, L2>>;

const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

/** Client-side validation mirroring the DB trigger `enforce_lead_intake`. */
export function validateLeadIntake(f: LeadIntakeForm): IntakeErrors {
  const e: IntakeErrors = {};
  const req = { en: "Required", fr: "Obligatoire" };
  if (!f.first_name.trim()) e.first_name = req;
  if (!f.last_name.trim()) e.last_name = req;
  if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 8) e.phone = { en: "A valid phone number with country code is required.", fr: "Un numéro de téléphone valide avec indicatif est obligatoire." };
  if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = { en: "Invalid email", fr: "Email invalide" };
  const rel = RELATIONSHIPS.find((r) => r.key === f.relationship);
  if (!rel) e.relationship = req;
  if (f.relationship_details.trim().length < 20) e.relationship_details = { en: "Give at least 20 characters of context.", fr: "Donnez au moins 20 caractères de contexte." };
  if (rel?.needsCampaign) {
    if (!f.campaign_name.trim()) e.campaign_name = { en: "Name the campaign and platform.", fr: "Nommez la campagne et la plateforme." };
    if (!isUrl(f.campaign_link)) e.campaign_link = { en: "Link to the form or landing page (https://...).", fr: "Lien vers le formulaire ou la page (https://...)." };
  }
  if (rel?.needsProfile && !isUrl(f.campaign_link)) e.campaign_link = { en: "Link to your profile or channel (https://...).", fr: "Lien vers votre profil ou votre chaîne (https://...)." };
  if (!CONSENT_METHODS.some((c) => c.key === f.consent_method)) e.consent_method = { en: "Tell us how the person agreed.", fr: "Indiquez comment la personne a donné son accord." };
  if (!f.consent_date) e.consent_date = req;
  else if (new Date(f.consent_date).getTime() > Date.now() + 864e5) e.consent_date = { en: "Date cannot be in the future.", fr: "La date ne peut pas être dans le futur." };
  if (f.consent_evidence_url.trim() && !isUrl(f.consent_evidence_url)) e.consent_evidence_url = { en: "Must be a link (https://...).", fr: "Doit être un lien (https://...)." };
  if (f.attest.some((a) => !a)) e.attest = { en: "All three declarations are required.", fr: "Les trois déclarations sont obligatoires." };
  return e;
}
