import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import DesignSystem from "@/pages/DesignSystem";
import { tokenBundle } from "../generated/token-manifest.generated";
import { PreviewProvider } from "../preview/PreviewProvider";
import { DRAFT_STORAGE_KEY, createDraft } from "../preview/draft";
import { PublishError, type PublishSuccess, type publishTokenDraft } from "./client";
import { PublishDialog } from "./PublishDialog";

const { analyticsTrack } = vi.hoisted(() => ({ analyticsTrack: vi.fn() }));
vi.mock("@vercel/analytics", () => ({ track: analyticsTrack }));

const PUBLISHABLE_COMMIT = "a".repeat(40);
const SUCCESS: PublishSuccess = {
  pullRequestUrl: "https://github.com/malikzhang/malik-portfolio/pull/42",
  pullRequestNumber: 42,
  branch: "design-system/adjust-motion-42",
  changedTokens: ["duration.fast"],
};
const VALID_OVERRIDE = { "duration.fast": { value: 120, unit: "ms" } } as const;

type PublishFn = typeof publishTokenDraft;

function seedDraft(withOverride = true) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(createDraft(
    tokenBundle.tokenHash,
    withOverride ? VALID_OVERRIDE : {},
  )));
}

function DialogHarness({
  publish,
  baseCommitSha = PUBLISHABLE_COMMIT,
  baseTokenHash = tokenBundle.tokenHash,
  initiallyOpen = false,
}: {
  publish: PublishFn;
  baseCommitSha?: string;
  baseTokenHash?: string;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Admin trigger</button>
      <PublishDialog
        open={open}
        onClose={() => setOpen(false)}
        publish={publish}
        baseCommitSha={baseCommitSha}
        baseTokenHash={baseTokenHash}
      />
    </>
  );
}

