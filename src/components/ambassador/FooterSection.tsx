import { useLanguage } from "@/i18n/LanguageContext";
import { Instagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { EN_GUIDES, GUIDES, LOCALES, LOCALE_LABELS, localeFromPath, PAGE_LABELS, PAGE_PATHS, type Locale } from "@/i18n/locales";

type FooterLink = { label: string; to: string; external?: boolean };

const HEADINGS: Record<Locale, { program: string; network: string; income: string; legal: string; partners: string; guides: string }> = {
  en: { program: "Program", network: "Ambassadors & affiliation", income: "Income & career", legal: "Legal", partners: "Partners", guides: "Guides" },
  fr: { program: "Programme", network: "Ambassadeurs & affiliation", income: "Revenus & carrière", legal: "Légal", partners: "Partenaires", guides: "Guides" },
  es: { program: "Programa", network: "Embajadores y afiliados", income: "Ingresos y carrera", legal: "Legal", partners: "Socios", guides: "Guías" },
  ar: { program: "البرنامج", network: "السفراء والتسويق بالعمولة", income: "الدخل والمسار المهني", legal: "قانوني", partners: "الشركاء", guides: "الأدلة" },
  ru: { program: "Программа", network: "Амбассадоры и партнёрство", income: "Доход и карьера", legal: "Правовая информация", partners: "Партнёры", guides: "Гайды" },
};

/** English blog guides, grouped by theme (replaces the old flat link cloud). */
const BLOG_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Become an ambassador",
    links: [
      { label: "What is Sofara", to: "/blog/what-is-sofara" },
      { label: "How to become a Dubai ambassador", to: "/blog/how-to-become-dubai-real-estate-ambassador" },
      { label: "Dubai real estate ambassadors guide", to: "/blog/dubai-real-estate-ambassadors-guide" },
      { label: "UAE ambassadors network", to: "/blog/uae-real-estate-ambassadors-network" },
      { label: "Abu Dhabi ambassadors network", to: "/blog/abu-dhabi-real-estate-ambassadors-network" },
      { label: "Commission structure", to: "/blog/sofara-commission-structure-explained" },
      { label: "Super Ambassador program", to: "/blog/super-ambassador-program" },
      { label: "Sofara Pro vs Lite", to: "/blog/sofara-pro-vs-lite" },
    ],
  },
  {
    title: "Real estate agent in Dubai",
    links: [
      { label: "How to be a Dubai real estate agent", to: "/blog/how-to-be-dubai-real-estate-agent" },
      { label: "How long it takes", to: "/blog/how-long-become-real-estate-agent-dubai" },
      { label: "Qualifications required", to: "/blog/qualifications-real-estate-agent-dubai" },
      { label: "Cost of the license", to: "/blog/cost-become-real-estate-agent-dubai" },
      { label: "How much agents earn", to: "/blog/how-much-money-real-estate-agents-make-dubai" },
      { label: "WhatsApp marketing in Dubai", to: "/blog/whatsapp-marketing-real-estate-dubai" },
    ],
  },
  {
    title: "Dubai property market",
    links: [
      { label: "Dubai real estate market 2026", to: "/blog/dubai-real-estate-market-2026-overview" },
      { label: "Why invest in Dubai property", to: "/blog/why-invest-dubai-property-2026" },
      { label: "Top areas to invest", to: "/blog/top-dubai-areas-investment-2026" },
      { label: "Off-plan vs ready", to: "/blog/dubai-off-plan-vs-ready-properties" },
      { label: "Payment plans", to: "/blog/dubai-payment-plans-explained" },
      { label: "DLD fees", to: "/blog/dubai-dld-fees-explained" },
      { label: "Rental yields", to: "/blog/dubai-rental-yields-explained" },
      { label: "Golden Visa by property", to: "/blog/dubai-golden-visa-real-estate" },
    ],
  },
  {
    title: "Developers & partners",
    links: [
      { label: "Emaar Properties guide", to: "/blog/emaar-properties-guide" },
      { label: "DAMAC Properties guide", to: "/blog/damac-properties-guide" },
      { label: "Sobha Realty", to: "/blog/sobha-realty-quality-investment" },
      { label: "Foreigners buying in Dubai", to: "/blog/foreigners-buying-dubai-property" },
      { label: "Cevitas, Dubai real estate agency", to: "https://www.cevitas.ae/", external: true },
      { label: "Off-plan properties in Dubai", to: "https://www.cevitas.ae/off-plan-properties-dubai", external: true },
      { label: "Buy property in Abu Dhabi", to: "https://www.cevitas.ae/abu-dhabi-real-estate", external: true },
      { label: "Ras Al Khaimah real estate", to: "https://www.cevitas.ae/ras-al-khaimah-real-estate", external: true },
    ],
  },
];

const FR_GUIDES: FooterLink[] = [
  { label: "Comment devenir agent immobilier à Dubaï", to: "/blog/comment-devenir-agent-immobilier-dubai" },
  { label: "Agent immobilier à Dubaï sans licence", to: "/blog/devenir-agent-immobilier-dubai-sans-licence" },
  { label: "Agence immobilière à Dubaï (Cevitas)", to: "https://www.cevitas.ae/agence-immobiliere-dubai", external: true },
  { label: "Acheter sur plan à Dubaï", to: "https://www.cevitas.ae/acheter-sur-plan-dubai", external: true },
  { label: "Immobilier aux Émirats", to: "https://www.cevitas.ae/immobilier-emirats-arabes-unis", external: true },
  { label: "Golden Visa Dubaï par l'immobilier", to: "https://www.cevitas.ae/golden-visa-dubai-immobilier", external: true },
];

