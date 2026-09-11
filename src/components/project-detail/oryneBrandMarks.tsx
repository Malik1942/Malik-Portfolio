/* ---------------------------------------------------------------------------
 * Brand marks for the Oryne competitive set.
 *
 * Same contract as motiBrandMarks: a single `currentColor` path, called like a
 * lucide icon (`<Mark className=… />`), `aria-hidden` because the product name
 * is always printed beside it. Flattening to one colour keeps five brand
 * palettes out of a monochrome table.
 *
 * Sources, fetched 2026-09-10, none drawn by hand:
 *  - Pinterest, Milanote, Apple: Simple Icons (CC0), paths copied verbatim
 *    from cdn.simpleicons.org.
 *  - Notion is NOT redefined here. It already exists in motiBrandMarks and is
 *    imported from there, so the two case studies cannot drift apart.
 *  - Apple's corporate mark stands in for Apple Freeform. Freeform's own icon
 *    is a multicolour app icon that carries no meaning once flattened to a
 *    single colour, and Simple Icons has no entry for it.
 *  - mymind has no Simple Icons entry and ships a PNG favicon, not an SVG. Its
 *    favicon turned out to be one flat orange glyph on transparency (44 colours,
 *    every one of them an antialiased step of the same orange), so it is used as
 *    a CSS mask over
 *    `bg-current`: the alpha channel supplies the shape and the surrounding
 *    text colour supplies the ink, which is exactly what the SVG marks do.
 *    Swap it for a path the day mymind publishes an SVG.
 *
 * Every mark here is a third-party trademark, used nominatively to identify the
 * product it names in a comparison. Do not restyle them into decoration.
 * ------------------------------------------------------------------------- */

import type { SVGProps } from "react";
import mymindMark from "@/assets/mark-mymind.png";

type MarkProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "fill" | "children">;

const base = { fill: "currentColor", "aria-hidden": true, focusable: false } as const;

export function PinterestMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

export function MilanoteMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 12.943L15.057 16H8.943Zm4-4v6.114L12.943 12Zm-8 6.114V8.943L11.057 12Zm8.917 2.227a.665.665 0 0 0 .367-.367l-.003.009a.665.665 0 0 0 .052-.26V7.334a.667.667 0 0 0-1.138-.471L12 11.057 7.805 6.862a.667.667 0 0 0-1.138.471v9.334a.667.667 0 0 0 .666.666h9.334c.092 0 .18-.018.26-.052l-.01.004z" />
    </svg>
  );
}

export function AppleMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** mymind's favicon as a mask, so it inherits the row's text colour. */
export function MymindMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className ?? ""}`}
      style={{
        maskImage: `url(${mymindMark})`,
        WebkitMaskImage: `url(${mymindMark})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
