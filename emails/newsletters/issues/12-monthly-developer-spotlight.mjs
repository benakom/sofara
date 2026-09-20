import { closing } from "../common.mjs";

export default {
  id: "12-monthly-developer-spotlight",
  sequence: "monthly",
  day: null,
  subject: {
    en: "Emaar, Sobha, DAMAC, Nakheel: which developer for which client",
    fr: "Emaar, Sobha, DAMAC, Nakheel : quel promoteur pour quel client",
  },
  preview: {
    en: "The developer map our advisors use, and what each pays you.",
    fr: "La carte des promoteurs utilisée par nos conseillers, et ce que chacun vous rapporte.",
  },
  blocks: {
    en: [
      ["h1", "Project tips: reading the developer landscape"],
      ["p", "You do not need to sell a project. But when a contact says \"I heard Emaar is the safest\" or \"DAMAC is cheaper\", it helps to know what our advisors know. Here is the map."],
      ["table", { head: ["Developer", "Known for", "Typical buyer", "Your rate"], rows: [
        ["Emaar", "Downtown, Dubai Hills, Creek Harbour. Master communities, strong resale liquidity", "Conservative investor, end user", "3%"],
        ["Sobha", "Sobha Hartland, in-house construction, finishing quality", "Quality-focused end user, family", "3%"],
        ["DAMAC", "DAMAC Hills, Lagoons. Volume, branded residences, aggressive payment plans", "Entry-level investor, payment plan seeker", "2.5%"],
        ["Nakheel", "Palm Jumeirah, Jumeirah Islands, The World. Waterfront land bank", "Premium and ultra-premium", "2.5% to 3%"],
        ["Aldar", "Abu Dhabi leader: Yas, Saadiyat. Now in Dubai", "Abu Dhabi-curious investor", "2.5% to 3%"],
        ["Binghatti", "Business Bay, JVC. Design-led towers, fast delivery", "Yield investor, smaller ticket", "2.5% to 3%"],
      ]}],
      ["p", "Rates are indicative and confirmed per deal in your portal."],
      ["h2", "Three things our advisors check before recommending a project"],
      ["ol", [
        "**Escrow and RERA registration.** Every legitimate off-plan project has a DLD escrow account number and a RERA project number. No number, no recommendation.",
        "**Delivery track record.** Has the developer handed over previous phases on time? Delays of 6 to 12 months are common; chronic delays are a red flag.",
        "**Exit liquidity.** Is there a resale market in that community? A cheap unit in a community with no secondary demand is not cheap.",
      ]],
      ["h2", "How to use this with a contact"],
      ["p", "When someone names a developer, do not confirm or contradict. Say: **\"The team works with all the major developers and will show you what fits your budget and timeline, not what pays them the most.\"** Then add them to your pipeline. That sentence is true, and it is the reason clients trust a brokerage over a developer's own sales office."],
      ["callout", "**Pro members** can open the full project library in their dashboard, with brochures, floor plans and payment schedules per developer, and forward a project summary in one click."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Conseils projets : lire le paysage des promoteurs"],
      ["p", "Vous n'avez pas à vendre un projet. Mais quand un contact dit « on m'a dit qu'Emaar est le plus sûr » ou « DAMAC est moins cher », il est utile de savoir ce que savent nos conseillers. Voici la carte."],
      ["table", { head: ["Promoteur", "Connu pour", "Acheteur type", "Votre taux"], rows: [
        ["Emaar", "Downtown, Dubai Hills, Creek Harbour. Communautés intégrées, forte liquidité à la revente", "Investisseur prudent, utilisateur final", "3 %"],
        ["Sobha", "Sobha Hartland, construction en interne, qualité des finitions", "Utilisateur final exigeant, famille", "3 %"],
        ["DAMAC", "DAMAC Hills, Lagoons. Volume, résidences de marque, plans de paiement agressifs", "Investisseur d'entrée de gamme, chercheur de plan de paiement", "2,5 %"],
        ["Nakheel", "Palm Jumeirah, Jumeirah Islands, The World. Foncier en bord de mer", "Premium et ultra-premium", "2,5 % à 3 %"],
        ["Aldar", "Leader d'Abu Dhabi : Yas, Saadiyat. Désormais à Dubaï", "Investisseur curieux d'Abu Dhabi", "2,5 % à 3 %"],
        ["Binghatti", "Business Bay, JVC. Tours design, livraison rapide", "Investisseur de rendement, petit ticket", "2,5 % à 3 %"],
      ]}],
      ["p", "Taux indicatifs, confirmés pour chaque dossier dans votre portail."],
      ["h2", "Trois vérifications de nos conseillers avant de recommander un projet"],
      ["ol", [
        "**Escrow et enregistrement RERA.** Tout projet off-plan légitime a un numéro de compte séquestre DLD et un numéro de projet RERA. Pas de numéro, pas de recommandation.",
        "**Historique de livraison.** Le promoteur a-t-il livré ses phases précédentes à temps ? Des retards de 6 à 12 mois sont courants ; des retards chroniques sont un signal d'alerte.",
        "**Liquidité à la sortie.** Existe-t-il un marché de revente dans ce quartier ? Une unité bon marché dans un quartier sans demande secondaire n'est pas bon marché.",
      ]],
      ["h2", "Comment l'utiliser avec un contact"],
      ["p", "Quand quelqu'un cite un promoteur, ne confirmez ni ne contredisez. Dites : **« L'équipe travaille avec tous les grands promoteurs et te montrera ce qui correspond à ton budget et ton calendrier, pas ce qui la paie le plus. »** Puis ajoutez-le à votre pipeline. Cette phrase est vraie, et c'est la raison pour laquelle les clients font confiance à une agence plutôt qu'au bureau de vente d'un promoteur."],
      ["callout", "**Les membres Pro** peuvent ouvrir la bibliothèque complète de projets dans leur tableau de bord, avec brochures, plans et échéanciers par promoteur, et transférer un résumé de projet en un clic."],
      ...closing("fr"),
    ],
  },
};
