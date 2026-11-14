import type { PillarFaq } from "@/data/pillarFaqs";

/** FAQPage JSON-LD mirroring the questions rendered by <GuideFaq />. */
export const buildFaqJsonLd = (faqs: PillarFaq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/** Visible FAQ block for guide pages (same markup as the pillar pages). */
const GuideFaq = ({ faqs, title = "Frequently asked questions" }: { faqs: PillarFaq[]; title?: string }) => (
  <section className="px-5 sm:px-6 max-w-4xl mx-auto py-16">
    <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-10">{title}</h2>
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
);

export default GuideFaq;
