import { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";
import type { PublishRequest, PublishSuccess } from "../../src/design-system/publish/client";
import { applyOverrides, compileTokenSources, TokenCompilationError } from "../../src/design-system/tokens/compiler";
import type { TokenOverrides } from "../../src/design-system/tokens/types";
import {
  GithubApiError,
  GithubConfigurationError,
  type GithubBlobInput,
  type GithubPublisher,
  type GithubTokenFile,
  type GithubTreeEntry,
} from "./github";

export const MAX_REQUEST_BYTES = 64 * 1024;
export const ALLOWED_TOKEN_FILES = [
  "tokens/primitive.tokens.json",
  "tokens/semantic.tokens.json",
  "tokens/component.tokens.json",
] as const;

const REQUEST_KEYS = [
  "baseCommitSha",
  "baseTokenHash",
  "overrides",
  "password",
  "summary",
  "title",
];
const SHA_PATTERN = /^[0-9a-f]{40}$/;
const TOKEN_HASH_PATTERN = /^[0-9a-f]{8}$/;
const PASSWORD_HASH_PATTERN = /^[0-9a-f]{64}$/;
const ALIAS_PATTERN = /^\{[^{}]+\}$/;
const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export interface PublishEnvironment {
  passwordHash?: string;
}

export interface PublishDependencies {
  now: () => Date;
  randomSuffix: () => string;
  rateLimited?: (request: Request) => boolean | Promise<boolean>;
}

export interface PublishResult {
  status: number;
  body: Record<string, unknown> | PublishSuccess;
}

export type GithubPublisherSource = GithubPublisher | (() => GithubPublisher);

const DEFAULT_DEPENDENCIES: PublishDependencies = {
  now: () => new Date(),
  randomSuffix: () => createHash("sha256")
    .update(`${Date.now()}-${Math.random()}`)
    .digest("hex")
    .slice(0, 12),
};

export async function publishTokens(
  rawRequest: unknown,
  env: PublishEnvironment,
  githubSource: GithubPublisherSource,
  dependencies: PublishDependencies = DEFAULT_DEPENDENCIES,
): Promise<PublishResult> {
  const request = parsePublishRequest(rawRequest);
  if (!request) return errorResult(400, "invalid_request", "The publish request is invalid.");

  if (!verifyPassword(request.password, env.passwordHash)) {
    return errorResult(401, "unauthorized", "Publish authorization failed.");
  }

  if (Object.values(request.overrides).some(isAliasOverride)) {
    return errorResult(422, "invalid_draft", "The token draft is invalid.");
  }

  let github: GithubPublisher;
  try {
    github = typeof githubSource === "function" ? githubSource() : githubSource;
  } catch {
    return errorResult(503, "service_unavailable", "Publishing is temporarily unavailable.");
  }

  let base: Awaited<ReturnType<GithubPublisher["readMain"]>>;
  try {
    base = await github.readMain();
  } catch (error) {
    return githubReadFailure(error);
  }
  if (!SHA_PATTERN.test(base.commitSha) || !SHA_PATTERN.test(base.treeSha)) {
    return errorResult(502, "github_failure", "GitHub returned an invalid response.");
  }
  if (base.commitSha !== request.baseCommitSha) {
    return errorResult(409, "stale_production", "Production changed. Rebase the local draft.");
  }

  let remoteFiles: GithubTokenFile[];
  try {
    remoteFiles = await github.readTokenFiles(base.commitSha, ALLOWED_TOKEN_FILES);
  } catch (error) {
    return githubReadFailure(error);
  }
  if (!hasExactAllowedFiles(remoteFiles)) {
    return errorResult(502, "github_failure", "GitHub returned an invalid token source set.");
  }

  const parsedDocuments = new Map<string, Record<string, unknown>>();
  try {
    for (const file of remoteFiles) {
      const parsed: unknown = JSON.parse(file.content);
      if (!isPlainRecord(parsed)) {
        return errorResult(422, "invalid_draft", "The production token sources are invalid.");
      }
      parsedDocuments.set(file.path, parsed);
    }
  } catch {
    return errorResult(422, "invalid_draft", "The production token sources are invalid.");
  }

  let currentBundle;
  try {
    currentBundle = compileTokenSources(ALLOWED_TOKEN_FILES.map((path) => ({
      filename: basename(path),
      document: parsedDocuments.get(path)!,
    })));
  } catch (error) {
    if (error instanceof TokenCompilationError) {
      return errorResult(422, "invalid_draft", "The production token sources are invalid.");
    }
    return errorResult(503, "service_unavailable", "Publishing is temporarily unavailable.");
  }

  if (currentBundle.tokenHash !== request.baseTokenHash) {
    return errorResult(409, "stale_production", "Token sources changed. Rebase the local draft.");
  }

  const currentTokens = new Map(currentBundle.tokens.map((token) => [token.path, token]));
  if (Object.entries(request.overrides).some(([path, value]) => {
    const current = currentTokens.get(path);
    return current !== undefined && stableValueSerialize(current.value) === stableValueSerialize(value);
  })) {
    return errorResult(422, "invalid_draft", "The token draft contains an unchanged override.");
  }

  let nextBundle;
  try {
    nextBundle = applyOverrides(currentBundle, request.overrides);
  } catch (error) {
    if (error instanceof TokenCompilationError) {
      return errorResult(422, "invalid_draft", "The token draft is invalid.");
    }
    return errorResult(503, "service_unavailable", "Publishing is temporarily unavailable.");
  }

  const serializedCurrent = serializeDocuments(currentBundle.documents);
  const serializedNext = serializeDocuments(nextBundle.documents);
  const changedFiles: GithubBlobInput[] = ALLOWED_TOKEN_FILES
    .filter((path) => serializedCurrent.get(path) !== serializedNext.get(path))
    .map((path) => ({ path, content: serializedNext.get(path)! }));
  if (changedFiles.length === 0) {
    return errorResult(422, "invalid_draft", "The token draft does not change production.");
  }

  const changedTokens = Object.keys(request.overrides).sort(compareStrings);
  const branch = createBranchName(request.title, dependencies);
  const pullRequestBody = createPullRequestBody(
    request,
    changedTokens,
    currentBundle.tokenHash,
    nextBundle.tokenHash,
  );
  let refCreated = false;

  try {
    const entries = await github.createBlobs(changedFiles);
    if (!validTreeEntries(entries, changedFiles)) throw new GithubApiError("create_blobs", 502);
    const treeSha = await github.createTree(base.treeSha, entries);
    if (!SHA_PATTERN.test(treeSha)) throw new GithubApiError("create_tree", 502);
    const commitSha = await github.createCommit({
      message: request.title,
      treeSha,
      parentSha: base.commitSha,
    });
    if (!SHA_PATTERN.test(commitSha)) throw new GithubApiError("create_commit", 502);
    await github.createRef(branch, commitSha);
    refCreated = true;
    const published = await github.createPullRequest({
      title: request.title,
      body: pullRequestBody,
      head: branch,
      base: "main",
    });
    return {
      status: 201,
      body: {
        ...published,
        branch,
        changedTokens,
      },
    };
  } catch {
    if (refCreated) {
      return {
        status: 502,
        body: {
          code: "github_pr_failed",
          message: "GitHub could not create the pull request after creating the branch.",
          branch,
        },
      };
    }
    return errorResult(502, "github_failure", "GitHub publishing failed.");
  }
}

export async function publishTokensFromRequest(
  request: Request,
  env: PublishEnvironment,
  github: GithubPublisherSource,
  dependencies: PublishDependencies = DEFAULT_DEPENDENCIES,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse(errorResult(405, "method_not_allowed", "Only POST is supported."), {
      Allow: "POST",
    });
  }

  if (!isJsonContentType(request.headers.get("content-type"))) {
    return jsonResponse(errorResult(415, "unsupported_media_type", "Content-Type must be application/json."));
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) {
      return jsonResponse(errorResult(400, "invalid_request", "Content-Length is invalid."));
    }
    if (Number(contentLength) > MAX_REQUEST_BYTES) {
      return jsonResponse(errorResult(413, "payload_too_large", "The publish request is too large."));
    }
  }

  if (await dependencies.rateLimited?.(request)) {
    return jsonResponse(errorResult(429, "rate_limited", "Too many publish attempts. Try again later."));
  }

  let bytes: ArrayBuffer;
  try {
    bytes = await request.arrayBuffer();
  } catch {
    return jsonResponse(errorResult(400, "invalid_request", "The publish request body could not be read."));
  }
  if (bytes.byteLength > MAX_REQUEST_BYTES) {
    return jsonResponse(errorResult(413, "payload_too_large", "The publish request is too large."));
  }

  let raw: string;
  try {
    raw = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return jsonResponse(errorResult(400, "invalid_json", "The publish request is not valid JSON."));
  }
  let body: unknown;
  try {
    body = JSON.parse(raw) as unknown;
  } catch {
    return jsonResponse(errorResult(400, "invalid_json", "The publish request is not valid JSON."));
  }

  const result = await publishTokens(body, env, github, dependencies);
  return jsonResponse(result);
}

