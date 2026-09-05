import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { defineRecipe } from "@/design-system/system/recipe";

/**
 * The inline text link with the underline sweep: header and footer
 * destinations, the Connect cluster, the utility pages' footers.
 *
 * Form is the `.nav-link` underline (drawn in index.css, one pixel, sweeping
 * in from the left on hover) plus an optional size. Material is the ink tier
 * at rest, rising to primary on hover; `inherit` lets a host container set the
 * tier once for a whole row, as the header does. Motion is the slow color
 * transition the header and footer share.
 *
 * Polymorphic: an anchor by default, a router Link when given `as={Link}`,
 * or a button for links that open an overlay rather than navigate.
 */
export const textLinkRecipe = defineRecipe({
  base: {
    form: "nav-link",
    material: "rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
    motion: "transition-colors duration-slow ease-settle",
  },
  variants: {
    tone: {
      inherit: {},
      primary: { material: "text-foreground" },
      secondary: { material: "text-foreground-secondary" },
      tertiary: { material: "text-foreground-tertiary" },
    },
    size: {
      inherit: {},
      sm: { form: "text-sm" },
      caption: { form: "text-caption" },
    },
  },
});

type TextLinkOwnProps<T extends ElementType> = {
  as?: T;
  tone?: "inherit" | "primary" | "secondary" | "tertiary";
  size?: "inherit" | "sm" | "caption";
  className?: string;
  children: ReactNode;
};

export type TextLinkProps<T extends ElementType = "a"> = TextLinkOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextLinkOwnProps<T>>;

export function TextLink<T extends ElementType = "a">({
  as,
  tone = "inherit",
  size = "inherit",
  className,
  children,
  ...rest
}: TextLinkProps<T>) {
  const Tag: ElementType = as ?? "a";
  const extra = Tag === "button" ? { type: "button" as const } : {};
  return (
    <Tag {...extra} {...rest} className={textLinkRecipe({ tone, size }, className)}>
      {children}
    </Tag>
  );
}
