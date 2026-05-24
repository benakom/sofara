import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Linkedin,
  GraduationCap,
  Building2,
  Award,
  Globe2,
  ShieldCheck,
  Users,
  Sparkles,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO route="/about" />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-12 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6"
          >
            <Sparkles className="w-3 h-3" /> About Sofara — Dubai Real Estate Ambassadors Network
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            About Sofara — the Operator-Built Dubai Real Estate Ambassadors Network
          </motion.h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            <strong>Sofara</strong> is a <strong>Dubai Real Estate Ambassadors Network</strong> built and operated by working brokers. Sofara is a brand of <strong>Cevitas Real Estate LLC</strong>, a brokerage based in Dubai. We extend a proven brokerage workflow to a global community of ambassadors who introduce buyers to Dubai and UAE off-plan property.
          </p>
        </section>

        {/* What is Sofara */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-6">
            What is Sofara?
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>Sofara</strong> (also known as <strong>Sofara Dubai</strong> or <strong>Sofara Real Estate</strong>) is a referral platform that connects international introducers — expats, diaspora investors, content creators, financial advisors — with Dubai and UAE property opportunities from leading developers including Emaar, DAMAC, Sobha, Aldar, Binghatti and Nakheel.
            </p>
            <p>
              Ambassadors share qualified buyer interest through Sofara. Cevitas Real Estate LLC, the licensed brokerage operating Sofara, handles the regulated activity — buyer advisory, developer coordination, contracts and closing — under its UAE real estate brokerage license. Ambassadors are introducers, not real estate agents. This separation is what allows the network to operate worldwide in a compliant way.
            </p>
            <p>
              Sofara is positioned as a <strong>Dubai Real Estate Ambassadors Network</strong>, an <strong>Abu Dhabi Real Estate Ambassadors Network</strong>, and a <strong>UAE Real Estate Ambassadors Network</strong> — one platform, three markets, one licensed back office.
            </p>
          </div>
        </section>

        {/* Founder */}
        <section className="px-5 sm:px-6 max-w-5xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-12">
            Founded by Ahmed Benjas
          </h2>
          <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
            <div className="rounded-2xl overflow-hidden aspect-square border border-border/50 bg-secondary/20">
              <img
                src="/team/ahmed-benjas.jpg"
                alt="Ahmed Benjas, Founder and CEO of Sofara and Cevitas Real Estate LLC"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ahmed Benjas is the Founder and CEO of <strong>Cevitas Real Estate LLC</strong> and of <strong>Sofara</strong>. His background spans 20+ years in finance, an MBA, and Executive Education at <strong>Stanford Graduate School of Business</strong>. Recognized as a LinkedIn Top Voice, Ahmed has facilitated <strong>AED 100M+ in Dubai property transactions</strong> and built a community of 95,000+ followers around Dubai real estate, off-plan investing and diaspora wealth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                He started Sofara to address a clear gap: thousands of expats and diaspora professionals have the relationships and credibility to introduce buyers to Dubai property, but no compliant framework to monetize those introductions. Sofara provides that framework — an ambassador network operated under a licensed UAE brokerage.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="https://www.linkedin.com/in/ahmedbenjas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a
                  href="https://www.cevitas.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" /> Cevitas Real Estate
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="px-5 sm:px-6 max-w-5xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">
            Credentials & Track Record
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Building2, t: "Licensed Brokerage", d: "Cevitas Real Estate LLC, Dubai (UAE)" },
              { icon: GraduationCap, t: "Stanford GSB", d: "Executive Education" },
              { icon: Award, t: "LinkedIn Top Voice", d: "Real Estate & Investing" },
              { icon: Building2, t: "AED 100M+", d: "Dubai transactions facilitated" },
            ].map((c) => (
              <div key={c.t} className="p-5 rounded-2xl border border-border/50 bg-secondary/10 text-center">
                <c.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">{c.t}</h3>
                <p className="text-xs text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why we built Sofara */}
        <section className="px-5 sm:px-6 max-w-3xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-6">
            Why We Built Sofara
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Dubai real estate is one of the world's most cross-border property markets, with buyers from 180+ nationalities each year. Yet referral economics in the industry are often opaque — slow payouts, unclear attribution, no operating tools. Sofara was built to solve that with operator-grade infrastructure: a licensed back office through Cevitas Real Estate LLC, transparent commission tracking, AI tools for ambassadors, and structured payouts after closing. Every feature ships from the perspective of brokers who actually close Dubai off-plan deals.
          </p>
        </section>

        {/* What makes Sofara different */}
        <section className="px-5 sm:px-6 max-w-5xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">
            What Makes the Sofara Network Different
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: ShieldCheck,
                t: "Operated under a licensed UAE brokerage",
                d: "All regulated activity is performed by Cevitas Real Estate LLC. Ambassadors stay on the introducer side — no UAE real estate license required from them.",
              },
              {
                icon: Globe2,
                t: "Global by design",
                d: "Active introducers across Europe, Africa, North America, the Gulf and Asia. One platform for the Dubai, Abu Dhabi and broader UAE real estate ambassador network.",
              },
              {
                icon: Users,
                t: "Operator-built, not marketer-built",
                d: "The product roadmap is set by people who close transactions. CRM, AI, calendar, library and commission tooling reflect real broker workflows.",
              },
              {
                icon: Sparkles,
                t: "Transparent commission tracking",
                d: "Every lead is tied to your ambassador link, every stage is visible in your dashboard, and payouts are released after the developer confirms the transaction.",
              },
            ].map((f) => (
              <div key={f.t} className="p-6 rounded-2xl border border-border/50 bg-secondary/10">
                <f.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold text-base mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Markets */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-6">
            Markets We Cover
          </h2>
          <p className="text-muted-foreground text-center mb-8 leading-relaxed">
            Sofara ambassadors introduce buyers across the United Arab Emirates, with a primary focus on Dubai off-plan and a growing footprint in Abu Dhabi.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Dubai", d: "Downtown, Business Bay, Dubai Marina, Palm Jumeirah, Dubai Creek Harbour, MBR City, JVC and emerging master communities." },
              { t: "Abu Dhabi", d: "Yas Island, Saadiyat Island, Al Reem and Aldar's flagship developments." },
              { t: "United Arab Emirates", d: "Selected freehold and off-plan projects across the wider UAE market." },
            ].map((m) => (
              <div key={m.t} className="p-5 rounded-2xl border border-border/50 bg-secondary/10">
                <MapPin className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm mb-1">{m.t}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Parent company */}
        <section className="px-5 sm:px-6 max-w-3xl mx-auto py-16">
          <div className="rounded-2xl border border-border/50 bg-secondary/10 p-8 text-center">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-3">Brand & Operator</h2>
            <p className="text-muted-foreground mb-2">
              <strong>Sofara</strong> is a brand of <strong>Cevitas Real Estate LLC</strong>, a real estate brokerage based in Dubai, United Arab Emirates. All real estate brokerage activity associated with Sofara is performed by Cevitas Real Estate LLC under its UAE brokerage license. Learn more at{" "}
              <a href="https://www.cevitas.ae" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.cevitas.ae
              </a>
              .
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Sofara provides referral, technology and ambassador-network services. Sofara ambassadors act as introducers only and do not perform any regulated real estate brokerage activity. This page is for general information; it is not legal, tax or investment advice.
            </p>
          </div>
        </section>

        {/* Internal links */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-center mb-6">
            Explore Sofara
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { to: "/ambassador-program", t: "The Sofara Ambassador Program", d: "Commissions, eligibility and how the network works." },
              { to: "/invest-dubai-real-estate", t: "Invest in Dubai Real Estate", d: "2026 investor guide for foreign buyers." },
              { to: "/buy-property-dubai", t: "Buy Property in Dubai", d: "Step-by-step process for international buyers." },
              { to: "/dubai-off-plan-properties", t: "Dubai Off-Plan Properties", d: "Top developers and projects for 2026." },
              { to: "/blog", t: "Sofara Blog", d: "Insights on Dubai and UAE real estate." },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="p-4 rounded-2xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-colors"
              >
                <h3 className="font-semibold text-sm mb-1">{l.t}</h3>
                <p className="text-xs text-muted-foreground">{l.d}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Join the Sofara Dubai Real Estate Ambassadors Network
            </h2>
            <p className="text-muted-foreground mb-8">
              Refer qualified buyers. Earn competitive commissions on closed deals. Operate alongside a licensed UAE brokerage.
            </p>
            <Link
              to="/auth?mode=signup&source=about"
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

export default About;
