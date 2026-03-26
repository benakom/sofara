import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import dubaiHero1 from "@/assets/dubai-hero-1.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center" aria-label="Sofara Dubai Real Estate Ambassador Program">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={dubaiHero1} alt="Dubai skyline panorama — Burj Khalifa and Downtown Dubai real estate" className="w-full h-full object-cover opacity-25" loading="eager" fetchPriority="high" decoding="async" />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-20 hidden sm:block" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-primary/5 blur-[100px] sm:blur-[150px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-accent/5 blur-[80px] sm:blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full px-5 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-hero text-[3.5rem] leading-[0.95] sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-5 sm:mb-8 whitespace-pre-line capitalize text-white">
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

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
              {t("hero.slide1.sub")}
            </p>

            <div className="flex justify-center">
              <a href="/auth">
                <Button variant="hero" size="lg" className="text-base sm:text-base px-7 sm:px-8 py-5 sm:py-6 rounded-full group">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
