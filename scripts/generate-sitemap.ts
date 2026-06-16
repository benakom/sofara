// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { blogArticles } from "../src/data/blogArticles";

const BASE_URL = "https://sofara.io";
const today = new Date().toISOString().slice(0, 10);

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/ambassador-program", changefreq: "weekly", priority: "0.95" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/invest-dubai-real-estate", changefreq: "weekly", priority: "0.9" },
  { path: "/buy-property-dubai", changefreq: "weekly", priority: "0.9" },
  { path: "/dubai-off-plan-properties", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.85" },
  { path: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/cookies", changefreq: "yearly", priority: "0.3" },
];

const blogEntries: Entry[] = blogArticles.map((a: { slug: string }) => ({
  path: `/blog/${a.slug}`,
  changefreq: "monthly",
  priority: "0.75",
}));

const entries: Entry[] = [...staticEntries, ...blogEntries].map((e) => ({
  lastmod: today,
  ...e,
}));

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
