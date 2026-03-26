import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "500+", label: t("stats.ambassadors") },
    { value: "AED 10M+", label: t("stats.commissions") },
    { value: "98%", label: t("stats.satisfaction") },
    { value: t("stats.countriesValue"), label: t("stats.countries") },
    { value: "72h", label: t("stats.avgConversion") },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="text-center px-6 py-5 rounded-2xl bg-secondary/30 border border-border/30 min-w-[140px] hover:border-primary/20 transition-colors duration-300"
            >
              <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
