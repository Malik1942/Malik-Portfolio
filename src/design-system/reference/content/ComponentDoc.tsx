import type { ReactNode } from "react";
import { ComponentSpecimen } from "./ComponentSpecimen";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Six-part component reference page:
 * Preview → Recipe → API → Pairings → Accessibility → Testing.
 *
 * Recipe is the component described in the system's three facets. Form is
 * shape and structure, material is surface and ink, motion is pace and
 * curve. A variant changes one facet; the recipe says which.
 *
 * Note on anchors: the shell resolves the URL hash to a *section* id
 * (see sectionModel.resolveSectionHash, which falls back to Overview on an
 * unknown hash), so these sub-sections deliberately expose no `#` links.
 */

interface DocProp {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface DocPairing {
  partner: string;
  relationship: string;
}

interface DocNote {
  title: string;
  body: string;
}

interface DocTestFile {
  path: string;
  covers: string[];
}

interface DocRecipe {
  form: string;
  material: string;
  motion: string;
  /** Which facet each variant changes, and what it leaves alone. */
  variants?: string;
}

export interface ComponentDocEntry {
  /** Preview */
  source: string;
  summary: string;
  contextHref: string;
  contextLabel: string;
  /** Recipe */
  recipe: DocRecipe;
  /** API */
  signature: string;
  props: DocProp[];
  dataShape?: { name: string; fields: DocProp[] };
  tokens: string[];
  tokenGap?: string;
  /** Pairings */
  pairings: DocPairing[];
  antipairings: string[];
  /** Accessibility */
  accessibility: DocNote[];
  /** Testing */
  tests: DocTestFile[];
  testGaps: string[];
}

const CLASS_NAME_PROP: DocProp = {
  name: "className",
  type: "string",
  description: "Extra classes appended after the recipe, for placement only (margins, alignment). Never for restyling.",
};

export const COMPONENT_DOCS: Record<string, ComponentDocEntry> = {
  "component-eyebrow": {
    source: "src/components/ui/Eyebrow.tsx → Eyebrow",
    summary:
      "The uppercase, letter-spaced label that sits above a block and names it: page section headings, metadata card labels, reference group titles, the guide's On this page. Two forms, three ink tiers, two families.",
    contextHref: "/project/moti",
    contextLabel: "View eyebrows in context",
    recipe: {
      form: "Eyebrow tracking, uppercase, at one of two sizes: label for a 12px annotation, section for the 14px Medium label that names a whole section of a page. No padding or margin of its own; the host places it.",
      material: "Tertiary ink by default. Secondary ink when the label has to hold against a busy neighbour. Primary for a section eyebrow, which heads its block rather than annotating one.",
      motion: "None. An eyebrow never transitions; the block beneath it does.",
      variants: "tone changes material only; scale and family change form only (label or section, body or mono).",
    },
    signature: '<Eyebrow as="h2" scale="section" tone="primary" className="mb-6">Selected work</Eyebrow>',
    props: [
      { name: "as", type: "ElementType", default: '"p"', description: "Rendered element. Pass h2 or h3 when the eyebrow heads a region so the outline stays honest." },
      { name: "scale", type: '"label" | "section"', default: '"label"', description: "Size role. Label annotates a value; section names a whole section of a page and steps up to body-small at Medium." },
      { name: "tone", type: '"tertiary" | "secondary" | "primary"', default: '"tertiary"', description: "Ink tier. Primary pairs with the section scale." },
      { name: "family", type: '"body" | "mono"', default: '"body"', description: "Type family. Mono is the technical voice: terminal prompts, reference labels." },
      CLASS_NAME_PROP,
      { name: "children", type: "ReactNode", required: true, description: "The label text. Two or three words; it is not a sentence." },
    ],
    tokens: ["font.size.label", "font.size.bodySmall", "color.text.tertiary", "color.text.secondary", "color.text.primary", "font.family.body", "font.family.mono"],
    pairings: [
      { partner: "Metadata card", relationship: "The label above each value. The card supplies the spacing below it." },
      { partner: "Footer", relationship: "Heads the Explore and Social lists as a span, since the footer's lists are not page sections." },
      { partner: "Project list", relationship: "The section heading beside the collection dot is this component at the section scale in primary ink; the dot and its spacing belong to the list. The About chapter headings are the same setting." },
      { partner: "Design system reference", relationship: "Every group title on the foundation pages, and the sub-section headings on these component pages." },
    ],
    antipairings: [
      "Do not set an eyebrow in quiet ink. Quiet is decorative-only and fails AA at this size.",
      "Do not use an eyebrow as a title. If the text is a sentence or names the page, it is a heading at title or heading size.",
    ],
    accessibility: [
      { title: "Semantics", body: "A paragraph unless told otherwise. When it labels a landmark, pass as=\"h2\" and an id so the section can reference it with aria-labelledby." },
      { title: "Contrast", body: "Tertiary ink at 12px uppercase measures about 5:1 on the canvas, above the AA floor. Secondary and primary are higher. There is no tone below tertiary on purpose." },
      { title: "Letter spacing", body: "Screen readers read the text, not the tracking; uppercase is applied in CSS so the source casing stays natural." },
    ],
    tests: [
      { path: "src/components/project-detail/ProjectMetadataSummary.test.tsx", covers: ["Renders production metadata labels above their values in a persistent two-column grid"] },
      { path: "src/design-system/reference/content/ComponentSpecimen.test.tsx", covers: ["Renders the eyebrow stage as a live specimen"] },
    ],
    testGaps: [
      "No unit test asserts the tone or family switch; the stage shows all three settings but nothing checks their classes.",
    ],
  },

  "component-chip": {
    source: "src/components/ui/Chip.tsx → Chip, LinkChip, ChipButton",
    summary:
      "Small rounded labels in a metadata line. The Coming soon marker is passive; the outbound LinkChip carries a filled surface and stronger ink so it reads as clickable at a glance. Skill chips are ChipButtons: they rest as passive labels and become the skill-lens control on the homepage and Studio, taking the link material while pressed. One recipe, two forms, four materials.",
    contextHref: "/#projects",
    contextLabel: "View chips in context",
    recipe: {
      form: "Pill (rounded-full) that never wraps. label: 8px by 4px padding, label size, uppercase, eyebrow tracking, leading-none. text: 16px by 8px padding at body-small, sentence case.",
      material: "Hairline border on every chip. passive: tertiary ink, no fill. lead: lead ink on an 8% secondary wash. link: 8% foreground wash and lead ink, filling to 14% and primary ink on hover, strong focus ring. toggle: passive at rest, border and lead ink on hover, and the 14% wash with primary ink while aria-pressed.",
      motion: "Passive chips do not move. The link and toggle chips transition background, border, and color on duration.medium with ease.settle; the link chip's arrow nudges one pixel out on hover.",
      variants: "kind changes form only; tone changes material only. LinkChip is kind label with tone link plus the outbound arrow. ChipButton is kind label with tone toggle, as a real button.",
    },
    signature: '<Chip kind="label" tone="passive">Coming soon</Chip>\n<LinkChip link={{ label: "App Store", url }} />\n<ChipButton pressed={lens === skill} onPress={() => toggle(skill)}>{skill}</ChipButton>',
    props: [
      { name: "kind", type: '"label" | "text"', default: '"label"', description: "Form. label is the uppercase eyebrow chip; text is a sentence-case phrase chip." },
      { name: "tone", type: '"passive" | "lead"', default: '"passive"', description: "Material. lead is for phrase chips inside a case-study module." },
      CLASS_NAME_PROP,
      { name: "children", type: "ReactNode", required: true, description: "The chip text. One or two words for label; a short phrase for text." },
      { name: "link", type: "ProjectLink", required: true, description: "LinkChip only. The outbound destination; the label is the chip text." },
      { name: "pressed", type: "boolean", required: true, description: "ChipButton only. Whether this chip's skill is the active lens; rendered as aria-pressed." },
      { name: "onPress", type: "() => void", required: true, description: "ChipButton only. Toggles the lens. The click stops at the chip so the card beneath never opens." },
    ],
    dataShape: {
      name: "ProjectLink",
      fields: [
        { name: "label", type: '"App Store" | "GitHub" | "Live"', required: true, description: "A controlled vocabulary, so the same shipped state reads the same on every card." },
        { name: "url", type: "string", required: true, description: "Opens in a new tab with rel=\"noopener noreferrer\"." },
      ],
    },
    tokens: ["font.size.label", "font.size.bodySmall", "color.border.hairline", "color.text.tertiary", "color.text.lead", "color.text.primary", "color.focus.ringStrong", "radius.round", "duration.medium", "ease.settle"],
    pairings: [
      { partner: "Project card", relationship: "The metadata line after role and year: link chips first, then up to three skill chips. Never above the title." },
      { partner: "Metadata card", relationship: "Siblings in a case study, never nested. The metadata card holds prose values; chips hold single words." },
      { partner: "Case-study structure", relationship: "Text chips (Moti's vocabulary chips) sit inside a module, in lead ink, where a list would be too heavy." },
    ],
    antipairings: [
      "Do not nest a LinkChip inside another anchor. On a card it sits above the stretched card link at z-2, not inside it.",
      "Do not use passive chips as filters or toggles. They are labels; a control needs a button and a state, which is what ChipButton is.",
      "Do not make the lens reorder or hide cards. It changes brightness only: sections carry importance, and the lens must not be able to overrule them.",
    ],
    accessibility: [
      { title: "Semantics", body: "Passive chips are spans read in the flow of the metadata line. LinkChip is a real anchor with the outbound rel, so middle-click and cmd-click behave, and stopPropagation keeps the click off the card's delegated handler. ChipButton is a button with aria-pressed, so the active lens is announced as state, not as a colour." },
      { title: "Focus", body: "LinkChip and ChipButton use the strong focus ring with a canvas offset because they sit on a filled wash over media. Passive chips are not focusable." },
      { title: "Contrast", body: "Tertiary ink at 12px uppercase clears AA on the canvas. The link chip's lead ink on an 8% wash is higher still." },
      { title: "Target size", body: "The link chip is about 22px tall, below the 44px target token. It is the one control on a card that is not the card itself, and the card around it is the fallback target." },
    ],
    tests: [
      {
        path: "src/components/projectCardMeta.test.tsx",
        covers: [
          "Renders the shipped chip as a real outbound anchor that is not nested in the card link",
          "Renders skill chips after role and year, never above the title",
          "Orders a Workshop tile's metadata as links, skills, year",
          "Renders a placeholder card with no click target",
        ],
      },
    ],
    testGaps: [
      "The hover fill and arrow nudge are not asserted.",
      "The text kind has no test outside the specimen.",
    ],
  },

  "component-button": {
    source: "src/components/ui/Button.tsx → Button",
    summary:
      "The portfolio's two button tones. primary is the filled pill, the strongest affordance in the system, reserved for the one live-product link on a case study. secondary is the bordered mono control on utility pages, useful without competing with the copy. Renders an anchor when given an href and a button otherwise.",
    contextHref: "/project/moti#project-section-final-design",
    contextLabel: "View the primary button in context",
    recipe: {
      form: "primary: pill, 32px by 16px padding, body size, medium weight, 10px gap to the icon. secondary: small radius, 20px by 12px padding, body-small rising to body at md, mono, 12px gap. Both are inline-flex and never wrap.",
      material: "primary: foreground fill with canvas ink, lifting to lead ink on hover. secondary: hairline border and primary ink, the border rising to full strength on hover. Both take the focus ring with a canvas offset.",
      motion: "Color transitions on duration.fast with ease.settle. A trailing icon nudges 2px up and out on hover; a leading icon holds still.",
      variants: "tone changes form and material together, because the two tones are different shapes. Icon position changes motion only.",
    },
    signature: '<Button href={url} external icon={<ArrowUpRight strokeWidth={1.8} />}>View on the App Store</Button>',
    props: [
      { name: "tone", type: '"primary" | "secondary"', default: '"primary"', description: "Which recipe. There is no ghost or tertiary tone; a quiet inline action is a Back link or a text link." },
      { name: "href", type: "string", description: "Renders an anchor. Omit it and the element is a button with type=\"button\"." },
      { name: "external", type: "boolean", default: "false", description: "Opens in a new tab with rel=\"noopener noreferrer\". Only meaningful with href." },
      { name: "icon", type: "ReactNode", description: "An icon element; the button sizes it (20px trailing, 16px leading) and hides it from assistive technology." },
      { name: "iconPosition", type: '"leading" | "trailing"', default: '"trailing"', description: "Trailing for outbound arrows, leading for a glyph that names the action (mail)." },
      CLASS_NAME_PROP,
      { name: "children", type: "ReactNode", required: true, description: "The label. A verb phrase; the icon never carries the meaning alone." },
    ],
    tokens: ["color.text.primary", "color.text.lead", "color.background.canvas", "color.border.hairline", "color.border.default", "color.focus.ring", "radius.round", "radius.small", "font.size.body", "font.size.bodySmall", "font.family.mono", "duration.fast", "ease.settle"],
    tokenGap:
      "Earlier copies of the pill asked for a medium-breakpoint size step (lg) that does not exist in the type scale, so it never rendered. The pill is body size at every width; a larger step would be text-xl.",
    pairings: [
      { partner: "Case-study structure", relationship: "The primary pill, centered in its own row, once per case study: Oryne and Moti link the App Store, Inkwork and CalmMouse link their live sites." },
      { partner: "Back link", relationship: "The two ends of a page's affordance range. Back is quiet and inline; the button is loud and set apart. They never sit side by side." },
      { partner: "Chip", relationship: "The link chip is the button's small cousin in a metadata line. When the same destination appears on a card and in the case study, the card gets the chip and the study gets the button." },
    ],
    antipairings: [
      "Do not place two primary pills in one view. If two actions matter, one is secondary.",
      "Do not put a button inside a project card. The card is one anchor, and a second control competes for the same click.",
      "Do not use a button for in-page navigation. That is the section guide's job.",
    ],
    accessibility: [
      { title: "Semantics", body: "A real anchor when it navigates, a button with an explicit type when it acts. External links carry the safe rel. The icon is aria-hidden; the label carries the meaning." },
      { title: "Focus", body: "A two-pixel focus ring with a two-pixel canvas offset on both tones, on focus-visible only." },
      { title: "Target size", body: "The pill is about 56px tall and the secondary control about 45px, both above the 44px target token." },
      { title: "Motion", body: "Only color transitions and a 2px icon nudge. Neither is gated by reduced motion; the nudge is small enough to leave, but it is not yet a decision." },
    ],
    tests: [
      { path: "src/design-system/reference/content/ComponentSpecimen.test.tsx", covers: ["Renders the primary pill as an anchor with the pill form and the secondary control in mono", "Renders a plain button when no href is given"] },
    ],
    testGaps: [
      "No unit test covers the anchor and button switch outside the specimen, or that external adds the rel.",
      "The hover nudge and ink lift are checked by eye.",
    ],
  },

  "component-back-link": {
    source: "src/components/ui/BackLink.tsx → BackLink",
    summary:
      "Back as a quiet inline control: an arrow that nudges left on hover and text in secondary ink that rises to primary. A button rather than a link, because each host decides where back goes: a route, a closed overlay, a scroll to the list.",
    contextHref: "/project/aura",
    contextLabel: "View the back link in context",
    recipe: {
      form: "Inline flex, 8px gap, 44px minimum height from the touch-target token, 4px side padding, small radius, body-small size. mono swaps the family for utility pages.",
      material: "Secondary ink rising to primary on hover. Standard focus ring, no offset, because it sits on the canvas.",
      motion: "Color on duration.fast with ease.settle. The arrow translates 2px left on hover on the same pace.",
      variants: "family changes form only.",
    },
    signature: '<BackLink onClick={onBack} aria-label="Back to home" family="mono">Back</BackLink>',
    props: [
      { name: "family", type: '"body" | "mono"', default: '"body"', description: "Mono is the utility-page voice, where the whole top bar is set in JetBrains Mono." },
      { name: "onClick", type: "() => void", required: true, description: "Where back goes. The host owns the decision." },
      { name: "aria-label", type: "string", description: "Give the full destination when the visible text is only Back." },
      CLASS_NAME_PROP,
      { name: "children", type: "ReactNode", required: true, description: "Back, Back to home, or Back to all work." },
    ],
    tokens: ["color.text.secondary", "color.text.primary", "color.focus.ring", "layout.touchTarget", "font.size.bodySmall", "font.family.mono", "radius.small", "duration.fast", "ease.settle"],
    pairings: [
      { partner: "Case-study structure", relationship: "Twice per case study: under the header on load, and above the footer as Back to all work. The host routes a Studio project to the Studio page and a More Work project to that homepage section." },
      { partner: "Site header", relationship: "The header is global navigation; the back link is local. A page can have both, and the back link answers the question the header cannot: where was I." },
      { partner: "Resume and Oryne pages", relationship: "The mono family, in a top bar beside the page's mono label." },
    ],
    antipairings: [
      "Do not use it for an external destination. Back means the reader's own history.",
      "Do not stack two back links, or place one beside a primary button.",
    ],
    accessibility: [
      { title: "Semantics", body: "A button with an explicit type. When the visible text is Back, the aria-label names the destination." },
      { title: "Target size", body: "The minimum height is the 44px touch-target token, so it clears the target floor at every width." },
      { title: "Focus", body: "A two-pixel standard focus ring on focus-visible; the arrow is aria-hidden." },
    ],
    tests: [
      { path: "src/pages/ProjectDetail.test.tsx", covers: ["Returns a Studio project to /studio, not Selected Work", "Returns a More Work project to the homepage More Work section"] },
    ],
    testGaps: [
      "No test asserts the mono family or the arrow nudge.",
    ],
  },

  "component-text-link": {
    source: "src/components/ui/TextLink.tsx → TextLink",
    summary:
      "The inline link with the underline sweep. It is the header's destinations, the footer's lists, the Connect cluster, and the utility pages' footers: one recipe for every place a word is a link.",
    contextHref: "/#footer",
    contextLabel: "View text links in context",
    recipe: {
      form: "Inline text carrying the nav-link underline: one pixel below the baseline, drawn by index.css. No padding of its own. size sets body-small or caption; inherit takes the host's size.",
      material: "Ink at rest in the chosen tier, rising to primary on hover. inherit takes the tier from the container, so a row of links is set once. The underline is primary ink.",
      motion: "Color on duration.slow with ease.settle, the pace the header and footer share. The underline sweeps in from the left on ease.enter over 0.4s and out to the right.",
      variants: "tone changes material only; size changes form only; as changes the element and nothing visual.",
    },
    signature: '<TextLink as={Link} to="/studio" tone="secondary" size="sm">Studio</TextLink>',
    props: [
      { name: "as", type: "ElementType", default: '"a"', description: "Anchor by default. Pass Link for a router route, or button for a link that opens an overlay instead of navigating." },
      { name: "tone", type: '"inherit" | "primary" | "secondary" | "tertiary"', default: '"inherit"', description: "Ink at rest. inherit for rows where the container sets the tier." },
      { name: "size", type: '"inherit" | "sm" | "caption"', default: '"inherit"', description: "Type size. inherit takes the host's." },
      CLASS_NAME_PROP,
      { name: "children", type: "ReactNode", required: true, description: "The link text. Words, never an icon alone." },
    ],
    tokens: ["color.text.secondary", "color.text.tertiary", "color.text.primary", "font.size.bodySmall", "font.size.caption", "duration.slow", "ease.settle", "ease.enter"],
    tokenGap:
      "The underline's 0.4s sweep is a local value in index.css, chosen so the line finishes just after the color change.",
    pairings: [
      { partner: "Site header", relationship: "Every destination in the header, with the tier inherited from the nav row." },
      { partner: "Footer", relationship: "The Explore and Social lists at body-small in secondary ink; About is the button form because it opens an overlay." },
      { partner: "Back link", relationship: "Two different jobs. A text link goes somewhere new; the back link returns. The back link has an arrow and no underline." },
      { partner: "Button", relationship: "A text link is a word in a sentence or a list; a button is a control set apart. Do not underline a button or fill a link." },
    ],
    antipairings: [
      "Do not use it inside a project card. The card is one anchor.",
      "Do not use it for the primary action on a page. That is the Button.",
    ],
    accessibility: [
      { title: "Semantics", body: "A real anchor or router Link when it navigates; a button with an explicit type when it opens something in place. The underline is a pseudo-element, so it never enters the accessible name." },
      { title: "Target size", body: "Inline links sit at text height with the row's spacing around them; they do not guarantee the 44px target." },
      { title: "Focus", body: "A two-pixel standard focus ring on focus-visible, carried by the recipe so every host gets it." },
    ],
    tests: [
      { path: "src/components/SiteHeader.test.tsx", covers: ["Opens email from Connect and the email icon, and LinkedIn from the LinkedIn icon"] },
      { path: "src/pages/homepageSections.test.tsx", covers: ["Links the header to Work (a section) and Studio (a page)", "Keeps the footer Explore list to Work and Studio, without More Work"] },
    ],
    testGaps: [
      "No test covers the tone and size variants or the button form.",
    ],
  },

  "component-site-header": {
    source: "src/components/SiteHeader.tsx → SiteHeader",
    summary:
      "The site's primary navigation: logo, Work and Studio, About, Resume, and a right-aligned Connect cluster. One fixed, direction-aware unit shared by the homepage and the case-study pages so the two never drift.",
    contextHref: "/",
    contextLabel: "View site header in context",
    recipe: {
      form: "Fixed to the top at z-50. Desktop: a three-column grid with the logo left, the nav centered, Connect right. Mobile: one centered row at body-small with a fixed 20px gap, Connect on a second row, and a one-pixel divider. Page padding steps 32, 64, 96px.",
      material: "A vertical scrim from the header scrim color, solid for the top 42% and fading to transparent, so the links stay legible over any hero. Links in secondary ink rising to primary, with the nav-link underline in primary ink.",
      motion: "Outer layer: a 20px slide with fade, 240ms out on ease.standard and 450ms back on ease.move, driven by scroll direction. Inner layer: a Framer entrance the host delays to its own load sequence. Links transition color on duration.slow and the underline sweeps on ease.enter.",
      variants: "hideMobileDivider changes form only, so a case study's sticky guide can dock under the menu row as one bar.",
    },
    signature: '<SiteHeader hidden={hidden} inert={aboutOpen} shouldReduceMotion={reduce} entranceVisible={loaded} entranceDelay={0.2} hrefBase="/" onSection={scrollTo} onAbout={openAbout} />',
    props: [
      { name: "hidden", type: "boolean", required: true, description: "Tucked away by the direction-aware hide-on-scroll hook." },
      { name: "inert", type: "boolean", required: true, description: "No pointer events, for example while the About overlay is open." },
      { name: "shouldReduceMotion", type: "boolean", required: true, description: "Removes the outer slide and fade transitions." },
      { name: "entranceVisible", type: "boolean", required: true, description: "Target of the inner entrance animation." },
      { name: "entranceDelay", type: "number", required: true, description: "Entrance delay in seconds, timed by the host." },
      { name: "hrefBase", type: "string", default: '""', description: "Prefix for section anchors: empty on the homepage, a slash elsewhere so the href resolves to the homepage section." },
      { name: "onSection", type: "(sectionId: string) => void", required: true, description: "A homepage-section nav item was clicked." },
      { name: "onAbout", type: "() => void", required: true, description: "Open the About overlay." },
      { name: "onLogoClick", type: "() => void", description: "Homepage only: close About and return to the hero." },
      { name: "hideMobileDivider", type: "boolean", default: "false", description: "Drops the divider on mobile so the case-study guide can merge with the menu row." },
    ],
    tokens: ["component.siteHeader.scrimColor", "color.text.secondary", "color.text.primary", "color.border.default", "duration.slow", "ease.enter", "ease.standard", "ease.move", "font.family.body"],
    tokenGap:
      "The outer layer's 240ms and 350ms fade timings are local: the pair is tuned as one asymmetric movement (a quick quiet exit, a slower entrance) and does not map to two system paces.",
    pairings: [
      { partner: "Homepage hero", relationship: "The hero hosts the header and times its entrance to font readiness and the terminal statement." },
      { partner: "Case-study structure", relationship: "The case study hosts it with hideMobileDivider so the sticky section guide reads as one continuous bar under the menu." },
      { partner: "About", relationship: "The header goes inert while About is open so its links cannot intercept the overlay." },
      { partner: "Footer", relationship: "The same destinations in a quieter register at the foot of the page." },
    ],
    antipairings: [
      "Do not mount it twice or add page-specific actions to it. Page actions belong in the page.",
      "Do not give the wrapper pointer events. Only the links are hit targets, so the mobile section guide underneath keeps its taps and swipes.",
    ],
    accessibility: [
      { title: "Semantics", body: "A nav landmark with real links; the logo is a link home with an accessible name. Icon links carry aria-labels." },
      { title: "Motion", body: "The outer hide-and-reveal transition is removed under reduced motion. The inner entrance still animates, timed by the host." },
      { title: "Target size", body: "The inline links do not guarantee the 44px target; they sit at text height with the row's padding around them." },
      { title: "Legibility", body: "The scrim keeps secondary ink above AA over any cover image; the links rise to primary on hover." },
    ],
    tests: [
      { path: "src/components/SiteHeader.test.tsx", covers: ["Opens email from Connect and the email icon, and LinkedIn from the LinkedIn icon", "Right-aligns Connect on desktop beside the centered nav"] },
      { path: "src/hooks/useHideOnScroll.test.ts", covers: ["Starts visible", "Hides when scrolling down past the top zone", "Reveals again when scrolling back up past the threshold", "Always shows near the very top regardless of direction"] },
      { path: "src/pages/homepageSections.test.tsx", covers: ["Links the header to Work (a section) and Studio (a page)"] },
    ],
    testGaps: [
      "The inert state and the reduced-motion branch are not asserted.",
      "Nothing checks that hideMobileDivider removes the divider only below md.",
    ],
  },

  "component-project-card": {
    source: "src/components/ProjectList.tsx → ProjectCard",
    summary:
      "Turns a portfolio project into a clear, image-led route with title, signal, role, and year. Used for Selected Work and Workshop entries; placeholder projects stay visible but intentionally lose link and hover behavior.",
    contextHref: "/#projects",
    contextLabel: "View project cards in context",
    recipe: {
      form: "A cover in a reserved aspect box (coverAspect on every project, so the page never grows mid-scroll), large radius, then title, signal, description, and the metadata line of role, year, chips. Selected Work heroes keep each cover's own ratio. Studio tiles and the More Work grid crop into a shared 16/9 box.",
      material: "The card wash (projectCard.surface) behind the media and the warm hover overlay (projectCard.hoverOverlay) on top. Title in primary ink, description in lead, metadata in secondary. Strong focus ring with a 4px offset, since the ring sits over media.",
      motion: "Enters on MOTION.enter, staggered by its global index. Media lifts on ease.move over duration.medium on hover. A cover reel plays only while hovered, never on load or on arrival. The hero-dot arrival pulse is its own 0.28s keyframe, tuned separately and left alone.",
      variants: "horizontal and imageRight change form only. dotClass changes material only. Placeholder destination removes the link and the motion.",
    },
    signature: "<ProjectCard project={project} projectId=\"moti\" dotClass=\"bg-dot-red\" globalIndex={0} />",
    props: [
      { name: "project", type: "Project", required: true, description: "The project record. Everything the card renders comes from here." },
      { name: "projectId", type: "string", description: "Destination under /project/:id. Omit it and the card renders as a plain div instead of a Link, so nothing focusable promises a page that does not exist. Also the identity the hero dot arrival event matches on." },
      { name: "dotClass", type: "string", required: true, description: "Accent dot class that ties the card back to its section: red for Selected Work, gold for Workshop." },
      { name: "globalIndex", type: "number", required: true, description: "Position across every section, not within one. Drives the entrance stagger so the page reads as a single sequence." },
      { name: "rowDelay", type: "number", default: "0", description: "Extra entrance delay, in seconds, for cards sharing a row." },
      { name: "metadataLabel", type: "string", description: "Overrides the role and year line beneath the title." },
      { name: "aspectRatio", type: "string", description: "Fixed media ratio with object-cover. Omit it and the container scales to the image's natural ratio instead." },
      { name: "maxWidth", type: "string", description: "Caps the card's measure in a wide row." },
      { name: "horizontal", type: "boolean", default: "false", description: "Editorial row layout: media beside text rather than above it." },
      { name: "imageRight", type: "boolean", default: "false", description: "Flips media and text order. Only meaningful with horizontal." },
      { name: "featured", type: "boolean", default: "false", description: "Selected Work frame: the cover whole at its own shape, the largest caption tier, with the signal line as the subline. Every cover-above card shows its caption over the frame on hover from md (lg for tiles) and under it below that." },
    ],
    dataShape: {
      name: "Project",
      fields: [
        { name: "title", type: "string", required: true, description: "Card heading." },
        { name: "description", type: "string", required: true, description: "Supporting line." },
        { name: "role", type: "string", required: true, description: "Malik's role on the project." },
        { name: "year", type: "string", required: true, description: "Displayed alongside role." },
        { name: "id", type: "string", description: "Stable key; usually mirrors projectId." },
        { name: "signal", type: "string", description: "Short editorial line above the description." },
        { name: "coverImage", type: "string", description: "Cover still. Alt text is the project title." },
        { name: "coverAspect", type: "string", description: "Reserves the media box before the image loads, so hero dot navigation lands on the right card." },
        { name: "coverVideo", type: "string", description: "Cover reel. Plays on hover only, never loops: the card starts and parks it, and reduced motion leaves it off entirely." },
        { name: "coverFit", type: '"cover" | "contain"', description: "Media fit inside the frame." },
        { name: "details", type: "string", description: "Extra copy for editorial rows." },
        { name: "destination", type: "ProjectDestination", required: true, description: "case-study, video, external, or placeholder. Placeholder is the one card with no click target." },
        { name: "links", type: "ProjectLink[]", description: "Outbound link chips rendered in the metadata line." },
        { name: "skills", type: "Skill[]", description: "Up to three passive skill chips." },
        { name: "sectionHero", type: "boolean", description: "Render as a full-width row above the section grid. Declarative rather than positional, so reordering the array cannot silently reassign the hero." },
      ],
    },
    tokens: ["component.projectCard.surface", "component.projectCard.hoverOverlay", "color.text.primary", "color.text.lead", "color.text.secondary", "color.background.canvas", "color.focus.ringStrong", "radius.large", "duration.reveal", "duration.medium", "ease.enter", "ease.move", "font.family.display", "font.family.body"],
    tokenGap:
      "The hero-dot arrival pulse keeps its own 0.28s keyframe on the move curve. It is tuned as part of the dot-to-card animation and is documented in the repo notes as off limits to refactoring.",
    pairings: [
      { partner: "Project list", relationship: "The only supported container. It supplies dotClass, globalIndex, and the layout flags, and it owns the grid rhythm. A card mounted outside it loses its stagger and its section accent." },
      { partner: "Homepage hero dot grid", relationship: "Clicking a project dot eases the page to the matching card and fires project-dot-arrive on landing. The card answers with a brief pulse and force-reveals itself, since the scroll outruns the entrance animation." },
      { partner: "Chip", relationship: "The metadata line's link chips and skill chips. The link chip sits above the card's stretched anchor, not inside it." },
      { partner: "Case-study structure", relationship: "The card's destination. projectId must resolve to a route under /project/:id, or the card should ship without it and stay inert." },
      { partner: "Media frame", relationship: "Siblings, not nested. The card renders its own cover treatment through CardMedia; media frame is for evidence inside a case study, after the card has done its job." },
    ],
    antipairings: [
      "Do not nest buttons, links, or a lightbox trigger inside a card. The whole card is one anchor, and a second control inside it competes for the same click.",
      "Do not use a card as a generic content tile. Its hover, entrance, and arrival behavior only make sense when the destination is a project.",
    ],
    accessibility: [
      { title: "Semantics", body: "Available projects use real anchors for keyboard focus, screen-reader semantics, and native open-in-new-tab behavior. Placeholder entries drop to a plain div rather than a disabled link, so nothing focusable promises a destination that is not there." },
      { title: "Focus", body: "The strong focus ring with a four-pixel offset against the canvas, on focus-visible only. It stays visible over both the media and the overlay." },
      { title: "Target size", body: "The entire card is the target, so it clears the 44px minimum in the token set at every breakpoint." },
      { title: "Motion", body: "Cover video is the one motion path that respects prefers-reduced-motion: the reel parks and the still holds. Entrance, hover, and the dot-arrival pulse do not yet respond to reduced motion." },
      { title: "Images", body: "Cover images take the project title as alt text. That is accurate for a card whose job is naming the project, but it means the image adds no description beyond the visible heading." },
    ],
    tests: [
      { path: "src/components/projectDotArrival.test.tsx", covers: ["Flags the matching card as arriving so the landing pulse can play", "Leaves other cards untouched", "Reveals a card that never entered the viewport, so it is composed on landing", "Announces arrival immediately when the target is already in place"] },
      { path: "src/components/coverVideoPlayback.test.tsx", covers: ["Never autoplays or loops: the reel is driven from the card, not the element", "Stays parked below the fold and on arrival; only hover starts it", "Does not replay on a second pass through the viewport", "Plays from the start on pointer entry, parks on leave, and does not restart mid-reel"] },
      { path: "src/components/coverAspect.test.ts", covers: ["Covers every project card that has a cover image"] },
      { path: "src/components/projectCardMeta.test.tsx", covers: ["Renders a placeholder card with no click target", "Gives an external tile an outbound card link and an arrow glyph"] },
    ],
    testGaps: [
      "Nothing covers entrance or hover under prefers-reduced-motion, which is the documented gap above.",
      "The hover overlay and focus ring have no visual regression coverage, so contrast over the media is verified by eye.",
    ],
  },

  "component-project-list": {
    source: "src/components/ProjectList.tsx → ProjectList (default export)",
    summary:
      "A collection of project cards under a section heading: Selected Work and More Work on the homepage, the tile grid on Studio. It owns the grid rhythm, the section dot, and the entrance sequence; the cards own everything inside their own frame.",
    contextHref: "/#projects",
    contextLabel: "View project list in context",
    recipe: {
      form: "A section with the homepage id the header scrolls to. Heading row: a 6px collection dot and the section label. Grid: one column, two from 768px with uniform 16/9 covers (.project-grid); Studio: two columns, three from 768px, 16/9 (.studio-grid), split into two groups (Apps and tools, then Machines) each under its own eyebrow and one-line blurb.",
      material: "The dot in the collection accent, red for Selected Work and gold for Workshop. Label in tertiary ink. Cards bring their own surfaces.",
      motion: "Cards enter on MOTION.enter, staggered by globalIndex across every section so the page reads as one sequence. Studio restarts the stagger per group. Studio and More Work have no scroll parallax.",
      variants: "section changes form, material, and motion together: it selects the list layout and the dot color. showLabel and trailing change form only.",
    },
    signature: '<ProjectList section="selected" projects={projects} />',
    props: [
      { name: "section", type: '"selected" | "more" | "studio"', required: true, description: "Which collection. Also selects the dot color and the grid." },
      { name: "projects", type: "ProjectCardData[]", required: true, description: "The cards, in editorial order." },
      { name: "showLabel", type: "boolean", default: "true", description: "The Studio page draws its own heading above the grid, so it hides the eyebrow." },
      { name: "trailing", type: "Partial<Record<StudioGroupKey, ReactNode>>", description: "Studio only: rendered under a group's grid, keyed by group (the GitHub strip closes the software group)." },
    ],
    tokens: ["color.accent.selectedWork", "color.accent.workshop", "color.text.primary", "color.text.tertiary", "duration.reveal", "ease.enter", "font.family.body"],
    tokenGap:
      "Grid gaps are local clamp() values in index.css; the spacing tokens describe the rhythm but do not drive the grid.",
    pairings: [
      { partner: "Project card", relationship: "The list supplies dotClass, globalIndex, and the layout flags; the card never chooses its own place." },
      { partner: "Site header", relationship: "Work in the header scrolls to the Selected Work section id; the list owns that id." },
      { partner: "Studio page", relationship: "Hosts the studio section with showLabel off, grouped by studioGroup, and the GitHub strip trailing the software group." },
      { partner: "Studio teaser", relationship: "The homepage hands off to Studio with a teaser after More Work: the section label, the Work / Studio line, ZEAT shown in three views, and a Go to Studio button. It reuses SectionLabel, not the list." },
      { partner: "Case-study structure", relationship: "Next up at the foot of a case study reuses the .project-grid and three cards, but is its own component so it never shares a name with More Work." },
    ],
    antipairings: [
      "Do not use it for an arbitrary list of things. The grid rhythm, dot, and stagger assume project cards.",
      "Do not reorder sections by moving markup. Section order is data in sections.ts, and the header and footer read the same list.",
    ],
    accessibility: [
      { title: "Semantics", body: "Each collection is a section with a stable id and a visible heading, so the header, footer, and hero dots can all target it." },
      { title: "Order", body: "Keyboard order matches visual order; the 16/9 cover box changes crop, never sequence." },
      { title: "Motion", body: "The entrance stagger is not gated by reduced motion. Cover reels inside the cards are." },
    ],
    tests: [
      { path: "src/pages/homepageSections.test.tsx", covers: ["Renders every section-type nav item as a DOM id the header can scroll to", "Renders the homepage sections in order with their eyebrows, and not the Studio page", "Gives every homepage project a card in its own section, and every card a link, with the placeholder as the one inert card", "Closes Work with a Studio hand-off after More Work, with a Go to Studio button and a Studio project", "Aligns More Work covers to 16/9 without changing Selected Work hero ratios"] },
      { path: "src/pages/studio.test.tsx", covers: ["Renders every Studio project as a clickable tile", "Splits the tiles into the software and the machines, each under its own heading, in that order", "Closes the software group with a GitHub strip that opens the profile in a new tab", "Does not repeat the section eyebrow under the page title", "Puts every Studio cover in the same 16/9 box"] },
    ],
    testGaps: [
      "The 16/9 grid crop is checked by eye.",
    ],
  },

  "component-metadata-card": {
    source: "src/components/project-detail/ProjectMetadataSummary.tsx → ProjectMetadataSummary",
    summary:
      "The compact label-and-value grid near a case-study introduction: role, timeline, team, platform. It orients the reader before the narrative starts and then gets out of the way.",
    contextHref: "/project/moti",
    contextLabel: "View metadata cards in context",
    recipe: {
      form: "A two-column grid at every breakpoint with a 12px gap rising to 16px. Each card is small-radius with 20px padding rising to 24px at md. An Eyebrow label, then the value at body-small, with authored line breaks preserved.",
      material: "Hairline border on a 7% secondary wash. Label in tertiary ink, value in secondary.",
      motion: "None. The cards are read, not interacted with.",
      variants: "None. The card count comes from the data.",
    },
    signature: '<ProjectMetadataSummary cards={[{ label: "Role", value: "Product design" }]} />',
    props: [
      { name: "cards", type: "ProjectMetaCard[]", required: true, description: "Label and value pairs, in reading order. Two to four is the useful range." },
    ],
    dataShape: {
      name: "ProjectMetaCard",
      fields: [
        { name: "label", type: "string", required: true, description: "Rendered as an Eyebrow." },
        { name: "value", type: "string", required: true, description: "Newlines are kept, so a team list can break where it was authored." },
      ],
    },
    tokens: ["color.border.hairline", "color.surface.secondary", "color.text.tertiary", "color.text.secondary", "radius.small", "font.size.label", "font.size.bodySmall", "font.family.body"],
    pairings: [
      { partner: "Case-study structure", relationship: "Sits after the hero and summary, before the first narrative section." },
      { partner: "Eyebrow", relationship: "Every label is the Eyebrow component; the card supplies the 12px of space beneath it." },
      { partner: "Chip", relationship: "Siblings, never nested. Chips are single words on a card; metadata values are short prose." },
    ],
    antipairings: [
      "Do not use it as a stats block. Numbers that need to impress are a highlight module, not metadata.",
      "Do not exceed about four cards; the grid stays two columns at every width by design and a long list becomes a wall.",
    ],
    accessibility: [
      { title: "Layout", body: "The metadata cards stay a persistent two-column grid at every breakpoint, with compact spacing and type on smaller screens rather than a collapse to one column." },
      { title: "Semantics", body: "Label and value are paragraphs in reading order, so a screen reader announces each pair together." },
      { title: "Contrast", body: "Secondary ink on the 7% wash still clears AA; the wash is close to the canvas." },
    ],
    tests: [
      { path: "src/components/project-detail/ProjectMetadataSummary.test.tsx", covers: ["Renders production metadata as a persistent two-column grid", "Keeps authored line breaks in a card value"] },
    ],
    testGaps: [
      "No test pins the responsive padding step.",
    ],
  },

  "component-media-frame": {
    source: "src/components/project-detail/ProjectMediaFrame.tsx → ProjectMediaFrame",
    summary:
      "The stable boundary around case-study evidence: an image, a demo reel, or an embedded player, each in the same large-radius frame so the narrative's media reads as one series regardless of type.",
    contextHref: "/project/aura#project-section-final-design",
    contextLabel: "View media frames in context",
    recipe: {
      form: "A figure with hidden overflow and the large radius. Images are full width at natural height. Video is contained to the smaller of 700px and 74vh. Embeds hold a 16:9 box.",
      material: "A 10% secondary wash behind the media, so a loading image or a letterboxed clip shows a surface rather than a hole. Video letterbox bars are the canvas color.",
      motion: "None of its own. A video starts buffering when the frame is within one viewport of the screen and plays, muted, once it is half in view. It never autoplays on load.",
      variants: "fig.type changes form only: the frame is the same, the content differs.",
    },
    signature: '<ProjectMediaFrame fig={{ type: "image", src, alt: "Research board" }} />',
    props: [
      { name: "fig", type: "ProjectSectionFigure", required: true, description: "The figure record. Its type picks the content." },
    ],
    dataShape: {
      name: "ProjectSectionFigure",
      fields: [
        { name: "type", type: '"image" | "video" | "embed"', default: '"image"', description: "What the frame holds." },
        { name: "src", type: "string", description: "Image or video source." },
        { name: "alt", type: "string", description: "Image only. Required; it is the figure's accessible name." },
        { name: "poster", type: "string", description: "Video only. The still shown until playback starts." },
        { name: "url", type: "string", description: "Embed only. YouTube and Vimeo watch URLs are rewritten to their player URLs." },
        { name: "title", type: "string", description: "Embed only. The iframe's accessible name." },
      ],
    },
    tokens: ["color.surface.secondary", "color.background.canvas", "radius.large"],
    pairings: [
      { partner: "Figure caption", relationship: "The caption follows the frame inside the same figure: an optional label, a colon, one clause." },
      { partner: "Image lightbox", relationship: "Images inside the case-study root open in the lightbox through a delegated click; the frame does not know about it." },
      { partner: "Case-study structure", relationship: "Every figure in a section renders through the frame, so the media rhythm is the template's, not the author's." },
    ],
    antipairings: [
      "Do not use it for card covers. Cards reserve their own aspect box and hover treatment.",
      "Do not use it for a looping hero clip. Those are art-directed and autoplay on purpose.",
    ],
    accessibility: [
      { title: "Images", body: "alt is required on the record and rendered verbatim. Images load lazily and decode asynchronously." },
      { title: "Video", body: "Muted, inline, with native controls, and started by script only when half in view. That start is not gated by reduced motion, which is a gap." },
      { title: "Embeds", body: "The iframe takes the record's title, so the player has an accessible name." },
    ],
    tests: [
      { path: "src/components/project-detail/ProjectMediaFrame.test.tsx", covers: ["Renders a production image figure with its provided alternative text"] },
    ],
    testGaps: [
      "The video and embed branches, including the in-view play and the URL rewrite, have no tests.",
    ],
  },

  "component-footer": {
    source: "src/components/Footer.tsx → Footer",
    summary:
      "The quieter discovery surface after the page's primary content: an Explore list mirroring the header, a Social list, and the copyright line. Primary header decisions stay out of it.",
    contextHref: "/#footer",
    contextLabel: "View footer in context",
    recipe: {
      form: "Two columns from md (Explore, Social), each an Eyebrow over a list with 16px between items. A full-width top rule above the copyright line at caption size. Page padding matches the host: the wide variant mirrors the case-study grid.",
      material: "Links in secondary ink rising to primary with the nav-link underline. Eyebrows in tertiary ink. The bottom rule is the full-strength border, the one place a rule is not a hairline.",
      motion: "Links transition color on duration.slow, the same pace as the header, and the underline sweeps on ease.enter.",
      variants: "constrained and wide change form only.",
    },
    signature: '<Footer hrefBase="/" onSectionClick={scrollTo} onAboutClick={openAbout} wide />',
    props: [
      { name: "onSectionClick", type: "(sectionId: string) => void", description: "A homepage section link was clicked; receives the section's DOM id." },
      { name: "onAboutClick", type: "() => void", description: "Scrolls to the top and opens About." },
      { name: "hrefBase", type: "string", default: '""', description: "Prefix for section anchors: empty on the homepage, a slash elsewhere." },
      { name: "constrained", type: "boolean", default: "true", description: "Wrap in the content max-width. Off for full-bleed hosts." },
      { name: "wide", type: "boolean", default: "false", description: "Match the case-study page grid (1400px, tighter padding) so edges align exactly." },
    ],
    tokens: ["color.text.secondary", "color.text.primary", "color.text.tertiary", "color.border.default", "duration.slow", "ease.enter", "font.size.bodySmall", "font.size.caption", "font.family.body"],
    pairings: [
      { partner: "Site header", relationship: "The same nav items from the same list, so Work and Studio can never drift between the two." },
      { partner: "About", relationship: "The Back to home link sits just above the footer inside the About overlay." },
      { partner: "Design system reference", relationship: "The footer is where the reference is discoverable from the portfolio." },
    ],
    antipairings: [
      "Do not add More Work to Explore. It is a homepage section, not a chrome destination.",
      "Do not put a primary button in the footer. Its register is quiet by design.",
    ],
    accessibility: [
      { title: "Semantics", body: "A footer landmark with two labelled lists. About is a button because it opens an overlay; everything else is a real link." },
      { title: "Target size", body: "The inline links do not guarantee the 44px target; the 16px list spacing keeps them separable but not tall." },
      { title: "Contrast", body: "Secondary ink at body-small clears AA on the canvas; the copyright line in tertiary ink at caption size sits just above the floor." },
    ],
    tests: [
      { path: "src/pages/homepageSections.test.tsx", covers: ["Keeps the footer Explore list to Work and Studio, without More Work"] },
    ],
    testGaps: [
      "No test covers the wide and constrained layouts or the About button's scroll-then-open sequence.",
    ],
  },

  "component-lightbox": {
    source: "src/components/project-detail/ImageLightbox.tsx → ImageLightbox",
    summary:
      "Full-screen inspection of a case-study image without leaving the narrative. Opened by a delegated click on any image inside the case-study root; dismissed by Close, the backdrop, or Escape.",
    contextHref: "/project/aura#project-section-final-design",
    contextLabel: "View image lightbox in context",
    recipe: {
      form: "A portal fixed over the whole viewport at z-2000, centered, with 16px padding rising to 40px. The image fits within 95vw by 92vh at its natural ratio with the base radius. Close is a 40px round control at the top right.",
      material: "The lightbox backdrop (90% black) with a blur, so the page stays sensed behind the image. Close in tertiary ink rising to primary. A zoom-out cursor on the backdrop and a default cursor on the image.",
      motion: "The backdrop fades on duration.fast with ease.settle. The image fades and scales from 0.97 over 0.22s on ease.move. Reduced motion zeroes both durations and the scale.",
      variants: "None. The one variant is the reduced-motion branch.",
    },
    signature: "<ImageLightbox image={image} onClose={() => setImage(null)} />",
    props: [
      { name: "image", type: "LightboxImage | null", required: true, description: "The open image, or null when closed. Presence drives the enter and exit animation." },
      { name: "onClose", type: "() => void", required: true, description: "Called by Close, the backdrop, and Escape." },
    ],
    dataShape: {
      name: "LightboxImage",
      fields: [
        { name: "src", type: "string", required: true, description: "The full-size source." },
        { name: "alt", type: "string", required: true, description: "Names the dialog: Expanded image, followed by the alt text." },
      ],
    },
    tokens: ["component.lightbox.backdrop", "color.text.tertiary", "color.text.primary", "radius.base", "duration.fast", "duration.medium", "ease.settle", "ease.move"],
    tokenGap:
      "The image's 0.22s scale is a local value between fast and medium, tuned so the image settles just after the backdrop.",
    pairings: [
      { partner: "Media frame", relationship: "The frame renders the image; the case-study root delegates the click. Navigational thumbnails and linked images keep their link behavior and a pointer cursor." },
      { partner: "Case-study structure", relationship: "The template owns the open state and passes the image down, so only one lightbox exists per page." },
      { partner: "Video lightbox", relationship: "A sibling for project reels opened from cards. Same backdrop, same dismissals, a player instead of an image." },
    ],
    antipairings: [
      "Do not open it from a project card. Cards navigate; the lightbox is for evidence inside a study.",
      "Do not add captions or controls inside it. It is a viewer, and its chrome is one Close button.",
    ],
    accessibility: [
      { title: "Semantics", body: "A modal dialog named from the image alt text. Focus moves to Close on open, page scroll locks, and focus returns to the trigger on close." },
      { title: "Dismissal", body: "Escape, the backdrop, and Close all call the same onClose; a click on the image itself does nothing." },
      { title: "Motion", body: "Under reduced motion, the backdrop fade and the image scale and fade durations go to zero." },
      { title: "Target size", body: "The Close control is 40px, below the 44px target represented in the token set." },
    ],
    tests: [
      { path: "src/design-system/reference/content/ComponentSpecimen.test.tsx", covers: ["Opens the production image lightbox and restores focus on Escape"] },
      { path: "src/components/videoLightbox.test.tsx", covers: ["The sibling video lightbox opens in place, closes on Escape, and returns focus to the tile", "Closes on a backdrop click but not on a click inside the player"] },
    ],
    testGaps: [
      "Scroll locking and the reduced-motion branch of the image lightbox are not asserted.",
    ],
  },
};

function DocSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-hairline pt-8 first:border-t-0 first:pt-0">
      <Eyebrow as="h2" id={id} data-doc-heading="">
        {title}
      </Eyebrow>
      {intro ? (
        <p className="mt-3 max-w-measure-wide text-sm leading-relaxed text-foreground-secondary">{intro}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PropsTable({ caption, rows }: { caption: string; rows: DocProp[] }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full min-w-[540px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-hairline">
            {["Name", "Type", "Default", "Notes"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-4 py-3 text-label uppercase tracking-eyebrow font-normal text-foreground-tertiary"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-hairline-faint last:border-b-0 align-top">
              <th scope="row" className="px-4 py-3 font-normal">
                <code className="font-mono text-foreground">{row.name}</code>
                {row.required ? (
                  <span className="ml-2 text-label uppercase tracking-eyebrow text-foreground-tertiary">Required</span>
                ) : null}
              </th>
              <td className="px-4 py-3">
                <code className="font-mono text-foreground-secondary">{row.type}</code>
              </td>
              <td className="px-4 py-3 text-foreground-tertiary">
                {row.default ? <code className="font-mono">{row.default}</code> : "none"}
              </td>
              <td className="max-w-measure-narrow px-4 py-3 leading-relaxed text-foreground-secondary">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecipeFacets({ recipe }: { recipe: DocRecipe }) {
  const facets: [string, string][] = [
    ["Form", recipe.form],
    ["Material", recipe.material],
    ["Motion", recipe.motion],
  ];
  return (
    <div className="space-y-4" data-testid="doc-recipe">
      <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-3">
        {facets.map(([title, body]) => (
          <div key={title} className="bg-background p-5 sm:p-6">
            <dt className="text-sm font-medium text-foreground">{title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-foreground-secondary">{body}</dd>
          </div>
        ))}
      </dl>
      {recipe.variants ? (
        <p className="max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
          <span className="font-medium text-foreground-secondary">Variants:</span> {recipe.variants}
        </p>
      ) : null}
    </div>
  );
}

export function ComponentDoc({ sectionId }: { sectionId: string }) {
  const doc = COMPONENT_DOCS[sectionId];
  if (!doc) return null;

  return (
    <div data-testid={`reference-${sectionId}`} className="space-y-8 md:space-y-10">
      <DocSection id={`${sectionId}-preview`} title="Preview" intro={doc.summary}>
        <div className="space-y-4">
          <ComponentSpecimen
            sectionId={sectionId}
            contextHref={doc.contextHref}
            contextLabel={doc.contextLabel}
          />
          <p className="text-sm text-foreground-tertiary">
            Source: <code className="font-mono text-foreground-secondary">{doc.source}</code>
          </p>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-recipe`}
        title="Recipe"
        intro="The component in the system's three facets. A variant changes one facet and leaves the other two alone."
      >
        <RecipeFacets recipe={doc.recipe} />
      </DocSection>

      <DocSection
        id={`${sectionId}-api`}
        title="API"
        intro="The props the component actually accepts, the record it renders from, and the tokens it consumes."
      >
        <div className="space-y-6">
          <pre className="min-w-0 overflow-x-auto rounded-lg border border-hairline bg-card/25 p-4 text-label leading-relaxed font-mono text-foreground-secondary">
            <code>{doc.signature}</code>
          </pre>

          <PropsTable caption="Component props" rows={doc.props} />

          {doc.dataShape ? (
            <section aria-labelledby={`${sectionId}-data-shape`}>
              <h3 id={`${sectionId}-data-shape`} className="text-sm font-medium text-foreground">
                {doc.dataShape.name} record
              </h3>
              <div className="mt-3">
                <PropsTable caption={`${doc.dataShape.name} fields`} rows={doc.dataShape.fields} />
              </div>
            </section>
          ) : null}

          <section aria-labelledby={`${sectionId}-tokens`}>
            <h3 id={`${sectionId}-tokens`} className="text-sm font-medium text-foreground">
              Token dependencies
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {doc.tokens.map((token) => (
                <li key={token}>
                  <code className="block rounded-sm border border-hairline px-2.5 py-1.5 text-label text-foreground-secondary font-mono">
                    {token}
                  </code>
                </li>
              ))}
            </ul>
            {doc.tokenGap ? (
              <p className="mt-3 max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
                <span className="font-medium text-foreground-secondary">Local values:</span> {doc.tokenGap}
              </p>
            ) : null}
          </section>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-pairings`}
        title="Pairings"
        intro="What this component is meant to sit next to, and what it should not be asked to do."
      >
        <div className="space-y-6">
          <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
            {doc.pairings.map((pairing) => (
              <div key={pairing.partner} className="bg-background p-5 sm:p-6">
                <dt className="text-sm font-medium text-foreground">{pairing.partner}</dt>
                <dd className="mt-2 max-w-measure-wide text-sm leading-relaxed text-foreground-secondary">
                  {pairing.relationship}
                </dd>
              </div>
            ))}
          </dl>
          <section aria-labelledby={`${sectionId}-antipairings`}>
            <h3 id={`${sectionId}-antipairings`} className="text-sm font-medium text-foreground">
              Do not pair
            </h3>
            <ul className="mt-3 space-y-2">
              {doc.antipairings.map((item) => (
                <li key={item} className="max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-accessibility`}
        title="Accessibility"
        intro="What holds today, stated alongside what does not."
      >
        <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-2">
          {doc.accessibility.map((note, index) => (
            <div
              key={note.title}
              // An odd count would otherwise leave a bordered empty cell at the end.
              className={`bg-background p-5 sm:p-6 ${
                doc.accessibility.length % 2 === 1 && index === doc.accessibility.length - 1
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <dt className="text-sm font-medium text-foreground">{note.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground-secondary">{note.body}</dd>
            </div>
          ))}
        </dl>
      </DocSection>

      <DocSection
        id={`${sectionId}-testing`}
        title="Testing"
        intro="The behavior that is pinned by tests, and the behavior that is not."
      >
        <div className="space-y-6">
          {doc.tests.map((file) => (
            <section key={file.path}>
              <h3 className="text-sm font-medium text-foreground">
                <code className="font-mono">{file.path}</code>
              </h3>
              <ul className="mt-3 space-y-2">
                {file.covers.map((item) => (
                  <li key={item} className="max-w-measure-wide text-sm leading-relaxed text-foreground-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby={`${sectionId}-test-gaps`}>
            <h3 id={`${sectionId}-test-gaps`} className="text-sm font-medium text-foreground">
              Not covered
            </h3>
            <ul className="mt-3 space-y-2">
              {doc.testGaps.map((gap) => (
                <li key={gap} className="max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
                  {gap}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocSection>
    </div>
  );
}
