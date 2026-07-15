import type { DesignSystemSection } from "./sectionModel";

export function renderBaselineSection(section: DesignSystemSection) {
  return (
    <p className="max-w-[720px] text-[17px] leading-[1.7] text-foreground/72 text-body md:text-[19px]">
      {section.description}
    </p>
  );
}
