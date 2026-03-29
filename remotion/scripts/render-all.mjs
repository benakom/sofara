import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const courses = Array.from({ length: 16 }, (_, i) => `course-${String(i + 1).padStart(2, "0")}`);

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

for (const id of courses) {
  const outputFile = `/mnt/documents/${id}.mp4`;
  try {
    console.log(`\n▶ Rendering ${id}...`);
    const composition = await selectComposition({
      serveUrl: bundled,
      id,
      puppeteerInstance: browser,
    });

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputFile,
      puppeteerInstance: browser,
      muted: true,
      concurrency: 1,
    });
    console.log(`✅ ${id} → ${outputFile}`);
  } catch (e) {
    console.error(`❌ ${id} failed:`, e.message);
  }
}

await browser.close({ silent: false });
console.log("\n🎉 All done!");
