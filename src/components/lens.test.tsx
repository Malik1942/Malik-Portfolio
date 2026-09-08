import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Index from "@/pages/Index";
import Studio from "@/pages/Studio";
import { ProjectCard } from "./ProjectList";
import { LENS_BAR_ID, LENS_ROW_ID, LENS_ROW_LABEL } from "./Lens";
import { LENS_ROW, SHIPPED } from "@/lib/lens";
import { SECTIONS } from "@/lib/sections";

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

/** Exposes the router's current URL so a test can read what a chip did. */
const LocationProbe = () => {
  const { pathname, search } = useLocation();
  return <output data-testid="location">{pathname + search}</output>;
};

const renderAt = (url: string, page: "home" | "studio" = "home") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      {page === "home" ? <Index /> : <Studio />}
      <LocationProbe />
    </MemoryRouter>,
  );

const lensOf = (container: HTMLElement, id: string) =>
  (container.querySelector(`#project-${id} [data-lens]`) as HTMLElement | null)?.dataset.lens;

const location = () => screen.getByTestId("location").textContent;

describe("skill lens on the homepage", () => {
  it("does nothing until asked: no lens means no bar, no dimming, chips at rest", () => {
    const { container } = renderAt("/");
    expect(container.querySelector(`#${LENS_BAR_ID}`)).toBeNull();
    expect(container.querySelector("[data-lens]")).toBeNull();
    expect(container.querySelector('[aria-pressed="true"]')).toBeNull();
    // The chips are already controls, waiting.
    expect(container.querySelectorAll('button[aria-pressed="false"]').length).toBeGreaterThan(0);
  });

  it("reads the lens from the URL and holds the matches up, dims the rest, keeps every card in place", () => {
    const { container } = renderAt("/?lens=industrial-design");
    expect(lensOf(container, "moodmuse")).toBe("match");
    expect(lensOf(container, "tubular")).toBe("match");
    expect(lensOf(container, "moti")).toBe("dim");
    expect(lensOf(container, "neuralyfe")).toBe("dim");

    // Dimmed cards recede to the token, matches sit at full. Nothing is
    // removed and the order is untouched: Selected Work still leads.
    const dimmed = container.querySelector("#project-moti [data-lens]") as HTMLElement;
    expect(dimmed.style.opacity).toBe("var(--component-project-card-lens-dim)");
    const match = container.querySelector("#project-moodmuse [data-lens]") as HTMLElement;
    expect(match.style.opacity).toBe("1");
    const moti = container.querySelector("#project-moti")!;
    const moodmuse = container.querySelector("#project-moodmuse")!;
    expect(moti.compareDocumentPosition(moodmuse) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // The chip for the active skill is pressed on the skill row and on every
    // card that carries it (Mood Muse, Tubular).
    const pressed = container.querySelectorAll('button[aria-pressed="true"]');
    expect(pressed.length).toBe(3);
    for (const chip of pressed) expect(chip.textContent).toBe("Industrial Design");
  });

  it("names the lens, counts this page, and links the rest to Studio with the lens carried over", () => {
    const { container } = renderAt("/?lens=industrial-design");
    const bar = container.querySelector(`#${LENS_BAR_ID}`) as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.textContent).toContain("Industrial Design");
    expect(bar.textContent).toContain("2 of 8 projects here");
    const link = within(bar).getByRole("link", { name: /2 in Studio/ });
    expect(link).toHaveAttribute("href", `${SECTIONS.studio.path}?lens=industrial-design`);
    expect(within(bar).getByRole("button", { name: "Clear lens" })).toBeInTheDocument();
  });

  it("pressing a chip sets the lens in the URL without leaving the page or opening the project", () => {
    const { container } = renderAt("/");
    const motiChip = within(container.querySelector("#project-moti") as HTMLElement).getByRole("button", {
      name: "AI-Native",
    });
    fireEvent.click(motiChip);
    expect(location()).toBe("/?lens=ai-native");
    expect(lensOf(container, "moti")).toBe("match");
    expect(lensOf(container, "aura")).toBe("dim");
    expect(motiChip).toHaveAttribute("aria-pressed", "true");
  });

  it("is single select: another skill swaps, the same skill clears, Escape clears", () => {
    const { container } = renderAt("/?lens=ai-native");
    const aura = container.querySelector("#project-aura") as HTMLElement;
    fireEvent.click(within(aura).getByRole("button", { name: "UX Research" }));
    expect(location()).toBe("/?lens=ux-research");
    expect(lensOf(container, "aura")).toBe("match");
    expect(lensOf(container, "moti")).toBe("dim");

    fireEvent.click(within(aura).getByRole("button", { name: "UX Research" }));
    expect(location()).toBe("/");
    expect(container.querySelector("[data-lens]")).toBeNull();

    fireEvent.click(within(aura).getByRole("button", { name: "UX Research" }));
    expect(location()).toBe("/?lens=ux-research");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(location()).toBe("/");
  });

  it("clears from the bar", () => {
    const { container } = renderAt("/?lens=industrial-design");
    fireEvent.click(screen.getByRole("button", { name: "Clear lens" }));
    expect(location()).toBe("/");
    expect(container.querySelector("[data-lens]")).toBeNull();
  });

  it("offers the lens up front: a row under the Selected Work eyebrow, before the first card", () => {
    const { container } = renderAt("/");
    const section = container.querySelector(`#${SECTIONS.selected.id}`) as HTMLElement;
    const row = section.querySelector(`#${LENS_ROW_ID}`) as HTMLElement;
    expect(row).not.toBeNull();
    expect(row).toHaveAttribute("aria-label", LENS_ROW_LABEL);
    expect(within(row).getAllByRole("button").map((b) => b.textContent)).toEqual([...LENS_ROW]);

    const firstCard = section.querySelector("#project-moti")!;
    expect(row.compareDocumentPosition(firstCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Only one row on the page.
    expect(container.querySelectorAll(`#${LENS_ROW_ID}`).length).toBe(1);
  });

  it("keeps the row and the card chips in step: one lens, pressed in both places", () => {
    const { container } = renderAt("/");
    const row = container.querySelector(`#${LENS_ROW_ID}`) as HTMLElement;
    fireEvent.click(within(row).getByRole("button", { name: "Industrial Design" }));
    expect(location()).toBe("/?lens=industrial-design");
    expect(within(row).getByRole("button", { name: "Industrial Design" })).toHaveAttribute("aria-pressed", "true");
    const moodmuse = container.querySelector("#project-moodmuse") as HTMLElement;
    expect(within(moodmuse).getByRole("button", { name: "Industrial Design" })).toHaveAttribute("aria-pressed", "true");
    // Pressing the same skill on a card clears it everywhere.
    fireEvent.click(within(moodmuse).getByRole("button", { name: "Industrial Design" }));
    expect(location()).toBe("/");
    expect(within(row).getByRole("button", { name: "Industrial Design" })).toHaveAttribute("aria-pressed", "false");
  });

  it("holds up the shipped projects from the row, with no Shipped chip on any card", () => {
    const { container } = renderAt("/");
    const row = container.querySelector(`#${LENS_ROW_ID}`) as HTMLElement;
    fireEvent.click(within(row).getByRole("button", { name: SHIPPED }));
    expect(location()).toBe("/?lens=shipped");
    expect(lensOf(container, "moti")).toBe("match");
    expect(lensOf(container, "oryne")).toBe("match");
    expect(lensOf(container, "aura")).toBe("dim");
    expect(lensOf(container, "neuralyfe")).toBe("dim");
    // The row's chip is the only pressed control; the cards say "shipped" with
    // their App Store link, not with a chip.
    const pressed = container.querySelectorAll('button[aria-pressed="true"]');
    expect(pressed.length).toBe(1);
    expect(pressed[0].closest(`#${LENS_ROW_ID}`)).not.toBeNull();
    const bar = container.querySelector(`#${LENS_BAR_ID}`) as HTMLElement;
    expect(bar.textContent).toContain(SHIPPED);
    expect(bar.textContent).toContain("2 of 8 projects here");
    expect(within(bar).getByRole("link", { name: /2 in Studio/ })).toHaveAttribute("href", "/studio?lens=shipped");
  });

  it("offers the site's own design system from the Design Systems lens", () => {
    const { container } = renderAt("/?lens=design-systems");
    const bar = container.querySelector(`#${LENS_BAR_ID}`) as HTMLElement;
    expect(bar.textContent).toContain("0 of 8 projects here");
    expect(within(bar).getByRole("link", { name: /1 in Studio/ })).toHaveAttribute("href", "/studio?lens=design-systems");
    expect(within(bar).getByRole("link", { name: /This site's design system/ })).toHaveAttribute("href", "/design-system");
    // No such link under any other lens.
    cleanup();
    const other = renderAt("/?lens=shipped").container;
    expect(within(other.querySelector(`#${LENS_BAR_ID}`) as HTMLElement).queryByRole("link", { name: /design system/i })).toBeNull();
  });

  it("ignores a lens it does not know", () => {
    const { container } = renderAt("/?lens=basket-weaving");
    expect(container.querySelector(`#${LENS_BAR_ID}`)).toBeNull();
    expect(container.querySelector("[data-lens]")).toBeNull();
  });
});

describe("skill lens on Studio", () => {
  it("dims the tiles the same way and links back to Work", () => {
    const { container } = renderAt(`${SECTIONS.studio.path}?lens=industrial-design`, "studio");
    expect(lensOf(container, "zeat")).toBe("match");
    expect(lensOf(container, "ranger")).toBe("match");
    expect(lensOf(container, "calmmouse")).toBe("dim");
    const bar = container.querySelector(`#${LENS_BAR_ID}`) as HTMLElement;
    expect(bar.textContent).toContain("2 of 5 projects here");
    expect(within(bar).getByRole("link", { name: /2 in Work/ })).toHaveAttribute("href", "/?lens=industrial-design");
    // The same row of lenses, under the page header.
    const row = container.querySelector(`#${LENS_ROW_ID}`) as HTMLElement;
    expect(row).not.toBeNull();
    expect(within(row).getByRole("button", { name: "Industrial Design" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("skill chips outside a lens", () => {
  it("stay passive labels where there is no lens to control (Next up, specimens)", () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard
          project={{
            id: "moti",
            title: "Moti",
            description: "An AI-native planner",
            role: "Product Designer & Builder",
            year: "2026",
            skills: ["AI-Native"],
            destination: { kind: "case-study" },
          }}
          projectId="moti"
          dotClass=""
          globalIndex={0}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("AI-Native").tagName).toBe("SPAN");
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("[data-lens]")).toBeNull();
  });
});
