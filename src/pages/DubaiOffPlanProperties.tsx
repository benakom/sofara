import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, BarChart3, MapPin, Building, Home, Landmark, Star, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";

const DubaiOffPlanPage = () => {
  const advantages = [
    { icon: TrendingUp, title: "20-40% Capital Appreciation", desc: "Off-plan properties typically appreciate 20-40% between launch and handover, offering significant returns before you even receive the keys." },
    { icon: BarChart3, title: "Lower Entry Price", desc: "Off-plan prices are 10-30% lower than equivalent ready properties, with developers competing for early buyers with attractive launch prices." },
    { icon: Landmark, title: "Flexible Payment Plans", desc: "Most developers offer 60/40, 70/30, and even post-handover plans — spreading payments over 3-7 years without mortgage interest." },
    { icon: Star, title: "First Pick of Best Units", desc: "Early buyers get access to the best floor plans, views, and prices. Premium units on higher floors sell out within days of launch." },
  ];

  const developers = [
    { name: "Emaar Properties", projects: "Creek Harbour, Downtown, Dubai Hills", known: "Burj Khalifa, Dubai Mall developer" },
    { name: "Damac Properties", projects: "Damac Hills 2, Cavalli Tower, Lagoons", known: "Luxury living, branded residences" },
    { name: "Sobha Realty", projects: "Sobha Hartland, One, Reserve", known: "Quality craftsmanship, MBR City" },
    { name: "Nakheel", projects: "Palm Jebel Ali, Como Residences", known: "Palm Jumeirah developer" },
    { name: "Meraas", projects: "Bluewaters, La Mer, Port de La Mer", known: "Waterfront lifestyle destinations" },
    { name: "Dubai Properties", projects: "JBR, Business Bay projects", known: "Urban community developer" },
  ];

  const risks = [
    "Always buy from RERA-registered developers",
    "Check developer track record and delivery history",
    "Understand the escrow account protections (Law No. 8 of 2007)",
    "Review the Sales & Purchase Agreement (SPA) carefully",
    "Consider the location's infrastructure timeline",
    "Factor in DLD fees (4%) and service charges",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        route="/dubai-off-plan-properties"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Dubai Off-Plan Properties 2026 — Complete Guide for Investors & Ambassadors",
          description: "Comprehensive guide to Dubai off-plan real estate investment for 2026, with developer comparisons, payment plans, capital appreciation and ambassador opportunities.",
          author: { "@type": "Person", name: "Ahmed Benjas", url: "https://sofara.io/about" },
          publisher: { "@type": "Organization", name: "Sofara", url: "https://sofara.io" },
          datePublished: "2026-03-01",
          dateModified: "2026-05-22",
          mainEntityOfPage: "https://sofara.io/dubai-off-plan-properties",
        }}
      />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Building className="w-3.5 h-3.5" /> Off-Plan Guide 2026
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Dubai Off-Plan Properties
              <span className="block text-gradient-gold mt-2">Buy Smart. Earn More.</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              Off-plan properties account for <strong>65% of all Dubai transactions</strong> in 2026.
              With <strong>20-40% capital appreciation</strong> during construction and <strong>flexible payment plans</strong>,
              it's the smartest way to enter Dubai's property market.
            </p>
          </motion.div>
        </section>

        {/* Advantages */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-12">
            Why Buy Off-Plan in Dubai?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {advantages.map((a) => (
              <div key={a.title} className="p-6 rounded-2xl border border-border/50 bg-secondary/10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Developers */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            Top Dubai Off-Plan Developers
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Sofara partners with all major RERA-registered developers in Dubai.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {developers.map((d) => (
              <div key={d.name} className="p-5 rounded-xl border border-border/50 bg-secondary/10">
                <h3 className="font-semibold mb-1">{d.name}</h3>
                <p className="text-xs text-primary mb-2">{d.known}</p>
                <p className="text-xs text-muted-foreground">Projects: {d.projects}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Mitigation */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            Off-Plan Buying Checklist
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Protect your investment with these essential checks before buying off-plan in Dubai.
          </p>
          <div className="max-w-2xl mx-auto space-y-3">
            {risks.map((r) => (
              <div key={r} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-border/30">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Earn Up to 3% Commission on Every Off-Plan Sale
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Refer buyers interested in Dubai off-plan properties. Our team handles qualification, viewings, and closing.
              You earn <strong>up to 3% commission</strong> — automatically.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Join Sofara — Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/invest-dubai-real-estate", label: "Dubai Investment Guide" },
              { to: "/buy-property-dubai", label: "How to Buy Property" },
              { to: "/blog/emaar-properties-guide", label: "Emaar Guide" },
              { to: "/blog/damac-properties-guide", label: "Damac Guide" },
              { to: "/blog/sobha-realty-quality-investment", label: "Sobha Guide" },
              { to: "/blog/dubai-off-plan-vs-ready-properties", label: "Off-Plan vs Ready" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="px-4 py-2 rounded-full bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors">
                {l.label} →
              </Link>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default DubaiOffPlanPage;
