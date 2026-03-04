import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { TrendingUp, Home, Users, DollarSign, Building2, Globe } from "lucide-react";

const MarketDataSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: TrendingUp, value: "+32%", label: t("market.transactions"), sub: t("market.transactionsSub") },
    { icon: DollarSign, value: "€76Mds", label: t("market.volume"), sub: t("market.volumeSub") },
    { icon: Home, value: "168,000+", label: t("market.units"), sub: t("market.unitsSub") },
    { icon: Users, value: "+41%", label: t("market.foreign"), sub: t("market.foreignSub") },
    { icon: Building2, value: "€3,200", label: t("market.pricePerSqm"), sub: t("market.pricePerSqmSub") },
    { icon: Globe, value: "200+", label: t("market.nationalities"), sub: t("market.nationalitiesSub") },
  ];

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("market.label")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            {t("market.title")}{" "}
            <span className="text-gradient-primary">{t("market.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("market.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl p-4 sm:p-6 lg:p-8 bg-secondary/30 border border-border/30 hover:border-primary/20 transition-all duration-500"
            >
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mb-3 sm:mb-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-primary mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-sm font-medium text-foreground mb-0.5 sm:mb-1">{stat.label}</div>
              <div className="text-xs sm:text-xs text-muted-foreground leading-snug">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MarketDataSection;
