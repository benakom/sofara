import { signature } from "../newsletters/common.mjs";

// Sent once the ambassador has verified their email. Account is pending validation.
export default {
  id: "under-review",
  subject: {
    en: "Your Sofara application is being reviewed",
    fr: "Votre candidature Sofara est en cours de validation",
  },
  preview: {
    en: "Email verified. Our team reviews every application personally, usually within 48 hours.",
    fr: "Email vérifié. Notre équipe examine chaque candidature personnellement, généralement sous 48 heures.",
  },
  blocks: {
    en: [
      ["h1", "Thank you, {{first_name}}. Your application is under review."],
      ["p", "Your email address is confirmed and your application to join the Sofara ambassador network has reached our team."],
      ["p", "We review every application personally. Sofara is a network of trusted introducers working with **Cevitas Real Estate LLC**, a RERA-licensed Dubai brokerage, so we take a moment to read each profile before opening access. This usually takes **24 to 48 hours** on business days."],
      ["h2", "What happens next"],
      ["ol", [
        "We review the details you gave us: name, phone, occupation and how you heard about Sofara.",
        "You receive a confirmation email the moment your account is validated, with a short guide to submit your first lead.",
        "Your dashboard, referral link and commission tracking open at that point.",
      ]],
      ["callout", "**While you wait, do the one thing that matters most.** Write down the names of three people in your network who have talked about buying in Dubai, investing abroad or relocating. That list is your first week's work."],
      ["p", "If we need anything else to complete the review, we will write to you at this address. Questions in the meantime: reply to this email or write to [hello@sofara.io](mailto:hello@sofara.io)."],
      signature.en,
    ],
    fr: [
      ["h1", "Merci, {{first_name}}. Votre candidature est en cours de validation."],
      ["p", "Votre adresse email est confirmée et votre candidature pour rejoindre le réseau d'ambassadeurs Sofara est arrivée à notre équipe."],
      ["p", "Nous examinons chaque candidature personnellement. Sofara est un réseau d'apporteurs d'affaires de confiance travaillant avec **Cevitas Real Estate LLC**, agence immobilière licenciée RERA à Dubaï. Nous prenons donc le temps de lire chaque profil avant d'ouvrir l'accès. Cela prend généralement **24 à 48 heures** ouvrées."],
      ["h2", "La suite"],
      ["ol", [
        "Nous examinons les informations transmises : nom, téléphone, profession et la façon dont vous avez connu Sofara.",
        "Vous recevez un email de confirmation dès que votre compte est validé, avec un guide court pour soumettre votre premier lead.",
        "Votre tableau de bord, votre lien de parrainage et le suivi de vos commissions s'ouvrent à ce moment-là.",
      ]],
      ["callout", "**En attendant, faites la seule chose qui compte vraiment.** Notez les noms de trois personnes de votre réseau qui ont parlé d'acheter à Dubaï, d'investir à l'étranger ou de s'expatrier. Cette liste est le travail de votre première semaine."],
      ["p", "Si nous avons besoin d'un complément pour finaliser l'examen, nous vous écrirons à cette adresse. Une question d'ici là : répondez à cet email ou écrivez à [hello@sofara.io](mailto:hello@sofara.io)."],
      signature.fr,
    ],
  },
};
