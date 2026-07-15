import { applyOverrides } from "../tokens/compiler";
import type { TokenBundle, TokenOverrides } from "../tokens/types";

export const DESIGN_PREVIEW_MESSAGE_TYPE = "malik-design-preview";

export interface DesignPreviewMessage {
  type: typeof DESIGN_PREVIEW_MESSAGE_TYPE;
  overrides: TokenOverrides;
}

export function applyDraftToRoot(
  root: HTMLElement,
  bundle: TokenBundle,
  overrides: TokenOverrides,
): void {
  const compiled = applyOverrides(bundle, overrides);
  const compiledByPath = new Map(
    compiled.tokens.map((token) => [token.path, token]),
  );
  const changedProperties = bundle.tokens.flatMap((productionToken) => {
    const previewToken = compiledByPath.get(productionToken.path);
    return previewToken !== undefined &&
        previewToken.cssValue !== productionToken.cssValue
      ? [[productionToken.cssVariable, previewToken.cssValue] as const]
      : [];
  });

  clearDraftFromRoot(root, bundle);
  for (const [property, value] of changedProperties) {
    root.style.setProperty(property, value);
  }
}

export function clearDraftFromRoot(
  root: HTMLElement,
  bundle: TokenBundle,
): void {
  for (const token of bundle.tokens) {
    root.style.removeProperty(token.cssVariable);
  }
}

export function isLocalPreviewUrl(url: URL): boolean {
  return url.searchParams.get("design-preview") === "local";
}

export function isDesignPreviewMessage(
  value: unknown,
): value is DesignPreviewMessage {
  return isPlainRecord(value) &&
    value.type === DESIGN_PREVIEW_MESSAGE_TYPE &&
    isPlainRecord(value.overrides);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
