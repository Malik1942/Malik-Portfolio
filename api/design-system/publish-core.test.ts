// @vitest-environment node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { tokenBundle } from "../../src/design-system/generated/token-manifest.generated";
import type { PublishRequest } from "../../src/design-system/publish/client";
import { compileTokenSources } from "../../src/design-system/tokens/compiler";
import {
  createGithubPublisher,
  GithubApiError,
  type GithubBase,
  type GithubBlobInput,
  type GithubPublisher,
  type GithubTokenFile,
  type GithubTreeEntry,
} from "./github";
import {
  ALLOWED_TOKEN_FILES,
  MAX_REQUEST_BYTES,
  publishTokens,
  publishTokensFromRequest,
  type PublishDependencies,
  type PublishEnvironment,
} from "./publish-core";
import endpoint, { POST } from "./publish";

const PASSWORD = "correct horse battery staple";
const PASSWORD_HASH = createHash("sha256").update(PASSWORD, "utf8").digest("hex");
const BASE_SHA = "a".repeat(40);
const BASE_TREE_SHA = "b".repeat(40);
const NEXT_TREE_SHA = "c".repeat(40);
const NEXT_COMMIT_SHA = "d".repeat(40);
const ENV: PublishEnvironment = { passwordHash: PASSWORD_HASH };
const DEPS: PublishDependencies = {
  now: () => new Date("2026-07-15T12:34:56.000Z"),
  randomSuffix: () => "a1b2c3",
};

const TOKEN_FILES: GithubTokenFile[] = ALLOWED_TOKEN_FILES.map((path) => ({
  path,
  content: readFileSync(resolve(path), "utf8"),
}));
const FIXTURE_BUNDLE = compileTokenSources(TOKEN_FILES.map((file) => ({
  filename: file.path.split("/").at(-1)!,
  document: JSON.parse(file.content) as Record<string, unknown>,
})));

function validRequest(overrides: Partial<PublishRequest> = {}): PublishRequest {
  return {
    password: PASSWORD,
    baseCommitSha: BASE_SHA,
    baseTokenHash: FIXTURE_BUNDLE.tokenHash,
    title: "Adjust portfolio motion",
    summary: "Tune the fast duration after reviewing the live preview.",
    overrides: { "duration.fast": { value: 120, unit: "ms" } },
    ...overrides,
  };
}

class FakeGithub implements GithubPublisher {
  operations: string[] = [];
  tokenFiles: GithubTokenFile[] = structuredClone(TOKEN_FILES);
  base: GithubBase = { commitSha: BASE_SHA, treeSha: BASE_TREE_SHA };
  blobInputs: GithubBlobInput[] = [];
  treeEntries: GithubTreeEntry[] = [];
  treeBase = "";
  commitInput: { message: string; treeSha: string; parentSha: string } | null = null;
  refInput: { branch: string; commitSha: string } | null = null;
  prInput: { title: string; body: string; head: string; base: "main" } | null = null;
  failAt: string | null = null;

  get writeCalls() {
    return this.operations.filter((operation) => operation.startsWith("create-"));
  }

  private step(operation: string) {
    this.operations.push(operation);
    if (this.failAt === operation) {
      throw new GithubApiError(operation, 502);
    }
  }

  async readMain() {
    this.step("read-main");
    return structuredClone(this.base);
  }

  async readTokenFiles(commitSha: string, paths: readonly string[]) {
    this.step("read-token-files");
    expect(commitSha).toBe(BASE_SHA);
    expect(paths).toEqual(ALLOWED_TOKEN_FILES);
    return structuredClone(this.tokenFiles);
  }

  async createBlobs(files: GithubBlobInput[]) {
    this.step("create-blobs");
    this.blobInputs = structuredClone(files);
    return files.map((file, index) => ({
      path: file.path,
      sha: String(index + 1).repeat(40),
    }));
  }

  async createTree(baseTreeSha: string, entries: GithubTreeEntry[]) {
    this.step("create-tree");
    this.treeBase = baseTreeSha;
    this.treeEntries = structuredClone(entries);
    return NEXT_TREE_SHA;
  }

  async createCommit(input: { message: string; treeSha: string; parentSha: string }) {
    this.step("create-commit");
    this.commitInput = structuredClone(input);
    return NEXT_COMMIT_SHA;
  }

  async createRef(branch: string, commitSha: string) {
    this.step("create-ref");
    this.refInput = { branch, commitSha };
  }

