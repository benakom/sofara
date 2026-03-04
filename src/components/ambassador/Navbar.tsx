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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/30 bg-background/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-display text-2xl font-bold text-foreground tracking-tight">
          Sofara
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#platform" className="hover:text-foreground transition-colors">{t("nav.platform")}</a>
          <a href="#dubai" className="hover:text-foreground transition-colors">{t("nav.whyDubai")}</a>
          <a href="#avantages" className="hover:text-foreground transition-colors">{t("nav.benefits")}</a>
          <a href="#comment" className="hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center border border-border/50 rounded-lg overflow-hidden mr-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors ${
                  lang === l.code
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="text-xs font-medium">{l.label}</span>
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="text-foreground">
            {t("nav.signIn")}
          </Button>
          <Button variant="hero" size="sm" className="rounded-lg">
            {t("nav.signUp")}
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <a href="#platform" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.platform")}</a>
              <a href="#dubai" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.whyDubai")}</a>
              <a href="#avantages" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.benefits")}</a>
              <a href="#comment" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.howItWorks")}</a>
              <div className="flex items-center gap-2 py-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      lang === l.code
                        ? "border-primary/30 bg-primary/10 text-foreground"
                        : "border-border/50 text-muted-foreground"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span className="text-xs font-medium">{l.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" className="text-foreground flex-1">{t("nav.signIn")}</Button>
                <Button variant="hero" size="sm" className="rounded-lg flex-1">{t("nav.signUp")}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
