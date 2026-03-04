import { motion } from "framer-motion";
import dubaiNetwork from "@/assets/dubai-network.jpg";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const StorytellingSection = () => {
  const { t } = useLanguage();

  const points = [
    t("story.point1"),
    t("story.point2"),
    t("story.point3"),
    t("story.point4"),
  ];

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-40" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
              {t("story.label")}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground leading-tight">
              {t("story.title")}{" "}
              <span className="text-gradient-primary">{t("story.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              {t("story.description")}
            </p>

            <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-10">
              {points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border/20"
                >
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90 text-[13px] sm:text-sm leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="text-[15px] sm:text-base px-7 sm:px-8 py-5 sm:py-6 rounded-full group">
              {t("story.cta")}
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-border/30">
              <img src={dubaiNetwork} alt="Sofara network" className="w-full h-[280px] sm:h-[400px] lg:h-[500px] object-cover" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 sm:-bottom-6 left-4 sm:-left-6 rounded-xl bg-secondary/90 backdrop-blur-xl border border-border/40 p-4 sm:p-5 shadow-2xl"
            >
              <div className="text-xl sm:text-2xl font-display font-bold text-gradient-primary">€7 500+</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">{t("story.statLabel")}</div>
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/8 blur-[40px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
