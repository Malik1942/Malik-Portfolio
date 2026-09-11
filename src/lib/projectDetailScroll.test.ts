import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { scrollToProjectSection, sectionDomId } from "./projectDetailScroll";
import { setReducedMotionPreference } from "@/test/setup";

let scrollIntoViewSpy: ReturnType<typeof vi.spyOn<Element, "scrollIntoView">>;

// Built the way ProjectDetailTemplate builds it, so a change to the id shape
// fails here instead of quietly leaving the guide unable to find its sections.
const makeSection = (id: string) => {
  const el = document.createElement("div");
  el.id = sectionDomId(id);
  document.body.appendChild(el);
};

beforeEach(() => {
  scrollIntoViewSpy = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
});

afterEach(() => {
  scrollIntoViewSpy.mockRestore();
  document.body.innerHTML = "";
});

describe("scrollToProjectSection", () => {
  it("jumps without animating under reduced motion", () => {
    setReducedMotionPreference(true);
    makeSection("research");

    scrollToProjectSection("research");

    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewSpy.mock.calls[0][0]).toMatchObject({ behavior: "instant" });
  });

  it("scrolls smoothly when motion is allowed", () => {
    makeSection("research");

    scrollToProjectSection("research");

    expect(scrollIntoViewSpy.mock.calls[0][0]).toMatchObject({ behavior: "smooth" });
  });
});
