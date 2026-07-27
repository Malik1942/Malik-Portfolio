import { act, cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectList";
import { scrollToTarget } from "@/lib/scrollToTarget";

// framer-motion's useInView needs IntersectionObserver, which jsdom does not ship.
// Report "not intersecting" so the card starts from its pre-reveal state — that is
// exactly the case a dot click has to recover from.
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

const project = {
  title: "Aura",
  description: "Anticipatory motion-sickness relief",
  role: "Product Designer",
  year: "2025",
};

const renderCard = (projectId: string) =>
  render(
    <MemoryRouter>
      <ProjectCard project={project} projectId={projectId} dotClass="bg-dot-red" globalIndex={1} />
    </MemoryRouter>,
  );

const arrive = (id: string) =>
  act(() => {
    window.dispatchEvent(new CustomEvent("project-dot-arrive", { detail: { id } }));
  });

describe("project dot arrival", () => {
  afterEach(cleanup);

  it("flags the matching card as arriving so the landing pulse can play", () => {
    const { container } = renderCard("aura");
    const card = container.querySelector("#project-aura");

    expect(card).not.toHaveClass("project-row-arriving");

    arrive("aura");

    expect(card).toHaveClass("project-row-arriving");
  });

  it("leaves other cards untouched", () => {
    const { container } = renderCard("aura");
    const card = container.querySelector("#project-aura");

    arrive("neuralyfe");

    expect(card).not.toHaveClass("project-row-arriving");
  });

  it("reveals a card that never entered the viewport, so it is composed on landing", async () => {
    const { container } = renderCard("aura");
    const card = container.querySelector("#project-aura") as HTMLElement;

    expect(card.style.opacity).toBe("0");

    arrive("aura");

    // The reveal is a framer-motion animation (0.5s opacity, staggered delay),
    // so it resolves over frames rather than on the event tick.
    await waitFor(() => expect(Number(card.style.opacity)).toBeGreaterThan(0));
  });
});

describe("scrollToTarget arrival contract", () => {
  afterEach(cleanup);

  it("announces arrival immediately when the target is already in place", () => {
    const onArrive = vi.fn();
    window.addEventListener("project-dot-arrive", onArrive);

    const element = document.createElement("div");
    document.body.appendChild(element);

    scrollToTarget({
      element,
      align: "center",
      arrivalEventName: "project-dot-arrive",
      arrivalDetail: { id: "aura" },
    });

    expect(onArrive).toHaveBeenCalledTimes(1);
    expect((onArrive.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: "aura" });

    window.removeEventListener("project-dot-arrive", onArrive);
    element.remove();
  });
});
