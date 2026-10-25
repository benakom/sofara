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
    { value: "Freehold", label: "Designated areas open to foreign buyers" },
    { value: "DLD", label: "Every sale registered with the Dubai Land Department" },
    { value: "Escrow", label: "Off-plan payments held in RERA-regulated accounts" },
    { value: "Golden Visa", label: "Property route to UAE long-term residence" },
  ];

  const areas = [
    { name: "Downtown Dubai", profile: "Central, high-rise living around the city's landmark district", buyer: "Buyers looking for an iconic address" },
    { name: "Dubai Marina", profile: "Waterfront towers, promenade and beach access", buyer: "Buyers who value a lively waterfront lifestyle" },
    { name: "Business Bay", profile: "Mixed business and residential district along the canal", buyer: "Professionals close to the business centre" },
    { name: "Palm Jumeirah", profile: "Island community with beachfront apartments and villas", buyer: "Buyers seeking a prestige beachfront home" },
    { name: "Dubai Hills Estate", profile: "Master-planned green community with villas and apartments", buyer: "Families looking for parks and schools" },
    { name: "Jumeirah Village Circle (JVC)", profile: "Residential community with a wide choice of apartments", buyer: "First-time buyers and rental investors" },
  ];

  const reasons = [
    { icon: Shield, title: "No Personal Income Tax", desc: "The UAE does not levy personal income tax. Check how rental income and gains are treated in your own country of tax residence." },
    { icon: Globe, title: "Golden Visa Through Real Estate", desc: "Property investment can open the way to a long-term UAE Golden Visa. Conditions are set by the UAE authorities and the Dubai Land Department." },
    { icon: TrendingUp, title: "A Regulated Off-Plan Market", desc: "Off-plan payments go to escrow accounts regulated by RERA, and every sale is registered with the Dubai Land Department." },
    { icon: Building2, title: "Long-Term Urban Planning", desc: "The Dubai 2040 Urban Master Plan sets out how new communities, transport and public spaces will develop." },
    { icon: Users, title: "Open to Foreign Buyers", desc: "Foreign nationals can own freehold property in designated areas, and can buy remotely with video viewings and electronic signatures." },
    { icon: DollarSign, title: "Developer Payment Plans", desc: "Many developers offer construction-linked and post-handover payment plans, which makes entry more accessible for international buyers." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        route="/invest-dubai-real-estate"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Invest in Dubai Real Estate 2026 — Complete Guide",
          description: "Guide to investing in Dubai real estate in 2026: how buying works, area profiles, payment plans and Golden Visa information.",
          author: { "@type": "Person", name: "Ahmed Benjas", url: "https://sofara.io/about" },
          publisher: { "@type": "Organization", name: "Sofara", url: "https://sofara.io" },
          datePublished: "2026-03-01",
          dateModified: "2026-10-25",
          mainEntityOfPage: "https://sofara.io/invest-dubai-real-estate",
        }}
      />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <TrendingUp className="w-3.5 h-3.5" /> Updated October 2026
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Invest in Dubai Real Estate
              <span className="block text-gradient-gold mt-2">A Practical Guide for International Buyers</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              How to invest in Dubai real estate as a foreign buyer: <strong>freehold areas</strong>, <strong>off-plan and ready property</strong>,
              <strong>payment plans</strong>, <strong>DLD registration</strong> and the <strong>Golden Visa</strong> route, explained with the official
              framework set by the Dubai Land Department and RERA.
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
            What international buyers look at when they consider Dubai property, based on the rules set by the UAE authorities.
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
            Popular Areas to Invest in Dubai — 2026 Overview
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            A short profile of communities international buyers often ask about. Prices and rents change: always check current Dubai Land Department data.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-border/50">
                  <th className="text-left p-4 font-semibold">Area</th>
                  <th className="text-left p-4 font-semibold">Profile</th>
                  <th className="text-left p-4 font-semibold">Often chosen by</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((a) => (
                  <tr key={a.name} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> {a.name}
                    </td>
                    <td className="p-4 text-muted-foreground">{a.profile}</td>
                    <td className="p-4 text-muted-foreground">{a.buyer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            General descriptions for information only, not investment advice.
          </p>
        </section>

        {/* How to invest via Sofara */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Earn From Dubai Real Estate — Without Buying Property
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              With Sofara, you don't need to buy property to earn from Dubai real estate. Anyone, from any country, can refer buyers:
              the sale is handled by Cevitas Real Estate LLC (RERA-licensed) and you earn <strong>1% to 3% of the property price</strong> on every completed sale.
              Learn how the <Link to="/real-estate-referral-program-dubai" className="text-primary hover:underline">real estate referral program in Dubai</Link>,
              the <Link to="/real-estate-affiliate-program-uae" className="text-primary hover:underline">UAE affiliate program</Link> and
              the <Link to="/dubai-real-estate-ambassadors" className="text-primary hover:underline">Dubai real estate ambassadors network</Link> work.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                { step: "01", title: "You Refer", desc: "Share your unique link with potential Dubai property buyers" },
                { step: "02", title: "We Handle the Sale", desc: "Cevitas Real Estate LLC, RERA-licensed, handles everything from qualification to SPA" },
                { step: "03", title: "You Earn", desc: "Receive 1% to 3% of the price in AED, tracked stage by stage in your dashboard" },
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
