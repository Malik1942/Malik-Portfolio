import type { ProjectDetailDocument } from "@/types/projectDetail";
import auraCover from "@/assets/aura-cover.png";
import studioWatersCover from "@/assets/studio-waters-cover.png";
import auraDetail1 from "@/assets/aura-detail-1.png";
import auraDiscovery1 from "@/assets/aura-discovery-1.png";
import auraResearch1 from "@/assets/aura-research-1.png";
import auraResearch2 from "@/assets/aura-research-2.png";
import auraResearch3 from "@/assets/aura-research-3.png";
import auraIdeation1 from "@/assets/aura-ideation-1.png";
import auraIdeation2 from "@/assets/aura-ideation-2.png";
import auraTesting1 from "@/assets/aura-testing-1.png";
import auraTesting2 from "@/assets/aura-testing-2.png";
import auraRefinement1 from "@/assets/aura-refinement-1.png";
import auraRefinement2 from "@/assets/aura-refinement-2.png";
import auraRefinement3 from "@/assets/aura-refinement-3.png";
import auraSystem1 from "@/assets/aura-system-1.png";
import auraApp1 from "@/assets/Aura-app-1.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import neuralyfeDetail1 from "@/assets/neuralyfe-detail-1.jpg";
import neuralyfeHalo from "@/assets/neuralyfe-halo.mp4";
import neuralyfeRoster from "@/assets/neuralyfe-roster.mp4";
import neuralyfeBrain from "@/assets/neuralyfe-brain.mp4";
import neuralyfeReplay from "@/assets/neuralyfe-replay.mp4";
import neuralyfeDeckHits from "@/assets/neuralyfe-deck-hits.png";
import neuralyfeDeckProof from "@/assets/neuralyfe-deck-proof.png";
import neuralyfeDeckHalo from "@/assets/neuralyfe-deck-halo.png";
import neuralyfeDeckIndex from "@/assets/neuralyfe-deck-index.png";
import neuralyfeDeckViews from "@/assets/neuralyfe-deck-views.png";
import neuralyfeDeckScenario from "@/assets/neuralyfe-deck-scenario.png";
import flowprintCover from "@/assets/flowprint-cover.png";
import tubularCover from "@/assets/tubular-cover.jpg";
import moodmuseCover from "@/assets/moodmuse-cover.png";
import motiHero from "@/assets/moti-hero.png";

