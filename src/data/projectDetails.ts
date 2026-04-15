import type { ProjectDetailDocument } from "@/types/projectDetail";
import auraCover from "@/assets/aura-cover.png";
import auraDetail1 from "@/assets/aura-detail-1.png";
import auraDetail2 from "@/assets/aura-detail-2.png";
import auraDetail5 from "@/assets/aura-detail-5.png";
import auraDetail6 from "@/assets/aura-detail-6.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import flowprintCover from "@/assets/flowprint-cover.png";
import tubularCover from "@/assets/tubular-cover.jpg";
import moodmuseCover from "@/assets/moodmuse-cover.png";

const aura: ProjectDetailDocument = {
  slug: "aura",
  listSection: "Main Projects",
  title: "Aura",
  heroSummary: "An AI-powered motion sickness relief system designed for travelers.",
  heroImage: auraDetail1,
  heroImageFit: "cover",
  metaCards: [
    { label: "Role", value: "Product Design · Industrial Design" },
    { label: "Timeline", value: "3 Months · Fall 2025" },
    { label: "Tools", value: "Figma · Prototyping · Systems · Narrative" },
    { label: "Contribution", value: "Concept · User Flow · Wearable · Digital System" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "As the product and industrial designer, I developed the concept, structured the user flow, and shaped the overall experience. By combining wearable interaction and proactive sensory support, Aura explores a more anticipatory and personalized approach to motion sickness relief.",
    },
    {
      id: "process",
      label: "Aura",
      body: "I iterated through journey maps, system diagrams, and low-fidelity flows for onboarding, anticipation, and escalation. Prototypes explored how much to show vs. infer, and how the wearable, phone, and environment might divide responsibility.\n\nNarrative and motion studies helped align stakeholders on a single coherent ‘calm proactive’ story.",
      figures: [
        { type: "image", src: auraDetail2, alt: "Aura — design process", full: true },
      ],
    },
    {
      id: "final-design",
      label: "Aura Buds",
      body: "Led the end-to-end design of a proactive, AI-driven wearable for motion sickness, defining its concept, system, and interaction model.\n\nShaped a seamless cross-device experience, integrating ambient AI to anticipate discomfort and deliver real-time support.",
      figures: [
        { type: "image", src: auraDetail5, alt: "Aura Buds — detail view 1" },
        { type: "image", src: auraDetail6, alt: "Aura Buds — detail view 2" },
      ],
    },
    {
      id: "research",
      label: "Research",
      body: "I reviewed literature and product patterns around nausea onset, sensory conflict theory, and how people currently cope (medication, breaks, avoiding travel). Interviews highlighted shame, unpredictability, and distrust of ‘wellness’ gimmicks.\n\nKey insight: trust and subtlety matter as much as efficacy — systems must feel supportive without surveillance or alarm.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How might we help people stay comfortable in motion without demanding constant attention, manual logging, or clinical framing?\n\nConstraints included limited onboard UI, need for low cognitive load, and a brand voice that feels human — not clinical or gadgety.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "The work gives the team a shared vocabulary for proactive vs. reactive care, a testable interaction model, and a foundation for partnership conversations with hardware and clinical advisors.\n\nIt positions Aura as a system — not a single-screen app.",
    },
    {
      id: "reflection",
      label: "Conclusion",
      body: "Designing for bodies in motion reinforced how much ‘invisible’ suffering product teams overlook. Ambient AI is only as good as the trust layer around it; that layer is design work.\n\nI’d push further into validation with longitudinal studies and edge cases (migraine overlap, medication interactions).",
    },
  ],
};

