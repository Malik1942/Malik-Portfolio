import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics/react", () => ({ Analytics: () => <div data-testid="analytics" /> }));
vi.mock("./pages/Index.tsx", async () => {
  const { Link } = await import("react-router-dom");
  return { default: () => <main>Portfolio home <Link to="/project/moti">Open case study</Link></main> };
});
vi.mock("./pages/ProjectDetail.tsx", () => ({ default: () => <main>Case study</main> }));

import App from "./App";

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

  it("shows analytics and the PreviewBar in a normal full-site local preview", () => {
    window.history.replaceState({}, "", "/?design-preview=local");
    render(<App />);
    expect(screen.getByTestId("analytics")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Local design preview" })).toBeInTheDocument();
  });
});
