import { useEffect, useRef, useState } from "react";
import {
  RESUME_CONTACT,
  RESUME_NAME,
  RESUME_SECTIONS,
  RESUME_SKILLS,
  RESUME_SUMMARY,
  type ResumeEntry,
} from "@/data/resume";
import "@/styles/resume.css";

/**
 * The resume as a document: real headings, real lists, one reading order.
 *
 * The DOM order is the order a parser should read: name, contact, Summary,
 * Experience, Work, Education, Skills, in one column. Nothing is positioned
 * out of flow, so the printed PDF's text stream follows the same order. Each
 * entry opens with "Role, Title" (Education with "School, Degree") and its
 * dates and place right after it, the shape applicant tracking systems are
 * built to read.
 *
 * The Copy controls beside the email and phone exist for a recruiter pasting
 * into an applicant tracking system; they are screen-only and never print.
 */

const COPIED_FOR_MS = 1600;

/**
 * Copies with the async clipboard when the browser grants it, otherwise with
 * the older copy command through an off-screen textarea (embedded browsers
 * and some corporate profiles deny the first and still allow the second).
 * Resolves false only when neither worked.
 */
async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* denied; try the command below */
  }
  try {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const done = document.execCommand("copy");
    field.remove();
    return done;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "selected";

function CopyButton({ value, label, target }: { value: string; label: string; target: React.RefObject<HTMLElement> }) {
  const [state, setState] = useState<CopyState>("idle");
  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), COPIED_FOR_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    if (await copyText(value)) {
      setState("copied");
      return;
    }
    // Nothing could write the clipboard: select the text so Cmd+C does it.
    const node = target.current;
    const selection = window.getSelection();
    if (node && selection) {
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setState("selected");
  };

  const text = state === "copied" ? "Copied" : state === "selected" ? "Selected" : "Copy";
  const name =
    state === "copied"
      ? `${label} copied`
      : state === "selected"
        ? `${label} selected, press copy on your keyboard`
        : `Copy ${label}`;
  return (
    <button type="button" className="resume-copy" data-copied={state === "copied" || undefined} onClick={copy} aria-label={name}>
      {text}
    </button>
  );
}

function Entry({ entry, titleFirst }: { entry: ResumeEntry; titleFirst: boolean }) {
  return (
    <article className="resume-entry" id={`resume-${entry.id}`}>
      <h3 className="resume-entry-heading">
        {titleFirst ? (
          <>
            <span className="resume-entry-lead">{entry.title}</span>, {entry.role}
          </>
        ) : (
          <>
            <span className="resume-entry-lead">{entry.role}</span>, {entry.title}
          </>
        )}
      </h3>
      <p className="resume-entry-when">
        {entry.dates ? <span>{entry.dates}</span> : null}
        <span>{entry.location}</span>
      </p>
      {entry.summary || entry.bullets.length > 0 ? (
        <div className="resume-entry-body">
          {entry.summary ? <p className="resume-entry-summary">{entry.summary}</p> : null}
          {entry.bullets.length > 0 ? (
            <ul className="resume-entry-bullets">
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function Section({ id, heading, children }: { id: string; heading: string; children: React.ReactNode }) {
  return (
    <section className="resume-section" aria-labelledby={`resume-${id}-heading`}>
      <h2 id={`resume-${id}-heading`} className="resume-section-heading">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export function ResumeDocument() {
  const phoneDigits = RESUME_CONTACT.phone.replace(/\D/g, "");
  const emailRef = useRef<HTMLAnchorElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  return (
    <article className="resume-sheet" aria-label={`${RESUME_NAME} resume`}>
      <header className="resume-head">
        <h1 className="resume-name">{RESUME_NAME}</h1>
        <address className="resume-contact">
          <span className="resume-contact-item">{RESUME_CONTACT.location}</span>
          <span className="resume-contact-item">
            <a ref={emailRef} href={`mailto:${RESUME_CONTACT.email}`}>
              {RESUME_CONTACT.email}
            </a>
            <CopyButton value={RESUME_CONTACT.email} label="email" target={emailRef} />
          </span>
          <span className="resume-contact-item">
            <a ref={phoneRef} href={`tel:+1${phoneDigits}`}>
              {RESUME_CONTACT.phone}
            </a>
            <CopyButton value={RESUME_CONTACT.phone} label="phone number" target={phoneRef} />
          </span>
          <span className="resume-contact-item">
            <a href={`https://${RESUME_CONTACT.site}`}>{RESUME_CONTACT.site}</a>
          </span>
          <span className="resume-contact-item">
            <a href={`https://${RESUME_CONTACT.linkedin}`} target="_blank" rel="noopener noreferrer">
              {RESUME_CONTACT.linkedin}
            </a>
          </span>
          <span className="resume-contact-item">
            <a href={`https://${RESUME_CONTACT.github}`} target="_blank" rel="noopener noreferrer">
              {RESUME_CONTACT.github}
            </a>
          </span>
        </address>
      </header>

      <Section id="summary" heading="Summary">
        <p className="resume-summary">{RESUME_SUMMARY}</p>
      </Section>

      {RESUME_SECTIONS.map((section) => (
        <Section key={section.id} id={section.id} heading={section.heading}>
          {section.entries.map((entry) => (
            <Entry key={entry.id} entry={entry} titleFirst={Boolean(section.titleFirst)} />
          ))}
        </Section>
      ))}

      <Section id="skills" heading="Skills">
        {RESUME_SKILLS.map((group) => (
          <div key={group.label} className="resume-skill-group">
            <h3 className="resume-skill-label">{group.label}</h3>
            <ul className="resume-skill-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </article>
  );
}
