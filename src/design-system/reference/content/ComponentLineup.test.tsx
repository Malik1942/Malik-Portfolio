import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ComponentLineup } from "./ComponentLineup";

describe("ComponentLineup", () => {
  afterEach(cleanup);

  it("links to the seven production components without inventing a generic catalog", () => {
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
    expect(screen.getAllByRole("link")).toHaveLength(7);
    expect(screen.queryByText("Button")).not.toBeInTheDocument();
    expect(screen.queryByText("Input")).not.toBeInTheDocument();
  });
});
