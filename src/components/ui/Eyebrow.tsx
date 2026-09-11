import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { eyebrowRecipe } from "./Eyebrow.recipe";

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
