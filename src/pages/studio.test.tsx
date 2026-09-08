import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Studio, { STUDIO_HEADLINE } from "./Studio";
import { GITHUB_URL } from "@/components/GitHubStrip";
import { SECTIONS } from "@/lib/sections";
import { STUDIO_GROUPS, projectsInSection, studioGroups } from "@/data/projects";

beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

afterEach(cleanup);

const renderStudio = () =>
  render(
    <MemoryRouter initialEntries={[SECTIONS.studio.path]}>
      <Studio />
    </MemoryRouter>,
  );

describe("Studio page", () => {
  it("opens with its title and the line that draws the Work / Studio distinction", () => {
    renderStudio();
    expect(screen.getByRole("heading", { level: 1, name: SECTIONS.studio.label })).toBeInTheDocument();
    // noOrphan may glue the last two words with a non-breaking space
    expect(document.body.textContent!.replace(/\u00a0/g, " ")).toContain(STUDIO_HEADLINE);
    expect(document.title).toContain(SECTIONS.studio.label);
  });

  it("renders every Studio project as a clickable tile", () => {
    const { container } = renderStudio();
    const grid = container.querySelector(`#${SECTIONS.studio.id}`)!;
    expect(grid).not.toBeNull();
    for (const project of projectsInSection("studio")) {
      const card = grid.querySelector(`#project-${project.id}`);
      expect(card, `${project.id} tile missing`).not.toBeNull();
      expect(card!.querySelector("a[href], button")).not.toBeNull();
    }
  });

  it("splits the tiles into the software and the machines, each under its own heading, in that order", () => {
    const { container } = renderStudio();
    const groups = [...container.querySelectorAll("[data-studio-group]")] as HTMLElement[];
    expect(groups.map((el) => el.dataset.studioGroup)).toEqual(STUDIO_GROUPS.map((g) => g.key));

    for (const group of studioGroups()) {
      const region = container.querySelector(`[data-studio-group="${group.key}"]`)!;
      expect(region).not.toBeNull();
      // The heading is a real h2 with the group's label, and its blurb sits under it.
      expect(region.querySelector("h2")!.textContent).toBe(group.label);
      expect(region.textContent!.replace(/\u00a0/g, " ")).toContain(group.blurb);
      // Exactly this group's tiles, in data order, and none of the other group's.
      const tileIds = [...region.querySelectorAll(".studio-grid > [id^='project-']")].map((el) => el.id);
      expect(tileIds).toEqual(group.projects.map((p) => `project-${p.id}`));
    }
  });

  it("closes the software group with a GitHub strip that opens the profile in a new tab", () => {
    const { container } = renderStudio();
    const software = container.querySelector('[data-studio-group="software"]')!;
    const machines = container.querySelector('[data-studio-group="machines"]')!;
    const link = screen.getByRole("link", { name: "More on GitHub" });
    expect(link).toHaveAttribute("href", GITHUB_URL);
    expect(link).toHaveAttribute("target", "_blank");
    // Under the software grid, not inside it, and before the machines.
    expect(software.contains(link)).toBe(true);
    expect(link.closest(".studio-grid")).toBeNull();
    expect(software.querySelector(".studio-grid")!.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(link.compareDocumentPosition(machines) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // It is no longer a fake project tile.
    expect(container.querySelector("#project-github")).toBeNull();
  });

  it("does not repeat the section eyebrow under the page title", () => {
    const { container } = renderStudio();
    const eyebrows = [...container.querySelectorAll("section span")].filter(
      (el) => el.textContent === SECTIONS.studio.label,
    );
    expect(eyebrows).toHaveLength(0);
  });

  it("puts every Studio cover, including Studio Waters and ZEAT, in the same 16/9 box", () => {
    const { container } = renderStudio();
    const tiles = projectsInSection("studio").map((project) => `project-${project.id}`);
    for (const id of tiles) {
      const media = container.querySelector(`#${id} .overflow-hidden.rounded-2xl`) as HTMLElement | null;
      expect(media, `${id} cover box missing`).not.toBeNull();
      const [w, h] = media!.style.aspectRatio.split("/").map(Number);
      expect(w / h, `${id} should be 16/9, got ${media!.style.aspectRatio}`).toBeCloseTo(16 / 9, 5);
    }
  });
});
