import type { Lang } from "./translations";

// Public-site locales and localized URLs.
// English lives at the root ("/", "/dubai-real-estate-ambassadors"…); French, Spanish, Russian and Arabic live under
// /fr, /es, /ru and /ar with localized slugs. Every localized page declares its equivalents so hreflang,
// the language switcher, the sitemap and the prerender all stay in sync from this single file.

export const LOCALES = ["en", "fr", "es", "ru", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const SITE_URL = "https://sofara.io";

export const LOCALE_LABELS: Record<Locale, string> = { en: "English", fr: "Français", es: "Español", ru: "Русский", ar: "العربية" };
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", fr: "fr_FR", es: "es_ES", ru: "ru_RU", ar: "ar_AE" };

/** Right-to-left locales (rendered with <html dir="rtl">). */
export const isRtl = (l: Locale) => l === "ar";

/**
 * Interface language (key of src/i18n/translations.ts) used for a URL locale.
 * "ar" in translations is a LEGACY alias the dashboard uses for French, so real Arabic lives under "arb".
 */
export const langOfLocale = (l: Locale): Lang => (l === "ar" ? "arb" : l);
/** URL locale of an interface language (the legacy "ar" alias is French). */
export const localeOfLang = (l: Lang): Locale => (l === "arb" ? "ar" : l === "ar" ? "fr" : l);

export type PageKey = "home" | "ambassadors" | "affiliate" | "referral" | "agent" | "invest";

export const PAGE_PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", fr: "/fr", es: "/es", ru: "/ru", ar: "/ar" },
  ambassadors: {
    en: "/dubai-real-estate-ambassadors",
    fr: "/fr/ambassadeurs-immobilier-dubai",
    es: "/es/embajadores-inmobiliarios-dubai",
    ru: "/ru/ambassadory-nedvizhimosti-dubai",
    ar: "/ar/sufara-aqarat-dubai",
  },
  affiliate: {
    en: "/real-estate-affiliate-program-uae",
    fr: "/fr/affiliation-immobilier-dubai",
    es: "/es/programa-afiliados-inmobiliarios-dubai",
    ru: "/ru/partnerskaya-programma-nedvizhimost-dubai",
    ar: "/ar/altaswiq-alaqari-bialumula-dubai",
  },
  referral: {
    en: "/real-estate-referral-program-dubai",
    fr: "/fr/programme-recommandation-immobilier-dubai",
    es: "/es/programa-referidos-inmobiliario-dubai",
    ru: "/ru/referalnaya-programma-nedvizhimost-dubai",
    ar: "/ar/barnamaj-alihala-alaqariya-dubai",
  },
  agent: {
    en: "/become-real-estate-agent-dubai",
    fr: "/fr/devenir-agent-immobilier-dubai",
    es: "/es/como-ser-agente-inmobiliario-dubai",
    ru: "/ru/kak-stat-rieltorom-v-dubae",
    ar: "/ar/kayf-tusbih-wasit-aqari-fi-dubai",
  },
  invest: {
    en: "/invest-dubai-real-estate",
    fr: "/fr/investir-immobilier-dubai",
    es: "/es/invertir-inmobiliario-dubai",
    ru: "/ru/investicii-v-nedvizhimost-dubaya",
    ar: "/ar/alistithmar-alaqari-fi-dubai",
  },
};

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** Blog articles written in French: their page (navbar, footer, html lang) is French although the URL has no /fr. */
const FR_BLOG_PATHS = new Set(["/blog/comment-devenir-agent-immobilier-dubai", "/blog/devenir-agent-immobilier-dubai-sans-licence"]);

/** Locale encoded in a public URL (/fr/…, /es/…, /ru/…, /ar/…); everything else is English. */
export const localeFromPath = (pathname: string): Locale => {
  if (FR_BLOG_PATHS.has(norm(pathname))) return "fr";
  const seg = norm(pathname).split("/")[1];
  return seg === "fr" || seg === "es" || seg === "ru" || seg === "ar" ? seg : "en";
};

/** Returns the page key and locale for a localized public URL, if it is one. */
export const pageFromPath = (pathname: string): { key: PageKey; locale: Locale } | undefined => {
  const p = norm(pathname);
  for (const key of Object.keys(PAGE_PATHS) as PageKey[]) {
    for (const locale of LOCALES) if (PAGE_PATHS[key][locale] === p) return { key, locale };
  }
  return undefined;
};

/** hreflang alternates (absolute URLs) for a path, or undefined when the page exists in one language only. */
export const alternatesFor = (pathname: string): Record<Locale, string> | undefined => {
  const hit = pageFromPath(pathname);
  if (!hit) return undefined;
  const out = {} as Record<Locale, string>;
  for (const l of LOCALES) out[l] = `${SITE_URL}${PAGE_PATHS[hit.key][l] === "/" ? "/" : PAGE_PATHS[hit.key][l]}`;
  return out;
};

