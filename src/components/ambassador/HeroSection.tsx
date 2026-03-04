import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import dubaiHero1 from "@/assets/dubai-hero-1.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={dubaiHero1} alt="Dubai" className="w-full h-full object-cover opacity-20" />
      </div>

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
              <span className="text-foreground">{t("hero.slide1.headline")}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              {t("hero.slide1.sub")}
            </p>

            <div className="flex justify-center">
              <a href="#postuler">
                <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-full group">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
