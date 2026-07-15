import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ComponentSpecimen } from "./ComponentSpecimen";

describe("ComponentSpecimen", () => {
  afterEach(cleanup);

  it("shows project-card interaction for keyboard focus as well as hover", () => {
    render(
      <ComponentSpecimen
        sectionId="component-project-card"
        contextHref="/#projects"
        contextLabel="View project cards in context"
      />,
    );

    const card = screen.getByRole("link", { name: /Moti.*Product design/i });
    fireEvent.focus(card);
    expect(card).toHaveAttribute("data-active", "true");
    fireEvent.blur(card);
    expect(card).toHaveAttribute("data-active", "false");
  });

  it("opens the production image lightbox and restores focus on Escape", async () => {
    render(
      <ComponentSpecimen
        sectionId="component-lightbox"
        contextHref="/project/aura"
        contextLabel="View image lightbox in context"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open image lightbox" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: /Expanded image: Specimen product interface/i })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("renders a visual stage for every remaining documented component", () => {
    for (const sectionId of [
      "component-site-header",
      "component-project-list",
      "component-metadata-card",
      "component-media-frame",
      "component-footer",
    ]) {
      const view = render(
        <ComponentSpecimen sectionId={sectionId} contextHref="/" contextLabel="View in context" />,
      );
      expect(screen.getByRole("region", { name: "Live specimen" })).toBeInTheDocument();
      view.unmount();
    }
  });

  it("reuses the extracted production metadata and media primitives", () => {
    const metadata = render(
      <ComponentSpecimen sectionId="component-metadata-card" contextHref="/" contextLabel="View in context" />,
    );
    expect(screen.getByText("Product design")).toBeInTheDocument();
    metadata.unmount();

    render(
      <ComponentSpecimen sectionId="component-media-frame" contextHref="/" contextLabel="View in context" />,
    );
    expect(screen.getByRole("img", { name: "Specimen research board" })).toBeInTheDocument();
  });
});
