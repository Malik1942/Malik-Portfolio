/**
 * The site-wide metadata: the homepage's title and description, the origin
 * every canonical URL is built on, and the fallback share image.
 *
 * index.html carries the same title and description as static markup for the
 * SPA fallback shell; `src/prerender/routes.test.ts` fails if the two drift.
 * Pages set their own through `usePageMeta`, and the homepage sets these, so a
 * client-side navigation always ends on the page's own values no matter which
 * prerendered page the visit started from.
 */
export const SITE_ORIGIN = "https://www.malikzhang.com";
export const SITE_NAME = "Malik Zhang";

export const HOME_TITLE = "Malik Zhang – Product Designer | Seattle | UW MHCI+D";
export const HOME_DESCRIPTION =
  "AI-native product designer. I find the real problem, decide where AI belongs, and build it end to end. Seattle, UW MHCI+D.";

export const ABOUT_TITLE = `About | ${SITE_NAME}`;
export const ABOUT_DESCRIPTION =
  "Who I am, how I build, and what I care about: an AI-native product designer in Seattle who starts with the real problem and builds the answer end to end.";

/** The share image for every page that has no image of its own. */
export const DEFAULT_OG_IMAGE = "/og-image.png";
