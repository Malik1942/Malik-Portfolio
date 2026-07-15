import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AboutOverlay from "./AboutOverlay";

describe("AboutOverlay", () => {
  it("does not render the former descriptor in either responsive layout", () => {
    render(<AboutOverlay isVisible onBack={vi.fn()} />);

    expect(screen.queryAllByText(/AI-native product designer\./i)).toHaveLength(0);
    expect(screen.queryAllByText(/Problem to shipped product\./i)).toHaveLength(0);
  });

  it("exposes each cluster disclosure as a button controlling a details region", () => {
    render(<AboutOverlay isVisible onBack={vi.fn()} />);

    for (const label of ["Who I Am", "Outside of Design", "How I Build", "What I Care About"]) {
      const controls = screen.getAllByRole("button", { name: label });
      expect(controls).toHaveLength(2);

      for (const control of controls) {
        const detailsId = control.getAttribute("aria-controls");
        expect(detailsId).toBeTruthy();
        const details = document.getElementById(detailsId!);
        expect(details).toHaveAttribute("role", "region");
        expect(details).toHaveAttribute("aria-label", `${label} details`);
        expect(details).toHaveAttribute("aria-hidden", "true");
        expect(control).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(control);

        expect(details).toHaveAttribute("aria-hidden", "false");
        expect(control).toHaveAttribute("aria-expanded", "true");

        fireEvent.click(control);

        expect(details).toHaveAttribute("aria-hidden", "true");
        expect(control).toHaveAttribute("aria-expanded", "false");
      }
    }
  });
});
