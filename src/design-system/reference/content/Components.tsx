import { ComponentDoc } from "./ComponentDoc";
import { COMPONENT_DOCS } from "./componentDocs";

/**
 * Every component page follows the same six-part structure in ComponentDoc:
 * Preview, Recipe, API, Pairings, Accessibility, Testing. An id with no entry
 * renders nothing, which the content test treats as a missing page.
 */
export function ComponentContent({ sectionId }: { sectionId: string }) {
  if (!COMPONENT_DOCS[sectionId]) return null;
  return <ComponentDoc sectionId={sectionId} />;
}
