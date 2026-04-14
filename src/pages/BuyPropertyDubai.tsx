import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, TrendingUp, DollarSign, Clock, FileCheck2, Landmark } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";

const BuyPropertyDubaiPage = () => {
  const steps = [
    { icon: FileCheck2, title: "1. Choose Your Property", desc: "Select from 100+ off-plan and ready projects by Emaar, Damac, Sobha, and other top developers." },
    { icon: Landmark, title: "2. Reserve with 5-20% Down", desc: "Secure your unit with a reservation deposit. Most developers accept international bank transfers." },
    { icon: DollarSign, title: "3. Flexible Payment Plan", desc: "Pay in installments during construction (60/40, 70/30, or post-handover plans available)." },
    { icon: Building2, title: "4. DLD Registration & Title Deed", desc: "Register your property with the Dubai Land Department. Pay 4% DLD transfer fee + AED 580 admin fee." },
  ];

  const fees = [
    { name: "DLD Transfer Fee", amount: "4% of purchase price" },
    { name: "Admin Fee", amount: "AED 580" },
    { name: "Agency Fee", amount: "2% (covered by Sofara)" },
    { name: "Oqood Fee (Off-Plan)", amount: "4% of purchase price" },
    { name: "NOC Fee", amount: "AED 500 – 5,000" },
    { name: "Mortgage Registration", amount: "0.25% of loan + AED 290" },
  ];

  const eligibility = [
    "Any nationality can buy freehold property in designated areas",
    "No residency requirement — buy remotely from anywhere",
    "Golden Visa eligibility from AED 750,000 investment",
    "No income tax, capital gains tax, or inheritance tax",
    "100% foreign ownership allowed in freehold zones",
    "Rental income is 100% tax-free",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Buy Property in Dubai 2026 — Step-by-Step Guide for Foreign Investors | Sofara"
        description="Complete step-by-step guide to buying property in Dubai as a foreigner in 2026. DLD fees, payment plans, Golden Visa, and freehold zones explained. Expert guidance by Sofara."
        canonical="https://sofara.io/buy-property-dubai"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Buy Property in Dubai",
          description: "Step-by-step guide for foreign investors buying property in Dubai in 2026.",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.desc,
          })),
        }}
      />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Building2 className="w-3.5 h-3.5" /> Complete Guide 2026
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Buy Property in Dubai
              <span className="block text-gradient-gold mt-2">A Foreign Investor's Guide</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              Everything you need to know about buying property in Dubai as a foreigner:
              freehold zones, DLD fees, payment plans, Golden Visa eligibility, and step-by-step process.
            </p>
          </motion.div>
        </section>

        {/* Steps */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-12">
            How to Buy Property in Dubai — 4 Simple Steps
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl border border-border/50 bg-secondary/10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            Can Foreigners Buy Property in Dubai?
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Yes! Dubai has one of the most foreign-investor-friendly real estate frameworks in the world.
          </p>
          <div className="max-w-2xl mx-auto space-y-3">
            {eligibility.map((e) => (
              <div key={e} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-border/30">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{e}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fees */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            Dubai Property Purchase Fees & Costs
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Full transparency on all costs involved in buying property in Dubai.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border/50 max-w-2xl mx-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-border/50">
                  <th className="text-left p-4 font-semibold">Fee</th>
                  <th className="text-right p-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.name} className="border-b border-border/30">
                    <td className="p-4">{f.name}</td>
                    <td className="p-4 text-right text-primary font-medium">{f.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Know Someone Interested in Dubai Property?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Earn <strong>3% commission</strong> by referring property buyers to our RERA-licensed team.
              No license required. Free to join. AI-powered platform.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Become a Sofara Ambassador <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/invest-dubai-real-estate", label: "Dubai Investment Guide" },
              { to: "/blog/dubai-golden-visa-real-estate", label: "Golden Visa Guide" },
              { to: "/blog/dubai-dld-fees-explained", label: "DLD Fees Explained" },
              { to: "/blog/foreigners-buying-dubai-property", label: "Foreign Buyers Guide" },
              { to: "/blog/dubai-payment-plans-explained", label: "Payment Plans" },
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

export default BuyPropertyDubaiPage;
