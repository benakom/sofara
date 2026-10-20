// Server entry used at build time only (scripts/prerender-seo.ts): renders a public route to HTML so every
// page ships with its full content, meta tags and JSON-LD, then the client hydrates it (src/main.tsx).
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { AppProviders, AppRoutes } from "./App";

export interface RenderResult {
  html: string;
  helmet: HelmetServerState | undefined;
}

export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
      final(cb) {
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
