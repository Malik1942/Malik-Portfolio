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
import { ColorFoundation } from "./ColorFoundation";
import { TypographyFoundation } from "./TypographyFoundation";

const FOUNDATION_PREFIXES: Record<string, string[]> = {
  "foundation-typography": ["font."],
  "foundation-color": [
    "color.",
    "component.siteHeader.scrimColor",
    "component.projectCard.",
    "component.caseStudyModule.",
    "component.lightbox.backdrop",
    "component.projectSection.flash",
  ],
  "foundation-tokens": ["space.", "layout.", "radius.", "color.border.", "duration.", "ease."],
};

// Sub-tables shown on the merged Tokens page (spacing, radius, and motion in one place).
const TOKEN_SECTIONS: readonly { title: string; intro: string; prefixes: string[] }[] = [
  {
    title: "Spacing & layout",
    intro:
      "An eight-step spacing rhythm supports local composition. Named layout measures define readable content, page boundaries, and minimum interaction size.",
    prefixes: ["space.", "layout."],
  },
  {
    title: "Radius & borders",
    intro:
      "Shape is restrained: small controls, standard cards, larger media, and fully rounded affordances. Border color remains a semantic separation role.",
    prefixes: ["radius.", "color.border."],
  },
  {
    title: "Motion",
    intro:
      "Durations describe pace and cubic Bézier roles describe intent. Reduced-motion preference remains authoritative over every decorative transition.",
    prefixes: ["duration.", "ease."],
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

function TokensFoundation() {
  return (
    <div data-testid="reference-foundation-tokens" className="space-y-12 md:space-y-16">
      <p className="max-w-reading text-base leading-relaxed text-foreground/72 md:text-xl">
        Spacing, radius, and motion share one page: the quiet dimensional and
        temporal decisions the interface repeats. Every value below is read from
        the generated production manifest, so this reference never duplicates the
        canonical source.
      </p>
      {TOKEN_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-5">
          <div className="max-w-reading space-y-2">
            <h2 className="text-label uppercase tracking-eyebrow text-foreground/72">{section.title}</h2>
            <p className="text-sm leading-relaxed text-foreground/55">{section.intro}</p>
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
      <p className="max-w-reading text-base leading-relaxed text-foreground/72 md:text-xl">
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
            className="flex flex-col items-start gap-3 rounded-lg border border-border/50 bg-surface-card/40 p-4"
          >
            <Icon className="h-5 w-5 text-foreground" strokeWidth={1.75} aria-hidden="true" />
            <div className="min-w-0">
              <code className="block truncate text-sm text-foreground font-mono">{name}</code>
              <p className="mt-0.5 text-label uppercase tracking-eyebrow text-foreground/55">{usage}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FoundationContent({ sectionId }: { sectionId: string }) {
  if (sectionId === "foundation-color") return <ColorFoundation />;
  if (sectionId === "foundation-typography") return <TypographyFoundation />;
  if (sectionId === "foundation-tokens") return <TokensFoundation />;
  if (sectionId === "foundation-icons") return <IconsFoundation />;
  return null;
}
