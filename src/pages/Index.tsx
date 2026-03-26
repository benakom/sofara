import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import LandingChatbot from "@/components/landing/LandingChatbot";

// Lazy load all below-fold sections
const TrustBar = lazy(() => import("@/components/ambassador/TrustBar"));
const CommissionSection = lazy(() => import("@/components/ambassador/CommissionSection"));
const HowItWorksSection = lazy(() => import("@/components/ambassador/HowItWorksSection"));
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

          {/* 2. Show the money first — hook visitors immediately */}
          <section id="avantages" aria-label="Ambassador Commissions">
            <CommissionSection />
          </section>

          {/* 3. How simple it is — reduce friction */}
          <section id="comment" aria-label="How to become a Dubai Real Estate Ambassador">
            <HowItWorksSection />
          </section>

          {/* 4. Dubai market opportunity — hook investors */}
          <section id="dubai" aria-label="Dubai Real Estate Market Data">
            <MarketDataSection />
          </section>

          {/* 5. Mid-page conversion break */}
          <MidCTABanner />

          {/* 6. Why Dubai deeper dive */}
          <WhyDubaiSection />

          {/* 7. Platform features */}
          <section id="platform" aria-label="Sofara Ambassador Platform">
            <PlatformSection />
          </section>

          {/* 8. Storytelling — your network = money */}
          <StorytellingSection />

          {/* 9. Benefits */}
          <BenefitsSection />

          {/* 10. Social proof — testimonials */}
          <TestimonialsSection />

          {/* 11. Traction metrics */}
          <InvestorMetrics />

          {/* 12. Final CTA with urgency */}
          <FinalCTASection />

          {/* 13. FAQ */}
          <FAQSection />

          {/* 14. Footer */}
          <FooterSection />
        </Suspense>
      </main>
      <LandingChatbot />
    </div>
  );
};

export default Index;
