import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEM_CANONICAL,
  DESIGN_SYSTEM_DESCRIPTION,
  DESIGN_SYSTEM_TITLE,
  useDesignSystemMetadata,
} from "./useDesignSystemMetadata";

function addHeadElement(tag: "meta" | "link", attributes: Record<string, string>) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  document.head.append(element);
  return element;
}

describe("useDesignSystemMetadata", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "Malik Zhang — Home";
  });

  afterEach(() => {
    cleanup();
    document.head.innerHTML = "";
    document.title = "";
  });

  it("owns exact design-system metadata without duplicating existing nodes", () => {
    const canonical = addHeadElement("link", {
      rel: "canonical",
      href: "https://www.malikzhang.com/",
      "data-origin": "home",
    });
    const description = addHeadElement("meta", {
      name: "description",
      content: "Home description",
      "data-origin": "home",
    });
    addHeadElement("meta", { property: "og:title", content: "Home OG title" });
    addHeadElement("meta", { property: "og:description", content: "Home OG description" });
    addHeadElement("meta", { property: "og:url", content: "https://www.malikzhang.com" });
    addHeadElement("meta", { name: "twitter:title", content: "Home Twitter title" });

    const view = renderHook(() => useDesignSystemMetadata());

    expect(document.title).toBe(DESIGN_SYSTEM_TITLE);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(canonical).toHaveAttribute("href", DESIGN_SYSTEM_CANONICAL);
    expect(canonical).toHaveAttribute("data-origin", "home");
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(description).toHaveAttribute("content", DESIGN_SYSTEM_DESCRIPTION);
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute("content", DESIGN_SYSTEM_TITLE);
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute("content", DESIGN_SYSTEM_DESCRIPTION);
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute("content", DESIGN_SYSTEM_CANONICAL);
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute("content", DESIGN_SYSTEM_TITLE);
    expect(document.querySelector('meta[name="twitter:description"]')).toHaveAttribute("content", DESIGN_SYSTEM_DESCRIPTION);

    view.rerender();
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="twitter:description"]')).toHaveLength(1);
  });

  it("restores every prior attribute and removes only metadata it created", () => {
    const canonical = addHeadElement("link", {
      rel: "canonical",
      href: "https://www.malikzhang.com/",
      hreflang: "en",
    });
    const description = addHeadElement("meta", {
      name: "description",
      content: "Home description",
      "data-home": "true",
    });
    const ogImage = addHeadElement("meta", {
      property: "og:image",
      content: "https://www.malikzhang.com/og-image.png",
    });
    const author = addHeadElement("meta", { name: "author", content: "Malik Zhang" });

    const view = renderHook(() => useDesignSystemMetadata());
    expect(document.querySelector('meta[name="twitter:description"]')).not.toBeNull();
    view.unmount();

    expect(document.title).toBe("Malik Zhang — Home");
    expect(canonical.getAttributeNames().sort()).toEqual(["href", "hreflang", "rel"]);
    expect(canonical).toHaveAttribute("href", "https://www.malikzhang.com/");
    expect(description.getAttributeNames().sort()).toEqual(["content", "data-home", "name"]);
    expect(description).toHaveAttribute("content", "Home description");
    expect(document.querySelector('meta[name="twitter:description"]')).toBeNull();
    expect(document.head).toContainElement(ogImage);
    expect(document.head).toContainElement(author);
    expect(ogImage).toHaveAttribute("content", "https://www.malikzhang.com/og-image.png");
  });
});
