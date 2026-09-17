import { getProject } from "@/data/projects";
import { SITE_NAME } from "@/lib/siteMeta";

/** The document title of a case study, in the tab and in a shared preview. */
export const projectPageTitle = (title: string) => `${title} | ${SITE_NAME}`;

/** The case study's description is the card's: the same sentence a visitor
 *  reads before clicking through is what a search result or preview shows. */
export const projectPageDescription = (slug: string) =>
  getProject(slug)?.description ?? "";

/** Each case study's own share image, generated from its cover by
 *  `npm run generate:og:projects` into public/og/. */
export const projectOgImage = (slug: string) => `/og/${slug}.jpg`;
