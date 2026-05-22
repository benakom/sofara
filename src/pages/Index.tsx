import { lazy, Suspense } from "react";
import Navbar from "@/components/ambassador/Navbar";
import HeroSection from "@/components/ambassador/HeroSection";
import LandingChatbot from "@/components/landing/LandingChatbot";
import SEO from "@/components/SEO";

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
      <SEO
        title="Dubai Real Estate Ambassadors | Earn Up to 3% on Dubai Off-Plan — Sofara"
        description="Sofara is the #1 network of Dubai real estate ambassadors. Refer buyers for Dubai off-plan properties from Emaar, Damac, Sobha & top UAE developers and earn up to 3% commission. No license needed. Free to join. AI-powered platform."
        canonical="https://sofara.io/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sofara",
            url: "https://sofara.io",
            logo: "https://sofara.io/favicon-512x512.png",
            description: "The #1 network of Dubai real estate ambassadors. Earn up to 3% commission on Dubai off-plan properties from Emaar, Damac, Sobha and other top UAE developers.",
            parentOrganization: {
              "@type": "Organization",
              name: "Cevitas Real Estate LLC",
              address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
            },
            areaServed: { "@type": "City", name: "Dubai", containedIn: { "@type": "Country", name: "United Arab Emirates" } },
            knowsAbout: ["Dubai Real Estate", "Dubai Real Estate Ambassadors", "Dubai Off-Plan", "Dubai Off-Plan Properties", "UAE Property Investment", "Emaar Properties", "Damac Properties", "Sobha Realty"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Sofara",
            url: "https://sofara.io",
            description: "Dubai real estate ambassadors network — earn up to 3% commission on Dubai off-plan property sales",
            inLanguage: ["en", "fr", "es", "ru"],
            potentialAction: {
              "@type": "SearchAction",
              target: "https://sofara.io/blog?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
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
