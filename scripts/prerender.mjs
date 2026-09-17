/**
 * Prerenders every route in src/prerender/routes.ts into dist/ as static HTML.
 *
 * Runs as the last step of `npm run build`, after the client build (dist/) and
 * the SSR build (dist-ssr/, from src/prerender/entry.tsx):
 *   1. dist/index.html, the client shell, is kept verbatim as dist/spa.html —
 *      the fallback vercel.json rewrites unknown paths to.
 *   2. Each route is rendered to markup, stamped with its own title,
 *      description, canonical and share tags, and written to
 *      dist/<path>/index.html (the homepage overwrites dist/index.html).
 *   3. dist/sitemap.xml is written from the same list.
 *
 * A route whose share image is missing from public/og/ falls back to the
 * site-wide one with a warning: run `npm run generate:og:projects`.
 */
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The SSR bundle leaves React's server renderer external, so the process
// environment picks its build: production is quieter and faster.
process.env.NODE_ENV ??= "production";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const DIST_SSR = join(ROOT, "dist-ssr");

const exists = (path) => access(path).then(() => true, () => false);

async function main() {
  const entry = await import(join(DIST_SSR, "entry.js"));
  const { ROUTES, render, applyRouteMeta, injectApp, neutralizeMedia, renderSitemap, routeToFile } = entry;

  const shellPath = join(DIST, "index.html");
  if (!(await exists(shellPath))) {
    throw new Error("dist/index.html is missing: run `vite build` before the prerender");
  }
  const shell = await readFile(shellPath, "utf8");
  await writeFile(join(DIST, "spa.html"), shell);

  for (const route of ROUTES) {
    const page = { ...route };
    if (page.image && !(await exists(join(DIST, page.image)))) {
      console.warn(`  ! ${route.path}: ${page.image} not found, using the site-wide share image`);
      delete page.image;
    }
    const appHtml = neutralizeMedia(await render(route.path));
    const html = injectApp(applyRouteMeta(shell, page), appHtml);
    const file = join(DIST, routeToFile(route.path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    console.log(`  ${route.path.padEnd(22)} → ${routeToFile(route.path)} (${(html.length / 1024).toFixed(0)} kB)`);
  }

  await writeFile(join(DIST, "sitemap.xml"), renderSitemap(ROUTES));
  console.log(`  sitemap.xml: ${ROUTES.filter((r) => r.sitemap !== false).length} URLs`);

  await rm(DIST_SSR, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
