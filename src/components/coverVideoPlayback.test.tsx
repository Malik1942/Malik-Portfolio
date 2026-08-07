import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";

// A cover video is not ambient wallpaper: it waits for its card to arrive, runs
// once from the opening frame, and holds on its closing frame until the visitor
// asks for it again by hovering. Every piece of that is invisible if it breaks —
// an `autoPlay` attribute slipping back in looks fine on a card you are already
// looking at, and only misbehaves for the visitor who scrolls down to it.

// framer-motion's useInView needs IntersectionObserver, which jsdom does not ship.
// This stub records every observer the tree creates — the card body registers one
// of its own for its entrance animation, and framer pools observers by options, so
// grabbing only the most recent one silently watches the wrong element.
type Entries = { isIntersecting: boolean; target: Element }[];

const observers: { callback: (entries: Entries) => void; elements: Set<Element> }[] = [];

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      private entry: { callback: (entries: Entries) => void; elements: Set<Element> };
      constructor(callback: (entries: Entries) => void) {
        this.entry = { callback, elements: new Set() };
        observers.push(this.entry);
      }
      observe(element: Element) {
        this.entry.elements.add(element);
      }
      unobserve(element: Element) {
        this.entry.elements.delete(element);
      }
      disconnect() {
        this.entry.elements.clear();
      }
      takeRecords() {
        return [];
      }
    },
  );
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  cleanup();
});

// jsdom has no media pipeline: play() is unimplemented and currentTime never
// advances on its own. Standing in for both lets us assert on intent — what the
// card asked the element to do — which is the part we actually wrote.
const stubMedia = () => {
  const play = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: play,
  });
  return play;
};

const project = {
  title: "Moti",
  description: "An AI-native planner",
  role: "Product Designer & Builder",
  year: "2026",
  coverImage: "/moti-card-poster.webp",
  coverVideo: "/moti-card.mp4",
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <ProjectCard project={project} projectId="moti" dotClass="bg-dot-red" globalIndex={0} imageRight />
    </MemoryRouter>,
  );

// Scroll the whole card onto the screen: every observer in the tree reports its
// own element as intersecting, which is what a real scroll does.
const setOnScreen = (isIntersecting: boolean) =>
  act(() => {
    for (const { callback, elements } of [...observers]) {
      if (elements.size === 0) continue;
      callback([...elements].map((target) => ({ isIntersecting, target })));
    }
  });

const arriveOnScreen = () => setOnScreen(true);
const leaveScreen = () => setOnScreen(false);

const settle = () =>
  act(() => {
    vi.advanceTimersByTime(600);
  });

describe("cover video playback", () => {
  it("does not autoplay or loop — the reel is driven from the card, not the element", () => {
    stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;

    expect(video.autoplay).toBe(false);
    expect(video.loop).toBe(false);
    // Without the poster the card paints an empty box until the first frame decodes.
    expect(video.getAttribute("poster")).toBe(project.coverImage);
  });

  it("stays parked while the card is still below the fold", () => {
    const play = stubMedia();
    renderCard();

    settle();

    expect(play).not.toHaveBeenCalled();
  });

  it("waits out the settle delay after the card arrives, then plays from the opening frame", () => {
    const play = stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    video.currentTime = 4;

    arriveOnScreen();
    // Arrival alone is not the cue — the reel would otherwise race the scroll
    // that brought it into view.
    expect(play).not.toHaveBeenCalled();

    settle();

    expect(play).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
  });

  it("ignores a card that only sweeps through the viewport", () => {
    const play = stubMedia();
    renderCard();

    // Restoring the scroll position on reload drags the page past cards the
    // visitor never sees. A one-shot in-view latch counted those as arrivals and
    // burned the reel on a card that was never actually on screen.
    arriveOnScreen();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    leaveScreen();
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(play).not.toHaveBeenCalled();

    // ...and the reel is still available once the card is genuinely settled on.
    arriveOnScreen();
    settle();

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("does not replay on a second pass through the viewport — only hover does that", () => {
    const play = stubMedia();
    renderCard();

    arriveOnScreen();
    settle();
    expect(play).toHaveBeenCalledTimes(1);

    leaveScreen();
    arriveOnScreen();
    settle();

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("replays from the start when the pointer re-enters the card", () => {
    const play = stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    const card = container.querySelector("#project-moti") as HTMLElement;

    arriveOnScreen();
    settle();
    expect(play).toHaveBeenCalledTimes(1);

    // The reel has run out and is holding on its closing frame.
    video.currentTime = 9.8;

    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.currentTime).toBe(0);

    fireEvent.mouseLeave(card);
    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(3);
  });

  it("does not restart mid-reel while the pointer simply sits on the card", () => {
    const play = stubMedia();
    const { container, rerender } = renderCard();
    const card = container.querySelector("#project-moti") as HTMLElement;

    arriveOnScreen();
    settle();
    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(2);

    // Re-renders happen constantly here — parallax, scroll progress, entrance
    // animations. None of them are a new hover.
    rerender(
      <MemoryRouter>
        <ProjectCard project={project} projectId="moti" dotClass="bg-dot-red" globalIndex={0} imageRight />
      </MemoryRouter>,
    );
    fireEvent.mouseEnter(card);

    expect(play).toHaveBeenCalledTimes(2);
  });

  it("lets an early hover win over the pending arrival start, without a double take", () => {
    const play = stubMedia();
    const { container } = renderCard();
    const card = container.querySelector("#project-moti") as HTMLElement;

    arriveOnScreen();
    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(1);

    // The arrival timer must have been cancelled, or it would yank the reel back
    // to frame 0 a moment after the hover started it.
    settle();

    expect(play).toHaveBeenCalledTimes(1);
  });
});
