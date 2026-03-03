import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import StatsSection from "@/components/ambassador/StatsSection";
import WhyDubaiSection from "@/components/ambassador/WhyDubaiSection";
import StorytellingSection from "@/components/ambassador/StorytellingSection";
import BenefitsSection from "@/components/ambassador/BenefitsSection";
import HowItWorksSection from "@/components/ambassador/HowItWorksSection";
import TestimonialsSection from "@/components/ambassador/TestimonialsSection";
import CTASection from "@/components/ambassador/CTASection";
import FooterSection from "@/components/ambassador/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <div id="dubai">
        <WhyDubaiSection />
      </div>
      <StorytellingSection />
      <div id="avantages">
        <BenefitsSection />
      </div>
      <div id="comment">
        <HowItWorksSection />
      </div>
      <TestimonialsSection />
      <div id="postuler">
        <CTASection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
