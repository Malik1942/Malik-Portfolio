import type { ProjectDetailDocument } from "@/types/projectDetail";
import { WORKSHOP_SECTION_LABEL } from "@/lib/sectionLabels";
import auraCover from "@/assets/aura-cover.webp";
import studioWatersCover from "@/assets/studio-waters-cover.webp";
import studioWatersDemo from "@/assets/studio-waters-demo.mp4";
import auraDetail1 from "@/assets/aura-detail-1.webp";
import auraDiscovery1 from "@/assets/aura-discovery-1.webp";
import auraResearch1 from "@/assets/aura-research-1.webp";
import auraResearch2 from "@/assets/aura-research-2.webp";
import auraResearch3 from "@/assets/aura-research-3.webp";
import auraIdeation1 from "@/assets/aura-ideation-1.webp";
import auraIdeation2 from "@/assets/aura-ideation-2.webp";
import auraTesting1 from "@/assets/aura-testing-1.webp";
import auraTesting2 from "@/assets/aura-testing-2.webp";
import auraRefinement1 from "@/assets/aura-refinement-1.webp";
import auraRefinement2 from "@/assets/aura-refinement-2.webp";
import auraRefinement3 from "@/assets/aura-refinement-3.webp";
import auraSystem1 from "@/assets/aura-system-1.webp";
import auraApp1 from "@/assets/Aura-app-1.webp";
import neuralyfeCover from "@/assets/neuralyfe-cover.webp";
import neuralyfeDetail1 from "@/assets/neuralyfe-detail-1.webp";
import neuralyfeHalo from "@/assets/neuralyfe-halo.mp4";
import neuralyfeRoster from "@/assets/neuralyfe-roster.mp4";
import neuralyfeBrain from "@/assets/neuralyfe-brain.mp4";
import neuralyfeReplay from "@/assets/neuralyfe-replay.mp4";
import neuralyfeDeckHits from "@/assets/neuralyfe-deck-hits.webp";
import neuralyfeDeckProof from "@/assets/neuralyfe-deck-proof.webp";
import neuralyfeDeckHalo from "@/assets/neuralyfe-deck-halo.webp";
import neuralyfeDeckIndex from "@/assets/neuralyfe-deck-index.webp";
import neuralyfeDeckViews from "@/assets/neuralyfe-deck-views.webp";
import neuralyfeDeckScenario from "@/assets/neuralyfe-deck-scenario.webp";
import flowprintCover from "@/assets/flowprint-cover.webp";
import tubularCover from "@/assets/tubular-cover.webp";
import moodmuseCover from "@/assets/moodmuse-cover.webp";
import motiHero from "@/assets/moti-hero.webp";

