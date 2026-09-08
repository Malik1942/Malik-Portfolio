import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import Resume, { RESUME_PAGE_TITLE } from "./Resume";
import {
  RESUME_CONTACT,
  RESUME_NAME,
  RESUME_PDF_PATH,
  RESUME_SECTIONS,
  RESUME_SKILLS,
  RESUME_SUMMARY,
} from "@/data/resume";

afterEach(cleanup);

const renderResume = () =>
  render(
    <MemoryRouter initialEntries={["/resume"]}>
      <Resume />
    </MemoryRouter>,
  );

// `Mon YYYY` or `YYYY`, alone or as a range joined by an en dash that may end
// in Present. The shape a date parser expects; "Sep - Dec 2025" is not it.
const DATE = /^(?:[A-Z][a-z]{2} )?\d{4}(?: – (?:Present|(?:[A-Z][a-z]{2} )?\d{4}))?$/;

describe("resume data", () => {
  const entries = RESUME_SECTIONS.flatMap((section) => section.entries);

  it("writes every date in a parseable shape, and none on Education", () => {
    for (const section of RESUME_SECTIONS) {
      for (const entry of section.entries) {
        if (section.id === "education") expect(entry.dates, entry.id).toBeUndefined();
        else expect(entry.dates, entry.id).toMatch(DATE);
      }
    }
  });

  it("formats the phone number the way a form expects it", () => {
    expect(RESUME_CONTACT.phone).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });

  it("keeps bullets as plain sentences the renderer can mark", () => {
    for (const entry of entries) {
      for (const bullet of entry.bullets) {
        expect(bullet, entry.id).not.toMatch(/^[•"\-–]/);
        expect(bullet, entry.id).not.toMatch(/\.$/);
        expect(bullet.trim(), entry.id).toBe(bullet);
      }
    }
  });
});

describe("Resume page", () => {
  it("renders the document as headings in reading order, with no iframe", () => {
    const { container } = renderResume();
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: RESUME_NAME })).toBeInTheDocument();
    expect(document.title).toBe(RESUME_PAGE_TITLE);

    const h2s = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(h2s).toEqual([...RESUME_SECTIONS.map((s) => s.heading), "Skills"]);

    // The text stream a parser reads is the DOM order: summary, then each
    // section's entries under their own heading, then skills.
    const text = container.textContent!.replace(/\u00a0/g, " ");
    let cursor = text.indexOf(RESUME_SUMMARY);
    expect(cursor).toBeGreaterThan(text.indexOf(RESUME_NAME));
    for (const section of RESUME_SECTIONS) {
      const headingAt = text.indexOf(section.heading, cursor);
      expect(headingAt, section.heading).toBeGreaterThan(cursor);
      cursor = headingAt;
      for (const entry of section.entries) {
        const at = text.indexOf(entry.title, cursor);
        expect(at, `${entry.title} after ${section.heading}`).toBeGreaterThan(cursor);
        cursor = at;
        for (const bullet of entry.bullets) {
          const bulletAt = text.indexOf(bullet, cursor);
          expect(bulletAt, bullet).toBeGreaterThan(cursor);
          cursor = bulletAt;
        }
      }
    }
    for (const group of RESUME_SKILLS) {
      const at = text.indexOf(group.label, cursor);
      expect(at, group.label).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it("gives every entry and skill group a level-3 heading and every list a real list", () => {
    const { container } = renderResume();
    const entries = RESUME_SECTIONS.flatMap((s) => s.entries);
    const h3s = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(h3s).toEqual([...entries.map((e) => e.title), ...RESUME_SKILLS.map((g) => g.label)]);
    expect(container.querySelectorAll(".resume-skill-list li")).toHaveLength(
      RESUME_SKILLS.reduce((n, g) => n + g.items.length, 0),
    );
    const bulletCount = entries.reduce((n, e) => n + e.bullets.length, 0);
    expect(container.querySelectorAll(".resume-entry-bullets li")).toHaveLength(bulletCount);
  });

  it("links the contact details and offers the PDF for download", () => {
    renderResume();
    expect(screen.getByRole("link", { name: RESUME_CONTACT.email })).toHaveAttribute(
      "href",
      `mailto:${RESUME_CONTACT.email}`,
    );
    expect(screen.getByRole("link", { name: RESUME_CONTACT.linkedin })).toHaveAttribute(
      "href",
      `https://${RESUME_CONTACT.linkedin}`,
    );
    expect(screen.getByRole("link", { name: RESUME_CONTACT.phone })).toHaveAttribute("href", "tel:+12534089312");
    const download = screen.getByRole("link", { name: /download pdf/i });
    expect(download).toHaveAttribute("href", RESUME_PDF_PATH);
    expect(download).toHaveAttribute("download");
    expect(screen.getByRole("button", { name: "Print" })).toBeInTheDocument();
  });

  it("copies the email and phone to the clipboard on request", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderResume();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
    });
    expect(writeText).toHaveBeenCalledWith(RESUME_CONTACT.email);
    expect(screen.getByRole("button", { name: "email copied" })).toHaveTextContent("Copied");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy phone number" }));
    });
    expect(writeText).toHaveBeenCalledWith(RESUME_CONTACT.phone);
  });

  it("falls back to the copy command when the clipboard is denied, and to selecting the text after that", async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, { execCommand });
    renderResume();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
    });
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByRole("button", { name: "email copied" })).toBeInTheDocument();

    execCommand.mockReturnValue(false);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy phone number" }));
    });
    expect(screen.getByRole("button", { name: /phone number selected/ })).toHaveTextContent("Selected");
    expect(window.getSelection()?.toString()).toBe(RESUME_CONTACT.phone);
  });
});
