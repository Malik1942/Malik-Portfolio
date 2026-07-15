import { beforeEach, describe, expect, it } from "vitest";
import { tokenBundle } from "../generated/token-manifest.generated";
import { applyOverrides, compileTokenSources } from "../tokens/compiler";
import {
  DRAFT_STORAGE_KEY,
  createDraft,
  exportDraftDocuments,
  loadDraft,
  rebaseDraft,
  resetDraft,
  saveDraft,
} from "./draft";

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => [...entries.keys()][index] ?? null,
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, String(value));
    },
  };
}

describe("local token drafts", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("round-trips a schema-versioned patch", () => {
    const draft = createDraft(
      "abc123",
      { "duration.fast": { value: 120, unit: "ms" } },
      "2026-07-14T00:00:00.000Z",
    );

    saveDraft(storage, draft);

    expect(loadDraft(storage)).toEqual(draft);
  });

  it.each([
    ["invalid JSON", "{"],
    ["null", "null"],
    ["an array", "[]"],
    ["a primitive", JSON.stringify("draft")],
    ["a missing schema version", JSON.stringify({
      baseTokenHash: "abc123",
      updatedAt: "2026-07-14T00:00:00.000Z",
      overrides: {},
    })],
    ["an unsupported schema version", JSON.stringify({
      schemaVersion: 2,
      baseTokenHash: "abc123",
      updatedAt: "2026-07-14T00:00:00.000Z",
      overrides: {},
    })],
    ["a non-string base token hash", JSON.stringify({
      schemaVersion: 1,
      baseTokenHash: 123,
      updatedAt: "2026-07-14T00:00:00.000Z",
      overrides: {},
    })],
    ["a missing updated timestamp", JSON.stringify({
      schemaVersion: 1,
      baseTokenHash: "abc123",
      overrides: {},
    })],
    ["a non-string updated timestamp", JSON.stringify({
      schemaVersion: 1,
      baseTokenHash: "abc123",
      updatedAt: 123,
      overrides: {},
    })],
    ["null overrides", JSON.stringify({
      schemaVersion: 1,
      baseTokenHash: "abc123",
      updatedAt: "2026-07-14T00:00:00.000Z",
      overrides: null,
    })],
    ["array overrides", JSON.stringify({
      schemaVersion: 1,
      baseTokenHash: "abc123",
      updatedAt: "2026-07-14T00:00:00.000Z",
      overrides: [],
    })],
  ])("returns null for stored %s", (_label, raw) => {
    storage.setItem(DRAFT_STORAGE_KEY, raw);

    expect(loadDraft(storage)).toBeNull();
  });

  it("drops unknown overrides while rebasing", () => {
    const result = rebaseDraft(createDraft("old", {
      "duration.fast": { value: 120, unit: "ms" },
      "removed.token": 2,
    }), tokenBundle);

    expect(result.draft.overrides).toHaveProperty("duration.fast");
    expect(result.discarded).toEqual(["removed.token"]);
  });

  it("discards renamed, type-changed, and structurally invalid overrides in sorted order", () => {
    const updatedAt = "2026-07-14T00:00:00.000Z";
    const draft = createDraft("old", {
      "removed.z": 2,
      "duration.slow": { value: 120, unit: "px" },
      "duration.fast": 120,
      "duration.medium": { value: 320, unit: "ms" },
      "removed.a": 1,
    }, updatedAt);
    const draftSnapshot = structuredClone(draft);
    const bundleSnapshot = structuredClone(tokenBundle);

    const result = rebaseDraft(draft, tokenBundle);

    expect(result).toEqual({
      draft: {
        schemaVersion: 1,
        baseTokenHash: tokenBundle.tokenHash,
        updatedAt,
        overrides: {
          "duration.medium": { value: 320, unit: "ms" },
        },
      },
      discarded: ["duration.fast", "duration.slow", "removed.a", "removed.z"],
    });
    expect(draft).toEqual(draftSnapshot);
    expect(tokenBundle).toEqual(bundleSnapshot);
  });

  it("discards a later override when the retained patch would not compile together", () => {
    const bundle = compileTokenSources([{ filename: "tokens.json", document: {
      number: {
        $type: "number",
        a: { $value: 1 },
        b: { $value: 2 },
      },
    } }]);
    const draft = createDraft("old", {
      "number.b": "{number.a}",
      "number.a": "{number.b}",
    }, "2026-07-14T00:00:00.000Z");

    const result = rebaseDraft(draft, bundle);

    expect(result.draft.overrides).toEqual({
      "number.a": "{number.b}",
    });
    expect(result.discarded).toEqual(["number.b"]);
    expect(() => applyOverrides(bundle, result.draft.overrides)).not.toThrow();
  });

  it("removes only the stored draft when reset", () => {
    saveDraft(storage, createDraft("abc123", {}));
    storage.setItem("unrelated", "keep");

    resetDraft(storage);

    expect(loadDraft(storage)).toBeNull();
    expect(storage.getItem("unrelated")).toBe("keep");
  });

  it("exports fresh compiled documents without mutating the draft or bundle", () => {
    const draft = createDraft(
      tokenBundle.tokenHash,
      { "duration.fast": { value: 120, unit: "ms" } },
      "2026-07-14T00:00:00.000Z",
    );
    const draftSnapshot = structuredClone(draft);
    const bundleSnapshot = structuredClone(tokenBundle);

    const first = exportDraftDocuments(tokenBundle, draft);
    const second = exportDraftDocuments(tokenBundle, draft);

    expect(first).toEqual(applyOverrides(tokenBundle, draft.overrides).documents);
    expect(first).not.toBe(second);
    expect(first).not.toBe(tokenBundle.documents);
    expect(draft).toEqual(draftSnapshot);
    expect(tokenBundle).toEqual(bundleSnapshot);
  });
});
