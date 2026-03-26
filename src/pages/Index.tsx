import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import LandingChatbot from "@/components/landing/LandingChatbot";

// Lazy load all below-fold sections
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

const SectionFallback = () => (
  <div className="py-20 flex justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          {/* 1. Trust & social proof */}
          <TrustBar />

          {/* 2. Simple 3-step process — reduce friction immediately */}
          <section id="comment" aria-label="How Sofara works — 3 simple steps">
            <HowItWorksSection />
          </section>

          {/* 3. Show the money — hook visitors */}
          <section id="avantages" aria-label="Ambassador Commissions">
            <CommissionSection />
          </section>

          {/* 4. Why Sofara — Experience, Transparency, Support */}
          <section id="why-sofara" aria-label="Why choose Sofara">
            <WhySofaraSection />
          </section>

          {/* 5. AI Advantage — Technology for higher conversions */}
          <AIAdvantageSection />

          {/* 6. Mid-page conversion break */}
          <MidCTABanner />

          {/* 7. Dubai market data */}
          <section id="dubai" aria-label="Dubai Real Estate Market Data">
            <MarketDataSection />
          </section>

          {/* 8. Why Dubai deeper dive */}
          <WhyDubaiSection />

          {/* 9. Platform features */}
          <section id="platform" aria-label="Sofara Ambassador Platform">
            <PlatformSection />
          </section>

          {/* 10. Storytelling — your network = money */}
          <StorytellingSection />

          {/* 11. Benefits */}
          <BenefitsSection />

          {/* 12. Social proof — testimonials */}
          <TestimonialsSection />

          {/* 13. Traction metrics */}
          <InvestorMetrics />

          {/* 14. Final CTA with urgency */}
          <FinalCTASection />

          {/* 15. FAQ */}
          <FAQSection />

          {/* 16. Footer */}
          <FooterSection />
        </Suspense>
      </main>
      <LandingChatbot />
    </div>
  );
};

export default Index;
