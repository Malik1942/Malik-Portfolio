import { SECTIONS, type SectionKey, type SectionLabel } from "@/lib/sections";
import auraCover from "@/assets/aura-cover.webp";
import neuralyfeCover from "@/assets/neuralyfe-cover.webp";
import flowprintCover from "@/assets/flowprint-cover.webp";
import tubularCover from "@/assets/tubular-cover.webp";
import moodmuseHero from "@/assets/moodmuse-hero.webp";
import studioWatersCover from "@/assets/studio-waters-cover.webp";
import motiCard from "@/assets/moti-card-poster.webp";
import motiCardVideo from "@/assets/moti-card.mp4";
import calmmouseCardPoster from "@/assets/calmmouse-card-poster.webp";
import calmmouseCardVideo from "@/assets/calmmouse-card.mp4";
import inkworkCard from "@/assets/inkwork-card.webp";
import inkworkCardVideo from "@/assets/inkwork-card.mp4";
import zeatCard from "@/assets/zeat-hero.webp";
import rangerCard from "@/assets/ranger-hero.webp";
import oryneCard from "@/assets/oryne-card-poster.webp";
import oryneCardVideo from "@/assets/oryne-card.mp4";

// ── Skill vocabulary ─────────────────────────────────────────────────────────
// A controlled list, as a union so a typo fails typecheck. The words match the
// Sep 2026 resume so the site and the resume use the same terms. Cap is 12;
// every entry must appear on the resume or be added to it.
export type Skill =
  | "Data-Dense UI"
  | "Interaction Design"
  | "User Research"
  | "Prototyping in Code"
  | "AI-Native"
  | "Industrial Design"
  | "Physical Prototyping"
  | "Visual Design"
  | "Design Systems"
  | "iOS / SwiftUI";

/** Runtime copy of the `Skill` union, for the data tests. */
export const SKILLS: readonly Skill[] = [
  "Data-Dense UI",
  "Interaction Design",
  "User Research",
  "Prototyping in Code",
  "AI-Native",
  "Industrial Design",
  "Physical Prototyping",
  "Visual Design",
  "Design Systems",
  "iOS / SwiftUI",
];

/** A card shows at most this many skill chips. */
export const MAX_SKILLS = 3;

// ── Card links and destinations ──────────────────────────────────────────────
// "Shipped" is an attribute, never a section: a shipped project carries an
// outbound link chip on its card, in whichever section it lives.
export type ProjectLinkLabel = "App Store" | "GitHub" | "Live";
export interface ProjectLink {
  label: ProjectLinkLabel;
  url: string;
}

// What clicking the card does. Every card on the homepage is clickable; a
// project that cannot be opened is not shown.
export type ProjectDestination =
  /** Routes to /project/:id. */
  | { kind: "case-study" }
  /** Opens an in-place lightbox, no route change. */
  | { kind: "video"; src: string; poster: string }
  /** Leaves the site. */
  | { kind: "external"; url: string };

export interface Project {
  id: string;
  title: string;
  section: SectionKey;
  /** 0 to 3 entries from the controlled vocabulary. */
  skills: Skill[];
  links?: ProjectLink[];
  destination: ProjectDestination;
  description: string;
  /** One-line hook under the title, Selected Work hero rows only. */
  signal?: string;
  role: string;
  year: string;
  coverImage?: string;
  coverVideo?: string;
  coverFit?: "cover" | "contain";
  /** The cover media's own intrinsic ratio, as "W/H" (e.g. "1600/1000").
   *  Reserves the card's media box before the image or video has loaded, so the
   *  page does not grow underneath a project-dot scroll that is already in
   *  flight. Must match the asset — `coverAspect.test.ts` reads the real files
   *  and fails if a cover is swapped without updating this. */
  coverAspect?: string;
  details?: string;
}

const CASE_STUDY: ProjectDestination = { kind: "case-study" };