const aura: ProjectDetailDocument = {
  slug: "aura",
  listSection: "Main Projects",
  title: "Aura",
  heroSummary: "Proactive motion-sickness relief for travelers",
  heroSubtitle: "Speculative product concept · Hardware + software · 5-person team · 5 weeks",
  heroImage: auraCover,
  heroImageFit: "natural",
  metaCards: [
    { label: "Role", value: "Product Designer · Industrial Designer" },
    { label: "Timeline", value: "5 weeks · Oct–Dec 2025" },
    { label: "Team", value: "5-person design team" },
    { label: "Output", value: "Physical Prototype · App Prototype · Adaptive System" },
  ],
  sections: [
    {
      id: "intro",
      label: "Intro",
      headline: "An invisible problem that starts before symptoms",
      showProjectMeta: true,
      body: "**For motion-sensitive travelers, discomfort often starts before they consciously recognize it.**\n\nAura explores a more proactive approach to motion-sickness support: sensing early physiological and motion signals, predicting risk, and delivering subtle audio guidance before symptoms escalate.\n\nAs a product and industrial designer on a 5-person team, I helped translate this invisible problem into a coherent hardware and software system, shaping the product logic, physical prototype, app experience, and interaction flow.",
    },
    {
      id: "highlights",
      label: "Highlights",
      body: "**Aura treats motion sickness as a timing problem — sensing early signals and intervening with calm audio before discomfort takes hold.**\n\n[[module:aura-highlights]]",
    },
    {
      id: "situation",
      label: "Situation",
      headline: "Travel was rich, but too broad to solve as one problem",
      body: "## Starting from a broad travel space\n\nThis project began with an open brief, so our team first explored several areas we were curious about. Travel quickly stood out because it is emotionally rich, physically demanding, and full of unresolved friction.\n\nAt the same time, travel was too broad to solve as one problem. It includes planning, packing, airport navigation, waiting, flying, delays, discomfort, arrival, and recovery, each with different needs and constraints. Before designing a solution, we needed to narrow the space and identify where a product intervention could create the most meaningful impact.\n\nThat became the starting point for our discovery: moving from a broad interest in travel to a focused opportunity within the journey.",
    },
    {
      id: "discovery",
      label: "Discovery",
      headline: "We narrowed the journey to the moment with the least control",
      figures: [
        { type: "image", src: auraDiscovery1, alt: "Aura discovery — travel journey mapping" },
      ],
      body: "Travel was too broad to design for as one experience, so we first broke the journey into three phases: **before travel**, **during travel**, and **after travel**.\n\nMapping the journey this way helped us compare where discomfort was most intense and where travelers had the least control. The clearest opportunity appeared during the flight, when motion sickness, anxiety, sensory overload, and physical constraint could stack together.\n\n[[fig:0]]\n\nAmong the during-travel pain points, in-flight motion sickness stood out because it combined high discomfort with low user control. Travelers could not easily change their environment, stop moving, or recover once symptoms began.\n\n**Decision: We narrowed Aura from a general travel concept to an in-flight support system for motion-sensitive travelers.**\n\n[[module:aura-design-requirements]]",
    },
    {
      id: "research",
      label: "Research",
      headline: "Existing support often arrives after travelers already feel sick",
      figures: [
        { type: "image", src: auraResearch1, alt: "Motion sickness mechanism showing visual and inner-ear mismatch, brain conflict, and symptoms" },
        { type: "image", src: auraResearch2, alt: "Aura audio intervention research — 100 Hz sound" },
        { type: "image", src: auraResearch3, alt: "Aura competitive analysis — motion sickness solutions" },
      ],
      body: "## Understanding motion sickness as a timing problem\n\nAfter narrowing the scope to in-flight discomfort, I needed to understand why motion sickness is difficult to manage once it begins.\n\nSecondary research reframed the problem: motion sickness is not a sudden symptom, but a gradual response to conflict between visual and vestibular signals. Travelers may begin experiencing physiological changes before they consciously recognize discomfort.\n\n[[fig:0]]\n\nThis made timing the key design challenge. If Aura waited until users felt clearly nauseous, the system would already be too late.\n\n**Decision: Support should begin before discomfort becomes difficult to manage.**\n\n## Audio as intervention\n\nWith early intervention as the goal, I looked for support methods that could work without adding visual or cognitive effort. Research identified 100 Hz low-frequency audio as a credible way to reduce dizziness and motion discomfort.\n\n[[fig:1]]\n\nThis shifted audio from a background feature into a core product strategy: passive support that users could receive while sitting still or closing their eyes.\n\n**Design implication: Use calming audio as Aura’s first response, giving travelers support without requiring visual attention or active input.**\n\n## Current solution landscape\n\nI compared existing remedies across medication, patches, wearables, pressure tools, visual aids, audio tools, and behavioral strategies.\n\n[[fig:2]]\n\nThe landscape revealed a gap in timing and effort. Many solutions require advance preparation or active self-management after discomfort begins. Few support the early buildup phase, when travelers may need help but may not yet recognize it.\n\n**Insight: Most solutions depend on either advance preparation or active self-management.**\n\n## Research takeaway\n\nThe research shifted Aura’s opportunity from relieving nausea to **anticipating discomfort**.\n\nAura should sense early risk, prepare support quietly, and reduce the effort required to manage discomfort in motion.",
    },
    {
      id: "ideation",
      label: "Ideation",
      headline: "Aura needed to combine sensing, intervention, and familiar travel behavior",
      figures: [
        { type: "image", src: auraIdeation1, alt: "Aura ideation overview showing early concepts across digital, physical, and sensory interventions" },
        { type: "image", src: auraIdeation2, alt: "Aura 2 by 2 concept evaluation matrix showing the selected ear-worn wearable direction" },
      ],
      body: "## From Relief Product to Anticipatory System\n\n**Research pointed to a clear direction: Aura needed to support travelers earlier, with less effort in the moment.**\n\nI began ideation by sketching broadly across different levels of intervention, including app-based guidance, pressure-based wearables, visual reduction tools, environmental supports, and audio-centered concepts. The goal was to keep the field open before narrowing too quickly.\n\n[[fig:0]]\n\nAfter brainstorming, I helped reorganize the sketches into a 2 by 2 matrix based on user value and implementation feasibility. This turned a wide set of rough ideas into a clearer evaluation space, making it easier to compare which directions were promising, practical, and aligned with Aura’s goal of proactive support.\n\n[[fig:1]]\n\nThe matrix clarified a key tradeoff: concepts that were easy to build often depended on user action, while physical remedies lacked the sensing and context needed for proactive support. I used this evaluation to help narrow the team toward the earbud direction.\n\n[[module:aura-ideation-criteria]]\n\n**Decision: Focus on an audio-first wearable system: one that could sense early risk, interpret flight context, and intervene quietly before symptoms escalated.**",
    },
    {
      id: "testing",
      label: "Testing",
      headline: "The product had to earn trust on the body",
      figures: [
        { type: "image", src: auraTesting1, alt: "Aura physical prototyping process and early earbud form exploration" },
        { type: "image", src: auraTesting2, alt: "Aura hardware and app experience testing with users" },
      ],
      body: "## Building fast enough to learn\n\nAfter choosing the earbud direction, we needed to test whether Aura could feel wearable, understandable, and low-effort in practice.\n\n[[fig:0]]\n\nI led the physical prototyping while collaborating with teammates on the digital flow, then tested the combined hardware and app experience with users to evaluate fit, stability, comfort, and system clarity.\n\n[[fig:1]]\n\n## What testing revealed\n\nTesting exposed constraints that were not obvious in CAD or static screens.\n\n[[module:aura-testing-findings]]\n\n**Decision: Shift the hardware toward a more stable bar-oriented structure and simplify the app around low-attention status feedback.**",
    },
    {
      id: "refinement",
      label: "Refinement",
      headline: "Wearability and readability became part of the system",
      figures: [
        { type: "image", src: auraRefinement1, alt: "Progressive Aura Bud form iterations informed by ergonomic testing" },
        { type: "image", src: auraRefinement2, alt: "Aura Bud ergonomic testing across different users and wearing contexts" },
        { type: "image", src: auraRefinement3, alt: "Aura app interface refinement for low-attention status feedback" },
      ],
      body: "## Making Aura easier to wear, read, and trust\n\nTesting showed that Aura needed refinement in both form and interaction. The earbuds had to feel stable across different ears, while the app had to communicate support without adding more effort.\n\n## Physical refinement\n\nErgonomic testing revealed issues with fit, pressure, and weight distribution, especially across different ear shapes, glasses, hairstyles, and head movement.\n\n[[fig:0]]\n\nI shifted the hardware toward a more bar-oriented structure to improve stability, distribute weight more evenly, and create more internal room for sensing and audio components.\n\nTo validate the direction, I tested the refined form with **16 people**. **93.75%** preferred the updated earbud form, suggesting that the new structure felt more comfortable and believable as a wearable product.\n\n[[fig:1]]\n\n## Digital refinement\n\nThe app needed to make Aura’s system behavior clear at a glance.\n\n[[fig:2]]\n\nI simplified the interface around low-attention feedback: clearer status cards, calmer motion states, and direct support cues that show when Aura is monitoring, preparing, or intervening.\n\n**Decision: Refine Aura as a connected hardware and app experience: more stable to wear, easier to read, and easier to trust during travel.**",
    },
    {
      id: "final-design",
      label: "Final Design",
      headline: "Aura senses, predicts, and supports before discomfort takes over",
      figures: [
        { type: "image", src: auraSystem1, alt: "Aura system architecture", full: true },
        { type: "image", src: auraApp1, alt: "Aura app interface showing setup, trip context, support preferences, and at-a-glance status" },
      ],
      body: "## A connected system for proactive support\n\nAfter research, ideation, testing, and refinement, Aura evolved into a connected hardware and app system designed to support motion-sensitive travelers before discomfort escalates.\n\nThe final concept brings together three layers: sensing, prediction, and support. Aura Buds capture early body and motion signals, the app interprets those signals with travel context, and the system responds through subtle audio guidance before the traveler has to actively manage symptoms.\n\n[[fig:0]]\n\n**System logic: Aura is not designed to wait for users to report discomfort. It prepares support earlier, using physiological signals, motion context, and flight information to make the experience feel timely, calm, and low-effort.**\n\n## In-flight experience\n\nTo make the system behavior tangible, I mapped Aura across three key moments: pre-travel preparation, in-flight monitoring, and turbulence response.\n\n[[module:aura-scenes]]\n\nThese scenarios helped define the tone of the experience. Aura should feel proactive, but not alarming. It should explain enough to build trust, but not require constant attention.\n\n**Decision: Design Aura’s support as quiet preparation, not urgent correction.**\n\n## Aura Buds\n\nI designed Aura Buds as the physical interface of the system, bringing together sensing, audio intervention, comfort, and social acceptance in one wearable form.\n\n[[module:aura-hardware]]\n\nThe buds sense physiological and motion signals, deliver 100 Hz grounding audio and calming soundscapes, and provide low-attention feedback through subtle interaction cues. The goal was to make the hardware feel familiar enough for travel while still giving it a clear reason to exist beyond everyday earbuds.\n\n## Aura App\n\nThe app acts as Aura’s quiet control layer. It prepares the system before travel, personalizes support, and helps users understand what Aura is doing without turning the experience into another task.\n\n[[fig:1]]\n\nI framed the app around one interaction principle: guided, not demanding. The interface focuses on setup, trip context, support preferences, and at-a-glance status so users can stay informed without constantly managing the system.\n\n**Final outcome: Aura became a proactive support system: wearable enough to fit into travel, intelligent enough to respond to changing conditions, and calm enough to support users without overwhelming them.**",
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "Proactive systems need to earn trust, not just act early",
      body: "## Next step: from concept to evidence\n\nIf I continued Aura, I would move from concept validation to longitudinal testing across repeated flights, different motion-sickness patterns, and changing travel conditions.\n\nThe focus would shift from whether the concept feels compelling to whether the system can sense risk reliably, intervene at the right time, and remain trusted over time.\n\n**The conceptual case is made. The next case is evidence.**\n\n## What I learned\n\n[[module:aura-reflection-learnings]]",
    },
  ],
};

