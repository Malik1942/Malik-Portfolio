import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";

// The Aura card keeps its wordmark off the cover until the pointer arrives,
// then fades and wipes it in. A phone has no pointer to arrive, so that
// layered cover would show a title card with no title on it, forever. Without
// hover the card shows the flat cover, which is the plate and the mark
// composited, so the wordmark is simply there.

// framer-motion's useInView needs IntersectionObserver, which jsdom does not ship.
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

const realMatchMedia = window.matchMedia;

afterEach(() => {
  window.matchMedia = realMatchMedia;
  vi.unstubAllGlobals();
  cleanup();
});

// The shared stub answers every query but reduced motion with `false`; a touch
// screen is the one device that answers `(hover: none)` with true.
const onTouchScreen = () => {
  window.matchMedia = (query: string) => {
    const list = realMatchMedia(query);
    if (!query.includes("hover: none")) return list;
    return { ...list, matches: true, media: query };
  };
};

const project = {
  title: "Aura",
  description: "AI-powered anticipatory motion sickness relief",
  role: "Product Designer",
  year: "2025",
  coverImage: "/aura-cover.webp",
  coverAspect: "2400/1350",
  coverPlate: "/aura-cover-plate.webp",
  coverMark: "/aura-cover-mark.webp",
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <ProjectCard project={project} projectId="aura" dotClass="bg-dot-red" globalIndex={0} imageRight />
    </MemoryRouter>,
  );

const srcs = (container: HTMLElement) =>
  [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));

describe("Aura cover wordmark", () => {
  it("waits for the pointer on a device that can hover", () => {
    const { container } = renderCard();
    expect(srcs(container)).toEqual(expect.arrayContaining(["/aura-cover-plate.webp", "/aura-cover-mark.webp"]));
    expect(srcs(container)).not.toContain("/aura-cover.webp");
  });

  it("is always on where nothing can hover", () => {
    onTouchScreen();
    const { container } = renderCard();
    expect(srcs(container)).toContain("/aura-cover.webp");
    expect(srcs(container)).not.toContain("/aura-cover-mark.webp");
    expect(srcs(container)).not.toContain("/aura-cover-plate.webp");
  });
});
