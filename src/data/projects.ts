import { SECTIONS, type SectionKey, type SectionLabel } from "@/lib/sections";
import auraCover from "@/assets/aura-cover.webp";
import neuralyfeCover from "@/assets/neuralyfe-cover.webp";
import flowprintCover from "@/assets/flowprint-cover.webp";
import tubularCover from "@/assets/tubular-cover.webp";
import moodmuseHero from "@/assets/moodmuse-hero.webp";
import studioWatersCover from "@/assets/studio-waters-cover.webp";
import motiCard from "@/assets/moti-card-poster.webp";
import motiCardVideo from "@/assets/moti-card.mp4";
import neuralyfeCardVideo from "@/assets/neuralyfe-card.mp4";
import auraCardVideo from "@/assets/aura-card.mp4";
import calmmouseCardPoster from "@/assets/calmmouse-card-poster.webp";
import calmmouseCardVideo from "@/assets/calmmouse-card.mp4";
import inkworkCard from "@/assets/inkwork-card.webp";
import inkworkCardVideo from "@/assets/inkwork-card.mp4";
import zeatCard from "@/assets/zeat-hero.webp";
import rangerCard from "@/assets/ranger-hero.webp";
import oryneCard from "@/assets/oryne-card-poster.webp";
import oryneCardVideo from "@/assets/oryne-card.mp4";
import spatialEditorCard from "@/assets/spatial-editor-card.webp";

// ── Skill vocabulary ─────────────────────────────────────────────────────────
// A controlled list, as a union so a typo fails typecheck. Cap is 12.
//
// The names are the disciplines the large design orgs hire for, so a recruiter
// reads a chip as a role they have a headcount for: Apple's Human Interface
// group (Design Prototyper / Design Engineer, Motion, Industrial Design,
// Human Factors), Google's Pixel UX team (UX Research, UX Engineer, Hardware
// UX, Motion Design), Amazon Design (UX Research, Design Technologist,
// Industrial Design). A discipline that would land on nearly every card
// ("Interaction Design", "Product Design", "UX Design") is not in the list: a
// chip everyone carries sorts nothing. Platforms ("iOS") are not skills; the
// description says "App Store" where it matters. "AI-Native" is the one word
// that is ours rather than theirs: it is the thesis of the portfolio.
export type Skill =
  | "AI-Native"
  | "Design Engineering"
  | "Hardware UX"
  | "Industrial Design"
  | "Physical Prototyping"
  | "UX Research"
  | "Data Visualization"
  | "Spatial Computing"
  | "Motion Design"
  | "Visual Design"
  | "Design Systems"
  | "Inclusive Design";

