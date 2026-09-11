import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { backLinkRecipe } from "./BackLink.recipe";

export interface BackLinkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  family?: "body" | "mono";
  className?: string;
  children: ReactNode;
}

export function BackLink({ family = "body", className, children, ...rest }: BackLinkProps) {
  return (
    <button type="button" {...rest} className={backLinkRecipe({ family }, className)}>
      <ArrowLeft
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-fast ease-settle group-hover:-translate-x-0.5"
        strokeWidth={2}
      />
      {children}
    </button>
  );
}