  async createPullRequest(input: { title: string; body: string; head: string; base: "main" }) {
    this.step("create-pr");
    this.prInput = structuredClone(input);
    return {
      pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/42",
      pullRequestNumber: 42,
    };
  }
}

async function bodyOf(response: Response) {
  expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
  expect(response.headers.get("cache-control")).toBe("no-store");
  return response.json() as Promise<Record<string, unknown>>;
}

function jsonRequest(value: unknown, init: { method?: string; headers?: HeadersInit } = {}) {
  return new Request("https://www.malikzhang.com/api/design-system/publish", {
    method: init.method ?? "POST",
    headers: { "content-type": "application/json", ...init.headers },
    body: JSON.stringify(value),
  });
}

describe("publish request boundary", () => {
  it.each([
    [new Request("https://www.malikzhang.com/api/design-system/publish", { method: "GET" }), 405, "method_not_allowed"],
    [new Request("https://www.malikzhang.com/api/design-system/publish", { method: "POST", body: "{}" }), 415, "unsupported_media_type"],
    [new Request("https://www.malikzhang.com/api/design-system/publish", { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" }), 415, "unsupported_media_type"],
    [new Request("https://www.malikzhang.com/api/design-system/publish", { method: "POST", headers: { "content-type": "application/json", "content-length": String(MAX_REQUEST_BYTES + 1) }, body: "{}" }), 413, "payload_too_large"],
    [new Request("https://www.malikzhang.com/api/design-system/publish", { method: "POST", headers: { "content-type": "application/json", "content-length": "not-a-number" }, body: "{}" }), 400, "invalid_request"],
    [new Request("https://www.malikzhang.com/api/design-system/publish", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }), 400, "invalid_json"],
  ])("returns stable JSON before GitHub for method/media/size/JSON failures", async (request, status, code) => {
    const github = new FakeGithub();
    const response = await publishTokensFromRequest(request, ENV, github, DEPS);

    expect(response.status).toBe(status);
    expect(await bodyOf(response)).toMatchObject({ code });
    expect(github.operations).toEqual([]);
  });

  it("enforces the actual UTF-8 byte length even when content-length understates it", async () => {
    const github = new FakeGithub();
    const body = JSON.stringify({ padding: "🧪".repeat(MAX_REQUEST_BYTES) });
    const request = new Request("https://www.malikzhang.com/api/design-system/publish", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "10" },
      body,
    });

    const response = await publishTokensFromRequest(request, ENV, github, DEPS);
    expect(response.status).toBe(413);
    expect(await bodyOf(response)).toMatchObject({ code: "payload_too_large" });
    expect(github.operations).toEqual([]);
  });

  it("accepts application/json with a charset", async () => {
    const github = new FakeGithub();
    const request = jsonRequest(validRequest(), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });

    const response = await publishTokensFromRequest(request, ENV, github, DEPS);
    expect(response.status).toBe(201);
  });

  it("can return a stable platform-rate-limit response without reading GitHub", async () => {
    const github = new FakeGithub();
    const response = await publishTokensFromRequest(jsonRequest(validRequest()), ENV, github, {
      ...DEPS,
      rateLimited: () => true,
    });

    expect(response.status).toBe(429);
    expect(await bodyOf(response)).toMatchObject({ code: "rate_limited" });
    expect(github.operations).toEqual([]);
  });
});

