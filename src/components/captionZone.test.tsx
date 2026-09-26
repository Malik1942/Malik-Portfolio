import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";

// The hover caption comes in two stages: anywhere on the card shows the title,
// and the pointer in the lower part of the card unfolds the details and tags.
// That lower part is the bottom 35%. It starts well above the title on every
// frame size, so moving toward the words unfolds them before the pointer gets
// there, while a pointer resting mid-card leaves the picture uncovered.

beforeEach(() => {
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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  cleanup();
});

const project = {
  title: "Oryne",
  description: "A calm capture app",
  role: "Product Designer & Builder",
  year: "2026",
  coverImage: "/oryne-card-poster.webp",
};

const CARD = { top: 0, left: 0, width: 1000, height: 600 };

const renderCard = () => {
  const view = render(
    <MemoryRouter>
      <ProjectCard project={project} projectId="oryne" dotClass="bg-dot-red" globalIndex={0} featured />
    </MemoryRouter>,
  );
  const card = view.container.querySelector("#project-oryne") as HTMLElement;
  vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
    ...CARD,
    right: CARD.width,
    bottom: CARD.height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return { ...view, card };
};

// The details block takes pointer events only while it is unfolded.
const unfolded = (card: HTMLElement) =>
  !!card.querySelector("h3 ~ div .pointer-events-auto, h3 ~ div.pointer-events-auto");

const pointAt = (card: HTMLElement, fraction: number) => {
  fireEvent.mouseEnter(card);
  fireEvent.mouseMove(card, { clientX: 500, clientY: CARD.height * fraction });
};

describe("hover caption zone", () => {
  it("unfolds the details with the pointer in the bottom 35% of the card", () => {
    const { card } = renderCard();
    pointAt(card, 0.67);
    expect(unfolded(card)).toBe(true);
  });

  it("keeps them folded with the pointer above it", () => {
    const { card } = renderCard();
    pointAt(card, 0.6);
    expect(unfolded(card)).toBe(false);
  });
});