/** Public routes that are not part of the app shell (dashboard/admin/auth keep the saved language). */
export const isPublicPath = (pathname: string) =>
  !/^\/(dashboard|admin|auth|reset-password)(\/|$)/.test(pathname);

/** Homepage meta per locale. Titles stay under ~60 characters, descriptions under ~158. */
export const HOME_META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Sofara | Dubai & UAE Real Estate Ambassadors Network",
    description:
      "Sofara is the Dubai & UAE real estate ambassadors and affiliate network. Refer property buyers as an introducer from anywhere and earn up to 3% in AED.",
  },
  fr: {
    title: "Ambassadeurs & apporteurs d'affaires immobilier Dubaï",
    description:
      "Sofara, réseau des ambassadeurs de l'immobilier à Dubaï et aux Émirats : affiliation, apporteurs d'affaires et apporteurs de clients. Jusqu'à 3 % de commission.",
  },
  es: {
    title: "Sofara | Red de embajadores inmobiliarios Dubái y EAU",
    description:
      "Sofara, la red de embajadores y afiliados inmobiliarios de Dubái y EAU. Presenta compradores desde cualquier país y gana hasta un 3 % por cada venta.",
  },
  ru: {
    title: "Sofara | Амбассадоры недвижимости Дубая и ОАЭ",
    description:
      "Sofara — сеть амбассадоров и партнёрская программа недвижимости Дубая и ОАЭ. Рекомендуйте покупателей из любой страны и получайте до 3% комиссии.",
  },
  ar: {
    title: "Sofara | شبكة سفراء العقارات في دبي والإمارات",
    description:
      "Sofara شبكة سفراء العقارات وبرنامج التسويق العقاري بالعمولة في دبي والإمارات. رشّح مشترين من أي بلد واربح حتى 3% من سعر العقار بالدرهم.",
  },
};

/** Interface strings used by the localized templates (navbar, pillar pages, footer). */
export const UI: Record<Locale, {
  join: string; seeProgram: string; faq: string; related: string; createAccount: string;
  perks: [string, string, string]; ambassadors: string; guides: string; home: string; breadcrumbHome: string;
  updated: string; footerTagline: string;
}> = {
  en: {
    join: "Join Sofara for free", seeProgram: "How it works", faq: "Frequently asked questions", related: "Related guides",
    createAccount: "Create my free ambassador account", perks: ["No license required", "Free to join, no fees", "Paid in AED within 7 days"],
    ambassadors: "Ambassadors", guides: "Guides", home: "Home", breadcrumbHome: "Home", updated: "Updated October 2026",
    footerTagline: "Sofara · Dubai & UAE Real Estate Ambassadors Network",
  },
  fr: {
    join: "Rejoindre Sofara gratuitement", seeProgram: "Comment ça marche", faq: "Questions fréquentes", related: "Guides associés",
    createAccount: "Créer mon compte ambassadeur gratuit", perks: ["Aucune licence requise", "Inscription gratuite, sans frais", "Payé en AED sous 7 jours"],
    ambassadors: "Ambassadeurs", guides: "Guides", home: "Accueil", breadcrumbHome: "Accueil", updated: "Mis à jour en octobre 2026",
    footerTagline: "Sofara · Réseau d'ambassadeurs de l'immobilier à Dubaï et aux Émirats",
  },
  es: {
    join: "Únete gratis a Sofara", seeProgram: "Cómo funciona", faq: "Preguntas frecuentes", related: "Guías relacionadas",
    createAccount: "Crear mi cuenta de embajador gratis", perks: ["Sin licencia", "Registro gratuito, sin cuotas", "Pago en AED en 7 días"],
    ambassadors: "Embajadores", guides: "Guías", home: "Inicio", breadcrumbHome: "Inicio", updated: "Actualizado en octubre de 2026",
    footerTagline: "Sofara · Red de embajadores inmobiliarios de Dubái y EAU",
  },
  ru: {
    join: "Присоединиться бесплатно", seeProgram: "Как это работает", faq: "Частые вопросы", related: "Полезные материалы",
    createAccount: "Создать бесплатный аккаунт амбассадора", perks: ["Лицензия не нужна", "Бесплатно, без взносов", "Выплата в AED за 7 дней"],
    ambassadors: "Амбассадоры", guides: "Гайды", home: "Главная", breadcrumbHome: "Главная", updated: "Обновлено в октябре 2026",
    footerTagline: "Sofara · Сеть амбассадоров недвижимости Дубая и ОАЭ",
  },
  ar: {
    join: "انضم إلى Sofara مجاناً", seeProgram: "كيف يعمل البرنامج", faq: "الأسئلة الشائعة", related: "أدلة ذات صلة",
    createAccount: "أنشئ حساب السفير المجاني", perks: ["بدون رخصة", "تسجيل مجاني بلا رسوم", "الدفع بالدرهم خلال 7 أيام"],
    ambassadors: "السفراء", guides: "الأدلة", home: "الرئيسية", breadcrumbHome: "الرئيسية", updated: "آخر تحديث: أكتوبر 2026",
    footerTagline: "Sofara · شبكة سفراء العقارات في دبي والإمارات",
  },
};

