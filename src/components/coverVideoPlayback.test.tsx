import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";

// A cover video is not ambient wallpaper: it stays on its poster until the
// visitor asks for it by hovering, runs from the opening frame, and parks again
// when the pointer leaves. Every piece of that is invisible if it breaks — an
// `autoPlay` attribute slipping back in looks fine on a card you are already
// looking at, and only misbehaves for the visitor who scrolls down to it.

// framer-motion's useInView needs IntersectionObserver, which jsdom does not ship.
// This stub records every observer the tree creates — the card body registers one
// of its own for its entrance animation, and framer pools observers by options, so
// grabbing only the most recent one silently watches the wrong element.
type Entries = { isIntersecting: boolean; target: Element }[];

type Observer = {
  callback: (entries: Entries) => void;
  elements: Set<Element>;
  rootMargin: string;
};

const observers: Observer[] = [];

// Whether the device can hover. The shared setup stub answers false to every
// query except reduced motion, which would read as "touch device" and start the
// scroll-driven playback in every test. Each block picks its own answer.
let canHover = true;

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(hover: hover)" ? canHover : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      private entry: Observer;
      constructor(callback: (entries: Entries) => void, options?: IntersectionObserverInit) {
        this.entry = { callback, elements: new Set(), rootMargin: options?.rootMargin ?? "" };
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
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
  canHover = true;
});

// jsdom has no media pipeline: play() is unimplemented and currentTime never
// advances on its own. Standing in for both lets us assert on intent — what the
// card asked the element to do — which is the part we actually wrote.
const stubMedia = () => {
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: play,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    writable: true,
    value: pause,
  });
  return { play, pause };
};

const project = {
  title: "Moti",
  description: "An AI-native planner",
  role: "Product Designer & Builder",
  year: "2026",
  coverImage: "/moti-card-poster.webp",
  coverVideo: "/moti-card.mp4",
};

// The reel is queued behind the page load and the card's own still (see the
// fetch-order tests below). The playback tests are about what happens after
// that, so they start with both conditions met and the card already within a
// viewport of the screen, the way any card a pointer can reach has been: the
// page marked loaded before the card mounts, the still's load event fired
// straight after, and the approach observer reporting the card near.
const markPageLoaded = () =>
  act(() => {
    document.body.classList.add("loaded");
    window.dispatchEvent(new Event("page-loaded"));
  });

const loadStill = (container: HTMLElement) =>
  act(() => {
    const still = container.querySelector("img[aria-hidden]");
    if (still) fireEvent.load(still);
  });

const mountCard = () =>
  render(
    <MemoryRouter>
      <ProjectCard project={project} projectId="moti" dotClass="bg-dot-red" globalIndex={0} imageRight />
    </MemoryRouter>,
  );

const renderCard = () => {
  document.body.classList.add("loaded");
  const view = mountCard();
  loadStill(view.container);
  approach();
  return view;
};

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

