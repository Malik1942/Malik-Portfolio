import { afterEach, describe, expect, it, vi } from "vitest";
import type { PublishRequest } from "./client";
import { PublishError, publishTokenDraft } from "./client";

const REQUEST: PublishRequest = {
  password: "top-secret-password",
  baseCommitSha: "abc123",
  baseTokenHash: "64a61240",
  title: "Adjust portfolio motion",
  summary: "Tune the fast duration after reviewing the live preview.",
  overrides: { "duration.fast": { value: 120, unit: "ms" } },
};

function response(status: number, body: string, contentType = "application/json") {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => name.toLowerCase() === "content-type" ? contentType : null },
    text: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("publishTokenDraft", () => {
  afterEach(() => vi.restoreAllMocks());

  it("posts the typed request as JSON and returns a validated success payload", async () => {
    const success = {
      pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/42",
      pullRequestNumber: 42,
      branch: "design-system/adjust-motion-42",
      changedTokens: ["duration.fast"],
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(response(201, JSON.stringify(success)));

    await expect(publishTokenDraft(REQUEST)).resolves.toEqual(success);
    expect(fetchSpy).toHaveBeenCalledWith("/api/design-system/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(REQUEST),
      signal: undefined,
    });
  });

  it("passes an abort signal without changing the request body", async () => {
    const controller = new AbortController();
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(response(201, JSON.stringify({
      pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/7",
      pullRequestNumber: 7,
      branch: "design-system/a",
      changedTokens: ["duration.fast"],
    })));

    await publishTokenDraft(REQUEST, { signal: controller.signal });
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({ signal: controller.signal });
  });

  it.each([
    [401, "Publish authorization failed."],
    [409, "Production tokens changed since this draft was created."],
    [422, "The token draft was rejected by server validation."],
    [429, "Too many publish attempts. Wait a moment and try again."],
    [502, "GitHub publishing is temporarily unavailable."],
  ])("maps HTTP %s to a credential-safe typed error", async (status, message) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(status, JSON.stringify({
      error: `reflected ${REQUEST.password}`,
    })));

    const failure = await publishTokenDraft(REQUEST).catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(PublishError);
    expect(failure).toMatchObject({ status, message });
    expect(JSON.stringify(failure)).not.toContain(REQUEST.password);
  });

  it.each([
    ["", "application/json"],
    ["upstream gateway exploded", "text/plain"],
    ["{broken", "application/json"],
  ])("handles empty, non-JSON, and malformed error bodies without reflecting them", async (body, contentType) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(502, body, contentType));

    await expect(publishTokenDraft(REQUEST)).rejects.toMatchObject({
      status: 502,
      message: "GitHub publishing is temporarily unavailable.",
    });
  });

  it.each([
    {},
    { pullRequestUrl: "javascript:alert(1)", pullRequestNumber: 1, branch: "x", changedTokens: [] },
    { pullRequestUrl: "https://example.com/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 0, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 1, branch: "", changedTokens: [] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 1, branch: "x".repeat(201), changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: [] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: [""] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: ["duration.fast", "duration.fast"] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: [1] },
    { pullRequestUrl: "https://github.com/a/b/pull/1?unsafe=1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://user@github.com/a/b/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/a/b/pull/1", pullRequestNumber: 2, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/attacker/repo/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/malik1942/malik-portfolio/pull/1", pullRequestNumber: 1, branch: "design-system/x", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/1", pullRequestNumber: 1, branch: "design-system/foo.lock", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/1", pullRequestNumber: 1, branch: "design-system/a/.hidden", changedTokens: ["duration.fast"] },
    { pullRequestUrl: "https://github.com/Malik1942/Malik-Portfolio/pull/1", pullRequestNumber: 1, branch: "design-system/a./b", changedTokens: ["duration.fast"] },
  ])("rejects an invalid success shape as an upstream error", async (body) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(200, JSON.stringify(body)));

    await expect(publishTokenDraft(REQUEST)).rejects.toMatchObject({
      status: 502,
      code: "invalid_response",
      message: "The publish service returned an invalid response.",
    });
  });

  it("preserves only a validated recovery branch from a structured PR-creation failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(502, JSON.stringify({
      code: "github_pr_failed",
      message: `do not render ${REQUEST.password}`,
      branch: "design-system/recover-motion-42",
    })));

    const failure = await publishTokenDraft(REQUEST).catch((error: unknown) => error);
    expect(failure).toMatchObject({
      status: 502,
      code: "upstream_failure",
      recoveryBranch: "design-system/recover-motion-42",
    });
    expect(JSON.stringify(failure)).not.toContain(REQUEST.password);
  });

  it.each([
    "main",
    "design-system/../main",
    "design-system//unsafe",
    "design-system/foo.lock",
    "design-system/a/.hidden",
    "design-system/a./b",
    `design-system/${"x".repeat(200)}`,
  ])("discards an unsafe recovery branch", async (branch) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(502, JSON.stringify({
      code: "github_pr_failed",
      branch,
    })));

    const failure = await publishTokenDraft(REQUEST).catch((error: unknown) => error);
    expect(failure).toMatchObject({ status: 502 });
    expect((failure as PublishError).recoveryBranch).toBeUndefined();
  });

  it("normalizes network failures without exposing the request", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError(`failed ${REQUEST.password}`));

    const failure = await publishTokenDraft(REQUEST).catch((error: unknown) => error);
    expect(failure).toMatchObject({
      status: 0,
      code: "request_failed",
      message: "The publish service could not be reached.",
    });
    expect(JSON.stringify(failure)).not.toContain(REQUEST.password);
  });

  it("normalizes response-body read failures without exposing upstream details", async () => {
    const broken = response(502, "");
    vi.mocked(broken.text).mockRejectedValue(new Error(`stream failed ${REQUEST.password}`));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(broken);

    const failure = await publishTokenDraft(REQUEST).catch((error: unknown) => error);
    expect(failure).toMatchObject({
      status: 502,
      code: "upstream_failure",
      message: "GitHub publishing is temporarily unavailable.",
    });
    expect(JSON.stringify(failure)).not.toContain(REQUEST.password);
  });

  it("preserves AbortError so dialog cancellation remains silent", async () => {
    const abort = new DOMException("The operation was aborted.", "AbortError");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(abort);

    await expect(publishTokenDraft(REQUEST)).rejects.toBe(abort);
  });
});
