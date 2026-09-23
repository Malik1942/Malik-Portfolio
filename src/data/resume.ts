/**
 * The resume, as data.
 *
 * This is the single source for both the /resume page and the PDF it offers
 * for download (scripts/generate-resume-pdf.mjs prints the page). It replaced
 * a Figma export in Sep 2026: that file set every glyph in a nameless Type3
 * font, emitted its text in layer order rather than reading order, and drew
 * bullets as `"` characters, so an applicant tracking system saw roles and
 * dates far from their entries and Education spliced into Experience.
 *
 * Conventions that keep the document parseable:
 * - Dates are `Mon YYYY` or `YYYY`, ranges join with an en dash, and an open
 *   range ends in `Present`. The data test enforces the shape.
 * - Each entry is one organisation or project (`title`), one role, and one
 *   place. A subtitle carries the award or the project's one-line frame.
 * - Reading order is header, summary, Experience, Work, Education, Skills,
 *   in one column on screen and on paper.
 * - Bullets are plain sentences without a trailing period. The renderer owns
 *   the list markers.
 */

export interface ResumeContact {
  email: string;
  phone: string;
  site: string;
  linkedin: string;
  github: string;
}

export interface ResumeEntry {
  id: string;
  /** Organisation or project name; the entry's heading. */
  title: string;
  role: string;
  /** Award line or one-line frame under the role. */
  subtitle?: string;
  /** `Mon YYYY`, `YYYY`, or a range of either joined by an en dash. Education carries none by choice. */
  dates?: string;
  location: string;
  summary?: string;
  bullets: string[];
}