const neuralyfe: ProjectDetailDocument = {
  slug: "neuralyfe",
  listSection: "Main Projects",
  title: "NeuraLyfe",
  heroSummary: "Making invisible brain trauma visible — before it becomes irreversible.",
  heroSubtitle: "FigBuild 2026 · 1st place — concept, execution, and system design.",
  heroImage: neuralyfeCover,
  metaCards: [
    { label: "Role", value: "Product Designer · Maker" },
    { label: "Timeline", value: "Fall 2025 · Spring 2026" },
    { label: "Team", value: "Design · Physical · Digital" },
    { label: "Scope", value: "Problem Framing · Impact Replay · Product Narrative" },
    { label: "Outcome", value: "1st Place · FigBuild 2026" },
    { label: "Tools", value: "Figma · Prototyping · Presentation · Build" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Brain trauma often goes unseen until symptoms are severe. NeuraLyfe explores how design can surface risk and replay in ways clinicians and patients can act on — early enough to matter.\n\nThe project spans digital interfaces and physical product implications.",
    },
    {
      id: "research",
      label: "Research",
      body: "I mapped clinical and consumer narratives around concussion and repetitive impact, and how data is currently captured (or not). Competitive scans showed either dense medical tools or consumer wearables with weak clinical credibility.\n\nThe gap: legible, emotionally grounded visualization of invisible harm.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How do we make 'invisible' trauma tangible without fear-mongering or oversimplifying medical complexity?\n\nThe interface had to support trust, clarity, and action — for both lay users and skeptical professionals.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "Led ideation and scoped the problem space, then iterated on Impact Replay — a focal experience for surfacing events and patterns over time. Workshops aligned narrative, visual severity, and what we could responsibly claim.\n\nPhysical and digital prototypes evolved together rather than in silos.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "Led ideation and defined the problem scope for NeuraLyfe, designing the AI-driven Impact Replay interface and contributing across both digital and physical product development.\n\nAwarded 1st Place at FigBuild 2026, recognizing the project's concept, execution, and system design.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "The project demonstrates a coherent product story that jurors and peers could understand quickly — critical for competition and fundraising contexts.\n\nIt also sharpened my ability to balance speculative vision with buildable slices.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Health-adjacent work demands humility: design can clarify but must not replace clinical judgment. I’d invest more in co-design with providers and clearer regulatory framing next.\n\nNeuraLyfe reinforced that 'making visible' is as much about narrative as pixels.",
    },
  ],
};

const flowprint: ProjectDetailDocument = {
  slug: "flowprint",
  listSection: "Main Projects",
  title: "FlowPrint",
  heroSummary: "A frictionless 3D printing system that removes complexity for beginners.",
  heroSubtitle: "From roughly an hour of setup anxiety to a guided fifteen-minute path in.",
  heroImage: flowprintCover,
  heroImageFit: "contain",
  metaCards: [
    { label: "Role", value: "Lead Product Designer" },
    { label: "Timeline", value: "Spring 2026" },
    { label: "Team", value: "Product · Engineering · Manufacturing" },
    { label: "Scope", value: "Onboarding · Monitoring UI · Material Guidance" },
    { label: "Outcome", value: "~1 hr Setup → ~15 min · Target Journey" },
    { label: "Tools", value: "Figma · Flows · Specs · Usability" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Consumer 3D printing promises creativity but often delivers friction: leveling, slicer settings, failed prints, and opaque errors. FlowPrint targets beginners who want outcomes, not a second hobby.\n\nThe brand sits between playful maker culture and credible appliance-grade calm.",
    },
    {
      id: "research",
      label: "Research",
      body: "I synthesized support tickets, forum pain points, and novice interviews. Failure modes clustered around setup, first print, and 'what do I do now?' moments after errors.\n\nCompetitive products either exposed too much engineering detail or hid so much that users felt blind when something broke.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How might we guide someone from box to first successful print without forcing them to master slicer vocabulary on day one?\n\nThe system needed progressive disclosure, proactive checks, and monitoring that feels reassuring — not alarming.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "Journey maps separated 'setup,' 'first print,' and 'steady use.' I prototyped onboarding as a checklist with live device state, and monitoring as a timeline + clear next actions.\n\nMaterial recommendation emerged as a high-leverage moment to reduce choice paralysis.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "Led product design for a consumer 3D printing experience that reduced setup time from 1 hours to 15 minutes.\n\nDesigned onboarding flows, real-time print monitoring UI, and a material recommendation engine.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "The design gives engineering a prioritized surface area: onboarding, monitoring, and recommendations as connected modules rather than three disconnected features.\n\nIt also sets a tone of quiet confidence — important for retention after the first print.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Hardware-adjacent UX taught me to design for failure as the default path; success is the exception we still have to earn every session.\n\nNext I’d validate with broader printer models and filament ecosystems to stress-test edge cases.",
    },
  ],
};

