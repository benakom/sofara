import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin, GraduationCap, Building2, Award } from "lucide-react";
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            About Sofara — Operator-Built Dubai Real Estate Ambassador Network
          </motion.h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Sofara isn't a marketing platform built by a tech founder pivoting into real estate. It's a referral network built by RERA-licensed Dubai brokers who already close Dubai off-plan deals every week. We've extended what works in our brokerage — <strong>Cevitas Real Estate LLC</strong> — to a global network of ambassadors.
          </p>
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
                alt="Ahmed Benjas, Founder and CEO of Sofara"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ahmed Benjas is the Founder and CEO of <strong>Cevitas Real Estate LLC</strong> (RERA-licensed Dubai brokerage) and <strong>Sofara</strong>. His background includes 20+ years in finance, an MBA, and Executive Education at <strong>Stanford Graduate School of Business</strong>. Recognized as a LinkedIn Top Voice, Ahmed has facilitated over <strong>AED 100M in Dubai property transactions</strong> and built an audience of 95,000+ followers around real estate, Dubai investing, and the diaspora wealth movement.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                He started Sofara to solve a friction he saw firsthand: thousands of expats and diaspora investors have the networks and credibility to send buyers to Dubai property — but no legal way to monetize that without a UAE real estate license. Sofara closes that gap.
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
              { icon: Building2, t: "RERA-Licensed", d: "Cevitas Real Estate LLC, Dubai" },
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
            Dubai real estate is the world's most cross-border market — 180+ nationalities buying property each year. Yet referral economics in the industry are broken: slow payouts, opaque commissions, no tools. Sofara solves that with operator-grade infrastructure: a RERA-licensed back office, transparent commission tracking, AI-powered tools for ambassadors, and payouts within 7 days. Every feature ships from the perspective of someone who has actually closed deals — not from a roadmap drawn in a vacuum.
          </p>
        </section>

        {/* Parent company */}
        <section className="px-5 sm:px-6 max-w-3xl mx-auto py-16">
          <div className="rounded-2xl border border-border/50 bg-secondary/10 p-8 text-center">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-3">Parent Company</h2>
            <p className="text-muted-foreground mb-2">
              Sofara is operated by <strong>Cevitas Real Estate LLC</strong>, a RERA-licensed Dubai brokerage. All transactions close under Cevitas' license — ensuring full UAE legal compliance for every ambassador worldwide.
            </p>
            <p className="text-xs text-muted-foreground">Dubai · United Arab Emirates</p>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Join the Sofara Ambassador Network
            </h2>
            <p className="text-muted-foreground mb-8">
              Refer buyers. Earn up to 3%. Paid in 7 days.
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
