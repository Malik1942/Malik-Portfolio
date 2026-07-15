import type { TokenOverrides } from "../tokens/types";

export interface PublishRequest {
  password: string;
  baseCommitSha: string;
  baseTokenHash: string;
  title: string;
  summary: string;
  overrides: TokenOverrides;
}

export interface PublishSuccess {
  pullRequestUrl: string;
  pullRequestNumber: number;
  branch: string;
  changedTokens: string[];
}

export type PublishErrorCode =
  | "unauthorized"
  | "stale_production"
  | "invalid_draft"
  | "upstream_failure"
  | "invalid_response"
  | "request_failed";

export class PublishError extends Error {
  readonly status: number;
  readonly code: PublishErrorCode;
  readonly recoveryBranch?: string;

  constructor(
    status: number,
    code: PublishErrorCode,
    message: string,
    recoveryBranch?: string,
  ) {
    super(message);
    this.name = "PublishError";
    this.status = status;
    this.code = code;
    if (recoveryBranch) this.recoveryBranch = recoveryBranch;
  }
}

export interface PublishOptions {
  signal?: AbortSignal;
}

const STATUS_ERRORS: Record<number, [PublishErrorCode, string]> = {
  401: ["unauthorized", "Publish authorization failed."],
  409: ["stale_production", "Production tokens changed since this draft was created."],
  422: ["invalid_draft", "The token draft was rejected by server validation."],
  502: ["upstream_failure", "GitHub publishing is temporarily unavailable."],
};

export async function publishTokenDraft(
  request: PublishRequest,
  options: PublishOptions = {},
): Promise<PublishSuccess> {
  let response: Response;
  try {
    response = await fetch("/api/design-system/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
      signal: options.signal,
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new PublishError(
      0,
      "request_failed",
      "The publish service could not be reached.",
    );
  }
  let body: unknown = null;
  try {
    body = await parseResponseBody(response);
  } catch {
    if (response.ok) {
      throw new PublishError(
        502,
        "invalid_response",
        "The publish service returned an invalid response.",
      );
    }
  }

  if (!response.ok) {
    const [code, message] = STATUS_ERRORS[response.status] ?? [
      "request_failed",
      "The publish request could not be completed.",
    ];
    const recoveryBranch = response.status === 502 &&
      isRecord(body) &&
      body.code === "github_pr_failed" &&
      typeof body.branch === "string" &&
      isSafeDesignSystemBranch(body.branch)
        ? body.branch
        : undefined;
    throw new PublishError(response.status, code, message, recoveryBranch);
  }

  if (!isPublishSuccess(body)) {
    throw new PublishError(
      502,
      "invalid_response",
      "The publish service returned an invalid response.",
    );
  }

  return body;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function isPublishSuccess(value: unknown): value is PublishSuccess {
  if (!isRecord(value)) return false;
  if (
    typeof value.pullRequestUrl !== "string" ||
    !Number.isInteger(value.pullRequestNumber) ||
    (value.pullRequestNumber as number) <= 0 ||
    !isCanonicalPullRequestUrl(value.pullRequestUrl, value.pullRequestNumber as number) ||
    typeof value.branch !== "string" ||
    !isSafeDesignSystemBranch(value.branch) ||
    !Array.isArray(value.changedTokens) ||
    value.changedTokens.length === 0 ||
    !value.changedTokens.every((path) =>
      typeof path === "string" && path.length > 0 && path.length <= 256
    ) ||
    new Set(value.changedTokens).size !== value.changedTokens.length
  ) return false;
  return true;
}

function isSafeDesignSystemBranch(value: string): boolean {
  return value.length <= 160 &&
    /^design-system\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value) &&
    !value.includes("..") &&
    !value.includes("//") &&
    !value.endsWith("/") &&
    !value.endsWith(".");
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError" ||
    isRecord(error) && error.name === "AbortError";
}

function isCanonicalPullRequestUrl(value: string, pullRequestNumber: number): boolean {
  try {
    const url = new URL(value);
    const match = /^\/[^/]+\/[^/]+\/pull\/(\d+)$/.exec(url.pathname);
    return url.origin === "https://github.com" &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === "" &&
      match !== null &&
      Number(match[1]) === pullRequestNumber;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
