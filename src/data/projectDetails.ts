import type { ProjectDetailDocument } from "@/types/projectDetail";
import auraCover from "@/assets/aura-cover.png";
import studioWatersCover from "@/assets/studio-waters-cover.png";
import auraDetail1 from "@/assets/aura-detail-1.png";
import auraDetail2 from "@/assets/aura-detail-2.png";
import auraDetail5 from "@/assets/aura-detail-5.png";
import auraDetail6 from "@/assets/aura-detail-6.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import neuralyfeDetail1 from "@/assets/neuralyfe-detail-1.jpg";
import flowprintCover from "@/assets/flowprint-cover.png";
import tubularCover from "@/assets/tubular-cover.jpg";
import moodmuseCover from "@/assets/moodmuse-cover.png";

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
      id: "context",
      label: "Context",
      subtitle: "Intro",
      showProjectMeta: true,
      body: "Aura is a speculative wearable and companion app system that predicts motion sickness before symptoms fully emerge. Instead of treating discomfort after it begins, Aura explores how physiological signals, ambient audio, and a discreet ear-adjacent form factor can support travelers before they need to intervene.\n\n**My role spanned product design, industrial design, system architecture, and interaction design. I contributed to early problem framing, concept convergence, physical prototyping, hardware and app system logic, and final product storytelling.**\n\nThe project required translating an invisible physiological problem into a coherent product system: one that feels proactive, trustworthy, and nearly invisible in use.",
    },
    {
      id: "research",
      label: "Research",
      body: "Most motion-sickness products treat the symptom. **I wanted to understand the timing.**\n\nDigging into the physiology, I found something that reframed the brief: the vestibular system registers sensory conflict before users consciously feel nauseous. There’s a measurable gap between physiological onset and awareness, and every existing solution lives on the wrong side of it. Medication, patches, wristbands, all reactive, all activated after the discomfort starts.\n\n**That gap became my design opportunity.** The question shifted from how do we treat motion sickness to how do we intervene before the body even tells the user something is wrong.\n\nThe design task: invert the model entirely.",
    },
    {
      id: "problem",
      label: "Approach",
      body: "Once the team chose travel as the broader topic, **I helped break the experience into three phases: pre-travel, during travel, and post-travel.** We focused on the during-travel phase because motion sickness is most disruptive when users are already in motion and have limited attention, control, and physical comfort.\n\nTo move from broad opportunity to product direction, I brainstormed concepts with teammates and organized them in a 2x2 matrix based on user value and implementation feasibility. Ideas included an eye mask, wristband, and ear-adjacent wearable. **I ultimately pushed the team toward the earbud direction** because it had the strongest overlap between motion-sickness relief potential, technical feasibility, and social acceptance. The ear is close to the vestibular system, supports audio-based intervention such as a 100 Hz grounding tone, and already belongs to a familiar travel behavior.\n\n**From there, I mapped the user flow and system behavior:** how Aura starts working, how it integrates into a trip without demanding attention, how it detects the user’s state, and how it adjusts support over time. **This led me to define the key product features** that needed to live across the physical device and app system: noise cancellation, heart-rate and HRV sensing for motion-sickness prediction, a ceramic-filter air tunnel to reduce airplane ear, a speaker unit for 100 Hz calming sound and everyday earbud use, and an LED indicator to communicate wellness status at a glance.\n\n**I then translated the system into physical prototypes. I designed the product form, 3D printed the models, and tested them with users** to evaluate fit, stability, comfort, and weight distribution across different ears. V1 used a more conventional in-ear structure, but testing showed that it was not stable enough and created uneven weight distribution. **In V2, I developed a bar-oriented form** that improved balance, created more internal space for components, and opened up a larger surface area for gesture-based control.",
    },
    {
      id: "process",
      label: "System",
      body: "After defining the earbud direction, **I helped translate Aura from a product idea into a system architecture.** The key challenge was making the product feel proactive without feeling invasive. To predict motion sickness before users consciously felt symptoms, Aura needed to understand travel context, body signals, and user preferences while staying quiet in the background.\n\n**I structured the system around three layers: input, process, and output.** Inputs include a motion-sensitivity baseline, flight details, remedy feedback, third-party travel data, and sensor signals from Aura Buds, including IMU motion sensing, IR proximity, capacitive touch, microphones, and optical heart-rate sensing. The Aura App acts as the primary AI engine, combining these signals locally on the user’s phone to detect early physiological shifts and prepare support before discomfort fully emerges. Cloud processing is reserved for anonymized pattern improvement and model updates.\n\nThe output layer focuses on personalized intervention rather than constant alerts. Aura can recommend or auto-prepare the right support at the right time: a 100 Hz grounding tone, calming soundscape, or breathing guidance. **By mapping this system, I clarified Aura’s product logic:** a closed-loop travel companion that senses, predicts, and responds without asking users to manage another tool during travel.",
      figures: [
        { type: "image", src: auraDetail2, alt: "Aura system architecture and design process", full: true },
      ],
    },
    {
      id: "final-design",
      label: "Hardware",
      body: "**Early on, I leaned toward distinctive forms**, the kind of industrial-design move that reads as \"intentional\" in a portfolio. Comfort testing pushed back. Across users with different ear shapes, hairstyles, and wearing habits, novel silhouettes consistently increased friction: more pressure points, more self-consciousness, less willingness to wear them in public for hours.\n\nThe counterintuitive learning: familiarity is the design choice. A recognizable earbud silhouette communicates calm and reliability before any interaction happens. For a product whose entire premise is \"you barely notice it’s working,\" visual quietness wasn’t a compromise. It was the point.\n\n**I iterated stem length, angle, and fit through critique sessions and contextual testing (head movement, conversation, extended sitting), letting the form converge rather than forcing it.**",
      figures: [
        { type: "image", src: auraDetail5, alt: "Aura Buds detail view 1" },
        { type: "image", src: auraDetail6, alt: "Aura Buds detail view 2" },
      ],
    },
    {
      id: "impact",
      label: "App",
      body: "The app had a tricky job: be useful enough to matter, invisible enough not to undercut the hardware’s calm.\n\n**I held it to one principle: guided, not demanding.** That meant:\n\n· **Onboarding** does setup and pairing, then gets out of the way.\n\n· **Trips** are added in advance so the system has context without needing real-time input.\n\n· **Sound profiles** default to sensible states. Customization exists but doesn’t greet the user.\n\n· **Status feedback** reassures without surveilling.\n\nTo make the value of an invisible system legible, **I built storyboard scenarios grounded in specific travel moments:**\n\nScenario 1: We’re about to take off. Pause your screen and put on your AuraBuds. Let’s do a few rounds of 4-7-8 breathing while a steady 100 Hz tone helps you feel grounded.\n\nScenario 2: Heads up, we’ll hit some moderate bumps in about 10 minutes. Let’s get you ready now.\n\nThe storyboards weren’t decoration. They were how I argued for the design.",
    },
    {
      id: "reflection",
      label: "Outcome",
      body: "As a proof-of-concept, Aura makes a specific claim: motion sickness is predictable, and predictability is a design material.\n\nThat claim has reach beyond travel. The same proactive sensing pattern (read body, predict, respond before conscious awareness) extends to autonomous vehicles, health-aware environments, and ambient AI more broadly. Aura is one application of a thesis I'd want to keep testing.",
    },
    {
      id: "reflection-forward",
      label: "Reflection",
      body: "Two things stuck with me.\n\nFirst, in ambient AI, trust is the real design material. A system that runs in the background only works if the user believes it will. That belief is built through form, timing, restraint, and honesty about what the system is doing. It's design work, not engineering work, and **it's the part I want to keep getting better at.**\n\nSecond, hardware and software can't be designed in isolation when the experience is meant to feel like one thing. The Aura Buds and the Aura App had to carry the same intention (calm, proactive, nearly invisible), or the system would contradict itself. **Working across both reinforced that I'm most useful at the seam between them.**\n\n**If I continued the project, I'd push into longitudinal validation:** how the system performs across different travel frequencies, environments, and user physiologies over time. The conceptual case is made. The next case is evidence.",
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
