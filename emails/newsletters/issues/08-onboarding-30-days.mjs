import { closing, ctaDashboard } from "../common.mjs";

export default {
  id: "08-onboarding-30-days",
  sequence: "onboarding",
  day: 30,
  subject: {
    en: "Your first 30 days at Sofara: the checklist",
    fr: "Vos 30 premiers jours chez Sofara : la checklist",
  },
  preview: {
    en: "Eight actions. The ambassadors who do them close within the quarter.",
    fr: "Huit actions. Les ambassadeurs qui les font concluent dans le trimestre.",
  },
  blocks: {
    en: [
      ["h1", "30 days in. Where do you stand?"],
      ["p", "{{first_name}}, a month ago you joined Sofara. Here is the checklist I give every ambassador who asks \"what should I actually do?\". Tick what is done, do the rest this week."],
      ["ol", [
        "**Profile complete** in the dashboard: name, country, phone. Our advisors use it to call your leads in the right language.",
        "**Referral link saved** in your phone notes and WhatsApp favourites: {{referral_link}}",
        "**Message sent to 10 contacts** who have ever mentioned Dubai, investment or relocation.",
        "**One post published** on LinkedIn or Instagram saying you now work with a licensed Dubai brokerage. Use approved material from your dashboard.",
        "**At least one lead** added to your pipeline, with the person's consent.",
        "**One ambassador recruited** through your link, to activate Ambassador+ and the 10% bonus.",
        "**Pro upgrade requested** if you are a real estate professional: project library, simulators, SofarAI, Legal AI, community. Free, approved in 24 to 48 hours.",
        "**Instagram followed**: @sofaradubai, where we post projects and market updates you can forward.",
      ]],
      ctaDashboard.en,
      ["h2", "What happens next"],
      ["p", "From now on you will receive one briefing a month: market numbers you can quote, a developer or project focus, a legal corner, and scripts that work. Every issue is designed so you can forward a piece of it to your network."],
      ["callout", "**The single best predictor of your first commission is the number of people who have your link.** Not your knowledge, not your timing. Reach."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "30 jours plus tard. Où en êtes-vous ?"],
      ["p", "{{first_name}}, il y a un mois vous avez rejoint Sofara. Voici la checklist que je donne à chaque ambassadeur qui demande « que dois-je faire concrètement ? ». Cochez ce qui est fait, faites le reste cette semaine."],
      ["ol", [
        "**Profil complété** dans le tableau de bord : nom, pays, téléphone. Nos conseillers s'en servent pour appeler vos leads dans la bonne langue.",
        "**Lien de parrainage enregistré** dans les notes de votre téléphone et vos favoris WhatsApp : {{referral_link}}",
        "**Message envoyé à 10 contacts** qui ont déjà évoqué Dubaï, l'investissement ou une expatriation.",
        "**Une publication** sur LinkedIn ou Instagram annonçant que vous travaillez désormais avec une agence licenciée à Dubaï. Utilisez les supports approuvés de votre tableau de bord.",
        "**Au moins un lead** ajouté à votre pipeline, avec le consentement de la personne.",
        "**Un ambassadeur recruté** via votre lien, pour activer Ambassadeur+ et le bonus de 10 %.",
        "**Passage à Pro demandé** si vous êtes professionnel de l'immobilier : bibliothèque de projets, simulateurs, SofarAI, Legal AI, communauté. Gratuit, validé sous 24 à 48 heures.",
        "**Instagram suivi** : @sofaradubai, où nous publions projets et actualités du marché que vous pouvez transférer.",
      ]],
      ctaDashboard.fr,
      ["h2", "La suite"],
      ["p", "Vous recevrez désormais un briefing par mois : des chiffres de marché à citer, un focus promoteur ou projet, une rubrique juridique, et des scripts qui fonctionnent. Chaque numéro est conçu pour que vous puissiez en transférer une partie à votre réseau."],
      ["callout", "**Le meilleur indicateur de votre première commission est le nombre de personnes qui ont votre lien.** Pas vos connaissances, pas le timing. La portée."],
      ...closing("fr"),
    ],
  },
};
