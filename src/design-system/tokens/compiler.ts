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
    const channels = `${h} ${s}% ${l}%`;
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
      .map((name) => (/\s/.test(String(name)) ? `'${name}'` : String(name)))
      .join(", ");
  }
  return String(value);
}

export function compileTokenSources(sources: TokenSource[]): TokenBundle {
  const documents: Record<string, Record<string, unknown>> = {};
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

  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
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
    if (name.startsWith("$")) continue;
    flattenNode(child, [...segments, name], type, sourceFile, flattened, issues);
  }
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
  const dependents = new Map<string, string[]>();
  for (const path of flattened.keys()) dependents.set(path, []);
  for (const token of flattened.values()) {
    if (token.aliasOf === undefined) continue;
    dependents.get(token.aliasOf)?.push(token.path);
  }
  for (const paths of dependents.values()) paths.sort(compareStrings);
  return dependents;
}

function validateValue(type: DtcgType, value: unknown): string | undefined {
  if (type === "color") {
    if (!isRecord(value) || value.colorSpace !== "hsl") {
      return "Color values must use the hsl color space.";
    }
    if (
      !Array.isArray(value.components) ||
      value.components.length !== 3 ||
      !value.components.every(
        (component) => isFiniteNumber(component) || component === "none",
      )
    ) {
      return "Color components must contain exactly three numbers or \"none\" values.";
    }
    if (value.alpha !== undefined && !isFiniteNumber(value.alpha)) {
      return "Color alpha must be a finite number.";
    }
    if (value.hex !== undefined && typeof value.hex !== "string") {
      return "Color hex fallback must be a string.";
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
    return Array.isArray(value) &&
      value.length === 4 &&
      value.every(isFiniteNumber)
      ? undefined
      : "Cubic Bézier values must contain exactly four finite numbers.";
  }

  if (type === "fontFamily") {
    return typeof value === "string" ||
      (Array.isArray(value) && value.every((name) => typeof name === "string"))
      ? undefined
      : "Font families must be a string or an array of strings.";
  }

  if (type === "fontWeight") {
    return typeof value === "string" || isFiniteNumber(value)
      ? undefined
      : "Font weights must be a string or finite number.";
  }

  return isFiniteNumber(value) ? undefined : "Number values must be finite numbers.";
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
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
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
