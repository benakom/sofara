import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import LandingChatbot from "@/components/landing/LandingChatbot";

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
          <section id="dubai" aria-label="Dubai Real Estate Market Data">
            <MarketDataSection />
            <WhyDubaiSection />
          </section>
          <section id="platform" aria-label="Sofara Ambassador Platform">
            <PlatformSection />
          </section>
          <StorytellingSection />
          <section id="avantages" aria-label="Ambassador Benefits and Commissions">
            <BenefitsSection />
          </section>
          <CommissionSection />
          <section id="comment" aria-label="How to become a Dubai Real Estate Ambassador">
            <HowItWorksSection />
          </section>
          <InvestorMetrics />
          <TestimonialsSection />
          <FAQSection />
          <FooterSection />
        </Suspense>
      </main>
      <LandingChatbot />
    </div>
  );
};

export default Index;
