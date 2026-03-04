import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import LogoBar from "@/components/ambassador/LogoBar";
import StatsSection from "@/components/ambassador/StatsSection";
import MarketDataSection from "@/components/ambassador/MarketDataSection";
import PlatformSection from "@/components/ambassador/PlatformSection";
import WhyDubaiSection from "@/components/ambassador/WhyDubaiSection";
import StorytellingSection from "@/components/ambassador/StorytellingSection";
import BenefitsSection from "@/components/ambassador/BenefitsSection";
import HowItWorksSection from "@/components/ambassador/HowItWorksSection";
import InvestorMetrics from "@/components/ambassador/InvestorMetrics";
import TestimonialsSection from "@/components/ambassador/TestimonialsSection";
import FAQSection from "@/components/ambassador/FAQSection";
import CTASection from "@/components/ambassador/CTASection";
import FooterSection from "@/components/ambassador/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LogoBar />
      <StatsSection />
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
    </div>
  );
};

export default Index;
