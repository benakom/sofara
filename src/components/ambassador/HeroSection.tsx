import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";
import dubaiHero1 from "@/assets/dubai-hero-1.jpg";

const AnimatedCounter = ({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const controls = animate(count, target, { duration: 2.5, ease: "easeOut" });
    const unsub = rounded.on("change", v => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [target, count, rounded, prefix, suffix]);

  return <span>{display}</span>;
};

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center" aria-label="Sofara Dubai Real Estate Ambassador Program">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={dubaiHero1} alt="Dubai skyline panorama — Burj Khalifa and Downtown Dubai real estate" className="w-full h-full object-cover opacity-20" loading="eager" fetchPriority="high" decoding="async" />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-15 hidden sm:block" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-primary/5 blur-[100px] sm:blur-[150px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-accent/5 blur-[80px] sm:blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full px-5 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs sm:text-sm font-semibold tracking-wide">{t("hero.badge")}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h1 className="font-hero text-[2.8rem] leading-[0.95] sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-5 sm:mb-8 whitespace-pre-line capitalize text-white">
              {(() => {
                const headline = t("hero.slide1.headline");
                const highlight = t("hero.slide1.highlight");
                const idx = headline.toLowerCase().indexOf(highlight.toLowerCase());
                if (idx === -1) return headline;
                return (
                  <>
                    {headline.slice(0, idx)}
                    <span className="text-primary">{headline.slice(idx, idx + highlight.length)}</span>
                    {headline.slice(idx + highlight.length)}
                  </>
                );
              })()}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              {t("hero.slide1.sub")}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14"
          >
            <a href="/auth">
              <Button variant="hero" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full group">
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </a>
            <a href="#comment">
              <Button variant="heroOutline" size="lg" className="text-base px-7 sm:px-8 py-5 sm:py-7 rounded-full">
                {t("hero.ctaSecondaryNew")}
              </Button>
            </a>
          </motion.div>

          {/* Animated metrics strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {[
              { icon: Shield, value: <AnimatedCounter target={720000} prefix="AED " suffix="+" />, label: t("hero.metric1") },
              { icon: Globe, value: <><AnimatedCounter target={60} suffix="+" /><span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">· 12 {t("hero.countriesShort")}</span></>, label: t("hero.metric2Short") },
              { icon: Zap, value: <span>8–15%</span>, label: t("hero.metric3") },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 backdrop-blur-sm">
                <m.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm sm:text-base font-bold text-foreground font-display">{m.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{m.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
