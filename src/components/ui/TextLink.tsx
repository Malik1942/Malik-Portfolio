import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { textLinkRecipe } from "./TextLink.recipe";

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
