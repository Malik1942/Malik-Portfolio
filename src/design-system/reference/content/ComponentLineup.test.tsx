import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ComponentLineup } from "./ComponentLineup";

describe("ComponentLineup", () => {
  afterEach(cleanup);

  it("links the four primitives and seven composed components without inventing a generic catalog", () => {
    render(<ComponentLineup />);

    expect(screen.getByRole("link", { name: /Site header/i })).toHaveAttribute(
      "href",
      "#component-site-header",
    );
    expect(screen.getByRole("link", { name: /Project card/i })).toHaveAttribute(
      "href",
      "#component-project-card",
    );
    expect(screen.getByRole("link", { name: /Image lightbox/i })).toHaveAttribute(
      "href",
      "#component-lightbox",
    );
    expect(screen.getByRole("link", { name: /Button/ })).toHaveAttribute("href", "#component-button");
    expect(screen.getAllByRole("link")).toHaveLength(11);
    // Primitives are the ones the portfolio actually repeats; no generic catalog.
    expect(screen.queryByText("Input")).not.toBeInTheDocument();
    expect(screen.queryByText("Select")).not.toBeInTheDocument();
  });
});
