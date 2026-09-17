/**
 * Pure helpers for the build-time prerender (scripts/prerender.mjs): stamp a
 * route's metadata into the built index.html shell, drop the rendered app
 * markup into #root, and write the sitemap from the same route list.
 */
import { DEFAULT_OG_IMAGE, SITE_ORIGIN } from "@/lib/siteMeta";

export interface RouteMeta {
  /** The URL path, e.g. "/project/oryne". */
  path: string;
  /** Document title. Omitted: the shell's own (the homepage's). */
  title?: string;
  /** Meta description. Omitted: the shell's own (the homepage's). */
  description?: string;
  /** Canonical path when it is not this route's own path (a deep link). */
  canonical?: string;
  /** Share image path. Omitted: the site-wide one. */
  image?: string;
  /** Left out of the sitemap when false. */
  sitemap?: boolean;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace exactly one match, or throw: a shell that has lost a tag (or grown a
 *  second) must fail the build, not ship a page with the homepage's metadata. */
function replaceOne(
  html: string,
  pattern: RegExp,
  replacement: string | ((match: string) => string),
  what: string,
): string {
  // Count with a global copy: a non-global match returns the capture groups.
  const count = (html.match(new RegExp(pattern.source, "g")) ?? []).length;
  if (count !== 1) {
    throw new Error(`Expected exactly one ${what} in the shell, found ${count}`);
  }
  return html.replace(pattern, replacement as string);
}

const metaContent = (attr: "name" | "property", key: string) =>
  new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);

const setMeta = (html: string, attr: "name" | "property", key: string, value: string) =>
  replaceOne(html, metaContent(attr, key), `$1${escapeHtml(value)}$2`, `${key} meta`);

/** The absolute URL a route is canonical at. */
export const canonicalUrl = (route: RouteMeta) => `${SITE_ORIGIN}${route.canonical ?? route.path}`;

/** The absolute share-image URL for a route. */
export const imageUrl = (route: RouteMeta) => `${SITE_ORIGIN}${route.image ?? DEFAULT_OG_IMAGE}`;

/** Stamp one route's title, description, canonical and share tags into the shell. */
export function applyRouteMeta(shell: string, route: RouteMeta): string {
  let html = shell;
  if (route.title) {
    html = replaceOne(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`, "<title>");
    html = setMeta(html, "property", "og:title", route.title);
    html = setMeta(html, "name", "twitter:title", route.title);
  }
  if (route.description) {
    html = setMeta(html, "name", "description", route.description);
    html = setMeta(html, "property", "og:description", route.description);
    html = setMeta(html, "name", "twitter:description", route.description);
  }
  const canonical = canonicalUrl(route);
  html = replaceOne(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${escapeHtml(canonical)}$2`,
    "canonical link",
  );
  html = setMeta(html, "property", "og:url", canonical);
  const image = imageUrl(route);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "name", "twitter:image", image);
  return html;
}

/** Put the rendered app inside the (empty) root the client mounts into. */
export function injectApp(shell: string, appHtml: string): string {
  return replaceOne(shell, /<div id="root"><\/div>/, () => `<div id="root">${appHtml}</div>`, "#root");
}

/**
 * The prerendered markup exists for readers without JavaScript. In a browser
 * it is on screen for a moment behind the loading screen, then React replaces
 * it. A <video> in that markup would start downloading on parse, and the
 * element React mounts a moment later requests the same file again, so the
 * reels lose their src and autoplay here: the poster (an image the browser
 * dedupes) and the accessible label stay.
 */
export function neutralizeMedia(appHtml: string): string {
  return appHtml
    .replace(/<video\b[^>]*>/g, (tag) =>
      tag
        .replace(/\s(?:src|autoplay|preload)(?:="[^"]*")?(?=[\s/>])/g, "")
        .replace(/^<video/, '<video preload="none"'),
    )
    .replace(/<source\b[^>]*>/g, "");
}

/** Where a route's page lives under dist/: "/" → index.html, "/a/b" → a/b/index.html. */
export function routeToFile(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed ? `${trimmed}/index.html` : "index.html";
}

export function renderSitemap(routes: readonly RouteMeta[]): string {
  const entries = routes
    .filter((route) => route.sitemap !== false)
    .map((route) => `  <url>\n    <loc>${escapeHtml(canonicalUrl(route))}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}
