import { Buffer } from "node:buffer";

const API_ROOT = "https://api.github.com";
const PINNED_OWNER = "Malik1942";
const PINNED_REPO = "Malik-Portfolio";
const API_VERSION = "2022-11-28";
const MAX_RESPONSE_BYTES = 1024 * 1024;
const ALLOWED_PATHS = new Set([
  "tokens/primitive.tokens.json",
  "tokens/semantic.tokens.json",
  "tokens/component.tokens.json",
]);
const SHA_PATTERN = /^[0-9a-f]{40}$/;

export interface GithubConfiguration {
  token: string;
  owner: string;
  repo: string;
}

export interface GithubBase {
  commitSha: string;
  treeSha: string;
}

export interface GithubTokenFile {
  path: string;
  content: string;
}

export interface GithubBlobInput {
  path: string;
  content: string;
}

export interface GithubTreeEntry {
  path: string;
  sha: string;
}

export interface GithubPublisher {
  readMain(): Promise<GithubBase>;
  readTokenFiles(commitSha: string, paths: readonly string[]): Promise<GithubTokenFile[]>;
  createBlobs(files: GithubBlobInput[]): Promise<GithubTreeEntry[]>;
  createTree(baseTreeSha: string, entries: GithubTreeEntry[]): Promise<string>;
  createCommit(input: { message: string; treeSha: string; parentSha: string }): Promise<string>;
  createRef(branch: string, commitSha: string): Promise<void>;
  createPullRequest(input: {
    title: string;
    body: string;
    head: string;
    base: "main";
  }): Promise<{ pullRequestUrl: string; pullRequestNumber: number }>;
}

export class GithubConfigurationError extends Error {
  constructor() {
    super("GitHub publishing configuration is unavailable.");
    this.name = "GithubConfigurationError";
  }
}

export class GithubApiError extends Error {
  constructor(
    public readonly operation: string,
    public readonly status: number,
  ) {
    super("GitHub publishing operation failed.");
    this.name = "GithubApiError";
  }
}

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export function createGithubPublisher(
  config: GithubConfiguration,
  fetchImpl: FetchLike = fetch,
): GithubPublisher {
  if (
    config.owner !== PINNED_OWNER ||
    config.repo !== PINNED_REPO ||
    typeof config.token !== "string" ||
    !/^[\x21-\x7e]{1,512}$/.test(config.token)
  ) {
    throw new GithubConfigurationError();
  }

  const repositoryRoot = `${API_ROOT}/repos/${PINNED_OWNER}/${PINNED_REPO}`;
  const headers = {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
  };

  const request = async (
    operation: string,
    path: string,
    init: RequestInit = {},
    expectJson = true,
  ): Promise<unknown> => {
    let response: Response;
    try {
      response = await fetchImpl(`${repositoryRoot}${path}`, {
        ...init,
        headers: {
          ...headers,
          ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
        },
      });
    } catch {
      throw new GithubApiError(operation, 502);
    }

    if (!response.ok) throw new GithubApiError(operation, response.status);
    if (!expectJson) return null;

    let raw: string;
    try {
      raw = await response.text();
    } catch {
      throw new GithubApiError(operation, 502);
    }
    if (Buffer.byteLength(raw, "utf8") > MAX_RESPONSE_BYTES) {
      throw new GithubApiError(operation, 502);
    }
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      throw new GithubApiError(operation, 502);
    }
  };

  return {
    async readMain() {
      const reference = await request("read_main", "/git/ref/heads/main");
      const commitSha = readNestedSha(reference, ["object", "sha"], "read_main");
      const commit = await request("read_main", `/git/commits/${commitSha}`);
      const responseCommitSha = readNestedSha(commit, ["sha"], "read_main");
      const treeSha = readNestedSha(commit, ["tree", "sha"], "read_main");
      if (responseCommitSha !== commitSha) throw new GithubApiError("read_main", 502);
      return { commitSha, treeSha };
    },

    async readTokenFiles(commitSha, paths) {
      requireSha(commitSha, "read_token_files");
      requireAllowedPaths(paths, "read_token_files");
      return Promise.all(paths.map(async (path) => {
        const encodedPath = path.split("/").map(encodeURIComponent).join("/");
        const value = await request(
          "read_token_files",
          `/contents/${encodedPath}?ref=${commitSha}`,
        );
        if (!isRecord(value) || value.type !== "file" || value.encoding !== "base64" || typeof value.content !== "string") {
          throw new GithubApiError("read_token_files", 502);
        }
        return { path, content: decodeBase64Utf8(value.content, "read_token_files") };
      }));
    },

    async createBlobs(files) {
      requireAllowedPaths(files.map((file) => file.path), "create_blobs");
      return Promise.all(files.map(async (file) => {
        if (typeof file.content !== "string") throw new GithubApiError("create_blobs", 502);
        const value = await request("create_blobs", "/git/blobs", {
          method: "POST",
          body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
        });
        return { path: file.path, sha: readNestedSha(value, ["sha"], "create_blobs") };
      }));
    },

    async createTree(baseTreeSha, entries) {
      requireSha(baseTreeSha, "create_tree");
      requireAllowedPaths(entries.map((entry) => entry.path), "create_tree");
      for (const entry of entries) requireSha(entry.sha, "create_tree");
      const value = await request("create_tree", "/git/trees", {
        method: "POST",
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: entries.map((entry) => ({
            path: entry.path,
            mode: "100644",
            type: "blob",
            sha: entry.sha,
          })),
        }),
      });
      return readNestedSha(value, ["sha"], "create_tree");
    },

    async createCommit(input) {
      requireSha(input.treeSha, "create_commit");
      requireSha(input.parentSha, "create_commit");
      if (typeof input.message !== "string" || input.message.length === 0 || input.message.length > 256) {
        throw new GithubApiError("create_commit", 502);
      }
      const value = await request("create_commit", "/git/commits", {
        method: "POST",
        body: JSON.stringify({
          message: input.message,
          tree: input.treeSha,
          parents: [input.parentSha],
        }),
      });
      return readNestedSha(value, ["sha"], "create_commit");
    },

    async createRef(branch, commitSha) {
      requireSafeBranch(branch, "create_ref");
      requireSha(commitSha, "create_ref");
      await request("create_ref", "/git/refs", {
        method: "POST",
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitSha }),
      }, false);
    },

    async createPullRequest(input) {
      requireSafeBranch(input.head, "create_pr");
      if (
        input.base !== "main" ||
        typeof input.title !== "string" ||
        typeof input.body !== "string"
      ) throw new GithubApiError("create_pr", 502);
      const value = await request("create_pr", "/pulls", {
        method: "POST",
        body: JSON.stringify(input),
      });
      if (!isRecord(value) || typeof value.html_url !== "string" || !Number.isInteger(value.number) || (value.number as number) <= 0) {
        throw new GithubApiError("create_pr", 502);
      }
      if (!isCanonicalPullRequestUrl(value.html_url, value.number as number)) {
        throw new GithubApiError("create_pr", 502);
      }
      return { pullRequestUrl: value.html_url, pullRequestNumber: value.number as number };
    },
  };
}

