import { signature } from "../newsletters/common.mjs";

// Sent when a super admin validates the ambassador. Onboarding guide + FAQ + first-lead CTA.
const PIPELINE = "https://sofara.io/dashboard/pipeline";
const DASHBOARD = "https://sofara.io/dashboard";

export default {
  id: "welcome-validated",
  subject: {
    en: "Welcome to the Sofara ambassador family, {{first_name}}",
    fr: "Bienvenue dans la famille des ambassadeurs Sofara, {{first_name}}",
  },
  preview: {
    en: "Your account is validated. Here is how to submit your first lead in two minutes.",
    fr: "Votre compte est validé. Voici comment soumettre votre premier lead en deux minutes.",
  },
  blocks: {
    en: [
      ["h1", "You are in, {{first_name}}. Welcome to the Sofara ambassador family."],
      ["p", "Your application has been reviewed and validated. From today you are an official Sofara ambassador, part of a network of introducers who connect their contacts with **Cevitas Real Estate LLC**, our RERA-licensed brokerage in Dubai."],
      ["p", "The model in one line: **you refer, we close, you earn** up to 3% of the property value on every transaction, paid in AED within 7 days of closing."],
      ["cta", { label: "Open my dashboard", url: DASHBOARD }],
      ["h2", "How to submit your first lead (2 minutes)"],
      ["ol", [
        "Sign in at [sofara.io/dashboard](https://sofara.io/dashboard) with the email and password you created.",
        "Open **Lead tracking** in the left menu and click **New lead**.",
        "Enter the person's first name, last name, phone number and email, and how you know them.",
        "Confirm that this person agreed to be contacted by our team. This is required by data protection law and it protects you.",
        "Save. Our advisors call the lead within 24 hours, in their language. You follow every stage in Lead tracking: new, prequalified, qualified, offer sent, offer accepted, booking paid, down payment paid.",
      ]],
      ["callout", "**Prefer to let people come to you?** Share your personal link: {{referral_link}}. Anyone who registers through it is attributed to you for 12 months."],
      ["h2", "Questions ambassadors ask on day one"],
      ["p", "**Do I need a real estate licence?** No. You introduce; Cevitas Real Estate, RERA-licensed, handles viewings, negotiation, contracts and closing."],
      ["p", "**What counts as a lead?** A person who wants to buy property in Dubai, has a budget in mind, and agreed to be contacted. Investors, families relocating, diaspora professionals, business owners, parents of students in the UAE."],
      ["p", "**How much do I earn, and when?** Up to 3% of the property value, depending on the developer (for example Emaar and Sobha 3%, DAMAC 2.5%). Paid in AED by bank transfer within 7 days of closing, against an invoice you issue from your dashboard. No fee, no subscription."],
      ["p", "**What if my contact does not buy immediately?** They stay attributed to you for 12 months from registration, even if they buy a different project than the one first discussed."],
      ["p", "**Can I refer other ambassadors?** Yes. From your first recruit you become Ambassador+ and earn a 10% bonus on every transaction they close, on top of their own commission."],
      ["p", "**What am I not allowed to do?** Negotiate prices, promise returns, sign anything on a buyer's behalf, or handle client money. All payments go to the developer's DLD escrow account or to Cevitas."],
      ["p", "**Where do I see my commissions?** In the Commissions page of your dashboard. Each one moves from estimated to validated to paid."],
      ["p", "**Who can I ask for help?** Reply to this email or write to [hello@sofara.io](mailto:hello@sofara.io). Real estate professionals can also request the free Pro upgrade from the dashboard for project library, simulators and AI tools."],
      ["h2", "Your first action"],
      ["p", "The ambassadors who earn first are the ones who submit a lead in their first week. You do not need the perfect lead. You need the first one."],
      ["cta", { label: "Submit my first lead", url: PIPELINE }],
      ["p", "Welcome aboard. I look forward to seeing your first closing."],
      signature.en,
    ],
    fr: [
      ["h1", "C'est validé, {{first_name}}. Bienvenue dans la famille des ambassadeurs Sofara."],
      ["p", "Votre candidature a été examinée et validée. À partir d'aujourd'hui, vous êtes officiellement ambassadeur Sofara, membre d'un réseau d'apporteurs d'affaires qui mettent leurs contacts en relation avec **Cevitas Real Estate LLC**, notre agence licenciée RERA à Dubaï."],
      ["p", "Le modèle en une ligne : **vous recommandez, nous concluons, vous gagnez** jusqu'à 3 % de la valeur du bien sur chaque transaction, versés en AED sous 7 jours après le closing."],
      ["cta", { label: "Ouvrir mon tableau de bord", url: DASHBOARD }],
      ["h2", "Comment soumettre votre premier lead (2 minutes)"],
      ["ol", [
        "Connectez-vous sur [sofara.io/dashboard](https://sofara.io/dashboard) avec l'email et le mot de passe que vous avez créés.",
        "Ouvrez **Suivi des leads** dans le menu de gauche et cliquez sur **Nouveau lead**.",
        "Saisissez le prénom, le nom, le téléphone et l'email de la personne, et la façon dont vous la connaissez.",
        "Confirmez que cette personne a accepté d'être contactée par notre équipe. C'est exigé par la loi sur les données personnelles et cela vous protège.",
        "Enregistrez. Nos conseillers appellent le lead sous 24 heures, dans sa langue. Vous suivez chaque étape dans Suivi des leads : nouveau, préqualifié, qualifié, offre envoyée, offre acceptée, réservation payée, apport payé.",
      ]],
      ["callout", "**Vous préférez que les gens viennent à vous ?** Partagez votre lien personnel : {{referral_link}}. Toute personne inscrite via ce lien vous est attribuée pendant 12 mois."],
      ["h2", "Les questions que les ambassadeurs posent le premier jour"],
      ["p", "**Ai-je besoin d'une licence immobilière ?** Non. Vous introduisez ; Cevitas Real Estate, licenciée RERA, gère les visites, la négociation, les contrats et le closing."],
      ["p", "**Qu'est-ce qu'un lead ?** Une personne qui souhaite acheter un bien à Dubaï, a un budget en tête et a accepté d'être contactée. Investisseurs, familles qui s'installent, professionnels de la diaspora, chefs d'entreprise, parents d'étudiants aux Émirats."],
      ["p", "**Combien je gagne, et quand ?** Jusqu'à 3 % de la valeur du bien, selon le promoteur (par exemple Emaar et Sobha 3 %, DAMAC 2,5 %). Versés en AED par virement sous 7 jours après le closing, contre une facture émise depuis votre tableau de bord. Aucun frais, aucun abonnement."],
      ["p", "**Et si mon contact n'achète pas tout de suite ?** Il vous reste attribué pendant 12 mois à compter de son enregistrement, même s'il achète un autre projet que celui évoqué au départ."],
      ["p", "**Puis-je recommander d'autres ambassadeurs ?** Oui. Dès votre première recrue, vous devenez Ambassadeur+ et touchez un bonus de 10 % sur chaque transaction qu'elle conclut, en plus de sa propre commission."],
      ["p", "**Qu'est-ce qui m'est interdit ?** Négocier des prix, promettre des rendements, signer quoi que ce soit au nom d'un acheteur, ou manipuler l'argent des clients. Tous les paiements vont sur le compte séquestre DLD du promoteur ou à Cevitas."],
      ["p", "**Où voir mes commissions ?** Dans la page Commissions de votre tableau de bord. Chacune passe d'estimée à validée puis payée."],
      ["p", "**À qui demander de l'aide ?** Répondez à cet email ou écrivez à [hello@sofara.io](mailto:hello@sofara.io). Les professionnels de l'immobilier peuvent aussi demander le passage gratuit à Pro depuis le tableau de bord : bibliothèque de projets, simulateurs et outils IA."],
      ["h2", "Votre première action"],
      ["p", "Les ambassadeurs qui gagnent en premier sont ceux qui soumettent un lead dès la première semaine. Vous n'avez pas besoin du lead parfait. Vous avez besoin du premier."],
      ["cta", { label: "Soumettre mon premier lead", url: PIPELINE }],
      ["p", "Bienvenue à bord. J'ai hâte de voir votre premier closing."],
      signature.fr,
    ],
  },
};
