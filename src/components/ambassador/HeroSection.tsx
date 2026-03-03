import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={images[current]} alt="Dubai real estate" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="text-sm font-medium text-primary">{t("hero.badge")}</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
                {t(`hero.${slideKeys[current]}.headline`)}
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                {t(`hero.${slideKeys[current]}.sub`)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 rounded-xl">
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-12 left-6 right-6 flex items-center justify-between">
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === current ? "w-12 bg-primary" : "w-6 bg-foreground/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-foreground hover:border-primary/50 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-foreground hover:border-primary/50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
