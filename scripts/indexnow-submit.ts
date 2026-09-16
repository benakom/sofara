/**
 * Submits every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver share the index).
 * Usage: bunx tsx scripts/indexnow-submit.ts
 * The key file public/<key>.txt must be reachable at https://sofara.io/<key>.txt
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const host = "sofara.io";
const keyFile = readdirSync(join(process.cwd(), "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = keyFile.replace(".txt", "");

async function main() {
  const res = await fetch(`https://${host}/sitemap.xml`);
  const xml = await res.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const body = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList };
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: ${r.status} ${r.statusText} for ${urlList.length} URLs`);
}
main();
