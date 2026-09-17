/**
 * Every route the build prerenders, with the metadata each page is stamped
 * with. This list is also the sitemap. Only the build-time render imports it
 * (it pulls page modules in for their titles); the client reads the smaller
 * `src/lib/siteMeta.ts` and `src/lib/projectMeta.ts` instead.
 */
import { PROJECT_DETAILS } from "@/data/projectDetails";
import { RESUME_DESCRIPTION } from "@/data/resume";
import {
  DESIGN_SYSTEM_DESCRIPTION,
  DESIGN_SYSTEM_TITLE,
} from "@/design-system/reference/useDesignSystemMetadata";
import { projectOgImage, projectPageDescription, projectPageTitle } from "@/lib/projectMeta";
import { ABOUT_DESCRIPTION, ABOUT_TITLE, HOME_DESCRIPTION, HOME_TITLE } from "@/lib/siteMeta";
import {
  PAGE_DESCRIPTION as ORYNE_PRIVACY_DESCRIPTION,
  PAGE_TITLE as ORYNE_PRIVACY_TITLE,
} from "@/pages/OrynePrivacy";
import {
  PAGE_DESCRIPTION as ORYNE_SUPPORT_DESCRIPTION,
  PAGE_TITLE as ORYNE_SUPPORT_TITLE,
} from "@/pages/OryneSupport";
import { RESUME_PAGE_TITLE } from "@/pages/Resume";
import { STUDIO_HEADLINE, STUDIO_PAGE_TITLE } from "@/pages/Studio";
import type { RouteMeta } from "./html";

const projectRoutes: RouteMeta[] = Object.values(PROJECT_DETAILS).map((doc) => ({
  path: `/project/${doc.slug}`,
  title: projectPageTitle(doc.title),
  description: projectPageDescription(doc.slug),
  image: projectOgImage(doc.slug),
}));

export const ROUTES: readonly RouteMeta[] = [
  { path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
  { path: "/about", title: ABOUT_TITLE, description: ABOUT_DESCRIPTION },
  // A deep link into About, not a page of its own.
  {
    path: "/about/connect",
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    canonical: "/about",
    sitemap: false,
  },
  { path: "/resume", title: RESUME_PAGE_TITLE, description: RESUME_DESCRIPTION },
  { path: "/studio", title: STUDIO_PAGE_TITLE, description: STUDIO_HEADLINE },
  { path: "/design-system", title: DESIGN_SYSTEM_TITLE, description: DESIGN_SYSTEM_DESCRIPTION },
  ...projectRoutes,
  { path: "/oryne/support", title: ORYNE_SUPPORT_TITLE, description: ORYNE_SUPPORT_DESCRIPTION },
  { path: "/oryne/privacy", title: ORYNE_PRIVACY_TITLE, description: ORYNE_PRIVACY_DESCRIPTION },
];
