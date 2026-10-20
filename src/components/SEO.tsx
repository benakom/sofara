import { Helmet } from "react-helmet-async";
import {
  SEO_CONFIG,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  ORGANIZATION_JSONLD,
  WEBSITE_JSONLD,
  buildServiceJsonLd,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd,
  type SeoMeta,
} from "@/config/seo";
import { alternatesFor, localeFromPath, LOCALES, OG_LOCALES, PAGE_PATHS, UI, type Locale } from "@/i18n/locales";

interface SEOProps {
  /** Route key in SEO_CONFIG (e.g. "/", "/about"). Auto-fills meta. */
  route?: string;
  // Per-page overrides (also used by dynamic /blog/:slug)
  title?: string;
  description?: string;
  canonical?: string;
  h1?: string;
  ogImage?: string;
  ogType?: string;
  schemaType?: SeoMeta["schemaType"];
  noindex?: boolean;
  /** Page language (defaults to English). */
  locale?: Locale;
  /** Absolute URLs of the same page in every language, for hreflang. */
  alternates?: Partial<Record<Locale, string>>;
  /** Breadcrumb label of the current page (defaults to the title before " | "). */
  breadcrumbName?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
    image?: string;
    modifiedTime?: string;
  };
  /** Extra JSON-LD blocks merged on top of the auto-injected ones. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({
  route,
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  schemaType,
  noindex = false,
  locale: localeProp,
  alternates: alternatesProp,
  breadcrumbName,
  article,
  jsonLd,
}: SEOProps) => {
  const cfg = route ? SEO_CONFIG[route] : undefined;

  const finalTitle = title || cfg?.title || `${SITE_NAME} — Dubai Real Estate Ambassadors`;
  const finalDesc = description || cfg?.description || "";
  const finalCanonical = canonical || cfg?.canonical || `${SITE_URL}/`;
  const finalOgImage = ogImage || cfg?.ogImage || DEFAULT_OG_IMAGE;
  const finalSchemaType = schemaType || cfg?.schemaType;
  const homeUrls = LOCALES.map((l) => `${SITE_URL}${PAGE_PATHS.home[l]}`);
  const isHomepage = homeUrls.includes(finalCanonical) || finalCanonical === SITE_URL;

  const pathname = (() => {
    try {
      return new URL(finalCanonical).pathname;
    } catch {
      return "/";
    }
  })();

  // Language and hreflang equivalents are derived from the URL unless given explicitly.
  const locale: Locale = localeProp ?? localeFromPath(pathname);
  const alternates = alternatesProp ?? alternatesFor(pathname);

  // ── Build JSON-LD stack ────────────────────────────────────
  const jsonLdBlocks: Record<string, unknown>[] = [];

  if (isHomepage) {
    jsonLdBlocks.push(ORGANIZATION_JSONLD);
    jsonLdBlocks.push({ ...WEBSITE_JSONLD, inLanguage: locale });
  } else {
    jsonLdBlocks.push(
      buildBreadcrumbJsonLd(pathname, breadcrumbName || finalTitle.split(" | ")[0].split(" — ")[0], {
        name: UI[locale].breadcrumbHome,
        path: PAGE_PATHS.home[locale],
      }),
    );
  }

  if (finalSchemaType === "Service") jsonLdBlocks.push(buildServiceJsonLd());
  if (finalSchemaType === "Person") jsonLdBlocks.push(buildPersonJsonLd());
  if (finalSchemaType === "BlogPosting" && article) {
    jsonLdBlocks.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: finalTitle,
      description: finalDesc,
      image: article.image || finalOgImage,
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime || article.publishedTime,
      inLanguage: locale,
      author: {
        "@type": "Person",
        name: article.author || "Ahmed Benjas",
        url: "https://sofara.io/about",
      },
      publisher: { "@id": "https://sofara.io/#organization" },
      mainEntityOfPage: { "@type": "WebPage", "@id": finalCanonical },
    });
  }

  if (jsonLd) {
    const extras = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    jsonLdBlocks.push(...extras);
  }

  const hreflangs = alternates
    ? (Object.entries(alternates) as [Locale, string][])
    : ([[locale, finalCanonical]] as [Locale, string][]);
  const xDefault = alternates?.en ?? (locale === "en" ? finalCanonical : undefined);

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalCanonical} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:locale" content={OG_LOCALES[locale]} />
      {alternates &&
        (Object.keys(alternates) as Locale[])
          .filter((l) => l !== locale)
          .map((l) => <meta key={`ogl-${l}`} property="og:locale:alternate" content={OG_LOCALES[l]} />)}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Hreflang: every language version of this page, plus x-default on the English one */}
      {!noindex && hreflangs.map(([l, href]) => <link key={`hl-${l}`} rel="alternate" hrefLang={l} href={href} />)}
      {!noindex && xDefault && <link rel="alternate" hrefLang="x-default" href={xDefault} />}

      {/* Article meta */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* JSON-LD */}
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
