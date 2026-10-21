import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";
import { SEO_CONFIG } from "@/config/seo";
import { Headline } from "@/components/home/Headline";

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
      <main className="pt-14 sm:pt-16">
        <div className="bg-[hsl(var(--paper))] text-[hsl(var(--sand-foreground))]">
        <header className="px-5 sm:px-6 max-w-4xl mx-auto py-12 sm:py-16">
          <p className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--sand-muted))] mb-4">{eyebrow}</p>
          <h1 className="font-display text-[2.1rem] sm:text-5xl font-extrabold tracking-[-0.035em] leading-[1.08] mb-5 text-balance"><Headline text={cfg.h1} /></h1>
          <p className="text-base sm:text-lg text-[hsl(var(--sand-muted))] leading-relaxed">{intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/auth" className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-5 py-3 text-sm font-semibold hover:opacity-90">
              Join Sofara for free <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/ambassador-program" className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--sand-foreground)/0.25)] px-5 py-3 text-sm font-semibold hover:bg-[hsl(var(--sand-foreground)/0.06)]">
              See the ambassador program
            </Link>
          </div>
        </header>
        </div>

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
