import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";
import { DesignSystemShell } from "./DesignSystemShell";

function renderShell() {
  return render(
    <DesignSystemShell
      renderSection={(section) => (
        <div data-testid={`body-${section.id}`}>{section.description}</div>
      )}
    />,
  );
}

describe("DesignSystemShell", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/design-system#overview");
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("renders only the section selected by the current hash", () => {
    window.history.replaceState(null, "", "/design-system#foundation-color");

    renderShell();

    expect(screen.getByRole("heading", { level: 1, name: "Color" })).toBeInTheDocument();
    expect(screen.getByTestId("body-foundation-color")).toBeInTheDocument();
    expect(screen.queryByTestId("body-overview")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Color" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("uses one semantic navigation tree with working disclosures", () => {
    renderShell();

    expect(screen.getAllByRole("navigation", { name: "Design system sections" })).toHaveLength(1);

    const foundations = screen.getByRole("button", { name: "Foundations" });
    const components = screen.getByRole("button", { name: "Components" });
    // Overview lives in Foundations, so that group is open on initial render.
    expect(foundations).toHaveAttribute("aria-expanded", "true");
    expect(components).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(components);
    expect(components).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Image lightbox" })).toBeInTheDocument();
  });

  it("keeps rail entries as real hash links and changes the location hash", async () => {
    renderShell();
    const rail = screen.getByRole("navigation", { name: "Design system sections" });
    fireEvent.click(within(rail).getByRole("button", { name: "Components" }));
    const lightboxLink = within(rail).getByRole("link", { name: "Image lightbox" });

    expect(lightboxLink).toHaveAttribute("href", "#component-lightbox");
    fireEvent.click(lightboxLink);

    await waitFor(() => {
      expect(window.location.hash).toBe("#component-lightbox");
      expect(screen.getByRole("heading", { level: 1, name: "Image lightbox" })).toBeInTheDocument();
    });
  });

  it("focuses the active heading after hash navigation but not on initial render", () => {
    renderShell();
    const initialHeading = screen.getByRole("heading", { level: 1, name: "Overview" });
    expect(initialHeading).not.toHaveFocus();

    act(() => {
      window.history.replaceState(null, "", "/design-system#foundation-typography");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(screen.getByRole("heading", { level: 1, name: "Typo" })).toHaveFocus();
  });

  it("opens the active group and exposes real previous and next hash links", () => {
    renderShell();
    // Components is collapsed until one of its sections becomes active.
    expect(screen.getByRole("button", { name: "Components" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    act(() => {
      window.history.replaceState(null, "", "/design-system#foundation-color");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(screen.getByRole("button", { name: "Foundations" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getAllByRole("link", { name: /Previous: Typo/ })[0]).toHaveAttribute(
      "href",
      "#foundation-typography",
    );
    expect(screen.getAllByRole("link", { name: /Next: Tokens/ })[0]).toHaveAttribute(
      "href",
      "#foundation-tokens",
    );
  });

  it("is discoverable at the lazy design-system route and from its footer", async () => {
    window.history.replaceState(null, "", "/design-system#overview");
    vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<App />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Overview" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Design System" })).toHaveAttribute(
      "href",
      "/design-system",
    );
  });
});
