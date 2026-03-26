import { motion } from "framer-motion";
import { Brain, Target, BarChart3, MessageSquare, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import aiTechDubai from "@/assets/ai-tech-dubai.jpg";

const AIAdvantageSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Target, title: t("ai.scoring"), desc: t("ai.scoringDesc") },
    { icon: MessageSquare, title: t("ai.scripts"), desc: t("ai.scriptsDesc") },
    { icon: BarChart3, title: t("ai.analytics"), desc: t("ai.analyticsDesc") },
    { icon: Zap, title: t("ai.automation"), desc: t("ai.automationDesc") },
  ];

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold">{t("ai.badge")}</span>
            </div>

            <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground leading-tight">
              {t("ai.title")}{" "}
              <span className="text-gradient-primary">{t("ai.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
              {t("ai.description")}
            </p>

            <div className="space-y-3 mb-8 sm:mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-foreground">{f.title}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Conversion stat */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-gradient-primary">{t("ai.conversionStat")}</div>
                <div className="text-sm text-muted-foreground">{t("ai.conversionLabel")}</div>
              </div>
            </div>

            <a href="/auth">
              <Button variant="hero" size="lg" className="text-base px-7 sm:px-8 py-5 sm:py-6 rounded-full group">
                {t("ai.cta")}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-primary/20">
              <img src={aiTechDubai} alt="Sofara AI-powered real estate platform" className="w-full h-[280px] sm:h-[400px] lg:h-[500px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/8 blur-[40px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvantageSection;
