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

beforeEach(() => {
  observers.length = 0;
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
    const { container } = renderCard();
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
