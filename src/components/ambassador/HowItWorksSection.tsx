import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { number: "01", title: t("how.step1"), description: t("how.step1Desc") },
    { number: "02", title: t("how.step2"), description: t("how.step2Desc") },
    { number: "03", title: t("how.step3"), description: t("how.step3Desc") },
    { number: "04", title: t("how.step4"), description: t("how.step4Desc") },
  ];

  return (
    <section className="section-mobile relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("how.label")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            {t("how.title")}{" "}
            <span className="text-gradient-primary">{t("how.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl p-5 sm:p-7 bg-secondary/20 border border-border/30 hover:border-primary/20 transition-all duration-500 group"
            >
              <span className="font-display text-3xl sm:text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors block mb-3 sm:mb-4">{step.number}</span>
              <h3 className="font-display text-base sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground leading-snug">{step.title}</h3>
              <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-2 w-4 h-px bg-primary/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
