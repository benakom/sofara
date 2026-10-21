// Post-build static site generation for the public pages.
// 1. `vite build --ssr src/entry-server.tsx` (run just before this script) produces dist-ssr/entry-server.js.
// 2. This script renders every public route with React on the server and writes dist/<route>/index.html
//    with the real page content, <html lang>, title, meta, canonical, hreflang and JSON-LD.
// 3. The client hydrates those pages (src/main.tsx). App routes keep using the SPA fallback.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import { pathToFileURL } from "url";
import Beasties from "beasties";
import { SEO_CONFIG } from "../src/config/seo";
import { blogArticles } from "../src/data/blogArticles";
import { EN_GUIDES, PAGE_PATHS, LOCALES } from "../src/i18n/locales";

const dist = resolve(process.cwd(), "dist");
const indexPath = join(dist, "index.html");
const serverEntry = resolve(process.cwd(), "dist-ssr/entry-server.js");
if (!existsSync(indexPath) || !existsSync(serverEntry)) {
  console.log("[prerender] dist/index.html or dist-ssr/entry-server.js missing, skipping");
  process.exit(0);
}

// dist/spa.html keeps the untouched SPA shell (also usable as a fallback / 404 page by other hosts);
// reading from it makes the script safe to re-run on an already prerendered dist/.
const shellPath = join(dist, "spa.html");
if (!existsSync(shellPath)) writeFileSync(shellPath, readFileSync(indexPath, "utf8"));
let template = readFileSync(shellPath, "utf8");

// Critical CSS: each prerendered page inlines only the rules its own HTML uses (Beasties); the full stylesheet
// still loads without blocking paint, for elements rendered later (mobile menu, chat, accordions, app routes).
const beasties = new Beasties({
  path: dist,
  publicPath: "/",
  preload: "swap",
  pruneSource: false,
  inlineFonts: true,
  preloadFonts: false,
  keyframes: "critical",
  logLevel: "error",
});
// Prerendered pages are readable before any JavaScript runs: hydration code is fetched at low priority
// so it never competes with the HTML, fonts and above-the-fold paint.
template = template
  .replace(/<script type="module" crossorigin/g, '<script type="module" fetchpriority="low" crossorigin')
  .replace(/<link rel="modulepreload" crossorigin/g, '<link rel="modulepreload" fetchpriority="low" crossorigin');

const routes = new Set<string>();
for (const p of Object.keys(SEO_CONFIG)) routes.add(p);
for (const key of Object.keys(PAGE_PATHS) as (keyof typeof PAGE_PATHS)[]) for (const l of LOCALES) routes.add(PAGE_PATHS[key][l]);
for (const g of Object.values(EN_GUIDES)) routes.add(g.path);
for (const a of blogArticles) routes.add(`/blog/${a.slug}`);
for (const s of ["privacy", "terms", "cookies"]) routes.add(`/legal/${s}`);

// Removes the template's default SEO tags; the page's own tags come from react-helmet-async.
const stripDefaultSeo = (html: string) =>
  html
    .replace(/<title>[^<]*<\/title>\s*/, "")
    .replace(/<meta name="description"[^>]*>\s*/, "")
    .replace(/<meta name="robots"[^>]*>\s*/, "");

// If this file is served for another URL (SPA fallback), drop the prerendered markup before first paint.
const guard = `<script>(function(){var r=document.getElementById("root"),p=location.pathname.replace(/\\/+$/,"")||"/";if(r&&r.getAttribute("data-ssr")!==p){r.removeAttribute("data-ssr");r.innerHTML="";}})();</script>`;

const { render } = await import(pathToFileURL(serverEntry).href);

let written = 0;
let failed = 0;
for (const route of routes) {
  try {
    const { html: body, helmet } = await render(route);
    if (!body || !body.includes("<h1")) throw new Error("render has no <h1> (page missing or not found)");
    const head = helmet
      ? [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()].join("\n")
      : "";
    const htmlAttrs = (helmet?.htmlAttributes.toComponent() ?? {}) as { lang?: string; dir?: string };
    const lang = htmlAttrs.lang || "en";
    const dir = htmlAttrs.dir === "rtl" ? ' dir="rtl"' : "";
    let html = stripDefaultSeo(template);
    html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"${dir}`);
    // Font preloads declared by the page (e.g. the Arabic font on /ar) go first, ahead of the inlined CSS.
    const preloads = head.match(/<link[^>]*rel="preload"[^>]*>/g) ?? [];
    html = html.replace("</head>", `${preloads.reduce((h, l) => h.replace(l, ""), head)}\n</head>`);
    if (preloads.length) html = html.replace(/(<meta charset="[^"]*" \/>)/, `$1\n    ${preloads.join("\n    ")}`);
    html = html.replace('<div id="root"></div>', `<div id="root" data-ssr="${route}">${body}</div>${guard}`);
    const file = route === "/" ? indexPath : join(dist, route.replace(/^\//, ""), "index.html");
    mkdirSync(resolve(file, ".."), { recursive: true });
    html = await beasties.process(html);
    writeFileSync(file, html);
    written++;
  } catch (err) {
    failed++;
    console.error(`[prerender] ${route} failed:`, (err as Error).message);
  }
}
console.log(`[prerender] wrote ${written} prerendered pages${failed ? `, ${failed} failed` : ""}`);
process.exit(0);
