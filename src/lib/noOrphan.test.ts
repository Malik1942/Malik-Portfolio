import { describe, expect, it } from "vitest";

import { noOrphan } from "./noOrphan";

const nbsp = "\u00a0";

describe("noOrphan", () => {
  it("does not glue titles shorter than five words", () => {
    expect(noOrphan("Rules as Contracts")).toBe("Rules as Contracts");
    expect(noOrphan("The Ship Gate")).toBe("The Ship Gate");
    expect(noOrphan("Author")).toBe("Author");
  });

  it("glues the last two words of a longer block", () => {
    expect(noOrphan("Zero commits until the human replies.")).toBe(
      `Zero commits until the human${nbsp}replies.`,
    );
  });
});
