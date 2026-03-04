import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: t("testimonials.t1.name"), role: t("testimonials.t1.role"), text: t("testimonials.t1.text"), avatar: "K", amount: "€18,000+" },
    { name: t("testimonials.t2.name"), role: t("testimonials.t2.role"), text: t("testimonials.t2.text"), avatar: "S", amount: "€32,000+" },
    { name: t("testimonials.t3.name"), role: t("testimonials.t3.role"), text: t("testimonials.t3.text"), avatar: "J", amount: "€12,500+" },
    { name: t("testimonials.t4.name"), role: t("testimonials.t4.role"), text: t("testimonials.t4.text"), avatar: "A", amount: "€45,000+" },
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t("testimonials.label")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            {t("testimonials.title")}{" "}
            <span className="text-gradient-primary">{t("testimonials.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">{t("testimonials.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((te, i) => (
            <motion.div
              key={te.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 bg-secondary/20 border border-border/30 hover:border-primary/20 transition-all duration-500 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">"{te.text}"</p>
              <div className="border-t border-border/30 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
                    {te.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{te.name}</div>
                    <div className="text-xs text-muted-foreground">{te.role}</div>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
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
