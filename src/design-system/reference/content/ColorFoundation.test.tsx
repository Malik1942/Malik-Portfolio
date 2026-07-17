import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ColorFoundation } from "./ColorFoundation";

describe("ColorFoundation", () => {
  afterEach(cleanup);

  it("organizes semantic roles into four readable groups", () => {
    render(<ColorFoundation />);

    for (const group of ["Surfaces", "Text", "Accents", "Actions & boundaries"]) {
      expect(screen.getByRole("heading", { name: group })).toBeInTheDocument();
    }

    expect(screen.getByText("color.background.canvas")).toBeInTheDocument();
    expect(screen.getByText("color.text.primary")).toBeInTheDocument();
    expect(screen.getByText("color.accent.selectedWork")).toBeInTheDocument();
    expect(screen.getByText("color.focus.ring")).toBeInTheDocument();
  });

  it("keeps primitives, compatibility colors, and editing controls out of the public reference", () => {
    render(<ColorFoundation />);

    expect(screen.queryByText("color.neutral.950")).not.toBeInTheDocument();
    expect(screen.queryByText("color.warm.100")).not.toBeInTheDocument();
    expect(screen.queryByText("color.sidebar.background")).not.toBeInTheDocument();
    expect(screen.queryByText("component.projectCard.surface")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reset/i })).not.toBeInTheDocument();
  });

  it("gives every swatch a role-and-value accessible name", () => {
    render(<ColorFoundation />);

    const canvasRow = screen.getByTestId("color-role-color-background-canvas");
    expect(within(canvasRow).getByLabelText(/Canvas.*#0a0a0a/i)).toBeInTheDocument();
    expect(canvasRow).toHaveTextContent("#0a0a0a");
    expect(canvasRow).toHaveAttribute("title", expect.stringContaining("Default background for portfolio pages"));
  });
});
