// Public-site locales and localized URLs.
// English lives at the root ("/", "/dubai-real-estate-ambassadors"…); French, Spanish and Russian live under
// /fr, /es and /ru with localized slugs. Every localized page declares its equivalents so hreflang,
// the language switcher, the sitemap and the prerender all stay in sync from this single file.

export const LOCALES = ["en", "fr", "es", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const SITE_URL = "https://sofara.io";

export const LOCALE_LABELS: Record<Locale, string> = { en: "English", fr: "Français", es: "Español", ru: "Русский" };
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", fr: "fr_FR", es: "es_ES", ru: "ru_RU" };

export type PageKey = "home" | "ambassadors" | "affiliate" | "agent" | "invest";

export const PAGE_PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", fr: "/fr", es: "/es", ru: "/ru" },
  ambassadors: {
    en: "/dubai-real-estate-ambassadors",
    fr: "/fr/ambassadeurs-immobilier-dubai",
    es: "/es/embajadores-inmobiliarios-dubai",
    ru: "/ru/ambassadory-nedvizhimosti-dubai",
  },
  affiliate: {
    en: "/real-estate-affiliate-program-uae",
    fr: "/fr/affiliation-immobilier-dubai",
    es: "/es/programa-afiliados-inmobiliarios-dubai",
    ru: "/ru/partnerskaya-programma-nedvizhimost-dubai",
  },
  agent: {
    en: "/become-real-estate-agent-dubai",
    fr: "/fr/devenir-agent-immobilier-dubai",
    es: "/es/como-ser-agente-inmobiliario-dubai",
    ru: "/ru/kak-stat-rieltorom-v-dubae",
  },
  invest: {
    en: "/invest-dubai-real-estate",
    fr: "/fr/investir-immobilier-dubai",
    es: "/es/invertir-inmobiliario-dubai",
    ru: "/ru/investicii-v-nedvizhimost-dubaya",
  },
};

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** Locale encoded in a public URL (/fr/…, /es/…, /ru/…); everything else is English. */
export const localeFromPath = (pathname: string): Locale => {
  const seg = norm(pathname).split("/")[1];
  return seg === "fr" || seg === "es" || seg === "ru" ? seg : "en";
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
      "Sofara is the Dubai and UAE real estate ambassadors and affiliate network. Refer property buyers from anywhere and earn up to 3% commission in AED.",
  },
  fr: {
    title: "Sofara | Réseau d'ambassadeurs immobiliers à Dubaï",
    description:
      "Sofara, le réseau d'ambassadeurs et d'affiliation de l'immobilier à Dubaï et aux Émirats. Recommandez des acheteurs et gagnez jusqu'à 3 % de commission.",
  },
  es: {
    title: "Sofara | Red de embajadores inmobiliarios en Dubái",
    description:
      "Sofara es la red de embajadores y afiliados del sector inmobiliario de Dubái y EAU. Recomienda compradores desde cualquier país y gana hasta un 3 %.",
  },
  ru: {
    title: "Sofara | Амбассадоры недвижимости Дубая и ОАЭ",
    description:
      "Sofara — сеть амбассадоров и партнёрская программа недвижимости Дубая и ОАЭ. Рекомендуйте покупателей из любой страны и получайте до 3% комиссии.",
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
};

/** English-only guides aimed at people searching from the UAE (freelance, part-time, referral fees, side income). */
export type GuideKey = "freelance" | "partTime" | "referralFee" | "sideIncome";
export const EN_GUIDES: Record<GuideKey, { path: string; label: string }> = {
  freelance: { path: "/freelance-real-estate-agent-dubai", label: "Freelance real estate agent in Dubai" },
  partTime: { path: "/part-time-real-estate-agent-dubai", label: "Part-time real estate agent in Dubai" },
  referralFee: { path: "/real-estate-referral-fee-dubai", label: "Real estate referral fees in Dubai" },
  sideIncome: { path: "/side-income-dubai-real-estate", label: "Side income in Dubai from property referrals" },
};
export type AnyPageKey = PageKey | GuideKey;
export const isGuideKey = (k: AnyPageKey): k is GuideKey => k in EN_GUIDES;

/** Short link labels for each localized page, used in navigation and footers. */
export const PAGE_LABELS: Record<PageKey, Record<Locale, string>> = {
  home: { en: "Sofara", fr: "Sofara", es: "Sofara", ru: "Sofara" },
  ambassadors: {
    en: "Dubai real estate ambassadors",
    fr: "Ambassadeurs immobiliers à Dubaï",
    es: "Embajadores inmobiliarios en Dubái",
    ru: "Амбассадоры недвижимости Дубая",
  },
  affiliate: {
    en: "UAE real estate affiliate program",
    fr: "Affiliation immobilière à Dubaï",
    es: "Programa de afiliados inmobiliarios",
    ru: "Партнёрская программа недвижимости",
  },
  agent: {
    en: "Become a real estate agent in Dubai",
    fr: "Devenir agent immobilier à Dubaï",
    es: "Cómo ser agente inmobiliario en Dubái",
    ru: "Как стать риэлтором в Дубае",
  },
  invest: {
    en: "Invest in Dubai real estate",
    fr: "Investir dans l'immobilier à Dubaï",
    es: "Invertir en inmobiliario en Dubái",
    ru: "Инвестиции в недвижимость Дубая",
  },
};

/** URL of any page key in a locale (English guides exist in English only). */
export const pathOf = (k: AnyPageKey, l: Locale) => (isGuideKey(k) ? EN_GUIDES[k].path : PAGE_PATHS[k][l]);
/** Link label of any page key in a locale. */
export const labelOf = (k: AnyPageKey, l: Locale) => (isGuideKey(k) ? EN_GUIDES[k].label : PAGE_LABELS[k][l]);
