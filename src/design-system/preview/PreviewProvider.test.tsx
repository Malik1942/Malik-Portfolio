import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { tokenBundle } from "../generated/token-manifest.generated";
import { DRAFT_STORAGE_KEY, createDraft } from "./draft";
import { DESIGN_PREVIEW_MESSAGE_TYPE } from "./runtime";
import { PreviewProvider, usePreviewDraft } from "./PreviewProvider";

function Probe() {
  const preview = usePreviewDraft();
  return (
    <div>
      <span data-testid="count">{Object.keys(preview.draft.overrides).length}</span>
      <span data-testid="discarded">{preview.discarded.join(",")}</span>
      <button type="button" onClick={() => preview.setOverride("duration.fast", { value: 120, unit: "ms" })}>Set fast duration</button>
      <button type="button" onClick={() => preview.setOverride("space.1", { value: 6, unit: "px" })}>Set space</button>
      <button type="button" onClick={() => preview.setOverride("duration.fast", { value: 2, unit: "px" } as never)}>Set invalid</button>
      <button type="button" onClick={() => preview.resetToken("duration.fast")}>Reset fast</button>
      <button type="button" onClick={() => preview.resetCategory("duration")}>Reset duration</button>
      <button type="button" onClick={preview.resetAll}>Reset all</button>
    </div>
  );
}

function renderProvider(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PreviewProvider><Probe /></PreviewProvider>
    </MemoryRouter>,
  );
}

describe("PreviewProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("style");
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute("style");
  });

  it("updates and persists a valid local override without authentication", () => {
    renderProvider("/design-system#playground");
    fireEvent.click(screen.getByRole("button", { name: "Set fast duration" }));

    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!)).toMatchObject({
      baseTokenHash: tokenBundle.tokenHash,
      overrides: { "duration.fast": { value: 120, unit: "ms" } },
    });
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("120ms");
  });

  it("rebases stored drafts, persists the current hash, and exposes sorted discarded paths", () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(createDraft("old", {
      "removed.z": 1,
      "duration.fast": { value: 110, unit: "ms" },
      "removed.a": 2,
    }, "2026-07-14T00:00:00.000Z")));

    renderProvider("/design-system");

    expect(screen.getByTestId("discarded")).toHaveTextContent("removed.a,removed.z");
    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!)).toMatchObject({
      baseTokenHash: tokenBundle.tokenHash,
      updatedAt: "2026-07-14T00:00:00.000Z",
      overrides: { "duration.fast": { value: 110, unit: "ms" } },
    });
  });

  it("rejects invalid updates atomically without changing storage or runtime", () => {
    renderProvider("/design-system");
    fireEvent.click(screen.getByRole("button", { name: "Set fast duration" }));
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);

    fireEvent.click(screen.getByRole("button", { name: "Set invalid" }));

    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBe(stored);
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("120ms");
  });

  it("resets one token, a canonical top-level category, and all overrides immediately", () => {
    renderProvider("/design-system");
    fireEvent.click(screen.getByRole("button", { name: "Set fast duration" }));
    fireEvent.click(screen.getByRole("button", { name: "Set space" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset fast" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Set fast duration" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset duration" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: "Reset all" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!)).toMatchObject({ overrides: {} });
  });

  it("ignores stored drafts on ordinary portfolio routes but applies them in exact local preview mode", () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(createDraft(tokenBundle.tokenHash, {
      "duration.fast": { value: 105, unit: "ms" },
    })));

    const ordinary = renderProvider("/");
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("");
    ordinary.unmount();

    renderProvider("/?design-preview=local");
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("105ms");
  });

  it("accepts embedded messages only from the same-origin parent and cleans up its one listener", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const view = renderProvider("/?design-preview=local&embedded=1");
    const validData = { type: DESIGN_PREVIEW_MESSAGE_TYPE, overrides: { "duration.fast": { value: 90, unit: "ms" } } };

    window.dispatchEvent(new MessageEvent("message", { data: validData, origin: "https://evil.test", source: window.parent }));
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("");
    window.dispatchEvent(new MessageEvent("message", { data: validData, origin: window.location.origin, source: {} as WindowProxy }));
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("");

    act(() => window.dispatchEvent(new MessageEvent("message", { data: validData, origin: window.location.origin, source: window.parent })));
    await waitFor(() => expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("90ms"));

    expect(addSpy.mock.calls.filter(([type]) => type === "message")).toHaveLength(1);
    view.unmount();
    expect(removeSpy.mock.calls.filter(([type]) => type === "message")).toHaveLength(1);
  });

  it("preserves explicit preview query state when an internal same-origin link is followed", () => {
    function LocationProbe() {
      const location = useLocation();
      return <output aria-label="location">{`${location.pathname}${location.search}${location.hash}`}</output>;
    }
    render(
      <MemoryRouter initialEntries={["/?design-preview=local"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewProvider>
          <Link to="/project/moti#outcome">Case study</Link>
          <LocationProbe />
        </PreviewProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Case study" }));
    expect(screen.getByLabelText("location")).toHaveTextContent("/project/moti?design-preview=local#outcome");
  });

  it("keeps preview state on unmodified native same-origin anchors", () => {
    function LocationProbe() {
      const location = useLocation();
      return <output aria-label="location">{`${location.pathname}${location.search}`}</output>;
    }
    render(
      <MemoryRouter initialEntries={["/?design-preview=local"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewProvider><a href="/resume">Resume</a><LocationProbe /></PreviewProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Resume" }));
    expect(screen.getByLabelText("location")).toHaveTextContent("/resume?design-preview=local");
  });

  it("preserves router state while restoring preview parameters", () => {
    function StateNavigation() {
      const navigate = useNavigate();
      const location = useLocation();
      return <><button onClick={() => navigate("/", { state: { scrollTo: "projects" } })}>Selected Work</button><output aria-label="route state">{JSON.stringify(location.state)}</output></>;
    }
    render(
      <MemoryRouter initialEntries={["/project/moti?design-preview=local"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewProvider><StateNavigation /></PreviewProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Selected Work" }));
    expect(screen.getByLabelText("route state")).toHaveTextContent("scrollTo");
  });
});
