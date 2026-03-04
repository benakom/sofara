import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { TrendingUp, Award, Crown } from "lucide-react";

const tiers = [
  {
    icon: TrendingUp,
    nameKey: "commission.tier1Name",
    rangeKey: "commission.tier1Range",
    rate: "2%",
    descKey: "commission.tier1Desc",
  },
  {
    icon: Award,
    nameKey: "commission.tier2Name",
    rangeKey: "commission.tier2Range",
    rate: "2.5%",
    descKey: "commission.tier2Desc",
    featured: true,
  },
  {
    icon: Crown,
    nameKey: "commission.tier3Name",
    rangeKey: "commission.tier3Range",
    rate: "3%",
    descKey: "commission.tier3Desc",
  },
];

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
          className="text-center mb-12 sm:mb-20"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("commission.label")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            {t("commission.title")}{" "}
            <span className="text-gradient-primary">{t("commission.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("commission.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.nameKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-500 ${
                tier.featured
                  ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/5 sm:scale-[1.02]"
                  : "bg-secondary/20 border-border/30 hover:border-primary/20 hover:bg-secondary/40"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  {t("commission.popular")}
                </div>
              )}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 ${
                tier.featured ? "bg-primary/15" : "bg-primary/10"
              }`}>
                <tier.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg sm:text-lg font-semibold text-foreground mb-1">
                {t(tier.nameKey)}
              </h3>
              <p className="text-sm sm:text-sm text-muted-foreground mb-4 sm:mb-6">{t(tier.rangeKey)}</p>
              <div className="text-4xl sm:text-5xl font-display font-bold text-gradient-primary mb-2">
                {tier.rate}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-4 sm:mb-6">
                {t("commission.ofValue")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t(tier.descKey)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs sm:text-sm text-muted-foreground mt-8 sm:mt-12 max-w-2xl mx-auto"
        >
          {t("commission.note")}
        </motion.p>
      </div>
    </section>
  );
};

export default CommissionSection;