function parsePublishRequest(value: unknown): PublishRequest | null {
  if (!isPlainRecord(value)) return null;
  if (Object.keys(value).sort(compareStrings).join("\0") !== REQUEST_KEYS.join("\0")) return null;
  if (
    typeof value.password !== "string" ||
    typeof value.baseCommitSha !== "string" ||
    !SHA_PATTERN.test(value.baseCommitSha) ||
    typeof value.baseTokenHash !== "string" ||
    !TOKEN_HASH_PATTERN.test(value.baseTokenHash) ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    !isPlainRecord(value.overrides) ||
    Object.keys(value.overrides).length === 0 ||
    !Object.values(value.overrides).every((override) => isJsonDtcgValue(override))
  ) return null;

  const title = value.title.trim();
  const summary = value.summary.trim();
  if (title.length < 8 || title.length > 120 || summary.length < 12 || summary.length > 2000) {
    return null;
  }

  return {
    password: value.password,
    baseCommitSha: value.baseCommitSha,
    baseTokenHash: value.baseTokenHash,
    title,
    summary,
    overrides: structuredClone(value.overrides) as TokenOverrides,
  };
}

function verifyPassword(password: string, configuredHash: string | undefined): boolean {
  const suppliedDigest = createHash("sha256").update(password, "utf8").digest();
  const validConfiguration = typeof configuredHash === "string" && PASSWORD_HASH_PATTERN.test(configuredHash);
  const expectedDigest = validConfiguration
    ? Buffer.from(configuredHash, "hex")
    : Buffer.alloc(32);
  const matches = timingSafeEqual(suppliedDigest, expectedDigest);
  return validConfiguration && matches;
}

