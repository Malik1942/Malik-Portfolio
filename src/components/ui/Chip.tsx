import type { MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectLink } from "@/data/projects";
import { chipRecipe } from "./Chip.recipe";

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
