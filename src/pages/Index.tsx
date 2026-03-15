import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";

// Lazy load all below-fold sections
const MarketDataSection = lazy(() => import("@/components/ambassador/MarketDataSection"));
const WhyDubaiSection = lazy(() => import("@/components/ambassador/WhyDubaiSection"));
const PlatformSection = lazy(() => import("@/components/ambassador/PlatformSection"));
const StorytellingSection = lazy(() => import("@/components/ambassador/StorytellingSection"));
const BenefitsSection = lazy(() => import("@/components/ambassador/BenefitsSection"));
const CommissionSection = lazy(() => import("@/components/ambassador/CommissionSection"));
const HowItWorksSection = lazy(() => import("@/components/ambassador/HowItWorksSection"));
const InvestorMetrics = lazy(() => import("@/components/ambassador/InvestorMetrics"));
const TestimonialsSection = lazy(() => import("@/components/ambassador/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/ambassador/FAQSection"));
const CTASection = lazy(() => import("@/components/ambassador/CTASection"));
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
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <div id="dubai">
          <MarketDataSection />
          <WhyDubaiSection />
        </div>
        <div id="platform">
          <PlatformSection />
        </div>
        <StorytellingSection />
        <div id="avantages">
          <BenefitsSection />
        </div>
        <CommissionSection />
        <div id="comment">
          <HowItWorksSection />
        </div>
        <InvestorMetrics />
        <TestimonialsSection />
        <FAQSection />
        <div id="postuler">
          <CTASection />
        </div>
        <FooterSection />
      </Suspense>
    </div>
  );
};

export default Index;