/**
 * Single-language guides built on search demand in one market: English guides for people searching from the UAE,
 * French guides for France/Belgium/Switzerland/Canada ("apporteur d'affaires"), Spanish, Russian and Arabic guides for those speakers.
 */
export type GuideKey =
  | "freelance" | "partTime" | "referralFee" | "sideIncome" | "apporteur" | "travailDubai" | "rabota"
  | "trabajar" | "komissiya" | "umulaWasit";
export const GUIDES: Record<GuideKey, { locale: Locale; path: string; label: string }> = {
  freelance: { locale: "en", path: "/freelance-real-estate-agent-dubai", label: "Freelance real estate agent in Dubai" },
  partTime: { locale: "en", path: "/part-time-real-estate-agent-dubai", label: "Part-time real estate agent in Dubai" },
  referralFee: { locale: "en", path: "/real-estate-referral-fee-dubai", label: "Real estate referral fee Dubai" },
  sideIncome: { locale: "en", path: "/side-income-dubai-real-estate", label: "Side income in Dubai from property referrals" },
  apporteur: { locale: "fr", path: "/fr/apporteur-affaires-immobilier-dubai", label: "Apporteur d'affaires immobilier Dubaï" },
  travailDubai: { locale: "fr", path: "/fr/travailler-immobilier-dubai", label: "Travailler dans l'immobilier à Dubaï" },
  rabota: { locale: "ru", path: "/ru/rabota-rieltorom-v-dubae", label: "Работа риэлтором в Дубае" },
  trabajar: { locale: "es", path: "/es/trabajar-inmobiliario-dubai", label: "Trabajar en el sector inmobiliario en Dubái" },
  komissiya: { locale: "ru", path: "/ru/komissiya-rieltora-v-dubae", label: "Комиссия риэлтора в Дубае" },
  umulaWasit: { locale: "ar", path: "/ar/umulat-alwasit-alaqari-dubai", label: "عمولة الوسيط العقاري في دبي" },
};
/** English guides only (kept for the English footer and sitemap code). */
export const EN_GUIDES = GUIDES;
export const guidesFor = (l: Locale) => (Object.keys(GUIDES) as GuideKey[]).filter((k) => GUIDES[k].locale === l);
export type AnyPageKey = PageKey | GuideKey;
export const isGuideKey = (k: AnyPageKey): k is GuideKey => k in GUIDES;

/** Short link labels for each localized page, used in navigation and footers. */
export const PAGE_LABELS: Record<PageKey, Record<Locale, string>> = {
  home: { en: "Sofara", fr: "Sofara", es: "Sofara", ru: "Sofara", ar: "Sofara" },
  ambassadors: {
    en: "Dubai real estate ambassadors",
    fr: "Ambassadeur immobilier Dubaï",
    es: "Embajadores inmobiliarios en Dubái",
    ru: "Амбассадоры недвижимости Дубая",
    ar: "سفراء العقارات في دبي",
  },
  affiliate: {
    en: "Real estate affiliate program UAE",
    fr: "Programme d'affiliation immobilier Dubaï",
    es: "Programa de afiliados inmobiliarios",
    ru: "Партнёрская программа недвижимости",
    ar: "التسويق العقاري بالعمولة",
  },
  referral: {
    en: "Real estate referral program Dubai",
    fr: "Commission de recommandation immobilier",
    es: "Programa de referidos inmobiliario",
    ru: "Реферальная программа недвижимости",
    ar: "برنامج الإحالة العقارية",
  },
  agent: {
    en: "Become a real estate agent in Dubai",
    fr: "Devenir agent immobilier à Dubaï",
    es: "Cómo ser agente inmobiliario en Dubái",
    ru: "Как стать риэлтором в Дубае",
    ar: "كيف تصبح وسيطاً عقارياً في دبي",
  },
  invest: {
    en: "Invest in Dubai real estate",
    fr: "Investir dans l'immobilier à Dubaï",
    es: "Invertir en inmobiliario en Dubái",
    ru: "Инвестиции в недвижимость Дубая",
    ar: "الاستثمار العقاري في دبي",
  },
};

/** URL of any page key in a locale (English guides exist in English only). */
export const pathOf = (k: AnyPageKey, l: Locale) => (isGuideKey(k) ? GUIDES[k].path : PAGE_PATHS[k][l]);
/** Link label of any page key in a locale. */
export const labelOf = (k: AnyPageKey, l: Locale) => (isGuideKey(k) ? GUIDES[k].label : PAGE_LABELS[k][l]);
