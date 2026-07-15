import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { PreviewProvider } from "../../preview/PreviewProvider";
import { Playground } from "./Playground";

describe("Playground", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("renders the complete public workbench without an admin gate", () => {
    render(<MemoryRouter initialEntries={["/design-system#playground"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PreviewProvider><Playground /></PreviewProvider></MemoryRouter>);

    expect(screen.getByTestId("reference-playground")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Token controls" })).toBeInTheDocument();
    expect(screen.getByTitle("Live portfolio preview")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Changed tokens" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contrast checks" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export JSON" })).toBeInTheDocument();
    expect(screen.queryByText(/password|sign in|admin/i)).not.toBeInTheDocument();
  });

  it("edits and resets an individual token from its production-backed control", () => {
    render(<MemoryRouter initialEntries={["/design-system#playground"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PreviewProvider><Playground /></PreviewProvider></MemoryRouter>);
    const input = screen.getByLabelText("duration.fast duration");
    fireEvent.change(input, { target: { value: "120" } });
    expect(screen.getByTestId("diff-duration.fast")).toHaveTextContent("120ms");
    fireEvent.click(screen.getByRole("button", { name: "Reset duration.fast" }));
    expect(screen.queryByTestId("diff-duration.fast")).not.toBeInTheDocument();
  });

  it("puts a 320px preview before controls on mobile and keeps it sticky beside controls on wide screens", () => {
    render(<MemoryRouter initialEntries={["/design-system#playground"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PreviewProvider><Playground /></PreviewProvider></MemoryRouter>);
    const workbench = screen.getByTestId("playground-workbench");
    const preview = screen.getByTestId("portfolio-preview");
    const controls = screen.getByRole("heading", { name: "Token controls" }).closest("section")!;

    expect(preview.compareDocumentPosition(controls) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workbench).toHaveClass("xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]");
    expect(preview.parentElement).toHaveClass("xl:sticky", "xl:top-28");
    expect(screen.getByRole("button", { name: "320px" })).toHaveAttribute("aria-pressed", "true");
  });
});
