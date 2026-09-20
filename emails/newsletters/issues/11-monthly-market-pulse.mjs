import { closing } from "../common.mjs";

// Monthly template. Replace the [[...]] placeholders with the month's DLD figures before sending.
export default {
  id: "11-monthly-market-pulse",
  sequence: "monthly",
  day: null,
  subject: {
    en: "Dubai market pulse, [[MONTH YEAR]]: the 3 numbers to quote this month",
    fr: "Pouls du marché de Dubaï, [[MOIS ANNÉE]] : les 3 chiffres à citer ce mois-ci",
  },
  preview: {
    en: "Transactions, prices, off-plan share. Plus the one-line answer to \"is it too late?\"",
    fr: "Transactions, prix, part de l'off-plan. Et la réponse en une ligne à « est-ce trop tard ? »",
  },
  blocks: {
    en: [
      ["h1", "Market pulse: [[MONTH YEAR]]"],
      ["p", "Three numbers from the Dubai Land Department you can quote to anyone this month. Source them as \"DLD, [[MONTH YEAR]]\"."],
      ["table", { head: ["Indicator", "This month", "Versus last year"], rows: [
        ["Sales transactions", "[[NUMBER]]", "[[+X%]]"],
        ["Total value", "AED [[X]] billion", "[[+X%]]"],
        ["Off-plan share of sales", "[[X%]]", "[[trend]]"],
      ]}],
      ["h2", "What it means for your conversations"],
      ["p", "[[Two or three sentences: which segments moved, which communities led, what developers launched. Keep it factual and cite the source.]]"],
      ["h2", "The objection of the month: \"Is it too late to buy in Dubai?\""],
      ["p", "The honest answer: nobody times a market, but three structural facts do not change with the cycle. Population keeps growing (the emirate targets 5.8 million residents by 2040 under the Dubai 2040 Urban Master Plan), income tax stays at zero, and supply is released in phases through payment plans. A buyer who holds for five years with a 6% to 9% gross yield does not need to time the entry."],
      ["h2", "Project of the month"],
      ["p", "[[Developer, project, community, starting price, payment plan, handover date, why it fits the month's demand. Ambassadors forward this paragraph.]]"],
      ["callout", "**Forward this email.** The three numbers above are the easiest opener you will get this month: \"Dubai just published its [[MONTH]] figures, want me to send you what my team is recommending?\""],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Pouls du marché : [[MOIS ANNÉE]]"],
      ["p", "Trois chiffres du Dubai Land Department à citer à n'importe qui ce mois-ci. Source à indiquer : « DLD, [[MOIS ANNÉE]] »."],
      ["table", { head: ["Indicateur", "Ce mois", "Vs l'an dernier"], rows: [
        ["Transactions de vente", "[[NOMBRE]]", "[[+X %]]"],
        ["Valeur totale", "AED [[X]] milliards", "[[+X %]]"],
        ["Part de l'off-plan", "[[X %]]", "[[tendance]]"],
      ]}],
      ["h2", "Ce que cela change dans vos conversations"],
      ["p", "[[Deux ou trois phrases : quels segments ont bougé, quels quartiers ont mené, quels promoteurs ont lancé. Rester factuel et citer la source.]]"],
      ["h2", "L'objection du mois : « Est-ce trop tard pour acheter à Dubaï ? »"],
      ["p", "La réponse honnête : personne ne « time » un marché, mais trois faits structurels ne changent pas avec le cycle. La population continue de croître (l'émirat vise 5,8 millions de résidents d'ici 2040 dans le cadre du Dubai 2040 Urban Master Plan), l'impôt sur le revenu reste à zéro, et l'offre est libérée par phases via les plans de paiement. Un acheteur qui conserve cinq ans avec un rendement brut de 6 % à 9 % n'a pas besoin de « timer » son entrée."],
      ["h2", "Projet du mois"],
      ["p", "[[Promoteur, projet, quartier, prix de départ, plan de paiement, date de livraison, pourquoi il répond à la demande du mois. Les ambassadeurs transfèrent ce paragraphe.]]"],
      ["callout", "**Transférez cet email.** Les trois chiffres ci-dessus sont la meilleure accroche du mois : « Dubaï vient de publier ses chiffres de [[MOIS]], tu veux que je t'envoie ce que mon équipe recommande ? »"],
      ...closing("fr"),
    ],
  },
};
