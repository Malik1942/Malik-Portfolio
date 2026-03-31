import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import profileImage from "@/assets/profile-malik.jpg";

// ── Cluster data — text only, particles come from DotGrid ──
interface ClusterTextData {
  label: string;
  lines: string[];
  // CSS position matching DotGrid CLUSTER_DEFS ratios
  position: { left?: string; right?: string; top?: string; bottom?: string };
  index: number;
}

const CLUSTER_TEXTS: ClusterTextData[] = [
  {
    label: "Who I Am",
    lines: ["Maker", "Product designer", "Systems thinker"],
    position: { left: "28%", top: "22%" },
    index: 0,
  },
  {
    label: "Outside of Design",
    lines: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
    position: { left: "78%", top: "20%" },
    index: 1,
  },
  {
    label: "How I Build",
    lines: ["Experimentation", "Prototyping early", "Learning through craft"],
    position: { left: "24%", top: "78%" },
    index: 2,
  },
  {
    label: "What I Care About",
    lines: ["Design as behavior", "Systems as language", "Meaningful interaction", "Prototyping to think"],
    position: { left: "80%", top: "74%" },
    index: 3,
  },
];

const HOVER_ZONE_SIZE = 200;

// ── Text-only cluster label (no particles — those live in DotGrid) ──
const ClusterLabel = ({ data, delay }: { data: ClusterTextData; delay: number }) => {
  const [hovered, setHovered] = useState(false);

  const dispatchHover = (index: number | null) => {
    window.dispatchEvent(
      new CustomEvent("cluster-hover", { detail: { index } })
    );
  };

  return (
    <motion.div
      className="absolute cursor-default select-none flex items-center justify-center"
      style={{
        ...data.position,
        width: HOVER_ZONE_SIZE,
        height: HOVER_ZONE_SIZE,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      onMouseEnter={() => {
        setHovered(true);
        dispatchHover(data.index);
      }}
      onMouseLeave={() => {
        setHovered(false);
        dispatchHover(null);
      }}
    >
      {/* Default label */}
      <motion.span
        className="text-[11px] uppercase tracking-[0.25em] text-foreground/60 whitespace-nowrap absolute pointer-events-none"
        animate={{
          opacity: hovered ? 0 : 0.6,
          scale: hovered ? 0.94 : 1,
          filter: hovered ? "blur(3px)" : "blur(0px)",
        }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        {data.label}
      </motion.span>

      {/* Hover content */}
      <div className="flex flex-col items-center gap-1.5 absolute pointer-events-none">
        {data.lines.map((line, i) => (
          <motion.span
            key={line}
            className="text-[11px] text-foreground/90 font-light tracking-wide whitespace-nowrap"
            initial={false}
            animate={{
              opacity: hovered ? 0.9 : 0,
              y: hovered ? 0 : 2,
              filter: hovered ? "blur(0px)" : "blur(4px)",
            }}
            transition={{
              duration: 0.38,
              delay: hovered ? 0.1 + i * 0.05 : 0,
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

// ── About Overlay ──
interface AboutOverlayProps {
  isVisible: boolean;
  onBack: () => void;
}

const AboutOverlay = ({ isVisible, onBack }: AboutOverlayProps) => {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, delay: isVisible ? 0.6 : 0 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-foreground/20 hover:text-foreground/50 transition-colors duration-500 uppercase tracking-[0.15em] z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: isVisible ? 2.4 : 0 }}
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </motion.button>

      {/* Identity Core */}
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-6 md:gap-8 px-6">
            <div className="flex flex-col items-end text-right max-w-[380px]">
              <motion.h2
                className="text-[22px] sm:text-[26px] md:text-[30px] text-foreground font-normal leading-[1.4] tracking-wide"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              >
                I design through making — shaping systems beyond screens.
              </motion.h2>
              <motion.p
                className="text-[10px] text-foreground/30 font-light uppercase tracking-[0.2em] mt-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
              >
                Product designer exploring behavior, interaction, and systems.
              </motion.p>
            </div>

            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 1.1, ease: "easeOut" }}
            >
              <div
                className="relative w-44 h-56 sm:w-52 sm:h-64 md:w-60 md:h-72 overflow-hidden"
                style={{
                  borderRadius: "28px",
                  maskImage:
                    "radial-gradient(ellipse 85% 85% at 50% 45%, black 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.08) 78%, transparent 90%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 85% 85% at 50% 45%, black 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.08) 78%, transparent 90%)",
                }}
              >
                <img src={profileImage} alt="Malik Zhang" className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      {isVisible && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-foreground/12">Scroll</span>
          <motion.div
            className="w-px h-5 bg-foreground/8"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.06, 0.15, 0.06] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Text-only cluster labels (particles come from DotGrid canvas) */}
      {isVisible &&
        CLUSTER_TEXTS.map((cluster, i) => (
          <ClusterLabel key={cluster.label} data={cluster} delay={2.0 + i * 0.15} />
        ))}
    </motion.div>
  );
};

export default AboutOverlay;
