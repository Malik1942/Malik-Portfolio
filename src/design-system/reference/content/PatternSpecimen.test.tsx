import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { setReducedMotionPreference } from "../../../test/setup";
import { PatternSpecimen } from "./PatternSpecimen";

describe("PatternSpecimen", () => {
  afterEach(cleanup);

  it("changes the active section in the section-navigation stage", () => {
    render(
      <PatternSpecimen
        sectionId="pattern-section-navigation"
        contextHref="/project/aura"
        contextLabel="View section navigation in context"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Final design" }));
    expect(screen.getByRole("button", { name: "Final design" })).toHaveAttribute("aria-current", "step");
  });

  it("replays transition arrival and settles immediately when reduced motion is preferred", () => {
    const view = render(
      <PatternSpecimen
        sectionId="pattern-transitions"
        contextHref="/project/neuralyfe"
        contextLabel="View loading and transitions in context"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Replay transition" }));
    expect(screen.getByTestId("transition-stage")).toHaveAttribute("data-phase", "entering");
    view.unmount();

    setReducedMotionPreference(true);
    render(
      <PatternSpecimen
        sectionId="pattern-transitions"
        contextHref="/project/neuralyfe"
        contextLabel="View loading and transitions in context"
      />,
    );
    expect(screen.getByTestId("transition-stage")).toHaveAttribute("data-reduced-motion", "true");
    expect(screen.getByTestId("transition-stage")).toHaveAttribute("data-phase", "settled");
  });

  it("switches responsive composition and pauses expressive ambient motion", () => {
    const responsive = render(
      <PatternSpecimen sectionId="pattern-responsive" contextHref="/" contextLabel="View in context" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Compact layout" }));
    expect(screen.getByTestId("responsive-stage")).toHaveAttribute("data-layout", "compact");
    responsive.unmount();

    render(
      <PatternSpecimen sectionId="pattern-expressive" contextHref="/" contextLabel="View in context" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pause ambient motion" }));
    expect(screen.getByTestId("expressive-stage")).toHaveAttribute("data-paused", "true");
  });

  it("announces the active element in the accessibility focus path", () => {
    render(
      <PatternSpecimen sectionId="pattern-accessibility" contextHref="/" contextLabel="View in context" />,
    );

    fireEvent.focus(screen.getByRole("button", { name: "Open case study" }));
    expect(screen.getByRole("status")).toHaveTextContent("Open case study is focused");
  });

  it("renders a live stage for every remaining documented pattern", () => {
    for (const sectionId of ["pattern-homepage-hero", "pattern-case-study"]) {
      const view = render(
        <PatternSpecimen sectionId={sectionId} contextHref="/" contextLabel="View in context" />,
      );
      expect(screen.getByRole("region", { name: "Live specimen" })).toBeInTheDocument();
      view.unmount();
    }
  });
});
