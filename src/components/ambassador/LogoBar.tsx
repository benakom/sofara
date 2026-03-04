import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const LogoBar = () => {
  const { t } = useLanguage();

  const logos = [
    "Bloomberg", "Forbes", "CNBC", "Arabian Business", "Gulf News", "Reuters"
  ];

  return (
    <section className="py-10 border-y border-border/30 bg-secondary/20">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-6">
          {t("logos.title")}
        </p>
        <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-40">
          {logos.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="font-display text-lg sm:text-xl font-bold text-foreground/60 tracking-tight"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoBar;
