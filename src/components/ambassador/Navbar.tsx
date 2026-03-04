import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Lang } from "@/i18n/translations";

const languages: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
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
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-black text-primary-foreground">S</div>
          Sofara
        </a>

        <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-1 py-1">
          {[
            { href: "#platform", label: t("nav.platform") },
            { href: "#dubai", label: t("nav.whyDubai") },
            { href: "#avantages", label: t("nav.benefits") },
            { href: "#comment", label: t("nav.howItWorks") },
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
          <div className="flex items-center gap-0.5 mr-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded-md text-sm transition-all duration-200 ${
                  lang === l.code
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-sm">{l.flag}</span>
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            {t("nav.signIn")}
          </Button>
          <Button variant="hero" size="sm" className="rounded-full px-5">
            {t("nav.signUp")}
          </Button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-background/98 backdrop-blur-2xl"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
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
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 px-4 py-3 rounded-xl transition-all text-sm"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 px-4 py-3">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      lang === l.code
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-3 px-4">
                <Button variant="ghost" size="sm" className="flex-1">{t("nav.signIn")}</Button>
                <Button variant="hero" size="sm" className="rounded-full flex-1">{t("nav.signUp")}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
