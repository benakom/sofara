import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import StatsSection from "@/components/ambassador/StatsSection";
import BenefitsSection from "@/components/ambassador/BenefitsSection";
import HowItWorksSection from "@/components/ambassador/HowItWorksSection";
import CTASection from "@/components/ambassador/CTASection";
import FooterSection from "@/components/ambassador/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <div id="avantages">
        <BenefitsSection />
      </div>
      <div id="comment">
        <HowItWorksSection />
      </div>
      <div id="postuler">
        <CTASection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
