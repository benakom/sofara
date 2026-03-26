import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Building2, Globe, Banknote, Sun } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import dubaiLifestyle from "@/assets/dubai-marina-golden.jpg";

const WhyDubaiSection = () => {
  const { t } = useLanguage();

  const advantages = [
    { icon: Banknote, title: t("dubai.tax"), desc: t("dubai.taxDesc") },
    { icon: TrendingUp, title: t("dubai.yield"), desc: t("dubai.yieldDesc") },
    { icon: Building2, title: t("dubai.market"), desc: t("dubai.marketDesc") },
    { icon: Globe, title: t("dubai.hub"), desc: t("dubai.hubDesc") },
    { icon: ShieldCheck, title: t("dubai.secure"), desc: t("dubai.secureDesc") },
    { icon: Sun, title: t("dubai.lifestyle"), desc: t("dubai.lifestyleDesc") },
  ];

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/30">
              <img src={dubaiLifestyle} alt="Dubai Marina luxury lifestyle" className="w-full h-[280px] sm:h-[400px] lg:h-[480px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <div className="rounded-xl bg-secondary/80 backdrop-blur-xl border border-border/40 p-4 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-2xl font-display font-bold text-gradient-primary">+27%</div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t("dubai.growth")}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{t("dubai.growthSub")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/8 blur-[40px] rounded-full" />
          </motion.div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
                {t("dubai.label")}
              </span>
              <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground leading-tight">
                {t("dubai.title")}{" "}
                <span className="text-gradient-primary">{t("dubai.titleHighlight")}</span>{" "}
                {t("dubai.titleEnd")}
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
                {t("dubai.description")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {advantages.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <a.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-foreground">{a.title}</div>
                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">{a.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDubaiSection;
