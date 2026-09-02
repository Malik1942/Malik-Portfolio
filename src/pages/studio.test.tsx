import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Studio, { STUDIO_HEADLINE } from "./Studio";
import { GITHUB_URL } from "@/components/GitHubTile";
import { SECTIONS } from "@/lib/sections";
import { projectsInSection } from "@/data/projects";

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

  it("ends the grid with a GitHub tile that opens the profile in a new tab", () => {
    const { container } = renderStudio();
    const grid = container.querySelector(".studio-grid")!;
    const tile = grid.lastElementChild as HTMLElement;
    expect(tile.id).toBe("project-github");
    const link = screen.getByRole("link", { name: "More on GitHub" });
    expect(link).toHaveAttribute("href", GITHUB_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("does not repeat the section eyebrow under the page title", () => {
    const { container } = renderStudio();
    const eyebrows = [...container.querySelectorAll("section span")].filter(
      (el) => el.textContent === SECTIONS.studio.label,
    );
    expect(eyebrows).toHaveLength(0);
  });
});
