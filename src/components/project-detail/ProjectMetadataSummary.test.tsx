import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectMetadataSummary } from "./ProjectMetadataSummary";

describe("ProjectMetadataSummary", () => {
  it("renders production metadata as a persistent two-column grid", () => {
    render(
      <ProjectMetadataSummary
        cards={[
          { label: "Role", value: "Product design" },
          { label: "Scope", value: "A value that wraps safely on narrow screens" },
        ]}
      />,
    );

    expect(screen.getByTestId("project-metadata-summary")).toHaveClass("grid-cols-2");
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText(/wraps safely/)).toBeInTheDocument();
  });

  it("keeps authored line breaks in a card value", () => {
    render(
      <ProjectMetadataSummary
        cards={[
          {
            label: "Team",
            value: "Malik Zhang\nCindy Ly\nNaomi Boruchowicz\nJimmy Huang",
          },
        ]}
      />,
    );

    const value = screen.getByText(/Malik Zhang/);
    expect(value).toHaveClass("whitespace-pre-line");
    expect(value.textContent?.split("\n").map((line) => line.replace(/\u00A0/g, " "))).toEqual([
      "Malik Zhang",
      "Cindy Ly",
      "Naomi Boruchowicz",
      "Jimmy Huang",
    ]);
  });
});