const tubular: ProjectDetailDocument = {
  slug: "tubular",
  listSection: "Main Projects",
  title: "Tubular",
  heroSummary: "Defy gravity. Shape the path.",
  heroSubtitle: "A tactile, experimental toy that teaches fluid dynamics through play.",
  heroImage: tubularCover,
  metaCards: [
    { label: "Role", value: "Product Designer · Maker" },
    { label: "Timeline", value: "Spring 2026" },
    { label: "Team", value: "Solo · Design + Build" },
    { label: "Scope", value: "Concept · Industrial Form · Digital Prototyping" },
    { label: "Outcome", value: "Product Narrative · Physical-Digital Prototype" },
    { label: "Tools", value: "CAD · Prototyping · Motion Studies" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Tubular explores how physical play can make abstract physics (flow, pressure, pathing) intuitive for learners and curious adults.\n\nIt sits deliberately between toy, science kit, and design object.",
    },
    {
      id: "research",
      label: "Research",
      body: "I looked at STEM toys that over-explain vs. those that under-guide. The sweet spot seemed to be discoverable constraints: enough structure to learn, enough freedom to experiment.\n\nVisual references pulled from lab glassware, modular pipelines, and minimalist product design.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How can we teach fluid dynamics without a textbook voice or fragile classroom-only equipment?\n\nThe object had to survive real play, invite repetition, and photograph clearly for portfolio and pitch contexts.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "Sketches moved quickly into volumetric studies and simple digital prototypes to test affordances. I iterated joint geometry, path visibility, and how 'success' should feel in the hand.\n\nNarrative and key visuals aligned around gravity, control, and delight.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "Conceptualized and built an experimental physics-based toy that teaches fluid dynamics through play.\n\nCombined industrial design with digital prototyping to create an intuitive, tactile learning experience.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "The project sharpens my maker-designer fluency: fewer handoffs between 'idea,' 'form,' and 'story.'\n\nIt also works as a portfolio anchor for systems thinking in a non-screen-first domain.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Physical products punish vague interactions; every ambiguity becomes a manufacturing question. I’d next involve a materials engineer earlier and test with kids in structured sessions.\n\nTubular reminded me that play is a serious design medium.",
    },
  ],
};

const moodmuse: ProjectDetailDocument = {
  slug: "moodmuse",
  listSection: "Main Projects",
  title: "Mood Muse",
  heroSummary: "An emotional expression aid designed for autistic children.",
  heroSubtitle: "Reducing frustration by making internal states easier to externalize and share.",
  heroImage: moodmuseCover,
  metaCards: [
    { label: "Role", value: "Product Designer" },
    { label: "Timeline", value: "Spring 2026" },
    { label: "Team", value: "Design-led · Collaboration-ready" },
    { label: "Scope", value: "Interaction · Visual Language · Caregiver UX" },
    { label: "Outcome", value: "Low-load Emotion Expression System" },
    { label: "Tools", value: "Figma · Storyboards · A11y Heuristics" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Many autistic children experience intense emotions that are hard to name or communicate in the moment — which can escalate stress for them and caregivers. Mood Muse explores gentle, repeatable ways to externalize state.\n\nThe work prioritizes low language dependency and sensory restraint.",
    },
    {
      id: "research",
      label: "Research",
      body: "I reviewed AAC patterns, emotion-wheel simplifications, and failure modes of 'mood tracker' apps built for neurotypical norms. Caregiver forums highlighted timing: interventions work better before meltdown than during.\n\nSensory sensitivity ruled out loud feedback and high-contrast chaos.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How might a child signal emotional state quickly, accurately enough for adults to respond — without shame, gamification pressure, or complex menus?\n\nThe design had to scale across ages and support trusted adults without surveillance vibes.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "Flows moved from abstract 'states' to concrete gestures, colors, and haptics explored on paper first. I storyboarded classroom and home moments to test plausibility.\n\nIterations reduced steps to the minimum viable expression loop.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "A system that helps children externalize and communicate their internal emotional states through intuitive interactions, reducing frustration and enabling clearer social connection.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "The concept frames emotional support as co-regulation — not compliance monitoring. That distinction matters for ethics and adoption.\n\nIt’s structured to invite validation with educators and occupational therapists next.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Designing for children demands slowing down: every animation and reward carries developmental weight. I’d pursue co-design sessions with families when possible.\n\nMood Muse deepened my respect for calm interfaces as accessibility infrastructure.",
    },
  ],
};

