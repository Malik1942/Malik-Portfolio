import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";

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

const project = {
  id: "moti",
  title: "Moti",
  description: "An AI-native planner",
  role: "Product Designer & Builder",
  year: "2026",
  skills: ["AI-Native", "iOS / SwiftUI"] as const,
  links: [{ label: "App Store" as const, url: "https://apps.apple.com/us/app/moti-plan/id6770705491" }],
  destination: { kind: "case-study" as const },
};

describe("project card metadata", () => {
  it("renders the shipped chip as a real outbound anchor that is not nested in the card link", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={{ ...project, skills: [...project.skills] }} projectId="moti" dotClass="" globalIndex={0} />
      </MemoryRouter>,
    );
    const chip = screen.getByRole("link", { name: /App Store/ });
    expect(chip).toHaveAttribute("href", project.links[0].url);
    expect(chip).toHaveAttribute("target", "_blank");
    expect(chip.getAttribute("rel")).toContain("noopener");
    // The card's own link is a sibling overlay, never an ancestor.
    expect(chip.closest("a")).toBe(chip);
    expect(screen.getByRole("link", { name: "Moti" })).toHaveAttribute("href", "/project/moti");
  });

  it("renders skill chips after role and year, never above the title", () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={{ ...project, skills: [...project.skills] }} projectId="moti" dotClass="" globalIndex={0} />
      </MemoryRouter>,
    );
    const title = screen.getByRole("heading", { name: "Moti" });
    const chip = screen.getByText("AI-Native");
    expect(title.compareDocumentPosition(chip) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.textContent).toContain("Product Designer & Builder · 2026");
  });

  it("orders a Workshop tile's metadata as links, skills, year", () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={{ ...project, skills: [...project.skills] }} projectId="moti" dotClass="" globalIndex={0} tile />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /App Store/ });
    const skill = screen.getByText("AI-Native");
    const year = screen.getByText("2026");
    expect(link.compareDocumentPosition(skill) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(skill.compareDocumentPosition(year) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.textContent).not.toContain("Product Designer");
  });

  it("gives an external tile an outbound card link and an arrow glyph", () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard
          project={{ ...project, id: "oryne", title: "Oryne", skills: [], links: undefined, destination: { kind: "external", url: "https://example.com/" } }}
          projectId="oryne"
          dotClass=""
          globalIndex={0}
          tile
        />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "Oryne" });
    expect(link).toHaveAttribute("href", "https://example.com/");
    expect(link).toHaveAttribute("target", "_blank");
    // corner glyph on the cover, drawn as an icon
    expect(container.querySelector("[aria-hidden='true'] svg")).not.toBeNull();
  });
});
