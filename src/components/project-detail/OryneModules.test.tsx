import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setReducedMotionPreference } from "@/test/setup";
import { OryneHook } from "./OryneModules";

// framer-motion's useInView needs IntersectionObserver, which jsdom does not
// ship. Nothing here scrolls, so an observer that never reports is enough.
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
  setReducedMotionPreference(false);
  cleanup();
});

const stepTitles = [
  "Type it or say it, in under two seconds",
  "Release it, and the phone names it",
  "It joins a current of related thoughts",
  "A forgotten thought rises on its own",
];

describe("Oryne Highlights", () => {
  it("walks one thought through four silent loops, each titled before its clip", () => {
    const { container } = render(<OryneHook />);

    const loops = container.querySelectorAll("video");
    expect(loops).toHaveLength(4);
    for (const loop of loops) {
      expect(loop.loop).toBe(true);
      expect(loop.muted).toBe(true);
      expect(loop).not.toHaveAttribute("controls");
      expect(loop).toHaveAttribute("poster");
      expect(loop).toHaveAttribute("width", "660");
      expect(loop).toHaveAttribute("height", "1350");
    }

    // The titles carry the flow in order, and each one comes before the clip
    // it names, so the walkthrough reads from the titles alone.
    const figures = Array.from(container.querySelectorAll("figure"));
    expect(figures).toHaveLength(4);
    figures.forEach((figure, i) => {
      const title = within(figure).getByText(stepTitles[i]);
      expect(within(figure).getByText(`0${i + 1}`)).toBeInTheDocument();
      const loop = figure.querySelector("video") as HTMLElement;
      expect(title.compareDocumentPosition(loop) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  it("shows each step as its poster when motion is reduced", () => {
    setReducedMotionPreference(true);
    const { container } = render(<OryneHook />);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("keeps the film off the page until the button is pressed", () => {
    render(<OryneHook />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Watch the 80-second film" }));

    const dialog = screen.getByRole("dialog", { name: "The Oryne film" });
    const film = dialog.querySelector("video") as HTMLVideoElement;
    expect(film).toHaveAttribute("controls");
    expect(film.muted).toBe(false);
  });
});
