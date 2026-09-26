import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTOPLAY_DWELL_MS, ProjectCard } from "./ProjectList";

// A Selected Work frame plays its cover motion once by itself, the first time
// the visitor settles on it: the reel runs through and rests on its closing
// title card, and Aura's wordmark reveals and stays. After that the card is
// back to hover. None of this is visible when it breaks — a reel that never
// starts looks exactly like a still — so each piece is pinned here.
//
// Only Selected Work does this. More Work, Studio and the "Next up" cards still
// wait for hover; coverVideoPlayback.test.tsx holds that.

// framer-motion's useInView needs IntersectionObserver, which jsdom does not ship.
// Every observer is recorded with its threshold, so a test can put the card
// *mostly* on screen (the autoplay's 0.6) separately from *touching* it.
type Entries = { isIntersecting: boolean; target: Element }[];
type Observer = {
  callback: (entries: Entries) => void;
  elements: Set<Element>;
  rootMargin: string;
  threshold: number;
};
const observers: Observer[] = [];

const realMatchMedia = window.matchMedia;

beforeEach(() => {
  observers.length = 0;
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      private entry: Observer;
      constructor(callback: (entries: Entries) => void, options?: IntersectionObserverInit) {
        const threshold = options?.threshold;
        this.entry = {
          callback,
          elements: new Set(),
          rootMargin: options?.rootMargin ?? "",
          threshold: typeof threshold === "number" ? threshold : 0,
        };
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
  document.body.classList.add("loaded");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.matchMedia = realMatchMedia;
  document.body.classList.remove("loaded");
  cleanup();
});

const stubMedia = () => {
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();
  Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, writable: true, value: play });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, writable: true, value: pause });
  return { play, pause };
};

const reel = {
  title: "Moti",
  description: "An AI-native planner",
  role: "Product Designer & Builder",
  year: "2026",
  coverImage: "/moti-card-poster.webp",
  coverVideo: "/moti-card.mp4",
};

const mark = {
  title: "Aura",
  description: "AI-powered anticipatory motion sickness relief",
  role: "Product Designer",
  year: "2025",
  coverImage: "/aura-cover.webp",
  coverAspect: "2400/1350",
  coverPlate: "/aura-cover-plate.webp",
  coverMark: "/aura-cover-mark.webp",
};

const renderCard = (project: typeof reel | typeof mark, featured = true) => {
  const view = render(
    <MemoryRouter>
      <ProjectCard project={project} projectId="card" dotClass="bg-dot-red" globalIndex={0} featured={featured} />
    </MemoryRouter>,
  );
  // The card's own still has landed, which is when a reel is allowed on the wire.
  act(() => {
    const still = view.container.querySelector("video + img");
    if (still) fireEvent.load(still);
  });
  return view;
};

// Scroll so the card is mostly on screen: every observer reports it, the
// autoplay's 0.6-threshold one included.
const settleOn = () =>
  act(() => {
    for (const { callback, elements } of [...observers]) {
      if (elements.size === 0) continue;
      callback([...elements].map((target) => ({ isIntersecting: true, target })));
    }
  });

// Scroll it fully off screen.
const scrollAway = () =>
  act(() => {
    for (const { callback, elements, rootMargin } of [...observers]) {
      if (elements.size === 0 || rootMargin.includes("%")) continue;
      callback([...elements].map((target) => ({ isIntersecting: false, target })));
    }
  });

const dwell = (ms = AUTOPLAY_DWELL_MS) => act(() => vi.advanceTimersByTime(ms));

const parts = (container: HTMLElement) => ({
  card: container.querySelector("#project-card") as HTMLElement,
  video: container.querySelector("video") as HTMLVideoElement,
  poster: container.querySelector("video + img") as HTMLImageElement,
});

const onTouchScreen = () => {
  window.matchMedia = (query: string) => {
    const list = realMatchMedia(query);
    if (!query.includes("hover: none")) return list;
    return { ...list, matches: true, media: query };
  };
};

