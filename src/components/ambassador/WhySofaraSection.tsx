import { motion } from "framer-motion";
import { Shield, Eye, Headphones, Brain, Award, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import dubaiPartnership from "@/assets/dubai-partnership.jpg";

const WhySofaraSection = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: Award, title: t("whysofara.experience"), desc: t("whysofara.experienceDesc") },
    { icon: Eye, title: t("whysofara.transparency"), desc: t("whysofara.transparencyDesc") },
    { icon: Headphones, title: t("whysofara.support"), desc: t("whysofara.supportDesc") },
    { icon: Brain, title: t("whysofara.ai"), desc: t("whysofara.aiDesc") },
    { icon: Shield, title: t("whysofara.protection"), desc: t("whysofara.protectionDesc") },
    { icon: Clock, title: t("whysofara.speed"), desc: t("whysofara.speedDesc") },
  ];

  return (
    <section id="why-sofara" className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-30" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-border/30">
              <img src={dubaiPartnership} alt="Sofara partnership in Dubai" className="w-full h-[280px] sm:h-[400px] lg:h-[500px] object-cover" loading="lazy" />
            </div>
            {/* Floating AI badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 sm:-bottom-6 right-4 sm:-right-6 rounded-xl bg-primary/10 backdrop-blur-xl border border-primary/30 p-4 sm:p-5 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">{t("whysofara.aiBadge")}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t("whysofara.aiBadgeSub")}</div>
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/8 blur-[40px] rounded-full" />
          </motion.div>

          {/* Content side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
                {t("whysofara.label")}
              </span>
              <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground leading-tight">
                {t("whysofara.title")}{" "}
                <span className="text-gradient-primary">{t("whysofara.titleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
                {t("whysofara.description")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-8">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <p.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-foreground">{p.title}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <a href="/auth">
              <Button variant="hero" size="lg" className="text-base px-7 sm:px-8 py-5 sm:py-6 rounded-full group">
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySofaraSection;
