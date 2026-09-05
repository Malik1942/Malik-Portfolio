import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MaterialFoundation } from "./MaterialFoundation";

describe("MaterialFoundation", () => {
  afterEach(cleanup);

  it("leads with the five-tier ink ladder and measures each tier against the canvas", () => {
    render(<MaterialFoundation />);

    const ladder = screen.getByTestId("material-ink-ladder");
    for (const path of [
      "color.text.primary",
      "color.text.lead",
      "color.text.secondary",
      "color.text.tertiary",
      "color.text.quiet",
    ]) {
      expect(within(ladder).getByText(path)).toBeInTheDocument();
    }
    // The three readable tiers pass AA; quiet is labelled decorative.
    expect(within(screen.getByTestId("color-role-color-text-tertiary")).getByText(/55% · [0-9.]+:1 AA/)).toBeInTheDocument();
    expect(within(screen.getByTestId("color-role-color-text-quiet")).getByText(/44% · [0-9.]+:1 decorative/)).toBeInTheDocument();
  });

  it("organizes the remaining roles into surfaces, boundaries, and accents", () => {
    render(<MaterialFoundation />);

    for (const group of ["Surfaces", "Boundaries & focus", "Accents & status"]) {
      expect(screen.getByRole("heading", { name: group })).toBeInTheDocument();
    }
    expect(screen.getByText("color.background.canvas")).toBeInTheDocument();
    expect(screen.getByText("color.border.hairline")).toBeInTheDocument();
    expect(screen.getByText("color.focus.ring")).toBeInTheDocument();
    expect(screen.getByText("color.accent.selectedWork")).toBeInTheDocument();
  });

  it("keeps primitives, component colors, and editing controls out of the public reference", () => {
    render(<MaterialFoundation />);

    expect(screen.queryByText("color.neutral.950")).not.toBeInTheDocument();
    expect(screen.queryByText("color.warm.100")).not.toBeInTheDocument();
    expect(screen.queryByText("component.projectCard.surface")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reset/i })).not.toBeInTheDocument();
  });

  it("gives every swatch a role-and-value accessible name", () => {
    render(<MaterialFoundation />);

    const canvasRow = screen.getByTestId("color-role-color-background-canvas");
    expect(within(canvasRow).getByLabelText(/Canvas.*#0a0a0a/i)).toBeInTheDocument();
    expect(canvasRow).toHaveTextContent("#0a0a0a");
    expect(canvasRow).toHaveAttribute("title", expect.stringContaining("Default background for portfolio pages"));
  });
});
