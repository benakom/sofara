import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Shield, Eye, Lock, Fingerprint, BarChart3, Zap } from "lucide-react";
import platformDashboard from "@/assets/platform-dashboard.jpg";

const PlatformSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Eye, title: t("platform.anonymity"), desc: t("platform.anonymityDesc"), color: "text-primary" },
    { icon: Lock, title: t("platform.leadProtection"), desc: t("platform.leadProtectionDesc"), color: "text-primary" },
    { icon: Fingerprint, title: t("platform.discretion"), desc: t("platform.discretionDesc"), color: "text-primary" },
    { icon: BarChart3, title: t("platform.dashboard"), desc: t("platform.dashboardDesc"), color: "text-primary" },
    { icon: Shield, title: t("platform.compliance"), desc: t("platform.complianceDesc"), color: "text-primary" },
    { icon: Zap, title: t("platform.instant"), desc: t("platform.instantDesc"), color: "text-primary" },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-gold-soft opacity-20" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            {t("platform.label")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("platform.title")}{" "}
            <span className="text-gradient-gold">{t("platform.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("platform.description")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <div className="rounded-2xl overflow-hidden shadow-card-dark border border-border/30">
              <img src={platformDashboard} alt="Sofara Dashboard" className="w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-primary/10 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-primary/10 blur-[80px] -z-10" />
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
