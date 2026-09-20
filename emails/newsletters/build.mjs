// Builds every issue in ./issues into ./dist as ready-to-send HTML (EN + FR),
// plus dist/manifest.json (subjects, sequence, day) and dist/index.html (preview).
// Run: node emails/newsletters/build.mjs
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { renderEmail } from "./template.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const issuesDir = path.join(here, "issues");
const dist = path.join(here, "dist");
await mkdir(dist, { recursive: true });

const LANGS = ["en", "fr"];
const files = (await readdir(issuesDir)).filter((f) => f.endsWith(".mjs")).sort();
const manifest = [];

for (const file of files) {
  const issue = (await import(pathToFileURL(path.join(issuesDir, file)).href)).default;
  const entry = { id: issue.id, sequence: issue.sequence, day: issue.day, subject: {}, preview: {}, files: {} };
  for (const lang of LANGS) {
    const html = renderEmail({
      lang,
      subject: issue.subject[lang],
      preview: issue.preview[lang],
      blocks: issue.blocks[lang],
    });
    const out = `${issue.id}.${lang}.html`;
    await writeFile(path.join(dist, out), html);
    entry.subject[lang] = issue.subject[lang];
    entry.preview[lang] = issue.preview[lang];
    entry.files[lang] = out;
  }
  manifest.push(entry);
}

await writeFile(path.join(dist, "manifest.json"), JSON.stringify(manifest, null, 2));

