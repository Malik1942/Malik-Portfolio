import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

// The About view is a state of the homepage, not its own page. These tests cover
// the /about URL that fronts it — the route existed only as a 404 before.
// Heavy children are stubbed: what's under test is the routing wiring, not the
// hero canvas or the editorial content.
vi.mock("@/components/HeroSection", () => ({
  default: ({
    isAboutOpen,
    onAboutClick,
    onSelectedWorkClick,
  }: {
    isAboutOpen: boolean;
    onAboutClick: () => void;
    onSelectedWorkClick: () => void;
  }) => (
    <header>
      <span data-testid="about-open">{String(isAboutOpen)}</span>
      <button onClick={onAboutClick}>Open About</button>
      <button onClick={onSelectedWorkClick}>Selected Work</button>
    </header>
  ),
}));

vi.mock("@/components/AboutDeepContent", () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <section>
      <span data-testid="about-content" />
      <button onClick={onBack}>Back</button>
    </section>
  ),
}));

vi.mock("@/components/ProjectList", () => ({ default: () => <div /> }));
vi.mock("@/components/Footer", () => ({ default: () => <div /> }));
vi.mock("@/components/PageTransition", () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Index from "./Index";

function CurrentPath() {
  const { pathname } = useLocation();
  return <span data-testid="pathname">{pathname}</span>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CurrentPath />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<Index />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("/about route", () => {
  afterEach(cleanup);

  it("opens the About view on a cold load of /about", () => {
    renderAt("/about");
    expect(screen.getByTestId("about-open")).toHaveTextContent("true");
    expect(screen.getByTestId("about-content")).toBeInTheDocument();
  });

  it("leaves the homepage on the hero at /", () => {
    renderAt("/");
    expect(screen.getByTestId("about-open")).toHaveTextContent("false");
    expect(screen.queryByTestId("about-content")).not.toBeInTheDocument();
  });

  it("drops the URL back to / when About is dismissed from /about", () => {
    renderAt("/about");
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
    expect(screen.getByTestId("about-open")).toHaveTextContent("false");
  });

  it("drops the URL back to / when a section link is used from /about", () => {
    renderAt("/about");
    fireEvent.click(screen.getByRole("button", { name: "Selected Work" }));
    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
    expect(screen.getByTestId("about-open")).toHaveTextContent("false");
  });

  it("keeps the nav's in-place About toggle on / without touching the URL", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: "Open About" }));
    expect(screen.getByTestId("about-open")).toHaveTextContent("true");
    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
  });
});
