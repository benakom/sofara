import { useLanguage } from "@/i18n/LanguageContext";
import { localeOfLang, type Locale } from "@/i18n/locales";
import type { Lang } from "@/i18n/translations";

/**
 * Sign-up URL used by every "Become an ambassador" CTA: it opens the account-creation view directly
 * (not the sign-in view) and carries the locale of the page the visitor was reading, so the sign-up form
 * and the default email language follow it.
 */
export const signupHref = (locale?: Locale, source?: string) => {
  const p = new URLSearchParams({ mode: "signup" });
  if (locale) p.set("lang", locale);
  if (source) p.set("source", source);
  return `/auth?${p.toString()}`;
};

/** Sign-up URL for the current interface language. */
export const useSignupHref = (source?: string) => {
  const { lang } = useLanguage();
  return signupHref(localeOfLang(lang as Lang), source);
};
