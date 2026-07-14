import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { createPortal } from "react-dom";
import profileImage from "@/assets/profile-malik.webp";
import { ABOUT_CLUSTER_DEFS } from "@/lib/aboutClusters";

// ── Cluster data — text only, particles come from DotGrid ──
interface ClusterTextData {
  label: string;
  lines: string[];
  index: number;
}

const CLUSTER_TEXTS: ClusterTextData[] = [
  {
    label: "Who I Am",
    lines: ["AI-native designer", "Problem finder", "End-to-end builder"],
    index: 0,
  },
  {
    label: "Outside of Design",
    lines: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
    index: 1,
  },
  {
    label: "How I Build",
    lines: ["Spec-first", "Prototyping early", "Deciding where AI belongs", "Shipping end to end"],
    index: 2,
  },
  {
    label: "What I Care About",
    lines: ["Real problems over features", "AI with a purpose", "Systems as language", "Craft in the details"],
    index: 3,
  },
];

const HOVER_ZONE_SIZE = 200;

// ── Text-only cluster label (no particles — those live in DotGrid) ──
const ClusterLabel = ({ data, delay }: { data: ClusterTextData; delay: number }) => {
  const [expanded, setExpanded] = useState(false);
  // Tracks whether a mouse pointer is currently hovering — used to prevent
  // onClick from double-toggling when the user is on a pointer device.
  const mouseInsideRef = useRef(false);

  const dispatchHover = (index: number | null) => {
    window.dispatchEvent(
      new CustomEvent("cluster-hover", { detail: { index } })
    );
  };

  return (
    <motion.div
      className="absolute cursor-pointer select-none flex items-center justify-center"
      style={{
        left: `${ABOUT_CLUSTER_DEFS[data.index].rx * 100}%`,
        top: `${ABOUT_CLUSTER_DEFS[data.index].ry * 100}%`,
        width: HOVER_ZONE_SIZE,
        height: HOVER_ZONE_SIZE,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        mouseInsideRef.current = true;
        setExpanded(true);
        dispatchHover(data.index);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        mouseInsideRef.current = false;
        setExpanded(false);
        dispatchHover(null);
      }}
      onClick={() => {
        // Touch path only — mouse hover already handles show/hide
        if (mouseInsideRef.current) return;
        const next = !expanded;
        setExpanded(next);
        dispatchHover(next ? data.index : null);
      }}
    >
      {/* Default label */}
      <motion.span
        className="text-[11px] text-body uppercase tracking-[0.25em] text-foreground/69 whitespace-nowrap absolute pointer-events-none"
        animate={{
          opacity: expanded ? 0 : 1,
          scale: expanded ? 0.94 : 1,
          filter: expanded ? "blur(3px)" : "blur(0px)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {data.label}
      </motion.span>

      {/* Hover content */}
      <div className="flex flex-col items-center gap-1.5 absolute pointer-events-none">
        {data.lines.map((line, i) => (
          <motion.span
            key={line}
            className="text-[14px] text-body text-foreground/90 font-light tracking-wide whitespace-nowrap"
            initial={false}
            animate={{
              opacity: expanded ? 0.9 : 0,
              y: expanded ? 0 : 2,
              filter: expanded ? "blur(0px)" : "blur(4px)",
            }}
            transition={{
              duration: 0.22,
              delay: expanded ? i * 0.03 : 0,
              ease: "easeOut",
            }}
          >
            {line}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

// Soft vignette mask shared by the portrait in both the desktop composition and
// the mobile vertical flow.
const PORTRAIT_MASK =
  "radial-gradient(ellipse 85% 85% at 50% 45%, black 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.08) 78%, transparent 90%)";

const Portrait = ({ className }: { className: string }) => (
  <div
    className={`relative overflow-hidden ${className}`}
    style={{ borderRadius: "28px", maskImage: PORTRAIT_MASK, WebkitMaskImage: PORTRAIT_MASK }}
  >
    <img src={profileImage} alt="Malik Zhang" loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
  </div>
);

// Mobile-only: a cluster shown as a static label + its lines, stacked in normal
// flow (the desktop version is an absolutely-positioned, tap-to-expand label).
const MobileClusterBlock = ({ data }: { data: ClusterTextData }) => (
  <div className="flex flex-col items-center gap-2.5">
    <span className="text-[11px] text-body uppercase tracking-[0.25em] text-foreground/60">{data.label}</span>
    <div className="flex flex-col gap-1">
      {data.lines.map((line) => (
        <span key={line} className="text-[13px] text-body text-foreground/85 font-light tracking-wide leading-snug">
          {line}
        </span>
      ))}
    </div>
  </div>
);

// ── About Overlay ──
interface AboutOverlayProps {
  isVisible: boolean;
  onBack: () => void;
}

const AboutOverlay = ({ isVisible, onBack }: AboutOverlayProps) => {
  return (
    <>
      {/* Back — mirrors the case-study pattern: in the page flow at top-left,
          below the site header, aligned to the header's padding. `absolute`
          (not fixed) so it scrolls away with the hero; z-40 keeps it beneath
          the z-50 header, so it slides under the bar as you scroll. A matching
          "Back to home" exit lives at the end of AboutDeepContent. */}
      {createPortal(
        <motion.button
          onClick={onBack}
          aria-label="Back to home"
          className="group absolute top-24 md:top-28 left-8 md:left-16 lg:left-24 flex items-center gap-2 min-h-[44px] px-1 text-sm text-body text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded transition-colors duration-200 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isVisible ? 0.7 : 0 }}
          style={{ pointerEvents: isVisible ? "auto" : "none" }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back
        </motion.button>,
        document.body
      )}

      <motion.div
        className="relative md:absolute md:inset-0 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: isVisible ? 0.6 : 0 }}
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        {/* ── Desktop / tablet (md+): the original absolutely-composed layout ──
            Identity core centered, cluster labels at their constellation
            coordinates, scroll indicator pinned to the bottom. Unchanged. */}
        <div className="hidden md:block">
        {/* Identity Core — clickable to return to homepage */}
        {isVisible && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.button
              type="button"
              aria-label="Return to homepage"
              onClick={onBack}
              className="flex flex-col-reverse sm:flex-row items-center gap-5 sm:gap-6 md:gap-8 px-6 pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 rounded-xl"
              whileHover={{ scale: 1.012, opacity: 0.88 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right max-w-[380px]">
              <motion.h2
                className="text-[20px] sm:text-[26px] md:text-[30px] text-display text-foreground font-normal leading-[1.5] tracking-wide"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              >
                <span className="block">
                  I start with the real{" "}
                  <span className="text-[1.35em] font-semibold text-foreground tracking-tight">PROBLEM</span>
                </span>
                <span className="block">
                  and build the answer{" "}
                  <span className="text-[1.35em] font-semibold text-foreground tracking-tight">END TO END</span>
                </span>
              </motion.h2>
              <motion.p
                className="text-[10px] text-body text-foreground/44 font-light uppercase tracking-[0.2em] leading-[1.6] mt-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
              >
                <span className="block">AI-native product designer.</span>
                <span className="block">Problem to shipped product.</span>
              </motion.p>
            </div>

            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 1.1, ease: "easeOut" }}
            >
              <Portrait className="w-32 h-40 sm:w-44 sm:h-56 md:w-60 md:h-72" />
            </motion.div>
          </motion.button>
        </div>
      )}

      {/* Scroll indicator */}
      {isVisible && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <span className="text-[11px] text-body uppercase tracking-[0.3em] text-foreground/42">Scroll</span>
          <motion.span
            className="text-[28px] text-body text-foreground leading-none select-none"
            style={{ display: "inline-block", transform: "scaleX(1.6)", marginTop: "-2px" }}
            animate={{ y: [0, 4, 0], opacity: [0.45, 0.70, 0.45] }}
            transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
          >
            ⌄
          </motion.span>
        </motion.div>
      )}

        {/* Text-only cluster labels (particles come from DotGrid canvas) */}
        {isVisible &&
          CLUSTER_TEXTS.map((cluster, i) => (
            <ClusterLabel key={cluster.label} data={cluster} delay={1.0 + i * 0.1} />
          ))}
        </div>

        {/* ── Mobile (< md): a stable vertical flow ──
            No absolute positioning for content, so nothing overlaps. The section
            grows to fit this (see HeroSection), and the DotGrid particles stay as
            an absolute background behind it. Order mirrors the spec: labels →
            portrait → statement → descriptor → interests → scroll. */}
        {isVisible && (
          <div
            className="md:hidden relative z-10 flex flex-col items-center text-center px-6 pt-40"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 3.5rem)" }}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 w-full max-w-[420px] mb-12">
              <MobileClusterBlock data={CLUSTER_TEXTS[0]} />
              <MobileClusterBlock data={CLUSTER_TEXTS[2]} />
            </div>

            <Portrait className="w-40 h-52 mb-9" />

            <h2 className="text-[24px] text-display text-foreground font-normal leading-[1.42] tracking-wide max-w-[340px]">
              <span className="block">
                I start with the real{" "}
                <span className="text-[1.3em] font-semibold text-foreground tracking-tight">PROBLEM</span>
              </span>
              <span className="block">
                and build the answer{" "}
                <span className="text-[1.3em] font-semibold text-foreground tracking-tight">END TO END</span>
              </span>
            </h2>

            <p className="mt-5 text-[10px] text-body text-foreground/44 font-light uppercase tracking-[0.2em] leading-[1.7]">
              <span className="block">AI-native product designer.</span>
              <span className="block">Problem to shipped product.</span>
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 w-full max-w-[420px] mt-14">
              <MobileClusterBlock data={CLUSTER_TEXTS[1]} />
              <MobileClusterBlock data={CLUSTER_TEXTS[3]} />
            </div>

            <div className="mt-14 flex flex-col items-center gap-0">
              <span className="text-[11px] text-body uppercase tracking-[0.3em] text-foreground/42">Scroll</span>
              <motion.span
                className="text-[28px] text-body text-foreground leading-none select-none"
                style={{ display: "inline-block", transform: "scaleX(1.6)", marginTop: "-2px" }}
                animate={{ y: [0, 4, 0], opacity: [0.45, 0.7, 0.45] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
              >
                ⌄
              </motion.span>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AboutOverlay;
