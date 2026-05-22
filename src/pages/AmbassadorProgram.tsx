import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Zap, Globe2, TrendingUp } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";

const steps = [
  { n: "01", title: "Apply for free", desc: "No license needed, no fees, no quotas. 2-minute application." },
  { n: "02", title: "Get your toolkit", desc: "Unique referral link + AI tools (WhatsApp, CRM, lead scoring, sales scripts)." },
  { n: "03", title: "Refer & get paid", desc: "Cevitas closes the deal under RERA license. You're paid within 7 days." },
];

const commissionTable = [
  { dev: "Emaar Properties", rate: "3%", range: "AED 60K – 150K" },
  { dev: "DAMAC Properties", rate: "2.5%", range: "AED 45K – 120K" },
  { dev: "Sobha Realty", rate: "3%", range: "AED 60K – 130K" },
  { dev: "Nakheel / Aldar / Binghatti", rate: "2.5–3%", range: "AED 40K – 140K" },
];

const profiles = [
  "Expats with strong diaspora networks",
  "Real estate professionals operating abroad",
  "Finance & wealth-management advisors",
  "Content creators with property-interested audiences",
  "Diaspora business owners & community leaders",
];

const comparison = [
  { feature: "Payment speed", sofara: "7 days", typical: "30–60 days" },
  { feature: "Commission rate", sofara: "Up to 3%", typical: "0.5–1.5%" },
  { feature: "AI tools included", sofara: "Yes (WhatsApp, CRM, scoring)", typical: "No" },
  { feature: "Legal structure", sofara: "Cevitas RERA-licensed", typical: "Varies / unclear" },
  { feature: "Dedicated support", sofara: "1-on-1 success manager", typical: "Shared inbox" },
];

const faqs = [
  { q: "How much can I earn?", a: "Up to 3% commission per closed transaction — typically AED 37K to AED 120K per deal. Top ambassadors exceed AED 90,000 per month." },
  { q: "Do I need a real estate license?", a: "No. You're a business introducer. All transactions close under Cevitas Real Estate LLC (RERA-licensed in Dubai)." },
  { q: "How fast am I paid?", a: "Within 7 days of transaction closing — via international bank transfer." },
  { q: "Is it really free?", a: "100% free. No signup fees, no subscription. Sofara only earns from closed deals." },
  { q: "Are my leads protected?", a: "Yes. Each lead is securely tied to your referral link for 12 months." },
  { q: "Is this legal in my country?", a: "Yes — you act as a business introducer, not as a real estate agent in your jurisdiction." },
];

const AmbassadorProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO route="/ambassador-program" />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Shield className="w-3.5 h-3.5" /> RERA-Licensed · Trusted by 500+ Ambassadors
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              The Dubai Real Estate Ambassador Program
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              Refer Dubai property buyers. Earn up to <strong>3% commission</strong>. No license required.
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
          </motion.div>
        </section>

        {/* What is it */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-6">
            What is the Sofara Ambassador Program?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-center">
            Sofara is the Dubai real estate ambassador program built by RERA-licensed brokers at <strong>Cevitas Real Estate LLC</strong>. Any qualified person worldwide can refer buyers to Dubai off-plan property from Emaar, DAMAC, Sobha, Nakheel, Aldar and other top UAE developers — and earn up to <strong>3% commission per closed transaction</strong> without holding a real estate license themselves.
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
            Indicative ranges per closed transaction. Top ambassadors exceed AED 1M annually.
          </p>
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-left p-4 font-semibold">Developer</th>
                  <th className="text-left p-4 font-semibold">Commission</th>
                  <th className="text-left p-4 font-semibold">Typical earning</th>
                </tr>
              </thead>
              <tbody>
                {commissionTable.map((r) => (
                  <tr key={r.dev} className="border-t border-border/30">
                    <td className="p-4">{r.dev}</td>
                    <td className="p-4 text-primary font-semibold">{r.rate}</td>
                    <td className="p-4">{r.range}</td>
                  </tr>
                ))}
                <tr className="border-t border-border/30 bg-primary/5">
                  <td className="p-4 font-semibold">Average year-1 ambassador</td>
                  <td className="p-4">4–6 deals</td>
                  <td className="p-4 font-semibold">AED 250K – 700K</td>
                </tr>
                <tr className="border-t border-border/30 bg-primary/10">
                  <td className="p-4 font-semibold">Top 10% ambassadors</td>
                  <td className="p-4">20+ deals / yr</td>
                  <td className="p-4 font-semibold">AED 1M – 3M+</td>
                </tr>
              </tbody>
            </table>
          </div>
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
            Yes. As a Sofara ambassador you act as a <strong>business introducer</strong> — not a real estate agent. All transactions close under <strong>Cevitas Real Estate LLC</strong> (RERA-licensed in Dubai), removing the need for a local real estate license in your country.
          </p>
        </section>

        {/* Comparison */}
        <section className="px-5 sm:px-6 max-w-5xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-10">
            Why Sofara Beats Other Dubai Property Referral Programs
          </h2>
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-left p-4 font-semibold text-primary">Sofara</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Typical brokerage referral</th>
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
        </section>

        {/* Benefits icons */}
        <section className="px-5 sm:px-6 max-w-6xl mx-auto py-12">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, t: "Paid in 7 days", d: "Fastest payout in Dubai real estate" },
              { icon: Globe2, t: "Work from anywhere", d: "Remote-first, global ambassador network" },
              { icon: TrendingUp, t: "AI-powered tools", d: "Lead scoring, WhatsApp automation, scripts" },
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
