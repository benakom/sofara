import { closing, ctaDashboard } from "../common.mjs";

// For dormant / long-standing ambassadors: what changed at Sofara, why come back now.
export default {
  id: "15-monthly-reactivation",
  sequence: "monthly",
  day: null,
  subject: {
    en: "{{first_name}}, Sofara has changed since you joined. Here is what is new.",
    fr: "{{first_name}}, Sofara a changé depuis votre inscription. Voici les nouveautés.",
  },
  preview: {
    en: "Ambassador+, Pro tools, SofarAI, simulators. Your link still works.",
    fr: "Ambassadeur+, outils Pro, SofarAI, simulateurs. Votre lien fonctionne toujours.",
  },
  blocks: {
    en: [
      ["h1", "What is new at Sofara"],
      ["p", "{{first_name}}, you registered as a Sofara ambassador some time ago. Whether you have referred ten buyers or none yet, your account is active and your link is still yours: {{referral_link}}"],
      ["p", "Since you joined, the platform has changed a lot. In order of what matters to your income:"],
      ["h2", "1. Ambassador+ pays you on other people's deals"],
      ["p", "Recruit one ambassador through your link and you earn a **10% bonus on every transaction they close**, for as long as both accounts are active. One good recruit, a real estate agent abroad for example, can be worth more than your own referrals."],
      ["h2", "2. Sofara Pro, free for real estate professionals"],
      ["ul", [
        "**Project library**: every developer, brochures, floor plans, payment schedules.",
        "**Simulators**: DLD fees and payment plans, to show a contact the exact numbers.",
        "**SofarAI**: writes your WhatsApp and LinkedIn messages, scores your leads.",
        "**Legal AI**: answers regulatory questions in plain language.",
        "**Community**: other ambassadors, events, what is working now.",
      ]],
      ["h2", "3. A transparent pipeline"],
      ["p", "Each lead now shows its stage from new to down payment paid, and each commission its status from estimated to paid. You see exactly where every introduction stands."],
      ["h2", "4. A monthly briefing"],
      ["p", "This email is the first of a monthly series: market numbers to quote, developer and project focus, legal corner, and scripts. Everything is written so you can forward it."],
      ctaDashboard.en,
      ["callout", "**The market has not waited.** Dubai recorded its highest transaction volumes ever in 2024 and 2025. Your contacts have been reading about it. The only question is whether they buy through your link or someone else's."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Les nouveautés Sofara"],
      ["p", "{{first_name}}, vous vous êtes inscrit comme ambassadeur Sofara il y a quelque temps. Que vous ayez recommandé dix acheteurs ou aucun pour l'instant, votre compte est actif et votre lien est toujours le vôtre : {{referral_link}}"],
      ["p", "Depuis votre inscription, la plateforme a beaucoup évolué. Par ordre d'importance pour vos revenus :"],
      ["h2", "1. Ambassadeur+ vous paie sur les dossiers des autres"],
      ["p", "Recrutez un ambassadeur via votre lien et vous touchez un **bonus de 10 % sur chaque transaction qu'il conclut**, tant que les deux comptes sont actifs. Une bonne recrue, un agent immobilier à l'étranger par exemple, peut valoir plus que vos propres recommandations."],
      ["h2", "2. Sofara Pro, gratuit pour les professionnels de l'immobilier"],
      ["ul", [
        "**Bibliothèque de projets** : tous les promoteurs, brochures, plans, échéanciers.",
        "**Simulateurs** : frais DLD et plans de paiement, pour montrer à un contact les chiffres exacts.",
        "**SofarAI** : rédige vos messages WhatsApp et LinkedIn, qualifie vos leads.",
        "**Legal AI** : répond aux questions réglementaires en langage clair.",
        "**Communauté** : les autres ambassadeurs, les événements, ce qui fonctionne en ce moment.",
      ]],
      ["h2", "3. Un pipeline transparent"],
      ["p", "Chaque lead affiche désormais son étape, de nouveau à apport payé, et chaque commission son statut, d'estimée à payée. Vous voyez exactement où en est chaque introduction."],
      ["h2", "4. Un briefing mensuel"],
      ["p", "Cet email est le premier d'une série mensuelle : chiffres de marché à citer, focus promoteurs et projets, rubrique juridique, scripts. Tout est rédigé pour être transféré."],
      ctaDashboard.fr,
      ["callout", "**Le marché n'a pas attendu.** Dubaï a enregistré ses volumes de transactions les plus élevés de son histoire en 2024 et 2025. Vos contacts en ont entendu parler. La seule question est de savoir s'ils achètent via votre lien ou celui de quelqu'un d'autre."],
      ...closing("fr"),
    ],
  },
};
