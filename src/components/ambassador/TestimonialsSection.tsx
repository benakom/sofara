import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: t("testimonials.t1.name"), role: t("testimonials.t1.role"), text: t("testimonials.t1.text"), avatar: "K" },
    { name: t("testimonials.t2.name"), role: t("testimonials.t2.role"), text: t("testimonials.t2.text"), avatar: "S" },
    { name: t("testimonials.t3.name"), role: t("testimonials.t3.role"), text: t("testimonials.t3.text"), avatar: "J" },
  ];

  return (
    <section className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            {t("testimonials.label")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {t("testimonials.title")}{" "}
            <span className="text-gradient-gold">{t("testimonials.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((te, i) => (
            <motion.div
              key={te.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card rounded-2xl p-8 hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center font-display font-bold text-primary">
                  {te.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{te.name}</div>
                  <div className="text-xs text-muted-foreground">{te.role}</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed italic">"{te.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
