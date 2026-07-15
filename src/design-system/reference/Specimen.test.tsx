import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Specimen } from "./Specimen";

describe("Specimen", () => {
  afterEach(cleanup);

  it("connects its label and long description without intercepting child interaction", () => {
    const onClick = vi.fn();
    render(
      <Specimen
        label="Focus state"
        description="A deliberately long usage note that should wrap at narrow widths without hiding the production behavior being demonstrated."
      >
        <button type="button" onClick={onClick}>Try focus</button>
      </Specimen>,
    );

    const region = screen.getByRole("region", { name: "Focus state" });
    expect(region).toHaveAttribute("aria-describedby");
    expect(screen.getByText(/deliberately long usage note/)).toHaveAttribute(
      "id",
      region.getAttribute("aria-describedby"),
    );
    const button = screen.getByRole("button", { name: "Try focus" });
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
