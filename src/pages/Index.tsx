import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import DeferredChatbot from "@/components/landing/DeferredChatbot";
import SEO from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import { HOME_META, PAGE_PATHS, SITE_URL, type Locale } from "@/i18n/locales";

// Lazy load below-fold sections
const TrustBar = lazy(() => import("@/components/ambassador/TrustBar"));
const HowItWorksSection = lazy(() => import("@/components/ambassador/HowItWorksSection"));
const CommissionSection = lazy(() => import("@/components/ambassador/CommissionSection"));
const WhySofaraSection = lazy(() => import("@/components/ambassador/WhySofaraSection"));
const AIAdvantageSection = lazy(() => import("@/components/ambassador/AIAdvantageSection"));
const MarketDataSection = lazy(() => import("@/components/ambassador/MarketDataSection"));
const MidCTABanner = lazy(() => import("@/components/ambassador/MidCTABanner"));
const WhyDubaiSection = lazy(() => import("@/components/ambassador/WhyDubaiSection"));
const PlatformSection = lazy(() => import("@/components/ambassador/PlatformSection"));
const StorytellingSection = lazy(() => import("@/components/ambassador/StorytellingSection"));
const BenefitsSection = lazy(() => import("@/components/ambassador/BenefitsSection"));
const InvestorMetrics = lazy(() => import("@/components/ambassador/InvestorMetrics"));
const FinalCTASection = lazy(() => import("@/components/ambassador/FinalCTASection"));
const FAQSection = lazy(() => import("@/components/ambassador/FAQSection"));
const FooterSection = lazy(() => import("@/components/ambassador/FooterSection"));

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
        <Suspense fallback={<Loader />}>
          <TrustBar />
          <section id="comment" aria-label="How Sofara works — 3 simple steps">
            <HowItWorksSection />
          </section>
          <section id="avantages" aria-label="Ambassador Commissions">
            <CommissionSection />
          </section>
        </Suspense>

        {/* Second fold */}
        <Suspense fallback={<Loader />}>
          <section id="why-sofara" aria-label="Why choose Sofara">
            <WhySofaraSection />
          </section>
          <AIAdvantageSection />
          <MidCTABanner />
        </Suspense>

        {/* Third fold */}
        <Suspense fallback={<Loader />}>
          <section id="dubai" aria-label="Dubai Real Estate Market Data">
            <MarketDataSection />
          </section>
          <WhyDubaiSection />
          <section id="platform" aria-label="Sofara Ambassador Platform">
            <PlatformSection />
          </section>
        </Suspense>

        {/* Fourth fold */}
        <Suspense fallback={<Loader />}>
          <StorytellingSection />
          <BenefitsSection />
          <InvestorMetrics />
        </Suspense>

        {/* Final */}
        <Suspense fallback={<Loader />}>
          <FinalCTASection />
          <FAQSection />
          <FooterSection />
        </Suspense>
      </main>
      <DeferredChatbot />
    </div>
  );
};

export default Index;
