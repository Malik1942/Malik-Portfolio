import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics/react", () => ({ Analytics: () => <div data-testid="analytics" /> }));
vi.mock("./pages/Index.tsx", async () => {
  const { Link } = await import("react-router-dom");
  return { default: () => <main>Portfolio home <Link to="/project/moti">Open case study</Link></main> };
});
vi.mock("./pages/ProjectDetail.tsx", () => ({ default: () => <main>Case study</main> }));

import App, { ScrollToTop } from "./App";

describe("App preview integration", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.removeAttribute("style");
    window.history.replaceState({}, "", "/");
  });

  it("suppresses analytics and the PreviewBar in exact embedded mode while keeping portfolio content", async () => {
    window.history.replaceState({}, "", "/?design-preview=local&embedded=1");
    render(<App />);
    expect(screen.getByRole("main")).toHaveTextContent("Portfolio home");
    expect(screen.queryByTestId("analytics")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Local design preview" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Open case study" }));
    expect(await screen.findByRole("main")).toHaveTextContent("Case study");
    expect(screen.queryByTestId("analytics")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Local design preview" })).not.toBeInTheDocument();
  });

  it("resets the scroll on route change without animating it", () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <ScrollToTop />
        <Link to="/project/moti">Open case study</Link>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Open case study" }));

    expect(scrollToSpy.mock.lastCall?.[0]).toMatchObject({ top: 0, behavior: "instant" });
    scrollToSpy.mockRestore();
  });

  it("shows analytics and the PreviewBar in a normal full-site local preview", async () => {
    window.history.replaceState({}, "", "/?design-preview=local");
    render(<App />);
    expect(screen.getByTestId("analytics")).toBeInTheDocument();
    // The bar waits for the token manifest, which the provider loads on demand.
    expect(await screen.findByRole("region", { name: "Local design preview" })).toBeInTheDocument();
  });
});