describe("authentication and request validation", () => {
  it.each([
    undefined,
    "",
    "A".repeat(64),
    "g".repeat(64),
    "a".repeat(63),
    "a".repeat(65),
  ])("returns the same generic 401 for unavailable or malformed password configuration", async (passwordHash) => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest(), { passwordHash }, github, DEPS);
    expect(result).toMatchObject({ status: 401, body: { code: "unauthorized", message: "Publish authorization failed." } });
    expect(github.operations).toEqual([]);
  });

  it("returns the same generic 401 for the wrong password before GitHub", async () => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest({ password: "wrong password" }), ENV, github, DEPS);
    expect(result).toMatchObject({ status: 401, body: { code: "unauthorized", message: "Publish authorization failed." } });
    expect(JSON.stringify(result)).not.toContain("wrong password");
    expect(github.operations).toEqual([]);
  });

  it("does not initialize GitHub configuration for a wrong password", async () => {
    const factory = vi.fn(() => {
      throw new Error("GitHub config should not be read");
    });
    const result = await publishTokens(
      validRequest({ password: "wrong password" }),
      ENV,
      factory,
      DEPS,
    );

    expect(result).toMatchObject({ status: 401, body: { code: "unauthorized" } });
    expect(factory).not.toHaveBeenCalled();
  });

  it("does not initialize GitHub configuration for an invalid request shape", async () => {
    const factory = vi.fn(() => {
      throw new Error("GitHub config should not be read");
    });
    const result = await publishTokens({ ...validRequest(), extra: true }, ENV, factory, DEPS);

    expect(result).toMatchObject({ status: 400, body: { code: "invalid_request" } });
    expect(factory).not.toHaveBeenCalled();
  });

  it("returns a sanitized 503 when authenticated runtime GitHub configuration is unavailable", async () => {
    const factory = vi.fn(() => createGithubPublisher({
      token: "",
      owner: "Malik1942",
      repo: "Malik-Portfolio",
    }));
    const result = await publishTokens(validRequest(), ENV, factory, DEPS);

    expect(result).toMatchObject({
      status: 503,
      body: { code: "service_unavailable", message: "Publishing is temporarily unavailable." },
    });
    expect(factory).toHaveBeenCalledOnce();
    expect(JSON.stringify(result)).not.toContain("Malik1942");
  });

  it.each([
    null,
    [],
    "request",
    { ...validRequest(), extra: true },
    { ...validRequest(), title: "short" },
    { ...validRequest(), summary: "too short" },
    { ...validRequest(), baseCommitSha: "A".repeat(40) },
    { ...validRequest(), baseCommitSha: "a".repeat(39) },
    { ...validRequest(), baseTokenHash: "A1B2C3D4" },
    { ...validRequest(), baseTokenHash: "1234567" },
    { ...validRequest(), overrides: {} },
    { ...validRequest(), overrides: [] },
    { ...validRequest(), overrides: { "duration.fast": Number.NaN } },
    { ...validRequest(), overrides: { "duration.fast": Number.POSITIVE_INFINITY } },
    { ...validRequest(), overrides: { "duration.fast": null } },
    { ...validRequest(), overrides: { "duration.fast": true } },
    { ...validRequest(), overrides: { "duration.fast": { value: 1, unit: undefined } } },
  ])("rejects strict shape and non-JSON-compatible values before authentication side effects", async (request) => {
    const github = new FakeGithub();
    const result = await publishTokens(request, ENV, github, DEPS);
    expect(result).toMatchObject({ status: 400, body: { code: "invalid_request" } });
    expect(github.operations).toEqual([]);
  });

  it("rejects non-plain and dangerous request objects before GitHub", async () => {
    const inherited = Object.create({ polluted: true }) as Record<string, unknown>;
    Object.assign(inherited, validRequest());
    const dangerous = JSON.parse(JSON.stringify(validRequest()).replace(
      '"password":',
      '"__proto__":{"polluted":true},"password":',
    )) as unknown;

    for (const request of [inherited, dangerous]) {
      const github = new FakeGithub();
      const result = await publishTokens(request, ENV, github, DEPS);
      expect(result).toMatchObject({ status: 400, body: { code: "invalid_request" } });
      expect(github.operations).toEqual([]);
    }
  });

  it("trims accepted title and summary before publishing", async () => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest({
      title: "  Adjust portfolio motion  ",
      summary: "  Tune the fast duration after reviewing the live preview.  ",
    }), ENV, github, DEPS);

    expect(result.status).toBe(201);
    expect(github.prInput?.title).toBe("Adjust portfolio motion");
    expect(github.prInput?.body).toContain("Tune the fast duration after reviewing the live preview.");
  });

  it("rejects a title containing the publish credential before GitHub initialization", async () => {
    const factory = vi.fn(() => new FakeGithub());
    const result = await publishTokens(validRequest({
      title: `Adjust ${PASSWORD} tokens`,
    }), ENV, factory, DEPS);

    expect(result).toMatchObject({ status: 422, body: { code: "invalid_draft" } });
    expect(JSON.stringify(result)).not.toContain(PASSWORD);
    expect(factory).not.toHaveBeenCalled();
  });
});

describe("Vercel Web Handler export", () => {
  it("exposes the POST web handler as the default fetch handler", () => {
    expect(endpoint).toEqual({ fetch: POST });
  });
});

