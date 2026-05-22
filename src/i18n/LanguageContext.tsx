import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { translations, Lang } from "./translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("sofara-lang");
    if (saved === "fr" || saved === "es" || saved === "ru" || saved === "en") return saved;
    return "en";
  });

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("sofara-lang", l);
    document.documentElement.dir = "ltr";
    document.documentElement.lang = l;
  };

  const t = useCallback(
    (key: string) => translations[lang][key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