const inspireocean: ProjectDetailDocument = {
  slug: "inspireocean",
  listSection: "Built with AI",
  title: "Inspire Ocean",
  heroSummary: "AI content generation for creators.",
  heroSubtitle: "Shipped end-to-end with AI-assisted build workflows.",
  metaCards: [
    { label: "Role", value: "Designer · Builder" },
    { label: "Timeline", value: "Fall 2025" },
    { label: "Team", value: "Solo · AI-assisted Build" },
    { label: "Scope", value: "Prompt UI · Preview · Creator Workflow" },
    { label: "Outcome", value: "Shipped · Social Content Platform" },
    { label: "Tools", value: "Figma · AI IDEs · LLM APIs" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Creators need speed without sacrificing voice. Inspire Ocean explores a focused tool for generating social content with tight feedback loops between prompt, preview, and iteration.\n\nBuilt as a design-meets-shipping exercise using AI-assisted development.",
    },
    {
      id: "research",
      label: "Research",
      body: "I audited generic AI writers vs. creator-specific tools. Gaps included weak preview affordances and unclear ownership of tone. Users wanted 'suggest, don’t replace.'\n\nPatterns from design tools (history, variants) informed the interaction model.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How do we keep generation fast while still feeling controlled — so creators trust the output enough to post?\n\nThe UI had to foreground preview, diffing, and light editing rather than a single opaque 'generate' button.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "Rapid wireframes became interactive prototypes; parallel tracks for API behavior and UI states. I used AI coding tools to compress implementation cycles while retaining explicit design decisions.\n\nIteration focused on prompt clarity and reducing dead ends.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "Designed and shipped an AI-powered content generation platform for social media creators.\n\nBuilt end-to-end with AI coding tools, focusing on intuitive prompt interfaces and real-time preview.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "Demonstrates a full-stack slice: problem, UX, and delivery — valuable for teams hiring designer-builders.\n\nAlso surfaced where AI tooling accelerates vs. where human taste still gates quality.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Shipping with AI assistants changes where I spend calories: more architecture and critique, less boilerplate. The risk is skipping research — I’d add more user sessions if extending the product.\n\nInspire Ocean is a baseline I can compound from.",
    },
  ],
};

const studiowaters: ProjectDetailDocument = {
  slug: "studiowaters",
  listSection: "Built with AI",
  title: "Studio Waters",
  heroSummary: "Predictive analytics made visual.",
  heroSubtitle: "Turning complex models into layouts people can actually use.",
  metaCards: [
    { label: "Role", value: "Designer · Builder" },
    { label: "Timeline", value: "Spring 2026" },
    { label: "Team", value: "Solo · Concept + Build" },
    { label: "Scope", value: "Charts · Dashboards · Customization" },
    { label: "Outcome", value: "Predictive Visualization Grammar" },
    { label: "Tools", value: "Figma · Front-end · Data Viz" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Predictive models often live in notebooks or opaque dashboards. Studio Waters asks how visualization can make uncertainty, confidence, and time horizons legible for decision-makers who aren’t data scientists.\n\nThe tone is analytical but calm — closer to editorial data than gaming UI.",
    },
    {
      id: "research",
      label: "Research",
      body: "I compared BI tools, notebook exports, and newer 'AI analyst' products. Users repeatedly lost trust when charts hid assumptions or mixed forecast horizons.\n\nAccessibility and export needs appeared early as non-negotiables.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "How do we show predictive complexity without chart junk — and without pretending certainty we don’t have?\n\nThe interface needed defaults that work, plus paths for power users to customize responsibly.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "I defined a small set of chart families and interaction rules (drill-down, compare, annotate). Dashboard layouts prioritized scanability: what changed, why it matters, what to do next.\n\nVisual hierarchy borrowed from print editorial grids adapted to dark UI.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "Created a data visualization tool that transforms complex predictive models into clear, actionable insights.\n\nDesigned interactive charts and customizable dashboard layouts.",
    },
    {
      id: "impact",
      label: "Impact",
      body: "The project validates a reusable pattern: predictive products need explicit uncertainty UI, not prettier line charts alone.\n\nUseful as a reference for enterprise and startup analytics pitches.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Data viz is half statistics, half interface ethics. I’d push further on validation studies and real datasets next — synthetic data only teaches layout, not behavior.\n\nStudio Waters sharpened my systems eye for grid, rhythm, and annotation.",
    },
  ],
};

const PROJECT_DETAILS: Record<string, ProjectDetailDocument> = {
  aura,
  neuralyfe,
  flowprint,
  tubular,
  moodmuse,
  inspireocean,
  studiowaters,
};

export function getProjectDetail(slug: string | undefined): ProjectDetailDocument | undefined {
  if (!slug) return undefined;
  return PROJECT_DETAILS[slug];
}

export { PROJECT_DETAILS };
