// "ar" is kept as a deprecated alias (mapped to "en") to avoid breaking
// legacy dashboard/admin components that still inline-check `lang === "ar"`.
// Public-facing surfaces use en | fr | es | ru | arb. Real Arabic is "arb" (public /ar pages only,
// see langOfLocale in ./locales); missing "arb" keys fall back to English.
//
// One module per language. English (the fallback for every missing key) is part of the entry bundle; the others are
// chunks loaded on demand: src/main.tsx loads the page's language before hydrating, LanguageProvider loads a newly
// chosen language before switching to it, and the build-time prerender registers all of them up front
// (src/i18n/allTranslations.ts).
import { EN_TRANSLATIONS } from "./translations-en";

export type Lang = "en" | "fr" | "es" | "ru" | "ar" | "arb";

type Dictionary = Record<string, string>;
type LoadedLang = Exclude<Lang, "ar">;

const dictionaries: Partial<Record<LoadedLang, Dictionary>> = { en: EN_TRANSLATIONS };

const loaders: Record<Exclude<LoadedLang, "en">, () => Promise<Dictionary>> = {
  fr: () => import("./translations-fr").then((m) => m.FR_TRANSLATIONS),
  es: () => import("./translations-es").then((m) => m.ES_TRANSLATIONS),
  ru: () => import("./translations-ru").then((m) => m.RU_TRANSLATIONS),
  arb: () => import("./translations-ar").then((m) => m.AR_TRANSLATIONS),
};

const pending: Partial<Record<LoadedLang, Promise<void>>> = {};

const resolve = (lang: Lang): LoadedLang => (lang === "ar" ? "en" : lang);

/** The strings of `lang` if they are loaded (English always is). */
export const getDictionary = (lang: Lang): Dictionary | undefined => dictionaries[resolve(lang)];

export const isLangLoaded = (lang: Lang): boolean => !!getDictionary(lang);

/** Makes a language available synchronously (the prerender registers every language this way). */
export const registerDictionary = (lang: LoadedLang, dict: Dictionary) => {
  dictionaries[lang] = dict;
};

/** Loads a language's chunk once; resolves immediately when it is already there. */
export const loadLang = (lang: Lang): Promise<void> => {
  const key = resolve(lang);
  if (dictionaries[key]) return Promise.resolve();
  if (key === "en") return Promise.resolve();
  if (!pending[key]) {
    pending[key] = loaders[key]().then(
      (dict) => registerDictionary(key, dict),
      (err) => {
        delete pending[key];
        throw err;
      },
    );
  }
  return pending[key]!;
};

/** `key` in `lang`, falling back to English, then to the key itself. */
export const translate = (lang: Lang, key: string): string => getDictionary(lang)?.[key] || EN_TRANSLATIONS[key] || key;

/** The language the visitor picked earlier (app pages), English by default. */
export const readSavedLang = (): Lang => {
  try {
    const saved = localStorage.getItem("sofara-lang");
    // "ar" is the dashboard's code for French (legacy convention); keep it across reloads.
    if (saved === "fr" || saved === "es" || saved === "ru" || saved === "en" || saved === "ar") return saved;
  } catch {
    /* storage unavailable (SSR, private mode) */
  }
  return "en";
};
