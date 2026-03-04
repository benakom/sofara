import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const InvestorMetrics = () => {
  const { t } = useLanguage();

  const metrics = [
    { value: "€180K+", label: t("investor.paid"), trend: t("investor.paidTrend") },
    { value: "60+", label: t("investor.ambassadors"), trend: t("investor.ambassadorsTrend") },
    { value: "12", label: t("investor.countries"), trend: t("investor.countriesTrend") },
    { value: "€12 500", label: t("investor.mrr"), trend: t("investor.mrrTrend") },
    { value: "3.8x", label: t("investor.ltv"), trend: t("investor.ltvTrend") },
    { value: "72h", label: t("investor.conversion"), trend: t("investor.conversionTrend") },
  ];

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-30" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
              {t("investor.label")}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground leading-tight">
              {t("investor.title")}{" "}
              <span className="text-gradient-primary">{t("investor.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              {t("investor.description")}
            </p>
            <Button variant="hero" size="lg" className="text-[15px] sm:text-base px-7 sm:px-8 py-5 sm:py-6 rounded-full group" onClick={() => document.getElementById('postuler')?.scrollIntoView({ behavior: 'smooth' })}>
              {t("investor.cta")}
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl p-4 sm:p-5 bg-secondary/30 border border-border/30 text-center hover:border-primary/20 transition-all duration-500"
              >
                <div className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-gradient-primary mb-0.5 sm:mb-1">
                  {m.value}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-foreground mb-1.5 sm:mb-2">{m.label}</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-semibold">
                  {m.trend}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorMetrics;
