import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommissionSection = () => {
  const { t } = useLanguage();

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-30" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("commission.label")}
          </span>
          <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            {t("commission.title")}{" "}
            <span className="text-gradient-primary">{t("commission.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("commission.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-3xl p-8 sm:p-12 bg-primary/5 border border-primary/20 shadow-2xl shadow-primary/5 text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-semibold px-6 py-1.5 rounded-full">
              {t("commission.badgeSingle")}
            </div>
            
            <div className="mt-4 mb-2">
              <span className="font-display text-7xl sm:text-8xl lg:text-9xl font-bold text-gradient-primary">
                2.5%
              </span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-widest mb-6 sm:mb-8">
              {t("commission.ofValue")}
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
              {t("commission.singleDesc")}
            </p>

            <a href="/auth">
              <Button variant="hero" size="lg" className="rounded-full group text-base px-8 py-5">
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8 sm:mt-12 max-w-2xl mx-auto"
        >
          {t("commission.note")}
        </motion.p>
      </div>
    </section>
  );
};

export default CommissionSection;
