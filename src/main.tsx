import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { isPublicPath, langOfLocale, localeFromPath } from "./i18n/locales";
import { loadLang, readSavedLang } from "./i18n/translations";
import "./index.css";

const container = document.getElementById("root")!;
const path = window.location.pathname.replace(/\/+$/, "") || "/";

const start = () => {
  // Prerendered public pages carry data-ssr="<path>": hydrate them. Anything else (app routes served by the
  // SPA fallback) renders from scratch.
  if (container.dataset.ssr === path && container.firstElementChild) {
    hydrateRoot(container, <App />);
  } else {
    container.removeAttribute("data-ssr");
    container.innerHTML = "";
    createRoot(container).render(<App />);
  }
};

// Interface strings come in one chunk per language (English is built in). The first render must use the same
// language as the prerendered HTML, so that language is loaded first: the URL's on public pages, the saved choice
// elsewhere. The saved choice is also loaded on the English homepage, which LocaleSync may redirect to it.
const urlLang = isPublicPath(path) ? langOfLocale(localeFromPath(path)) : undefined;
const saved = readSavedLang();
Promise.all([loadLang(urlLang ?? saved), path === "/" ? loadLang(saved) : undefined])
  .catch(() => { /* chunk unavailable: render anyway, English strings fill in */ })
  .then(start);

// A link to a page in another language starts loading that language when the visitor reaches for it, so the
// client-side navigation renders in the new language at once.
const prefetchLinkLang = (e: Event) => {
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || a.origin !== window.location.origin || !isPublicPath(a.pathname)) return;
  loadLang(langOfLocale(localeFromPath(a.pathname))).catch(() => {});
};
for (const type of ["pointerover", "focusin", "touchstart"]) document.addEventListener(type, prefetchLinkLang, { passive: true });
