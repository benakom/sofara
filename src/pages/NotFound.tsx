import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { localeFromPath, PAGE_PATHS, PAGE_LABELS, UI, type PageKey } from "@/i18n/locales";

const COPY = {
  en: { title: "Page not found", text: "This page does not exist or has moved. These pages may help:" },
  fr: { title: "Page introuvable", text: "Cette page n'existe pas ou a été déplacée. Ces pages peuvent vous aider :" },
  es: { title: "Página no encontrada", text: "Esta página no existe o se ha movido. Estas páginas pueden ayudarte:" },
  ru: { title: "Страница не найдена", text: "Эта страница не существует или была перемещена. Возможно, вам помогут эти страницы:" },
  ar: { title: "الصفحة غير موجودة", text: "هذه الصفحة غير موجودة أو تم نقلها. قد تساعدك هذه الصفحات:" },
} as const;

const KEYS: PageKey[] = ["ambassadors", "referral", "affiliate", "agent"];

/** 404 page: never indexed (noindex here, in dist/404.html and in the SPA shell), with links to the main pages. */
const NotFound = () => {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const c = COPY[locale];

  useEffect(() => {
    console.warn("404: no route for", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5" dir={locale === "ar" ? "rtl" : undefined}>
      <Helmet>
        <title>{`404 — ${c.title} | Sofara`}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="max-w-xl text-center">
        <h1 className="mb-3 font-display text-4xl font-bold">404 · {c.title}</h1>
        <p className="mb-6 text-muted-foreground">{c.text}</p>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm font-medium">
          <li>
            <Link to={PAGE_PATHS.home[locale]} className="block rounded-xl border border-border px-4 py-3 hover:border-primary/50 hover:text-primary">
              {UI[locale].home}
            </Link>
          </li>
          {KEYS.map((k) => (
            <li key={k}>
              <Link to={PAGE_PATHS[k][locale]} className="block rounded-xl border border-border px-4 py-3 hover:border-primary/50 hover:text-primary">
                {PAGE_LABELS[k][locale]}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/blog" className="block rounded-xl border border-border px-4 py-3 hover:border-primary/50 hover:text-primary">Blog</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotFound;