const aura: ProjectDetailDocument = {
  slug: "aura",
  listSection: "Main Projects",
  title: "Aura",
  heroSummary: "A Wearable System Built to Intervene Before Motion Sickness Starts",
  heroSubtitle: "Speculative Product Concept · 93.75% Preferred the Refined Earbud Form (n=16) · 5-Person Team · 5 Weeks",
  heroImage: auraCover,
  heroImageFit: "natural",
  metaCards: [
    { label: "Role", value: "Product Designer · Industrial Designer" },
    { label: "Timeline", value: "5 Weeks · Fall 2025" },
    { label: "Team", value: "5-Person Design Team" },
    { label: "Output", value: "93.75% Preferred Refined Form (n=16) · App Prototype" },
  ],
  sections: [
    {
      id: "intro",
      label: "Intro",
      headline: "An Invisible Problem That Starts Before Symptoms",
      showProjectMeta: true,
      body: "**Aura is a wearable system that intervenes before motion sickness starts — and the refined earbud form tested at 93.75% preference among 16 users.**\n\nFor motion-sensitive travelers, discomfort often begins before they consciously recognize it. Aura senses early physiological and motion signals, predicts risk, and delivers subtle audio guidance before symptoms escalate.\n\nAs a product and industrial designer on a 5-person team, I shaped the product logic, physical prototype, app experience, and interaction flow across a 5-week sprint.",
    },
    {
      id: "highlights",
      label: "Highlights",
      body: "**Aura treats motion sickness as a timing problem — sensing early signals and intervening with calm audio before discomfort takes hold.**\n\n[[module:aura-highlights]]",
    },
    {
      id: "situation",
      label: "Situation",
      headline: "Travel Was Rich, but Too Broad to Solve as One Problem",
      body: "An open brief led us to travel: emotionally rich, physically demanding, and full of unresolved friction. But travel is too broad to solve as one problem — planning, airports, flying, and recovery each carry different needs and constraints.\n\nOur first job was narrowing: finding the one moment in the journey where a product could matter most.",
    },
    {
      id: "discovery",
      label: "Discovery",
      headline: "We Narrowed the Journey to the Moment With the Least Control",
      figures: [
        { type: "image", src: auraDiscovery1, alt: "Aura discovery — travel journey mapping" },
      ],
      body: "We broke the journey into three phases — **before**, **during**, and **after travel** — and compared where discomfort was most intense and traveler control was lowest.\n\n[[fig:0]]\n\nIn-flight motion sickness stood out: high discomfort, low control. Travelers can’t change their environment, stop moving, or recover once symptoms begin.\n\n**Decision: Narrow Aura from a general travel concept to an in-flight support system for motion-sensitive travelers.**\n\n[[module:aura-design-requirements]]",
    },
    {
      id: "research",
      label: "Research",
      headline: "Existing Support Often Arrives After Travelers Already Feel Sick",
      figures: [
        { type: "image", src: auraResearch1, alt: "Motion sickness mechanism showing visual and inner-ear mismatch, brain conflict, and symptoms" },
        { type: "image", src: auraResearch2, alt: "Aura audio intervention research — 100 Hz sound" },
        { type: "image", src: auraResearch3, alt: "Aura competitive analysis — motion sickness solutions" },
      ],
      body: "## Motion Sickness Is a Timing Problem\n\nSecondary research reframed the problem: motion sickness is not a sudden symptom but a gradual response to conflict between visual and vestibular signals. The body reacts before the mind notices — so waiting until users feel nauseous is already too late.\n\n[[fig:0]]\n\n**Decision: Support should begin before discomfort becomes difficult to manage.**\n\n## Audio as Intervention\n\nResearch identified 100 Hz low-frequency audio as a credible way to reduce dizziness — passive support that works while sitting still or with eyes closed.\n\n[[fig:1]]\n\n**Design implication: Make calming audio Aura’s first response — no visual attention or active input required.**\n\n## The Gap in Existing Solutions\n\nComparing remedies across medication, patches, wearables, pressure tools, and behavioral strategies revealed a shared weakness: nearly all require advance preparation or active self-management after discomfort begins. Few support the early buildup phase, when travelers need help but may not yet recognize it.\n\n[[fig:2]]\n\n**Insight: Aura’s opportunity was not relieving nausea — it was anticipating discomfort.**",
    },
    {
      id: "ideation",
      label: "Ideation",
      headline: "Aura Needed to Combine Sensing, Intervention, and Familiar Travel Behavior",
      figures: [
        { type: "image", src: auraIdeation1, alt: "Aura ideation overview showing early concepts across digital, physical, and sensory interventions" },
        { type: "image", src: auraIdeation2, alt: "Aura 2 by 2 concept evaluation matrix showing the selected ear-worn wearable direction" },
      ],
      body: "I sketched broadly across levels of intervention — app guidance, pressure wearables, visual reduction tools, environmental supports, audio concepts — keeping the field open before narrowing.\n\n[[fig:0]]\n\nA 2×2 of user value against feasibility exposed the core tradeoff: concepts that were easy to build depended on user action, while passive physical remedies lacked the sensing needed for proactive support. Only an ear-worn wearable could deliver both.\n\n[[fig:1]]\n\n[[module:aura-ideation-criteria]]\n\n**Decision: Focus on an audio-first wearable that senses early risk, interprets flight context, and intervenes quietly before symptoms escalate.**",
    },
    {
      id: "testing",
      label: "Testing",
      headline: "The Product Had to Earn Trust on the Body",
      figures: [
        { type: "image", src: auraTesting1, alt: "Aura physical prototyping process and early earbud form exploration" },
        { type: "image", src: auraTesting2, alt: "Aura hardware and app experience testing with users" },
      ],
      body: "I led the physical prototyping while teammates built the digital flow, then we tested the combined hardware and app experience with users for fit, stability, comfort, and system clarity.\n\n[[fig:0]]\n\n[[fig:1]]\n\n## What Testing Revealed\n\nTesting exposed constraints that CAD and static screens had hidden.\n\n[[module:aura-testing-findings]]\n\n**Decision: Shift the hardware toward a more stable bar-oriented structure and simplify the app around low-attention status feedback.**",
    },
    {
      id: "refinement",
      label: "Refinement",
      headline: "Wearability and Readability Became Part of the System",
      figures: [
        { type: "image", src: auraRefinement1, alt: "Progressive Aura Bud form iterations informed by ergonomic testing" },
        { type: "image", src: auraRefinement2, alt: "Aura Bud ergonomic testing across different users and wearing contexts" },
        { type: "image", src: auraRefinement3, alt: "Aura app interface refinement for low-attention status feedback" },
      ],
      body: "## Physical Refinement\n\nErgonomic testing revealed fit, pressure, and weight issues across different ear shapes, glasses, hairstyles, and head movement.\n\n[[fig:0]]\n\nI shifted the hardware toward a bar-oriented structure: more stable, more even weight distribution, more internal room for sensing and audio components.\n\nValidated with **16 people** — **93.75%** preferred the refined earbud form.\n\n[[fig:1]]\n\n## Digital Refinement\n\n[[fig:2]]\n\nI simplified the interface around low-attention feedback: clearer status cards, calmer motion states, and direct cues showing when Aura is monitoring, preparing, or intervening.\n\n**Decision: Refine Aura as one connected hardware and app experience — more stable to wear, easier to read, easier to trust.**",
    },
    {
      id: "final-design",
      label: "Final Design",
      headline: "Aura Senses, Predicts, and Supports Before Discomfort Takes Over",
      figures: [
        { type: "image", src: auraSystem1, alt: "Aura system architecture", full: true },
        { type: "image", src: auraApp1, alt: "Aura app interface showing setup, trip context, support preferences, and at-a-glance status" },
      ],
      body: "## A Connected System for Proactive Support\n\nThe final concept works in three layers: **Aura Buds** capture early body and motion signals, the **app** interprets them with travel context, and the **system** responds with subtle audio guidance — before the traveler has to actively manage symptoms.\n\n[[fig:0]]\n\n**System logic: Aura doesn’t wait for users to report discomfort. It prepares support early, so the experience feels timely, calm, and low-effort.**\n\n## In-Flight Experience\n\nI mapped Aura across three key moments — pre-travel preparation, in-flight monitoring, and turbulence response — to define its tone: proactive but not alarming, explaining enough to build trust without demanding attention.\n\n[[module:aura-scenes]]\n\n**Decision: Design Aura’s support as quiet preparation, not urgent correction.**\n\n## Aura Buds\n\n[[module:aura-hardware]]\n\nThe buds sense physiological and motion signals, deliver 100 Hz grounding audio and calming soundscapes, and give low-attention feedback through subtle cues — familiar enough for travel, with a clear reason to exist beyond everyday earbuds.\n\n## Aura App\n\n[[fig:1]]\n\nOne interaction principle: **guided, not demanding**. The interface focuses on setup, trip context, support preferences, and at-a-glance status, so users stay informed without managing the system.\n\n**Final outcome: A proactive support system — wearable enough for travel, intelligent enough to respond to changing conditions, calm enough not to overwhelm.**",
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "Proactive Systems Need to Earn Trust, Not Just Act Early",
      body: "## Next Step: From Concept to Evidence\n\nContinuing Aura would mean longitudinal testing across repeated flights and different motion-sickness patterns — shifting the question from whether the concept feels compelling to whether the system senses risk reliably and stays trusted over time.\n\n**The conceptual case is made. The next case is evidence.**\n\n## What I Learned\n\n[[module:aura-reflection-learnings]]",
    },
  ],
};

