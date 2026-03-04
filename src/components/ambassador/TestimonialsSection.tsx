import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: t("testimonials.t1.name"), role: t("testimonials.t1.role"), text: t("testimonials.t1.text"), avatar: "K", amount: "€8 000+" },
    { name: t("testimonials.t2.name"), role: t("testimonials.t2.role"), text: t("testimonials.t2.text"), avatar: "S", amount: "€14 500+" },
    { name: t("testimonials.t3.name"), role: t("testimonials.t3.role"), text: t("testimonials.t3.text"), avatar: "J", amount: "€6 200+" },
    { name: t("testimonials.t4.name"), role: t("testimonials.t4.role"), text: t("testimonials.t4.text"), avatar: "A", amount: "€11 000+" },
  ];

  return (
    <section className="section-mobile">
      <div className="mx-auto px-5 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            {t("testimonials.label")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">
            {t("testimonials.title")}{" "}
            <span className="text-gradient-primary">{t("testimonials.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-base max-w-xl mx-auto">{t("testimonials.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {testimonials.map((te, i) => (
            <motion.div
              key={te.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 sm:p-6 bg-secondary/20 border border-border/30 hover:border-primary/20 transition-all duration-500 flex flex-col"
            >
              <div className="flex gap-0.5 mb-3 sm:mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm sm:text-sm leading-relaxed mb-5 sm:mb-6 flex-1">"{te.text}"</p>
              <div className="border-t border-border/30 pt-3 sm:pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground text-xs sm:text-sm">
                    {te.avatar}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-foreground">{te.name}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{te.role}</div>
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-semibold">
                  {te.amount} {t("testimonials.earned")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