describe("Selected Work reel autoplay", () => {
  it("plays once from the start when the visitor settles on the card", () => {
    const { play } = stubMedia();
    const { container } = renderCard(reel);
    const { video, poster } = parts(container);
    video.currentTime = 3;

    settleOn();
    expect(play).not.toHaveBeenCalled();
    dwell();

    expect(play).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
    expect(poster.style.opacity).toBe("0");
  });

  it("does not start for a card the visitor only scrolls past", () => {
    const { play } = stubMedia();
    renderCard(reel);

    settleOn();
    dwell(AUTOPLAY_DWELL_MS - 50);
    scrollAway();
    dwell(AUTOPLAY_DWELL_MS);

    expect(play).not.toHaveBeenCalled();
  });

  it("rests on the closing frame, and never plays by itself again", () => {
    const { play } = stubMedia();
    const { container } = renderCard(reel);
    const { video, poster } = parts(container);

    settleOn();
    dwell();
    fireEvent.ended(video);
    // The reels close on their own title card, so the last frame stays up.
    expect(poster.style.opacity).toBe("0");

    scrollAway();
    settleOn();
    dwell();
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("parks on the poster if the visitor scrolls away mid-reel, and plays on the next visit", () => {
    const { play, pause } = stubMedia();
    const { container } = renderCard(reel);
    const { video, poster } = parts(container);

    settleOn();
    dwell();
    video.currentTime = 4;
    scrollAway();

    expect(pause).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
    expect(poster.style.opacity).not.toBe("0");

    settleOn();
    dwell();
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("keeps playing when the pointer crosses the card mid-reel", () => {
    const { play, pause } = stubMedia();
    const { container } = renderCard(reel);
    const { card, video } = parts(container);

    settleOn();
    dwell();
    video.currentTime = 4;
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
    expect(video.currentTime).toBe(4);
  });

  it("hands back to hover once it has played: enter replays, leave parks on the poster", () => {
    const { play } = stubMedia();
    const { container } = renderCard(reel);
    const { card, video, poster } = parts(container);

    settleOn();
    dwell();
    fireEvent.ended(video);

    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.currentTime).toBe(0);

    video.currentTime = 5;
    fireEvent.mouseLeave(card);
    expect(video.currentTime).toBe(0);
    expect(poster.style.opacity).not.toBe("0");
  });

  it("waits for the loading screen to lift", () => {
    const { play } = stubMedia();
    document.body.classList.remove("loaded");
    renderCard(reel);

    settleOn();
    dwell();
    expect(play).not.toHaveBeenCalled();
  });

  it("stays on hover everywhere but Selected Work", () => {
    const { play } = stubMedia();
    renderCard(reel, false);

    settleOn();
    dwell();
    expect(play).not.toHaveBeenCalled();
  });

  it("does not play by itself on a touch screen", () => {
    onTouchScreen();
    const { play } = stubMedia();
    renderCard(reel);

    settleOn();
    dwell();
    expect(play).not.toHaveBeenCalled();
  });
});

describe("Selected Work wordmark autoplay", () => {
  const markState = (container: HTMLElement) =>
    container.querySelector('img[src="/aura-cover-mark.webp"]')?.getAttribute("data-mark");

  it("reveals the wordmark once the visitor settles on the card, and keeps it", () => {
    const { container } = renderCard(mark);
    const { card } = parts(container);
    expect(markState(container)).toBe("hidden");

    settleOn();
    dwell();
    expect(markState(container)).toBe("shown");

    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    scrollAway();
    expect(markState(container)).toBe("shown");
  });

  it("does not reveal it for a card the visitor only scrolls past", () => {
    const { container } = renderCard(mark);

    settleOn();
    dwell(AUTOPLAY_DWELL_MS - 50);
    scrollAway();
    dwell(AUTOPLAY_DWELL_MS);

    expect(markState(container)).toBe("hidden");
  });
});