describe("validated token publishing", () => {
  it("creates one commit on a new branch and opens a PR in the exact safe sequence", async () => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest(), ENV, github, DEPS);

    expect(result).toEqual({
      status: 201,
      body: {
        pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/42",
        pullRequestNumber: 42,
        branch: "design-system/adjust-portfolio-motion-20260715t123456z-a1b2c3",
        changedTokens: ["duration.fast"],
      },
    });
    expect(github.operations).toEqual([
      "read-main",
      "read-token-files",
      "create-blobs",
      "create-tree",
      "create-commit",
      "create-ref",
      "create-pr",
    ]);
    expect(github.treeBase).toBe(BASE_TREE_SHA);
    expect(github.commitInput).toMatchObject({ treeSha: NEXT_TREE_SHA, parentSha: BASE_SHA });
    expect(github.refInput).toMatchObject({ commitSha: NEXT_COMMIT_SHA });
    expect(github.prInput).toMatchObject({ head: github.refInput?.branch, base: "main" });
    expect(github).not.toHaveProperty("updateRef");
    expect(github).not.toHaveProperty("updateMain");
    expect(github).not.toHaveProperty("merge");
  });

  it("compiles basename token filenames so the server hash matches the generated browser hash", async () => {
    expect(FIXTURE_BUNDLE.tokenHash).toBe(tokenBundle.tokenHash);
    const github = new FakeGithub();
    const result = await publishTokens(validRequest({ baseTokenHash: tokenBundle.tokenHash }), ENV, github, DEPS);
    expect(result.status).toBe(201);
  });

  it("creates blobs and tree entries for only the changed allowlisted documents", async () => {
    const github = new FakeGithub();
    await publishTokens(validRequest(), ENV, github, DEPS);

    expect(github.blobInputs.map((file) => file.path)).toEqual(["tokens/primitive.tokens.json"]);
    expect(github.treeEntries.map((file) => file.path)).toEqual(["tokens/primitive.tokens.json"]);
    expect(github.blobInputs[0].content).toMatch(/^\{\n {2}/);
    expect(github.blobInputs[0].content.endsWith("\n")).toBe(true);
    expect(JSON.parse(github.blobInputs[0].content)).toBeTruthy();
  });

  it("sorts direct changed paths and writes each changed document once", async () => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest({ overrides: {
      "space.1": { value: 5, unit: "px" },
      "duration.fast": { value: 120, unit: "ms" },
    } }), ENV, github, DEPS);

    expect(result.body).toMatchObject({ changedTokens: ["duration.fast", "space.1"] });
    expect(github.blobInputs).toHaveLength(1);
  });

  it("builds a secret-free PR body with rationale, direct paths, hashes, validation, warnings, and Vercel checklist", async () => {
    const github = new FakeGithub();
    await publishTokens(validRequest({
      summary: `Rationale reviewed. Credential ${PASSWORD} must never appear.`,
    }), ENV, github, DEPS);

    const body = github.prInput!.body;
    expect(body).toContain("Rationale reviewed. Credential [redacted] must never appear.");
    expect(body).toContain("`duration.fast`");
    expect(body).toContain(`Before token hash: \`${FIXTURE_BUNDLE.tokenHash}\``);
    expect(body).toMatch(/After token hash: `[0-9a-f]{8}`/);
    expect(body).toContain("Validation: passed");
    expect(body).toContain("Warnings: none");
    expect(body).toContain("Vercel preview");
    expect(body).toContain("desktop");
    expect(body).toContain("mobile");
    expect(body).toContain("contrast");
    expect(body).toContain("reduced motion");
    expect(body).not.toContain(PASSWORD);
    expect(body).not.toContain("github-token");
  });

  it("rejects a stale main SHA after only reading main", async () => {
    const github = new FakeGithub();
    github.base.commitSha = "e".repeat(40);
    const result = await publishTokens(validRequest(), ENV, github, DEPS);

    expect(result).toMatchObject({ status: 409, body: { code: "stale_production" } });
    expect(github.operations).toEqual(["read-main"]);
    expect(github.writeCalls).toEqual([]);
  });

  it("rejects a stale token hash after verified reads and before writes", async () => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest({ baseTokenHash: "00000000" }), ENV, github, DEPS);

    expect(result).toMatchObject({ status: 409, body: { code: "stale_production" } });
    expect(github.operations).toEqual(["read-main", "read-token-files"]);
    expect(github.writeCalls).toEqual([]);
  });

  it.each([
    [{ "unknown.token": 4 }, "unknown token"],
    [{ "duration.fast": { value: 2, unit: "px" } }, "type mismatch"],
    [{ "duration.fast": "{duration.slow}" }, "alias override"],
    [{ "duration.fast": { value: 200, unit: "ms" } }, "no-op override"],
    [{
      "duration.fast": { value: 200, unit: "ms" },
      "space.1": { value: 5, unit: "px" },
    }, "mixed real and no-op overrides"],
  ] as [PublishRequest["overrides"], string][])("rejects %s with no GitHub writes", async (overrides, _label) => {
    const github = new FakeGithub();
    const result = await publishTokens(validRequest({ overrides }), ENV, github, DEPS);

    expect(result).toMatchObject({ status: 422, body: { code: "invalid_draft" } });
    expect(github.writeCalls).toEqual([]);
  });

  it.each([
    ["invalid JSON", [{ path: ALLOWED_TOKEN_FILES[0], content: "{" }, ...TOKEN_FILES.slice(1)]],
    ["array document", [{ path: ALLOWED_TOKEN_FILES[0], content: "[]" }, ...TOKEN_FILES.slice(1)]],
    ["missing file", TOKEN_FILES.slice(1)],
    ["unexpected file", [...TOKEN_FILES, { path: "tokens/extra.tokens.json", content: "{}" }]],
  ])("rejects %s token sources before writes", async (_label, files) => {
    const github = new FakeGithub();
    github.tokenFiles = structuredClone(files);
    const result = await publishTokens(validRequest(), ENV, github, DEPS);

    expect(result.status).toBe(files.length === 3 ? 422 : 502);
    expect(github.writeCalls).toEqual([]);
  });

  it("returns a sanitized upstream failure without a recovery branch before ref creation", async () => {
    const github = new FakeGithub();
    github.failAt = "create-tree";
    const result = await publishTokens(validRequest(), ENV, github, DEPS);

    expect(result).toMatchObject({ status: 502, body: { code: "github_failure" } });
    expect(result.body).not.toHaveProperty("branch");
    expect(JSON.stringify(result)).not.toContain(PASSWORD);
  });

  it("returns only the sanitized recoverable branch when PR creation fails after ref", async () => {
    const github = new FakeGithub();
    github.failAt = "create-pr";
    const result = await publishTokens(validRequest(), ENV, github, DEPS);

    expect(result).toEqual({
      status: 502,
      body: {
        code: "github_pr_failed",
        message: "GitHub could not create the pull request after creating the branch.",
        branch: "design-system/adjust-portfolio-motion-20260715t123456z-a1b2c3",
      },
    });
    expect(JSON.stringify(result)).not.toContain(PASSWORD);
  });

  it("does not claim recovery when ref creation itself collides or fails", async () => {
    const github = new FakeGithub();
    github.failAt = "create-ref";
    const result = await publishTokens(validRequest(), ENV, github, DEPS);

    expect(result).toMatchObject({ status: 502, body: { code: "github_failure" } });
    expect(result.body).not.toHaveProperty("branch");
    expect(github.operations).not.toContain("create-pr");
  });
});

