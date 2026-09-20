import { signature } from "../newsletters/common.mjs";

// Sent when the Sofara team leaves a note on a lead without changing its stage.
export default {
  id: "lead-note",
  subject: {
    en: "New note on {{lead_name}} from the Sofara team",
    fr: "Nouvelle note de l'équipe Sofara sur {{lead_name}}",
  },
  preview: {
    en: "Current stage: {{stage_label}}.",
    fr: "Étape actuelle : {{stage_label}}.",
  },
  blocks: {
    en: [
      ["h1", "A note on {{lead_name}}"],
      ["p", "Hi {{first_name}}, our advisor left you an update on the lead you introduced. Current stage: **{{stage_label}}**."],
      ["raw", "{{note_html}}{{next_html}}{{lost_html}}"],
      ["cta", { label: "Open the lead", url: "{{lead_url}}" }],
      ["p", "Questions about this lead? Reply to this email."],
      signature.en,
    ],
    fr: [
      ["h1", "Une note sur {{lead_name}}"],
      ["p", "Bonjour {{first_name}}, notre conseiller vous a laissé une mise à jour sur le lead que vous avez présenté. Étape actuelle : **{{stage_label}}**."],
      ["raw", "{{note_html}}{{next_html}}{{lost_html}}"],
      ["cta", { label: "Ouvrir le lead", url: "{{lead_url}}" }],
      ["p", "Une question sur ce lead ? Répondez à cet email."],
      signature.fr,
    ],
  },
};
