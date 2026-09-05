import { useId, type ReactNode } from "react";

export function Specimen({
  label,
  description,
  children,
  footer,
}: {
  label: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const labelId = `specimen-${id}-label`;
  const descriptionId = `specimen-${id}-description`;

  return (
    <section
      role="region"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className="min-w-0 overflow-hidden rounded-lg border border-hairline bg-card/25"
    >
      <div className="border-b border-hairline px-5 py-4 sm:px-6">
        <h2 id={labelId} className="text-sm font-medium text-foreground">{label}</h2>
        <p id={descriptionId} className="mt-1 max-w-measure-wide break-words text-sm leading-relaxed text-foreground-tertiary">
          {description}
        </p>
      </div>
      <div className="min-w-0 overflow-x-auto p-5 sm:p-6">{children}</div>
      {footer ? (
        <div className="border-t border-hairline px-5 py-4 sm:px-6">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
