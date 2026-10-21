import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { formatAed, HOME_COPY } from "@/data/homeCopy";
import type { Locale } from "@/i18n/locales";

/* Homepage sections (2026-10-21 redesign): bottle-green bands alternating with sand bands.
   No entrance animations: everything is visible in the prerendered HTML. */

const sand = "bg-[hsl(var(--sand))] text-[hsl(var(--sand-foreground))]";
const eyebrow = "font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-[15px] font-semibold font-display hover:brightness-95 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-6 py-3.5 text-[15px] font-semibold font-display hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--background))]";
const btnLightOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--sand-foreground)/0.25)] px-6 py-3.5 text-[15px] font-semibold font-display hover:bg-[hsl(var(--sand-foreground)/0.06)] transition";
const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-[15px] font-semibold font-display text-foreground hover:bg-secondary transition";

/** Wraps the first occurrence of `mark` in the fluo highlighter. */
export const Marked = ({ text, mark }: { text: string; mark?: string }) => {
  const i = mark ? text.indexOf(mark) : -1;
  if (!mark || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="marker">{mark}</span>
      {text.slice(i + mark.length)}
    </>
  );
};

const Calculator = ({ locale }: { locale: Locale }) => {
  const c = HOME_COPY[locale].calc;
  const [price, setPrice] = useState(1_500_000);
  const [deals, setDeals] = useState(2);
  const min = price * 0.01;
  const max = price * 0.03;
  return (
    <form
      className="bg-background text-foreground rounded-3xl p-5 sm:p-6 grid gap-5 shadow-[0_40px_80px_-40px_rgba(15,46,35,0.55)] min-w-0"
      onSubmit={(e) => e.preventDefault()}
      aria-label={c.title}
    >
      <p className={`${eyebrow} text-muted-foreground`}>{c.title}</p>
      <div className="grid gap-2">
        <label htmlFor="calc-price" className="flex justify-between gap-3 text-sm font-semibold">
          {c.price} <output htmlFor="calc-price" className="font-mono">{formatAed(price, locale)}</output>
        </label>
        <input id="calc-price" type="range" min={600000} max={10000000} step={50000} value={price}
          onChange={(e) => setPrice(+e.target.value)} className="w-full accent-[hsl(var(--primary))]" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="calc-deals" className="flex justify-between gap-3 text-sm font-semibold">
          {c.deals} <output htmlFor="calc-deals" className="font-mono">{deals}</output>
        </label>
        <input id="calc-deals" type="range" min={1} max={12} step={1} value={deals}
          onChange={(e) => setDeals(+e.target.value)} className="w-full accent-[hsl(var(--primary))]" />
      </div>
      <div className="rounded-2xl bg-card border border-border p-4 grid gap-1.5" aria-live="polite">
        <span className="text-xs text-muted-foreground">{c.result}</span>
        <strong className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-primary tabular-nums">
          {c.range(formatAed(min, locale), formatAed(max, locale))}
        </strong>
        <span className="text-xs text-muted-foreground">{c.perYear(formatAed(min * deals, locale), formatAed(max * deals, locale), deals)}</span>
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">{c.note}</p>
    </form>
  );
};

export const HomeHero = ({ locale }: { locale: Locale }) => {
  const c = HOME_COPY[locale];
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--paper))] text-[hsl(var(--sand-foreground))]" aria-labelledby="home-h1">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20 grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-14 items-center">
        <div className="min-w-0">
          <p className={`${eyebrow} text-[hsl(var(--sand-muted))]`}>{c.eyebrow}</p>
          <h1 id="home-h1" className="mt-4 font-display font-extrabold tracking-[-0.04em] leading-[1.04] text-[2.5rem] sm:text-6xl lg:text-7xl text-balance">
            <span className="sr-only">{c.h1Prefix}</span>
            <span className="block">{c.h1[0]}</span>
            <span className="block">{c.h1[1]}</span>
            <span className="block"><span className="marker">{c.h1[2]}</span></span>
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[hsl(var(--sand-muted))]">{c.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/auth" className={btnDark}>{c.ctaPrimary} <ArrowRight className="w-4 h-4" /></a>
            <a href="#projets" className={btnLightOutline}>{c.ctaSecondary}</a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[hsl(var(--sand-muted))]">
            {c.proof.map((p) => (
              <li key={p} className="inline-flex items-center gap-2"><Check className="w-4 h-4 text-[#4F6B00]" />{p}</li>
            ))}
          </ul>
        </div>
        <Calculator locale={locale} />
      </div>
    </section>
  );
};

