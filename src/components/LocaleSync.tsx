import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { isPublicPath, langOfLocale, localeFromPath, PAGE_PATHS } from "@/i18n/locales";

// Applied before the browser paints the new route, so a page never shows for a frame in the previous page's language.
// (Layout effects do not run during the build-time prerender, where the initial language already matches the URL.)
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Keeps the interface language aligned with the URL on public pages (/fr → French, /ar → Arabic, root pages → English).
 * App pages (dashboard, admin, auth) keep the language the user picked.
 * A visitor who explicitly chose FR/ES/RU earlier and lands on the English homepage is sent to their
 * language's homepage (crawlers have no saved choice, so they always get the requested URL).
 */
const LocaleSync = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setUrlLang } = useLanguage();

  useBeforePaint(() => {
    setUrlLang(isPublicPath(pathname) ? langOfLocale(localeFromPath(pathname)) : undefined);
  }, [pathname, setUrlLang]);

  useEffect(() => {
    if (pathname !== "/") return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("sofara-lang");
    } catch {
      /* ignore */
    }
    const target = saved === "ar" ? "fr" : saved;
    if (target === "fr" || target === "es" || target === "ru") navigate(PAGE_PATHS.home[target] + window.location.hash, { replace: true });
    // Only on first landing, not on every visit to "/" during the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LocaleSync;
