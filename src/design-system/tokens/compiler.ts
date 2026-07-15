import type {
  DtcgColor,
  DtcgDimension,
  DtcgDuration,
  DtcgType,
  DtcgValue,
  TokenBundle,
  TokenIssue,
  TokenRecord,
  TokenSource,
} from "./types";

const ALIAS_PATTERN = /^\{([^{}]+)\}$/;
const SUPPORTED_TYPES = new Set<DtcgType>([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "duration",
  "cubicBezier",
  "number",
]);
const RECOGNIZED_PROPERTIES = new Set([
  "$value",
  "$type",
  "$description",
  "$deprecated",
  "$extensions",
]);
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const FONT_WEIGHT_NAMES = new Set([
  "thin",
  "hairline",
  "extra-light",
  "ultra-light",
  "light",
  "normal",
  "regular",
  "book",
  "medium",
  "semi-bold",
  "demi-bold",
  "bold",
  "extra-bold",
  "ultra-bold",
  "black",
  "heavy",
  "extra-black",
  "ultra-black",
]);
const CSS_GENERIC_FONT_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
]);

interface FlattenedToken {
  path: string;
  sourceFile: string;
  type: DtcgType;
  value: DtcgValue;
  description: string;
  aliasOf?: string;
}

export class TokenCompilationError extends Error {
  constructor(public readonly issues: TokenIssue[]) {
    super(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
    this.name = "TokenCompilationError";
  }
}

export function tokenPathToCssVariable(path: string): `--${string}` {
  return `--${path
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()}`;
}

export function formatTokenCss(type: DtcgType, value: DtcgValue): string {
  if (type === "color") {
    const color = value as DtcgColor;
    const [h, s, l] = color.components;
    const channels = `${h} ${formatHslPercentage(s)} ${formatHslPercentage(l)}`;
    return color.alpha === undefined || color.alpha === 1
      ? channels
      : `${channels} / ${color.alpha}`;
  }
  if (type === "dimension" || type === "duration") {
    const measured = value as DtcgDimension | DtcgDuration;
    return `${measured.value}${measured.unit}`;
  }
  if (type === "cubicBezier") {
    return `cubic-bezier(${(value as number[]).join(", ")})`;
  }
  if (type === "fontFamily") {
    const family = Array.isArray(value) ? value : [value];
    return family
      .map((name) => formatFontFamily(String(name)))
      .join(", ");
  }
  return String(value);
}

function formatHslPercentage(value: number | "none"): string {
  return value === "none" ? value : `${value}%`;
}

function formatFontFamily(value: string): string {
  return CSS_GENERIC_FONT_FAMILIES.has(value.toLowerCase())
    ? value
    : quoteCssString(value);
}

function quoteCssString(value: string): string {
  let result = "'";
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (character === "'" || character === "\\") {
      result += `\\${character}`;
    } else if (codePoint === 0) {
      result += "\\fffd ";
    } else if (codePoint <= 0x1f || codePoint === 0x7f) {
      result += `\\${codePoint.toString(16)} `;
    } else {
      result += character;
    }
  }
  return `${result}'`;
}

