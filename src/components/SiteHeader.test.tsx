import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

afterEach(cleanup);

const renderHeader = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SiteHeader
        hidden={false}
        inert={false}
        shouldReduceMotion
        entranceVisible
        entranceDelay={0}
        onSelectedWork={() => {}}
        onWorkshop={() => {}}
        onAbout={() => {}}
      />
    </MemoryRouter>,
  );

describe("SiteHeader Connect cluster", () => {
  it("opens email from Connect and the email icon, and LinkedIn from the LinkedIn icon", () => {
    renderHeader();

    const connectLinks = screen.getAllByRole("link", { name: "Connect" });
    expect(connectLinks.length).toBeGreaterThan(0);
    for (const link of connectLinks) {
      expect(link).toHaveAttribute("href", "mailto:malikzhang19@gmail.com");
    }

    const emailLinks = screen.getAllByRole("link", { name: "Email" });
    expect(emailLinks.length).toBeGreaterThan(0);
    for (const link of emailLinks) {
      expect(link).toHaveAttribute("href", "mailto:malikzhang19@gmail.com");
    }

    const linkedInLinks = screen.getAllByRole("link", { name: "LinkedIn" });
    expect(linkedInLinks.length).toBeGreaterThan(0);
    for (const link of linkedInLinks) {
      expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/malik-zhang");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
  });

  it("right-aligns Connect on desktop beside the centered nav", () => {
    renderHeader();

    expect(screen.getByTestId("header-connect-desktop")).toHaveClass("justify-self-end");
  });
});