const neuralyfe: ProjectDetailDocument = {
  slug: "neuralyfe",
  listSection: "Main Projects",
  title: "NeuraLyfe",
  heroSummary: "Making invisible brain trauma visible — before it becomes irreversible.",
  heroSubtitle: "FigBuild 2026 · 1st place — concept, execution, and system design.",
  heroImage: neuralyfeDetail1,
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
      label: "Intro",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "NeuraLyfe is a sideline decision-support system designed to help football medical staff identify brain-impact risk before it becomes irreversible.\n\nThe project addresses Chronic Traumatic Encephalopathy (CTE): a degenerative brain condition linked to repeated head impacts. CTE is difficult to detect because the damage accumulates gradually, often without visible symptoms, and cannot be confirmed until after death.\n\nMy role was to help frame the problem, shape the product logic, design the core interaction system, and prototype the experience in Figma and Figma Make. I focused on turning simulated helmet data into a sideline workflow that medical staff could understand and act on under pressure.\n\n**NeuraLyfe was awarded 1st Place at FigBuild 2026, recognized for its concept, execution, and system design.**",
    },
    {
      id: "highlights",
      label: "Highlights",
      body: "**Turning raw helmet-sensor signals into fast, confident sideline decisions — catching cumulative brain risk before symptoms appear.**\n\n[[module:neuralyfe-highlights]]",
    },
    {
      id: "situation",
      label: "Situation",
      body: "## The problem with cumulative damage\n\nFootball players take thousands of hits across a career. Most feel manageable in the moment — but repeated sub-concussive impacts are strongly linked to long-term brain damage.\n\n[[fig:0]]\n\nThe damage is hard to see. Sideline evaluations rely on visible symptoms — confusion, balance, slowed reactions — and by the time those appear, the neurological impact may already be significant.\n\n**Medical staff need to track cumulative impact as it builds, not just react once symptoms show.**",
      figures: [
        { type: "image", src: neuralyfeDeckHits, alt: "Repeated sub-concussive hits accumulate into long-term brain damage" },
      ],
    },
    {
      id: "research",
      label: "Research",
      body: "## Where the detection gap is\n\nExisting helmet sensors capture **force** — but force alone doesn't tell you how the brain responded. The signal that matters, cumulative neurological stress, goes unmeasured.\n\n[[fig:0]]\n\nSideline checks are also triggered too late: by a visible hit or stumble, when the window for early intervention may already have passed.\n\n**The opportunity: track cumulative brain-impact risk as it builds, not just flag individual hits.**",
      figures: [
        { type: "image", src: neuralyfeDeckIndex, alt: "The CTE Progression Index combines biomarkers — p-Tau 217, NfL, GFAP — into a cumulative risk signal" },
      ],
    },
    {
      id: "problem",
      label: "Design Challenge",
      body: "## From complex data to fast decisions\n\nThe core problem wasn't technical — it was interpretive. Brain activity, cumulative impact, affected regions, and biomarker signals are hard to read in real time. Show too much and it overwhelms; simplify too much and it loses credibility.\n\n[[fig:0]]\n\nThe system had to surface the most urgent information first, support fast triage, and let staff go deeper only when needed.\n\n**The question I kept returning to: what does a sideline medic need to know in the next five seconds?**",
      figures: [
        { type: "image", src: neuralyfeDeckProof, alt: "Sideline doctors need proof, not suspicion" },
      ],
    },
    {
      id: "system-direction",
      label: "System Direction",
      body: "## Two layers working together\n\n**Halo** is a helmet add-on that captures impact and physiological signals during play — without replacing equipment teams already trust. It carries three sensing layers: EEG for brain connectivity, biomarker sensors for early neurological stress (p-Tau 217, NfL, GFAP), and an impact camera that reconstructs hits.\n\n[[fig:0]]\n\n**The sideline interface** turns those signals into a decision workflow, structured around three questions: who needs attention, what's happening in their brain, and what caused it.\n\n**The core logic: the interface is only as useful as the signals behind it — and the hardware only as useful as the interface that makes sense of it.**",
      figures: [
        { type: "image", src: neuralyfeDeckHalo, alt: "NeuraLyfe Halo turns any helmet into a brain-health sensor with EEG, biomarker, and impact-camera sensing" },
      ],
    },
    {
      id: "process",
      label: "Design Process",
      body: "## Building the decision flow\n\nMedical staff can't explore data mid-game, so the interface had to support fast triage first and deeper inspection only when needed. That led to a three-level structure:\n\n· **Roster View** — scan risk across the whole team at a glance\n· **Brain View** — inspect where neurological stress is building\n· **Impact Replay** — trace a high-risk alert back to the exact play\n\n[[fig:0]]\n\nI prototyped in Figma and Figma Make with simulated sensor data, pressure-testing one question throughout: could a staff member move from first alert to informed decision in a few seconds?",
      figures: [
        { type: "image", src: neuralyfeDeckViews, alt: "From impact data to medical decisions in three views: Roster, Brain, and Impact Replay" },
      ],
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "## Halo\n\nI designed Halo as the sensing foundation of the system. The add-on structure was a deliberate decision: teams already trust their helmets, and Halo integrates without disruption.\n\nThe three sensing layers work together to capture what force data alone cannot provide. EEG maps brain connectivity and detects patterns linked to neurological stress. Biomarker sensors track early damage indicators before symptoms appear. The impact camera reconstructs plays, connecting a force event to a specific moment on the field.\n\n[[fig:3]]\n\n## Roster View\n\nThe Roster View is the entry point for triage. It ranks players by medical urgency based on cumulative impacts, recent hit severity, and brain health indicators, turning a static player list into a live risk map.\n\nMedical staff can scan the whole team at once and immediately identify who needs attention.\n\n[[fig:0]]\n\n## Brain View\n\nThe Brain View helps medical staff understand where neurological stress may be building. A 3D brain visualization maps stress by region, making cumulative impact easier to inspect and explain.\n\nA risk score alone is not enough. The Brain View gives location and pattern, which matters most when repeated impacts affect specific regions over time.\n\n[[fig:1]]\n\n## Impact Replay\n\nImpact Replay connects a medical alert back to the exact play. It answers the questions a risk score cannot: when did the hit happen, how severe was it, which brain regions were affected, and should the player be evaluated now.\n\nBy tracing detected hits back to gameplay moments, Impact Replay moves the system from abstract signal to concrete action.\n\n[[fig:2]]\n\nTogether, Roster View, Brain View, and Impact Replay create a clear decision flow: identify risk, inspect impact, act with context.",
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
      body: "NeuraLyfe makes a clear claim: brain-injury risk shouldn't stay hidden until symptoms appear.\n\n[[fig:0]]\n\nMy contribution was translating that claim into a working prototype — framing the problem, shaping the product logic, defining the three core views, and building the system in Figma and Figma Make. The result shows how a sideline team moves from a raw impact alert to a confident decision: scan the roster, inspect brain stress, trace the risk to the play, and act before damage becomes irreversible.\n\n**NeuraLyfe was awarded 1st Place at FigBuild 2026 — recognized for its concept, execution, and system design.**",
      figures: [
        { type: "image", src: neuralyfeDeckScenario, alt: "In a live scenario, a player's frontal lobe hits critical levels and his card turns red" },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "## Designing for interpretation, not just accuracy\n\nWorking on NeuraLyfe taught me that designing for health means designing for interpretation, not just data display.\n\nA system can collect accurate signals, but if medical staff cannot read them quickly under pressure, those signals do not become care. The design work was about translation: taking neurological and impact data and restructuring it into something a person could act on in seconds.\n\n## High-pressure interfaces need different logic\n\nSideline environments changed how I thought about hierarchy. The first question is never \"what does all the data say?\" It is \"who needs help right now?\" That pushed me to simplify aggressively, reduce competing information, and make the most urgent cases immediately visible.\n\n## What I would do next\n\nThe concept is promising, but the next step is clinical validation. I would want to work with sports medicine professionals to test whether the risk indicators, visual hierarchy, and decision flow actually support real sideline decisions.\n\nNeuraLyfe showed me that making hidden risk visible is a design problem. The harder part is making that visibility useful when it matters most.",
    },
  ],
};

