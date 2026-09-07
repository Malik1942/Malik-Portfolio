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
 */

function Entry({ entry, compact }: { entry: ResumeEntry; compact: boolean }) {
  const when = `${entry.dates} · ${entry.location}`;
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
  return (
    <article className="resume-sheet" aria-label={`${RESUME_NAME} resume`}>
      <header className="resume-head">
        <div>
          <h1 className="resume-name">{RESUME_NAME}</h1>
          <p className="resume-title">{RESUME_TITLE}</p>
        </div>
        <address className="resume-contact">
          <a href={`mailto:${RESUME_CONTACT.email}`}>{RESUME_CONTACT.email}</a>
          <a href={`https://${RESUME_CONTACT.site}`}>{RESUME_CONTACT.site}</a>
          <a href={`https://${RESUME_CONTACT.linkedin}`}>{RESUME_CONTACT.linkedin}</a>
          <a href={`tel:+1${RESUME_CONTACT.phone.replace(/\D/g, "")}`}>{RESUME_CONTACT.phone}</a>
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