function requireAllowedPaths(paths: readonly string[], operation: string): void {
  if (
    paths.length === 0 ||
    new Set(paths).size !== paths.length ||
    !paths.every((path) => ALLOWED_PATHS.has(path))
  ) throw new GithubApiError(operation, 502);
}

function requireSha(value: string, operation: string): void {
  if (!SHA_PATTERN.test(value)) throw new GithubApiError(operation, 502);
}

function requireSafeBranch(value: string, operation: string): void {
  if (
    value.length > 160 ||
    !/^design-system\/[a-z0-9][a-z0-9._/-]*$/.test(value) ||
    value.includes("..") ||
    value.includes("//") ||
    value.endsWith("/") ||
    value.endsWith(".") ||
    value.split("/").some((part) => part.startsWith(".") || part.endsWith(".lock"))
  ) throw new GithubApiError(operation, 502);
}

function readNestedSha(value: unknown, keys: string[], operation: string): string {
  let current = value;
  for (const key of keys) {
    if (!isRecord(current) || !Object.prototype.hasOwnProperty.call(current, key)) {
      throw new GithubApiError(operation, 502);
    }
    current = current[key];
  }
  if (typeof current !== "string" || !SHA_PATTERN.test(current)) {
    throw new GithubApiError(operation, 502);
  }
  return current;
}

function decodeBase64Utf8(value: string, operation: string): string {
  const compact = value.replace(/\s/g, "");
  if (
    compact.length === 0 ||
    compact.length > MAX_RESPONSE_BYTES * 2 ||
    compact.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(compact)
  ) throw new GithubApiError(operation, 502);
  const bytes = Buffer.from(compact, "base64");
  if (bytes.toString("base64") !== compact) throw new GithubApiError(operation, 502);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new GithubApiError(operation, 502);
  }
}

function isCanonicalPullRequestUrl(value: string, number: number): boolean {
  try {
    const url = new URL(value);
    return url.origin === "https://github.com" &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === "" &&
      url.pathname === `/${PINNED_OWNER}/${PINNED_REPO}/pull/${number}`;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
