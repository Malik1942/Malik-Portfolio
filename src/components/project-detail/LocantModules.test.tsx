import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setReducedMotionPreference } from "@/test/setup";
import {
  AGENT_REPLY,
  LocantBall,
  LocantCalls,
  LocantFix,
  LocantHighlights,
  LocantLadder,
  LocantLandscape,
  LocantLinks,
  LocantLoop,
  LocantMeasured,
  LocantOverlay,
  LocantPairs,
  LocantPayload,
  LocantPlan,
  LocantQuestion,
  LocantReleases,
  LocantRing,
  LocantTestSetup,
  LocantTurn,
  PAIRS,
  PAIR_TASKS,
  PAYLOAD_NOTES,
  PAYLOAD_TEXT,
  PLAN_RULE,
  PROJECT_ADVICE,
  TEST_QUESTION,
} from "./LocantModules";

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

const median = (values: number[]) => {
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
};

describe("Locant case-study modules", () => {
  it("plays each other moment as a silent loop, like a GIF", () => {
    const { container } = render(<LocantHighlights />);
    for (const chip of ["The element, not a screenshot", "Any Mac app, any agent", "Right file in half the time", "v0.1 to v0.4 in three hours"]) {
      expect(screen.getByText(chip)).toBeInTheDocument();
    }
    const loops = container.querySelectorAll("video");
    expect(loops).toHaveLength(4);
    for (const loop of loops) {
      expect(loop.loop).toBe(true);
      expect(loop.muted).toBe(true);
      expect(loop).not.toHaveAttribute("controls");
      expect(loop).toHaveAttribute("poster");
      expect(loop).toHaveAttribute("width", "1200");
      expect(loop).toHaveAttribute("height", "900");
    }
    // Each loop is titled above the frame, not captioned under it: the
    // label as an eyebrow, the words as the title, both before the video.
    expect(screen.getByText("One click flips between the orb before and after the edit")).toBeInTheDocument();
    const anyAgent = screen.getByText("The same payload in Cursor, Claude Code, Codex, and Antigravity");
    const figure = anyAgent.closest("figure") as HTMLElement;
    expect(within(figure).getByText("Any agent")).toBeInTheDocument();
    const title = figure.querySelector("figcaption") as HTMLElement;
    const loop = figure.querySelector("video") as HTMLElement;
    expect(title.compareDocumentPosition(loop) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows each loop's first frame as a still when motion is reduced", () => {
    setReducedMotionPreference(true);
    const { container } = render(<LocantHighlights />);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    const stills = screen.getAllByRole("img");
    expect(stills).toHaveLength(4);
    for (const still of stills) expect(still).toHaveAttribute("width", "1200");
  });

  it("puts the screenshot the agent was given beside its whole reply", () => {
    render(<LocantQuestion />);
    // The run's own text (v3, build-shot-2), straight quotes and all.
    expect(AGENT_REPLY.opening).toBe("I haven't changed anything yet: I can't tell from the screenshot which orb you mean.");
    expect(AGENT_REPLY.question).toBe("Which one should get the three thoughts?");
    const orbs = within(screen.getByRole("list", { name: "The five orbs it could not choose between" })).getAllByRole("listitem");
    expect(orbs.map((o) => o.getAttribute("data-orb"))).toEqual(["Product Ideas", "Cooking", "Sound & Music", "Interface Design", "Reading"]);
    expect(screen.getByAltText(/The Simulator window on Oryne's Ocean screen/)).toHaveAttribute("width", "684");
    expect(screen.getByText(/17 of 18 screenshot runs stopped here/)).toBeInTheDocument();
  });

  it("gives Locant the one row that holds all four", () => {
    const { container } = render(<LocantLandscape />);
    const rows = container.querySelectorAll("[data-tool]");
    expect(rows).toHaveLength(5);
    const mine = container.querySelectorAll('[data-mine="true"]');
    expect(mine).toHaveLength(1);
    expect(mine[0]).toHaveAttribute("data-tool", "Locant");
    expect(within(mine[0] as HTMLElement).getAllByText(/: yes\./)).toHaveLength(4);
  });

  it("pairs the first sketch with the element it became, at one size", () => {
    render(<LocantTurn />);
    const stills = screen.getAllByRole("img");
    expect(stills).toHaveLength(2);
    for (const still of stills) {
      expect(still).toHaveAttribute("width", "1096");
      expect(still).toHaveAttribute("height", "822");
    }
    expect(screen.getByText("The first idea: screenshots plus context, to help the agent design")).toBeInTheDocument();
  });

  it("shows the four real overlay captures at their intrinsic size", () => {
    render(<LocantOverlay />);
    const hover = screen.getByAltText(/the 8 key outlined in blue/);
    expect(hover).toHaveAttribute("width", "1260");
    expect(hover).toHaveAttribute("height", "840");
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByText("Option: one level up, to the keypad that holds it")).toBeInTheDocument();
  });

  it("prints Locant's payload as written, with the reasons for its order apart from it", () => {
    render(<LocantPayload />);
    const lines = PAYLOAD_TEXT.split("\n");
    expect(lines[0]).toBe("## Locant capture (fix)");
    expect(lines[1]).toMatch(/^Image: \/Users\/malik\/Pictures\/Locant\/locant-simulator-20260915-021609-zwec\.png$/);
    expect(lines[lines.length - 1]).toBe("make this orb bigger, with satellite nodes like Light And Color");
    expect(PAYLOAD_NOTES).toHaveLength(5);
    expect(within(screen.getByRole("list", { name: "Why the payload is in this order" })).getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText('button "Product Ideas" · id=oceanCurrent.product ideas')).toBeInTheDocument();
  });

  it("lists the five rungs of the ladder, best first", () => {
    render(<LocantLadder />);
    const rungs = within(screen.getByRole("list", { name: "The ladder, best rung first" })).getAllByRole("listitem");
    expect(rungs.map((r) => r.getAttribute("data-rung"))).toEqual(["Identifier", "Label", "A frame you draw", "Text and neighbors", "The image alone"]);
    expect(screen.getByText(/No element information available \(app exposes no accessibility tree\)\. Use the image\./)).toBeInTheDocument();
  });

  it("shows the ball's four states", () => {
    render(<LocantBall />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByAltText(/The ring: Snap, Text, Color and Cut/)).toHaveAttribute("width", "520");
  });

  it("sets the shipped ring against the four layouts it beat", () => {
    const { container } = render(<LocantRing />);
    const cells = container.querySelectorAll("[data-layout]");
    expect([...cells].map((c) => c.getAttribute("data-layout"))).toEqual(["Ring", "Square panel", "Pop-up list", "Stack", "Picker"]);
    const shipped = container.querySelectorAll('[data-shipped="true"]');
    expect(shipped).toHaveLength(1);
    expect(shipped[0]).toHaveAttribute("data-layout", "Ring");
  });

  it("prints the v0.1 time plan, six slots and its one rule", () => {
    render(<LocantPlan />);
    const slots = within(screen.getByRole("list", { name: "The v0.1 time plan" })).getAllByRole("listitem");
    expect(slots.map((s) => s.getAttribute("data-slot"))).toEqual(["0:00 to 0:10", "0:10 to 0:45", "0:45 to 1:30", "1:30 to 2:15", "2:15 to 2:45", "2:45 to 3:00"]);
    expect(PLAN_RULE).toBe("If a slot overruns by more than 10 minutes, cut the next slot's polish, not its core.");
  });

  it("runs the loop every version followed", () => {
    render(<LocantLoop />);
    for (const step of ["Spec", "Build", "Check", "Use"]) expect(screen.getByText(step)).toBeInTheDocument();
    expect(screen.getByText(/One spec per version, from 0\.1 to 0\.9\./)).toBeInTheDocument();
  });

  it("groups the releases as the deck does, the window first", () => {
    render(<LocantReleases />);
    const tags = (name: string) =>
      within(screen.getByRole("list", { name })).getAllByRole("listitem").map((r) => r.getAttribute("data-tag"));
    expect(tags("The three-hour build, Sep 13")).toEqual(["v0.1", "v0.2-region", "v0.3", "v0.3-actions", "v0.4"]);
    expect(tags("Ready for other people, Sep 14 to 15")).toEqual(["v0.5", "v0.6", "v0.7.1"]);
    expect(tags("Fixes from daily use, Sep 16 to 21")).toEqual(["v0.8", "v0.8.1"]);
    expect(tags("The release candidate, Sep 29 to Oct 1")).toEqual(["v0.9.0", "v0.9.1", "v0.9.2"]);
  });

  it("lays out the three checkouts and marks the one on screen", () => {
    const { container } = render(<LocantTestSetup />);
    const onScreen = container.querySelectorAll('[data-on-screen="true"]');
    expect(onScreen).toHaveLength(1);
    expect(onScreen[0]).toHaveAttribute("data-checkout", "order-cards-redesign");
    expect(screen.getByText(TEST_QUESTION)).toBeInTheDocument();
  });

  it("quotes the one sentence that fixed it, word for word", () => {
    render(<LocantFix />);
    // MarkdownBuilder.projectAdvice in the Locant repo, shipped in 0.9.1.
    expect(PROJECT_ADVICE).toBe(
      "The app on screen was built from this folder. If you are working in a different checkout of this repo (another worktree or clone), your copy is not the code on screen: change it in this folder, or ask which copy to change.",
    );
    expect(screen.getByText(PROJECT_ADVICE)).toBeInTheDocument();
    expect(screen.getByText("Added in 0.9.1")).toBeInTheDocument();
  });

  it("reports round two both ways and links the method", () => {
    render(<LocantMeasured />);
    for (const text of ["39 s", "80 s", "0 of 20", "14 of 20", "19 of 20", "4 of 20", "$0.55", "$1.26"]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("link", { name: "Method, both rounds, and statistics" })).toHaveAttribute(
      "href",
      "https://github.com/Malik1942/locant/blob/main/docs/video/11-measurement-worktrees.md",
    );
  });

  it("draws all 20 pairs from round two's raw data", () => {
    expect(PAIRS).toHaveLength(20);
    for (const task of PAIR_TASKS) expect(PAIRS.filter((p) => p.task === task.id)).toHaveLength(4);
    // The screenshot never reached the right file only on T3, the look-alike.
    expect(PAIRS.filter((p) => p.shot === null).map((p) => p.task)).toEqual(["T3", "T3", "T3", "T3"]);
    // The report's medians, recomputed from the pairs: 80 s and 39 s rounded.
    expect(median(PAIRS.flatMap((p) => (p.shot === null ? [] : [p.shot])))).toBeCloseTo(79.75, 2);
    expect(median(PAIRS.map((p) => p.locant))).toBeCloseTo(38.55, 2);
    // Locant reached it first in 17 of 20 pairs; a run that never got there is slowest.
    expect(PAIRS.filter((p) => p.shot === null || p.locant < p.shot)).toHaveLength(17);

    render(<LocantPairs />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(21);
    expect(within(table).getAllByText("never reached it")).toHaveLength(4);
  });

  it("closes on the three calls, in the order they were made", () => {
    render(<LocantCalls />);
    const titles = ["The element, not the window", "Cut the MCP server, shipped text plus an image path", "Removed auto-send after it interrupted a live chat"];
    const cards = titles.map((t) => screen.getByText(t));
    for (let i = 1; i < cards.length; i++) {
      expect(cards[i - 1].compareDocumentPosition(cards[i]) & Node.DOCUMENT_POSITION_FOLLOWING, `${titles[i]} after ${titles[i - 1]}`).toBeTruthy();
    }
  });

  it("links the site, GitHub, and the pitch film", () => {
    const { rerender } = render(<LocantLinks />);
    expect(screen.getByRole("link", { name: /Visit locant\.malikzhang\.com/ })).toHaveAttribute("href", "https://locant.malikzhang.com");
    expect(screen.getByRole("link", { name: /View on GitHub/ })).toHaveAttribute("href", "https://github.com/Malik1942/locant");
    expect(screen.getByRole("link", { name: /Watch the film/ })).toHaveAttribute("href", "https://www.youtube.com/watch?v=gIjtllxV-gI");
    rerender(<LocantLinks filmUrl={null} />);
    expect(screen.queryByRole("link", { name: /Watch the film/ })).toBeNull();
  });
});
