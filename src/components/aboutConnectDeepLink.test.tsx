import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import AboutDeepContent from "./AboutDeepContent";

// framer-motion's useInView needs IntersectionObserver, and useReducedMotion
// needs matchMedia; jsdom ships neither. Report "not intersecting" so the
// Connect section starts from its pre-reveal state, which is exactly the case
// a deep link has to recover from.
beforeAll(() => {
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
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })),
  );
});

afterEach(cleanup);

const renderAbout = (deepLinkSection?: string) =>
  render(
    <MemoryRouter>
      <AboutDeepContent isVisible deepLinkSection={deepLinkSection} />
    </MemoryRouter>,
  );

describe("/about/connect deep link", () => {
  it("gives the Connect section the anchor the scroll helper looks up", () => {
    const { container } = renderAbout();
    const section = container.querySelector("#connect");
    expect(section, "no #connect anchor for scrollToSectionNavTarget to find").not.toBeNull();
    // the helper prefers this child so the header offset lands on the heading
    expect(section!.querySelector("[data-section-header='true']")).not.toBeNull();
  });

  it("force-reveals Connect when deep-linked, so the scroll cannot land on opacity 0", async () => {
    renderAbout("connect");
    const revealed = screen
      .getByRole("heading", { name: /coffee or a climb/i })
      .closest("[style]") as HTMLElement;
    // the entrance runs on arrival instead of waiting for an intersection
    // callback that a direct scroll may never trigger
    await waitFor(() => expect(revealed.style.opacity).not.toBe("0"), { timeout: 2500 });
  });

  it("leaves the entrance animation alone for an ordinary /about visit", async () => {
    renderAbout();
    const revealed = screen
      .getByRole("heading", { name: /coffee or a climb/i })
      .closest("[style]") as HTMLElement;
    // not intersecting and not deep-linked: stays hidden, waiting to animate in
    await new Promise((r) => setTimeout(r, 400));
    expect(revealed.style.opacity).toBe("0");
  });
});
