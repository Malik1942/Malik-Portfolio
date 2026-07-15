import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { tokenBundle } from "../generated/token-manifest.generated";
import { PreviewProvider, usePreviewDraft } from "../preview/PreviewProvider";
import { ContrastChecks } from "./ContrastChecks";
import { ExportDraftButton } from "./ExportDraftButton";
import { PortfolioPreview } from "./PortfolioPreview";
import { TokenDiff } from "./TokenDiff";

function OverrideButton({ path, value }: { path: string; value: never }) {
  const { setOverride } = usePreviewDraft();
  return <button type="button" onClick={() => setOverride(path, value)}>Apply override</button>;
}

function renderWorkbench(children: React.ReactNode, entry = "/design-system#playground") {
  return render(<MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PreviewProvider>{children}</PreviewProvider></MemoryRouter>);
}

describe("public workbench utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("style");
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute("style");
  });

  it("shows direct edits separately from compiled alias effects", () => {
    renderWorkbench(<>
      <OverrideButton path="color.warm.100" value={{ colorSpace: "hsl", components: [40, 6, 80] } as never} />
      <TokenDiff />
    </>);
    fireEvent.click(screen.getByRole("button", { name: "Apply override" }));

    const direct = screen.getByTestId("diff-color.warm.100");
    expect(direct).toHaveTextContent("color.warm.100");
    expect(direct).toHaveTextContent("40 6% 90%");
    expect(direct).toHaveTextContent("40 6% 80%");
    expect(direct).toHaveTextContent("color.text.primary");
    expect(screen.queryByTestId("diff-color.text.primary")).not.toBeInTheDocument();
  });

  it("reports the four approved contrast pairs with WCAG ratios and advisory thresholds", () => {
    renderWorkbench(<>
      <OverrideButton path="color.background.canvas" value={{ colorSpace: "hsl", components: [40, 6, 90] } as never} />
      <ContrastChecks />
    </>);
    expect(screen.getAllByText(/^\d+\.\d{2}:1$/)).toHaveLength(4);
    expect(screen.getByText("Primary text on canvas").closest("li")).toHaveTextContent("Pass AA");

    fireEvent.click(screen.getByRole("button", { name: "Apply override" }));
    expect(screen.getByText("Primary text on canvas").closest("li")).toHaveTextContent("Fail AA");
    expect(screen.getByText("Focus ring on canvas").closest("li")).toHaveTextContent("Fail 3:1");
  });

  it("uses the exact same-origin embedded URL and replays complete overrides on load and changes", async () => {
    renderWorkbench(<>
      <OverrideButton path="duration.fast" value={{ value: 120, unit: "ms" } as never} />
      <PortfolioPreview />
    </>);
    const frame = screen.getByTitle("Live portfolio preview") as HTMLIFrameElement;
    expect(frame).toHaveAttribute("src", "/?design-preview=local&embedded=1");

    const postMessage = vi.fn();
    Object.defineProperty(frame, "contentWindow", { configurable: true, value: { postMessage } });
    fireEvent.load(frame);
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ overrides: {} }), window.location.origin);

    fireEvent.click(screen.getByRole("button", { name: "Apply override" }));
    await waitFor(() => expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({
      overrides: { "duration.fast": { value: 120, unit: "ms" } },
    }), window.location.origin));

    expect(screen.getByRole("button", { name: "320px" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "768px" }));
    expect(frame.parentElement).toHaveStyle({ width: "768px" });
  });

  it("exports a fresh complete DTCG bundle and revokes the object URL", () => {
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    renderWorkbench(<>
      <OverrideButton path="duration.fast" value={{ value: 120, unit: "ms" } as never} />
      <ExportDraftButton />
    </>);
    fireEvent.click(screen.getByRole("button", { name: "Apply override" }));
    fireEvent.click(screen.getByRole("button", { name: "Export JSON" }));

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });
});
