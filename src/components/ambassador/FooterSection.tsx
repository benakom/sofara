import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

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
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed mb-4">
              {t("footer.description")}
            </p>
            <a href="https://www.instagram.com/sofaradubai/" target="_blank" rel="noopener" className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram size={18} />
            </a>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-3 sm:mb-4">{t("footer.platform")}</h4>
            <div className="space-y-2.5">
              <a href="#avantages" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("nav.benefits")}</a>
              <a href="#dubai" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("nav.whyDubai")}</a>
              <a href="#comment" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
              <Link to="/about" className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">About</Link>
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

        {/* SEO internal-link cloud — keyword anchors to deepen blog crawling */}
        <nav aria-label="Explore Sofara" className="border-t border-border/30 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <h4 className="font-display text-xs uppercase tracking-[0.18em] text-primary/70 mb-3 sm:mb-4">
            Explore Sofara
          </h4>
          <ul className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] sm:text-xs text-muted-foreground/70 leading-relaxed">
            {[
              { label: "Sofara Dubai", to: "/blog/sofara-dubai-real-estate-ambassador-platform" },
              { label: "Sofara Real Estate", to: "/blog/sofara-real-estate-explained" },
              { label: "What is Sofara", to: "/blog/what-is-sofara" },
              { label: "Sofara Commission Structure", to: "/blog/sofara-commission-structure-explained" },
              { label: "Sofara Pro vs Lite", to: "/blog/sofara-pro-vs-lite" },
              { label: "Super Ambassador Program", to: "/blog/super-ambassador-program" },
              { label: "Ambassador Success Stories", to: "/blog/ambassador-success-stories" },
              { label: "Dubai Real Estate Ambassadors Network", to: "/blog/dubai-real-estate-ambassadors-network" },
              { label: "UAE Real Estate Ambassadors Network", to: "/blog/uae-real-estate-ambassadors-network" },
              { label: "Abu Dhabi Real Estate Ambassadors Network", to: "/blog/abu-dhabi-real-estate-ambassadors-network" },
              { label: "Dubai Real Estate Ambassadors Guide", to: "/blog/dubai-real-estate-ambassadors-guide" },
              { label: "How to Become a Dubai Ambassador", to: "/blog/how-to-become-dubai-real-estate-ambassador" },
              { label: "Dubai Real Estate Market 2026", to: "/blog/dubai-real-estate-market-2026-overview" },
              { label: "Why Invest in Dubai Property", to: "/blog/why-invest-dubai-property-2026" },
              { label: "Top Dubai Areas to Invest", to: "/blog/top-dubai-areas-investment-2026" },
              { label: "Off-Plan vs Ready Properties", to: "/blog/dubai-off-plan-vs-ready-properties" },
              { label: "Emaar Properties Guide", to: "/blog/emaar-properties-guide" },
              { label: "DAMAC Properties Guide", to: "/blog/damac-properties-guide" },
              { label: "Sobha Realty Investment", to: "/blog/sobha-realty-quality-investment" },
              { label: "Dubai Golden Visa", to: "/blog/dubai-golden-visa-real-estate" },
              { label: "Dubai DLD Fees", to: "/blog/dubai-dld-fees-explained" },
              { label: "Dubai Payment Plans", to: "/blog/dubai-payment-plans-explained" },
              { label: "Dubai Rental Yields", to: "/blog/dubai-rental-yields-explained" },
              { label: "Dubai Luxury Real Estate", to: "/blog/dubai-luxury-real-estate-trends" },
              { label: "Foreigners Buying Dubai Property", to: "/blog/foreigners-buying-dubai-property" },
              { label: "AI Real Estate Future Dubai", to: "/blog/ai-real-estate-future-dubai" },
              { label: "AI Tools for Ambassadors", to: "/blog/ai-tools-real-estate-ambassadors" },
              { label: "AI Lead Qualification", to: "/blog/ai-lead-qualification-real-estate" },
              { label: "AI Roleplay Sales Training", to: "/blog/ai-roleplay-sales-training" },
              { label: "WhatsApp Marketing Dubai", to: "/blog/whatsapp-marketing-real-estate-dubai" },
              { label: "Expo City Real Estate", to: "/blog/dubai-expo-city-real-estate-impact" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border/30 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-primary/60">{t("footer.rights")}</p>
          <p className="text-[10px] sm:text-xs text-primary/60 text-center sm:text-right">{t("footer.regulated")}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
