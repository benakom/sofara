import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
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
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={images[current]} alt="Dubai real estate" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="text-sm font-medium text-primary">{t("hero.badge")}</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] mb-6 text-foreground">
                {t(`hero.${slideKeys[current]}.headline`)}
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                {t(`hero.${slideKeys[current]}.sub`)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl group">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 rounded-xl group">
                  <Play className="w-4 h-4 mr-2" />
                  {t("hero.ctaSecondary")}
                </Button>
              </div>

              {/* Trust bar */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {["K", "S", "M", "A"].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/15 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                      {l}
                    </div>
                  ))}
                </div>
                <span>{t("hero.trust")}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right side — floating metrics */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { value: "€2.5M+", label: t("hero.metric1"), icon: "💰" },
              { value: "500+", label: t("hero.metric2"), icon: "🌍" },
              { value: "8-12%", label: t("hero.metric3"), icon: "📈" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all duration-500"
              >
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <div className="font-display text-2xl font-bold text-gradient-gold">{m.value}</div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-6 flex gap-2">
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
      </div>
    </section>
  );
};

export default HeroSection;
