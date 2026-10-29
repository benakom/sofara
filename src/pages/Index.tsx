import LazyFold from "@/components/landing/LazyFold";
import { fold } from "@/lib/fold";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import DeferredChatbot from "@/components/landing/DeferredChatbot";
import SEO from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import { HOME_META, PAGE_PATHS, SITE_URL, type Locale } from "@/i18n/locales";

// Below-the-fold sections are prerendered; each fold's code loads (and the fold is rendered from it) when it comes
// within a viewport of the screen, see src/components/landing/LazyFold.tsx.
const FOLD_START = fold(
  () => import("@/components/ambassador/TrustBar"),
  () => import("@/components/ambassador/HowItWorksSection"),
  () => import("@/components/ambassador/CommissionSection"),
);
const FOLD_WHY = fold(() => import("@/components/ambassador/WhySofaraSection"), () => import("@/components/ambassador/MidCTABanner"));
const FOLD_DUBAI = fold(
  () => import("@/components/ambassador/MarketDataSection"),
  () => import("@/components/ambassador/WhyDubaiSection"),
  () => import("@/components/ambassador/PlatformSection"),
);
const FOLD_STORY = fold(
  () => import("@/components/ambassador/StorytellingSection"),
  () => import("@/components/ambassador/BenefitsSection"),
  () => import("@/components/ambassador/TestimonialsSection"),
  () => import("@/components/ambassador/InvestorMetrics"),
);
const FOLD_FINAL = fold(
  () => import("@/components/ambassador/FinalCTASection"),
  () => import("@/components/ambassador/FAQSection"),
  () => import("@/components/ambassador/FooterSection"),
);

const Loader = () => (
  <div className="py-16 flex justify-center">
    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = ({ locale = "en" }: { locale?: Locale }) => {
  const { t } = useLanguage();
  const meta = HOME_META[locale];
  const canonical = `${SITE_URL}${PAGE_PATHS.home[locale]}`;
  // FAQPage schema mirrors the FAQ rendered on the page, in the page's language.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: [1, 2, 3, 4, 5, 6].map((i) => ({
      "@type": "Question",
      name: t(`faq.q${i}`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq.a${i}`) },
    })),
  };
  return (
    <div className="min-h-screen bg-background">
      <SEO route="/" title={meta.title} description={meta.description} canonical={canonical} locale={locale} jsonLd={faqJsonLd} />
      <Navbar />
      <main>
        <HeroSection />

        {/* First fold — loads immediately after hero */}
        <LazyFold id="fold-start" fold={FOLD_START} scope={locale} fallback={<Loader />}>
          {([TrustBar, HowItWorksSection, CommissionSection]) => (
            <>
              <TrustBar />
              <section id="comment" aria-label="How Sofara works — 3 simple steps">
                <HowItWorksSection />
              </section>
              <section id="avantages" aria-label="Ambassador Commissions">
                <CommissionSection />
              </section>
            </>
          )}
        </LazyFold>

        {/* Second fold */}
        <LazyFold id="fold-why" fold={FOLD_WHY} scope={locale} fallback={<Loader />}>
          {([WhySofaraSection, MidCTABanner]) => (
            <>
              <section id="why-sofara" aria-label="Why choose Sofara">
                <WhySofaraSection />
              </section>
              <MidCTABanner />
            </>
          )}
        </LazyFold>

        {/* Third fold */}
        <LazyFold id="fold-dubai" fold={FOLD_DUBAI} scope={locale} fallback={<Loader />}>
          {([MarketDataSection, WhyDubaiSection, PlatformSection]) => (
            <>
              <section id="dubai" aria-label="Dubai Real Estate Market Data">
                <MarketDataSection />
              </section>
              <WhyDubaiSection />
              <section id="platform" aria-label="Sofara Ambassador Platform">
                <PlatformSection />
              </section>
            </>
          )}
        </LazyFold>

        {/* Fourth fold */}
        <LazyFold id="fold-story" fold={FOLD_STORY} scope={locale} fallback={<Loader />}>
          {([StorytellingSection, BenefitsSection, TestimonialsSection, InvestorMetrics]) => (
            <>
              <StorytellingSection />
              <BenefitsSection />
              <TestimonialsSection />
              <InvestorMetrics />
            </>
          )}
        </LazyFold>

        {/* Final */}
        <LazyFold id="fold-final" fold={FOLD_FINAL} scope={locale} fallback={<Loader />}>
          {([FinalCTASection, FAQSection, FooterSection]) => (
            <>
              <FinalCTASection />
              <FAQSection />
              <FooterSection />
            </>
          )}
        </LazyFold>
      </main>
      <DeferredChatbot />
    </div>
  );
};

export default Index;
