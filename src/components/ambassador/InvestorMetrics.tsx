import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const InvestorMetrics = () => {
  const { t } = useLanguage();

  const metrics = [
    { value: "€2.5M+", label: t("investor.paid"), trend: "+140% YoY" },
    { value: "500+", label: t("investor.ambassadors"), trend: "+85% YoY" },
    { value: "45", label: t("investor.countries"), trend: "+12 in 2025" },
    { value: "€420K", label: t("investor.mrr"), trend: "+210% YoY" },
    { value: "4.2x", label: t("investor.ltv"), trend: t("investor.ltvTrend") },
    { value: "72h", label: t("investor.conversion"), trend: t("investor.conversionTrend") },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      <div className="container relative mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              {t("investor.label")}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground leading-tight">
              {t("investor.title")}{" "}
              <span className="text-gradient-gold">{t("investor.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t("investor.description")}
            </p>
            <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl group">
              {t("investor.cta")}
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-500"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-gold mb-1">
                  {m.value}
                </div>
                <div className="text-xs font-medium text-foreground mb-2">{m.label}</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
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
