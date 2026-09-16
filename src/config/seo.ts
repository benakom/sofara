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
export const DEFAULT_OG_IMAGE = "https://sofara.io/og-sofara.png";

export const SEO_CONFIG: Record<string, SeoMeta> = {
  "/": {
    title: "Sofara | Dubai Real Estate Ambassadors",
    description:
      "Sofara is a Dubai real estate ambassador platform. Refer UAE property buyers and earn up to 3% commission in AED.",
    canonical: "https://sofara.io/",
    h1: "Sofara — Dubai Real Estate Ambassadors Network",
    keywords: [
      "Sofara",
      "Sofara Dubai",
      "Sofara Real Estate",
      "Sofara UAE",
      "Sofara ambassador",
      "Sofara network",
      "Dubai real estate",
      "Dubai real estate ambassadors",
      "Dubai Real Estate Ambassadors Network",
      "UAE Real Estate Ambassadors Network",
      "Abu Dhabi Real Estate Ambassadors Network",
      "Dubai property referral program",
      "real estate referral program Dubai",
      "earn commission Dubai real estate",
      "Dubai property ambassador",
      "refer buyers Dubai property",
      "Emaar referral program",
      "DAMAC referral program",
      "Sobha referral program",
      "Cevitas Real Estate",
    ],
    schemaType: "Service",
  },
  "/become-real-estate-agent-dubai": {
    title: "How to Become a Real Estate Agent in Dubai (2026 Guide) | Sofara",
    description:
      "Step-by-step guide to becoming a real estate agent in Dubai in 2026: RERA license, DREI course, costs, timeline, salary and commission, plus the no-license ambassador route that pays up to 3%.",
    canonical: "https://sofara.io/become-real-estate-agent-dubai",
    h1: "How to Become a Real Estate Agent in Dubai in 2026",
    keywords: [
      "become real estate agent Dubai",
      "how to become a real estate agent in Dubai",
      "real estate agent Dubai requirements",
      "RERA license Dubai",
      "DREI course Dubai",
      "real estate agent Dubai salary",
      "real estate agent Dubai commission",
      "real estate jobs Dubai no experience",
      "become property agent Dubai without license",
    ],
    schemaType: "WebPage",
  },
  "/dubai-real-estate-ambassadors": {
    title: "Dubai Real Estate Ambassadors: Network, Earnings & How to Join | Sofara",
    description:
      "What a Dubai real estate ambassador does, how the ambassadors network works, how much ambassadors earn per referral (up to 3% commission) and how to join Sofara for free from anywhere in the world.",
    canonical: "https://sofara.io/dubai-real-estate-ambassadors",
    h1: "Dubai Real Estate Ambassadors: the Network Explained",
    keywords: [
      "Dubai real estate ambassadors",
      "ambassadors of Dubai real estate",
      "real estate ambassadors network Dubai",
      "ambassadors network real estate Dubai",
      "Dubai property ambassador",
      "real estate ambassador program Dubai",
      "UAE real estate ambassadors",
      "Sofara ambassadors",
    ],
    schemaType: "Service",
  },
  "/real-estate-referral-program-dubai": {
    title: "Dubai Real Estate Referral Program: Earn up to 3% per Deal | Sofara",
    description:
      "Join the Dubai real estate referral program that pays up to 3% commission on Emaar, DAMAC and Sobha deals. No license, no fees, paid in AED within 7 days of closing. Free to join.",
    canonical: "https://sofara.io/real-estate-referral-program-dubai",
    h1: "Dubai Real Estate Referral Program: Refer Buyers, Earn up to 3%",
    keywords: [
      "real estate referral program Dubai",
      "Dubai property referral program",
      "Dubai real estate referral commission",
      "refer property buyers Dubai",
      "real estate referral fee Dubai",
      "Emaar referral program",
      "DAMAC referral program",
      "earn commission Dubai real estate",
    ],
    schemaType: "Service",
  },
  "/invest-dubai-real-estate": {
    title: "Invest in Dubai Real Estate 2026 | Sofara",
    description:
      "Dubai real estate investment guide for 2026: ROI, rental yields, payment plans, Golden Visa and top developer insights.",
    canonical: "https://sofara.io/invest-dubai-real-estate",
    h1: "How to Invest in Dubai Real Estate in 2026 (Investor Guide)",
    keywords: [
      "invest Dubai real estate",
      "Dubai real estate investment",
      "Dubai property investment 2026",
      "investing in Dubai property",
      "Dubai rental yields",
      "Dubai Golden Visa real estate",
      "best areas to invest Dubai",
      "Dubai ROI property",
      "is Dubai property a good investment",
      "Sofara",
      "Dubai Real Estate Ambassadors",
    ],
    schemaType: "WebPage",
  },
  "/buy-property-dubai": {
    title: "Buy Property in Dubai 2026 | Sofara",
    description:
      "How foreigners can buy property in Dubai in 2026: areas, developers, payment plans, DLD fees and Golden Visa options.",
    canonical: "https://sofara.io/buy-property-dubai",
    h1: "Buy Property in Dubai — The Complete 2026 Foreigner Guide",
    keywords: [
      "buy property in Dubai",
      "buy property Dubai",
      "Dubai property for sale",
      "homes for sale in Dubai",
      "houses for sale in Dubai",
      "Dubai real estate for sale",
      "apartment for sale in Dubai",
      "real estate in Dubai",
      "how to buy property in Dubai",
      "can foreigners buy property in Dubai",
      "buy property Dubai from USA",
      "foreigner Dubai property",
      "Dubai property guide 2026",
      "Sofara Dubai",
    ],
    schemaType: "WebPage",
  },
  "/dubai-off-plan-properties": {
    title: "Dubai Off-Plan Properties 2026 | Sofara",
    description:
      "Explore Dubai off-plan properties for 2026: developers, payment plans, ROI, handover dates and broker-backed insights.",
    canonical: "https://sofara.io/dubai-off-plan-properties",
    h1: "Dubai Off-Plan Properties — Top Investments for 2026",
    keywords: ["Dubai off-plan", "Emaar off-plan", "DAMAC off-plan", "Sofara Real Estate"],
    schemaType: "WebPage",
  },
  "/ambassador-program": {
    title: "Dubai Real Estate Ambassadors | Sofara",
    description:
      "Join Sofara, refer Dubai property buyers and earn up to 3% commission in AED through a licensed real estate partner.",
    canonical: "https://sofara.io/ambassador-program",
    h1: "The Sofara Dubai Real Estate Ambassadors Network",
    keywords: [
      "Dubai Real Estate Ambassadors",
      "Dubai Real Estate Ambassadors Network",
      "UAE Real Estate Ambassadors Network",
      "Abu Dhabi Real Estate Ambassadors Network",
      "Sofara",
      "Sofara Dubai",
    ],
    schemaType: "Service",
  },
  "/about": {
    title: "About Sofara Dubai Real Estate",
    description:
      "Learn about Sofara, the Dubai real estate ambassador platform operated with Cevitas Real Estate LLC.",
    canonical: "https://sofara.io/about",
    h1: "About Sofara — the Operator-Built Dubai Real Estate Ambassadors Network",
    keywords: [
      "Sofara",
      "Sofara Dubai",
      "Sofara Real Estate",
      "Sofara UAE",
      "Sofara network",
      "Sofara ambassador",
      "Sofara referral",
      "Dubai Real Estate Ambassadors",
      "Dubai Real Estate Ambassadors Network",
      "UAE Real Estate Ambassadors Network",
      "Abu Dhabi Real Estate Ambassadors Network",
      "Ahmed Benjas",
      "Cevitas Real Estate",
    ],
    schemaType: "Person",
  },
  "/blog": {
    title: "Sofara Blog | Dubai Real Estate Guides",
    description:
      "Dubai real estate guides from Sofara: ambassador strategy, off-plan analysis, payment plans and market insights.",
    canonical: "https://sofara.io/blog",
    h1: "Sofara Blog — Dubai Real Estate Ambassadors Insights",
    keywords: ["Sofara blog", "Dubai Real Estate Ambassadors", "Dubai property blog", "Sofara Dubai"],
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
        text: "Each lead is securely tied to your unique referral link for 12 months — even if the buyer contacts Sofara directly afterwards.",
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
    image: "https://sofara.io/team/ahmed-benjas.png",
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
