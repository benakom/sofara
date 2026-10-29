import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";
import AuthorBox, { AUTHOR_TEXT } from "@/components/AuthorBox";
import { AHMED_BENJAS_PERSON } from "@/config/seo";
import { GUIDES, isGuideKey, labelOf, pathOf, PAGE_PATHS, SITE_URL, UI, type AnyPageKey, type Locale } from "@/i18n/locales";
import type { Block, PillarContent } from "@/data/localizedPillars/types";

/** Renders **bold** and [label](/path) inside content strings. */
const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={i} to={href}>{label}</Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener">{label}</a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

const renderBlock = (b: Block, i: number) => {
  if ("p" in b) return <p key={i}>{inline(b.p)}</p>;
  if ("h3" in b) return <h3 key={i}>{inline(b.h3)}</h3>;
  if ("ul" in b) return <ul key={i}>{b.ul.map((li, j) => <li key={j}>{inline(li)}</li>)}</ul>;
  if ("ol" in b) return <ol key={i}>{b.ol.map((li, j) => <li key={j}>{inline(li)}</li>)}</ol>;
  return (
    <div key={i} className="overflow-x-auto not-prose my-6">
      <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
        <thead className="bg-secondary/60">
          <tr>{b.table.head.map((h) => <th key={h} className="text-left font-semibold px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody>
          {b.table.rows.map((r, j) => (
            <tr key={j} className="border-t border-border">
              {r.map((c, k) => <td key={k} className="px-4 py-3 text-muted-foreground">{inline(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Long-form localized landing page (FR/ES/RU guides and the English affiliate page). `pillars` is the content of the
 * page's locale only (loaded per locale by src/pages/LocalizedPillarRoute.tsx).
 */
const LocalizedPillar = ({ pageKey, locale, pillars }: { pageKey: AnyPageKey; locale: Locale; pillars: Partial<Record<AnyPageKey, PillarContent>> }) => {
  const c = pillars[pageKey];
  if (!c) return null;
  const ui = UI[locale];
  const path = pathOf(pageKey, locale);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.h1,
    description: c.description,
    inLanguage: locale,
    url: `${SITE_URL}${path}`,
    image: `${SITE_URL}/og-sofara.png`,
    dateModified: "2026-10-21",
    author: AHMED_BENJAS_PERSON,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.title}
        description={c.description}
        canonical={`${SITE_URL}${path}`}
        locale={locale}
        breadcrumbName={labelOf(pageKey, locale)}
        jsonLd={[faqJsonLd, articleJsonLd]}
      />
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <header className="px-5 sm:px-6 max-w-4xl mx-auto py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-5">
            <Link to={PAGE_PATHS.home[locale]} className="hover:text-foreground">{ui.breadcrumbHome}</Link>
            <span className="mx-2">/</span>
            <span>{labelOf(pageKey, locale)}</span>
          </nav>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">{c.eyebrow}</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">{c.h1}</h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{inline(c.intro)}</p>
          <p className="mt-4 text-xs text-muted-foreground">{ui.updated} · {AUTHOR_TEXT[locale].byline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/auth" className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:brightness-95">
              {ui.join} <ArrowRight className="w-4 h-4" />
            </a>
            <a href={`${PAGE_PATHS.home[locale]}#comment`} className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
              {ui.seeProgram}
            </a>
          </div>
        </header>

        <article className="px-5 sm:px-6 max-w-4xl mx-auto pb-12 prose prose-invert prose-headings:font-display prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground max-w-none">
          {c.sections.map((s) => (
            <section key={s.h2}>
              <h2>{s.h2}</h2>
              {s.blocks.map(renderBlock)}
            </section>
          ))}
        </article>

        <div className="px-5 sm:px-6 max-w-4xl mx-auto pb-12">
          <AuthorBox locale={locale} />
        </div>

        <section className="px-5 sm:px-6 max-w-4xl mx-auto pb-14">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">{ui.faq}</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card/40">
            {c.faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold flex items-start justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="text-primary shrink-0 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-5 sm:px-6 max-w-4xl mx-auto pb-14">
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{c.cta.title}</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl">{c.cta.text}</p>
            <ul className="grid sm:grid-cols-3 gap-3 mb-7 text-sm font-medium">
              {ui.perks.map((t) => (
                <li key={t} className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t}</li>
              ))}
            </ul>
            <a href="/auth" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3 text-sm font-semibold hover:opacity-90">
              {ui.createAccount} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section className="px-5 sm:px-6 max-w-4xl mx-auto pb-20">
          <h2 className="font-display text-xl font-bold mb-4">{ui.related}</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {c.related.filter((k) => !isGuideKey(k) || GUIDES[k].locale === locale).map((k) => (
              <li key={k}>
                <Link to={pathOf(k, locale)} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors">
                  {k === "home" ? ui.home : labelOf(k, locale)} <ArrowRight className="w-4 h-4 shrink-0" />
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

export default LocalizedPillar;
