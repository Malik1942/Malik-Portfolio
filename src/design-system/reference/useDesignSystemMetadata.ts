import { useEffect } from "react";

export const DESIGN_SYSTEM_TITLE = "Design System · Malik Zhang";
export const DESIGN_SYSTEM_CANONICAL = "https://www.malikzhang.com/design-system";
export const DESIGN_SYSTEM_DESCRIPTION =
  "Malik Zhang's living portfolio design reference: curated foundations, production components, responsive patterns, and standards-aligned design tokens.";

interface MetadataDefinition {
  selector: string;
  tag: "link" | "meta";
  attributes: Record<string, string>;
}

const METADATA: MetadataDefinition[] = [
  {
    selector: 'link[rel="canonical"]',
    tag: "link",
    attributes: { rel: "canonical", href: DESIGN_SYSTEM_CANONICAL },
  },
  {
    selector: 'meta[name="description"]',
    tag: "meta",
    attributes: { name: "description", content: DESIGN_SYSTEM_DESCRIPTION },
  },
  {
    selector: 'meta[property="og:title"]',
    tag: "meta",
    attributes: { property: "og:title", content: DESIGN_SYSTEM_TITLE },
  },
  {
    selector: 'meta[property="og:description"]',
    tag: "meta",
    attributes: { property: "og:description", content: DESIGN_SYSTEM_DESCRIPTION },
  },
  {
    selector: 'meta[property="og:url"]',
    tag: "meta",
    attributes: { property: "og:url", content: DESIGN_SYSTEM_CANONICAL },
  },
  {
    selector: 'meta[name="twitter:title"]',
    tag: "meta",
    attributes: { name: "twitter:title", content: DESIGN_SYSTEM_TITLE },
  },
  {
    selector: 'meta[name="twitter:description"]',
    tag: "meta",
    attributes: { name: "twitter:description", content: DESIGN_SYSTEM_DESCRIPTION },
  },
];

interface OwnedElement {
  element: HTMLElement;
  created: boolean;
  attributes: Array<[string, string]>;
}

export function useDesignSystemMetadata(): void {
  useEffect(() => {
    const previousTitleElement = document.head.querySelector("title");
    const previousTitleContent = previousTitleElement?.textContent ?? "";
    const previousTitleAttributes = previousTitleElement?.getAttributeNames().map<
      [string, string]
    >((name) => [name, previousTitleElement.getAttribute(name) ?? ""]) ?? [];
    document.title = DESIGN_SYSTEM_TITLE;
    const ownedTitleElement = document.head.querySelector("title");

    const owned = METADATA.map<OwnedElement>((definition) => {
      const existing = document.head.querySelector<HTMLElement>(definition.selector);
      const element = existing ?? document.createElement(definition.tag);
      const attributes = existing
        ? existing.getAttributeNames().map<[string, string]>((name) => [
          name,
          existing.getAttribute(name) ?? "",
        ])
        : [];

      for (const [name, value] of Object.entries(definition.attributes)) {
        element.setAttribute(name, value);
      }
      if (!existing) document.head.append(element);

      return { element, created: !existing, attributes };
    });

    return () => {
      if (!previousTitleElement) {
        ownedTitleElement?.remove();
      } else {
        previousTitleElement.textContent = previousTitleContent;
        for (const name of previousTitleElement.getAttributeNames()) {
          previousTitleElement.removeAttribute(name);
        }
        for (const [name, value] of previousTitleAttributes) {
          previousTitleElement.setAttribute(name, value);
        }
      }
      for (const entry of owned.reverse()) {
        if (entry.created) {
          entry.element.remove();
          continue;
        }
        for (const name of entry.element.getAttributeNames()) {
          entry.element.removeAttribute(name);
        }
        for (const [name, value] of entry.attributes) {
          entry.element.setAttribute(name, value);
        }
      }
    };
  }, []);
}