describe("GitHub transport", () => {
  afterEach(() => vi.restoreAllMocks());

  function githubResponse(status: number, body: unknown) {
    return new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  it("pins repository URLs and required headers while reading main and allowlisted files at the verified SHA", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(githubResponse(200, { object: { sha: BASE_SHA } }))
      .mockResolvedValueOnce(githubResponse(200, { sha: BASE_SHA, tree: { sha: BASE_TREE_SHA } }))
      .mockResolvedValueOnce(githubResponse(200, { type: "file", encoding: "base64", content: Buffer.from(TOKEN_FILES[0].content).toString("base64") }))
      .mockResolvedValueOnce(githubResponse(200, { type: "file", encoding: "base64", content: Buffer.from(TOKEN_FILES[1].content).toString("base64") }))
      .mockResolvedValueOnce(githubResponse(200, { type: "file", encoding: "base64", content: Buffer.from(TOKEN_FILES[2].content).toString("base64") }));
    const github = createGithubPublisher({ token: "github-token", owner: "Malik1942", repo: "Malik-Portfolio" }, fetchMock);

    const base = await github.readMain();
    const files = await github.readTokenFiles(base.commitSha, ALLOWED_TOKEN_FILES);

    expect(base).toEqual({ commitSha: BASE_SHA, treeSha: BASE_TREE_SHA });
    expect(files.map((file) => file.path)).toEqual(ALLOWED_TOKEN_FILES);
    for (const [url, init] of fetchMock.mock.calls) {
      expect(String(url)).toMatch(/^https:\/\/api\.github\.com\/repos\/Malik1942\/Malik-Portfolio\//);
      expect(init.headers).toMatchObject({
        Authorization: "Bearer github-token",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      });
    }
    expect(String(fetchMock.mock.calls[2][0])).toContain(`ref=${BASE_SHA}`);
  });

  it("uses only POST writes, a verified base tree/parent, a new ref, and PR base main", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(githubResponse(201, { sha: "1".repeat(40) }))
      .mockResolvedValueOnce(githubResponse(201, { sha: NEXT_TREE_SHA }))
      .mockResolvedValueOnce(githubResponse(201, { sha: NEXT_COMMIT_SHA }))
      .mockResolvedValueOnce(githubResponse(201, undefined))
      .mockResolvedValueOnce(githubResponse(201, { html_url: "https://github.com/Malik1942/Malik-Portfolio/pull/42", number: 42 }));
    const github = createGithubPublisher({ token: "github-token", owner: "Malik1942", repo: "Malik-Portfolio" }, fetchMock);
    const branch = "design-system/adjust-motion-20260715-a1b2c3";

    const blobs = await github.createBlobs([{ path: ALLOWED_TOKEN_FILES[0], content: "{}\n" }]);
    const tree = await github.createTree(BASE_TREE_SHA, blobs);
    const commit = await github.createCommit({ message: "Adjust motion", treeSha: tree, parentSha: BASE_SHA });
    await github.createRef(branch, commit);
    const pr = await github.createPullRequest({ title: "Adjust motion", body: "Body", head: branch, base: "main" });

    expect(pr).toEqual({ pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/42", pullRequestNumber: 42 });
    expect(fetchMock.mock.calls.map(([, init]) => init.method)).toEqual(["POST", "POST", "POST", "POST", "POST"]);
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      "https://api.github.com/repos/Malik1942/Malik-Portfolio/git/blobs",
      "https://api.github.com/repos/Malik1942/Malik-Portfolio/git/trees",
      "https://api.github.com/repos/Malik1942/Malik-Portfolio/git/commits",
      "https://api.github.com/repos/Malik1942/Malik-Portfolio/git/refs",
      "https://api.github.com/repos/Malik1942/Malik-Portfolio/pulls",
    ]);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body as string)).toMatchObject({ base_tree: BASE_TREE_SHA });
    expect(JSON.parse(fetchMock.mock.calls[2][1].body as string)).toMatchObject({ parents: [BASE_SHA] });
    expect(JSON.parse(fetchMock.mock.calls[3][1].body as string)).toEqual({ ref: `refs/heads/${branch}`, sha: NEXT_COMMIT_SHA });
    expect(JSON.parse(fetchMock.mock.calls[4][1].body as string)).toMatchObject({ head: branch, base: "main" });
    expect(fetchMock.mock.calls.some(([, init]) => ["PATCH", "PUT"].includes(init.method))).toBe(false);
  });

  it.each([
    { token: "github-token", owner: "attacker", repo: "Malik-Portfolio" },
    { token: "github-token", owner: "Malik1942", repo: "other" },
    { token: "", owner: "Malik1942", repo: "Malik-Portfolio" },
    { token: "   ", owner: "Malik1942", repo: "Malik-Portfolio" },
    { token: "bad\nheader", owner: "Malik1942", repo: "Malik-Portfolio" },
  ])("rejects unpinned or missing GitHub configuration before fetch", (config) => {
    const fetchMock = vi.fn();
    expect(() => createGithubPublisher(config, fetchMock)).toThrowError(/unavailable/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sanitizes upstream errors and malformed success responses", async () => {
    const rawSecret = "raw-upstream-secret-file-body";
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(rawSecret, { status: 500 }))
      .mockResolvedValueOnce(githubResponse(200, { object: { sha: "unsafe" } }));
    const github = createGithubPublisher({ token: "github-token", owner: "Malik1942", repo: "Malik-Portfolio" }, fetchMock);

    const first = await github.readMain().catch((error: unknown) => error);
    expect(first).toBeInstanceOf(GithubApiError);
    expect(first).toMatchObject({ status: 500, operation: "read_main" });
    expect(JSON.stringify(first)).not.toContain(rawSecret);

    const second = await github.readMain().catch((error: unknown) => error);
    expect(second).toBeInstanceOf(GithubApiError);
    expect(second).toMatchObject({ status: 502, operation: "read_main" });
    expect(JSON.stringify(second)).not.toContain("unsafe");
  });
});
