/* eslint-disable react-refresh/only-export-components -- a Node entry, never hot-reloaded */
/**
 * The build-time render. `vite build --ssr src/prerender/entry.tsx` bundles
 * this for Node, and scripts/prerender.mjs calls `render` once per route to
 * write a static HTML page for readers that do not run JavaScript (recruiting
 * tools, link previews, AI assistants). The client does not hydrate: main.tsx
 * mounts React over the markup as it always has, behind the loading screen.
 */
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppFrame } from "../App";

export { ROUTES } from "./routes";
export {
  applyRouteMeta,
  injectApp,
  neutralizeMedia,
  renderSitemap,
  routeToFile,
  type RouteMeta,
} from "./html";
export { DEFAULT_OG_IMAGE, SITE_ORIGIN } from "@/lib/siteMeta";

/** Render one route to a complete HTML string, waiting for every lazy page
 *  chunk so no Suspense fallback ends up in the markup. */
export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
      final(callback) {
        callback();
        resolve(html);
      },
    });
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <AppFrame />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(error) {
          reject(error);
        },
      },
    );
  });
}