const linkCls = "text-sm text-muted-foreground hover:text-foreground transition-colors leading-snug";
const headCls = "font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80 mb-4";

const Item = ({ l }: { l: FooterLink }) => (
  <li>
    {l.external ? (
      <a href={l.to} target="_blank" rel="noopener" className={linkCls}>{l.label}</a>
    ) : l.to.includes("#") ? (
      <a href={l.to} className={linkCls}>{l.label}</a>
    ) : (
      <Link to={l.to} className={linkCls}>{l.label}</Link>
    )}
  </li>
);

const Column = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div className="min-w-0">
    <h3 className={headCls}>{title}</h3>
    <ul className="grid gap-2.5">{links.map((l) => <Item key={l.to + l.label} l={l} />)}</ul>
  </div>
);

const FooterSection = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const en = locale === "en";
  const h = HEADINGS[locale];
  const home = PAGE_PATHS.home[locale];
  const anchor = (id: string) => (pathname === home ? id : `${home}${id}`);
  const page = (k: "ambassadors" | "affiliate" | "agent" | "invest"): FooterLink => ({ label: PAGE_LABELS[k][locale], to: PAGE_PATHS[k][locale] });

  const program: FooterLink[] = [
    { label: t("nav.howItWorks"), to: anchor("#comment") },
    { label: t("nav.benefits"), to: anchor("#avantages") },
    { label: t("nav.whyDubai"), to: anchor("#dubai") },
    ...(en ? [{ label: "Ambassador program", to: "/ambassador-program" }, { label: "About Sofara", to: "/about" }] : []),
    { label: "Blog", to: "/blog" },
  ];
  const guide = (k: keyof typeof GUIDES): FooterLink => ({ label: GUIDES[k].label, to: GUIDES[k].path });
  const network: FooterLink[] = [
    page("ambassadors"),
    page("affiliate"),
    ...(locale === "fr" ? [guide("apporteur")] : []),
    ...(en ? [
      { label: "Real estate referral program", to: "/real-estate-referral-program-dubai" },
      { label: EN_GUIDES.referralFee.label, to: EN_GUIDES.referralFee.path },
    ] : []),
  ];
  const income: FooterLink[] = [
    page("agent"),
    ...(en ? [
      { label: EN_GUIDES.freelance.label, to: EN_GUIDES.freelance.path },
      { label: EN_GUIDES.partTime.label, to: EN_GUIDES.partTime.path },
      { label: EN_GUIDES.sideIncome.label, to: EN_GUIDES.sideIncome.path },
    ] : []),
    ...(locale === "fr" ? [guide("travailDubai")] : []),
    ...(locale === "ru" ? [guide("rabota")] : []),
    page("invest"),
  ];

  return (
    <footer className="border-t border-border/30 pt-14 sm:pt-20 pb-8" itemScope itemType="https://schema.org/WPFooter">
      <div className="mx-auto px-5 sm:px-6 max-w-7xl">
        {/* Brand + main menus */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-12">
          <div className="sm:col-span-2 lg:col-span-4 grid gap-4 content-start">
            <span className="font-display text-4xl lg:text-5xl font-bold text-primary tracking-tight">sofara</span>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed">{t("footer.description")}</p>
            <a href="https://www.instagram.com/sofaradubai/" target="_blank" rel="noopener" aria-label="Follow Sofara Dubai on Instagram"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram size={18} />
            </a>
          </div>
          <div className="lg:col-span-2"><Column title={h.program} links={program} /></div>
          <div className="lg:col-span-2"><Column title={h.network} links={network} /></div>
          <div className="lg:col-span-2"><Column title={h.income} links={income} /></div>
          <div className="lg:col-span-2 grid gap-8 content-start">
            <Column title={h.legal} links={[
              { label: t("footer.privacy"), to: "/legal/privacy" },
              { label: t("footer.terms"), to: "/legal/terms" },
              { label: t("footer.cookies"), to: "/legal/cookies" },
            ]} />
            <Column title={h.partners} links={[
              { label: "Cevitas Real Estate", to: "https://www.cevitas.ae", external: true },
              { label: "Off-Plan Simulator", to: "https://www.offplansimulator.com", external: true },
            ]} />
          </div>
        </div>

        {/* Guides, grouped by theme */}
        {(en || locale === "fr") && (
          <nav aria-label={h.guides} className="border-t border-border/30 py-10">
            {en ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {BLOG_GROUPS.map((g) => <Column key={g.title} title={g.title} links={g.links} />)}
              </div>
            ) : (
              <Column title={h.guides} links={FR_GUIDES} />
            )}
          </nav>
        )}

        {/* Languages + legal line */}
        <div className="border-t border-border/30 pt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Languages" className="flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <a key={l} href={PAGE_PATHS.home[l]} hrefLang={l} lang={l}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${l === locale ? "border-primary/60 text-primary font-semibold" : "border-border/50 text-muted-foreground hover:text-foreground"}`}>
                {LOCALE_LABELS[l]}
              </a>
            ))}
          </nav>
          <div className="grid gap-1 text-xs text-muted-foreground lg:text-right lg:rtl:text-left">
            <p>{t("footer.regulated")}</p>
            <p>{t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
