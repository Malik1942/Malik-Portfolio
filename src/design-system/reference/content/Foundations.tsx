import { tokenBundle } from "../../generated/token-manifest.generated";
import type { TokenRecord } from "../../tokens/types";
import { TokenTable } from "../TokenTable";
import { ColorFoundation } from "./ColorFoundation";
import { TypographyFoundation } from "./TypographyFoundation";

const FOUNDATION_CONFIG: Record<string, { intro: string; prefixes: string[]; title: string }> = {
  "foundation-color": {
    title: "Production color tokens",
    intro: "Warm foregrounds and deep neutral surfaces carry the portfolio, while Selected Work, Workshop, and destructive red retain separate semantic roles.",
    prefixes: ["color.", "component.siteHeader.scrimColor", "component.projectCard.", "component.caseStudyModule.", "component.lightbox.backdrop", "component.projectSection.flash"],
  },
  "foundation-typography": {
    title: "Typography tokens",
    intro: "General Sans handles display and body reading; JetBrains Mono marks technical metadata. The scale stays deliberately compact outside editorial headings.",
    prefixes: ["font."],
  },
  "foundation-spacing": {
    title: "Spacing and layout tokens",
    intro: "An eight-step spacing rhythm supports local composition. Named layout measures define readable content, page boundaries, and minimum interaction size.",
    prefixes: ["space.", "layout."],
  },
  "foundation-radius": {
    title: "Radius and border tokens",
    intro: "Shape is restrained: small controls, standard cards, larger media, and fully rounded affordances. Border color remains a semantic separation role.",
    prefixes: ["radius.", "color.border."],
  },
  "foundation-motion": {
    title: "Motion tokens",
    intro: "Durations describe pace and cubic Bézier roles describe intent. Reduced-motion preference remains authoritative over every decorative transition.",
    prefixes: ["duration.", "ease."],
  },
};

// This named query is intentionally exported beside the renderer so focused tests
// can verify that reference families stay derived from canonical manifest paths.
// eslint-disable-next-line react-refresh/only-export-components
export function getFoundationTokens(sectionId: string): TokenRecord[] {
  const prefixes = FOUNDATION_CONFIG[sectionId]?.prefixes ?? [];
  return tokenBundle.tokens
    .filter((token) => prefixes.some((prefix) => token.path.startsWith(prefix)))
    .slice()
    .sort((left, right) => left.path.localeCompare(right.path));
}

export function FoundationContent({ sectionId }: { sectionId: string }) {
  if (sectionId === "foundation-color") return <ColorFoundation />;
  if (sectionId === "foundation-typography") return <TypographyFoundation />;

  const config = FOUNDATION_CONFIG[sectionId];
  if (!config) return null;

  return (
    <div data-testid={`reference-${sectionId}`} className="space-y-10 md:space-y-12">
      <div className="max-w-[720px] space-y-4">
        <p className="text-[17px] leading-[1.7] text-foreground/72 text-body md:text-[19px]">{config.intro}</p>
        <p className="text-sm leading-relaxed text-foreground/52 text-body">Every value below is read from the generated production manifest. Canonical JSON remains the editable source; this reference does not duplicate token values.</p>
      </div>
      <TokenTable title={config.title} tokens={getFoundationTokens(sectionId)} />
    </div>
  );
}