// Preview page: sequence list on the left, rendered email on the right, EN/FR toggle.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const item = (e) => {
  const when = e.sequence === "onboarding" ? `Day ${e.day}` : "Monthly";
  return `<li><button data-id="${e.id}" data-en="${esc(e.subject.en)}" data-fr="${esc(e.subject.fr)}"><span class="when">${when}</span><span class="subj">${esc(e.subject.en)}</span></button></li>`;
};
const onboarding = manifest.filter((e) => e.sequence === "onboarding");
const monthly = manifest.filter((e) => e.sequence === "monthly");
const index = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Sofara Ambassador Newsletters</title>
<style>
:root{--green:#0d3a2b;--lime:#D3F34B;--text:#1f2937;--muted:#6b7280;--line:#e5e7eb;--bg:#f7f7f5}
*{box-sizing:border-box}body{margin:0;font-family:Poppins,Inter,Arial,sans-serif;background:var(--bg);color:var(--text)}
header{display:flex;align-items:center;gap:16px;padding:14px 20px;background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:2}
header b{letter-spacing:3px;color:var(--green);font-size:18px}
header .toggle{margin-left:auto;display:flex;gap:6px}
.toggle button{border:1px solid var(--line);background:#fff;padding:6px 14px;border-radius:8px;cursor:pointer;font:inherit}
.toggle button.on{background:var(--green);color:#fff;border-color:var(--green)}
main{display:grid;grid-template-columns:340px 1fr;min-height:calc(100vh - 57px)}
nav{border-right:1px solid var(--line);background:#fff;overflow:auto;padding:12px 0}
nav h3{margin:14px 20px 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--muted)}
nav ul{list-style:none;margin:0;padding:0}
nav button{width:100%;text-align:left;border:0;background:none;padding:10px 20px;cursor:pointer;font:inherit;display:flex;flex-direction:column;gap:2px;border-left:3px solid transparent}
nav button:hover{background:#f3f4f6}nav button.on{border-left-color:var(--lime);background:#f3f4f6}
.when{font-size:11px;color:var(--muted)}.subj{font-size:13px;line-height:1.35}
iframe{width:100%;height:calc(100vh - 57px);border:0;background:#fff}
@media(max-width:800px){main{grid-template-columns:1fr}nav{max-height:40vh}iframe{height:60vh}}
</style></head><body>
<header><b>SOFARA</b><span>Ambassador newsletter series</span><div class="toggle"><button data-lang="en" class="on">EN</button><button data-lang="fr">FR</button></div></header>
<main><nav><h3>Onboarding (from signup)</h3><ul>${onboarding.map(item).join("")}</ul><h3>Monthly (all ambassadors)</h3><ul>${monthly.map(item).join("")}</ul></nav>
<iframe id="view" title="Email preview"></iframe></main>
<script>
let lang="en",id=${JSON.stringify(manifest[0].id)};
const view=document.getElementById("view");
function render(){view.src=id+"."+lang+".html";document.querySelectorAll("nav button").forEach(b=>{b.classList.toggle("on",b.dataset.id===id);b.querySelector(".subj").textContent=b.dataset[lang]});document.querySelectorAll(".toggle button").forEach(b=>b.classList.toggle("on",b.dataset.lang===lang))}
document.querySelectorAll("nav button").forEach(b=>b.addEventListener("click",()=>{id=b.dataset.id;render()}));
document.querySelectorAll(".toggle button").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;render()}));
render();
</script></body></html>`;
await writeFile(path.join(dist, "index.html"), index);
console.log(`Built ${manifest.length} issues x ${LANGS.length} languages into ${path.relative(process.cwd(), dist)}`);

// Self-contained preview (every email inlined via srcdoc) for sharing as a single file.
const standalone = index
  .replace(/<iframe id="view" title="Email preview"><\/iframe>/, '<iframe id="view" title="Email preview" srcdoc=""></iframe>')
  .replace('function render(){view.src=id+"."+lang+".html";', 'const EMAILS=' + JSON.stringify(Object.fromEntries(await Promise.all(manifest.flatMap((e) => LANGS.map(async (l) => [e.id + "." + l, (await import("node:fs/promises")).readFile(path.join(dist, e.files[l]), "utf8").then((s) => s)]))).then(async (pairs) => Promise.all(pairs.map(async ([k, v]) => [k, await v]))))) + ';function render(){view.srcdoc=EMAILS[id+"."+lang];');
await writeFile(path.join(dist, "preview-standalone.html"), standalone);
console.log("Built dist/preview-standalone.html");

// Edge-function module: every issue with its rendered HTML, imported by supabase/functions/send-newsletters.
const repoRoot = path.resolve(here, "..", "..");
const fsp = await import("node:fs/promises");
const issuesForFn = await Promise.all(
  manifest.map(async (e) => ({
    id: e.id,
    sequence: e.sequence,
    day: e.day,
    subject: e.subject,
    html: Object.fromEntries(await Promise.all(LANGS.map(async (l) => [l, await fsp.readFile(path.join(dist, e.files[l]), "utf8")]))),
  }))
);
const fnModule = `// GENERATED by emails/newsletters/build.mjs. Do not edit; edit emails/newsletters/issues/*.mjs and rebuild.
export type NewsletterLang = "en" | "fr";
export interface NewsletterIssue {
  id: string;
  sequence: "onboarding" | "monthly";
  day: number | null;
  subject: Record<NewsletterLang, string>;
  html: Record<NewsletterLang, string>;
}
export const NEWSLETTER_ISSUES: NewsletterIssue[] = ${JSON.stringify(issuesForFn, null, 2)};
`;
await fsp.mkdir(path.join(repoRoot, "supabase", "functions", "_shared"), { recursive: true });
await writeFile(path.join(repoRoot, "supabase", "functions", "_shared", "newsletters.ts"), fnModule);

// Front-end manifest (no HTML) for the admin page.
const feModule = `// GENERATED by emails/newsletters/build.mjs. Do not edit.
export type NewsletterLang = "en" | "fr";
export interface NewsletterIssueMeta {
  id: string;
  sequence: "onboarding" | "monthly";
  day: number | null;
  subject: Record<NewsletterLang, string>;
  preview: Record<NewsletterLang, string>;
  /** True when the body still contains [[placeholders]] to fill before sending. */
  template: boolean;
}
export const NEWSLETTER_ISSUES: NewsletterIssueMeta[] = ${JSON.stringify(
  issuesForFn.map((e, i) => ({ id: e.id, sequence: e.sequence, day: e.day, subject: e.subject, preview: manifest[i].preview, template: /\[\[/.test(e.html.en) })),
  null,
  2
)};
`;
await writeFile(path.join(repoRoot, "src", "data", "newsletterIssues.ts"), feModule);
console.log("Built supabase/functions/_shared/newsletters.ts and src/data/newsletterIssues.ts");

// Transactional onboarding emails (emails/transactional/*.mjs) -> _shared/transactional-emails.ts
const txDir = path.join(repoRoot, "emails", "transactional");
const txFiles = (await readdir(txDir)).filter((f) => f.endsWith(".mjs")).sort();
const tx = {};
for (const file of txFiles) {
  const issue = (await import(pathToFileURL(path.join(txDir, file)).href)).default;
  tx[issue.id] = { id: issue.id, subject: issue.subject, html: {} };
  for (const lang of LANGS) {
    const html = renderEmail({ lang, subject: issue.subject[lang], preview: issue.preview[lang], blocks: issue.blocks[lang], kind: "transactional" });
    tx[issue.id].html[lang] = html;
    await writeFile(path.join(dist, `tx-${issue.id}.${lang}.html`), html);
  }
}
const txModule = `// GENERATED by emails/newsletters/build.mjs. Do not edit; edit emails/transactional/*.mjs and rebuild.
export type TxLang = "en" | "fr";
export interface TransactionalEmail {
  id: string;
  subject: Record<TxLang, string>;
  html: Record<TxLang, string>;
}
export const TRANSACTIONAL_EMAILS: Record<string, TransactionalEmail> = ${JSON.stringify(tx, null, 2)};
`;
await writeFile(path.join(repoRoot, "supabase", "functions", "_shared", "transactional-emails.ts"), txModule);
console.log(`Built ${txFiles.length} transactional emails into supabase/functions/_shared/transactional-emails.ts`);
