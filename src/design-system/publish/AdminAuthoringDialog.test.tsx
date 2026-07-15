import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { PreviewProvider } from "../preview/PreviewProvider";
import { AdminAuthoringDialog } from "./AdminAuthoringDialog";

function Harness({ onReviewPublish = vi.fn() }: { onReviewPublish?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open Admin authoring</button>
      <AdminAuthoringDialog
        open={open}
        onClose={() => setOpen(false)}
        onReviewPublish={onReviewPublish}
      />
    </>
  );
}

function renderHarness(onReviewPublish = vi.fn()) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PreviewProvider>
        <Harness onReviewPublish={onReviewPublish} />
      </PreviewProvider>
    </MemoryRouter>,
  );
}

describe("AdminAuthoringDialog", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("keeps the technical token workbench inside an explicitly opened Admin dialog", () => {
    renderHarness();

    expect(screen.queryByRole("dialog", { name: "Admin token authoring" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open Admin authoring" }));

    expect(screen.getByRole("dialog", { name: "Admin token authoring" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Token authoring" })).toBeInTheDocument();
    expect(screen.getByTitle("Live portfolio preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review and publish" })).toBeDisabled();
  });

  it("enables publish review only after a valid local token edit", () => {
    const onReviewPublish = vi.fn();
    renderHarness(onReviewPublish);
    fireEvent.click(screen.getByRole("button", { name: "Open Admin authoring" }));

    fireEvent.change(screen.getByLabelText("color.background.canvas lightness"), {
      target: { value: "8" },
    });
    const review = screen.getByRole("button", { name: "Review and publish" });
    expect(review).toBeEnabled();
    fireEvent.click(review);
    expect(onReviewPublish).toHaveBeenCalledOnce();
  });

  it("locks body scroll, closes on Escape, and restores focus", () => {
    renderHarness();
    const trigger = screen.getByRole("button", { name: "Open Admin authoring" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("button", { name: "Close token authoring" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Admin token authoring" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(trigger).toHaveFocus();
  });
});
