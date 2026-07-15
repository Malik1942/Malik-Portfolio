import type { DesignSystemSection } from "./sectionModel";
import { ComponentLineup } from "./content/ComponentLineup";
import { ComponentContent } from "./content/Components";
import { FoundationContent } from "./content/Foundations";
import { OverviewContent } from "./content/Overview";
import { PatternContent } from "./content/Patterns";
import { Playground } from "./content/Playground";

export function renderReferenceSection(section: DesignSystemSection) {
  if (section.id === "overview") return <OverviewContent />;
  if (section.id === "playground") return <Playground />;
  if (section.id === "component-lineup") return <ComponentLineup />;
  if (section.id.startsWith("foundation-")) return <FoundationContent sectionId={section.id} />;
  if (section.id.startsWith("component-")) return <ComponentContent sectionId={section.id} />;
  if (section.id.startsWith("pattern-")) return <PatternContent sectionId={section.id} />;
  return (
    <p className="max-w-[720px] text-[17px] leading-[1.7] text-foreground/72 text-body md:text-[19px]">
      {section.description}
    </p>
  );
}

export const renderBaselineSection = renderReferenceSection;