export function compileTokenSources(sources: TokenSource[]): TokenBundle {
  const documents = Object.create(null) as Record<string, Record<string, unknown>>;
  const flattened = new Map<string, FlattenedToken>();
  const issues: TokenIssue[] = [];

  for (const source of sources) {
    if (Object.prototype.hasOwnProperty.call(documents, source.filename)) {
      issues.push({
        path: source.filename,
        code: "duplicate-source",
        message: "Source filename is duplicated.",
      });
      continue;
    }

    const document = structuredClone(source.document);
    documents[source.filename] = document;
    flattenNode(document, [], undefined, source.filename, flattened, issues);
  }

  if (issues.length > 0) throw new TokenCompilationError(sortIssues(issues));
  collectCssVariableCollisionIssues(flattened, issues);
  if (issues.length > 0) throw new TokenCompilationError(sortIssues(issues));

  const resolved = resolveAliases(flattened, issues);
  if (issues.length > 0) throw new TokenCompilationError(sortIssues(issues));

  const dependents = collectDependents(flattened);
  const tokens = [...flattened.values()]
    .sort((left, right) => compareStrings(left.path, right.path))
    .map<TokenRecord>((token) => {
      const resolvedValue = resolved.get(token.path);
      if (resolvedValue === undefined) {
        throw new Error(`Token "${token.path}" was not resolved.`);
      }
      return {
        path: token.path,
        sourceFile: token.sourceFile,
        type: token.type,
        value: structuredClone(token.value),
        resolvedValue: structuredClone(resolvedValue),
        description: token.description,
        cssVariable: tokenPathToCssVariable(token.path),
        cssValue: formatTokenCss(token.type, resolvedValue),
        ...(token.aliasOf === undefined ? {} : { aliasOf: token.aliasOf }),
        dependents: dependents.get(token.path) ?? [],
      };
    });

  return {
    schemaVersion: 1,
    tokenHash: fnv1a(stableSerialize(documents)),
    documents,
    tokens,
  };
}

function collectCssVariableCollisionIssues(
  flattened: Map<string, FlattenedToken>,
  issues: TokenIssue[],
): void {
  const pathsByVariable = new Map<string, string[]>();
  for (const token of flattened.values()) {
    const cssVariable = tokenPathToCssVariable(token.path);
    const paths = pathsByVariable.get(cssVariable) ?? [];
    paths.push(token.path);
    pathsByVariable.set(cssVariable, paths);
  }

  for (const [cssVariable, paths] of [...pathsByVariable.entries()].sort(
    ([left], [right]) => compareStrings(left, right),
  )) {
    if (paths.length < 2) continue;
    const sortedPaths = [...paths].sort(compareStrings);
    for (const path of sortedPaths) {
      const otherPaths = sortedPaths.filter((otherPath) => otherPath !== path);
      const description = otherPaths.length === 1
        ? `token path "${otherPaths[0]}"`
        : `token paths ${otherPaths.map((otherPath) => `"${otherPath}"`).join(", ")}`;
      issues.push({
        path,
        code: "css-variable-collision",
        message: `CSS variable "${cssVariable}" also represents ${description}.`,
      });
    }
  }
}

