import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Zap, Globe2, TrendingUp } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";

const steps = [
  { n: "01", title: "Apply for free", desc: "No license needed, no fees, no quotas. 2-minute application." },
  { n: "02", title: "Get your toolkit", desc: "Unique referral link + tools (WhatsApp templates, CRM, project brochures, sales scripts)." },
  { n: "03", title: "Refer & get paid", desc: "Cevitas Real Estate LLC handles the sale under its RERA license. You're paid within 7 days once the client signs the SPA." },
];

const commissionFacts = [
  { label: "Commission rate", value: "1% to 3% of the property price, shown per project before you refer" },
  { label: "Who pays", value: "Sofara, out of the brokerage commission. The buyer pays nothing extra" },
  { label: "When it is earned", value: "SPA signed and down payment paid with the DLD fees" },
  { label: "When it is paid", value: "In AED by bank transfer, within 7 days once the client signs the SPA" },
  { label: "Lead protection", value: "12 months, even if the buyer contacts Sofara or Cevitas directly" },
];

const profiles = [
  "UAE residents whose colleagues, friends and clients ask about Dubai property",
  "Non-residents and expats with strong diaspora networks",
  "Non-agents: finance & wealth-management advisors, relocation consultants, entrepreneurs",
  "Content creators with property-interested audiences",
  "Real estate professionals operating abroad",
  "Diaspora business owners & community leaders",
];

const comparison = [
  { feature: "Real estate license", sofara: "Not required", typical: "RERA broker card" },
  { feature: "UAE residence visa", sofara: "Not required", typical: "Required" },
  { feature: "Your role", sofara: "Introduce the buyer", typical: "Advise, show, negotiate, sign" },
  { feature: "Earnings", sofara: "1% to 3% of the property price", typical: "Share of the agency commission" },
  { feature: "Who handles the sale", sofara: "Cevitas Real Estate LLC (RERA-licensed)", typical: "You, under your brokerage" },
];

