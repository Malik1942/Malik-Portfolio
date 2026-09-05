import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { defineRecipe } from "@/design-system/system/recipe";

/**
 * The uppercase, letter-spaced label that sits above a block and names it:
 * section headings on the homepage, metadata card labels, reference group
 * titles, the "On this page" heading of a case-study guide.
 *
 * Form is fixed (label size, eyebrow tracking). Material picks the ink tier:
 * `tertiary` is the default quiet label, `secondary` when the eyebrow has to
 * carry a little more weight against a busy neighbour. `family="mono"` is the
 * technical voice used for terminal-like labels.
 */
export const eyebrowRecipe = defineRecipe({
  base: { form: "text-label uppercase tracking-eyebrow" },
  variants: {
    tone: {
      tertiary: { material: "text-foreground-tertiary" },
      secondary: { material: "text-foreground-secondary" },
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
  tone?: "tertiary" | "secondary";
  family?: "body" | "mono";
  className?: string;
  children: ReactNode;
}

export function Eyebrow({
  as: Tag = "p",
  tone = "tertiary",
  family = "body",
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <Tag {...rest} className={eyebrowRecipe({ tone, family }, className)}>
      {children}
    </Tag>
  );
}
