import { prefersReducedMotion } from "./prefersReducedMotion";

/** The DOM id a case-study section carries. Written by ProjectDetailTemplate,
 *  read by the section guide and the scroll spy — so it is spelled once here. */
export const sectionDomId = (sectionId: string) => `project-section-${sectionId}`;

export function scrollToProjectSection(sectionId: string) {
  const el = document.getElementById(sectionDomId(sectionId));
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "start" });
}
