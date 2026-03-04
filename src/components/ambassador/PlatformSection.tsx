import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Shield, Eye, Lock, Fingerprint, BarChart3, Zap } from "lucide-react";

const PlatformSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Eye, title: t("platform.anonymity"), desc: t("platform.anonymityDesc") },
    { icon: Lock, title: t("platform.leadProtection"), desc: t("platform.leadProtectionDesc") },
    { icon: Fingerprint, title: t("platform.discretion"), desc: t("platform.discretionDesc") },
    { icon: BarChart3, title: t("platform.dashboard"), desc: t("platform.dashboardDesc") },
    { icon: Shield, title: t("platform.compliance"), desc: t("platform.complianceDesc") },
    { icon: Zap, title: t("platform.instant"), desc: t("platform.instantDesc") },
  ];

  return (
    <section className="section-mobile relative overflow-hidden">
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("platform.label")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            {t("platform.title")}{" "}
            <span className="text-gradient-primary">{t("platform.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("platform.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-2xl p-5 sm:p-6 bg-secondary/20 border border-border/30 hover:border-primary/20 hover:bg-secondary/40 transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2">{f.title}</h3>
              <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
