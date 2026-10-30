import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, TrendingUp, DollarSign, Clock, FileCheck2, Landmark } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";
import { signupHref } from "@/lib/signup";

const BuyPropertyDubaiPage = () => {
  const steps = [
    { icon: FileCheck2, title: "1. Choose Your Property", desc: "Compare off-plan and ready projects from the main UAE developers with a RERA-licensed advisor, by video or on site." },
    { icon: Landmark, title: "2. Reserve Your Unit", desc: "Secure your unit with a reservation deposit set by the developer. Most developers accept international bank transfers." },
    { icon: DollarSign, title: "3. Flexible Payment Plan", desc: "Pay in installments during construction, with construction-linked or post-handover plans depending on the project." },
    { icon: Building2, title: "4. DLD Registration & Title Deed", desc: "Register your property with the Dubai Land Department, which sets the registration fees, and receive your title deed (or Oqood for off-plan)." },
  ];

  const fees = [
    { name: "DLD registration fee", amount: "Set by the Dubai Land Department" },
    { name: "Registration trustee / admin fees", amount: "Set by the Dubai Land Department" },
    { name: "Oqood registration (off-plan)", amount: "Set by the Dubai Land Department" },
    { name: "Agency fee", amount: "Usually none on off-plan; agreed with the agency on resale" },
    { name: "Developer NOC (resale)", amount: "Set by the developer" },
    { name: "Mortgage registration", amount: "Set by the Dubai Land Department" },
  ];

  const eligibility = [
    "Any nationality can buy freehold property in designated areas",
    "No residency requirement — buy remotely from anywhere",
    "Property investment can open the way to a UAE Golden Visa (conditions set by the UAE authorities)",
    "No personal income tax in the UAE (check the rules of your own country of tax residence)",
    "Full foreign ownership allowed in freehold zones",
    "Every sale is registered with the Dubai Land Department",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        route="/buy-property-dubai"
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
              <Building2 className="w-3.5 h-3.5" /> Complete Guide · updated October 2026
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
            Yes. Foreign nationals can buy freehold property in designated areas of Dubai, under rules set by the Dubai Land Department.
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
            The main costs involved in buying property in Dubai. Official fees are set by the Dubai Land Department: check the current amounts in the <Link to="/blog/dubai-dld-fees-explained" className="text-primary hover:underline">DLD fees guide</Link> before you buy.
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
              Earn <strong>1% to 3% of the property price</strong> by referring buyers: the sale is handled by Cevitas Real Estate LLC, a RERA-licensed brokerage.
              Open to anyone, from any country. No license required. Free to join. Paid in AED.
            </p>
            <Link
              to={signupHref("en")}
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
              { to: "/real-estate-referral-program-dubai", label: "Real Estate Referral Program Dubai" },
              { to: "/dubai-real-estate-ambassadors", label: "Dubai Real Estate Ambassadors" },
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
