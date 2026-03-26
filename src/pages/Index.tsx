import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import LandingChatbot from "@/components/landing/LandingChatbot";

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
const TestimonialsSection = lazy(() => import("@/components/ambassador/TestimonialsSection"));
const InvestorMetrics = lazy(() => import("@/components/ambassador/InvestorMetrics"));
const FinalCTASection = lazy(() => import("@/components/ambassador/FinalCTASection"));
const FAQSection = lazy(() => import("@/components/ambassador/FAQSection"));
const FooterSection = lazy(() => import("@/components/ambassador/FooterSection"));

const Loader = () => (
  <div className="py-16 flex justify-center">
    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
          <TestimonialsSection />
          <InvestorMetrics />
        </Suspense>

        {/* Final */}
        <Suspense fallback={<Loader />}>
          <FinalCTASection />
          <FAQSection />
          <FooterSection />
        </Suspense>
      </main>
      <LandingChatbot />
    </div>
  );
};

export default Index;