// ── The project list ─────────────────────────────────────────────────────────
// Order within a section is display order. Selected Work leads with Moti (the
// shipped one), then NeuraLyfe, then Aura; Spatial Editor has no case study
// yet, so the section shows three until it does. Never pad with a WIP
// card. Selected Work + More Work are the homepage ("Work"); Studio is its own
// page.
//
// Skill chips are intentionally empty until the vocabulary is confirmed (open
// item 4 in docs/superpowers/specs/2026-09-02-homepage-tiers-design.md).
export const PROJECTS: readonly Project[] = [
  // ── Selected Work: full case studies ──
  {
    id: "moti",
    title: "Moti",
    section: "selected",
    skills: [],
    links: [{ label: "App Store", url: "https://apps.apple.com/us/app/moti-plan/id6770705491" }],
    destination: CASE_STUDY,
    signal: "An AI-Native Timeline for Real Projects",
    description: "Shipped solo on the App Store: an AI-native iOS planner that turns messy, natural language into a living, timeline-aware plan.",
    role: "Product Designer & Builder",
    coverImage: motiCard,
    coverAspect: "1280/800",
    // The Moti: Plan reel — the title card, then dictating a messy sentence and
    // watching it land on the timeline, then back to the title card. coverImage is
    // that opening frame, so it serves as the poster, the reduced-motion still, and
    // the resting state the reel holds on once it has played.
    coverVideo: motiCardVideo,
    year: "2026",
    details: "Shipped solo on the App Store: an AI-native iOS planner that turns messy, natural language into a living, timeline-aware plan.\n\nBuilt on a hybrid SLM + LLM system, specified spec-first with a full PRD before writing any code.",
  },
  {
    id: "neuralyfe",
    title: "NeuraLyfe",
    section: "selected",
    skills: [],
    destination: CASE_STUDY,
    signal: "Brain Impact Visualization for Athletes and Medical Teams",
    description: "1st Place, FigBuild 2026. Making invisible brain trauma visible before it becomes irreversible.",
    role: "Product Designer, Maker",
    coverImage: neuralyfeCover,
    coverAspect: "1920/1074",
    year: "2026",
    details: "Won 1st Place at FigBuild 2026 for Impact Replay, an AI-driven brain-impact visualization for athletes and medical teams.\n\nLed ideation and problem scoping, designed the Impact Replay interface, and contributed across both digital and physical product development.",
  },
  {
    id: "aura",
    title: "Aura",
    section: "selected",
    skills: [],
    destination: CASE_STUDY,
    signal: "AI-Powered Anticipatory Motion Sickness Relief",
    description: "A speculative in-flight motion-sickness concept. Its refined form was preferred by 93.75% of testers.",
    role: "Product Designer",
    year: "2025",
    coverImage: auraCover,
    coverAspect: "2400/1350",
    details: "A speculative concept for anticipating motion sickness in flight, designed with a 5-person team over 5 weeks.\n\nUser testing validated the refined form: 15 of 16 testers (93.75%) preferred it over the initial design.",
  },

  // ── More Work: the rest of the case studies, told as process ──
  {
    id: "oryne",
    title: "Oryne",
    section: "more",
    skills: [],
    links: [{ label: "App Store", url: "https://apps.apple.com/us/app/oryne/id6778995892" }],
    destination: CASE_STUDY,
    description: "Shipped solo on the App Store: an inspiration-capture app where thoughts drift, gather into currents, and come back on their own.",
    role: "Product Designer & Builder",
    coverImage: oryneCard,
    // 1920x1200 rather than the 1280x800 the other reels use: the phone screen
    // is a quarter of the frame, so at 1280 wide it was ~300px and read soft on
    // a retina card. Composited from the raw 1206x2622 recording, not the film.
    coverAspect: "1920/1200",
    // The Oryne reel: the icon blooms into the wordmark and the tagline, then the
    // Ocean gathers a current. coverImage is the wordmark frame, so it serves as the
    // poster, the reduced-motion still, and the resting state once the reel has played.
    coverVideo: oryneCardVideo,
    year: "2026",
    details: "First commit to the App Store in 23 days, built around one metaphor: your mind as an ocean.\n\nAll of its intelligence runs on the device, in English and Simplified Chinese.",
  },
  {
    id: "moodmuse",
    title: "Mood Muse",
    section: "more",
    skills: [],
    destination: CASE_STUDY,
    description: "An emotion-sensing paintbrush for autistic children. The brush reads the hand, answers with color and scent, and the app turns the session into a record parent and therapist can share.",
    role: "Industrial Design Lead · Sole UX Designer",
    coverImage: moodmuseHero,
    coverAspect: "1672/941",
    year: "2024",
    details: "A smart paintbrush with GSR and heart-rate sensing in the grip, a rotary ink switcher that changes color with the child's state, and a companion app for parents and therapists.\n\nLed the team, owned the industrial design and working prototype, and was the only designer on the app.",
  },
  {
    id: "tubular",
    title: "Tubular",
    section: "more",
    skills: [],
    destination: CASE_STUDY,
    description: "Defy gravity. Shape the path.",
    role: "Product Designer, Maker",
    coverImage: tubularCover,
    coverAspect: "1920/1280",
    year: "2026",
    details: "An experimental physics-based toy exploring fluid dynamics through tactile play.\n\nCombines industrial design with digital prototyping.",
  },
  {
    id: "flowprint",
    title: "FlowPrint",
    section: "more",
    skills: [],
    destination: CASE_STUDY,
    description: "A 3D-printing onboarding system targeting a setup-time cut from about an hour to 15 minutes.",
    role: "Lead Product Designer",
    coverImage: flowprintCover,
    coverAspect: "1756/988",
    coverFit: "contain",
    year: "2025",
    details: "A consumer 3D-printing onboarding flow targeting a setup-time cut from about an hour to 15 minutes.\n\nIncludes onboarding flows, real-time print monitoring, and a material recommendation engine.",
  },

  // ── Studio: the thing is the story. Small software designed and built solo
  // with AI tools, then the industrial design work that came before it. ──
  {
    id: "calmmouse",
    title: "CalmMouse",
    section: "studio",
    skills: [],
    links: [{ label: "Live", url: "https://calmmouse.malikzhang.com/" }],
    destination: CASE_STUDY,
    description: "A macOS menu-bar app that stops the Magic Mouse from scrolling every time you click: the fix Apple never shipped.",
    role: "Designer + Builder",
    year: "2026",
    coverImage: calmmouseCardPoster,
    coverAspect: "1280/720",
    // The hero loop: the site's mouse with its tap ripple, a punch into the
    // Without/With demo, and a pull back wide. Poster is the loop's first frame.
    coverVideo: calmmouseCardVideo,
    details: "A signed, notarized, self-updating native macOS app, free and open source.\n\nThe design problem underneath: a product that succeeds when you notice nothing.",
  },
  {
    id: "inkwork",
    title: "Inkwork",
    section: "studio",
    skills: [],
    links: [{ label: "Live", url: "https://www.malikzhang.com/inkwork" }],
    destination: CASE_STUDY,
    description: "A styled-QR studio with a point of view: pick a style, check the proof, export",
    role: "Designer + Builder",
    year: "2026",
    coverImage: inkworkCard,
    coverAspect: "1280/720",
    // The Arcade theme mid-flight: styles switching, then the gradient controls
    // repainting the code. coverImage stays as its poster / reduced-motion still.
    coverVideo: inkworkCardVideo,
    details: "A styled-QR studio, live at malikzhang.com/inkwork: sixteen presets, two complete themes on one token system, and a scannability check that decodes the code you just made.",
  },
  {
    id: "studiowaters",
    title: "Studio Waters",
    section: "studio",
    skills: [],
    destination: CASE_STUDY,
    description: "A CPX-powered interactive game built through vibe coding",
    role: "Designer + Builder",
    year: "2026",
    coverImage: studioWatersCover,
    coverAspect: "2316/1448",
    details: "A motion-controlled fishing experience built with Claude and p5.js: physical gestures mapped to calm, responsive digital play.",
  },
  {
    id: "zeat",
    title: "ZEAT",
    section: "studio",
    skills: [],
    destination: CASE_STUDY,
    description: "A cleaning robot for stadium grandstands, designed around the eight-hour gap between events, when three tons of trash have to disappear.",
    role: "Industrial Designer",
    year: "2025",
    coverImage: zeatCard,
    coverAspect: "4725/2993",
    details: "A ground-based cleaning robot for stadium grandstands, designed solo across the robot, its mechanisms, and the system that dispatches it.\n\nModeled, 3D printed, hand-finished, and exhibited as a driving appearance model.",
  },
  {
    id: "ranger",
    title: "RANGER",
    section: "studio",
    skills: [],
    destination: CASE_STUDY,
    description: "An underwater drone that finds abandoned fishing nets, fires an airbag through the mesh, and lets the net float itself up to the boat.",
    role: "Industrial Designer",
    year: "2024",
    coverImage: rangerCard,
    coverAspect: "2400/1345",
    details: "An underwater drone for ghost gear recovery, designed solo across the vehicle, the airbag capture mechanism, the control system, and the Neptune Net dispatch platform.\n\nA resolved concept: modeled and rendered, never physically prototyped.",
  },
];

/** Projects in one section, in display order. */
export const projectsInSection = (section: SectionKey): Project[] =>
  PROJECTS.filter((project) => project.section === section);

export const getProject = (id: string): Project | undefined =>
  PROJECTS.find((project) => project.id === id);

/** Where a case-study page should send the visitor when they leave it. Studio
 *  projects go back to /studio; homepage projects scroll to their section. */
export const projectReturn = (id: string): { to: string; state?: { scrollTo: string } } => {
  const key = getProject(id)?.section ?? "selected";
  const section = SECTIONS[key];
  if (section.path !== "/") return { to: section.path };
  return { to: "/", state: { scrollTo: section.id } };
};

/** Section eyebrow for a project, e.g. on its case-study page. Throws for an
 *  id that is not on the homepage, so a detail page can't quietly show a stale
 *  label for a project the homepage no longer lists. */
export const sectionLabelForProject = (id: string): SectionLabel => {
  const project = getProject(id);
  if (!project) throw new Error(`No homepage project with id "${id}"`);
  return SECTIONS[project.section].label;
};

/** Ids of every project whose section draws hero dots. */
export const projectIdsWithDots = (): string[] =>
  PROJECTS.filter((project) => SECTIONS[project.section].dots !== "none").map((p) => p.id);
