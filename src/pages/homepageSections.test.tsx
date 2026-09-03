import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Index from "./Index";
import { HOME_SECTION_ORDER, NAV_ITEMS, SECTIONS, sectionHref } from "@/lib/sections";
import { projectsInSection } from "@/data/projects";

// jsdom ships none of the observers the hero and the cards lean on.
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

const renderHome = () =>
  render(
    <MemoryRouter>
      <Index />
    </MemoryRouter>,
  );

describe("homepage sections", () => {
  it("renders every section-type nav item as a DOM id the header can scroll to", () => {
    const { container } = renderHome();
    for (const item of NAV_ITEMS) {
      if (item.kind !== "section") continue;
      const id = SECTIONS[item.section].id;
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });

  it("renders the homepage sections in order with their eyebrows, and not the Studio page", () => {
    const { container } = renderHome();
    const sections = HOME_SECTION_ORDER.map((key) => container.querySelector(`#${SECTIONS[key].id}`));
    for (const el of sections) expect(el).not.toBeNull();
    for (let i = 1; i < sections.length; i++) {
      expect(sections[i - 1]!.compareDocumentPosition(sections[i]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    for (const key of HOME_SECTION_ORDER) {
      expect(sections[HOME_SECTION_ORDER.indexOf(key)]!.textContent).toContain(SECTIONS[key].label);
    }
    expect(container.querySelector(`#${SECTIONS.studio.id}`)).toBeNull();
  });

  it("gives every homepage project a card in its own section, and every card a link (no dead cards)", () => {
    const { container } = renderHome();
    for (const key of HOME_SECTION_ORDER) {
      const section = container.querySelector(`#${SECTIONS[key].id}`)!;
      for (const project of projectsInSection(key)) {
        const card = section.querySelector(`#project-${project.id}`);
        expect(card, `${project.id} card missing from ${key}`).not.toBeNull();
        expect(card!.querySelector("a[href], button"), `${project.id} has no click target`).not.toBeNull();
      }
    }
  });

  it("links the header to Work (a section) and Studio (a page)", () => {
    const { container } = renderHome();
    const hrefs = [...container.querySelectorAll("nav a")].map((a) => [a.textContent, a.getAttribute("href")]);
    expect(hrefs).toContainEqual(["Work", sectionHref("selected")]);
    expect(hrefs).toContainEqual(["Studio", SECTIONS.studio.path]);
  });

  it("keeps the footer Explore list to Work and Studio, without More Work", () => {
    const { container } = renderHome();
    const footer = container.querySelector("footer")!;
    const labels = [...footer.querySelectorAll("a, button")].map((el) => el.textContent);
    expect(labels).toContain("Work");
    expect(labels).toContain("Studio");
    expect(labels).not.toContain("More Work");
  });
});