// Scroll to within a viewport of the card, without any of it being on screen yet:
// only the observer that watches an expanded margin sees it.
const approach = () =>
  act(() => {
    for (const { callback, elements, rootMargin } of [...observers]) {
      if (elements.size === 0 || !rootMargin.includes("%")) continue;
      callback([...elements].map((target) => ({ isIntersecting: true, target })));
    }
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
    const { play } = stubMedia();
    renderCard();

    expect(play).not.toHaveBeenCalled();
  });

  it("does not fetch the reel until the card is within a viewport of the screen", () => {
    stubMedia();
    document.body.classList.add("loaded");
    const { container } = mountCard();
    loadStill(container);
    const video = container.querySelector("video") as HTMLVideoElement;

    // Far below the fold: the poster paints the card and the ½ MB clip stays on
    // the server. Every page mounts this card (the case studies reuse it in
    // "Next up" strip), so an eager src here is a download on every single visit.
    expect(video.getAttribute("src")).toBeNull();
    expect(video.getAttribute("poster")).toBe(project.coverImage);

    approach();
    expect(video.getAttribute("src")).toBe(project.coverVideo);

    // Once fetched, it stays attached — scrolling away must not tear the src
    // out of a clip that may already have played.
    leaveScreen();
    expect(video.getAttribute("src")).toBe(project.coverVideo);
  });

  it("queues the reel behind the page load and the card's own still, even within a viewport", () => {
    stubMedia();
    document.body.classList.remove("loaded");
    const { container } = mountCard();
    const video = container.querySelector("video") as HTMLVideoElement;

    // Within a viewport, but the first paint is still waiting on fonts and
    // covers: a megabyte reel must not get on the wire ahead of them.
    approach();
    expect(video.getAttribute("src")).toBeNull();

    // The page has painted, but this card's still has not landed yet.
    markPageLoaded();
    expect(video.getAttribute("src")).toBeNull();

    loadStill(container);
    expect(video.getAttribute("src")).toBe(project.coverVideo);
  });

  it("fetches at once on hover, ahead of the queue, and plays as soon as the src is attached", () => {
    const { play } = stubMedia();
    document.body.classList.remove("loaded");
    const { container } = mountCard();
    const card = container.querySelector("#project-moti") as HTMLElement;
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video.getAttribute("src")).toBeNull();

    // The pointer is the request; nothing is allowed to queue in front of it.
    fireEvent.mouseEnter(card);
    expect(video.getAttribute("src")).toBe(project.coverVideo);
    expect(play).toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
  });

  it("does not play when the card arrives — only hover does that", () => {
    const { play } = stubMedia();
    renderCard();

    arriveOnScreen();

    expect(play).not.toHaveBeenCalled();
  });

  it("does not play on a second pass through the viewport either", () => {
    const { play } = stubMedia();
    renderCard();

    arriveOnScreen();
    leaveScreen();
    arriveOnScreen();

    expect(play).not.toHaveBeenCalled();
  });

  it("keeps the poster covering the reel until the pointer enters", () => {
    stubMedia();
    const { container } = renderCard();
    const card = container.querySelector("#project-moti") as HTMLElement;
    const poster = [...container.querySelectorAll("img")].find(
      (img) => img.getAttribute("src") === project.coverImage,
    ) as HTMLImageElement;

    approach();
    expect(poster).toBeTruthy();
    expect(poster.style.opacity).not.toBe("0");

    fireEvent.mouseEnter(card);
    expect(poster.style.opacity).toBe("0");

    fireEvent.mouseLeave(card);
    expect(poster.style.opacity).not.toBe("0");
  });

  it("plays from the start when the pointer enters the card", () => {
    const { play } = stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    const card = container.querySelector("#project-moti") as HTMLElement;

    video.currentTime = 4;
    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
  });

  it("parks on the opening frame when the pointer leaves", () => {
    const { play, pause } = stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    const card = container.querySelector("#project-moti") as HTMLElement;

    fireEvent.mouseEnter(card);
    video.currentTime = 9.8;
    fireEvent.mouseLeave(card);

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
  });

  it("replays from the start when the pointer re-enters the card", () => {
    const { play } = stubMedia();
    const { container } = renderCard();
    const card = container.querySelector("#project-moti") as HTMLElement;

    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(card);
    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("does not restart mid-reel while the pointer simply sits on the card", () => {
    const { play } = stubMedia();
    const { container, rerender } = renderCard();
    const card = container.querySelector("#project-moti") as HTMLElement;

    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(1);

    // Re-renders happen constantly here — parallax, scroll progress, entrance
    // animations. None of them are a new hover.
    rerender(
      <MemoryRouter>
        <ProjectCard project={project} projectId="moti" dotClass="bg-dot-red" globalIndex={0} imageRight />
      </MemoryRouter>,
    );
    fireEvent.mouseEnter(card);

    expect(play).toHaveBeenCalledTimes(1);
  });
});

