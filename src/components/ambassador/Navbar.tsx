import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Lang } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";

const languages: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "FR", flag: "https://flagcdn.com/w80/fr.png" },
  { code: "en", label: "EN", flag: "https://flagcdn.com/w80/gb.png" },
  { code: "ar", label: "AR", flag: "https://flagcdn.com/w80/ae.png" },
  { code: "es", label: "ES", flag: "https://flagcdn.com/w80/es.png" },
  { code: "ru", label: "RU", flag: "https://flagcdn.com/w80/ru.png" },
];

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-background/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between max-w-7xl">
        <a href="/" className="font-display text-4xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
          sofara
        </a>

        <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-1 py-1">
          {[
            { href: "#platform", label: t("nav.platform") },
            { href: "#dubai", label: t("nav.whyDubai") },
            { href: "#avantages", label: t("nav.benefits") },
            { href: "#comment", label: t("nav.howItWorks") },
            { href: "/blog", label: "Blog" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground hover:bg-secondary px-4 py-1.5 rounded-full transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${
                  lang === l.code
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={l.flag} alt={l.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

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
                  {lang === "fr" ? "Se connecter" : "Sign In"}
                </Button>
              </a>
            )
          )}
        </div>

        {/* Mobile: language + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center gap-1.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${
                  lang === l.code
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110"
                    : "opacity-60"
                }`}
              >
                <img src={l.flag} alt={l.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-1">
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
                { href: "#platform", label: t("nav.platform") },
                { href: "#dubai", label: t("nav.whyDubai") },
                { href: "#avantages", label: t("nav.benefits") },
                { href: "#comment", label: t("nav.howItWorks") },
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
                        {lang === "fr" ? "Se connecter" : "Sign In"}
                      </Button>
                    </a>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
