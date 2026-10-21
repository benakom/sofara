// Blocks reused across the ambassador emails, in the five languages (en, fr, es, ru, ar).

export const REFERRAL = "{{referral_link}}";
export const SIGNUP = "https://sofara.io/auth?mode=signup&source=newsletter";
export const DASHBOARD = "https://sofara.io/dashboard";
export const PIPELINE = "https://sofara.io/dashboard/pipeline";
export const REFERRALS = "https://sofara.io/dashboard/referrals";
export const HELP = "mailto:hello@sofara.io";

export const ctaShare = {
  en: ["cta", { label: "Share my referral link", url: REFERRAL }],
  fr: ["cta", { label: "Partager mon lien de parrainage", url: REFERRAL }],
  es: ["cta", { label: "Compartir mi enlace de referido", url: REFERRAL }],
  ru: ["cta", { label: "Поделиться реферальной ссылкой", url: REFERRAL }],
  ar: ["cta", { label: "مشاركة رابط الإحالة", url: REFERRAL }],
};

export const ctaDashboard = {
  en: ["cta", { label: "Open my dashboard", url: DASHBOARD }],
  fr: ["cta", { label: "Ouvrir mon tableau de bord", url: DASHBOARD }],
  es: ["cta", { label: "Abrir mi panel", url: DASHBOARD }],
  ru: ["cta", { label: "Открыть личный кабинет", url: DASHBOARD }],
  ar: ["cta", { label: "فتح لوحة التحكم", url: DASHBOARD }],
};

export const ctaLead = {
  en: ["cta", { label: "Add a lead", url: PIPELINE }],
  fr: ["cta", { label: "Ajouter un lead", url: PIPELINE }],
  es: ["cta", { label: "Añadir un contacto", url: PIPELINE }],
  ru: ["cta", { label: "Добавить клиента", url: PIPELINE }],
  ar: ["cta", { label: "إضافة عميل", url: PIPELINE }],
};

// Label of the "tip" box.
export const TIP = {
  en: "Tip of the week",
  fr: "L'astuce de la semaine",
  es: "El consejo de la semana",
  ru: "Совет недели",
  ar: "نصيحة الأسبوع",
};

export const agentNudge = {
  en: ["callout", "**You are a real estate agent outside the UAE?** You do not need a Dubai licence. Hand your Dubai-bound clients to Sofara: our RERA-licensed team runs viewings, negotiation and closing, you keep your local business and earn on top."],
  fr: ["callout", "**Vous êtes agent immobilier hors des Émirats ?** Pas besoin de licence à Dubaï. Confiez-nous vos clients intéressés par Dubaï : notre équipe licenciée RERA gère visites, négociation et closing, vous gardez votre activité locale et gagnez en plus."],
  es: ["callout", "**¿Eres agente inmobiliario fuera de los EAU?** No necesitas licencia en Dubái. Pásanos tus clientes interesados en Dubái: nuestro equipo con licencia RERA gestiona visitas, negociación y cierre; tú conservas tu negocio local y ganas un extra."],
  ru: ["callout", "**Вы агент по недвижимости за пределами ОАЭ?** Лицензия в Дубае не нужна. Передайте нам клиентов, которые смотрят на Дубай: наша команда с лицензией RERA проводит показы, переговоры и сделку, а вы сохраняете свой бизнес и получаете дополнительный доход."],
  ar: ["callout", "**هل أنت وسيط عقاري خارج الإمارات؟** لا تحتاج إلى ترخيص في دبي. أحِل إلينا عملاءك المهتمين بدبي: فريقنا المرخّص من RERA يتولى المعاينات والتفاوض وإتمام الصفقة، وتحتفظ أنت بنشاطك المحلي وتربح دخلاً إضافياً."],
};

export const signature = {
  en: ["sig", ["Ahmed Benjas", "Founder, Sofara · Dubai"]],
  fr: ["sig", ["Ahmed Benjas", "Fondateur, Sofara · Dubaï"]],
  es: ["sig", ["Ahmed Benjas", "Fundador, Sofara · Dubái"]],
  ru: ["sig", ["Ахмед Бенжас", "Основатель Sofara · Дубай"]],
  ar: ["sig", ["أحمد بنجاس", "المؤسس، سوفارا · دبي"]],
};

// "I am here" line before the signature.
export const helpLine = {
  en: ["p", "A question, a doubt, a contact you are not sure about? Write to [hello@sofara.io](mailto:hello@sofara.io). A real person from the team answers, usually the same day."],
  fr: ["p", "Une question, un doute, un contact dont vous n'êtes pas sûr ? Écrivez à [hello@sofara.io](mailto:hello@sofara.io). Une vraie personne de l'équipe vous répond, en général dans la journée."],
  es: ["p", "¿Una pregunta, una duda, un contacto del que no estás seguro? Escribe a [hello@sofara.io](mailto:hello@sofara.io). Te responde una persona real del equipo, normalmente el mismo día."],
  ru: ["p", "Есть вопрос, сомнение или контакт, в котором вы не уверены? Пишите на [hello@sofara.io](mailto:hello@sofara.io). Ответит живой человек из команды, обычно в тот же день."],
  ar: ["p", "سؤال، تردّد، أو جهة اتصال لست متأكداً منها؟ راسلنا على [hello@sofara.io](mailto:hello@sofara.io). يردّ عليك شخص حقيقي من الفريق، عادةً في اليوم نفسه."],
};

// Standard closing: help line + signature.
export const closing = (lang) => [helpLine[lang], signature[lang]];