const neuralyfe: ProjectDetailDocument = {
  slug: "neuralyfe",
  listSection: "Main Projects",
  title: "NeuraLyfe",
  heroSummary: "Making Invisible Brain Trauma Visible — Before It Becomes Irreversible.",
  heroSubtitle: "FigBuild 2026 · 3-Day Hackathon · Built in Figma Make · 1st Place of 690 Teams.",
  heroImage: neuralyfeDetail1,
  metaCards: [
    { label: "Role", value: "Product Designer · Maker" },
    { label: "Timeline", value: "3 Days · March 2026" },
    { label: "Team", value: "Design · Physical · Digital" },
    { label: "Scope", value: "Problem Framing · Impact Replay · Product Narrative" },
    { label: "Outcome", value: "1st Place of 690 Teams" },
    { label: "Tools", value: "Figma Make · Figma · Prototyping" },
  ],
  sections: [
    {
      id: "context",
      label: "Intro",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "**NeuraLyfe is a sideline decision-support system that helps football medical staff catch brain-impact risk before it becomes irreversible — designed and built in three days for the FigBuild 2026 hackathon, entirely in Figma Make.**\n\nIt tackles Chronic Traumatic Encephalopathy (CTE): a degenerative condition from repeated head impacts that accumulates invisibly and can't be confirmed until after death.\n\nI ideated the concept and helped the team choose it over a rougher direction around dreams, where the pain point never got sharp. Over the 72 hours, I designed and built **Halo** and the **Impact Replay** interface, and co-designed the **Roster View**.\n\n**It won 1st Place out of 690 teams.**",
    },
    {
      id: "highlights",
      label: "Highlights",
      body: "**Turning raw helmet-sensor signals into fast, confident sideline decisions — catching cumulative brain risk before symptoms appear.**\n\n[[module:neuralyfe-highlights]]",
    },
    {
      id: "situation",
      label: "Situation",
      body: "## The Problem With Cumulative Damage\n\nFootball players take thousands of hits across a career, and repeated sub-concussive impacts are strongly linked to long-term brain damage. Sideline checks only catch visible symptoms — and by then, the damage is done.\n\n[[fig:0]]\n\n**Staff need to see cumulative impact as it builds, not react once symptoms show.**",
      figures: [
        { type: "image", src: neuralyfeDeckHits, alt: "Repeated sub-concussive hits accumulate into long-term brain damage" },
      ],
    },
    {
      id: "research",
      label: "Research",
      body: "## Where the Detection Gap Is\n\nHelmet sensors today capture **force** — not how the brain responded. The signal that matters, cumulative neurological stress, goes unmeasured.\n\n[[fig:0]]\n\n**The opportunity: track brain-impact risk as it builds, not just flag individual hits.**",
      figures: [
        { type: "image", src: neuralyfeDeckIndex, alt: "The CTE Progression Index combines biomarkers — p-Tau 217, NfL, GFAP — into a cumulative risk signal" },
      ],
    },
    {
      id: "problem",
      label: "Design Challenge",
      body: "## From Complex Data to Fast Decisions\n\nThe core problem was interpretive, not technical: show too much data and it overwhelms; simplify too much and it loses credibility.\n\n[[fig:0]]\n\n**The question I kept returning to: what does a sideline medic need to know in the next five seconds?**",
      figures: [
        { type: "image", src: neuralyfeDeckProof, alt: "Sideline doctors need proof, not suspicion" },
      ],
    },
    {
      id: "system-direction",
      label: "System Direction",
      body: "## Two Layers Working Together\n\n**Halo**, a helmet add-on, senses what force data can't: EEG for brain connectivity, biomarkers for early neurological stress, and an impact camera that reconstructs hits.\n\n[[fig:0]]\n\n**The sideline interface** turns those signals into three questions: who needs attention, what's happening in their brain, and what caused it.",
      figures: [
        { type: "image", src: neuralyfeDeckHalo, alt: "NeuraLyfe Halo turns any helmet into a brain-health sensor with EEG, biomarker, and impact-camera sensing" },
      ],
    },
    {
      id: "process",
      label: "Design Process",
      body: "## Building the Decision Flow\n\nStaff can't explore data mid-game, so the interface leads with triage and reveals depth only on demand:\n\n· **Roster View** — who needs attention, at a glance\n\n· **Brain View** — where stress is building\n\n· **Impact Replay** — which play caused it\n\n[[fig:0]]\n\nI pressure-tested one question throughout the Figma Make build: can staff go from alert to decision in seconds?",
      figures: [
        { type: "image", src: neuralyfeDeckViews, alt: "From impact data to medical decisions in three views: Roster, Brain, and Impact Replay" },
      ],
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "## Halo\n\nAn add-on, not a new helmet — teams keep the equipment they already trust. EEG maps brain connectivity, biomarker sensors catch early damage indicators, and the impact camera ties each force event to a moment on the field.\n\n[[fig:3]]\n\n## Roster View\n\nRanks players by medical urgency — cumulative impacts, recent hit severity, brain health — turning a static player list into a live risk map.\n\n[[fig:0]]\n\n## Brain View\n\nMaps neurological stress by region in 3D. A risk score says how much; Brain View shows where — which matters most when repeated impacts hit the same region.\n\n[[fig:1]]\n\n## Impact Replay\n\nTraces an alert back to the exact play: when the hit happened, how severe it was, which regions were affected, and whether to pull the player now.\n\n[[fig:2]]\n\n**Together: identify risk, inspect impact, act with context.**",
      figures: [
        { type: "video", src: neuralyfeRoster },
        { type: "video", src: neuralyfeBrain },
        { type: "video", src: neuralyfeReplay },
        { type: "video", src: neuralyfeHalo },
      ],
    },
    {
      id: "impact",
      label: "Impact",
      body: "NeuraLyfe's claim: brain-injury risk shouldn't stay hidden until symptoms appear.\n\n[[fig:0]]\n\n**1st Place at FigBuild 2026, out of 690 teams.**",
      figures: [
        { type: "image", src: neuralyfeDeckScenario, alt: "In a live scenario, a player's frontal lobe hits critical levels and his card turns red" },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "## Designing for Interpretation, Not Just Accuracy\n\nDesigning for health means designing for interpretation, not data display. A system can collect perfectly accurate signals, but if staff can't read them under pressure, those signals never become care.\n\n## High-Pressure Interfaces Need Different Logic\n\nThe first question is never \"what does all the data say?\" It's \"who needs help right now?\" That pushed me to cut competing information and make the most urgent cases immediately visible.\n\n## What I Would Do Next\n\nClinical validation with sports-medicine professionals — testing whether the decision flow holds up in real sideline calls.\n\nNeuraLyfe showed me that making hidden risk visible is a design problem. The harder part is making that visibility useful when it matters most.",
    },
  ],
};

// Real Moti case study. Imagery lives in src/assets (moti-*.webp); the rich section
// blocks live in ./MotiModules.tsx and render via the [[module:moti-*]] refs.
const moti: ProjectDetailDocument = {
  slug: "moti",
  listSection: "Main Projects",
  title: "Moti: Plan",
  heroSummary: "Shipped Solo on the App Store: an AI-Native Planner That Turns Messy Input Into a Living, Timeline-Aware Plan",
  heroImage: motiHero,
  heroImageFit: "cover",
  metaCards: [
    { label: "Role", value: "Product Designer & Builder" },
    { label: "Timeline", value: "2 Weeks · May–June 2026" },
    { label: "Team", value: "Malik, With Claude + Codex" },
    { label: "Output", value: "Shipped on the App Store · SLM + LLM Integrated" },
  ],
  sections: [
    {
      id: "overview",
      label: "Overview",
      showProjectMeta: true,
      body: "**Moti is an AI-native iOS planner, designed, built, and shipped solo on the App Store.**\n\n[[module:moti-tags]]",
      // The App Store link is the case study's primary action — it closes the
      // Overview, below the meta grid, instead of sitting inside Highlights.
      footerModule: "moti-app-store",
    },
    {
      id: "highlights",
      label: "Highlights",
      body: "**An AI-native iOS app that turns messy, natural language into a living, timeline-aware plan. Designed, built, and shipped solo.**\n\n[[module:moti-hook]]",
    },
    {
      id: "problem",
      label: "The Problem",
      body: "Capable people, drowning in their own inputs.\n\n[[module:moti-problem]]",
    },
    {
      id: "competitive",
      label: "Competitive Analysis",
      body: "Most tools help you capture, organize, or automate work. Few help you regain clarity and sustained momentum.\n\n[[module:moti-competitive]]\n\n**The gap is clarity and momentum, not more capture.**",
    },
    {
      id: "users",
      label: "User Research",
      body: "The same frustrations, in their own words.\n\n[[module:moti-user-quotes]]",
    },
    {
      id: "principles",
      label: "Design Principles",
      body: "Six principles to move from chaos to clarity.\n\n[[module:moti-principles]]",
    },
    {
      id: "before-building",
      label: "Before Building",
      body: "I specified the product before writing a line of code. Only after these systems were defined did I start AI-assisted implementation.\n\n[[module:moti-before-building]]\n\n**PRD created.**",
    },
    {
      id: "build-journey",
      label: "Build Journey",
      body: "Then I built it, and let real behavior reshape the intelligence layer.\n\n[[module:moti-build-journey]]",
    },
    {
      id: "proved",
      label: "What Moti Proved",
      body: "[[module:moti-takeaways]]",
    },
  ],
};

const flowprint: ProjectDetailDocument = {
  slug: "flowprint",
  listSection: "Main Projects",
  title: "FlowPrint",
  heroSummary: "A 3D Printing Onboarding System Designed to Make a Beginner's First Print Succeed, Not Just Start.",
  heroSubtitle: "From Roughly an Hour of Setup Anxiety to a Guided Fifteen-Minute Path In.",
  heroImage: flowprintCover,
  heroImageFit: "contain",
  metaCards: [
    { label: "Role", value: "Lead Product Designer" },
    { label: "Timeline", value: "2025" },
    { label: "Team", value: "Product · Engineering · Manufacturing" },
    { label: "Scope", value: "Onboarding · Monitoring UI · Material Guidance" },
    { label: "Outcome", value: "~1 Hr Setup → ~15 Min · Target Journey" },
    { label: "Tools", value: "Figma · Flows · Specs · Usability" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "**FlowPrint's target journey cuts first-print setup from about an hour to roughly fifteen minutes.**\n\nConsumer 3D printing promises creativity but often delivers friction: leveling, slicer settings, failed prints, and opaque errors. FlowPrint targets beginners who want outcomes, not a second hobby, sitting between playful maker culture and credible appliance-grade calm.",
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
      body: "Led product design for a consumer 3D printing experience, designing a target journey that cuts setup from about an hour to 15 minutes.\n\nDesigned onboarding flows, real-time print monitoring UI, and a material recommendation engine.",
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
  listSection: WORKSHOP_SECTION_LABEL,
  title: "Tubular",
  heroSummary: "Defy Gravity. Shape the Path.",
  heroSubtitle: "A Tactile, Experimental Toy That Teaches Fluid Dynamics Through Play.",
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
      body: "**Tubular is a working physical-digital prototype: a toy that teaches fluid dynamics through play, not instruction.**\n\nIt explores how physical play can make abstract physics (flow, pressure, pathing) intuitive for learners and curious adults, sitting deliberately between toy, science kit, and design object.",
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
  heroSummary: "A Low-Language System That Helps Autistic Children Externalize Big Emotions Before They Escalate.",
  heroSubtitle: "Reducing Frustration by Making Internal States Easier to Externalize and Share.",
  heroImage: moodmuseCover,
  metaCards: [
    { label: "Role", value: "Product Designer" },
    { label: "Timeline", value: "2024" },
    { label: "Team", value: "Design-Led · Collaboration-Ready" },
    { label: "Scope", value: "Interaction · Visual Language · Caregiver UX" },
    { label: "Outcome", value: "Low-Load Emotion Expression System" },
    { label: "Tools", value: "Figma · Storyboards · A11y Heuristics" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "**Mood Muse gives autistic children a low-language way to externalize big emotions before they escalate into meltdown.**\n\nMany autistic children experience intense emotions that are hard to name or communicate in the moment — which can escalate stress for them and caregivers. Mood Muse explores gentle, repeatable ways to externalize state, prioritizing low language dependency and sensory restraint.",
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

const studiowaters: ProjectDetailDocument = {
  slug: "studiowaters",
  listSection: WORKSHOP_SECTION_LABEL,
  title: "Studio Waters",
  heroSummary: "A Playable Fishing Prototype That Turns Real-World Casting and Reeling Gestures Into Calm, Responsive Play.",
  heroSubtitle: "Built Solo With Claude, p5.js, and a Circuit Playground Express — No Buttons, Just Gestures.",
  heroImage: studioWatersCover,
  heroImageFit: "cover",
  metaCards: [
    { label: "Role", value: "Designer · Builder" },
    { label: "Timeline", value: "Spring 2026" },
    { label: "Team", value: "Solo · Vibe Coded" },
    { label: "Scope", value: "Embodied Interaction · Game Feel · Physical UI" },
    { label: "Outcome", value: "Playable CPX Prototype" },
    { label: "Tools", value: "Claude · p5.js · Circuit Playground Express" },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      figures: [{ type: "video", src: studioWatersDemo, poster: studioWatersCover }],
      body: "**Studio Waters is a playable, motion-controlled fishing prototype built with Claude and p5.js — no buttons, just real-world gestures.**\n\nPlayers cast and reel through physical motion, read by a Circuit Playground Express. The project chases one design question: how can motion, timing, and feedback shape a calm, engaging interaction?",
    },
    {
      id: "inspiration",
      label: "Inspiration",
      body: "Fishing runs on pacing and anticipation, not constant action. I wanted to borrow that rhythm, not simulate the sport: the arc of a cast, the tension of a reel, the quiet between attempts.\n\nThe body becomes the interface — repetitive physical motion as a source of immersion, something most games actively work against.",
    },
    {
      id: "interaction",
      label: "How It Works",
      body: "Simple physical gestures map directly to game states:\n\n· Swing to cast the line into the water\n· Tilt and pull to reel the fish back in\n· On-screen feedback tracks tension, timing, and outcome\n\nThe target: obvious on first try, no tutorial required.",
    },
    {
      id: "experience",
      label: "Experience Design",
      body: "A nostalgic pixel world and restrained UI keep the focus on the gesture — the screen supports the motion, not the other way around.\n\nDifficulty comes from fish behavior: different species require different timing and tension, rewarding rhythm over fast reaction. The loop is tight and forgiving — tension visible on screen, success felt in the motion.",
    },
    {
      id: "ai",
      label: "How I Used AI",
      body: "AI was my rapid prototyping tool:\n\n· Claude generated the initial p5.js game structure\n· Prompting rounds refined the visuals toward a cohesive pixel style\n· AI-drafted interaction logic gave me a base to tune by hand\n\nThe real refinement was physical: tuning sensor thresholds, adjusting difficulty, and restructuring the code around how the CPX actually behaves under motion — things testing reveals and generation can't.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "The AI wrote the scaffold; I designed the feel. Vibe coding lowers the barrier to building, but the interaction only got good through intentional mapping and hands-on refinement.\n\nIt also surfaced an underexplored space: most physical computing projects chase spectacle. There is real design value in restraint — slow, rhythmic, embodied play.",
    },
  ],
};

const PROJECT_DETAILS: Record<string, ProjectDetailDocument> = {
  moti,
  aura,
  neuralyfe,
  flowprint,
  tubular,
  moodmuse,
  studiowaters,
};

export function getProjectDetail(slug: string | undefined): ProjectDetailDocument | undefined {
  if (!slug) return undefined;
  return PROJECT_DETAILS[slug];
}

export { PROJECT_DETAILS };
