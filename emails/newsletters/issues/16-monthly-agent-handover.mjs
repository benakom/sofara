import { ctaShare, signature, SIGNUP } from "../common.mjs";

// Targets licensed real estate agents outside the UAE: hand over Dubai-bound clients, Cevitas closes.
export default {
  id: "16-monthly-agent-handover",
  sequence: "monthly",
  day: null,
  subject: {
    en: "For real estate agents: your Dubai clients, closed by a licensed team, paid to you",
    fr: "Pour les agents immobiliers : vos clients Dubaï, conclus par une équipe licenciée, payés à vous",
  },
  preview: {
    en: "No UAE licence, no office, no travel. Hand over the client, keep up to 3%.",
    fr: "Pas de licence aux Émirats, pas de bureau, pas de déplacement. Confiez le client, gardez jusqu'à 3 %.",
  },
  blocks: {
    en: [
      ["h1", "You already have the clients. We have the licence."],
      ["p", "If you are a real estate agent or broker in Europe, Africa, Asia or the Gulf, some of your clients have asked you about Dubai. Until now you had two options: say no, or refer them to a stranger and hope for a thank-you. There is a third."],
      ["h2", "How the handover works"],
      ["ol", [
        "**You register the client** in your Sofara pipeline: name, phone, email, budget range. Two minutes. Or send them your link and they register themselves.",
        "**Cevitas Real Estate calls them within 24 hours**, in their language. We are RERA-licensed in Dubai and have facilitated more than AED 100 million in transactions.",
        "**We run the whole process**: project shortlist, virtual or on-site viewings, negotiation with the developer, SPA review, DLD registration, payment follow-up, handover.",
        "**You follow every stage** in your dashboard, from prequalified to down payment paid. Your client is attributed to you for 12 months.",
        "**You are paid up to 3% of the property value** in AED, within 7 days of closing, against your invoice. The client pays nothing extra: developers pay the brokerage commission.",
      ]],
      ["h2", "What it does for your agency"],
      ["ul", [
        "**A new revenue line** with zero cost: no licence, no office, no staff in the UAE.",
        "**Client retention**: you stay the trusted advisor. We copy you on progress and never solicit your client for anything outside the deal.",
        "**Larger tickets**: the average Dubai off-plan deal we close is above AED 1.5 million, and villas run to AED 10 million and beyond.",
        "**Ambassador+**: recruit agents in your own network through your link and earn 10% on their closings too.",
      ]],
      ["h2", "What we ask of you"],
      ["p", "Only introduce clients who have agreed to be contacted, never quote prices or promise returns, and let our licensed team handle every regulated step. Everything else is your business, and it stays yours."],
      ["quote", "Not an ambassador yet? Registration is free and takes two minutes: [sofara.io/auth](https://sofara.io/auth?mode=signup&source=newsletter-agents)"],
      ctaShare.en,
      ["callout", "**Already an ambassador and know other agents?** Forward this email. Every agent who registers through your link becomes your godchild under Ambassador+."],
      signature.en,
    ],
    fr: [
      ["h1", "Vous avez déjà les clients. Nous avons la licence."],
      ["p", "Si vous êtes agent ou courtier immobilier en Europe, en Afrique, en Asie ou dans le Golfe, certains de vos clients vous ont déjà parlé de Dubaï. Jusqu'ici vous aviez deux options : dire non, ou les envoyer à un inconnu en espérant un merci. Il en existe une troisième."],
      ["h2", "Comment fonctionne la passation"],
      ["ol", [
        "**Vous enregistrez le client** dans votre pipeline Sofara : nom, téléphone, email, fourchette de budget. Deux minutes. Ou vous lui envoyez votre lien et il s'inscrit lui-même.",
        "**Cevitas Real Estate l'appelle sous 24 heures**, dans sa langue. Nous sommes licenciés RERA à Dubaï et avons facilité plus de AED 100 millions de transactions.",
        "**Nous gérons tout le processus** : sélection de projets, visites virtuelles ou sur place, négociation avec le promoteur, relecture du SPA, enregistrement DLD, suivi des paiements, livraison.",
        "**Vous suivez chaque étape** dans votre tableau de bord, de préqualifié à apport payé. Votre client vous est attribué pendant 12 mois.",
        "**Vous êtes payé jusqu'à 3 % de la valeur du bien** en AED, sous 7 jours après le closing, contre votre facture. Le client ne paie rien de plus : ce sont les promoteurs qui versent la commission d'agence.",
      ]],
      ["h2", "Ce que cela apporte à votre agence"],
      ["ul", [
        "**Une nouvelle ligne de revenus** à coût nul : pas de licence, pas de bureau, pas de personnel aux Émirats.",
        "**Fidélisation du client** : vous restez le conseiller de confiance. Nous vous tenons informé de l'avancement et ne sollicitons jamais votre client en dehors du dossier.",
        "**Des tickets plus élevés** : le dossier off-plan moyen que nous concluons à Dubaï dépasse AED 1,5 million, et les villas vont jusqu'à AED 10 millions et au-delà.",
        "**Ambassadeur+** : recrutez des agents de votre propre réseau via votre lien et touchez aussi 10 % sur leurs closings.",
      ]],
      ["h2", "Ce que nous vous demandons"],
      ["p", "N'introduire que des clients ayant accepté d'être contactés, ne jamais citer de prix ni promettre de rendements, et laisser notre équipe licenciée gérer chaque étape réglementée. Tout le reste est votre activité, et elle reste la vôtre."],
      ["quote", "Pas encore ambassadeur ? L'inscription est gratuite et prend deux minutes : [sofara.io/auth](https://sofara.io/auth?mode=signup&source=newsletter-agents)"],
      ctaShare.fr,
      ["callout", "**Déjà ambassadeur et vous connaissez d'autres agents ?** Transférez cet email. Chaque agent qui s'inscrit via votre lien devient votre filleul dans le cadre d'Ambassadeur+."],
      signature.fr,
    ],
  },
};
