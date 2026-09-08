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
 * - Reading order is header, summary, Experience, Work, Education, Skills.
 *   Education and Skills sit in a side column on the printed page, but they
 *   come after the main column in the DOM, so the PDF's text stream and a
 *   screen reader both meet them last, whole, under their own headings.
 * - Bullets are plain sentences without a trailing period. The renderer owns
 *   the list markers.
 */

export interface ResumeContact {
  email: string;
  site: string;
  linkedin: string;
  phone: string;
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
  /** Rendered in the narrow right column beside Experience and Work, after them in reading order. */
  aside?: boolean;
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
  "Resume of Malik Zhang, Product Designer in Seattle: experience, work, education, and skills, with a one-page PDF to download.";

export const RESUME_CONTACT: ResumeContact = {
  email: "Malikzhang19@gmail.com",
  site: "malikzhang.com",
  linkedin: "linkedin.com/in/malik-zhang",
  phone: "(253) 408-9312",
};

export const RESUME_SUMMARY =
  "Product Designer bridging HCI and Industrial Design, shipping products since 2021. Turns dense, technical data into interfaces people can act on in seconds, prototyping in code to build alongside engineers and researchers.";

export const RESUME_SECTIONS: ResumeSection[] = [
  {
    id: "experience",
    heading: "Experience",
    entries: [
      {
        id: "neuralyfe",
        title: "NeuraLyfe",
        role: "Product Designer",
        subtitle: "FigBuild 2026 · 1st Place of 690 Teams · $10K Grand Prize",
        dates: "Mar 2026",
        location: "Seattle, WA",
        summary:
          "Designed an AI-enabled neurotechnology decision-support system that translates helmet impact data into real-time neurological risk insights for sideline medical staff.",
        bullets: [
          "Structured the diagnosis flow into three progressive views so non-specialist staff can act within seconds",
          "Prototyped real-time risk monitoring in Figma Make, pairing live sensor data with AI-generated summaries",
          "Encoded neurological metrics into visual signals and alert states readable at a glance",
        ],
      },
      {
        id: "spatial-editor",
        title: "Spatial Editor",
        role: "Product Designer",
        subtitle: "Capstone Project · New Paradigm for XR Text Input",
        dates: "Jan 2026 – Present",
        location: "Seattle, WA",
        summary:
          "Designed a new interaction paradigm for text input in XR, rethinking current high-friction methods through faster, multimodal alternatives.",
        bullets: [
          "Defined the problem space, identifying text input as XR's highest-friction task through a competitive teardown of 2 input methods",
          "Observed 8 Vision Pro and Quest users and ran interviews to map real-world friction patterns",
          "Prototyped 2 interaction concepts in Xcode, converging on a multimodal model that pairs predictive AI with gaze-led targeting",
          "Validated the model with 10 users in usability testing",
        ],
      },
      {
        id: "moti-oryne",
        title: "Moti: Plan · Oryne",
        role: "Product Designer + iOS Developer",
        subtitle: "Two iOS Apps Shipped Solo to the App Store",
        dates: "2025 – Present",
        location: "Seattle, WA",
        summary:
          "Designed and built Moti, an AI-native planning tool, and Oryne, an inspiration-capture app built on frictionless, category-free thought capture.",
        bullets: [
          "Owned end-to-end design and build in SwiftUI and SwiftData, using on-device Apple Intelligence to organize captured thoughts privately, without cloud processing",
          "Localized end-to-end for the Chinese market with a 257-key, human-reviewed Simplified Chinese localization",
        ],
      },
      {
        id: "aura",
        title: "Aura",
        role: "Product + ID",
        subtitle: "Motion Sickness Relief System",
        dates: "Sep 2025 – Dec 2025",
        location: "Seattle, WA",
        summary:
          "Designed a sensor-driven wearable that reduces motion sickness through anticipatory sensory feedback, intervening before symptoms onset.",
        bullets: [
          "Reframed relief from reactive treatment to anticipatory care, using real-time HRV data to detect early autonomic stress before discomfort begins",
          "Designed the sensing-to-feedback loop, triggering 100 Hz sound stimulation grounded in published vestibular research on motion sickness",
          "Defined the wearable form factor for inflight use, balancing sensor placement against long-haul wear comfort",
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
        dates: "Sep 2025 – Present",
        location: "Seattle, WA",
        bullets: [
          "Designed an online inventory system to streamline access to equipment",
          "Supported prototyping and equipment access for student design work",
          "Maintained studio technology operations for project development",
        ],
      },
      {
        id: "ikea",
        title: "IKEA",
        role: "UX Designer Intern",
        dates: "Mar 2025 – Aug 2025",
        location: "Hangzhou, China",
        bullets: [
          "Contributed to interaction design for retail and service experiences, supporting accessible, user-centered solutions",
          "Supported research and concept development with cross-functional partners",
        ],
      },
      {
        id: "focused-photonics",
        title: "Focused Photonics Inc.",
        role: "Product Designer Intern",
        dates: "Jun 2024 – Sep 2024",
        location: "Hangzhou, China",
        bullets: [
          "Contributed to form and interaction design for monitoring devices",
          "Translated technical requirements into usable product concepts",
        ],
      },
    ],
  },
  {
    id: "education",
    heading: "Education",
    aside: true,
    entries: [
      {
        id: "uw",
        title: "University of Washington",
        role: "Master of Human Computer Interaction + Design",
        location: "Seattle, WA",
        bullets: [],
      },
      {
        id: "zjut",
        title: "Zhejiang University of Technology",
        role: "B.E., Industrial Design",
        location: "Hangzhou, China",
        bullets: [],
      },
    ],
  },
];

export const RESUME_SKILLS: ResumeSkillGroup[] = [
  {
    label: "Strategy",
    items: [
      "Problem Framing",
      "Product Strategy",
      "Opportunity Mapping",
      "Design Principles",
      "Trade-off Analysis",
      "Storytelling, Critique",
      "Stakeholder Alignment",
    ],
  },
  {
    label: "Design",
    items: [
      "End-to-End Product Design",
      "Interaction Design",
      "Data-Dense Interfaces",
      "Data Visualization",
      "Information Design",
      "Query, Filter, Alert Flows",
      "Systems Thinking",
      "Design Systems",
      "Accessibility (WCAG)",
      "Rapid Prototyping",
    ],
  },
  {
    label: "Research",
    items: [
      "User Research, Interviews",
      "Research Synthesis",
      "Usability Testing, A/B",
      "Product and Usage Metrics",
      "Contextual Inquiry",
      "Competitive Analysis",
      "Journey Maps, User Flows",
    ],
  },
  {
    label: "AI Workflows",
    items: [
      "AI-Native Product Design",
      "Human-AI Interaction",
      "AI Prototyping, Ideation",
      "LLM Design Workflows",
      "Claude Code, Cursor, Codex",
    ],
  },
  {
    label: "Tools",
    items: [
      "Figma, Figma Make",
      "Xcode, SwiftUI, Unity",
      "HTML, CSS, Arduino",
      "Photoshop, After Effects",
      "Premiere Pro, Keyshot",
    ],
  },
];
