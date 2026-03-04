import { motion } from "framer-motion";
import { DollarSign, Users, Zap, Trophy, Gift, TrendingUp } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

const BenefitsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    { icon: DollarSign, title: t("benefits.commissions"), description: t("benefits.commissionsDesc") },
    { icon: Users, title: t("benefits.community"), description: t("benefits.communityDesc") },
    { icon: Zap, title: t("benefits.tools"), description: t("benefits.toolsDesc") },
    { icon: Trophy, title: t("benefits.recognition"), description: t("benefits.recognitionDesc") },
    { icon: Gift, title: t("benefits.perks"), description: t("benefits.perksDesc") },
    { icon: TrendingUp, title: t("benefits.growth"), description: t("benefits.growthDesc") },
  ];

  return (
    <section className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t("benefits.label")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("benefits.title")}{" "}
            <span className="text-gradient-primary">{t("benefits.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("benefits.description")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={item}
              className="group rounded-2xl p-7 bg-secondary/20 border border-border/30 hover:border-primary/20 hover:bg-secondary/40 transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
