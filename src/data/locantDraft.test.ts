import { describe, expect, it } from "vitest";
import { getProjectDetail } from "./projectDetails";
import { getProject } from "./projects";

// The Locant case study is a draft on its own branch. Until Malik wires it to
// the card, the card keeps opening the product site, and the second test holds
// that line. Delete that test in the change that connects them.
describe("Locant case study draft", () => {
  const doc = getProjectDetail("locant");

  it("tells the story in the spec's nine sections, each headed by a claim", () => {
    expect(doc).toBeDefined();
    expect(doc!.sections.map((s) => s.id)).toEqual([
      "intro",
      "highlights",
      "problem",
      "landscape",
      "decisions",
      "build",
      "final-design",
      "measured",
      "reflection",
    ]);
    for (const s of doc!.sections) expect(s.headline, s.id).toBeTruthy();
  });

  it("opens on a reel of the pointing, with a still as its poster and reduced-motion fallback", () => {
    expect(doc!.heroVideo).toBeTruthy();
    expect(doc!.heroImage).toBeTruthy();
  });

  it("is not connected to the card yet: the card still opens the product site", () => {
    expect(getProject("locant")?.destination).toEqual({ kind: "external", url: "https://locant.malikzhang.com" });
  });

  it("keeps Malik's copy rules: no clause dashes, and never solo", () => {
    const strings: string[] = [doc!.title, doc!.heroSummary];
    for (const card of doc!.metaCards ?? []) strings.push(card.label, card.value);
    for (const s of doc!.sections) {
      strings.push(s.label, s.headline ?? "", s.body);
      for (const f of s.figures ?? []) {
        if (f.type === "embed") continue;
        strings.push(f.label ?? "", f.caption ?? "", "alt" in f ? f.alt : "");
      }
    }
    const copy = strings.join("\n");
    expect(copy).not.toMatch(/[–—]/);
    expect(copy).not.toMatch(/\b(solo|alone|by myself)\b/i);
  });
});
