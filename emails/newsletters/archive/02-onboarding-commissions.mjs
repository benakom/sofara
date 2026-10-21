import { closing, ctaDashboard } from "../common.mjs";

export default {
  id: "02-onboarding-commissions",
  sequence: "onboarding",
  day: 2,
  subject: {
    en: "How your Sofara commission is calculated (with real numbers)",
    fr: "Comment votre commission Sofara est calculée (avec de vrais chiffres)",
  },
  preview: {
    en: "Up to 3% of the property value. AED 21,000 to AED 600,000 per deal.",
    fr: "Jusqu'à 3 % de la valeur du bien. De AED 21 000 à AED 600 000 par dossier.",
  },
  blocks: {
    en: [
      ["h1", "Your commission, deal by deal"],
      ["p", "Most referral programmes pay a flat fee or a slice of the agency fee. Sofara pays you on the **property value**, because Dubai developers pay brokerages a commission on the full price. Here is what that means in practice."],
      ["table", { head: ["Property price", "Your commission at 3%"], rows: [
        ["AED 700,000 (studio)", "AED 21,000"],
        ["AED 1,200,000 (1-bed)", "AED 36,000"],
        ["AED 2,500,000 (2-bed)", "AED 75,000"],
        ["AED 4,000,000 (villa)", "AED 120,000"],
        ["AED 10,000,000", "AED 300,000"],
      ]}],
      ["h2", "By developer"],
      ["p", "The rate depends on the developer's own commission structure. Indicative rates: **Emaar 3%**, **Sobha 3%**, **DAMAC 2.5%**, Nakheel, Aldar and Binghatti 2.5% to 3%. The exact rate for each deal is visible in your portal before the client signs."],
      ["h2", "When you get paid"],
      ["ul", [
        "The client signs the Sales and Purchase Agreement (SPA) and pays the down payment with the DLD fees. This is the moment your commission is earned.",
        "The developer pays Cevitas the brokerage commission.",
        "Your share is transferred in AED within 7 days of closing, against an invoice you issue from your dashboard.",
      ]],
      ["callout", "**Off-plan closes faster than you think.** A motivated buyer can go from first call to booking in under two weeks. The developer commission on off-plan typically follows the down payment, not the handover."],
      ["h2", "What protects you"],
      ["ul", [
        "**12-month attribution.** A lead registered under your name stays yours for 12 months, even if they buy on a different project than the one they first asked about.",
        "**Full transparency.** Each lead shows its stage: new, prequalified, qualified, offer sent, offer accepted, booking paid, down payment paid. Each commission shows estimated, validated or paid.",
        "**No cost to you.** No registration fee, no subscription, no quota.",
      ]],
      ctaDashboard.en,
      ["p", "The maths only works if leads come in. One introduction of an AED 2 million buyer pays more than most people earn in a month. Who in your network is that buyer?"],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Votre commission, dossier par dossier"],
      ["p", "La plupart des programmes de parrainage versent un forfait ou une part des honoraires d'agence. Sofara vous paie sur la **valeur du bien**, car les promoteurs de Dubaï versent aux agences une commission sur le prix total. Concrètement :"],
      ["table", { head: ["Prix du bien", "Votre commission à 3 %"], rows: [
        ["AED 700 000 (studio)", "AED 21 000"],
        ["AED 1 200 000 (1 chambre)", "AED 36 000"],
        ["AED 2 500 000 (2 chambres)", "AED 75 000"],
        ["AED 4 000 000 (villa)", "AED 120 000"],
        ["AED 10 000 000", "AED 300 000"],
      ]}],
      ["h2", "Par promoteur"],
      ["p", "Le taux dépend de la structure de commission du promoteur. Taux indicatifs : **Emaar 3 %**, **Sobha 3 %**, **DAMAC 2,5 %**, Nakheel, Aldar et Binghatti entre 2,5 % et 3 %. Le taux exact de chaque dossier est visible dans votre portail avant la signature du client."],
      ["h2", "Quand vous êtes payé"],
      ["ul", [
        "Le client signe le contrat de vente (SPA) et règle l'apport avec les frais DLD. C'est à ce moment que votre commission est acquise.",
        "Le promoteur verse à Cevitas la commission d'agence.",
        "Votre part est virée en AED sous 7 jours après le closing, contre une facture que vous émettez depuis votre tableau de bord.",
      ]],
      ["callout", "**L'off-plan se conclut plus vite qu'on ne le pense.** Un acheteur motivé passe du premier appel à la réservation en moins de deux semaines. La commission promoteur sur l'off-plan suit généralement l'apport initial, pas la livraison."],
      ["h2", "Ce qui vous protège"],
      ["ul", [
        "**Attribution 12 mois.** Un lead enregistré à votre nom vous reste attribué 12 mois, même s'il achète un autre projet que celui évoqué au départ.",
        "**Transparence totale.** Chaque lead affiche son étape : nouveau, préqualifié, qualifié, offre envoyée, offre acceptée, réservation payée, apport payé. Chaque commission affiche estimée, validée ou payée.",
        "**Aucun coût pour vous.** Pas de frais d'inscription, pas d'abonnement, pas de quota.",
      ]],
      ctaDashboard.fr,
      ["p", "Le calcul ne fonctionne que si des leads arrivent. Une seule introduction d'un acheteur à AED 2 millions rapporte plus qu'un mois de salaire pour la plupart des gens. Qui, dans votre réseau, est cet acheteur ?"],
      ...closing("fr"),
    ],
  },
};
