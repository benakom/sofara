import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "500+", label: t("stats.ambassadors") },
    { value: "€2.5M+", label: t("stats.commissions") },
    { value: "98%", label: t("stats.satisfaction") },
    { value: t("stats.countriesValue"), label: t("stats.countries") },
    { value: "72h", label: t("stats.avgConversion") },
  ];

  return (
    <section className="py-16 border-y border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="text-center min-w-[120px]"
            >
              <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-gold mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
