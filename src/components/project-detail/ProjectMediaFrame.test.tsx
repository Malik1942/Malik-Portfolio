import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectMediaFrame } from "./ProjectMediaFrame";

describe("ProjectMediaFrame", () => {
  it("renders a production image figure with its provided alternative text", () => {
    render(
      <ProjectMediaFrame
        fig={{ type: "image", src: "/placeholder.jpg", alt: "Research board" }}
      />,
    );

    expect(screen.getByTestId("project-media-frame")).toHaveClass("rounded-2xl");
    expect(screen.getByRole("img", { name: "Research board" })).toHaveAttribute("src", "/placeholder.jpg");
  });
});
