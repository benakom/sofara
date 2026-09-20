import { signature } from "../newsletters/common.mjs";

// Sent to the ambassador each time the Sofara team moves one of their leads to a new stage.
// HTML fields (note_html, hint_html, next_html, lost_html) are injected after rendering and may be empty.
export default {
  id: "lead-stage-update",
  subject: {
    en: "{{lead_name}}: {{stage_label}}",
    fr: "{{lead_name}} : {{stage_label}}",
  },
  preview: {
    en: "{{stage_message}}",
    fr: "{{stage_message}}",
  },
  blocks: {
    en: [
      ["h1", "{{lead_name}}: {{stage_label}}"],
      ["p", "Hi {{first_name}}, here is the latest on the lead you introduced to Sofara."],
      ["p", "{{stage_message}}"],
      ["raw", "{{note_html}}{{hint_html}}{{next_html}}{{lost_html}}"],
      ["cta", { label: "Open the lead", url: "{{lead_url}}" }],
      ["p", "You can follow every step of {{lead_name}} in your dashboard under Lead tracking. Questions about this lead? Reply to this email."],
      signature.en,
    ],
    fr: [
      ["h1", "{{lead_name}} : {{stage_label}}"],
      ["p", "Bonjour {{first_name}}, voici la dernière nouvelle concernant le lead que vous avez présenté à Sofara."],
      ["p", "{{stage_message}}"],
      ["raw", "{{note_html}}{{hint_html}}{{next_html}}{{lost_html}}"],
      ["cta", { label: "Ouvrir le lead", url: "{{lead_url}}" }],
      ["p", "Vous pouvez suivre chaque étape de {{lead_name}} dans votre tableau de bord, rubrique Suivi des leads. Une question sur ce lead ? Répondez à cet email."],
      signature.fr,
    ],
  },
};
