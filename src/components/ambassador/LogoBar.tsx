import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const LogoBar = () => {
  const { t } = useLanguage();
  const logos = ["Bloomberg", "Forbes", "CNBC", "Arabian Business", "Gulf News", "Reuters"];

  return (
    <section className="py-12 border-y border-border/30">
      <div className="container mx-auto px-6">
        <p className="text-center text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-8 font-medium">
          {t("logos.title")}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
          {logos.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="font-display text-base sm:text-lg font-semibold text-muted-foreground/40 tracking-tight hover:text-muted-foreground/60 transition-colors"
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
