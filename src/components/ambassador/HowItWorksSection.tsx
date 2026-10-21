import { motion } from "framer-motion";
import { Send, Handshake, Banknote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Send, number: "01", title: t("how.step1New"), description: t("how.step1DescNew"), color: "bg-primary/10" },
    { icon: Handshake, number: "02", title: t("how.step2New"), description: t("how.step2DescNew"), color: "bg-primary/10" },
    { icon: Banknote, number: "03", title: t("how.step3New"), description: t("how.step3DescNew"), color: "bg-primary/10" },
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
          <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("how.label")}
          </span>
          <h2 className="font-display text-[2rem] sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            {t("how.titleNew")}{" "}
            <span className="text-gradient-primary">{t("how.titleHighlightNew")}</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("how.subtitleNew")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative rounded-2xl p-6 sm:p-8 bg-secondary/20 border border-border/30 hover:border-primary/20 transition-all duration-500 group text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 transition-colors">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="font-display text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-5">{step.number}</span>
              <h3 className="font-display text-2xl sm:text-2xl font-bold mb-3 text-foreground leading-snug">{step.title}</h3>
              <p className="text-base sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-3 w-6 h-px bg-primary/20" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="/auth">
            <Button variant="hero" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full group">
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </a>
          <p className="text-xs text-muted-foreground/50 mt-4">{t("how.noLicense")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
