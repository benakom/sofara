import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t } = useLanguage();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
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
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("faq.label")}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            {t("faq.title")}{" "}
            <span className="text-gradient-gold">{t("faq.titleHighlight")}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-card rounded-xl px-4 sm:px-6 border border-border/50 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-4 sm:py-5 text-[13px] sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-5 text-xs sm:text-sm">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
