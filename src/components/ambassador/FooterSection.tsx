import { useLanguage } from "@/i18n/LanguageContext";

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="font-display text-lg font-bold text-foreground">sofara</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">{t("footer.platform")}</h4>
            <div className="space-y-2.5">
              <a href="#avantages" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.benefits")}</a>
              <a href="#dubai" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.whyDubai")}</a>
              <a href="#comment" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">{t("footer.legal")}</h4>
            <div className="space-y-2.5">
              <a href="/legal/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</a>
              <a href="/legal/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</a>
              <a href="/legal/cookies" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.cookies")}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">{t("footer.rights")}</p>
          <p className="text-xs text-muted-foreground/60">{t("footer.regulated")}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