/** Runtime copy of the `Skill` union, for the data tests. */
export const SKILLS: readonly Skill[] = [
  "AI-Native",
  "Design Engineering",
  "Hardware UX",
  "Industrial Design",
  "Physical Prototyping",
  "UX Research",
  "Data Visualization",
  "Spatial Computing",
  "Motion Design",
  "Visual Design",
  "Design Systems",
  "Inclusive Design",
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

// What clicking the card does. Case-study, video, and external cards are
// clickable. `placeholder` is the one exception: a temporary card with a
// cover and no destination, used until the case study exists.
export type ProjectDestination =
  /** Routes to /project/:id. */
  | { kind: "case-study" }
  /** Opens an in-place lightbox, no route change. */
  | { kind: "video"; src: string; poster: string }
  /** Leaves the site. */
  | { kind: "external"; url: string }
  /** Shown on the homepage, not a link. */
  | { kind: "placeholder" };

// ── Studio groups ────────────────────────────────────────────────────────────
// The Studio page reads in two halves, named for the two ends of the page's
// headline ("From industrial design to products I ... build with AI"). Order
// here is page order: the software first, because it is what the headline
// promises, then the industrial design it grew out of.
export type StudioGroupKey = "software" | "machines";

export interface StudioGroup {
  key: StudioGroupKey;
  /** Group heading, set as an eyebrow above its grid. */
  label: string;
  /** One line under the heading that says what the group is. */
  blurb: string;
}

export const STUDIO_GROUPS: readonly StudioGroup[] = [
  {
    key: "software",
    label: "Built with AI",
    blurb:
      "A macOS app, a web tool, and a game you play with your hands: designed, built, and shipped with my AI workflow.",
  },
  {
    key: "machines",
    label: "Industrial design",
    blurb:
      "The physical products that came before the software: a stadium-cleaning robot and a ghost-net drone, each designed end to end.",
  },
];

export interface Project {
  id: string;
  title: string;
  section: SectionKey;
  /** Studio projects only: which half of the Studio page the tile sits in. */
  studioGroup?: StudioGroupKey;
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
// shipped planner — the most immediately legible product), then NeuraLyfe,
// Aura, and Oryne. Oryne is the more authored second app and closes the
// section rather than opening it. Spatial Editor has no case study yet, so it
// sits in More Work as a placeholder card. Selected Work + More Work are the
// homepage ("Work"); Studio is its own page.
//
// Skill chips are the second facet on a card: sections answer "how deep", the
// chips answer "which skills". They are also the lens controls (src/lib/lens.ts):
// clicking one highlights every project that carries it, across all three
// sections. Order matters — a Studio tile shows only its first two.
export const PROJECTS: readonly Project[] = [
  // ── Selected Work: full case studies ──
  {
    id: "moti",
    title: "Moti",
    section: "selected",
    skills: ["AI-Native", "Design Engineering"],
    links: [{ label: "App Store", url: "https://apps.apple.com/us/app/moti-plan/id6770705491" }],
    destination: CASE_STUDY,
    signal: "An AI-Native Timeline for Real Projects",
    description: "Designed, built, and shipped on the App Store: an AI-native iOS planner that turns messy, natural language into a living, timeline-aware plan.",
    role: "0→1 Product Designer & Builder",
    coverImage: motiCard,
    coverAspect: "1280/800",
    // The Moti: Plan reel — the title card, then dictating a messy sentence and
    // watching it land on the timeline, then back to the title card. coverImage is
    // that opening frame, so it serves as the poster, the reduced-motion still, and
    // the resting state the reel holds on once it has played.
    coverVideo: motiCardVideo,
    year: "2026",
    details: "Designed, built, and shipped on the App Store: an AI-native iOS planner that turns messy, natural language into a living, timeline-aware plan.\n\nBuilt on a hybrid SLM + LLM system, specified spec-first with a full PRD before writing any code.",
  },
  {
    id: "neuralyfe",
    title: "NeuraLyfe",
    section: "selected",
    skills: ["Data Visualization", "AI-Native", "Physical Prototyping"],
    destination: CASE_STUDY,
    signal: "Brain Impact Visualization for Athletes and Medical Teams",
    description: "1st Place, FigBuild 2026. Making invisible brain trauma visible before it becomes irreversible.",
    role: "Product Designer, Maker",
    coverImage: neuralyfeCover,
    coverAspect: "2400/1350",
    // Title card, then the four product views (roster, brain, replay, Halo),
    // then back to the title card. Same shape as Moti's reel.
    coverVideo: neuralyfeCardVideo,
    year: "2026",
    details: "Won 1st Place at FigBuild 2026 for Impact Replay, an AI-driven brain-impact visualization for athletes and medical teams.\n\nLed ideation and problem scoping, designed the Impact Replay interface, and contributed across both digital and physical product development.",
  },
  {
    id: "aura",
    title: "Aura",
    section: "selected",
    skills: ["Hardware UX", "UX Research", "Physical Prototyping"],
    destination: CASE_STUDY,
    signal: "AI-Powered Anticipatory Motion Sickness Relief",
    description: "A speculative in-flight motion-sickness concept. Its refined form was preferred by 93.75% of testers.",
    role: "Product Designer",
    year: "2025",
    // A title card, like Moti's and NeuraLyfe's: its own full-bleed ground, the
    // wordmark, and the product. The headline and the two-line subhead that used
    // to sit under the wordmark are gone — the card prints the signal and the
    // description right beside the image, so the picture was setting the pitch a
    // second time in a second typeface.
    coverImage: auraCover,
    coverAspect: "2400/1350",
    // Title card, then three in-flight moments from the scene film (take-off
    // cue, turbulence heads-up, buds intervening), then back to the title card.
    coverVideo: auraCardVideo,
    details: "A speculative concept for anticipating motion sickness in flight, designed with a 5-person team over 5 weeks.\n\nUser testing validated the refined form: 15 of 16 testers (93.75%) preferred it over the initial design.",
  },
  {
    id: "oryne",
    title: "Oryne",
    section: "selected",
    skills: ["AI-Native", "Motion Design", "Design Engineering"],
    links: [{ label: "App Store", url: "https://apps.apple.com/us/app/oryne/id6778995892" }],
    destination: CASE_STUDY,
    signal: "An Ocean for Unfinished Thoughts",
    description: "Live on the App Store: an inspiration-capture app where thoughts drift, gather into currents, and come back on their own.",
    role: "0→1 Product Designer & Builder",
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

  // ── More Work: the rest of the case studies, told as process ──
  {
    id: "spatial",
    title: "Spatial Editor",
    section: "more",
    skills: ["Spatial Computing", "UX Research"],
    destination: { kind: "placeholder" },
    description: "MHCI+D capstone: multimodal text input and editing in spatial interfaces. Case study coming.",
    role: "Product Designer",
    coverImage: spatialEditorCard,
    coverAspect: "1024/684",
    year: "2026",
    details: "Team XR. A spatial text editor for writing in the air, on the surfaces around you.",
  },
  {
    id: "moodmuse",
    title: "Mood Muse",
    section: "more",
    skills: ["Industrial Design", "Hardware UX", "Inclusive Design"],
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
    skills: ["Industrial Design", "Physical Prototyping", "Design Engineering"],
    destination: { kind: "placeholder" },
    description: "Defy gravity. Shape the path. Case study coming.",
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
    skills: ["UX Research", "Hardware UX"],
    destination: CASE_STUDY,
    description: "A 3D-printing onboarding system for first-time owners, targeting a setup-time cut from about an hour to 15 minutes.",
    role: "Lead Product Designer",
    coverImage: flowprintCover,
    coverAspect: "1756/988",
    coverFit: "contain",
    year: "2025",
    details: "Research with first-time 3D printer owners, then onboarding, material guidance, and monitoring on the printer's own screen.\n\nTarget journey: first-print setup from about an hour to 15 minutes.",
  },

  // ── Studio: the thing is the story. Small software designed, built, and shipped
  // with AI tools (studioGroup "software", shown as "Built with AI"), then the
  // industrial design work that came before it ("machines", shown as
  // "Industrial design"). Each group is its own grid on the page. ──
  {
    id: "calmmouse",
    title: "CalmMouse",
    section: "studio",
    studioGroup: "software",
    skills: ["Design Engineering", "AI-Native"],
    links: [{ label: "Live", url: "https://calmmouse.malikzhang.com/" }],
    destination: CASE_STUDY,
    description: "A macOS menu-bar app that stops the Magic Mouse from scrolling every time you click: the fix Apple never shipped.",
    role: "0→1 Designer + Builder",
    year: "2026",
    coverImage: calmmouseCardPoster,
    coverAspect: "1280/720",
    // The hero loop: the site's mouse with its tap ripple, a punch into the
    // Without/With demo, and a pull back wide to the title card. coverImage is
    // that closing frame, so the tile rests on "CalmMouse" rather than the
    // opening mouse-only shot.
    coverVideo: calmmouseCardVideo,
    details: "A signed, notarized, self-updating native macOS app, free and open source.\n\nThe design problem underneath: a product that succeeds when you notice nothing.",
  },
  {
    id: "inkwork",
    title: "Inkwork",
    section: "studio",
    studioGroup: "software",
    skills: ["Design Systems", "Visual Design", "Design Engineering"],
    links: [{ label: "Live", url: "https://www.malikzhang.com/inkwork" }],
    destination: CASE_STUDY,
    description: "A styled-QR studio with a point of view: pick a style, check the proof, export",
    role: "0→1 Designer + Builder",
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
    studioGroup: "software",
    skills: ["Hardware UX", "Design Engineering", "AI-Native"],
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
    studioGroup: "machines",
    skills: ["Industrial Design", "Physical Prototyping"],
    destination: CASE_STUDY,
    description: "A cleaning robot for stadium grandstands, designed around the eight-hour gap between events, when three tons of trash have to disappear.",
    role: "Industrial Designer",
    year: "2025",
    coverImage: zeatCard,
    coverAspect: "4725/2993",
    details: "A ground-based cleaning robot for stadium grandstands, designed end to end across the robot, its mechanisms, and the system that dispatches it.\n\nModeled, 3D printed, hand-finished, and exhibited as a driving appearance model.",
  },
  {
    id: "ranger",
    title: "RANGER",
    section: "studio",
    studioGroup: "machines",
    skills: ["Industrial Design", "Hardware UX"],
    destination: CASE_STUDY,
    description: "An underwater drone that finds abandoned fishing nets, fires an airbag through the mesh, and lets the net float itself up to the boat.",
    role: "Industrial Designer",
    year: "2024",
    coverImage: rangerCard,
    coverAspect: "2400/1345",
    details: "An underwater drone for ghost gear recovery, designed end to end across the vehicle, the airbag capture mechanism, the control system, and the Neptune Net dispatch platform.\n\nA resolved concept: modeled and rendered, never physically prototyped.",
  },
];

/** Projects in one section, in display order. */
export const projectsInSection = (section: SectionKey): Project[] =>
  PROJECTS.filter((project) => project.section === section);

/** The Studio projects split into their groups, in page order. */
export const studioGroups = (): (StudioGroup & { projects: Project[] })[] =>
  STUDIO_GROUPS.map((group) => ({
    ...group,
    projects: projectsInSection("studio").filter((project) => project.studioGroup === group.key),
  }));

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

/** Every project carrying a skill, in list order, across all sections. */
export const projectsWithSkill = (skill: Skill): Project[] =>
  PROJECTS.filter((project) => project.skills.includes(skill));
