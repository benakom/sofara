// Server entry used at build time only (scripts/prerender-seo.ts): renders a public route to HTML so every
// page ships with its full content, meta tags and JSON-LD, then the client hydrates it (src/main.tsx).
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import "./i18n/allTranslations";
import { AppProviders, AppRoutes } from "./App";

export interface RenderResult {
  html: string;
  helmet: HelmetServerState | undefined;
}

export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
      final(cb) {
        // Decode once (a multi-byte character can straddle two chunks) and drop the NUL padding React 18's stream
        // writer leaves when a multi-byte character does not fit at the end of its 2 KB buffer.
        const html = Buffer.concat(chunks).toString("utf8").replace(/\0/g, "");
        resolve({ html, helmet: helmetContext.helmet });
        cb();
      },
    });
    const stream = renderToPipeableStream(
      <AppProviders initialPath={url} helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError: reject,
        onError(err) {
          console.error(`[ssr] ${url}:`, err);
        },
      },
    );
    setTimeout(() => {
      stream.abort();
      reject(new Error(`[ssr] timeout rendering ${url}`));
    }, 20000).unref();
  });
}
