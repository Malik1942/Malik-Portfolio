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
        className="text-label uppercase tracking-eyebrow text-foreground/72 whitespace-nowrap absolute pointer-events-none"
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
            className="text-sm text-foreground font-light whitespace-nowrap"
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
          className="group absolute top-24 md:top-28 left-8 md:left-16 lg:left-24 flex items-center gap-2 min-h-11 px-1 text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm transition-colors duration-200 z-40"
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
        className="absolute inset-0 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: isVisible ? 0.6 : 0 }}
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        {/* ── All sizes: the absolutely-composed constellation layout ──
            Identity core centered, cluster labels at their constellation
            coordinates (locked to the DotGrid particle clusters), scroll
            indicator pinned to the bottom. On touch, labels expand on tap. */}
        <div>
        {/* Identity Core — clickable to return to homepage */}
        {isVisible && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.button
              type="button"
              aria-label="Return to homepage"
              onClick={onBack}
              className="flex flex-col-reverse sm:flex-row items-center gap-5 sm:gap-6 md:gap-8 px-6 pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 rounded-2xl"
              whileHover={{ scale: 1.012, opacity: 0.88 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right max-w-[380px]">
              <motion.h2
                className="font-display text-xl sm:text-title text-foreground font-normal leading-snug tracking-tight"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              >
                <span className="block">
                  I start with the real{" "}
                  <span className="text-[1.35em] font-semibold text-foreground">PROBLEM</span>
                </span>
                <span className="block">
                  and build the answer{" "}
                  <span className="text-[1.35em] font-semibold text-foreground">END TO END</span>
                </span>
              </motion.h2>
            </div>

            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 1.1, ease: "easeOut" }}
            >
              <Portrait className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72" />
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
          <span className="text-label uppercase tracking-eyebrow text-foreground/55">Scroll</span>
          <motion.span
            className="font-display text-title text-foreground leading-none select-none"
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

      </motion.div>
    </>
  );
};

export default AboutOverlay;
