import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "500+", label: t("stats.ambassadors") },
    { value: "€2.5M", label: t("stats.commissions") },
    { value: "98%", label: t("stats.satisfaction") },
    { value: t("stats.countriesValue"), label: t("stats.countries") },
  ];

  return (
    <section className="py-20 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-4xl sm:text-5xl font-bold text-gradient-gold mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm sm:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
