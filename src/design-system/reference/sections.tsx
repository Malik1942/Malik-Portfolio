import type { DesignSystemSection } from "./sectionModel";
import { ComponentContent } from "./content/Components";
import { FoundationContent } from "./content/Foundations";
import { OverviewContent } from "./content/Overview";
import { PatternContent } from "./content/Patterns";

export function renderReferenceSection(section: DesignSystemSection) {
  if (section.id === "overview") return <OverviewContent />;
  if (section.id === "playground") {
    return (
      <div data-testid="reference-playground" className="max-w-[720px] rounded-lg border border-border/50 p-6">
        <p className="text-[17px] leading-[1.7] text-foreground/72 text-body">
          The live browser-local workbench arrives in the next implementation slice. It will keep experimentation public and local while publishing remains separately authenticated.
        </p>
      </div>
    );
  }
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
