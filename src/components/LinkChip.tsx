import { ArrowUpRight } from "lucide-react";
import type { ProjectLink } from "@/data/projects";

// The "shipped" chip: an outbound link to the App Store, GitHub, or a live
// site. It has to read as a button at a glance, so unlike the passive skill
// chips it carries a filled surface, a stronger border and text (the same
// recipe as the active chip in the case-study section guide: border-border,
// bg-foreground/[0.08], text-foreground/90, label-role type), and a hover that
// both brightens and nudges the arrow outward. A real anchor, so it opens
// like any link (middle-click, cmd-click); stopPropagation keeps the click off
// any delegated handler on the card's ancestors. Sits above a card's stretched
// link (z-[2] vs z-[1]) rather than inside it, so no anchor is ever nested.
export const LinkChip = ({ link, className = "" }: { link: ProjectLink; className?: string }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={`group/chip relative z-[2] inline-flex items-center gap-1 rounded-full border border-border/60 bg-foreground/[0.08] py-1 pl-2.5 pr-1.5 text-label uppercase tracking-eyebrow leading-none text-foreground/90 whitespace-nowrap transition-[background-color,border-color,color] duration-300 hover:border-border hover:bg-foreground/[0.14] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
  >
    {link.label}
    <ArrowUpRight
      aria-hidden="true"
      className="h-3 w-3 shrink-0 opacity-70 transition-[transform,opacity] duration-300 ease-out group-hover/chip:translate-x-px group-hover/chip:-translate-y-px group-hover/chip:opacity-100"
      strokeWidth={2}
    />
  </a>
);

export default LinkChip;