function flattenNode(
  node: unknown,
  segments: string[],
  inheritedType: DtcgType | undefined,
  sourceFile: string,
  flattened: Map<string, FlattenedToken>,
  issues: TokenIssue[],
): void {
  const path = segments.join(".");
  const displayPath = path || sourceFile;

  if (!isRecord(node)) {
    issues.push({
      path: displayPath,
      code: "invalid-node",
      message: "Token groups and tokens must be objects.",
    });
    return;
  }

  for (const property of Object.keys(node)) {
    if (property.startsWith("$") && !RECOGNIZED_PROPERTIES.has(property)) {
      issues.push({
        path: path ? `${path}.${property}` : property,
        code: "unknown-property",
        message: `Property "${property}" is not recognized.`,
      });
    } else if (!property.startsWith("$") && isAmbiguousName(property)) {
      issues.push({
        path: path ? `${path}.${property}` : property,
        code: "ambiguous-name",
        message: `Token and group name "${property}" cannot contain ".", "{", or "}".`,
      });
    }
  }

  let type = inheritedType;
  if (node.$type !== undefined) {
    if (isSupportedType(node.$type)) {
      type = node.$type;
    } else {
      issues.push({
        path: displayPath,
        code: "unsupported-type",
        message: `Type "${String(node.$type)}" is not supported.`,
      });
    }
  }

  if (node.$description !== undefined && typeof node.$description !== "string") {
    issues.push({
      path: displayPath,
      code: "invalid-description",
      message: "$description must be a string.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(node, "$extensions") &&
    !isRecord(node.$extensions)
  ) {
    issues.push({
      path: displayPath,
      code: "invalid-extensions",
      message: "$extensions must be a non-array object.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(node, "$deprecated") &&
    typeof node.$deprecated !== "boolean" &&
    typeof node.$deprecated !== "string"
  ) {
    issues.push({
      path: displayPath,
      code: "invalid-deprecated",
      message: "$deprecated must be a boolean or string.",
    });
  }

  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
    for (const childName of Object.keys(node).filter(
      (property) => !property.startsWith("$"),
    )) {
      issues.push({
        path: path ? `${path}.${childName}` : childName,
        code: "token-child",
        message: `Token "${displayPath}" cannot contain child token or group "${childName}".`,
      });
    }

    if (!path) {
      issues.push({
        path: displayPath,
        code: "invalid-token-path",
        message: "A token must have a named path.",
      });
      return;
    }
    if (type === undefined) {
      issues.push({
        path,
        code: "missing-type",
        message: "Token has no explicit or inherited $type.",
      });
      return;
    }

    const value = node.$value;
    const aliasOf = aliasTarget(value);
    if (aliasOf === undefined) {
      const validationMessage = validateValue(type, value);
      if (validationMessage !== undefined) {
        issues.push({ path, code: "invalid-value", message: validationMessage });
        return;
      }
    }

    if (flattened.has(path)) {
      issues.push({
        path,
        code: "duplicate-token",
        message: "Token path is defined more than once.",
      });
      return;
    }

    flattened.set(path, {
      path,
      sourceFile,
      type,
      value: value as DtcgValue,
      description: typeof node.$description === "string" ? node.$description : "",
      ...(aliasOf === undefined ? {} : { aliasOf }),
    });
    return;
  }

  for (const [name, child] of Object.entries(node)) {
    if (name.startsWith("$") || isAmbiguousName(name)) continue;
    flattenNode(child, [...segments, name], type, sourceFile, flattened, issues);
  }
}

function isAmbiguousName(value: string): boolean {
  return /[.{}]/.test(value);
}

function resolveAliases(
  flattened: Map<string, FlattenedToken>,
  issues: TokenIssue[],
): Map<string, DtcgValue> {
  const resolved = new Map<string, DtcgValue>();
  const visiting = new Set<string>();

  const resolve = (path: string, stack: string[]): DtcgValue | undefined => {
    if (resolved.has(path)) return resolved.get(path);

    if (visiting.has(path)) {
      const cycleStart = stack.indexOf(path);
      const cycle = [...stack.slice(cycleStart), path];
      issues.push({
        path,
        code: "circular-alias",
        message: `Circular alias detected: ${cycle.join(" -> ")}.`,
      });
      return undefined;
    }

    const token = flattened.get(path);
    if (token === undefined) return undefined;

    visiting.add(path);
    let value: DtcgValue | undefined;

    if (token.aliasOf === undefined) {
      value = token.value;
    } else {
      const target = flattened.get(token.aliasOf);
      if (target === undefined) {
        issues.push({
          path,
          code: "missing-alias",
          message: `Alias target "${token.aliasOf}" does not exist.`,
        });
      } else if (target.type !== token.type) {
        issues.push({
          path,
          code: "incompatible-alias",
          message: `Alias target "${token.aliasOf}" has type "${target.type}", not "${token.type}".`,
        });
      } else {
        value = resolve(token.aliasOf, [...stack, path]);
      }
    }

    visiting.delete(path);
    if (value !== undefined) resolved.set(path, structuredClone(value));
    return value;
  };

  for (const path of [...flattened.keys()].sort(compareStrings)) resolve(path, []);
  return resolved;
}

function collectDependents(
  flattened: Map<string, FlattenedToken>,
): Map<string, string[]> {
  const directDependents = new Map<string, string[]>();
  for (const path of flattened.keys()) directDependents.set(path, []);
  for (const token of flattened.values()) {
    if (token.aliasOf === undefined) continue;
    directDependents.get(token.aliasOf)?.push(token.path);
  }

  const dependents = new Map<string, string[]>();
  const collect = (path: string): string[] => {
    const cached = dependents.get(path);
    if (cached !== undefined) return cached;

    const closure = new Set<string>();
    for (const directPath of directDependents.get(path) ?? []) {
      closure.add(directPath);
      for (const transitivePath of collect(directPath)) {
        closure.add(transitivePath);
      }
    }
    const sorted = [...closure].sort(compareStrings);
    dependents.set(path, sorted);
    return sorted;
  };

  for (const path of flattened.keys()) collect(path);
  return dependents;
}

function validateValue(type: DtcgType, value: unknown): string | undefined {
  if (type === "color") {
    if (!isRecord(value) || value.colorSpace !== "hsl") {
      return "Color values must use the hsl color space.";
    }
    if (!Array.isArray(value.components) || value.components.length !== 3) {
      return "Color components must contain exactly three numbers or \"none\" values.";
    }
    const [hue, saturation, lightness] = value.components;
    if (
      hue !== "none" &&
      (!isFiniteNumber(hue) || hue < 0 || hue >= 360)
    ) {
      return 'Color hue must be "none" or a finite number from 0 (inclusive) to 360 (exclusive).';
    }
    if (
      !isHslPercentage(saturation) ||
      !isHslPercentage(lightness)
    ) {
      return 'Color saturation and lightness must be "none" or finite numbers between 0 and 100.';
    }
    if (
      value.alpha !== undefined &&
      (!isFiniteNumber(value.alpha) || value.alpha < 0 || value.alpha > 1)
    ) {
      return "Color alpha must be a finite number between 0 and 1.";
    }
    if (
      value.hex !== undefined &&
      (typeof value.hex !== "string" || !HEX_COLOR_PATTERN.test(value.hex))
    ) {
      return "Color hex fallback must match #RRGGBB.";
    }
    return undefined;
  }

  if (type === "dimension") {
    return isMeasurement(value, ["px", "rem"])
      ? undefined
      : 'Dimensions must contain a finite value and a "px" or "rem" unit.';
  }

  if (type === "duration") {
    return isMeasurement(value, ["ms", "s"])
      ? undefined
      : 'Durations must contain a finite value and an "ms" or "s" unit.';
  }

  if (type === "cubicBezier") {
    if (
      !Array.isArray(value) ||
      value.length !== 4 ||
      !value.every(isFiniteNumber)
    ) {
      return "Cubic Bézier values must contain exactly four finite numbers.";
    }
    return value[0] >= 0 && value[0] <= 1 && value[2] >= 0 && value[2] <= 1
      ? undefined
      : "Cubic Bézier x coordinates must be between 0 and 1.";
  }

  if (type === "fontFamily") {
    return (typeof value === "string" && value.length > 0) ||
      (Array.isArray(value) &&
        value.length > 0 &&
        value.every((name) => typeof name === "string" && name.length > 0))
      ? undefined
      : "Font families must be a non-empty string or a non-empty array of non-empty strings.";
  }

  if (type === "fontWeight") {
    return (typeof value === "string" && FONT_WEIGHT_NAMES.has(value)) ||
      (isFiniteNumber(value) && value >= 1 && value <= 1000)
      ? undefined
      : "Font weights must be a documented name or a finite number between 1 and 1000.";
  }

  return isFiniteNumber(value) ? undefined : "Number values must be finite numbers.";
}

function isHslPercentage(value: unknown): boolean {
  return value === "none" ||
    (isFiniteNumber(value) && value >= 0 && value <= 100);
}

function aliasTarget(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return ALIAS_PATTERN.exec(value)?.[1];
}

function isMeasurement(value: unknown, units: readonly string[]): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.value) &&
    typeof value.unit === "string" &&
    units.includes(value.unit)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isSupportedType(value: unknown): value is DtcgType {
  return typeof value === "string" && SUPPORTED_TYPES.has(value as DtcgType);
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort(compareStrings)
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
      .join(",")}}`;
  }
  const serialized = JSON.stringify(value);
  return serialized === undefined ? "null" : serialized;
}

function fnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(value)) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function sortIssues(issues: TokenIssue[]): TokenIssue[] {
  return [...issues].sort((left, right) => {
    const pathOrder = compareStrings(left.path, right.path);
    return pathOrder === 0 ? compareStrings(left.code, right.code) : pathOrder;
  });
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
