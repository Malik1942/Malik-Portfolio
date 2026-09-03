import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import ProjectDetail from "./ProjectDetail";
import { SECTIONS } from "@/lib/sections";

beforeAll(() => {
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Observer);
});

afterEach(cleanup);

const renderProject = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/project/${id}`]}>
      <Routes>
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/" element={<div>landed-home</div>} />
        <Route path={SECTIONS.studio.path} element={<div>landed-studio</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("case-study exits", () => {
  it("returns a Studio project to /studio, not Selected Work", () => {
    renderProject("zeat");
    fireEvent.click(screen.getByRole("button", { name: "Back to all work" }));
    expect(screen.getByText("landed-studio")).toBeInTheDocument();
  });

  it("returns a More Work project to the homepage More Work section", () => {
    renderProject("flowprint");
    fireEvent.click(screen.getByRole("button", { name: "Back to all work" }));
    expect(screen.getByText("landed-home")).toBeInTheDocument();
  });
});
