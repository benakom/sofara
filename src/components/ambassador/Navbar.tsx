import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LayoutDashboard, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Lang } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { alternatesFor, isPublicPath, localeFromPath, PAGE_PATHS, SITE_URL, UI, type Locale } from "@/i18n/locales";

const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ru", label: "Русский" },
];

const LangSwitcher = ({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) => {
  const [open, setOpen] = useState(false);
  const current = languages.find(l => l.code === lang) || languages[0];
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // On public pages the language lives in the URL: go to the same page in the chosen language
  // (or that language's homepage when the page exists in English only).
  const choose = (code: Lang) => {
    setLang(code);
    setOpen(false);
    if (!isPublicPath(pathname)) return;
    const target = code as Locale;
    const alt = alternatesFor(pathname);
    const to = alt ? alt[target].replace(SITE_URL, "") || "/" : PAGE_PATHS.home[target];
    if (to !== pathname) navigate(to + (alt ? hash : ""));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Change language, current language ${current.label}`}
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="font-medium">{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-xl overflow-hidden min-w-[130px]">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  lang === l.code
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const home = PAGE_PATHS.home[locale];
  // Section anchors live on the homepage: prefix them when the navbar is shown on another page.
  const anchor = (id: string) => (pathname === home ? id : `${home}${id}`);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/20"
          : "bg-background border-b border-border/40"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between max-w-7xl">
        <a href={home} aria-label="Sofara" className="font-display text-4xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
          sofara
        </a>

        <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-1 py-1">
          {[
            { href: anchor("#comment"), label: t("nav.howItWorks") },
            { href: anchor("#avantages"), label: UI[locale].commissions },
            { href: anchor("#projets"), label: UI[locale].projects },
            { href: PAGE_PATHS.ambassadors[locale], label: UI[locale].ambassadors, wide: true },
            { href: "/blog", label: "Blog", wide: true },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${link.wide ? "hidden lg:inline-block" : ""} whitespace-nowrap text-sm text-muted-foreground hover:text-foreground hover:bg-secondary px-3 lg:px-4 py-1.5 rounded-full transition-all duration-200`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LangSwitcher lang={lang} setLang={setLang} />

          {!loading && (
            user ? (
              <a href="/dashboard">
                <Button variant="hero" size="sm" className="rounded-full px-5 gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </a>
            ) : (
              <a href="/auth">
                <Button variant="hero" size="sm" className="rounded-full px-5 gap-2">
                  <LogIn className="w-4 h-4" />
                  {t("nav.signIn")}
                </Button>
              </a>
            )
          )}
        </div>

        {/* Mobile: language + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LangSwitcher lang={lang} setLang={setLang} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileOpen}
            className="text-foreground p-1"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-background/98 backdrop-blur-2xl"
          >
            <div className="px-5 py-4 flex flex-col gap-0.5">
              {[
                { href: anchor("#comment"), label: t("nav.howItWorks") },
                { href: anchor("#avantages"), label: UI[locale].commissions },
                { href: anchor("#projets"), label: UI[locale].projects },
                { href: PAGE_PATHS.ambassadors[locale], label: UI[locale].ambassadors },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 px-4 py-3 rounded-xl transition-all text-[15px] font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 px-4">
                {!loading && (
                  user ? (
                    <a href="/dashboard" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="hero" size="sm" className="rounded-full w-full text-[15px] py-5 gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </a>
                  ) : (
                    <a href="/auth" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="hero" size="sm" className="rounded-full w-full text-[15px] py-5 gap-2">
                        <LogIn className="w-4 h-4" />
                        {t("nav.signIn")}
                      </Button>
                    </a>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
