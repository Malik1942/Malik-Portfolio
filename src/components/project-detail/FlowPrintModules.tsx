import {
  AlertCircle,
  BookOpen,
  Gauge,
  Layers,
  Route,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import flowprintWelcomeUi from "@/assets/flowprint-welcome-ui.webp";
import flowprintHomeUi from "@/assets/flowprint-home-ui.webp";
import flowprintFinishedUi from "@/assets/flowprint-finished-ui.webp";
import { CardGrid, Chips, ModuleCard, PullQuote, type GridItem } from "./MotiModules";
import { noOrphan } from "@/lib/noOrphan";

const highlights = [
  "First-time vs Pro fork",
  "Target setup ~1 hr → ~15 min",
  "Filament as a lesson, not a spec",
  "Auto-setting for print one",
  "Monitoring that names the next step",
];

const artifacts = [
  {
    src: flowprintWelcomeUi,
    alt: "FlowPrint welcome screen asking how experienced you are with 3D printing, with First time user and Pro user",
    caption: "The only fork: first-time walks setup, Pro goes home",
  },
  {
    src: flowprintHomeUi,
    alt: "FlowPrint home on the printer screen: the machine in view, Tap to Start Printing, AMS spools, and head temperature",
    caption: "Home is the idle machine, not a dashboard of parts",
  },
  {
    src: flowprintFinishedUi,
    alt: "FlowPrint finished-printing screen with a green printed bust and the title Finished Printing",
    caption: "The first print ends in a part, then a two-card summary",
  },
];

function FlowPrintArtifact({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      <figcaption className="mt-caption text-base md:text-xl text-foreground text-center leading-relaxed">
        {noOrphan(caption)}
      </figcaption>
    </figure>
  );
}

export function FlowPrintHighlights() {
  return (
    <div className="flex flex-col gap-stack">
      <Chips items={highlights} />
      <PullQuote>The first print has to succeed, not just start.</PullQuote>
      <div className="flex flex-col gap-12 md:gap-16">
        {artifacts.map((a) => (
          <FlowPrintArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

const findings: GridItem[] = [
  {
    num: "01",
    title: "The Hour Before the First Layer",
    desc: "Wi-Fi, leveling, firmware, and a box of parts. Rookies described setup as a second job they did not sign up for.",
    icon: Timer,
    accent: "violet",
  },
  {
    num: "02",
    title: "Vocabulary as a Gate",
    desc: "Layer height, infill, supports, flow. The first print asked them to speak shop before they had a reason to care.",
    icon: BookOpen,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Material as a Guess",
    desc: "PLA, PETG, ABS, TPU, PC. The spool does not explain itself, and picking wrong is how the first print warps or fails.",
    icon: Layers,
    accent: "slate",
  },
  {
    num: "04",
    title: "Errors With No Next Step",
    desc: "When something broke, the screen named a sensor or a code. The question people actually had was what do I do now.",
    icon: AlertCircle,
    accent: "violet",
  },
  {
    num: "05",
    title: "Two Screens, One Engineer Voice",
    desc: "First-time owners already bounce between a phone app and a machine screen. Both talk in nozzles and percentages. Neither is written for the first hour.",
    icon: Smartphone,
    accent: "emerald",
  },
];

export function FlowPrintFindings() {
  return (
    <CardGrid
      items={findings}
      header="What First-Time Owners Kept Hitting"
      colsClass="grid-cols-1 sm:grid-cols-2 [&>*:last-child]:sm:col-span-2"
    />
  );
}

const requirements: GridItem[] = [
  {
    num: "01",
    title: "One Job Per Screen",
    desc: "Network, then filament, then a model. Never a control panel on day one.",
    icon: Sparkles,
    accent: "violet",
  },
  {
    num: "02",
    title: "Ask Experience Once",
    desc: "First-time walks setup. Pro skips it. The fork is the product, not a settings buried later.",
    icon: Route,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Teach the Material",
    desc: "Best for, pros, watch out. A lesson, not a filament chemistry sheet.",
    icon: Layers,
    accent: "slate",
  },
  {
    num: "04",
    title: "Auto-Setting for Print One",
    desc: "Quality as Extra Fine. No layer height. The slicer stays offstage.",
    icon: Gauge,
    accent: "violet",
  },
  {
    num: "05",
    title: "Monitoring That Reassures",
    desc: "Progress, then a part, then four facts. Not a live log of temperatures.",
    icon: ShieldCheck,
    accent: "emerald",
  },
];

export function FlowPrintRequirements() {
  return (
    <CardGrid
      items={requirements}
      header="Design Requirements"
      colsClass="grid-cols-1 sm:grid-cols-2 [&>*:last-child]:sm:col-span-2"
    />
  );
}

const firstLane = ["Welcome", "Network", "Filament lesson", "Load slot", "Home"];
const proLane = ["Welcome", "Home"];
const sharedLane = ["Models", "Auto Setting / Prepare", "Start print", "Watch it finish", "Summary"];

function Lane({
  title,
  steps,
  icon: Icon,
}: {
  title: string;
  steps: string[];
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">
      <div className="flex items-center justify-between">
        <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">
          {title}
        </p>
        <Icon aria-hidden="true" className="w-4 h-4 text-accent-violet" strokeWidth={1.4} />
      </div>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">
            <span className="text-caption font-mono tabular-nums text-accent-violet/60 w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground">{noOrphan(step)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function FlowPrintLanes() {
  return (
    <ModuleCard header="The Target Journey">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider">
        <Lane title="First time" steps={firstLane} icon={Wifi} />
        <Lane title="Pro" steps={proLane} icon={Gauge} />
      </div>
      <div className="border-t border-case-study-module-divider px-6 py-7 md:px-7 md:py-8">
        <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary mb-5">
          Shared print path
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sharedLane.map((step, i) => (
            <li key={step} className="flex flex-col gap-2">
              <span className="text-caption font-mono tabular-nums text-accent-emerald/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm md:text-base font-medium text-foreground leading-snug">
                {noOrphan(step)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </ModuleCard>
  );
}

function VersionBlock({
  tag,
  title,
  points,
}: {
  tag: string;
  title: string;
  points: { label: string; text: string }[];
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-case-study-module-border bg-surface-inset">
      <div className="flex items-baseline gap-4 px-6 py-6 md:px-8 md:py-7 border-b border-case-study-module-divider">
        <span className="text-caption font-mono tabular-nums text-accent-violet/70">{tag}</span>
        <p className="text-xl font-medium text-foreground leading-snug">{noOrphan(title)}</p>
      </div>
      <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-7">
        {points.map((pt) => (
          <div key={pt.label}>
            <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono mb-1.5">
              {pt.label}
            </p>
            <p className="text-sm md:text-base font-light leading-relaxed text-foreground-lead">
              {noOrphan(pt.text)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlowPrintIterations() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <VersionBlock
        tag="V2"
        title="The Machine Screen as a Dashboard"
        points={[
          {
            label: "What I Tried",
            text: "Lean on the printer: a photo of the chassis, a rail of home / nozzle / files / settings.",
          },
          {
            label: "What Broke",
            text: "The photo helped. The chrome was still telemetry. First-time owners do not need a nozzle icon before they have printed.",
          },
        ]}
      />
      <VersionBlock
        tag="V3"
        title="Machine Only, Graphic Enough for a Beginner"
        points={[
          {
            label: "The Shift",
            text: "Drop the phone. Design the printer's own 16:9 glass as the first-print surface: a graphic, beginner-facing HMI instead of a shop diagram.",
          },
          {
            label: "What Held",
            text: "Welcome asks experience once. Setup is Wi-Fi and a filament lesson. Auto Setting, not a slicer. Monitoring that ends in a part, not a log.",
          },
        ]}
      />
    </div>
  );
}

const learnings: GridItem[] = [
  {
    num: "01",
    title: "Hardware UX Is Failure-First",
    desc: "A first print that starts and then fails teaches the wrong lesson. Design the recovery path as the default, and treat success as something the session still has to earn.",
    icon: ShieldCheck,
    accent: "violet",
  },
  {
    num: "02",
    title: "Renaming the Shop Is Not Onboarding",
    desc: "Quality and Strength were a vocabulary patch on a control panel. The real cut was taking the slicer off the first-print path.",
    icon: BookOpen,
    accent: "emerald",
  },
  {
    num: "03",
    title: "The First Success Is the Retention Mechanic",
    desc: "Quiet confidence after a finished part is what keeps a rookie. Features they cannot reach until print two do not matter if print one never happens.",
    icon: Sparkles,
    accent: "slate",
  },
];

export function FlowPrintLearnings() {
  return <CardGrid items={learnings} colsClass="grid-cols-1 sm:grid-cols-3" />;
}