function serializeDocuments(
  documents: Record<string, Record<string, unknown>>,
): Map<string, string> {
  return new Map(ALLOWED_TOKEN_FILES.map((path) => {
    const document = documents[basename(path)];
    return [path, `${JSON.stringify(document, null, 2)}\n`];
  }));
}

function createBranchName(title: string, dependencies: PublishDependencies): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "token-update";
  const timestamp = dependencies.now().toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z")
    .toLowerCase();
  const suffix = dependencies.randomSuffix()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12) || "000000";
  return `design-system/${slug}-${timestamp}-${suffix}`.slice(0, 160);
}

function createPullRequestBody(
  request: PublishRequest,
  changedTokens: string[],
  beforeHash: string,
  afterHash: string,
): string {
  const safeSummary = request.password.length === 0
    ? request.summary
    : request.summary.split(request.password).join("[redacted]");
  return [
    "## Rationale",
    "",
    safeSummary,
    "",
    "## Direct token changes",
    "",
    ...changedTokens.map((path) => `- \`${path}\``),
    "",
    `Before token hash: \`${beforeHash}\``,
    `After token hash: \`${afterHash}\``,
    "",
    "Validation: passed",
    "Warnings: none",
    "",
    "## Vercel preview review",
    "",
    "- [ ] Review desktop layout",
    "- [ ] Review mobile layout",
    "- [ ] Review contrast",
    "- [ ] Review reduced motion",
  ].join("\n");
}

function hasExactAllowedFiles(files: GithubTokenFile[]): boolean {
  return files.length === ALLOWED_TOKEN_FILES.length &&
    new Set(files.map((file) => file.path)).size === files.length &&
    files.every((file) =>
      ALLOWED_TOKEN_FILES.includes(file.path as (typeof ALLOWED_TOKEN_FILES)[number]) &&
      typeof file.content === "string"
    );
}

function validTreeEntries(entries: GithubTreeEntry[], files: GithubBlobInput[]): boolean {
  const expected = files.map((file) => file.path).sort(compareStrings);
  const actual = entries.map((entry) => entry.path).sort(compareStrings);
  return expected.join("\0") === actual.join("\0") &&
    new Set(actual).size === actual.length &&
    entries.every((entry) => SHA_PATTERN.test(entry.sha));
}

function githubReadFailure(error: unknown): PublishResult {
  return error instanceof GithubConfigurationError
    ? errorResult(503, "service_unavailable", "Publishing is temporarily unavailable.")
    : errorResult(502, "github_failure", "GitHub publishing failed.");
}

function errorResult(status: number, code: string, message: string): PublishResult {
  return { status, body: { code, message } };
}

function jsonResponse(result: PublishResult, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function isJsonContentType(value: string | null): boolean {
  if (value === null) return false;
  const [mediaType, ...parameters] = value.split(";").map((part) => part.trim().toLowerCase());
  if (mediaType !== "application/json") return false;
  return parameters.every((parameter) => parameter === "charset=utf-8");
}

function isJsonDtcgValue(value: unknown, seen = new Set<object>(), depth = 0): boolean {
  if (depth > 16) return false;
  if (typeof value === "string") return value.length <= MAX_REQUEST_BYTES;
  if (typeof value === "number") return Number.isFinite(value);
  if (value === null || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);

  if (Array.isArray(value)) {
    if (value.length === 0 || Object.keys(value).length !== value.length) return false;
    return value.every((item) => isJsonDtcgValue(item, seen, depth + 1));
  }
  if (!isPlainRecord(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 0 || keys.some((key) => DANGEROUS_KEYS.has(key))) return false;
  return Object.values(value).every((item) => isJsonDtcgValue(item, seen, depth + 1));
}

function isAliasOverride(value: unknown): boolean {
  return typeof value === "string" && ALIAS_PATTERN.test(value);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function basename(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableValueSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableValueSerialize).join(",")}]`;
  }
  if (isPlainRecord(value)) {
    return `{${Object.keys(value).sort(compareStrings).map((key) =>
      `${JSON.stringify(key)}:${stableValueSerialize(value[key])}`
    ).join(",")}}`;
  }
  return JSON.stringify(value);
}
