import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import ProjectList from "./ProjectList";

beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

afterEach(cleanup);

const robotArm = {
  id: "robotarm",
  title: "Robot arm",
  description: "A desk-scale arm",
  role: "Designer + Builder",
  year: "2026",
  skills: [],
  destination: { kind: "video" as const, src: "/arm.mp4", poster: "/arm.webp" },
};

describe("studio video tile", () => {
  it("opens an in-place lightbox, closes on Escape, and returns focus to the tile", async () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectList section="studio" projects={[robotArm]} />
      </MemoryRouter>,
    );
    const tile = screen.getByRole("button", { name: "Play Robot arm" });
    expect(container.querySelector("[aria-hidden='true'] svg"), "play glyph").not.toBeNull();
    tile.focus();

    fireEvent.click(tile);
    const dialog = screen.getByRole("dialog", { name: "Robot arm" });
    expect(dialog.querySelector("video")).toHaveAttribute("src", "/arm.mp4");
    expect(dialog.textContent).toContain("A desk-scale arm");
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    // AnimatePresence keeps the dialog mounted through its exit fade.
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(tile);
  });

  it("closes on a backdrop click but not on a click inside the player", async () => {
    render(
      <MemoryRouter>
        <ProjectList section="studio" projects={[robotArm]} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Play Robot arm" }));
    const dialog = screen.getByRole("dialog", { name: "Robot arm" });

    fireEvent.click(dialog.querySelector("video")!);
    expect(screen.queryByRole("dialog")).not.toBeNull();

    fireEvent.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
