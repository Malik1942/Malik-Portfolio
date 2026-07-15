import { applyOverrides, TokenCompilationError } from "../tokens/compiler";
import type {
  DtcgValue,
  TokenBundle,
  TokenOverrides,
} from "../tokens/types";

export const DRAFT_STORAGE_KEY = "malik-design-system:draft:v1";

export interface LocalTokenDraft {
  schemaVersion: 1;
  baseTokenHash: string;
  updatedAt: string;
  overrides: TokenOverrides;
}

export interface RebasedTokenDraft {
  draft: LocalTokenDraft;
  discarded: string[];
}

export function createDraft(
  baseTokenHash: string,
  overrides: TokenOverrides,
  updatedAt = new Date().toISOString(),
): LocalTokenDraft {
  return {
    schemaVersion: 1,
    baseTokenHash,
    updatedAt,
    overrides: structuredClone(overrides),
  };
}

export function loadDraft(storage: Storage): LocalTokenDraft | null {
  const raw = storage.getItem(DRAFT_STORAGE_KEY);
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isPlainRecord(parsed) ||
      parsed.schemaVersion !== 1 ||
      typeof parsed.baseTokenHash !== "string" ||
      typeof parsed.updatedAt !== "string" ||
      !isPlainRecord(parsed.overrides)
    ) {
      return null;
    }

    return {
      schemaVersion: 1,
      baseTokenHash: parsed.baseTokenHash,
      updatedAt: parsed.updatedAt,
      overrides: parsed.overrides as TokenOverrides,
    };
  } catch {
    return null;
  }
}

export function saveDraft(
  storage: Storage,
  draft: LocalTokenDraft,
): void {
  storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function resetDraft(storage: Storage): void {
  storage.removeItem(DRAFT_STORAGE_KEY);
}

export function rebaseDraft(
  draft: LocalTokenDraft,
  bundle: TokenBundle,
): RebasedTokenDraft {
  const retained: [string, DtcgValue][] = [];
  const discarded: string[] = [];

  for (const path of Object.keys(draft.overrides).sort(compareStrings)) {
    const value = draft.overrides[path];
    try {
      applyOverrides(bundle, Object.fromEntries([
        ...retained,
        [path, value],
      ]));
      retained.push([path, structuredClone(value)]);
    } catch (error) {
      if (!(error instanceof TokenCompilationError)) throw error;
      discarded.push(path);
    }
  }

  return {
    draft: {
      schemaVersion: 1,
      baseTokenHash: bundle.tokenHash,
      updatedAt: draft.updatedAt,
      overrides: Object.fromEntries(retained),
    },
    discarded,
  };
}

export function exportDraftDocuments(
  bundle: TokenBundle,
  draft: LocalTokenDraft,
): TokenBundle["documents"] {
  return applyOverrides(bundle, draft.overrides).documents;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