// Real Moti case study. Imagery lives in src/assets (moti-*.png); the rich section
// blocks live in ./MotiModules.tsx and render via the [[module:moti-*]] refs.
const moti: ProjectDetailDocument = {
  slug: "moti",
  listSection: "Personal Project",
  title: "Moti: Plan",
  heroSummary: "An AI-Native Timeline for Real Projects",
  heroImage: motiHero,
  heroImageFit: "cover",
  metaCards: [
    { label: "Role", value: "Product Designer & Builder" },
    { label: "Timeline", value: "2 weeks · May–June 2026" },
    { label: "Team", value: "Malik, with Claude + Codex" },
    { label: "Output", value: "Shipped on the App Store · SLM + LLM integrated" },
  ],
  sections: [
    {
      id: "overview",
      label: "Overview",
      showProjectMeta: true,
      body: "[[module:moti-tags]]",
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
      label: "What Users Told Me",
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
  heroSummary: "A motion-controlled fishing experience using CPX sensors.",
  heroSubtitle: "An exploration of embodied interaction — translating physical gestures into calm, responsive digital play.",
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
      body: "Studio Waters is a lightweight interactive prototype that connects physical motion with digital feedback.\n\nUsing a CPX (Circuit Playground Express), players cast and reel through real-world gestures — creating a more intuitive and embodied experience than traditional button-based input. Rather than building a complex game system, the project focuses on a single design question: how can motion, timing, and feedback shape a calm and engaging interaction?",
    },
    {
      id: "inspiration",
      label: "Inspiration",
      body: "Fishing is not defined by constant action. It is defined by pacing, anticipation, and subtle feedback — a rhythm that creates presence without demanding focus.\n\nI wanted to translate these qualities into an interactive system where the body becomes the primary interface. Not a simulation of fishing, but a digital experience that borrows its emotional texture: the arc of a cast, the tension of a reel, the quiet between attempts.\n\nThis project explores how repetitive, physical actions can create a sense of calm and immersion in digital environments — something most games actively work against.",
    },
    {
      id: "interaction",
      label: "How It Works",
      body: "The interaction is built around simple, physical gestures mapped directly to game states:\n\n· Swing to cast the line into the water\n· Tilt and pull to reel the fish back in\n· Dynamic feedback reflects tension, timing, and outcome\n\nThese mappings create a direct connection between movement and result, reducing abstraction and increasing immersion. The goal was to make the interaction feel obvious on first try — no tutorial required.",
    },
    {
      id: "experience",
      label: "Experience Design",
      body: "The experience is intentionally minimal. A nostalgic pixel world, restrained UI, and ambient visual feedback allow the physical interaction to take focus — the screen supports the gesture, rather than the gesture supporting the screen.\n\nDifficulty and reward are introduced through variation in fish behavior: different species require different timing and tension, encouraging attention and rhythm over fast reaction. The feedback loop is tight and forgiving — tension visible on screen, success felt in the motion.\n\nThe goal is not challenge, but engagement through pacing and physical presence.",
    },
    {
      id: "ai",
      label: "How I Used AI",
      body: "I used AI as a rapid prototyping tool to explore interaction possibilities quickly:\n\n· Generated the initial p5.js game structure using Claude\n· Iterated on visual direction with multiple prompting rounds, refining toward a cohesive pixel style\n· Used AI to quickly test interaction logic before manually adjusting behavior, difficulty curves, and sensor thresholds\n\nAI accelerated early exploration and removed the cost of starting from scratch. But meaningful refinement required hands-on debugging, physical tuning, and restructuring the code around how the CPX actually behaves under motion — things that only emerge through testing, not generation.",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "Studio Waters reinforced the value of combining fast prototyping with deeper technical understanding.\n\nVibe coding lowers the barrier to building, but strong interaction design still depends on intentional mapping, iteration, and hands-on refinement. The AI wrote the scaffold; I designed the feel.\n\nThe project also surfaced an underexplored space: calm, embodied digital interactions. Most physical computing projects lean toward complexity and spectacle. There is real design value in restraint — in building things that are slow, rhythmic, and physically honest.",
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
  inspireocean,
  studiowaters,
};

export function getProjectDetail(slug: string | undefined): ProjectDetailDocument | undefined {
  if (!slug) return undefined;
  return PROJECT_DETAILS[slug];
}

export { PROJECT_DETAILS };
