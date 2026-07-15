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
});