export const TrustStrip = ({ locale }: { locale: Locale }) => (
  <div className="border-y border-border bg-card">
    <ul className="mx-auto max-w-7xl px-4 sm:px-6 py-4 grid sm:flex sm:flex-wrap sm:justify-center gap-x-8 gap-y-1.5 text-[13px] text-muted-foreground">
      {HOME_COPY[locale].trust.map((t, i) => (
        <li key={t} className={i === 0 ? "text-foreground font-semibold" : ""}>{t}</li>
      ))}
    </ul>
  </div>
);

export const HowItWorks = ({ locale }: { locale: Locale }) => {
  const c = HOME_COPY[locale].how;
  return (
    <section id="comment" className={sand} aria-labelledby="how-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid gap-8">
        <div className="grid gap-3 max-w-2xl">
          <p className={`${eyebrow} text-[hsl(var(--sand-muted))]`}>{c.eyebrow}</p>
          <h2 id="how-title" className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-balance"><Marked text={c.title} mark={c.mark} /></h2>
        </div>
        <ol className="grid md:grid-cols-3 gap-4">
          {c.steps.map((s) => (
            <li key={s.title} className="rounded-2xl bg-white border border-[hsl(var(--sand-border))] p-6 grid gap-2 content-start">
              <span className="font-mono text-xs font-semibold text-[#4F6B00]">{s.label}</span>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[hsl(var(--sand-muted))]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export const Commissions = ({ locale }: { locale: Locale }) => {
  const c = HOME_COPY[locale].rates;
  const card = "rounded-2xl border border-border p-6 grid gap-1 content-start";
  return (
    <section id="avantages" aria-labelledby="rates-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid gap-8">
        <div className="grid gap-3 max-w-2xl">
          <p className={`${eyebrow} text-muted-foreground`}>{c.eyebrow}</p>
          <h2 id="rates-title" className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-balance">{c.title}</h2>
          <p className="text-muted-foreground">{c.sub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {c.cards.map((r) => (
            <div key={r.who} className={card}>
              <strong className="font-display text-4xl font-extrabold text-primary">{r.rate}</strong>
              <span className="font-semibold">{r.who}</span>
              <span className="text-sm text-muted-foreground">{r.example}</span>
            </div>
          ))}
          <div className={`${card} bg-card`}>
            <strong className="font-display text-4xl font-extrabold text-primary">{c.team.rate}</strong>
            <span className="font-semibold">{c.team.who}</span>
            <span className="text-sm text-muted-foreground">{c.team.example}</span>
          </div>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{c.rules}</p>
      </div>
    </section>
  );
};

export const Projects = ({ locale }: { locale: Locale }) => {
  const c = HOME_COPY[locale].projects;
  return (
    <section id="projets" className={sand} aria-labelledby="projects-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-3 max-w-2xl">
            <p className={`${eyebrow} text-[hsl(var(--sand-muted))]`}>{c.eyebrow}</p>
            <h2 id="projects-title" className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-balance"><Marked text={c.title} mark={c.mark} /></h2>
            <p className="text-[hsl(var(--sand-muted))]">{c.sub}</p>
          </div>
          <a href="/auth" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-5 py-3 text-sm font-semibold font-display hover:opacity-90">
            {c.cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <ul className="grid md:grid-cols-3 gap-4">
          {c.items.map((p) => (
            <li key={p.slug} className="rounded-2xl overflow-hidden bg-white border border-[hsl(var(--sand-border))] grid">
              <img
                src={`/img/projects/${p.slug}-800.webp`}
                srcSet={`/img/projects/${p.slug}-480.webp 480w, /img/projects/${p.slug}-800.webp 800w`}
                sizes="(max-width: 768px) 100vw, 400px"
                width={800} height={500} loading="lazy" decoding="async"
                alt={p.name}
                className="w-full aspect-[16/10] object-cover"
              />
              <div className="p-5 grid gap-1">
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-[hsl(var(--sand-muted))]">{p.where}</p>
                <p className="text-sm font-semibold">{p.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[hsl(var(--sand-muted))]">{c.note}</p>
      </div>
    </section>
  );
};

export const FinalCTA = ({ locale }: { locale: Locale }) => {
  const c = HOME_COPY[locale].final;
  return (
    <section aria-labelledby="final-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="rounded-[2rem] bg-primary text-primary-foreground p-8 sm:p-14 grid gap-5">
          <h2 id="final-title" className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl">{c.title}</h2>
          <p className="max-w-2xl text-base sm:text-lg opacity-80">{c.text}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {c.perks.map((p) => <li key={p} className="inline-flex items-center gap-2"><Check className="w-4 h-4" />{p}</li>)}
          </ul>
          <div>
            <a href="/auth" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-7 py-4 text-base font-semibold font-display hover:opacity-90">
              {c.cta} <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
