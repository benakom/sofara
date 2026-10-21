import { closing } from "../common.mjs";

export default {
  id: "05-onboarding-payment-plans",
  sequence: "onboarding",
  day: 12,
  subject: {
    en: "Off-plan and payment plans: the 3-minute version for your contacts",
    fr: "Off-plan et plans de paiement : la version 3 minutes pour vos contacts",
  },
  preview: {
    en: "60/40, 70/30, post-handover. What each means and who it suits.",
    fr: "60/40, 70/30, post-livraison. Ce que chacun signifie et à qui il convient.",
  },
  blocks: {
    en: [
      ["h1", "Project tips: how off-plan payment plans work"],
      ["p", "Most of the deals Cevitas closes are **off-plan**: the buyer purchases from the developer before or during construction. Two reasons: prices are lower than completed property in the same area, and the developer spreads the payments. This is the argument that unlocks buyers who \"cannot afford Dubai\"."],
      ["h2", "The four plan types"],
      ["table", { head: ["Plan", "How it works", "Example on AED 2M"], rows: [
        ["60/40", "10% at booking, 50% during construction, 40% at handover", "200K, then 1M over 2 to 3 years, then 800K"],
        ["70/30", "70% during construction, 30% at handover", "1.4M spread, then 600K"],
        ["80/20", "80% during construction, 20% at handover. Common on premium projects", "1.6M spread, then 400K"],
        ["Post-handover", "10% to 20% booking, 20% to 30% during construction, 50% to 60% over 2 to 5 years after keys", "Rental income covers a large part of the remaining instalments"],
      ]}],
      ["p", "Some developers also offer **1% per month** plans. All are interest-free: the developer is the lender."],
      ["h2", "How to pitch each one"],
      ["ul", [
        "**Investor with cash**: 60/40 or 70/30 on a project 2 years from handover. Lowest entry price, resale option before completion.",
        "**Buyer with income but little savings**: post-handover plan. They move in or rent out, then pay the balance from rent.",
        "**End user relocating**: choose by handover date and community, not by plan. Schools, commute, lifestyle.",
      ]],
      ["h2", "Three tips before you talk about a project"],
      ["ol", [
        "**Never quote a price from memory.** Prices move weekly and units sell out. Say \"the team will send today's availability\".",
        "**Ask for the buyer's budget range and timeline**, nothing else. That is enough for our advisors to shortlist.",
        "**Do not compare developers yourself.** Emaar, Sobha, DAMAC, Nakheel, Binghatti each suit different buyers. That comparison is our job, and it is where the licence matters.",
      ]],
      ["callout", "**Pro members** get the project library and the payment plan simulator inside their dashboard, so they can show a contact the exact instalment schedule. Upgrade is free and reserved for real estate professionals."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Conseils projets : comment fonctionnent les plans de paiement off-plan"],
      ["p", "La plupart des dossiers conclus par Cevitas sont en **off-plan** : l'acheteur achète au promoteur avant ou pendant la construction. Deux raisons : les prix sont inférieurs à ceux du bâti dans le même quartier, et le promoteur étale les paiements. C'est l'argument qui débloque les acheteurs qui « n'ont pas les moyens pour Dubaï »."],
      ["h2", "Les quatre types de plans"],
      ["table", { head: ["Plan", "Fonctionnement", "Exemple sur AED 2M"], rows: [
        ["60/40", "10 % à la réservation, 50 % pendant la construction, 40 % à la livraison", "200K, puis 1M sur 2 à 3 ans, puis 800K"],
        ["70/30", "70 % pendant la construction, 30 % à la livraison", "1,4M étalés, puis 600K"],
        ["80/20", "80 % pendant la construction, 20 % à la livraison. Fréquent sur les projets premium", "1,6M étalés, puis 400K"],
        ["Post-livraison", "10 % à 20 % à la réservation, 20 % à 30 % pendant la construction, 50 % à 60 % sur 2 à 5 ans après les clés", "Les loyers couvrent une grande partie des échéances restantes"],
      ]}],
      ["p", "Certains promoteurs proposent aussi des plans à **1 % par mois**. Tous sont sans intérêts : le promoteur joue le rôle de la banque."],
      ["h2", "Comment présenter chaque plan"],
      ["ul", [
        "**Investisseur avec liquidités** : 60/40 ou 70/30 sur un projet livré dans 2 ans. Prix d'entrée le plus bas, option de revente avant livraison.",
        "**Acheteur avec revenus mais peu d'épargne** : plan post-livraison. Il emménage ou loue, puis paie le solde avec les loyers.",
        "**Utilisateur final qui s'installe** : choisir selon la date de livraison et le quartier, pas selon le plan. Écoles, trajets, mode de vie.",
      ]],
      ["h2", "Trois conseils avant de parler d'un projet"],
      ["ol", [
        "**Ne citez jamais un prix de mémoire.** Les prix bougent chaque semaine et les unités partent. Dites « l'équipe t'envoie les disponibilités du jour ».",
        "**Demandez la fourchette de budget et le calendrier de l'acheteur**, rien d'autre. C'est suffisant pour que nos conseillers fassent une sélection.",
        "**Ne comparez pas les promoteurs vous-même.** Emaar, Sobha, DAMAC, Nakheel, Binghatti conviennent chacun à des acheteurs différents. Cette comparaison est notre travail, et c'est là que la licence compte.",
      ]],
      ["callout", "**Les membres Pro** disposent de la bibliothèque de projets et du simulateur de plan de paiement dans leur tableau de bord, pour montrer à un contact l'échéancier exact. Le passage à Pro est gratuit et réservé aux professionnels de l'immobilier."],
      ...closing("fr"),
    ],
  },
};
