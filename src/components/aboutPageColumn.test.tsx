import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Index from "@/pages/Index";
import { PAGE_COLUMN, PAGE_GUTTERS } from "@/design-system/system/layout";
import { eyebrowRecipe } from "@/components/ui/Eyebrow";

/**
 * The About page is set in the same column as every other page: the site
 * header, the Work sections, the Studio hand-off and the footer. It drifted
 * out of it once already — the chapters broke out of a 768px wrapper and
 * capped themselves at 1180px while the footer sat at 1200 and the nav above
 * them at 1400, three left edges on one page — and nothing failed, because a
 * column that is merely the wrong width still renders.
 *
 * These assertions read the classes rather than the geometry: jsdom lays
 * nothing out, and the classes are where the drift happens.
 */

beforeAll(() => {
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Observer);
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});

afterEach(cleanup);

const renderAbout = () =>
  render(
    <MemoryRouter>
      <Index aboutOpen />
    </MemoryRouter>,
  );

/** Every class in `classes` is present on `el`. */
const hasAll = (el: Element | null | undefined, classes: string) =>
  classes.split(/\s+/).every((c) => el?.classList.contains(c));

describe("About page column", () => {
  it("sets every chapter in the page gutters and the page column", () => {
    const { container } = renderAbout();
    const chapters = Array.from(container.querySelectorAll("[data-about-chapter]"));

    expect(chapters.length).toBeGreaterThan(0);
    for (const chapter of chapters) {
      expect(hasAll(chapter, PAGE_GUTTERS), `chapter gutters: ${chapter.className}`).toBe(true);
      expect(
        hasAll(chapter.firstElementChild, PAGE_COLUMN),
        `chapter column: ${chapter.firstElementChild?.className}`,
      ).toBe(true);
    }
  });

  it("lands the closing back link and the footer on the same column", () => {
    const { container } = renderAbout();

    const footer = container.querySelector("footer");
    expect(hasAll(footer, PAGE_GUTTERS)).toBe(true);
    expect(hasAll(footer?.firstElementChild, PAGE_COLUMN)).toBe(true);

    // The "Back to home" exit sits directly above the footer, in its own
    // wrapper; both share the column so their left edges agree.
    const backWrapper = footer?.parentElement?.previousElementSibling;
    expect(hasAll(backWrapper, PAGE_GUTTERS)).toBe(true);
    expect(hasAll(backWrapper?.firstElementChild, PAGE_COLUMN)).toBe(true);
  });

  it("names each chapter with the same eyebrow the Work sections use", () => {
    const sectionEyebrow = eyebrowRecipe({ scale: "section", tone: "primary" });
    const { container } = renderAbout();

    const eyebrows = Array.from(
      container.querySelectorAll("[data-about-chapter] p.uppercase"),
    );

    expect(eyebrows.length).toBeGreaterThan(0);
    for (const eyebrow of eyebrows) {
      expect(hasAll(eyebrow, sectionEyebrow), `eyebrow: ${eyebrow.className}`).toBe(true);
    }
  });
});
