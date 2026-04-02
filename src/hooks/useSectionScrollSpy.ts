import { useEffect, useState } from "react";

/**
 * Tracks which section id is in the primary reading band (for subtle active nav).
 */
export function useSectionScrollSpy(sectionIds: string[], idPrefix = "project-section-") {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  const idsKey = sectionIds.join("|");

  useEffect(() => {
    const ids = idsKey ? idsKey.split("|") : [];
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(`${idPrefix}${id}`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const raw = visible[0].target.id;
        setActiveId(raw.startsWith(idPrefix) ? raw.slice(idPrefix.length) : raw);
      },
      { root: null, rootMargin: "-18% 0px -48% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey, idPrefix]);

  return activeId;
}
