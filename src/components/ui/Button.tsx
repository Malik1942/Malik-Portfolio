import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { defineRecipe } from "@/design-system/system/recipe";

/**
 * The portfolio's two button tones.
 *
 * `primary` is the filled pill: the strongest affordance in the system,
 * reserved for the one live-product link on a case study (App Store, a
 * shipped site) and the homepage's single hand-off to Studio (which renders
 * a router Link with `buttonRecipe`). `secondary` is the bordered mono control used on utility
 * pages (email support, download a resume) where the action is useful but
 * must not compete with the copy.
 *
 * Renders a real anchor when `href` is given and a button otherwise, so the
 * same recipe carries links and actions without nesting one in the other.
 */
export const buttonRecipe = defineRecipe({
  base: {
    // The label may wrap on narrow screens (a 390px pill with a long label does),
    // so there is deliberately no whitespace-nowrap here.
    form: "group inline-flex items-center justify-center text-left",
    material:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    motion: "transition-colors duration-fast ease-settle",
  },
  variants: {
    tone: {
      primary: {
        form: "gap-2.5 rounded-full px-8 py-4 text-base font-medium",
        material: "bg-foreground text-background hover:bg-foreground-lead",
      },
      secondary: {
        form: "gap-3 rounded-sm px-5 py-3 text-sm md:text-base font-mono",
        material: "border border-hairline text-foreground hover:border-border",
      },
    },
  },
});

/** Trailing icons answer the hover with an outward nudge; leading ones hold still. */
const iconRecipe = defineRecipe({
  base: { form: "inline-flex shrink-0 [&>svg]:h-5 [&>svg]:w-5" },
  variants: {
    position: {
      leading: { form: "[&>svg]:h-4 [&>svg]:w-4" },
      trailing: {
        motion:
          "transition-transform duration-fast ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
      },
    },
  },
});

type Tone = "primary" | "secondary";

interface ButtonOwnProps {
  tone?: Tone;
  /** An icon element; sized and, when trailing, nudged by the button. */
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
  /** Opens in a new tab with the safe rel. Only meaningful with `href`. */
  external?: boolean;
  className?: string;
  children: ReactNode;
}

type AnchorProps = ButtonOwnProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;
type NativeProps = ButtonOwnProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export type ButtonProps = AnchorProps | NativeProps;

export function Button(props: ButtonProps) {
  const {
    tone = "primary",
    icon,
    iconPosition = "trailing",
    external = false,
    className,
    children,
    ...rest
  } = props;

  const classes = buttonRecipe({ tone }, className);
  const iconNode = icon ? (
    <span aria-hidden="true" className={iconRecipe({ position: iconPosition })}>
      {icon}
    </span>
  ) : null;
  const content = (
    <>
      {iconPosition === "leading" ? iconNode : null}
      {children}
      {iconPosition === "trailing" ? iconNode : null}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const anchorRest = rest as Omit<AnchorProps, keyof ButtonOwnProps>;
    return (
      <a
        {...anchorRest}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as Omit<NativeProps, keyof ButtonOwnProps>;
  return (
    <button type="button" {...buttonRest} className={classes}>
      {content}
    </button>
  );
}
