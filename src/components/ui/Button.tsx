import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { buttonRecipe, iconRecipe } from "./Button.recipe";

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
