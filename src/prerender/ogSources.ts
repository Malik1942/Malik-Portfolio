/**
 * Which cover each case study's share image is cut from. Built on its own
 * (`vite build --ssr src/prerender/ogSources.ts`) for
 * scripts/generate-project-og.mjs, so the covers arrive as their built URLs.
 */
import { PROJECT_DETAILS } from "@/data/projectDetails";
import { getProject } from "@/data/projects";

export interface OgSource {
  slug: string;
  /** The built cover URL, e.g. "/assets/oryne-card-poster-XoNb4aLf.webp". */
  cover: string;
  /** How the cover fills 1200×630. "cover" crops; "contain" letterboxes on `background`. */
  fit: "cover" | "contain";
  background: string;
}

/** Covers whose composition does not survive the crop to 1.91:1. */
const FIT: Record<string, Pick<OgSource, "fit" | "background">> = {
  // The wordmark sits on the top edge of a 1.58:1 frame on white.
  zeat: { fit: "contain", background: "#ffffff" },
};

export const OG_SOURCES: readonly OgSource[] = Object.values(PROJECT_DETAILS).flatMap((doc) => {
  const cover = getProject(doc.slug)?.coverImage;
  if (!cover) return [];
  return [{ slug: doc.slug, cover, fit: "cover", background: "#0a0a0a", ...FIT[doc.slug] }];
});
