import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  hreflang?: { lang: string; href: string }[];
}

const SITE_NAME = "Sofara";
const BASE_URL = "https://sofara.io";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-sofara.png`;

const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  article,
  jsonLd,
  noindex = false,
  hreflang,
}: SEOProps) => {
  const fullTitle = title.includes("Sofara") ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical || BASE_URL;
  const image = ogImage || DEFAULT_OG_IMAGE;

  const defaultHreflang: SEOProps["hreflang"] = [
    { lang: "en", href: canonicalUrl },
    { lang: "fr", href: canonicalUrl },
    { lang: "ar", href: canonicalUrl },
    { lang: "x-default", href: canonicalUrl },
  ];

  const langs = hreflang || defaultHreflang;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_FR" />
      <meta property="og:locale:alternate" content="ar_AE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SofaraDubai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article meta */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Hreflang */}
      {langs.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