// A phone has no pointer to enter the card, so there the reel has to answer to
// the scroll instead. Three rules keep that from being a literal port of hover:
// only the card nearest the middle of the screen plays, a finished reel fades
// back to the title card, and the still lifts only once a frame is really
// playing. Nothing about the desktop rules above changes.
describe("cover video playback on a device that cannot hover", () => {
  beforeEach(() => {
    canHover = false;
  });

  const findStill = (container: HTMLElement) =>
    [...container.querySelectorAll("img")].find(
      (img) => img.getAttribute("src") === project.coverImage,
    ) as HTMLImageElement;

  it("plays from the start when the cover scrolls onto the screen", () => {
    const { play } = stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;

    expect(play).not.toHaveBeenCalled();

    video.currentTime = 4;
    arriveOnScreen();

    expect(play).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
    expect(video.getAttribute("src")).toBe(project.coverVideo);
  });

  it("lifts the still only once a frame is playing, so a refused play leaves a plain still", () => {
    stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    const still = findStill(container);

    arriveOnScreen();
    // play() was asked for, but nothing has painted yet (or Low Power Mode said no).
    expect(still.style.opacity).not.toBe("0");

    fireEvent.playing(video);
    expect(still.style.opacity).toBe("0");
  });

  it("parks on the opening frame when the cover scrolls off, and replays on the way back", () => {
    const { play, pause } = stubMedia();
    const { container } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    const still = findStill(container);

    arriveOnScreen();
    fireEvent.playing(video);
    video.currentTime = 9.8;
    leaveScreen();

    expect(pause).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBe(0);
    fireEvent.pause(video);
    expect(still.style.opacity).not.toBe("0");

    arriveOnScreen();
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("fades back to the title card when the reel ends, and does not replay until the card returns", () => {
    const { play } = stubMedia();
    const { container, rerender } = renderCard();
    const video = container.querySelector("video") as HTMLVideoElement;
    const still = findStill(container);

    arriveOnScreen();
    fireEvent.playing(video);
    expect(still.style.opacity).toBe("0");

    fireEvent.ended(video);
    expect(still.style.opacity).not.toBe("0");
    expect(play).toHaveBeenCalledTimes(1);

    // Still on screen, re-rendering: no restart.
    rerender(
      <MemoryRouter>
        <ProjectCard project={project} projectId="moti" dotClass="bg-dot-red" globalIndex={0} imageRight />
      </MemoryRouter>,
    );
    expect(play).toHaveBeenCalledTimes(1);

    leaveScreen();
    arriveOnScreen();
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("does not start on the approach — only once the cover itself is on screen", () => {
    const { play } = stubMedia();
    renderCard();

    approach();

    expect(play).not.toHaveBeenCalled();
  });

  it("plays only the reel nearest the middle of the screen when two cards are on it", () => {
    const { play, pause } = stubMedia();
    const second = { ...project, title: "Oryne", coverVideo: "/oryne-card.mp4", coverImage: "/oryne.webp" };
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={project} projectId="moti" dotClass="bg-dot-red" globalIndex={0} imageRight />
        <ProjectCard project={second} projectId="oryne" dotClass="bg-dot-red" globalIndex={1} imageRight />
      </MemoryRouter>,
    );
    const [motiVideo, oryneVideo] = [...container.querySelectorAll("video")];
    // jsdom lays nothing out: give each cover a place on an 800px-tall screen.
    // Moti sits at the top edge, Oryne straddles the middle.
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    const place = (video: Element, top: number, bottom: number) => {
      video.parentElement!.getBoundingClientRect = () =>
        ({ top, bottom, height: bottom - top, left: 0, right: 375, width: 375, x: 0, y: top, toJSON() {} }) as DOMRect;
    };
    place(motiVideo, -100, 200);
    place(oryneVideo, 250, 550);

    arriveOnScreen();

    expect(play).toHaveBeenCalledTimes(1);
    expect(play.mock.instances[0]).toBe(oryneVideo);

    // Scroll on: Moti leaves, Oryne stays the only candidate and keeps playing.
    act(() => {
      for (const { callback, elements } of [...observers]) {
        if (!elements.has(motiVideo.parentElement!)) continue;
        callback([{ isIntersecting: false, target: motiVideo.parentElement! }]);
      }
    });
    expect(pause).not.toHaveBeenCalled();
    expect(play).toHaveBeenCalledTimes(1);
  });
});
