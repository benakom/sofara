import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import dubaiMarina from "@/assets/dubai-marina-golden.jpg";

const MidCTABanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={dubaiMarina} alt="Dubai Marina" className="w-full h-full object-cover opacity-15" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-8 sm:p-12 lg:p-16 border border-primary/20 bg-primary/5 text-center overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold">{t("midcta.badge")}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-5 text-foreground leading-tight">
              {t("midcta.title")}{" "}
              <span className="text-gradient-primary">{t("midcta.titleHighlight")}</span>
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-5 sm:mb-7 leading-relaxed">
              {t("midcta.description")}
            </p>

            {/* AI conversion badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-7 sm:mb-9">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold">{t("midcta.aiNote")}</span>
            </div>

            <div className="block">
              <a href="/auth">
                <Button variant="hero" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full group">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground/50 mt-4">{t("midcta.noLicense")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MidCTABanner;
