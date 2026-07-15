import { beforeEach, describe, expect, it } from "vitest";
import {
  compileTokenSources,
  TokenCompilationError,
} from "../tokens/compiler";
import type { TokenOverrides } from "../tokens/types";
import {
  applyDraftToRoot,
  clearDraftFromRoot,
  isDesignPreviewMessage,
  isLocalPreviewUrl,
} from "./runtime";

const aliasBundle = compileTokenSources([{ filename: "tokens.json", document: {
  duration: {
    $type: "duration",
    fast: { $value: { value: 200, unit: "ms" } },
    interaction: { $value: "{duration.fast}" },
    nested: { $value: "{duration.interaction}" },
    independent: { $value: { value: 500, unit: "ms" } },
  },
} }]);

describe("local token preview runtime", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("style");
  });

  it("applies a primitive override to its transitive aliases", () => {
    applyDraftToRoot(document.documentElement, aliasBundle, {
      "duration.fast": { value: 120, unit: "ms" },
    });

    expect(document.documentElement.style.getPropertyValue("--duration-fast"))
      .toBe("120ms");
    expect(document.documentElement.style.getPropertyValue("--duration-interaction"))
      .toBe("120ms");
    expect(document.documentElement.style.getPropertyValue("--duration-nested"))
      .toBe("120ms");
    expect(document.documentElement.style.getPropertyValue("--duration-independent"))
      .toBe("");
  });

  it("clears stale manifest overrides before applying a smaller patch", () => {
    applyDraftToRoot(document.documentElement, aliasBundle, {
      "duration.fast": { value: 120, unit: "ms" },
      "duration.independent": { value: 600, unit: "ms" },
    });

    applyDraftToRoot(document.documentElement, aliasBundle, {
      "duration.fast": { value: 140, unit: "ms" },
    });

    expect(document.documentElement.style.getPropertyValue("--duration-fast"))
      .toBe("140ms");
    expect(document.documentElement.style.getPropertyValue("--duration-interaction"))
      .toBe("140ms");
    expect(document.documentElement.style.getPropertyValue("--duration-independent"))
      .toBe("");
  });

  it("does not set manifest properties whose compiled values are unchanged", () => {
    applyDraftToRoot(document.documentElement, aliasBundle, {
      "duration.fast": { value: 200, unit: "ms" },
    });

    expect(document.documentElement.style.length).toBe(0);
  });

  it.each([
    ["unknown", {
      "duration.missing": { value: 120, unit: "ms" },
    }],
    ["invalid", {
      "duration.fast": { value: 120, unit: "px" },
    }],
  ] satisfies [string, TokenOverrides][])(
    "rejects %s overrides before mutating the root",
    (_label, overrides) => {
      document.documentElement.style.setProperty("--duration-fast", "333ms");
      document.documentElement.style.setProperty("--unrelated", "keep");

      expect(() => applyDraftToRoot(
        document.documentElement,
        aliasBundle,
        overrides,
      )).toThrow(TokenCompilationError);
      expect(document.documentElement.style.getPropertyValue("--duration-fast"))
        .toBe("333ms");
      expect(document.documentElement.style.getPropertyValue("--unrelated"))
        .toBe("keep");
    },
  );

  it("clears only manifest-owned inline properties", () => {
    document.documentElement.style.setProperty("--duration-fast", "120ms");
    document.documentElement.style.setProperty("--duration-nested", "120ms");
    document.documentElement.style.setProperty("--unrelated", "keep");
    document.documentElement.style.color = "red";

    clearDraftFromRoot(document.documentElement, aliasBundle);

    expect(document.documentElement.style.getPropertyValue("--duration-fast"))
      .toBe("");
    expect(document.documentElement.style.getPropertyValue("--duration-nested"))
      .toBe("");
    expect(document.documentElement.style.getPropertyValue("--unrelated"))
      .toBe("keep");
    expect(document.documentElement.style.color).toBe("red");
  });

  it.each([
    ["https://www.malikzhang.com/?design-preview=local", true],
    ["https://www.malikzhang.com/", false],
    ["https://www.malikzhang.com/?design-preview=", false],
    ["https://www.malikzhang.com/?design-preview=true", false],
    ["https://www.malikzhang.com/?design-preview=Local", false],
    ["https://www.malikzhang.com/local?design-preview=locality", false],
  ])("matches only the exact local preview query value for %s", (url, expected) => {
    expect(isLocalPreviewUrl(new URL(url))).toBe(expected);
  });

  it("accepts the narrow design preview message shape", () => {
    expect(isDesignPreviewMessage({
      type: "malik-design-preview",
      overrides: {
        "duration.fast": { value: 120, unit: "ms" },
      },
    })).toBe(true);
  });

  it.each([
    ["null", null],
    ["an array", []],
    ["a primitive", "malik-design-preview"],
    ["a missing type", { overrides: {} }],
    ["the wrong type", { type: "other", overrides: {} }],
    ["missing overrides", { type: "malik-design-preview" }],
    ["null overrides", { type: "malik-design-preview", overrides: null }],
    ["array overrides", { type: "malik-design-preview", overrides: [] }],
    ["primitive overrides", { type: "malik-design-preview", overrides: 1 }],
  ])("rejects %s as a design preview message", (_label, value) => {
    expect(isDesignPreviewMessage(value)).toBe(false);
  });
});
