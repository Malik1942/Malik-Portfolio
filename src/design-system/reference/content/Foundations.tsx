import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  X,
  type LucideIcon,
} from "lucide-react";
import { tokenBundle } from "../../generated/token-manifest.generated";
import type { TokenRecord } from "../../tokens/types";
import { TokenTable } from "../TokenTable";
import { MaterialFoundation } from "./MaterialFoundation";
import { MotionFoundation } from "./MotionFoundation";
import { TypographyFoundation } from "./TypographyFoundation";
import { Eyebrow } from "@/components/ui/Eyebrow";

const FOUNDATION_PREFIXES: Record<string, string[]> = {
  "foundation-typography": ["font."],
  "foundation-form": ["rhythm.", "layout.", "measure.", "radius.", "layer."],
  "foundation-material": [
    "color.",
    "component.siteHeader.scrimColor",
    "component.projectCard.",
    "component.caseStudyModule.",
    "component.lightbox.backdrop",
  ],
  "foundation-motion": ["duration.", "ease."],
};

// Sub-tables on the Form page: the dimensional decisions the interface repeats.
const FORM_SECTIONS: readonly { title: string; intro: string; prefixes: string[] }[] = [
  {
    title: "Layout",
    intro:
      "Named widths bound content, the page, long-form reading, and the reference column, and the touch target sets the minimum interactive size. Local composition inside a component uses Tailwind's 4px spacing scale directly; it is a utility, not a token, and the boundary test rejects the steps the scale skips.",
    prefixes: ["layout."],
  },
  {
    title: "Rhythm",
    intro:
      "The four vertical distances the pages repeat, each a compact value that steps up at md: section between page sections, module between blocks in a case-study section, stack between the parts of a module, caption between a figure and its line. One utility carries both values (mt-section, gap-stack), so a pair cannot drift apart at a call site.",
    prefixes: ["rhythm."],
  },
  {
    title: "Measure",
    intro:
      "Line length in characters, not pixels, so it follows the type size. Narrow for statements, body for prose, wide for reference copy that sits beside tables. Utilities: max-w-measure-narrow, max-w-measure, max-w-measure-wide.",
    prefixes: ["measure."],
  },
  {
    title: "Stacking",
    intro:
      "The global stacking order as named layers: header, guide (above the header so its taps win while the header re-reveals), overlay, and modal. Bare z-index numbers are reserved for ordering inside a component's own stacking context.",
    prefixes: ["layer."],
  },
  {
    title: "Radius",
    intro:
      "Shape is restrained: small controls, standard cards, larger media and modules, and fully rounded pills and chips.",
    prefixes: ["radius."],
  },
];

function tokensForPrefixes(prefixes: string[]): TokenRecord[] {
  return tokenBundle.tokens
    .filter((token) => prefixes.some((prefix) => token.path.startsWith(prefix)))
    .slice()
    .sort((left, right) => left.path.localeCompare(right.path));
}

// This named query is intentionally exported beside the renderer so focused tests
// can verify that reference families stay derived from canonical manifest paths.
// eslint-disable-next-line react-refresh/only-export-components
export function getFoundationTokens(sectionId: string): TokenRecord[] {
  return tokensForPrefixes(FOUNDATION_PREFIXES[sectionId] ?? []);
}

function FormFoundation() {
  return (
    <div data-testid="reference-foundation-form" className="space-y-12 md:space-y-16">
      <div className="max-w-reading space-y-4">
        <p className="text-base leading-relaxed text-foreground-secondary md:text-xl">
          Form is shape and structure: how much room a thing takes, how wide a
          line runs, how soft a corner is. Type has its own page; everything
          else dimensional lives here.
        </p>
        <p className="text-sm leading-relaxed text-foreground-tertiary">
          Every value below is read from the generated production manifest, so
          this reference never duplicates the canonical source. There is no
          spacing scale here on purpose: the four rhythms below are the
          vertical distances the pages repeat, and everything smaller is
          composition.
        </p>
      </div>
      {FORM_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-5">
          <div className="max-w-reading space-y-2">
            <Eyebrow as="h2" tone="secondary">{section.title}</Eyebrow>
            <p className="text-sm leading-relaxed text-foreground-tertiary">{section.intro}</p>
          </div>
          <TokenTable title={`${section.title} tokens`} tokens={tokensForPrefixes(section.prefixes)} />
        </section>
      ))}
    </div>
  );
}

const ICONS: readonly { icon: LucideIcon; name: string; usage: string }[] = [
  { icon: ArrowLeft, name: "ArrowLeft", usage: "Back to work" },
  { icon: ArrowUpRight, name: "ArrowUpRight", usage: "External link" },
  { icon: ChevronLeft, name: "ChevronLeft", usage: "Lightbox previous" },
  { icon: ChevronRight, name: "ChevronRight", usage: "Lightbox next" },
  { icon: X, name: "X", usage: "Dismiss / close" },
  { icon: Check, name: "Check", usage: "Strength marker" },
  { icon: Minus, name: "Minus", usage: "Gap / neutral marker" },
];

function IconsFoundation() {
  return (
    <div data-testid="reference-foundation-icons" className="space-y-10 md:space-y-12">
      <p className="max-w-reading text-base leading-relaxed text-foreground-secondary md:text-xl">
        Icons come from lucide-react drawn at a consistent stroke, kept to a small
        functional set: navigation, dismissal, and the strength / gap markers used
        in case-study comparisons. They inherit the current text color and size to
        the surrounding label rather than carrying their own palette.
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ICONS.map(({ icon: Icon, name, usage }) => (
          <li
            key={name}
            data-testid={`icon-${name}`}
            className="flex flex-col items-start gap-3 rounded-lg border border-hairline bg-surface-card/40 p-4"
          >
            <Icon className="h-5 w-5 text-foreground" strokeWidth={1.75} aria-hidden="true" />
            <div className="min-w-0">
              <code className="block truncate text-sm text-foreground font-mono">{name}</code>
              <Eyebrow className="mt-0.5">{usage}</Eyebrow>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FoundationContent({ sectionId }: { sectionId: string }) {
  if (sectionId === "foundation-typography") return <TypographyFoundation />;
  if (sectionId === "foundation-form") return <FormFoundation />;
  if (sectionId === "foundation-material") return <MaterialFoundation />;
  if (sectionId === "foundation-motion") return <MotionFoundation />;
  if (sectionId === "foundation-icons") return <IconsFoundation />;
  return null;
}
