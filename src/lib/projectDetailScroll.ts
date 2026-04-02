const SECTION_PREFIX = "project-section-";

export function scrollToProjectSection(sectionId: string) {
  const el = document.getElementById(`${SECTION_PREFIX}${sectionId}`);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
