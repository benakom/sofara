import { closing, networkNudge, ctaDashboard } from "../common.mjs";

export default {
  id: "01-onboarding-welcome",
  sequence: "onboarding",
  day: 0,
  subject: {
    en: "Welcome to Sofara, {{first_name}}. Here is how you earn.",
    fr: "Bienvenue chez Sofara, {{first_name}}. Voici comment vous gagnez.",
  },
  preview: {
    en: "You refer. We close. You earn up to 3% of the property value.",
    fr: "Vous recommandez. Nous concluons. Vous gagnez jusqu'à 3 % de la valeur du bien.",
  },
  blocks: {
    en: [
      ["h1", "Welcome to Sofara"],
      ["p", "{{first_name}}, your ambassador account is active. One sentence sums up the model: **you refer, we close, you earn.**"],
      ["p", "Sofara is the ambassador network of Cevitas Real Estate LLC, a RERA-licensed brokerage in Dubai. When someone in your network wants to buy property in Dubai, you introduce them. Our licensed team handles everything else: project selection, viewings, negotiation, contracts, payment follow-up. You never negotiate, never sign, never need a licence."],
      ["h2", "What you earn"],
      ["p", "On every transaction closed through your referral you earn **up to 3% of the total property value**, paid in AED by bank transfer within 7 days of closing. On a typical AED 2 million apartment that is up to AED 60,000 for one introduction."],
      ["h2", "Your three tools"],
      ["ol", [
        "**Your referral link**: {{referral_link}}. Anyone who registers through it is attributed to you for 12 months.",
        "**Your pipeline**: add a lead manually in your dashboard (name, phone, email) when someone tells you they are interested. We take it from there and you follow every stage.",
        "**Your commissions page**: every deal moves from estimated to validated to paid. Nothing is hidden.",
      ]],
      ctaDashboard.en,
      ["h2", "Your first action today"],
      ["p", "Do not wait to become an expert. The ambassadors who earn first are the ones who tell their network early. Send this message to three people who have ever mentioned Dubai:"],
      ["quote", "I have joined a Dubai real estate network run by a licensed brokerage. If you or someone you know is thinking about buying there, I can put you in touch with their team. No cost on your side."],
      networkNudge.en,
      ["p", "Over the next four weeks I will send you short briefings: how commissions are calculated, who to refer, how to talk about Dubai with confidence, what the law allows you to do, and how to double your reach with Ambassador+."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Bienvenue chez Sofara"],
      ["p", "{{first_name}}, votre compte ambassadeur est actif. Le modèle tient en une phrase : **vous recommandez, nous concluons, vous gagnez.**"],
      ["p", "Sofara est le réseau d'ambassadeurs de Cevitas Real Estate LLC, agence immobilière licenciée RERA à Dubaï. Quand une personne de votre réseau souhaite acheter à Dubaï, vous la présentez. Notre équipe licenciée s'occupe du reste : sélection du projet, visites, négociation, contrats, suivi des paiements. Vous ne négociez jamais, vous ne signez jamais, vous n'avez besoin d'aucune licence."],
      ["h2", "Ce que vous gagnez"],
      ["p", "Sur chaque transaction conclue grâce à votre recommandation, vous touchez **jusqu'à 3 % de la valeur totale du bien**, versés en AED par virement bancaire sous 7 jours après le closing. Sur un appartement type à AED 2 millions, cela représente jusqu'à AED 60 000 pour une seule introduction."],
      ["h2", "Vos trois outils"],
      ["ol", [
        "**Votre lien de parrainage** : {{referral_link}}. Toute personne inscrite via ce lien vous est attribuée pendant 12 mois.",
        "**Votre pipeline** : ajoutez un lead manuellement dans votre tableau de bord (nom, téléphone, email) dès qu'une personne vous dit être intéressée. Nous prenons le relais et vous suivez chaque étape.",
        "**Votre page commissions** : chaque dossier passe d'estimé à validé puis payé. Rien n'est caché.",
      ]],
      ctaDashboard.fr,
      ["h2", "Votre première action aujourd'hui"],
      ["p", "N'attendez pas de devenir expert. Les ambassadeurs qui gagnent en premier sont ceux qui parlent tôt à leur réseau. Envoyez ce message à trois personnes qui ont déjà évoqué Dubaï :"],
      ["quote", "J'ai rejoint un réseau immobilier à Dubaï géré par une agence licenciée. Si toi ou quelqu'un de ton entourage envisage d'acheter là-bas, je peux te mettre en contact avec leur équipe. Aucun coût de ton côté."],
      networkNudge.fr,
      ["p", "Au cours des quatre prochaines semaines, je vous enverrai de courts briefings : comment les commissions sont calculées, qui recommander, comment parler de Dubaï avec assurance, ce que la loi vous autorise à faire, et comment doubler votre portée avec Ambassadeur+."],
      ...closing("fr"),
    ],
  },
};
