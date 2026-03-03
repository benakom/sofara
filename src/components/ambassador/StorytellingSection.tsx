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
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-gold-soft opacity-20" />
      <div className="container relative mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              {t("story.label")}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground leading-tight">
              {t("story.title")}{" "}
              <span className="text-gradient-gold">{t("story.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t("story.description")}
            </p>

            <div className="space-y-4 mb-10">
              {points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl">
              {t("story.cta")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-card-dark">
              <img src={dubaiNetwork} alt="Ambassadeur network Dubai" className="w-full h-[500px] object-cover" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-6 shadow-gold"
            >
              <div className="text-3xl font-display font-bold text-gradient-gold">€5,000+</div>
              <div className="text-sm text-muted-foreground">{t("story.statLabel")}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
