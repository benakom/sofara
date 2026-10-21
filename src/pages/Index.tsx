import Navbar from "@/components/ambassador/Navbar";
import FAQSection from "@/components/ambassador/FAQSection";
import FooterSection from "@/components/ambassador/FooterSection";
import DeferredChatbot from "@/components/landing/DeferredChatbot";
import { HomeHero, TrustStrip, HowItWorks, Commissions, Projects, FinalCTA } from "@/components/home/HomeSections";
import SEO from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import { HOME_META, PAGE_PATHS, SITE_URL, type Locale } from "@/i18n/locales";

/** Homepage (2026-10-21 redesign): 7 sections, everything prerendered and visible without JavaScript. */
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
        <HomeHero locale={locale} />
        <TrustStrip locale={locale} />
        <HowItWorks locale={locale} />
        <Commissions locale={locale} />
        <Projects locale={locale} />
        <section id="faq" aria-label="FAQ">
          <FAQSection />
        </section>
        <FinalCTA locale={locale} />
      </main>
      <FooterSection />
      <DeferredChatbot />
    </div>
  );
};

export default Index;
