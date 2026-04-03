import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Globe, Building2, Users, DollarSign, CheckCircle2, MapPin, Star } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";

const FAQSection = lazy(() => import("@/components/ambassador/FAQSection"));

const InvestDubaiPage = () => {
  const stats = [
    { value: "210,000+", label: "Property transactions in 2026" },
    { value: "AED 620B", label: "Total market value" },
    { value: "6-9%", label: "Average rental yield" },
    { value: "0%", label: "Income tax" },
  ];

  const areas = [
    { name: "Downtown Dubai", yield: "6.5%", growth: "+18%", price: "AED 2.8M avg" },
    { name: "Dubai Marina", yield: "7.2%", growth: "+16%", price: "AED 2.1M avg" },
    { name: "Business Bay", yield: "7.8%", growth: "+19%", price: "AED 1.5M avg" },
    { name: "Palm Jumeirah", yield: "5.5%", growth: "+20%", price: "AED 5.2M avg" },
    { name: "Dubai Hills Estate", yield: "6.8%", growth: "+22%", price: "AED 2.4M avg" },
    { name: "JVC", yield: "8.5%", growth: "+25%", price: "AED 850K avg" },
  ];

  const reasons = [
    { icon: Shield, title: "0% Tax on Property Income", desc: "No income tax, no capital gains tax, no inheritance tax. Keep 100% of your rental income and profits." },
    { icon: Globe, title: "Golden Visa Through Real Estate", desc: "Invest AED 750,000+ in property and qualify for a 10-year UAE Golden Visa for you and your family." },
    { icon: TrendingUp, title: "20-40% Capital Appreciation", desc: "Off-plan properties in prime areas have appreciated 20-40% during construction over the past 3 years." },
    { icon: Building2, title: "World-Class Infrastructure", desc: "Dubai Metro expansion, Al Maktoum Airport, Dubai 2040 Master Plan — infrastructure driving sustained growth." },
    { icon: Users, title: "Population Growth → Demand", desc: "Dubai's population surpassed 3.8M, projected to reach 5.8M by 2040, driving continuous housing demand." },
    { icon: DollarSign, title: "Developer Payment Plans", desc: "Top developers offer 60/40, 70/30, and post-handover payment plans — making entry accessible globally." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Invest in Dubai Real Estate 2026 — Complete Guide | ROI, Areas, Golden Visa | Sofara"
        description="Complete guide to investing in Dubai real estate in 2026. Compare rental yields by area, understand Golden Visa requirements, payment plans, and zero-tax benefits. Expert analysis by Sofara."
        canonical="https://www.sofara.io/invest-dubai-real-estate"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Invest in Dubai Real Estate 2026 — Complete Guide",
          description: "Complete guide to investing in Dubai real estate in 2026 with ROI analysis, area comparisons, and Golden Visa information.",
          author: { "@type": "Organization", name: "Sofara", url: "https://www.sofara.io" },
          publisher: { "@type": "Organization", name: "Sofara", url: "https://www.sofara.io" },
          datePublished: "2026-03-01",
          dateModified: "2026-04-01",
          mainEntityOfPage: "https://www.sofara.io/invest-dubai-real-estate",
        }}
      />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <TrendingUp className="w-3.5 h-3.5" /> Updated for 2026
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Invest in Dubai Real Estate
              <span className="block text-gradient-gold mt-2">The World's #1 Property Market</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              Dubai recorded <strong>210,000+ property transactions</strong> worth <strong>AED 620 billion</strong> in 2026.
              With <strong>0% income tax</strong>, <strong>6-9% rental yields</strong>, and a <strong>Golden Visa program</strong>,
              Dubai is the world's most attractive real estate investment destination.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Start Earning Commissions <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#areas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium border border-border hover:border-primary/30 transition-colors"
              >
                Compare Areas <MapPin className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl border border-border/50 bg-secondary/20">
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{s.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Invest */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            Why Invest in Dubai Real Estate in 2026?
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Dubai offers unmatched advantages for property investors worldwide. Here's why smart money is flowing into the UAE.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div key={r.title} className="p-6 rounded-2xl border border-border/50 bg-secondary/10 hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Areas Comparison */}
        <section id="areas" className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            Best Areas to Invest in Dubai — 2026 Comparison
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Compare rental yields, price growth, and average prices across Dubai's top investment areas.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-border/50">
                  <th className="text-left p-4 font-semibold">Area</th>
                  <th className="text-center p-4 font-semibold">Rental Yield</th>
                  <th className="text-center p-4 font-semibold">YoY Growth</th>
                  <th className="text-center p-4 font-semibold">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((a) => (
                  <tr key={a.name} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> {a.name}
                    </td>
                    <td className="p-4 text-center text-primary font-semibold">{a.yield}</td>
                    <td className="p-4 text-center text-green-400 font-semibold">{a.growth}</td>
                    <td className="p-4 text-center text-muted-foreground">{a.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Source: DLD Transaction Data & CBRE Market Reports, Q1 2026
          </p>
        </section>

        {/* How to invest via Sofara */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Earn From Dubai Real Estate — Without Buying Property
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              With Sofara, you don't need to invest money to profit from Dubai's real estate boom.
              Simply refer buyers to our licensed team and earn <strong>3% commission</strong> on every successful sale.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                { step: "01", title: "You Refer", desc: "Share your unique link with potential Dubai property buyers" },
                { step: "02", title: "We Close", desc: "Our RERA-licensed team handles everything from qualification to closing" },
                { step: "03", title: "You Earn", desc: "Receive 3% commission automatically — tracked in real-time" },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <span className="text-3xl font-bold text-primary">{s.step}</span>
                  <h3 className="font-semibold mt-2 mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Become an Ambassador — It's Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related blog articles for internal linking */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">
            Expert Guides on Dubai Real Estate
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { slug: "dubai-real-estate-market-2026-overview", title: "Dubai Real Estate Market 2026: Complete Guide", tag: "Market Analysis" },
              { slug: "top-dubai-areas-investment-2026", title: "Top Dubai Areas for Investment in 2026", tag: "Investment" },
              { slug: "dubai-golden-visa-real-estate", title: "Dubai Golden Visa Through Real Estate", tag: "Golden Visa" },
              { slug: "dubai-off-plan-vs-ready-properties", title: "Off-Plan vs Ready Properties in Dubai", tag: "Guide" },
              { slug: "dubai-rental-yields-explained", title: "Dubai Rental Yields Explained", tag: "ROI" },
              { slug: "dubai-payment-plans-explained", title: "Dubai Developer Payment Plans Guide", tag: "Finance" },
            ].map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`} className="group p-5 rounded-xl border border-border/50 bg-secondary/10 hover:border-primary/20 transition-colors">
                <span className="text-xs text-primary font-medium">{a.tag}</span>
                <h3 className="font-display text-sm font-semibold mt-1 group-hover:text-primary transition-colors">{a.title}</h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      </main>
      <FooterSection />
    </div>
  );
};

export default InvestDubaiPage;
