import { cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";
import { resetScrollSpeed, sampleScroll } from "@/lib/scrollSpeed";

// Every observed element is reported on screen at once, so the card reveals
// on mount and the test controls only how fast the page is moving then.
beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      private cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe(target: Element) {
        this.cb(
          [{ isIntersecting: true, target, intersectionRatio: 1 } as unknown as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

const project = {
  title: "Aura",
  description: "Anticipatory motion-sickness relief",
  role: "Product Designer",
  year: "2025",
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <ProjectCard project={project} projectId="aura" dotClass="bg-dot-red" globalIndex={0} />
    </MemoryRouter>,
  );

/** Scroll samples ending now, at `pxPerSecond`. */
const scrollingAt = (pxPerSecond: number) => {
  const now = performance.now();
  for (let i = 10; i >= 0; i--) sampleScroll(5000 - (i * 10 * pxPerSecond) / 1000, now - i * 10);
};

describe("card entrance and scroll speed", () => {
  afterEach(() => {
    cleanup();
    resetScrollSpeed();
  });

  it("plays the full entrance when the page is still", () => {
    const { container } = renderCard();
    expect(container.querySelector("#project-aura")).not.toHaveAttribute("data-reveal");
  });

  it("plays the full entrance at a reading pace", () => {
    scrollingAt(600);
    const { container } = renderCard();
    expect(container.querySelector("#project-aura")).not.toHaveAttribute("data-reveal");
  });

  it("takes the quicker entrance when the page would outrun the full one", () => {
    // jsdom's window is 768px tall; 0.75s at 5000px/s is 3750px.
    scrollingAt(5000);
    const { container } = renderCard();
    expect(container.querySelector("#project-aura")).toHaveAttribute("data-reveal", "fast-scroll");
  });

  it("keeps the rise and scale on the quicker entrance instead of snapping them", async () => {
    scrollingAt(5000);
    const { container } = renderCard();
    const card = container.querySelector("#project-aura") as HTMLElement;
    // A frame or two in, a snapped transform would already read "none".
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(card.style.transform).toMatch(/translateY|scale/);
    // And it still lands where the full entrance does.
    await waitFor(() => expect(card.style.transform).toBe("none"), { timeout: 1500 });
  });

  it("promotes the card to its own layer only while the quicker entrance plays", async () => {
    scrollingAt(5000);
    const { container } = renderCard();
    const card = container.querySelector("#project-aura") as HTMLElement;
    expect(card.style.willChange).toBe("transform");
    // Released on landing, so the cover is redrawn at full size, not left at
    // the scale it had when it was promoted.
    await waitFor(() => expect(card.style.willChange).toBe(""), { timeout: 1500 });
  });

  it("leaves the full entrance unpromoted, as it always was", () => {
    const { container } = renderCard();
    expect((container.querySelector("#project-aura") as HTMLElement).style.willChange).toBe("");
  });
});
