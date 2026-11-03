// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Localized pages list every language version with xhtml:link hreflang alternates.
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { blogArticles } from "../src/data/blogArticles";
import { EN_GUIDES, LOCALES, PAGE_PATHS, SITE_URL, type PageKey } from "../src/i18n/locales";

// <lastmod> is the date the page's content last changed (src/data/contentDates.json, from git history via
// scripts/content-dates.ts), never the build date: a lastmod that moves on every build is ignored by search engines.
const dates = JSON.parse(readFileSync(resolve("src/data/contentDates.json"), "utf8")) as {
  pages: Record<string, string>;
  blog: Record<string, string>;
};
const lastmodOf = (path: string) => {
  const slug = path.startsWith("/blog/") ? path.slice(6) : undefined;
  const article = slug ? (blogArticles as { slug: string; date: string }[]).find((a) => a.slug === slug) : undefined;
  return (slug ? dates.blog[slug] : dates.pages[path]) ?? article?.date;
};

interface Entry {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
  alternates?: Record<string, string>;
}

const url = (p: string) => `${SITE_URL}${p}`;
const entries: Entry[] = [];

// Pages available in EN / FR / ES / RU / AR
const localized: { key: PageKey; priority: string }[] = [
  { key: "home", priority: "1.0" },
  { key: "ambassadors", priority: "0.95" },
  { key: "affiliate", priority: "0.95" },
  { key: "referral", priority: "0.95" },
  { key: "agent", priority: "0.9" },
  { key: "invest", priority: "0.9" },
];
for (const { key, priority } of localized) {
  const alternates: Record<string, string> = {};
  for (const l of LOCALES) alternates[l] = url(PAGE_PATHS[key][l]);
  alternates["x-default"] = url(PAGE_PATHS[key].en);
  for (const l of LOCALES) entries.push({ path: PAGE_PATHS[key][l], changefreq: "weekly", priority, alternates });
}

// English-only pages
const englishOnly: Omit<Entry, "alternates">[] = [
  ...Object.values(EN_GUIDES).map((g) => ({ path: g.path, changefreq: "weekly" as const, priority: "0.9" })),
  { path: "/ambassador-program", changefreq: "weekly", priority: "0.95" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/buy-property-dubai", changefreq: "weekly", priority: "0.8" },
  { path: "/dubai-off-plan-properties", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  // /legal/* pages are noindex (src/pages/Legal.tsx) and stay out of the sitemap.
];
entries.push(...englishOnly);
for (const a of blogArticles as { slug: string }[]) entries.push({ path: `/blog/${a.slug}`, changefreq: "monthly", priority: "0.7" });

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${url(e.path)}</loc>`,
      ...(e.alternates
        ? Object.entries(e.alternates).map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`)
        : []),
      ...(lastmodOf(e.path) ? [`    <lastmod>${lastmodOf(e.path)}</lastmod>`] : []),
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      `  </url>`,
    ].join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml + "\n");
console.log(`sitemap.xml written (${entries.length} entries)`);
