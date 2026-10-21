import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { translations, Lang } from "./translations";
import { isPublicPath, langOfLocale, localeFromPath } from "./locales";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  /** Language forced by the public URL (/fr, /es, /ru, /ar or English root pages), if any. */
  urlLang?: Lang;
  setUrlLang: (lang: Lang | undefined) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const readSaved = (): Lang => {
  try {
    const saved = localStorage.getItem("sofara-lang");
    // "ar" is the dashboard's code for French (legacy convention); keep it across reloads.
    if (saved === "fr" || saved === "es" || saved === "ru" || saved === "en" || saved === "ar") return saved;
  } catch {
    /* storage unavailable (SSR, private mode) */
  }
  return "en";
};

/**
 * `initialPath` lets the server prerender and the first client render agree on the language:
 * on public pages the URL decides (so /fr is always French), elsewhere the saved choice applies.
 */
export const LanguageProvider = ({ children, initialPath }: { children: ReactNode; initialPath?: string }) => {
  const startPath = initialPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const [saved, setSaved] = useState<Lang>(() => (typeof window === "undefined" ? "en" : readSaved()));
  const [urlLang, setUrlLang] = useState<Lang | undefined>(() =>
    isPublicPath(startPath) ? langOfLocale(localeFromPath(startPath)) : undefined,
  );
  const lang = urlLang ?? saved;

  useEffect(() => {
    document.documentElement.dir = lang === "arb" ? "rtl" : "ltr";
    document.documentElement.lang = lang === "ar" ? "fr" : lang === "arb" ? "ar" : lang;
  }, [lang]);

  const changeLang = useCallback((l: Lang) => {
    // Arabic exists on the public /ar pages only (its URL sets it); the app keeps the previous language.
    if (l === "arb") return;
    setSaved(l);
    try {
      localStorage.setItem("sofara-lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: string) => translations[lang][key] || translations.en[key] || key, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, urlLang, setUrlLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
