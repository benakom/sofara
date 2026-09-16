// Post-build: writes a static HTML file per public route (dist/<route>/index.html) with the page's own
// <title>, meta, canonical, Open Graph and JSON-LD, plus a crawlable content snapshot inside #root.
// The React app still boots normally on top of it. Runs after `vite build`.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import { SEO_CONFIG, SITE_URL, DEFAULT_OG_IMAGE } from "../src/config/seo";
import { blogArticles } from "../src/data/blogArticles";
import { PILLAR_FAQS } from "../src/data/pillarFaqs";

const dist = resolve(process.cwd(), "dist");
const indexPath = join(dist, "index.html");
if (!existsSync(indexPath)) { console.log("[prerender] dist/index.html not found, skipping"); process.exit(0); }
const template = readFileSync(indexPath, "utf8");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Minimal Markdown → HTML for the crawlable snapshot (headings, lists, paragraphs, bold/italic, links). */
function mdToHtml(md: string): string {
  const inline = (t: string) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)/g, (_m, a, h) => `<a href="${h}">${a}</a>`);
  const out: string[] = []; let list: "ul" | "ol" | null = null; let para: string[] = [];
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushP(); closeList(); continue; }
    if (line.startsWith("---")) { flushP(); closeList(); out.push("<hr/>"); continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushP(); closeList(); const l = Math.min(h[1].length, 4); out.push(`<h${l}>${inline(h[2])}</h${l}>`); continue; }
    if (line.startsWith("|")) { flushP(); closeList(); if (!/^\|[\s:-]+\|/.test(line)) out.push(`<p>${inline(line.replace(/\|/g, " · "))}</p>`); continue; }
    const li = line.match(/^(?:[-*]|\d+\.)\s+(.*)$/);
    if (li) { flushP(); const kind = /^\d/.test(line) ? "ol" : "ul"; if (list !== kind) { closeList(); out.push(`<${kind}>`); list = kind; } out.push(`<li>${inline(li[1])}</li>`); continue; }
    closeList(); para.push(line);
  }
  flushP(); closeList();
  return out.join("\n");
}

interface Page { path: string; title: string; description: string; canonical: string; ogType: string; body: string; jsonLd: Record<string, unknown>[]; image?: string; article?: { published: string; author: string; tags: string[] } }

const breadcrumb = (path: string, name: string) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
  ],
});


const faqHtml = (path: string) => {
  const faqs = PILLAR_FAQS[path]; if (!faqs) return "";
  return `<section><h2>Frequently asked questions</h2>${faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>`;
};
const faqJsonLd = (path: string) => {
  const faqs = PILLAR_FAQS[path]; if (!faqs) return [];
  return [{ "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }];
};

const pages: Page[] = [];
for (const [path, cfg] of Object.entries(SEO_CONFIG)) {
  if (path === "/") continue;
  pages.push({
    path, title: cfg.title, description: cfg.description, canonical: cfg.canonical, ogType: "website",
    body: `<h1>${esc(cfg.h1)}</h1><p>${esc(cfg.description)}</p>${cfg.keywords ? `<p>${esc(cfg.keywords.slice(0, 8).join(" · "))}</p>` : ""}${faqHtml(path)}`,
    jsonLd: [breadcrumb(path, cfg.h1), ...faqJsonLd(path)],
  });
}
for (const a of blogArticles) {
  const path = `/blog/${a.slug}`;
  pages.push({
    path, title: `${a.title} | Sofara Blog`, description: a.excerpt, canonical: `${SITE_URL}${path}`, ogType: "article", image: a.image,
    body: mdToHtml(a.content), article: { published: a.date, author: a.author, tags: a.tags },
    jsonLd: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.excerpt, image: a.image, datePublished: a.date, dateModified: a.date,
        author: { "@type": "Organization", name: a.author }, publisher: { "@type": "Organization", name: "Sofara", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-512x512.png` } },
        mainEntityOfPage: `${SITE_URL}${path}`, keywords: a.tags.join(", ") },
      breadcrumb(path, a.title),
    ],
  });
}

const nav = `<nav><a href="/">Sofara</a> · <a href="/ambassador-program">Ambassador program</a> · <a href="/dubai-real-estate-ambassadors">Dubai real estate ambassadors</a> · <a href="/become-real-estate-agent-dubai">Become a real estate agent in Dubai</a> · <a href="/real-estate-referral-program-dubai">Referral program</a> · <a href="/invest-dubai-real-estate">Invest in Dubai</a> · <a href="/blog">Blog</a></nav>`;

let written = 0;
for (const p of pages) {
  let html = template;
  // Head: title, description, canonical, OG/Twitter, hreflang
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(p.description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${p.canonical}" />`);
  html = html.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${p.ogType}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(p.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(p.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${p.canonical}" />`);
  if (p.image) html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${p.image}" />`).replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${p.image}" />`);
  else html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(p.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(p.description)}" />`);
  html = html.replace(/<link rel="alternate" hrefLang="en" href="[^"]*" \/>/, `<link rel="alternate" hrefLang="en" href="${p.canonical}" />`);
  html = html.replace(/<link rel="alternate" hrefLang="x-default" href="[^"]*" \/>/, `<link rel="alternate" hrefLang="x-default" href="${p.canonical}" />`);
  // Page JSON-LD (in addition to the sitewide Organization block)
  const ld = p.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n");
  html = html.replace("</head>", `${ld}\n</head>`);
  // Crawlable snapshot inside #root (replaced by React on boot)
  const snapshot = `<div id="root"><div data-prerender style="max-width:860px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;color:#eaeaea;background:#0a0f0a">${nav}<main>${p.body}</main><footer><p>Sofara · Dubai Real Estate Ambassadors Network · <a href="/auth">Join for free</a></p></footer></div></div>`;
  html = html.replace(/<div id="root"><\/div>/, snapshot);
  const dir = join(dist, p.path.replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  written++;
}
console.log(`[prerender] wrote ${written} static route files`);
