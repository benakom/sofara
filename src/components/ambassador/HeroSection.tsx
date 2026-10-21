import { useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Send, Handshake, Banknote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";

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

// Keyword-rich prefix read by screen readers and search engines in front of the visual headline.
const H1_PREFIX: Record<string, string> = {
  en: "Sofara, the Dubai & UAE real estate ambassadors network — ",
  fr: "Sofara, le réseau d'ambassadeurs de l'immobilier à Dubaï et aux Émirats — ",
  ar: "Sofara, le réseau d'ambassadeurs de l'immobilier à Dubaï et aux Émirats — ",
  es: "Sofara, la red de embajadores inmobiliarios de Dubái y EAU — ",
  ru: "Sofara — сеть амбассадоров недвижимости Дубая и ОАЭ — ",
};
const UP_TO_3: Record<string, string> = { en: "Up to 3%", fr: "Jusqu'à 3 %", ar: "Jusqu'à 3 %", es: "Hasta 3 %", ru: "До 3%" };

const HeroSection = () => {
  const { t, lang } = useLanguage();

  const steps = [
    { icon: Send, label: t("hero.step1"), num: "01" },
    { icon: Handshake, label: t("hero.step2"), num: "02" },
    { icon: Banknote, label: t("hero.step3"), num: "03" },
  ];

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex flex-col" aria-label={(H1_PREFIX[lang] ?? H1_PREFIX.en).replace(/ — $/, "")}>
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-10 hidden sm:block" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-primary/5 blur-[100px] sm:blur-[150px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-accent/5 blur-[80px] sm:blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 flex-1 flex items-center w-full px-4 sm:px-6 pt-14 sm:pt-20 pb-6 sm:pb-20">
        <div className="max-w-5xl mx-auto text-center w-full">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs sm:text-sm font-semibold tracking-wide">{t("hero.badge")}</span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="font-hero text-[2.25rem] leading-[0.95] sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-3 sm:mb-8 whitespace-pre-line capitalize text-white">
              <span className="sr-only">{H1_PREFIX[lang] ?? H1_PREFIX.en}</span>
              {(() => {
                const headline = t("hero.slide1.headline");
                const highlight = t("hero.slide1.highlight");
                const idx = headline.toLowerCase().indexOf(highlight.toLowerCase());
                if (idx === -1) return headline;
                return (
                  <>
                    {headline.slice(0, idx)}
                    <span className="marker-fluo">{headline.slice(idx, idx + highlight.length)}</span>
                    {headline.slice(idx + highlight.length)}
                  </>
                );
              })()}
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-5 sm:mb-10 leading-relaxed px-2">
              {(() => {
                const sub = t("hero.slide1.sub");
                const highlights = ["3%", "no license", "from anywhere", "sans licence", "depuis n'importe où dans le monde", "sin licencia", "desde cualquier parte del mundo", "без лицензии", "из любой точки мира"];
                // Build a regex matching any highlight, case-insensitive
                const regex = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
                const parts = sub.split(regex);
                return parts.map((part, i) =>
                  regex.test(part) || highlights.some(h => h.toLowerCase() === part.toLowerCase())
                    ? <span key={i} className="text-primary font-semibold">{part}</span>
                    : <span key={i}>{part}</span>
                );
              })()}
            </p>
          </div>

          {/* 3-Step Process Visual */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 mb-5 sm:mb-10"
          >
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-0">
                <div
                  className="flex items-center gap-2.5 px-4 sm:px-6 py-2 sm:py-4 rounded-2xl bg-secondary/50 border border-border/40 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">{step.num}</div>
                    <div className="text-sm sm:text-base font-bold text-foreground whitespace-nowrap">{step.label}</div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:flex items-center px-2">
                    <ArrowRight className="w-4 h-4 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 mb-5 sm:mb-14"
          >
            <a href="/auth">
              <Button variant="hero" size="lg" className="text-base sm:text-lg px-7 sm:px-10 py-5 sm:py-7 rounded-full group">
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </a>
            <a href="#comment">
              <Button variant="heroOutline" size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-7 rounded-full">
                {t("hero.ctaSecondaryNew")}
              </Button>
            </a>
          </div>

          {/* AI + Metrics strip */}
          <div
            className="hidden sm:flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {/* AI badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="text-left">
                <div className="text-base sm:text-base font-bold text-primary font-display">{t("hero.aiLabel")}</div>
                <div className="text-xs sm:text-xs text-primary/70">{t("hero.aiSub")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 backdrop-blur-sm">
              <div className="text-left">
                <div className="text-base sm:text-base font-bold text-foreground font-display">AED 1M+</div>
                <div className="text-xs sm:text-xs text-muted-foreground">{t("hero.metric1")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 backdrop-blur-sm">
              <div className="text-left">
                <div className="text-base sm:text-base font-bold text-foreground font-display">{UP_TO_3[lang] ?? UP_TO_3.en}</div>
                <div className="text-xs sm:text-xs text-muted-foreground">{t("hero.metric3Label")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 backdrop-blur-sm">
              <div className="text-left">
                <div className="text-base sm:text-base font-bold text-foreground font-display"><AnimatedCounter target={200} suffix="+" /></div>
                <div className="text-xs sm:text-xs text-muted-foreground">{t("hero.metric2Short")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
