import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, useLocation } from "react-router-dom";
import { PreviewProvider, usePreviewDraft } from "./PreviewProvider";
import { PreviewBar } from "./PreviewBar";

function SetOverride() {
  const { setOverride } = usePreviewDraft();
  return <button onClick={() => setOverride("duration.fast", { value: 120, unit: "ms" })}>Change token</button>;
}

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="location">{`${location.pathname}${location.search}${location.hash}`}</output>;
}

function renderBar(entry: string, extra?: React.ReactNode) {
  return render(<MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PreviewProvider><PreviewBar />{extra}</PreviewProvider></MemoryRouter>);
}

describe("PreviewBar", () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.removeAttribute("style"); });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); document.documentElement.removeAttribute("style"); });

  it("appears only in explicit non-embedded preview mode and shows the changed count", () => {
    const ordinary = renderBar("/", <SetOverride />);
    expect(screen.queryByRole("region", { name: "Local design preview" })).not.toBeInTheDocument();
    ordinary.unmount();

    renderBar("/?design-preview=local", <SetOverride />);
    expect(screen.getByRole("region", { name: "Local design preview" })).toHaveTextContent("0 changed");
    fireEvent.click(screen.getByRole("button", { name: "Change token" }));
    expect(screen.getByRole("region", { name: "Local design preview" })).toHaveTextContent("1 changed");
  });

  it("is suppressed in embedded mode", () => {
    renderBar("/?design-preview=local&embedded=1");
    expect(screen.queryByRole("region", { name: "Local design preview" })).not.toBeInTheDocument();
  });

  it("keeps preview and embedded state across internal navigation without clearing styles", () => {
    renderBar("/?design-preview=local&embedded=1", <><SetOverride /><Link to="/project/moti#outcome">Case study</Link><LocationProbe /></>);
    fireEvent.click(screen.getByRole("button", { name: "Change token" }));
    fireEvent.click(screen.getByRole("link", { name: "Case study" }));
    expect(screen.getByLabelText("location")).toHaveTextContent("/project/moti?design-preview=local&embedded=1#outcome");
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("120ms");
  });

  it("exit removes only preview parameters, clears runtime, preserves path/hash and the saved draft", () => {
    renderBar("/project/moti?foo=bar&design-preview=local#outcome", <><SetOverride /><LocationProbe /></>);
    fireEvent.click(screen.getByRole("button", { name: "Change token" }));
    fireEvent.click(screen.getByRole("button", { name: "Exit preview" }));

    expect(screen.getByLabelText("location")).toHaveTextContent("/project/moti?foo=bar#outcome");
    expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("");
    expect(localStorage.getItem("malik-design-system:draft:v1")).toContain("duration.fast");
    expect(screen.queryByRole("region", { name: "Local design preview" })).not.toBeInTheDocument();
  });
});
