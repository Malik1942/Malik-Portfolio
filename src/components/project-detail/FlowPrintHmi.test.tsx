import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FlowPrintHmi, PRINT_MS } from "./FlowPrintHmi";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

beforeEach(() => {
  vi.useFakeTimers();
});

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole("button", { name }));

describe("FlowPrint HMI", () => {
  it("starts on the experience check", () => {
    render(<FlowPrintHmi />);
    expect(screen.getByText(/how experienced are you with 3d printing/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "First time user" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pro user" })).toBeInTheDocument();
  });

  it("sends a pro user to home", () => {
    render(<FlowPrintHmi />);
    click("Pro user");
    expect(screen.getByRole("button", { name: "Tap to Start Printing" })).toBeInTheDocument();
    expect(screen.queryByText(/set up your network/i)).not.toBeInTheDocument();
  });

  it("does not continue from an empty password", () => {
    render(<FlowPrintHmi />);
    click("First time user");
    click("Malik Design");
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    click(/a/i);
    expect(screen.getByRole("button", { name: "Continue" })).not.toBeDisabled();
  });

  it("walks a first-time user through setup, print, and summary", () => {
    render(<FlowPrintHmi />);
    click("First time user");
    click("Malik Design");
    click("h");
    click("i");
    click("Continue");
    expect(screen.getByText(/connected successfully/i)).toBeInTheDocument();
    click("Continue");

    expect(screen.getByText("PLA")).toBeInTheDocument();
    click("Next");
    expect(screen.getByText("PETG")).toBeInTheDocument();
    click("Next");
    expect(screen.getByText("ABS")).toBeInTheDocument();
    click("Next");
    expect(screen.getByText("TPU")).toBeInTheDocument();
    click("Next");
    expect(screen.getByText("PC")).toBeInTheDocument();
    click("Next");
    click("Load filament");

    expect(screen.getByRole("button", { name: "Tap to Start Printing" })).toBeInTheDocument();
    click("Tap to Start Printing");
    click("Studio bust");
    click("Start Print");

    act(() => {
      vi.advanceTimersByTime(PRINT_MS);
    });

    expect(screen.getByText(/finished printing/i)).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });

  it("returns from finished to home, and start over returns to welcome", () => {
    render(<FlowPrintHmi />);
    click("Pro user");
    click("Tap to Start Printing");
    click("Studio bust");
    click("Start Print");
    act(() => {
      vi.advanceTimersByTime(PRINT_MS);
    });
    click("Continue");
    expect(screen.getByRole("button", { name: "Tap to Start Printing" })).toBeInTheDocument();
    click("Start over");
    expect(screen.getByText(/how experienced are you with 3d printing/i)).toBeInTheDocument();
  });
});