export interface ResumeSection {
  id: string;
  heading: string;
  entries: ResumeEntry[];
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export const RESUME_NAME = "Malik Zhang";
export const RESUME_TITLE = "Product Designer";
export const RESUME_PDF_PATH = "/malik-resume-2026.pdf";
/** Shown in the page's top bar so a recruiter knows the document is current. Update with the content. */
export const RESUME_UPDATED = "Sep 2026";
export const RESUME_DESCRIPTION =
  "Resume of Malik Zhang, Product Designer in Seattle: experience, work, education, and skills, with a PDF to download.";

export const RESUME_CONTACT: ResumeContact = {
  email: "Malikzhang19@gmail.com",
  phone: "(253) 408-9312",
  site: "malikzhang.com",
  linkedin: "linkedin.com/in/malik-zhang",
  github: "github.com/Malik1942",
};

export const RESUME_SUMMARY =
  "Product designer who ships what he designs. Two AI-native iOS apps on the App Store, a signed open-source macOS tool for coding agents, and an internal system a graduate program runs its operations on, each taken from problem framing through high-fidelity UI to production code. Trained in HCI and Industrial Design, works daily in Claude Code, Cursor, and Codex CLI, and settles design decisions by building both options and testing them rather than arguing in mockups.";

export const RESUME_SECTIONS: ResumeSection[] = [
  {
    id: "experience",
    heading: "Experience",
    entries: [
      {
        id: "locant",
        title: "Locant",
        role: "Product Designer",
        dates: "Sep 2026",
        location: "Seattle, WA",
        summary:
          "Open-source macOS tool, designed and built end to end: point at one UI element in any app and hand a coding agent structured data about it instead of a screenshot. Signed, notarized, and shipped with its own launch site and three-minute film.",
        bullets: [
          "Designed the whole surface, from a double-tap Control gesture and hover overlay to a five-rung fallback ladder that names which rung it reached instead of failing silently, so the tool stays honest about its own confidence",
          "Scoped it to exactly two system permissions, Accessibility and Screen Recording, with no third prompt, no account, and no telemetry, and wrote the disclosure so a user reading the prompt can tell what never leaves the machine",
          "Built the integration as an MCP server verified end to end with Codex CLI, Claude Code, and Cursor, and published a compatibility matrix stating what is verified and what is untested",
          "Went from nothing to a working version in three hours and has shipped through v0.7, then measured it against the workflow it replaced across 30 runs: clarifying questions fell from 17 of 18 to 0 of 12 and median time to edit from 39s to 22s, with the method and caveats published",
        ],
      },
      {
        id: "moti-oryne",
        title: "Moti: Plan, and Oryne",
        role: "Product Designer",
        dates: "2025 – Present",
        location: "Seattle, WA",
        summary:
          "Two AI-native iOS apps designed, built, and shipped end to end, an inspiration-capture tool and a planning tool, from concept through App Store review and the iteration that followed.",
        bullets: [
          "Designed Oryne around one decision about feel, that capturing a thought should take less time than having it, and cut everything standing between the impulse and the record",
          "Owned flows, interactions, and visual design end to end, from interaction model to high-fidelity screens, motion, and gesture, and on to production SwiftUI",
          "Designed the AI features so on-device intelligence behaves predictably and the user can always tell what it did, treating the feel of an AI feature as a design decision rather than a model output",
        ],
      },
      {
        id: "neuralyfe",
        title: "NeuraLyfe",
        role: "Product Designer",
        dates: "Mar 2026",
        location: "Seattle, WA",
        subtitle: "FigBuild 2026 · 1st Place of 690 Teams · $10K Grand Prize",
        summary:
          "Four-day build of a decision system turning a live helmet sensor stream into guidance for sideline medical staff.",
        bullets: [
          "Structured the stream into three progressive views readable within seconds by someone making a consequential call under pressure, on a reusable set of visual signals and states",
          "Designed the protocol as five explicit states and decided which were advisory and which the system enforces, making removal non-overridable so a critical alert could not be dismissed in the moment",
          "Presented the reasoning and the trade-offs behind each state to judges and cross-functional teammates",
        ],
      },
      {
        id: "uw-equipment-system",
        title: "UW MHCI+D Equipment System",
        role: "Product Designer",
        dates: "Sep 2025 – Aug 2026",
        location: "Seattle, WA",
        summary:
          "Zero-to-one internal system for a graduate program, designed and launched end to end, that the program now runs its equipment operations on.",
        bullets: [
          "Designed role-based access for administrators, members, and read-only users, and modeled the request and return workflow as explicit states with approvals and shift handoffs",
          "Built the admin surface around a dense filterable table with bulk actions, then ran it as its administrator as well as its designer, so every edge case I had not designed for came back to me",
        ],
      },
      {
        id: "inkwork-calmmouse",
        title: "Inkwork and CalmMouse",
        role: "Product Designer",
        dates: "2026",
        location: "Seattle, WA",
        bullets: [
          "Two open-source products built end to end, each with its own visual language and launch site: Inkwork, a styled QR code generator in React, TypeScript, and Vite, redesigned from an AI-generated first draft into a product with a point of view; and CalmMouse, a Swift macOS utility built with Claude Code",
        ],
      },
    ],
  },
  {
    id: "work",
    heading: "Work",
    entries: [
      {
        id: "uw-mhcid",
        title: "UW MHCI+D",
        role: "Technology and Equipment Manager",
        dates: "Sep 2025 – Aug 2026",
        location: "Seattle, WA",
        bullets: ["Ran the program's equipment operations and designed and launched the system above to run them"],
      },
      {
        id: "ikea",
        title: "IKEA",
        role: "UX Designer Intern",
        dates: "Mar 2025 – Aug 2025",
        location: "Hangzhou, China",
        bullets: [
          "Contributed interaction design for retail and service experiences, working with cross-functional product and engineering partners",
        ],
      },
      {
        id: "focused-photonics",
        title: "Focused Photonics",
        role: "Product Designer Intern",
        dates: "Jun 2024 – Sep 2024",
        location: "Hangzhou, China",
        bullets: [
          "Designed form and interaction for monitoring instruments, translating technical constraints into usable product concepts",
        ],
      },
    ],
  },
  {
    id: "education",
    heading: "Education",
    entries: [
      {
        id: "uw",
        title: "University of Washington",
        role: "MHCI+D in Human Computer Interaction + Design",
        location: "Seattle, WA",
        bullets: [],
      },
      {
        id: "zjut",
        title: "Zhejiang University of Technology",
        role: "B.E. in Industrial Design",
        location: "Hangzhou, China",
        bullets: [],
      },
    ],
  },
];

export const RESUME_SKILLS: ResumeSkillGroup[] = [
  {
    label: "Craft",
    items: [
      "End-to-End Product Design",
      "Interaction Design",
      "Visual Design",
      "Motion and Transitions",
      "Typography and Layout",
      "Information Architecture",
      "Accessibility (WCAG)",
    ],
  },
  {
    label: "Designing for AI Systems",
    items: [
      "AI Features as Core UX",
      "Predictable Behavior for Non-Deterministic Systems",
      "Confidence and Fallback Reporting",
      "Override and Enforcement Decisions",
      "Agent Integration (MCP)",
    ],
  },
  {
    label: "Shipping in Code",
    items: [
      "Swift",
      "SwiftUI",
      "Xcode",
      "React",
      "TypeScript",
      "Vite",
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Git and GitHub",
      "App Store and Signed macOS Release",
    ],
  },
  {
    label: "AI-First Workflow",
    items: ["Claude Code", "Cursor", "Codex CLI", "Figma Make", "Spec and Context Engineering"],
  },
  {
    label: "Research",
    items: [
      "Moderated Usability Testing",
      "User Interviews",
      "Contextual Observation",
      "Controlled Comparison Studies",
    ],
  },
  {
    label: "Tools",
    items: ["Figma", "Figma Make", "Photoshop", "After Effects", "Rhino", "Keyshot"],
  },
];
