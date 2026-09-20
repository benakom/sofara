import { closing } from "../common.mjs";

export default {
  id: "13-monthly-legal-corner",
  sequence: "monthly",
  day: null,
  subject: {
    en: "Legal corner: the 5 documents behind every Dubai purchase",
    fr: "Rubrique juridique : les 5 documents derrière chaque achat à Dubaï",
  },
  preview: {
    en: "Reservation form, SPA, Oqood, escrow, title deed. Explained for your contacts.",
    fr: "Formulaire de réservation, SPA, Oqood, escrow, titre de propriété. Expliqués pour vos contacts.",
  },
  blocks: {
    en: [
      ["h1", "Legal corner: from reservation to title deed"],
      ["p", "\"What do I actually sign?\" is the question that stalls hesitant buyers. Here is the sequence, so you can reassure a contact in two minutes and then hand over to the Cevitas team."],
      ["ol", [
        "**Reservation form and booking deposit.** The buyer reserves a unit with a deposit, typically 5% to 20% of the price, paid to the developer's DLD escrow account. Never to an individual.",
        "**Sales and Purchase Agreement (SPA).** The contract with the developer: price, payment schedule, specifications, handover date, penalties for delay. Cevitas reviews it with the buyer before signing.",
        "**Oqood registration.** The DLD registers the off-plan sale in the Oqood system in the buyer's name. The 4% DLD fee is paid at this stage (developers sometimes cover part of it during promotions).",
        "**Escrow-linked instalments.** Each instalment goes to the project escrow account and is released to the developer only against certified construction progress. This is the buyer's structural protection under Dubai Law 8 of 2007.",
        "**Handover and title deed.** After completion inspection and final payment, DLD issues the title deed. The buyer owns the unit outright and can rent, sell or occupy it.",
      ]],
      ["h2", "Three questions contacts always ask"],
      ["ul", [
        "**\"Can I sell before handover?\"** Yes, once a minimum share of the price is paid (often 30% to 40%, set by the developer) and with a developer no-objection certificate.",
        "**\"What if the developer is late?\"** The SPA sets the grace period and penalties. Escrow means the money is not lost; DLD can reassign or refund stalled projects under the cancelled-projects framework.",
        "**\"Can I buy remotely?\"** Yes. SPA signature and DLD registration can be done through a power of attorney or the developer's digital process. Most of our international buyers never travel for the purchase.",
      ]],
      ["callout", "**You explain the sequence, you never advise on the documents.** Reviewing an SPA is regulated activity. When a contact reaches that stage, they are already with Cevitas, and your commission is already attached to the deal."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Rubrique juridique : de la réservation au titre de propriété"],
      ["p", "« Qu'est-ce que je signe exactement ? » est la question qui bloque les acheteurs hésitants. Voici la séquence, pour rassurer un contact en deux minutes puis passer le relais à l'équipe Cevitas."],
      ["ol", [
        "**Formulaire de réservation et dépôt.** L'acheteur réserve une unité avec un dépôt, généralement 5 % à 20 % du prix, versé sur le compte séquestre DLD du promoteur. Jamais à un particulier.",
        "**Sales and Purchase Agreement (SPA).** Le contrat avec le promoteur : prix, échéancier, spécifications, date de livraison, pénalités de retard. Cevitas le passe en revue avec l'acheteur avant signature.",
        "**Enregistrement Oqood.** Le DLD enregistre la vente off-plan dans le système Oqood au nom de l'acheteur. Les 4 % de frais DLD sont réglés à cette étape (les promoteurs en prennent parfois une partie en charge lors de promotions).",
        "**Échéances liées à l'escrow.** Chaque échéance va sur le compte séquestre du projet et n'est libérée au promoteur que contre un avancement de construction certifié. C'est la protection structurelle de l'acheteur en vertu de la loi 8 de 2007 de Dubaï.",
        "**Livraison et titre de propriété.** Après inspection et paiement final, le DLD émet le titre de propriété. L'acheteur est pleinement propriétaire et peut louer, vendre ou occuper le bien.",
      ]],
      ["h2", "Trois questions que les contacts posent toujours"],
      ["ul", [
        "**« Puis-je revendre avant la livraison ? »** Oui, une fois une part minimale du prix payée (souvent 30 % à 40 %, fixée par le promoteur) et avec un certificat de non-objection du promoteur.",
        "**« Et si le promoteur est en retard ? »** Le SPA fixe le délai de grâce et les pénalités. L'escrow signifie que l'argent n'est pas perdu ; le DLD peut réattribuer ou rembourser les projets à l'arrêt dans le cadre du dispositif des projets annulés.",
        "**« Puis-je acheter à distance ? »** Oui. La signature du SPA et l'enregistrement DLD peuvent se faire par procuration ou via le processus numérique du promoteur. La plupart de nos acheteurs internationaux ne se déplacent jamais pour l'achat.",
      ]],
      ["callout", "**Vous expliquez la séquence, vous ne conseillez jamais sur les documents.** Relire un SPA est une activité réglementée. Quand un contact atteint cette étape, il est déjà chez Cevitas, et votre commission est déjà rattachée au dossier."],
      ...closing("fr"),
    ],
  },
};
