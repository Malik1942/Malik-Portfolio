import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Index from "@/pages/Index";

/**
 * The Who I Am paragraph is evened by `text-wrap: balance`, and balance is a
 * property that stops working without saying so. Chrome applies it only to a
 * paragraph of six lines or fewer; at seven it is ignored and the copy falls
 * back to ordinary wrapping. Nothing errors, nothing logs, and the only symptom
 * is a ragged right edge — which is the state this panel shipped in, at 28% of
 * its measure, with "developer tool with a" sitting 80px short of its
 * neighbours.
 *
 * Three things hold the six lines together, and each fails silently on its own:
 * the copy's length, the width of the column it is set in, and the fact that
 * balance is scoped to md. So they are asserted here.
 *
 * Measured in Chrome against the real page, not reasoned about: at 1440 the
 * paragraph is exactly six lines and there is NO headroom — one more word
 * (222 characters) makes it seven. 1536 allows 227, and 1728 and up allow 256.
 * 1440 is the binding case and the most common laptop width, so it sets the
 * budget. If this copy needs to grow, the column has to grow with it, and the
 * new ceiling has to be re-measured in a browser: jsdom lays nothing out, so
 * this file cannot count the lines for you.
 */

const INTRO_OPENING = "Product designer trained";
/** Characters. Measured at 1440px, where the copy sits exactly on the ceiling. */
const INTRO_SIX_LINE_BUDGET = 218;

beforeAll(() => {
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Observer);
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});

afterEach(cleanup);

const introParagraph = () => {
  const { container } = render(
    <MemoryRouter>
      <Index aboutOpen />
    </MemoryRouter>,
  );
  const paragraph = Array.from(container.querySelectorAll("p")).find((p) =>
    p.textContent?.startsWith(INTRO_OPENING),
  );
  expect(paragraph, "the Who I Am paragraph is gone or its opening changed").toBeDefined();
  return paragraph!;
};

describe("About intro copy stays inside the six lines balance needs", () => {
  it("keeps the copy within its measured budget", () => {
    const text = introParagraph().textContent ?? "";
    expect(
      text.length,
      `The Who I Am copy is ${text.length} characters, over the ${INTRO_SIX_LINE_BUDGET} that fit six ` +
        `lines at 1440px. Past six lines Chrome ignores text-wrap: balance and the rag doubles, ` +
        `with nothing else failing. Either cut it back, or widen md:w-[50%] and re-measure the ` +
        `ceiling in a browser before raising this number.`,
    ).toBeLessThanOrEqual(INTRO_SIX_LINE_BUDGET);
  });

  it("scopes balance to md and leaves pretty carrying the phone", () => {
    const paragraph = introParagraph();
    // A phone runs this copy to seven lines whatever the measure, so balance can
    // never apply there. It also REPLACES text-pretty rather than adding to it,
    // so an unqualified `text-balance` silently drops phones to plain wrapping
    // and takes their rag from 28% to 69%. Both classes, and balance md-only.
    expect(paragraph.classList.contains("text-pretty"), "text-pretty carries phones").toBe(true);
    expect(paragraph.classList.contains("md:text-balance"), "balance is md-scoped").toBe(true);
    expect(
      paragraph.classList.contains("text-balance"),
      "unqualified text-balance would override text-pretty on phones",
    ).toBe(false);
  });

  it("keeps the column wide enough to reach six lines", () => {
    // The width is not a taste: at the previous 42% this copy ran to eight lines
    // and balance was being ignored. Widening is also worse before it is better
    // — 46% lands on seven lines and a 68% rag — so 50% is the value that
    // reaches six, not a value that merely looks roomier.
    const column = introParagraph().parentElement;
    expect(column?.classList.contains("md:w-[50%]"), "the intro column sets the measure").toBe(true);
  });
});
