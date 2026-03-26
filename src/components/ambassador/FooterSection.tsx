import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 py-10 sm:py-16" itemScope itemType="https://schema.org/WPFooter">
      <div className="mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="sm:col-span-2">
            <div className="mb-3 sm:mb-4">
              <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">sofara</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-3 sm:mb-4">{t("footer.platform")}</h4>
            <div className="space-y-2.5">
              <a href="#avantages" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("nav.benefits")}</a>
              <a href="#dubai" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("nav.whyDubai")}</a>
              <a href="#comment" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
              <Link to="/blog" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-3 sm:mb-4">{t("footer.legal")}</h4>
            <div className="space-y-2.5">
              <Link to="/legal/privacy" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
              <Link to="/legal/terms" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</Link>
              <Link to="/legal/cookies" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("footer.cookies")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-3 sm:mb-4">Partners</h4>
            <div className="space-y-2.5">
              <a href="https://www.cevitas.ae" target="_blank" rel="noopener" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">Cevitas Real Estate</a>
              <a href="https://www.offplansimulator.com" target="_blank" rel="noopener" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">Off-Plan Simulator</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground/60">{t("footer.rights")}</p>
          <p className="text-xs sm:text-sm text-muted-foreground/60 text-center sm:text-right">{t("footer.regulated")}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
