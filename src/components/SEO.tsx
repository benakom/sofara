import { Helmet } from "react-helmet-async";
import {
  SEO_CONFIG,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  ORGANIZATION_JSONLD,
  WEBSITE_JSONLD,
  FAQ_JSONLD,
  buildServiceJsonLd,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd,
  type SeoMeta,
} from "@/config/seo";

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
  article,
  jsonLd,
}: SEOProps) => {
  const cfg = route ? SEO_CONFIG[route] : undefined;

  const finalTitle = title || cfg?.title || `${SITE_NAME} — Dubai Real Estate Ambassadors`;
  const finalDesc = description || cfg?.description || "";
  const finalCanonical = canonical || cfg?.canonical || SITE_URL;
  const finalOgImage = ogImage || cfg?.ogImage || DEFAULT_OG_IMAGE;
  const finalSchemaType = schemaType || cfg?.schemaType;
  const isHomepage = finalCanonical === SITE_URL || finalCanonical === `${SITE_URL}/`;

  // Path for breadcrumb derivation
  const pathname = (() => {
    try {
      return new URL(finalCanonical).pathname;
    } catch {
      return "/";
    }
  })();

  // ── Build JSON-LD stack ────────────────────────────────────
  const jsonLdBlocks: Record<string, unknown>[] = [];

  if (isHomepage) {
    jsonLdBlocks.push(ORGANIZATION_JSONLD);
    jsonLdBlocks.push(WEBSITE_JSONLD);
    jsonLdBlocks.push(FAQ_JSONLD);
  } else {
    jsonLdBlocks.push(buildBreadcrumbJsonLd(pathname, finalTitle.split(" | ")[0].split(" — ")[0]));
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
      author: {
        "@type": "Person",
        name: article.author || "Ahmed Benjas",
        url: "https://sofara.io/about",
      },
      publisher: {
        "@type": "Organization",
        name: "Sofara",
        logo: {
          "@type": "ImageObject",
          url: "https://sofara.io/favicon-512x512.png",
        },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": finalCanonical },
    });
  }

  if (jsonLd) {
    const extras = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    jsonLdBlocks.push(...extras);
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {cfg?.keywords && cfg.keywords.length > 0 && (
        <meta name="keywords" content={cfg.keywords.join(", ")} />
      )}
      <link rel="canonical" href={finalCanonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SofaraDubai" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Hreflang (EN canonical) */}
      <link rel="alternate" hrefLang="en" href={finalCanonical} />
      <link rel="alternate" hrefLang="x-default" href={finalCanonical} />

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
