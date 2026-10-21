import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";
import { SEO_CONFIG } from "@/config/seo";

export interface Faq { q: string; a: string }
export interface RelatedLink { to: string; label: string }

interface PillarPageProps {
  route: string;
  eyebrow: string;
  intro: string;
  children: ReactNode;
  faqs: Faq[];
  related: RelatedLink[];
  cta?: { title: string; text: string };
}

/** Long-form SEO landing page: hero, article body, FAQ (with FAQPage schema), related guides, CTA. */
const PillarPage = ({ route, eyebrow, intro, children, faqs, related, cta }: PillarPageProps) => {
  const cfg = SEO_CONFIG[route];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="min-h-screen bg-background">
      <SEO route={route} jsonLd={faqJsonLd} />
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <header className="px-5 sm:px-6 max-w-4xl mx-auto py-12 sm:py-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">{eyebrow}</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">{cfg.h1}</h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/auth" className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:brightness-95">
              Join Sofara for free <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/ambassador-program" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
              See the ambassador program
            </Link>
          </div>
        </header>

        <article className="px-5 sm:px-6 max-w-4xl mx-auto pb-12 prose prose-invert prose-headings:font-display prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground max-w-none">
          <div className="max-w-4xl">{children}</div>
        </article>

        <section className="px-5 sm:px-6 max-w-4xl mx-auto pb-14">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Frequently asked questions</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card/40">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold flex items-start justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="text-primary shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {cta && (
          <section className="px-5 sm:px-6 max-w-4xl mx-auto pb-14">
            <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{cta.title}</h2>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl">{cta.text}</p>
              <ul className="grid sm:grid-cols-3 gap-3 mb-7 text-sm font-medium">
                {["No license required", "Free to join, no fees", "Paid in AED within 7 days"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t}</li>
                ))}
              </ul>
              <a href="/auth" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3 text-sm font-semibold hover:opacity-90">
                Create my free ambassador account <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        )}

        <section className="px-5 sm:px-6 max-w-4xl mx-auto pb-20">
          <h2 className="font-display text-xl font-bold mb-4">Related guides</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors">
                  {r.label} <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default PillarPage;
