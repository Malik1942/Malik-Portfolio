import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TypographyFoundation } from "./TypographyFoundation";

describe("TypographyFoundation", () => {
  afterEach(cleanup);

  it("renders the complete production type scale as ruled live specimens", () => {
    render(<TypographyFoundation />);

    for (const id of [
      "label",
      "caption",
      "body-small",
      "body",
      "body-large",
      "heading",
      "display",
    ]) {
      expect(screen.getByTestId(`type-scale-${id}`)).toBeInTheDocument();
    }

    const label = screen.getByTestId("type-scale-label");
    expect(label).toHaveTextContent("font.size.label");
    expect(within(label).getByTestId("type-scale-label-specimen")).toHaveStyle({
      fontSize: "12px",
    });

    const display = screen.getByTestId("type-scale-display");
    expect(display).toHaveTextContent("font.size.display");
    expect(within(display).getByTestId("type-scale-display-specimen")).toHaveStyle({
      fontSize: "56px",
    });
  });

  it("separates three semantic families and four weights", () => {
    render(<TypographyFoundation />);

    expect(screen.getAllByTestId(/^type-family-/)).toHaveLength(3);
    expect(screen.getAllByTestId(/^type-weight-/)).toHaveLength(4);
    expect(screen.getByTestId("type-family-display")).toHaveTextContent("font.family.display");
    expect(screen.getByTestId("type-family-mono")).toHaveTextContent("JetBrains Mono");
    expect(screen.getByTestId("type-weight-semibold")).toHaveTextContent("font.weight.semibold");
  });

  it("contains no public type editing controls", () => {
    render(<TypographyFoundation />);

    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reset/i })).not.toBeInTheDocument();
  });
});
