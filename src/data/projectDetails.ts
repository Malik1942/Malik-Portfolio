import type { ProjectDetailDocument } from "@/types/projectDetail";
import auraCover from "@/assets/aura-cover.png";
import studioWatersCover from "@/assets/studio-waters-cover.png";
import auraDetail1 from "@/assets/aura-detail-1.png";
import auraApproach1 from "@/assets/aura-approach-1.png";
import auraApproach2 from "@/assets/aura-approach-2.png";
import auraApproach3 from "@/assets/aura-approach-3.png";
import auraSystem1 from "@/assets/aura-system-1.png";
import auraDetail2 from "@/assets/aura-detail-2.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import neuralyfeDetail1 from "@/assets/neuralyfe-detail-1.jpg";
import neuralyfeHalo from "@/assets/neuralyfe-halo.mp4";
import neuralyfeRoster from "@/assets/neuralyfe-roster.mp4";
import neuralyfeBrain from "@/assets/neuralyfe-brain.mp4";
import neuralyfeReplay from "@/assets/neuralyfe-replay.mp4";
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
      body: "Our team first reviewed the current landscape of motion-sickness solutions, including medication, patches, wristbands, and sensory-based products. **I noticed that most of these solutions shared the same limitation: they respond only after users already feel discomfort.**\n\nTo understand whether there was an earlier intervention point, I looked into the physiology of motion sickness. I focused on how the vestibular system detects sensory conflict between what the body feels and what the eyes see. This helped me identify a key timing gap: the body can register instability before the user consciously recognizes nausea.\n\n**That gap changed how I framed the opportunity.** Instead of designing another product that helps users manage symptoms after they appear, I proposed that Aura should focus on the moment before awareness, when the system can still prepare the user with low-friction support.\n\nThis became the foundation of our concept: a wearable system that senses early physiological and motion signals, predicts motion-sickness risk, and intervenes before the user needs to actively manage discomfort.",
    },
    {
      id: "problem",
      label: "Approach",
      figures: [
        { type: "image", src: auraApproach1, alt: "Aura approach and concept development" },
        { type: "image", src: auraApproach2, alt: "Aura user flow and system behavior", full: true },
        { type: "image", src: auraApproach3, alt: "Aura physical prototype development" },
      ],
      body: "Once our team selected travel as the broader direction, **I helped break the experience into three phases: pre-travel, during travel, and post-travel.** I used this structure to identify where motion sickness creates the most friction and where intervention would be most valuable.\n\nThrough this mapping, **I found that the during-travel phase was the most critical.** Users are already in motion, often physically uncomfortable, and have limited attention or control over their environment. This makes reactive solutions harder to use because the user may already be overwhelmed by the time they need help.\n\n**Based on this insight, I pushed the project toward an in-travel support system** rather than a preparation tool or a recovery product. Aura needed to work quietly in the background, reduce user effort, and support travelers while they are already in motion.\n\n[[fig:0]]\n\nTo move from broad opportunity to product direction, **I brainstormed concepts with teammates and organized them in a 2x2 matrix based on user value and implementation feasibility.** Ideas included an eye mask, wristband, and ear-adjacent wearable.\n\nThrough this comparison, **I found that the ear-adjacent direction had the strongest fit.** It connected directly to the motion-sickness problem because the ear is close to the vestibular system. It also supported audio-based intervention, such as a 100 Hz grounding tone, and aligned with an existing travel behavior: wearing earbuds during flights or transit.\n\n**Based on this reasoning, I advocated for the earbud direction as the most coherent concept.** This decision helped the team converge on Aura Buds as a product system, not just a wearable object.\n\n[[fig:1]]\n\nAfter the concept direction was set, **I mapped how Aura would behave before and during travel:** how it starts working, how it understands the user’s state, and how it delivers support without requiring constant attention.\n\nThrough this mapping, **I realized the system could not depend on users manually reporting symptoms in real time.** During travel, users may be tired, distracted, anxious, or already uncomfortable. Asking them to actively manage another tool would weaken the value of the product.\n\n**This led me to define Aura as a proactive system** that combines travel context, body signals, and user preferences to prepare support before symptoms fully emerge.\n\n**I then translated the system into physical prototypes. I designed the product form, 3D printed the models, and tested them with users** to evaluate fit, stability, comfort, and weight distribution across different ears. V1 used a more conventional in-ear structure, but testing showed that it was not stable enough and created uneven weight distribution. **In V2, I developed a bar-oriented form** that improved balance, created more internal space for components, and opened up a larger surface area for gesture-based control.\n\n[[fig:2]]\n\nTo validate comfort beyond the model, **I tested the prototypes across users with different ear shapes, hairstyles, glasses, and wearing habits.** These sessions helped reveal issues that were not obvious in CAD, including pressure points, instability during head movement, and uneven weight distribution. The feedback pushed the design toward a more balanced bar-oriented form with better ergonomic stability.",
    },
    {
      id: "process",
      label: "System",
      figures: [
        { type: "image", src: auraSystem1, alt: "Aura system architecture", full: true },
      ],
      body: "After defining the earbud direction, **I helped translate Aura from a product concept into a system architecture.** The main challenge was making the product feel proactive without feeling invasive.\n\n[[fig:0]]\n\n**I structured the system around three layers: input, process, and output.** The input layer includes motion-sensitivity baseline, flight details, remedy feedback, third-party travel data, and sensor signals from Aura Buds, including IMU motion sensing, IR proximity, capacitive touch, microphones, and optical heart-rate sensing.\n\nThe process layer is handled primarily by the Aura App. **I positioned the app as the system’s AI engine**, combining body signals, movement data, and travel context locally on the user’s phone to detect early risk patterns. Cloud processing is reserved for anonymized pattern improvement and model updates.\n\nThe output layer focuses on subtle intervention instead of constant alerts. Aura can prepare the right support at the right time: a 100 Hz grounding tone, calming soundscape, or breathing guidance.\n\n**Mapping this system clarified Aura’s product logic.** It is not just an earbud with wellness features. It is a closed-loop travel companion that senses early changes, predicts risk, and responds before the user needs to manually intervene.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "The final design brings together Aura Buds, the Aura App, and in-travel interventions into one closed-loop support system. The buds sense early physiological and motion signals, the app prepares and personalizes the experience, and ambient audio interventions support the traveler before discomfort fully emerges.\n\n[[fig:0]]\n\n## Aura Buds\n\n**I designed Aura Buds as the physical interface of the system, not just as a standalone earbud.** The hardware needed to bring together sensing, intervention, comfort, and social acceptance in one form.\n\n**Based on the system needs, I defined the core hardware features.** Heart-rate and HRV sensing help detect early physiological shifts. IMU motion sensing provides movement context. Noise cancellation reduces environmental stress during flights and transit. A ceramic-filter air tunnel supports pressure equalization and helps reduce airplane ear. The speaker unit delivers 100 Hz grounding tones, breathing guidance, calming soundscapes, and everyday audio. An LED indicator gives low-attention wellness feedback without requiring users to open the app.\n\n[[module:aura-hardware]]\n\nThese features shaped the form development. The product needed enough internal space for sensors and audio components, stable weight distribution for long-duration wear, and enough surface area for gesture-based control.\n\n**I translated these requirements into physical prototypes and tested them across users with different ear shapes, hairstyles, glasses, and wearing habits.** Early concepts leaned toward more distinctive silhouettes, but testing showed that novel forms created more pressure points, more instability, and more self-consciousness in public travel settings.\n\nThe first prototype used a more conventional in-ear structure, but testing showed that it was not stable enough and created uneven weight distribution. **Based on this feedback, I shifted the form toward a more balanced, bar-oriented structure.** This improved stability, created more internal volume for components, and opened up a larger surface area for gesture interaction.\n\nThis process led to a key design principle: familiarity was not a compromise, but a system requirement. A recognizable earbud-like form made Aura feel socially acceptable, while the bar-oriented structure supported the technical and ergonomic needs of the system.\n\n## Aura App\n\nThe app had a different challenge. It needed to support the system without becoming another thing for users to manage during travel.\n\n**I framed the app around one interaction principle: guided, not demanding.** I made this decision because Aura’s value depends on reducing effort during moments when users already have limited attention and control.\n\nThis principle shaped the app flow. Onboarding handles setup and pairing, then gets out of the way. Trips are added in advance so the system has context before travel begins. Sound profiles use sensible defaults, while customization remains available but secondary. Status feedback reassures users without making them feel watched.\n\nThe app became a quiet control layer for the system. It prepares the experience, personalizes support, and gives users confidence without demanding attention during the trip.\n\n## In-Travel Experience\n\nAura’s real test is in motion. **To evaluate how the system should behave in real travel moments, I built storyboard scenarios around key moments in the journey:** before takeoff, during turbulence, and after intervention.\n\n**I used these scenarios to test the timing and tone of Aura’s support.** The question was not only whether Aura could intervene early, but whether that intervention would feel calm, useful, and non-alarming.\n\nIn one scenario, Aura detects early physiological signals before takeoff and guides the user into breathing while preparing a steady 100 Hz tone. In another, Aura combines body signals and flight context to prepare the user before turbulence arrives.\n\nThese storyboards helped communicate the core experience: Aura does not wait for discomfort to become obvious. It senses, predicts, and prepares support in a way that feels timely, calm, and low effort.\n\n[[module:aura-scenes]]",
      figures: [
        { type: "image", src: auraDetail2, alt: "Aura system architecture and design process", full: true },
      ],
    },
    {
      id: "reflection",
      label: "Outcome",
      body: "As a proof of concept, Aura makes a specific design claim: motion sickness can be treated as a predictable condition, not just a reactive discomfort.\n\n**My contribution was helping translate that claim into a full product system:** from research insight, to concept direction, to hardware form, app behavior, system architecture, and final storytelling.\n\nThe project also showed that this proactive sensing model could extend beyond travel. The same pattern of reading body signals, predicting needs, and responding before conscious awareness could apply to autonomous vehicles, health-aware environments, and ambient AI systems.\n\nFor me, Aura became a way to explore predictability as a design material.",
    },
    {
      id: "reflection-forward",
      label: "Reflection",
      body: "This project helped me understand that in ambient AI, trust has to be designed as part of the system. Aura runs quietly in the background, senses physiological signals, and prepares support before users consciously feel discomfort. That creates a delicate balance: the system needs to be proactive enough to help, but restrained enough not to feel invasive.\n\n**I learned that trust is built through concrete design decisions:** when the system intervenes, how it explains itself, how much information it reveals, how much control the user keeps, and whether the hardware feels socially acceptable to wear. In Aura, trust was shaped through calm timing, low-attention feedback, local processing, familiar earbud form, and optional rather than demanding app interactions.\n\nThe project also reinforced that hardware and software cannot be designed separately when the experience is meant to feel like one system. Aura Buds and the Aura App needed to express the same intention: calm, proactive, and nearly invisible. It was not only about making the technology work, but making the user feel safe letting it work in the background.\n\n**Working across both made me realize that my strongest contribution was at the seam between product, system, and interaction design.** I was not only designing an object or an app, but the logic that connects them into one coherent experience.\n\n**If I continued the project, I would focus on longitudinal validation:** testing how the system performs across different travel frequencies, environments, and user physiologies over time. The conceptual case is made. The next case is evidence.",
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
      body: "Football players can take thousands of hits over the course of their careers, but the most serious damage is often invisible.\n\nOur team was interested in Chronic Traumatic Encephalopathy, or CTE, because it shows how repeated head impacts can accumulate silently over time. Many players only discover the damage after death, when their brains are examined during autopsy. This revealed a disturbing mismatch: the injury develops gradually, but the system for detecting it still depends heavily on visible symptoms and short sideline evaluations.\n\n**I wanted to understand where design could intervene in that gap.** If brain damage often accumulates before symptoms are obvious, then medical staff need more than a quick visible check. They need a way to see hidden risk as it builds.\n\n**That insight reframed the project for me:** not how to diagnose CTE directly, but how to make cumulative brain impact more visible and actionable during games and practices.\n\nThis became the core design opportunity behind NeuraLyfe: a sideline decision-support system that turns helmet impact data into clear medical signals before invisible damage becomes irreversible.",
    },
    {
      id: "research",
      label: "Research",
      body: "**I learned that invisible problems require visible systems.** Brain injuries often accumulate silently, and design can play a critical role in making hidden risk visible before it becomes obvious. For NeuraLyfe, the value was not just showing data. The value was translating invisible physiological risk into a system that medical staff can act on.\n\n**I also learned that clarity matters most when pressure is high.** Medical interfaces cannot rely on users having time to explore. In high-pressure environments, clarity becomes a safety issue. This pushed me to prioritize visual hierarchy, quick scanning, and progressive disclosure. The system needed to surface the most urgent information first, then let users inspect deeper details when necessary.\n\n**Working on NeuraLyfe showed me that interaction design can bridge science and action.** Raw neurological and impact data is difficult to use on its own. By structuring the system around Roster, Brain, and Impact Replay, we turned abstract data into a sequence of action: identify, inspect, and respond.\n\nThis project also helped me see sports medicine as a proactive system, not just a reactive one. Instead of waiting for visible symptoms, future tools can help medical teams detect risk earlier, track cumulative damage, and make safer decisions before injury becomes obvious.",
    },
    {
      id: "problem",
      label: "Problem",
      body: "## Translating complex brain data into clear signals\n\nOne of the hardest parts was turning complex neurological information into something medical staff could understand quickly. Brain activity, cumulative impact, affected regions, and risk indicators are all difficult to interpret in real time. If we showed too much detail, the interface became overwhelming. If we simplified too much, the system lost medical credibility.\n\n**Because of that, I focused on designing progressive layers of information.** The Roster View gives a fast signal. The Brain View provides regional explanation. Impact Replay gives evidence and context. This helped balance clarity with depth.\n\n## Designing for high-pressure decisions\n\nSideline medical staff often need to make decisions within seconds. **That context changed how I approached the interface.** I could not design the system like a traditional analytics dashboard. The priority was not exploration first. It was triage first.\n\n**That insight pushed me to simplify the visual hierarchy, reduce competing information, and make urgent cases immediately visible.** The interface needed to answer \"who needs help now?\" before asking users to interpret the full dataset.\n\n## Making invisible damage understandable\n\nCTE and cumulative brain trauma are difficult to design for because the damage cannot be directly seen during a game. **Instead of pretending the system could provide a complete diagnosis, I framed NeuraLyfe around risk visibility.** The goal was to make hidden patterns more legible: repeated hits, affected brain regions, severity over time, and connections between play events and neurological stress.\n\nThis decision helped the project stay believable. NeuraLyfe does not claim to diagnose CTE on the field. It supports earlier medical attention by making invisible risk easier to see.\n\n## Balancing immediate risk and long-term health\n\nAnother challenge was designing across two time scales. During a game, medical staff need immediate signals. Over a season or career, players and teams need to understand cumulative damage.\n\n**This forced us to think beyond single-hit alerts.** The system needed to show both acute risk and long-term accumulation. That insight shaped the use of cumulative impact indicators and brain health patterns, making NeuraLyfe more than a one-game monitoring tool.",
    },
    {
      id: "process",
      label: "Design Process",
      body: "We approached NeuraLyfe as an end-to-end interactive system for high-pressure medical decision-making.\n\n**I began by mapping the sideline workflow.** Medical staff do not have time to interpret complex neurological data during a game, so the interface needed to support fast triage first, then deeper inspection only when needed.\n\nThat led me to structure the system around three levels of attention: Roster View for scanning, Brain View for diagnosis support, and Impact Replay for evidence and context. This structure helped us avoid designing a data dashboard that simply displays everything. Instead, we designed a decision-support tool that guides medical staff from urgency to explanation.\n\n**After defining the core interaction model, I prototyped the interface in Figma and Figma Make.** I focused on turning simulated helmet sensor data into understandable visual states: player risk scores, brain region stress, cumulative impact patterns, and play-based hit analysis.\n\nAs we built the prototype, I kept asking one question: what does the medical staff need to know in the next five seconds? That question shaped the hierarchy. High-risk players needed to surface immediately. Brain visualizations needed to show pattern and severity, not just decorative complexity. Impact Replay needed to connect each alert to a real moment on the field.\n\nTo demonstrate the workflow, we created a sideline scenario where medical staff can move through the full decision path: first, they identify at-risk players from the roster; then, they inspect neurological stress in the brain view; finally, they trace the dangerous hit back to the exact play through impact replay. This allowed us to prototype NeuraLyfe not just as a visualization tool, but as a future-facing medical workflow for safer football.",
    },
    {
      id: "final-design",
      label: "Final Design",
      body: "NeuraLyfe translates football helmet impact data into actionable medical insights for sideline decision-making.\n\n**I designed the system around three connected views because medical staff need to answer three different questions quickly:** who needs attention first, what is happening inside the brain, and which impact caused the risk. Those questions shaped the product structure.\n\n## NeuraLyfe Halo\n\n**I designed NeuraLyfe Halo as the hardware sensing layer of the system.** Rather than requiring teams to replace their existing equipment, I proposed an add-on structure that can turn any football helmet into a brain-health sensor. This decision made the system more realistic to deploy: teams already have helmets they trust, and Halo integrates into that without disruption.\n\nBecause the system depends on invisible physiological signals, **I knew the hardware needed to capture both impact context and neurological change simultaneously.** Relying only on accelerometer data would not be enough to support the kind of medical insight the interface was designed to show.\n\n**That led me to define three sensing layers for Halo.** EEG sensors map brain activity and connectivity, making it possible to detect patterns associated with neurological stress. Biomarker sensors monitor early brain-health indicators — p-Tau 217, NfL, and GFAP — that can signal damage before symptoms appear. An impact camera verifies hits and reconstructs plays, giving the system the spatial and temporal context it needs to connect a force event to a medical signal.\n\n**This hardware direction mattered because it grounded the software in a believable source.** The sideline interface is not displaying abstract risk scores. It is translating signals captured from the helmet into actionable medical insight — and Halo is what makes that translation credible.\n\n[[fig:3]]\n\n## Roster View\n\n**We designed the Roster View as the first layer of triage** because sideline teams need to scan the whole roster quickly during a game. Instead of showing raw sensor data, the system ranks players by medical urgency based on cumulative impacts, recent hit severity, and brain health indicators.\n\nThis turns the roster from a static player list into a live risk map.\n\n[[fig:0]]\n\n## Brain View\n\n**We designed the Brain View to help medical staff understand where neurological stress may be building.** Risk scores alone are not enough. Medical staff need to understand the location and pattern of potential damage, especially when repeated impacts affect specific brain regions.\n\nThe 3D brain visualization maps neurological stress by region, making cumulative impact easier to inspect and explain.\n\n[[fig:1]]\n\n## Impact Replay\n\n**I designed Impact Replay to connect medical insight back to the exact play.** A high-risk alert needs context. Medical staff need to know when the hit happened, how severe it was, which brain regions were affected, and whether the player should be evaluated immediately.\n\nBy tracing detected hits back to gameplay moments, Impact Replay helps the system move from abstract data to concrete action.\n\n[[fig:2]]\n\nTogether, these three views create a clear decision flow: identify risk, inspect impact, and act with context.",
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
      body: "NeuraLyfe makes a clear design claim: brain injury risk should not remain invisible until symptoms appear.\n\n**My contribution was translating that claim into an interactive medical decision-support system.** I helped shape the product logic, define the core views, build the interaction flow, and turn simulated helmet data into a workflow that medical staff could understand under pressure.\n\nThe final prototype shows how sideline teams could move from raw impact data to safer decisions: scanning the roster, inspecting brain impact, and tracing risk back to the play.\n\nFor me, NeuraLyfe became an exploration of visibility as a design material. When the injury is hidden, the role of design is to make the right signals visible at the right moment, in a form people can trust and act on.\n\n**Awarded 1st Place at FigBuild 2026, recognizing the project’s concept, execution, and system design.**",
    },
    {
      id: "reflection",
      label: "Reflection",
      body: "This project helped me understand that designing for health is not only about accuracy. It is also about interpretation.\n\nA system can collect complex data, but if medical staff cannot understand it quickly, the data does not become care. **The design challenge was to translate invisible brain impact into clear, layered, and actionable information.**\n\n**I also learned that high-pressure environments require a different kind of interface logic.** The design has to reduce hesitation. It has to help users know where to look first, what matters most, and what action the information supports.\n\n**If I continued the project, I would focus on clinical validation and workflow realism:** working with sports medicine professionals to test whether the risk indicators, visual hierarchy, and decision flow actually support sideline medical decisions. The concept is promising, but the next step is evidence.",
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
