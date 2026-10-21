import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, CheckCircle2, Brain, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const FinalCTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-40" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      <div className="relative mx-auto px-5 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground leading-tight">
            {t("finalcta.title")}{" "}
            <span className="text-gradient-primary">{t("finalcta.titleHighlight")}</span>
          </h2>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {t("finalcta.description")}
          </p>

          {/* Trust points - 2 rows */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-10">
            {[
              { icon: CheckCircle2, text: t("finalcta.point1") },
              { icon: Clock, text: t("finalcta.point2") },
              { icon: Users, text: t("finalcta.point3") },
              { icon: Brain, text: t("finalcta.point4") },
              { icon: Shield, text: t("finalcta.point5") },
              { icon: Headphones, text: t("finalcta.point6") },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <p.icon className="w-4 h-4 text-primary" />
                <span>{p.text}</span>
              </motion.div>
            ))}
          </div>

          <a href="/auth">
            <Button variant="hero" size="lg" className="text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-7 rounded-full group">
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </a>

          <p className="text-xs text-muted-foreground/40 mt-5">{t("finalcta.note")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
