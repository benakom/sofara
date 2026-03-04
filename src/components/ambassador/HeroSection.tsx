import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import dubaiHero1 from "@/assets/dubai-hero-1.jpg";
import dubaiHero2 from "@/assets/dubai-hero-2.jpg";
import dubaiHero3 from "@/assets/dubai-hero-3.jpg";

const images = [dubaiHero1, dubaiHero2, dubaiHero3];
const slideKeys = ["slide1", "slide2", "slide3"];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={images[current]} alt="Dubai" className="w-full h-full object-cover opacity-20" />
        </motion.div>
      </AnimatePresence>

      {/* Aurora overlay */}
      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Grid lines */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8 text-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-medium">{t("hero.badge")}</span>
              </motion.div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
                <span className="text-foreground">{t(`hero.${slideKeys[current]}.headline`).split('.')[0]}.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                {t(`hero.${slideKeys[current]}.sub`)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-full group">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 rounded-full">
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Metrics row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { value: "€2.5M+", label: t("hero.metric1") },
              { value: "500+", label: t("hero.metric2") },
              { value: "8-12%", label: t("hero.metric3") },
            ].map((m, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-secondary/30 border border-border/30">
                <div className="font-display text-xl sm:text-2xl font-bold text-gradient-primary mb-1">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Slide dots */}
          <div className="flex gap-1.5 justify-center mt-12">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === current ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
