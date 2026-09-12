import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { defineRecipe } from "@/design-system/system/recipe";

/**
 * The uppercase, letter-spaced label that sits above a block and names it:
 * section headings on the homepage, metadata card labels, reference group
 * titles, the "On this page" heading of a case-study guide.
 *
 * Form picks the size: `label` is the 12px metadata label, `section` the 14px
 * Medium one that names a whole section of a page (Selected Work, More Work,
 * the Studio groups, the About chapters). Material picks the ink tier:
 * `tertiary` is the default quiet label, `secondary` when the eyebrow has to
 * carry a little more weight against a busy neighbour, `primary` for a section
 * eyebrow, which heads its block rather than annotating one. `family="mono"`
 * is the technical voice used for terminal-like labels.
 *
 * The section scale lived inline in two places before (the homepage section
 * label and the About editorial header) and had already drifted a step apart.
 */
export const eyebrowRecipe = defineRecipe({
  base: { form: "uppercase tracking-eyebrow" },
  variants: {
    scale: {
      label: { form: "text-label" },
      section: { form: "text-sm font-medium" },
    },
    tone: {
      tertiary: { material: "text-foreground-tertiary" },
      secondary: { material: "text-foreground-secondary" },
      primary: { material: "text-foreground" },
    },
    family: {
      body: {},
      mono: { form: "font-mono" },
    },
  },
});

export interface EyebrowProps extends Omit<HTMLAttributes<HTMLElement>, "className" | "children"> {
  /** Rendered element. A `p` by default; pass `h2` or `h3` when it heads a region. */
  as?: ElementType;
  scale?: "label" | "section";
  tone?: "tertiary" | "secondary" | "primary";
  family?: "body" | "mono";
  className?: string;
  children: ReactNode;
}

export function Eyebrow({
  as: Tag = "p",
  scale = "label",
  tone = "tertiary",
  family = "body",
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <Tag {...rest} className={eyebrowRecipe({ scale, tone, family }, className)}>
      {children}
    </Tag>
  );
}
