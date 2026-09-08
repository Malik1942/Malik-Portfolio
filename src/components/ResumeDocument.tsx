import { useEffect, useRef, useState } from "react";
import {
  RESUME_CONTACT,
  RESUME_NAME,
  RESUME_SECTIONS,
  RESUME_SKILLS,
  RESUME_SUMMARY,
  RESUME_TITLE,
  type ResumeEntry,
  type ResumeSection,
} from "@/data/resume";
import "@/styles/resume.css";

/**
 * The resume as a document: real headings, real lists, one reading order.
 *
 * The DOM order is the order a parser should read: name, title, contact,
 * summary, Experience and Work in the main column, then Education and Skills
 * in the aside. Nothing is positioned out of flow, so the printed PDF's text
 * stream follows the same order even though the aside sits beside the main
 * column on paper. Each main entry puts the organisation and its dates on one
 * line and the role on the next, the two-line shape applicant tracking
 * systems are built to read.
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

function Entry({ entry, compact }: { entry: ResumeEntry; compact: boolean }) {
  const when = [entry.dates, entry.location].filter(Boolean).join(" · ");
  return (
    <article className="resume-entry" id={`resume-${entry.id}`}>
      <div className="resume-entry-row">
        <h3 className="resume-entry-title">{entry.title}</h3>
        {compact ? null : <span className="resume-entry-when">{when}</span>}
      </div>
      <p className="resume-entry-role">
        {entry.role}
        {entry.subtitle ? <span className="resume-entry-subtitle"> · {entry.subtitle}</span> : null}
      </p>
      {compact ? <p className="resume-entry-when">{when}</p> : null}
      {entry.summary ? <p className="resume-entry-summary">{entry.summary}</p> : null}
      {entry.bullets.length > 0 ? (
        <ul className="resume-entry-bullets">
          {entry.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function Section({ section }: { section: ResumeSection }) {
  return (
    <section className="resume-section" aria-labelledby={`resume-${section.id}-heading`}>
      <h2 id={`resume-${section.id}-heading`} className="resume-section-heading">
        {section.heading}
      </h2>
      {section.entries.map((entry) => (
        <Entry key={entry.id} entry={entry} compact={Boolean(section.aside)} />
      ))}
    </section>
  );
}

export function ResumeDocument() {
  const main = RESUME_SECTIONS.filter((section) => !section.aside);
  const aside = RESUME_SECTIONS.filter((section) => section.aside);
  const phoneDigits = RESUME_CONTACT.phone.replace(/\D/g, "");
  const emailRef = useRef<HTMLAnchorElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  return (
    <article className="resume-sheet" aria-label={`${RESUME_NAME} resume`}>
      <header className="resume-head">
        <div>
          <h1 className="resume-name">{RESUME_NAME}</h1>
          <p className="resume-title">{RESUME_TITLE}</p>
        </div>
        <address className="resume-contact">
          <span className="resume-contact-item">
            <a ref={emailRef} href={`mailto:${RESUME_CONTACT.email}`}>
              {RESUME_CONTACT.email}
            </a>
            <CopyButton value={RESUME_CONTACT.email} label="email" target={emailRef} />
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
            <a ref={phoneRef} href={`tel:+1${phoneDigits}`}>
              {RESUME_CONTACT.phone}
            </a>
            <CopyButton value={RESUME_CONTACT.phone} label="phone number" target={phoneRef} />
          </span>
        </address>
      </header>

      <p className="resume-summary">{RESUME_SUMMARY}</p>

      <div className="resume-body">
        <div className="resume-main">
          {main.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>

        <aside className="resume-aside">
          {aside.map((section) => (
            <Section key={section.id} section={section} />
          ))}

          <section className="resume-section" aria-labelledby="resume-skills-heading">
            <h2 id="resume-skills-heading" className="resume-section-heading">
              Skills
            </h2>
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
          </section>
        </aside>
      </div>
    </article>
  );
}
