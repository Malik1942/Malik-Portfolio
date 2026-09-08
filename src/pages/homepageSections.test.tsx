import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Index from "./Index";
import { STUDIO_TEASER_CTA, STUDIO_TEASER_ID, STUDIO_TEASER_PROJECT_ID } from "@/components/StudioTeaser";
import { HOME_SECTION_ORDER, NAV_ITEMS, SECTIONS, sectionHref } from "@/lib/sections";
import { getProject, projectsInSection } from "@/data/projects";

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
    // Skill chips are lens toggles (aria-pressed), not ways into the project;
    // they do not count as a card's click target either way.
    const openers = "a[href], button:not([aria-pressed])";
    for (const key of HOME_SECTION_ORDER) {
      const section = container.querySelector(`#${SECTIONS[key].id}`)!;
      for (const project of projectsInSection(key)) {
        const card = section.querySelector(`#project-${project.id}`);
        expect(card, `${project.id} card missing from ${key}`).not.toBeNull();
        if (project.destination.kind === "placeholder") {
          // The one sanctioned dead card: a cover with a "Coming soon" chip
          // and no way in, until the case study exists.
          expect(card!.querySelector(openers), `${project.id} placeholder must not be clickable`).toBeNull();
          expect(card!.textContent, `${project.id} placeholder needs its Coming soon chip`).toMatch(/Coming soon/);
          continue;
        }
        expect(card!.querySelector(openers), `${project.id} has no click target`).not.toBeNull();
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

  it("closes Work with a Studio hand-off: after More Work, before the footer, with a Go to Studio button and a Studio project", () => {
    const { container } = renderHome();
    const teaser = container.querySelector(`#${STUDIO_TEASER_ID}`)!;
    expect(teaser).not.toBeNull();

    // Placement: the last thing before the footer, after every Work section.
    const lastSection = container.querySelector(`#${SECTIONS[HOME_SECTION_ORDER.at(-1)!].id}`)!;
    const footer = container.querySelector("footer")!;
    expect(lastSection.compareDocumentPosition(teaser) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(teaser.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // It names Studio, but it is not the Studio section (that id lives on /studio).
    expect(teaser.querySelector("h2")!.textContent).toBe(SECTIONS.studio.label);
    expect(container.querySelector(`#${SECTIONS.studio.id}`)).toBeNull();

    // The banner is one router link to the Studio page, carrying the button label.
    const links = [...teaser.querySelectorAll("a")];
    expect(links).toHaveLength(1);
    const [banner] = links;
    expect(banner.textContent).toContain(STUDIO_TEASER_CTA);
    expect(banner).toHaveAttribute("href", SECTIONS.studio.path);

    // One Studio project shown as the picture.
    const featured = getProject(STUDIO_TEASER_PROJECT_ID)!;
    expect(featured.section).toBe("studio");
    const images = teaser.querySelectorAll("img");
    expect(images.length).toBeGreaterThanOrEqual(1);
    for (const img of images) expect(img.getAttribute("alt")).toContain(featured.title);
  });

  it("aligns More Work covers to 16/9 without changing Selected Work hero ratios", () => {
    const { container } = renderHome();

    for (const project of projectsInSection("more")) {
      const media = container.querySelector(`#project-${project.id} .overflow-hidden.rounded-2xl`) as HTMLElement | null;
      expect(media, `${project.id} cover box missing`).not.toBeNull();
      const [w, h] = media!.style.aspectRatio.split("/").map(Number);
      expect(w / h, `${project.id} should be 16/9, got ${media!.style.aspectRatio}`).toBeCloseTo(16 / 9, 5);
    }

    for (const project of projectsInSection("selected")) {
      const media = container.querySelector(`#project-${project.id} .overflow-hidden.rounded-2xl`) as HTMLElement | null;
      expect(media, `${project.id} cover box missing`).not.toBeNull();
      expect(media!.style.aspectRatio.replace(/\s/g, ""), `${project.id} hero ratio changed`).toBe(
        project.coverAspect!.replace(/\s/g, ""),
      );
    }

    const rightColumn = container.querySelector("#project-moodmuse")!.parentElement as HTMLElement;
    expect(rightColumn.style.marginTop === "" || rightColumn.style.marginTop === "0px").toBe(true);
  });
});
