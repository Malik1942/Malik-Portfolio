import { cleanup, render } from "@testing-library/react";
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

  it("fades straight in when the page would outrun the entrance", () => {
    // jsdom's window is 768px tall; 0.75s at 5000px/s is 3750px.
    scrollingAt(5000);
    const { container } = renderCard();
    expect(container.querySelector("#project-aura")).toHaveAttribute("data-reveal", "fast-scroll");
  });
});