const faqs = [
  { q: "What is the ambassador program in Dubai?", a: "It is a real estate referral program: you introduce property buyers, Cevitas Real Estate LLC (RERA-licensed) handles the sale, and you earn 1% to 3% of the property price on each completed purchase. It is free and open to anyone." },
  { q: "Who can become an ambassador?", a: "Anyone, from any country: UAE residents, non-residents, people who are not agents and licensed agents abroad. No license, visa or fee. A short identity check is completed before your first payout." },
  { q: "How much can I earn?", a: "1% to 3% of the property price on each completed sale you introduced, depending on the project. The rate is shown in your dashboard before you refer." },
  { q: "Do I need a real estate license?", a: "No. You only introduce buyers. Every regulated step is carried out by Cevitas Real Estate LLC under its RERA license in Dubai." },
  { q: "When and how am I paid?", a: "The commission is earned when the buyer signs the SPA and pays the down payment with the DLD fees, then paid in AED by bank transfer within 7 days once the client signs the SPA, against an invoice generated from your dashboard." },
  { q: "Is there an ambassador agreement?", a: "Yes. The ambassador terms are accepted when you create your account: they set the rate, when the commission is earned, how it is invoiced and how long your leads are protected." },
  { q: "Are my leads protected?", a: "Yes. Each lead is tied to your account for 12 months, including when the buyer contacts Sofara or Cevitas directly." },
  { q: "Is this legal in my country?", a: "In Dubai, the regulated activity is carried out by the RERA-licensed brokerage, and you act only as an introducer. In your country, declare your commissions under your local tax rules and check any local rules on introducer income." },
  { q: "Is it really free?", a: "Yes. No signup fee, no subscription, no quota. You earn only when a sale you introduced is completed." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const AmbassadorProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO route="/ambassador-program" jsonLd={faqJsonLd} />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12 sm:py-20 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out motion-reduce:animate-none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Shield className="w-3.5 h-3.5" /> RERA-licensed brokerage · 700+ active ambassadors · updated October 2026
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Real Estate Ambassador Program Dubai
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              The Sofara ambassador program in Dubai pays you for introducing property buyers: you refer, a RERA-licensed brokerage handles the sale, and you earn <strong>1% to 3% of the property price</strong>. Open to anyone, UAE resident or not, agent or not, from any country. No license, no fee.
            </p>
            <Link
              to="/auth?mode=signup&source=ambassador-program"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Apply to become an ambassador <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              Built by Cevitas Real Estate LLC · RERA-Licensed · Free to join
            </p>
          </div>
        </section>

        {/* What is it */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-6">
            What is the Sofara Ambassador Program?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-center">
            Sofara is the Dubai real estate ambassador program behind the <Link to="/dubai-real-estate-ambassadors" className="text-primary hover:underline">Dubai real estate ambassadors network</Link>. Anyone worldwide can refer buyers of Dubai and UAE property and earn <strong>1% to 3% of the property price per completed sale</strong>, without holding a real estate license. The sale is handled by <strong>Cevitas Real Estate LLC</strong>, a RERA-licensed brokerage, and more than 700 active ambassadors use the program today.
          </p>
        </section>

        {/* How it works */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-12">
            How the Sofara Ambassador Program Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="p-6 rounded-2xl border border-border/50 bg-secondary/10">
                <div className="text-primary font-mono text-sm mb-3">{s.n}</div>
                <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Earnings */}
        <section className="px-5 sm:px-6 max-w-5xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-4">
            How Much Can You Earn as a Dubai Real Estate Ambassador?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Your commission is a percentage of the property price, 1% to 3% depending on the project. Here is how it is calculated, earned and paid.
          </p>
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-left p-4 font-semibold">Question</th>
                  <th className="text-left p-4 font-semibold">How it works</th>
                </tr>
              </thead>
              <tbody>
                {commissionFacts.map((r) => (
                  <tr key={r.label} className="border-t border-border/30">
                    <td className="p-4 font-medium">{r.label}</td>
                    <td className="p-4">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Read the <Link to="/blog/sofara-commission-structure-explained" className="text-primary hover:underline">commission structure</Link> and our guide to the <Link to="/real-estate-referral-fee-dubai" className="text-primary hover:underline">real estate referral fee in Dubai</Link>.
          </p>
        </section>

        {/* Submit a lead */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-6">
            How to Submit a Lead and Keep It Protected
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed text-center">
            With the buyer's consent, register them in your dashboard, adding their budget and goal if you know them, or share your personal referral link so they sign up themselves. The lead is attributed to you immediately and protected for <strong>12 months</strong>, including when the buyer later contacts Sofara or Cevitas directly. The ambassador terms, accepted when you join, set the rate, the moment the commission is earned, invoicing and lead protection.
          </p>
        </section>

        {/* Who qualifies */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-10">
            Who Qualifies as a Sofara Ambassador?
          </h2>
          <ul className="space-y-3 max-w-2xl mx-auto">
            {profiles.map((p) => (
              <li key={p} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-border/30">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Legality */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-6">
            Is the Dubai Real Estate Ambassador Program Legal in My Country?
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed text-center">
            In Dubai, brokerage work is regulated by <strong>RERA</strong>, the Real Estate Regulatory Agency of the Dubai Land Department. As a Sofara ambassador you act as a <strong>business introducer</strong>, not a real estate agent: every regulated step is carried out by <strong>Cevitas Real Estate LLC</strong> under its RERA license. In your own country, declare your commissions under your local tax rules and check any local rules on introducer income.
          </p>
        </section>

        {/* Comparison */}
        <section className="px-5 sm:px-6 max-w-5xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-10">
            Ambassador or Licensed Agent: What Is the Difference?
          </h2>
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-left p-4 font-semibold text-primary">Sofara ambassador</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Licensed agent</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-t border-border/30">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-primary">{row.sofara}</td>
                    <td className="p-4 text-muted-foreground">{row.typical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Compare the models: <Link to="/real-estate-referral-program-dubai" className="text-primary hover:underline">real estate referral program in Dubai</Link>, <Link to="/real-estate-affiliate-program-uae" className="text-primary hover:underline">real estate affiliate program in the UAE</Link> and <Link to="/become-real-estate-agent-dubai" className="text-primary hover:underline">how to become a real estate agent in Dubai</Link>.
          </p>
        </section>

        {/* Benefits icons */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, t: "Paid in AED", d: "Within 7 days once the client signs the SPA" },
              { icon: Globe2, t: "Work from anywhere", d: "Remote-first, global ambassador network" },
              { icon: TrendingUp, t: "Ready-to-use tools", d: "Project brochures, WhatsApp templates, scripts" },
            ].map((b) => (
              <div key={b.t} className="p-6 rounded-2xl border border-border/50 bg-secondary/10 text-center">
                <b.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{b.t}</h3>
                <p className="text-xs text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 sm:px-6 max-w-3xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border/50 bg-secondary/10 p-5">
                <summary className="cursor-pointer font-semibold flex items-center justify-between">
                  {f.q}
                  <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Apply to the Sofara Ambassador Program
            </h2>
            <p className="text-muted-foreground mb-8">
              Free to join. 2 minutes. No license needed.
            </p>
            <Link
              to="/auth?mode=signup&source=ambassador-program"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Apply now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default AmbassadorProgram;
