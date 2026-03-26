import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const TrustBar = () => {
  const { t } = useLanguage();
  const logos = [
    { name: "Bloomberg", opacity: "opacity-30" },
    { name: "Forbes", opacity: "opacity-30" },
    { name: "CNBC", opacity: "opacity-30" },
    { name: "Arabian Business", opacity: "opacity-30" },
    { name: "Gulf News", opacity: "opacity-30" },
    { name: "Reuters", opacity: "opacity-30" },
  ];

  return (
    <section className="py-8 sm:py-10 border-y border-border/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-aurora opacity-20" />
      <div className="relative mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="flex flex-col items-center">
          <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 uppercase tracking-[0.25em] font-medium mb-5 sm:mb-6">
            {t("trust.mediaTitle")}
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap">
            {logos.map((logo, i) => (
              <motion.span
                key={logo.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`font-display text-sm sm:text-base md:text-lg font-semibold text-muted-foreground/30 tracking-tight hover:text-muted-foreground/50 transition-colors duration-300`}
              >
                {logo.name}
              </motion.span>
            ))}
          </div>
          
          <div className="flex items-center gap-6 sm:gap-10 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border/15">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-muted-foreground">{t("trust.liveAgents")}</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="text-primary font-semibold">RERA</span> {t("trust.licensed")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              <span className="text-primary font-semibold">0%</span> {t("trust.fees")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
