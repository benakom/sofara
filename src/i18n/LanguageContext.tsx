import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { isLangLoaded, loadLang, readSavedLang, translate, Lang } from "./translations";
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

/**
 * `initialPath` lets the server prerender and the first client render agree on the language:
 * on public pages the URL decides (so /fr is always French), elsewhere the saved choice applies.
 */
export const LanguageProvider = ({ children, initialPath }: { children: ReactNode; initialPath?: string }) => {
  const startPath = initialPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const [saved, setSaved] = useState<Lang>(() => (typeof window === "undefined" ? "en" : readSavedLang()));
  const [urlLang, setUrlLangNow] = useState<Lang | undefined>(() =>
    isPublicPath(startPath) ? langOfLocale(localeFromPath(startPath)) : undefined,
  );
  const lang = urlLang ?? saved;

  // A language is only switched to once its strings are loaded (src/main.tsx loads the first one before hydrating),
  // so the page never shows a mix of languages. For each setting, the latest request wins if several are in flight.
  const requests = useRef({ url: 0, saved: 0 });
  const whenLoaded = useCallback((which: "url" | "saved", l: Lang | undefined, apply: () => void) => {
    const id = ++requests.current[which];
    if (!l || isLangLoaded(l)) return apply();
    loadLang(l)
      .catch(() => { /* offline: English strings fill in */ })
      .then(() => { if (id === requests.current[which]) apply(); });
  }, []);
  const setUrlLang = useCallback((l: Lang | undefined) => whenLoaded("url", l, () => setUrlLangNow(l)), [whenLoaded]);

  useEffect(() => {
    document.documentElement.dir = lang === "arb" ? "rtl" : "ltr";
    document.documentElement.lang = lang === "ar" ? "fr" : lang === "arb" ? "ar" : lang;
  }, [lang]);

  const changeLang = useCallback((l: Lang) => {
    // Arabic exists on the public /ar pages only (its URL sets it); the app keeps the previous language.
    if (l === "arb") return;
    try {
      localStorage.setItem("sofara-lang", l);
    } catch {
      /* ignore */
    }
    whenLoaded("saved", l, () => setSaved(l));
  }, [whenLoaded]);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

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
