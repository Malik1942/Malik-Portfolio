import type { MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectLink } from "@/data/projects";
import { defineRecipe } from "@/design-system/system/recipe";

/**
 * Chips are small rounded labels that sit in a metadata line.
 *
 * Two kinds of form: `label` is the uppercase eyebrow chip (skills, "Coming
 * soon"); `text` is a sentence-case chip for short phrases inside a case-study
 * module. Four materials: `passive` is low-contrast and inert; `lead` is the
 * same shape a tier brighter; `link` carries a filled surface and stronger ink
 * so it reads as clickable at a glance (LinkChip); `toggle` rests as passive
 * and lifts on hover, then takes the link material while pressed (ChipButton,
 * the skill lens control).
 */
export const chipRecipe = defineRecipe({
  base: {
    form: "inline-flex items-center rounded-full whitespace-nowrap",
    material: "border border-hairline",
  },
  variants: {
    kind: {
      label: { form: "px-2 py-1 text-label uppercase tracking-eyebrow leading-none" },
      text: { form: "px-4 py-2 text-sm", material: "" },
    },
    tone: {
      passive: { material: "text-foreground-tertiary" },
      lead: { material: "text-foreground-lead" },
      link: {
        material:
          "bg-surface-wash text-foreground-lead hover:border-border hover:bg-surface-wash-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        motion: "transition-[background-color,border-color,color] duration-medium ease-settle",
      },
      toggle: {
        material:
          "cursor-pointer text-foreground-tertiary hover:border-border hover:text-foreground-lead aria-pressed:border-border aria-pressed:bg-surface-wash-strong aria-pressed:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        motion: "transition-[background-color,border-color,color] duration-medium ease-settle",
      },
    },
  },
});

export interface ChipProps {
  kind?: "label" | "text";
  tone?: "passive" | "lead";
  className?: string;
  children: ReactNode;
}

export function Chip({ kind = "label", tone = "passive", className, children }: ChipProps) {
  return <span className={chipRecipe({ kind, tone }, className)}>{children}</span>;
}

// A chip that is a control: a real button with a pressed state, for the skill
// lens. It rests looking like a passive chip so the metadata line stays quiet,
// and only the hover and the pressed state say it can be pushed. Like LinkChip
// it sits above a card's stretched link (z-2) and stops the click there, so
// pressing a skill never opens the case study.
export const ChipButton = ({
  pressed,
  onPress,
  title,
  className = "",
  children,
}: {
  pressed: boolean;
  onPress: () => void;
  /** Tooltip; the visible text is the chip's own label. */
  title?: string;
  className?: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={pressed}
    title={title}
    onClick={(e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onPress();
    }}
    className={chipRecipe({ kind: "label", tone: "toggle" }, `relative z-2 ${className}`)}
  >
    {children}
  </button>
);

// The "shipped" chip: an outbound link to the App Store, GitHub, or a live
// site. A real anchor, so it opens like any link (middle-click, cmd-click);
// stopPropagation keeps the click off any delegated handler on the card's
// ancestors. Sits above a card's stretched link (z-2 vs z-1) rather than
// inside it, so no anchor is ever nested.
export const LinkChip = ({ link, className = "" }: { link: ProjectLink; className?: string }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={chipRecipe({ kind: "label", tone: "link" }, `group/chip relative z-2 gap-1 pl-2.5 pr-1.5 ${className}`)}
  >
    {link.label}
    <ArrowUpRight
      aria-hidden="true"
      className="h-3 w-3 shrink-0 opacity-70 transition-[transform,opacity] duration-medium ease-settle group-hover/chip:translate-x-px group-hover/chip:-translate-y-px group-hover/chip:opacity-100"
      strokeWidth={2}
    />
  </a>
);

export default LinkChip;
