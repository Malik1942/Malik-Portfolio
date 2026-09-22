import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setReducedMotionPreference } from "@/test/setup";
import {
  AGENT_REPLY,
  LocantBall,
  LocantHighlights,
  LocantLadder,
  LocantLandscape,
  LocantLinks,
  LocantMeasured,
  LocantOverlay,
  LocantPayload,
  LocantQuestion,
  LocantReleases,
  PAYLOAD_TEXT,
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

describe("Locant case-study modules", () => {
  it("plays each other moment as a silent loop, like a GIF", () => {
    const { container } = render(<LocantHighlights />);
    for (const chip of ["The element, not a screenshot", "Any Mac app, any agent", "Asked which orb: 0 of 12 runs", "v0.1 to v0.4 in three hours"]) {
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
    expect(screen.getByText("Before & After: one click flips between the orb before and after the edit")).toBeInTheDocument();
    expect(screen.getByText("Any agent: the same payload in Cursor, Claude Code, Codex, and Antigravity")).toBeInTheDocument();
  });

  it("shows each loop's first frame as a still when motion is reduced", () => {
    setReducedMotionPreference(true);
    const { container } = render(<LocantHighlights />);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    const stills = screen.getAllByRole("img");
    expect(stills).toHaveLength(4);
    for (const still of stills) expect(still).toHaveAttribute("width", "1200");
  });

  it("quotes the agent's reply to a screenshot word for word", () => {
    render(<LocantQuestion />);
    expect(AGENT_REPLY.opening).toBe("I haven’t changed anything yet, because the screenshot doesn’t show which orb you mean.");
    expect(AGENT_REPLY.question).toBe("Which orb should get them?");
    expect(screen.getByText(/Which orb should get them\?/)).toBeInTheDocument();
    expect(screen.getByText("Claude Code, given a screenshot")).toBeInTheDocument();
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

  it("shows the four real overlay captures at their intrinsic size", () => {
    render(<LocantOverlay />);
    const hover = screen.getByAltText(/the 8 key outlined in blue/);
    expect(hover).toHaveAttribute("width", "1260");
    expect(hover).toHaveAttribute("height", "840");
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByText("Option: one level up, to the keypad that holds it")).toBeInTheDocument();
  });

  it("prints Locant's payload with the image path first", () => {
    render(<LocantPayload />);
    const lines = PAYLOAD_TEXT.split("\n");
    expect(lines[0]).toBe("## Locant capture (fix)");
    expect(lines[1]).toMatch(/^Image: \/Users\/malik\/Pictures\/Locant\/locant-simulator-20260915-021609-zwec\.png$/);
    expect(screen.getByText('button "Product Ideas" · id=oceanCurrent.product ideas')).toBeInTheDocument();
  });

  it("lists the five rungs of the ladder, best first", () => {
    render(<LocantLadder />);
    const rungs = within(screen.getByRole("list", { name: "The ladder, best rung first" })).getAllByRole("listitem");
    expect(rungs.map((r) => r.getAttribute("data-rung"))).toEqual(["Identifier", "Label only", "Drawn frame", "Text and neighbors", "Image"]);
  });

  it("shows the ball's four states", () => {
    render(<LocantBall />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByAltText(/The ring: Snap, Text, Color and Cut/)).toHaveAttribute("width", "520");
  });

  it("puts v0.1 to v0.4 inside the window and the rest after it", () => {
    render(<LocantReleases />);
    const inside = within(screen.getByRole("list", { name: "Inside the window, Sep 13" })).getAllByRole("listitem");
    expect(inside.map((r) => r.getAttribute("data-tag"))).toEqual(["v0.1", "v0.2-region", "v0.3", "v0.3-actions", "v0.4"]);
    const after = within(screen.getByRole("list", { name: "After it, Sep 14 to 16" })).getAllByRole("listitem");
    expect(after.map((r) => r.getAttribute("data-tag"))).toEqual(["v0.5", "v0.6", "v0.7", "v0.7.1", "v0.8"]);
  });

  it("reports the measurement both ways and links the method", () => {
    render(<LocantMeasured />);
    for (const text of ["0 of 12", "With a screenshot, 17 of 18", "22 s", "253k", "30 of 30"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Method, transcripts, and statistics" })).toHaveAttribute(
      "href",
      "https://github.com/Malik1942/locant/blob/main/docs/video/10-measurement-v3.md",
    );
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
