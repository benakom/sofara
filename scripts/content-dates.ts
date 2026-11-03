// Writes src/data/contentDates.json: the date each public page's content last changed, from git history.
// Used for <lastmod> in the sitemap (scripts/generate-sitemap.ts) and dateModified in BlogPosting JSON-LD.
// - Blog articles: latest commit touching the lines of that article in src/data/blogArticles.ts (git blame).
// - Other pages: latest commit touching the files that hold the page's own content (not the shared navbar/footer).
// Needs the full git history; in a shallow clone or without git the committed file is kept unchanged.
// Run it (or `npm run build`) after editing content and commit the updated JSON.
import { execFileSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { EN_GUIDES, LOCALES, PAGE_PATHS, type Locale } from "../src/i18n/locales";

const OUT = resolve("src/data/contentDates.json");
const git = (args: string[]) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();

try {
  if (git(["rev-parse", "--is-shallow-repository"]) !== "false") throw new Error("shallow clone");
} catch (err) {
  console.log(`[content-dates] skipped (${(err as Error).message.split("\n")[0]}), keeping ${existsSync(OUT) ? "committed" : "no"} contentDates.json`);
  process.exit(0);
}

const day = (unix: number) => new Date(unix * 1000).toISOString().slice(0, 10);

// ── Blog articles: max committer time over each article's line range ──
const BLOG_FILE = "src/data/blogArticles.ts";
const lineTimes: number[] = [];
let current = 0;
for (const l of git(["blame", "--line-porcelain", BLOG_FILE]).split("\n")) {
  if (l.startsWith("committer-time ")) current = Number(l.slice(15));
  else if (l.startsWith("\t")) lineTimes.push(current);
}
const lines = readFileSync(BLOG_FILE, "utf8").split("\n");
const starts: { slug: string; line: number }[] = [];
lines.forEach((l, i) => {
  const m = l.match(/^ {4}slug: "([^"]+)"/);
  if (m) starts.push({ slug: m[1], line: i });
});
const blog: Record<string, string> = {};
starts.forEach((s, i) => {
  const end = i + 1 < starts.length ? starts[i + 1].line - 2 : lines.length;
  blog[s.slug] = day(Math.max(...lineTimes.slice(Math.max(0, s.line - 1), end)));
});

// ── Pages: latest commit touching the page's content files ──
const lastCommit = (paths: string[]) => git(["log", "-1", "--format=%cs", "--", ...paths]) || undefined;
const LANDING_SECTIONS = ["src/pages/Index.tsx", "src/components/ambassador", ":(exclude)src/components/ambassador/Navbar.tsx", ":(exclude)src/components/ambassador/FooterSection.tsx"];
const PILLAR_EN = ["src/components/seo/PillarPage.tsx", "src/data/pillarFaqs.ts"];
const sources: Record<string, string[]> = {
  "/ambassador-program": ["src/pages/AmbassadorProgram.tsx"],
  "/about": ["src/pages/About.tsx"],
  "/buy-property-dubai": ["src/pages/BuyPropertyDubai.tsx"],
  "/dubai-off-plan-properties": ["src/pages/DubaiOffPlanProperties.tsx"],
  [PAGE_PATHS.invest.en]: ["src/pages/InvestDubaiRealEstate.tsx"],
  [PAGE_PATHS.ambassadors.en]: ["src/pages/DubaiRealEstateAmbassadors.tsx", ...PILLAR_EN],
  [PAGE_PATHS.referral.en]: ["src/pages/RealEstateReferralProgramDubai.tsx", ...PILLAR_EN],
  [PAGE_PATHS.agent.en]: ["src/pages/BecomeRealEstateAgentDubai.tsx", ...PILLAR_EN],
};
const pillar = (l: Locale) => ["src/pages/LocalizedPillar.tsx", `src/data/localizedPillars/${l}.ts`];
for (const l of LOCALES) {
  sources[PAGE_PATHS.home[l]] = [...LANDING_SECTIONS, l === "ar" ? "src/i18n/translations-ar.ts" : "src/i18n/translations.ts"];
  for (const key of ["ambassadors", "affiliate", "referral", "agent", "invest"] as const) sources[PAGE_PATHS[key][l]] ??= pillar(l);
}
for (const g of Object.values(EN_GUIDES)) sources[g.path] ??= pillar(g.locale);

const pages: Record<string, string> = {};
for (const [path, files] of Object.entries(sources)) {
  const d = lastCommit(files);
  if (d) pages[path] = d;
}
// The blog index changes whenever an article does.
const blogIndex = [lastCommit(["src/pages/Blog.tsx"]), ...Object.values(blog)].filter(Boolean).sort().pop();
if (blogIndex) pages["/blog"] = blogIndex;

const sorted = <T,>(o: Record<string, T>) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify({ pages: sorted(pages), blog: sorted(blog) }, null, 2) + "\n");
console.log(`[content-dates] ${Object.keys(pages).length} pages, ${Object.keys(blog).length} articles`);