function renderDialog(
  publish: PublishFn = vi.fn().mockResolvedValue(SUCCESS),
  options: { baseCommitSha?: string; baseTokenHash?: string; initiallyOpen?: boolean; withOverride?: boolean } = {},
) {
  seedDraft(options.withOverride ?? true);
  return render(
    <MemoryRouter initialEntries={["/design-system#playground"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PreviewProvider>
        <DialogHarness
          publish={publish}
          baseCommitSha={options.baseCommitSha}
          baseTokenHash={options.baseTokenHash}
          initiallyOpen={options.initiallyOpen}
        />
      </PreviewProvider>
    </MemoryRouter>,
  );
}

function openDialog() {
  const trigger = screen.getByRole("button", { name: "Admin trigger" });
  trigger.focus();
  fireEvent.click(trigger);
  return screen.getByRole("dialog", { name: "Review token publish" });
}

function fillValidForm(password = "publish-secret") {
  fireEvent.change(screen.getByLabelText("Publish password"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("Pull request title"), { target: { value: "  Adjust portfolio motion  " } });
  fireEvent.change(screen.getByLabelText("Rationale"), { target: { value: "  Tune the fast duration after reviewing the live preview.  " } });
  fireEvent.click(screen.getByRole("checkbox", { name: /I reviewed this final diff/i }));
}

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="route location">{`${location.pathname}${location.search}${location.hash}`}</output>;
}

describe("PublishDialog", () => {
  beforeEach(() => {
    localStorage.clear();
    analyticsTrack.mockClear();
    document.body.style.overflow = "";
    window.history.replaceState(null, "", "/design-system#playground");
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.body.style.overflow = "";
    window.history.replaceState(null, "", "/");
  });

  it("uses labelled modal semantics, focuses the password, restores scroll and focus, and clears the password on Escape", () => {
    document.body.style.overflow = "clip";
    renderDialog();
    const dialog = openDialog();

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.parentElement?.parentElement).toBe(document.body);
    const password = screen.getByLabelText("Publish password");
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    const close = screen.getByRole("button", { name: "Close publish review" });
    const acknowledgement = screen.getByRole("checkbox", { name: /I reviewed this final diff/i });
    acknowledgement.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
    close.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(acknowledgement).toHaveFocus();

    fireEvent.change(password, { target: { value: "never-persist-this" } });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("clip");
    expect(screen.getByRole("button", { name: "Admin trigger" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Admin trigger" }));
    expect(screen.getByLabelText("Publish password")).toHaveValue("");
  });

  it("shows a direct production/draft diff and requires trimmed fields, a valid override, acknowledgement, and publishable provenance", () => {
    const publish = vi.fn().mockResolvedValue(SUCCESS);
    const view = renderDialog(publish, { initiallyOpen: true });
    const dialog = screen.getByRole("dialog", { name: "Review token publish" });
    const diff = within(dialog).getByTestId("publish-diff-duration.fast");
    expect(diff).toHaveTextContent("duration.fast");
    expect(diff).toHaveTextContent("Production");
    expect(diff).toHaveTextContent("Draft");
    expect(diff).toHaveTextContent("120ms");

    const submit = within(dialog).getByRole("button", { name: "Open publish PR" });
    fireEvent.change(screen.getByLabelText("Publish password"), { target: { value: "secret" } });
    fireEvent.change(screen.getByLabelText("Pull request title"), { target: { value: " 1234567 " } });
    fireEvent.change(screen.getByLabelText("Rationale"), { target: { value: " 12345678901 " } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I reviewed this final diff/i }));
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Pull request title"), { target: { value: " 12345678 " } });
    fireEvent.change(screen.getByLabelText("Rationale"), { target: { value: " 123456789012 " } });
    expect(submit).toBeEnabled();

    view.unmount();
    renderDialog(publish, { initiallyOpen: true, withOverride: false });
    expect(screen.getByText("Make at least one valid token change before publishing.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open publish PR" })).toBeDisabled();

    cleanup();
    renderDialog(publish, { initiallyOpen: true, baseCommitSha: "development" });
    expect(screen.getByText("This build has no publishable Git commit provenance.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open publish PR" })).toBeDisabled();
  });

  it.each([
    { baseCommitSha: "a".repeat(39) },
    { baseCommitSha: "a".repeat(41) },
    { baseCommitSha: `${"a".repeat(39)}z` },
    { baseCommitSha: "A".repeat(40) },
    { baseTokenHash: "64a6124" },
    { baseTokenHash: "64A61240" },
    { baseTokenHash: "64a6124z" },
  ])("rejects non-canonical generated provenance before contacting publish", (provenance) => {
    const publish = vi.fn().mockResolvedValue(SUCCESS);
    renderDialog(publish, { initiallyOpen: true, ...provenance });
    fillValidForm();

    const submit = screen.getByRole("button", { name: "Open publish PR" });
    expect(submit).toBeDisabled();
    fireEvent.submit(submit.closest("form")!);
    expect(publish).not.toHaveBeenCalled();
  });

  it("submits trimmed metadata and generated provenance, then shows one safe canonical PR link", async () => {
    const publish = vi.fn().mockResolvedValue(SUCCESS);
    const storageSpy = vi.spyOn(localStorage, "setItem");
    renderDialog(publish);
    openDialog();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Open publish PR" }));

    await waitFor(() => expect(publish).toHaveBeenCalledOnce());
    expect(publish).toHaveBeenCalledWith({
      password: "publish-secret",
      baseCommitSha: PUBLISHABLE_COMMIT,
      baseTokenHash: tokenBundle.tokenHash,
      title: "Adjust portfolio motion",
      summary: "Tune the fast duration after reviewing the live preview.",
      overrides: VALID_OVERRIDE,
    }, expect.objectContaining({ signal: expect.any(AbortSignal) }));

    const result = await screen.findByRole("status");
    expect(result).toHaveTextContent("1 changed token");
    const links = within(result).getAllByRole("link", { name: "Open pull request #42" });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", SUCCESS.pullRequestUrl);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.queryByLabelText("Publish password")).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent("publish-secret");
    expect(window.location.href).not.toContain("publish-secret");
    expect(storageSpy.mock.calls.flat().join(" ")).not.toContain("publish-secret");
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).not.toContain("publish-secret");
    expect(analyticsTrack).not.toHaveBeenCalled();
  });

  it.each([
    [401, "unauthorized", "Publish authorization failed."],
    [409, "stale_production", "Production tokens changed since this draft was created."],
    [422, "invalid_draft", "The token draft was rejected by server validation."],
    [502, "upstream_failure", "GitHub publishing is temporarily unavailable."],
  ] as const)("shows a safe HTTP %s error, clears only the password, and keeps the retry review", async (status, code, message) => {
    const publish = vi.fn().mockRejectedValue(new PublishError(status, code, message));
    renderDialog(publish);
    openDialog();
    fillValidForm("credential-never-rendered");
    fireEvent.click(screen.getByRole("button", { name: "Open publish PR" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.getByLabelText("Publish password")).toHaveValue("");
    expect(screen.getByLabelText("Pull request title")).toHaveValue("  Adjust portfolio motion  ");
    expect(screen.getByRole("checkbox", { name: /I reviewed this final diff/i })).toBeChecked();
    expect(document.body).not.toHaveTextContent("credential-never-rendered");
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).not.toContain("credential-never-rendered");
  });

  it("shows a validated recovery branch without turning arbitrary error content into a link", async () => {
    const publish = vi.fn().mockRejectedValue(new PublishError(
      502,
      "upstream_failure",
      "GitHub publishing is temporarily unavailable.",
      "design-system/recover-motion-42",
    ));
    renderDialog(publish);
    openDialog();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Open publish PR" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("A token commit was created on branch design-system/recover-motion-42");
    expect(within(alert).queryByRole("link")).not.toBeInTheDocument();
  });

  it("prevents duplicate pending requests and ignores a completion after close", async () => {
    let resolvePublish!: (value: PublishSuccess) => void;
    const publish = vi.fn(() => new Promise<PublishSuccess>((resolve) => { resolvePublish = resolve; }));
    renderDialog(publish);
    openDialog();
    fillValidForm();
    const submit = screen.getByRole("button", { name: "Open publish PR" });

    fireEvent.click(submit);
    fireEvent.submit(submit.closest("form")!);
    expect(publish).toHaveBeenCalledOnce();
    expect(submit).toBeDisabled();
    fireEvent.keyDown(document, { key: "Escape" });

    await act(async () => resolvePublish(SUCCESS));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Admin trigger" }));
    expect(screen.queryByRole("link", { name: /Open pull request/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Publish password")).toHaveValue("");
  });
});

describe("Admin entry integration", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/design-system#playground");
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("keeps a real global Footer fallback and intercepts it only when a callback is supplied", () => {
    const onAdminClick = vi.fn();
    const view = render(<Footer />);
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/design-system?admin=1#playground");

    view.rerender(<Footer onAdminClick={onAdminClick} />);
    fireEvent.click(screen.getByRole("link", { name: "Admin" }));
    expect(onAdminClick).toHaveBeenCalledOnce();
  });

  it("opens from the one-shot admin query, safely removes only that query, and leaves public controls available after close", async () => {
    seedDraft();
    window.history.replaceState(null, "", "/design-system?keep=1&admin=1#playground");
    render(
      <MemoryRouter initialEntries={["/design-system?keep=1&admin=1#playground"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewProvider>
          <DesignSystem />
          <LocationProbe />
        </PreviewProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("dialog", { name: "Review token publish" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("route location")).toHaveTextContent("/design-system?keep=1#playground"));
    fireEvent.click(screen.getByRole("button", { name: "Close publish review" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Token controls" })).toBeInTheDocument();
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Export JSON" })).toBeInTheDocument();
  });
});
