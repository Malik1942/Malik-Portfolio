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

  it("joins an image's label and caption under the frame", () => {
    render(
      <ProjectMediaFrame
        fig={{ type: "image", src: "/placeholder.jpg", alt: "Research board", label: "Research board", caption: "the wall after synthesis" }}
      />,
    );

    expect(screen.getByText("Research board: the wall after synthesis")).toBeInTheDocument();
    expect(screen.getByTestId("project-media-frame")).not.toHaveClass("rounded-2xl");
  });

  it("renders an embed as a bare 16:9 frame with no caption", () => {
    render(<ProjectMediaFrame fig={{ type: "embed", url: "https://youtu.be/dQw4w9WgXcQ", title: "Demo reel" }} />);

    const frame = screen.getByTestId("project-media-frame");
    expect(frame).toHaveClass("aspect-video");
    expect(frame.querySelector("figcaption")).toBeNull();
    expect(screen.getByTitle("Demo reel")).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
});
