export type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  ogImage?: string;
  keywords?: string[];
  schemaType?: "WebPage" | "Service" | "Person" | "BlogPosting";
};

export const SITE_NAME = "Sofara";
export const SITE_URL = "https://sofara.io";
export const DEFAULT_OG_IMAGE = "https://sofara.io/og-image-default.jpg";

export const SEO_CONFIG: Record<string, SeoMeta> = {
  "/": {
    title: "Dubai Real Estate Ambassador Program — Earn Up to 3% | Sofara",
    description:
      "Refer Dubai property buyers for Emaar, DAMAC, Sobha and earn AED 37K–120K per closed deal. Free to join, no license needed, paid in 7 days. Built by Cevitas (RERA-licensed).",
    canonical: "https://sofara.io/",
    h1: "Refer Dubai Property. Earn Up to 3% Commission.",
    schemaType: "Service",
  },
  "/invest-dubai-real-estate": {
    title: "Invest in Dubai Real Estate 2026 — Foreigner Guide | Sofara",
    description:
      "Complete 2026 guide to investing in Dubai real estate as a foreigner: ROI, payment plans, Golden Visa, top developers. Insights from RERA-licensed Cevitas brokers.",
    canonical: "https://sofara.io/invest-dubai-real-estate",
    h1: "How to Invest in Dubai Real Estate in 2026 (Investor Guide)",
    schemaType: "WebPage",
  },
  "/buy-property-dubai": {
    title: "Buy Property in Dubai 2026 — Step-by-Step for Foreigners",
    description:
      "How to buy property in Dubai as a foreigner in 2026: areas, developers, payment plans, DLD fees, Golden Visa. Free advisory by Cevitas Real Estate (RERA-licensed).",
    canonical: "https://sofara.io/buy-property-dubai",
    h1: "Buy Property in Dubai — The Complete 2026 Foreigner Guide",
    schemaType: "WebPage",
  },
  "/dubai-off-plan-properties": {
    title: "Dubai Off-Plan Properties 2026 — Best Developers & ROI",
    description:
      "Top Dubai off-plan projects 2026: Emaar, DAMAC, Sobha, Aldar, Binghatti. Payment plans, ROI analysis, handover dates. Live broker data from Cevitas.",
    canonical: "https://sofara.io/dubai-off-plan-properties",
    h1: "Dubai Off-Plan Properties — Top Investments for 2026",
    schemaType: "WebPage",
  },
  "/ambassador-program": {
    title: "Dubai Real Estate Ambassador Program — Earn Up to 3% (No License)",
    description:
      "Become a Sofara ambassador. Refer buyers to Dubai off-plan property (Emaar, DAMAC, Sobha) and earn AED 37K–120K per closed deal. Free, legal, paid in 7 days.",
    canonical: "https://sofara.io/ambassador-program",
    h1: "The Dubai Real Estate Ambassador Program",
    schemaType: "Service",
  },
  "/about": {
    title: "About Sofara — Built by RERA-Licensed Brokers | Ahmed Benjas",
    description:
      "Sofara is built by Ahmed Benjas, founder of Cevitas Real Estate LLC (RERA-licensed). 20+ years finance, Stanford GSB, AED 100M+ Dubai property transactions facilitated.",
    canonical: "https://sofara.io/about",
    h1: "About Sofara — Operator-Built Dubai Real Estate Ambassador Network",
    schemaType: "Person",
  },
  "/blog": {
    title: "Dubai Real Estate Blog 2026 — Insights & Investor Guides | Sofara",
    description:
      "Expert Dubai real estate insights from RERA-licensed brokers: off-plan analysis, developer reviews, payment plans, Golden Visa, ambassador success stories. Updated weekly.",
    canonical: "https://sofara.io/blog",
    h1: "Sofara Blog — Dubai Real Estate Insights",
    schemaType: "WebPage",
  },
};

// ─── Sitewide JSON-LD templates ───────────────────────────────

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sofara",
  url: "https://sofara.io",
  logo: "https://sofara.io/favicon-512x512.png",
  description:
    "Dubai real estate ambassador network. Refer buyers for Emaar, DAMAC, Sobha and earn up to 3% commission per closed transaction.",
  parentOrganization: {
    "@type": "Organization",
    name: "Cevitas Real Estate LLC",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  },
  sameAs: [
    "https://www.linkedin.com/company/sofara-io",
    "https://www.linkedin.com/in/ahmedbenjas",
    "https://www.instagram.com/ahmed.benjas",
    "https://twitter.com/SofaraDubai",
  ],
  founder: { "@type": "Person", name: "Ahmed Benjas", url: "https://sofara.io/about" },
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sofara",
  url: "https://sofara.io",
  description:
    "Dubai real estate ambassador network — earn up to 3% commission on Dubai off-plan property sales.",
  inLanguage: ["en", "ar"],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sofara.io/blog?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much commission can Dubai real estate ambassadors earn on off-plan sales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dubai real estate ambassadors earn up to 3% commission per transaction on Dubai off-plan properties from developers like Emaar, DAMAC and Sobha — typically AED 37,000 to AED 120,000 per deal. Top ambassadors exceed AED 90,000 per month.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a real estate license to be a Sofara ambassador in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You're a business introducer, not a real estate agent. All transactions are closed under Cevitas Real Estate LLC (RERA-licensed in Dubai), so you don't need a local license.",
      },
    },
    {
      "@type": "Question",
      name: "How are Dubai real estate commissions paid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commissions are paid via international bank transfer within 7 days of transaction closing. Status is tracked in real-time on your dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Sofara Dubai real estate ambassador program free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — 100% free. No registration fees, no subscription, no hidden costs. Sofara only earns from completed transactions.",
      },
    },
    {
      "@type": "Question",
      name: "How are my leads protected?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each lead is cryptographically tied to your unique referral link for 12 months — even if the buyer contacts Sofara directly afterwards.",
      },
    },
    {
      "@type": "Question",
      name: "Can foreigners buy property in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Any nationality can buy freehold property in designated areas. Properties from AED 750,000 qualify for a 10-year Golden Visa.",
      },
    },
  ],
};

export function buildServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Real Estate Referral Program",
    name: "Sofara Dubai Real Estate Ambassador Program",
    provider: { "@type": "Organization", name: "Cevitas Real Estate LLC" },
    areaServed: "Worldwide",
    description:
      "Earn up to 3% commission referring buyers to Dubai off-plan property from Emaar, DAMAC, Sobha. No real estate license required. Free to join.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to join. Commission paid per closed transaction.",
    },
  };
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ahmed Benjas",
    url: "https://sofara.io/about",
    image: "https://sofara.io/team/ahmed-benjas.jpg",
    jobTitle: "Founder & CEO",
    worksFor: [
      { "@type": "Organization", name: "Sofara", url: "https://sofara.io" },
      { "@type": "Organization", name: "Cevitas Real Estate LLC" },
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Stanford Graduate School of Business",
    },
    sameAs: [
      "https://www.linkedin.com/in/ahmedbenjas",
      "https://www.instagram.com/ahmed.benjas",
    ],
    knowsAbout: [
      "Dubai Real Estate",
      "PropTech",
      "Real Estate Ambassador Programs",
      "Dubai Off-Plan Investment",
      "Diaspora Investing",
    ],
  };
}

export function buildBreadcrumbJsonLd(pathname: string, title?: string) {
  const segments = pathname.split("/").filter(Boolean);
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sofara.io/" },
  ];
  let acc = "";
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const isLast = i === segments.length - 1;
    const name = isLast && title
      ? title
      : seg
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name,
      item: `https://sofara.io${acc}`,
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
