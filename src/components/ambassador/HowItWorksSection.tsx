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
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-gold-soft opacity-30" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            {t("how.label")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("how.title")}{" "}
            <span className="text-gradient-gold">{t("how.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <span className="font-display text-6xl font-bold text-primary/15 block mb-4">{step.number}</span>
                <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
