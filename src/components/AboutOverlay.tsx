import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import profileImage from "@/assets/profile-malik.jpg";

interface ClusterData {
  label: string;
  position: { left: string; top: string };
  content?: string;
  items?: string[];
}

const CLUSTERS: ClusterData[] = [
  {
    label: "Who I Am",
    position: { left: "15%", top: "28%" },
    content:
      "A maker, product designer, and systems thinker. I craft experiences that bridge human intuition and digital possibility — moving between concept, design, and tangible form.",
  },
  {
    label: "What I Care About",
    position: { left: "85%", top: "25%" },
    content:
      "Design as behavior. Systems as language. I care about prototyping, meaningful interaction, and shaping products that feel inevitable rather than designed.",
  },
  {
    label: "Outside of Design",
    position: { left: "12%", top: "78%" },
    items: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
  },
  {
    label: "How I Build",
    position: { left: "88%", top: "75%" },
    content:
      "Through making and experimentation. I prototype early, learn through craft, and believe the best ideas reveal themselves through the act of building.",
  },
];

const ClusterNode = ({
  cluster,
  index,
}: {
  cluster: ClusterData;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-3 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
      style={{ left: cluster.position.left, top: cluster.position.top }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.8 + index * 0.15, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Center dot */}
      <motion.div
        className="w-[5px] h-[5px] rounded-full bg-foreground/20"
        animate={{
          scale: hovered ? 1.8 : 1,
          opacity: hovered ? 0.6 : 0.2,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Label */}
      <motion.span
        className="text-[10px] uppercase tracking-[0.25em] text-foreground/25 whitespace-nowrap"
        animate={{ opacity: hovered ? 0.7 : 0.25 }}
        transition={{ duration: 0.5 }}
      >
        {cluster.label}
      </motion.span>

      {/* Content reveal */}
      <motion.div
        className="max-w-[200px] text-center"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 8,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: hovered ? "auto" : "none" }}
      >
        {cluster.content && (
          <p className="text-[11px] text-foreground/45 leading-[1.7] font-light">
            {cluster.content}
          </p>
        )}
        {cluster.items && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            {cluster.items.map((item) => (
              <span
                key={item}
                className="text-[11px] text-foreground/35 font-light"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

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
      transition={{ duration: 0.8, delay: isVisible ? 0.8 : 0 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-foreground/30 hover:text-foreground/60 transition-colors duration-500 uppercase tracking-[0.15em] z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: isVisible ? 2.4 : 0 }}
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </motion.button>

      {/* Identity Hero — centered */}
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-6 max-w-lg px-6">
            {/* Profile image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
            >
              {/* Glow */}
              <div className="absolute -inset-3 rounded-full bg-foreground/[0.04] blur-xl" />
              <div className="absolute -inset-1.5 rounded-full bg-foreground/[0.03] blur-md" />
              <img
                src={profileImage}
                alt="Malik Zhang"
                className="relative w-20 h-20 rounded-full object-cover object-top"
                style={{
                  boxShadow: "0 0 40px rgba(255,255,255,0.06), 0 0 80px rgba(255,255,255,0.03)",
                }}
              />
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="text-[15px] sm:text-[17px] text-foreground/80 font-light leading-[1.7] text-center tracking-wide"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
            >
              I design through making — shaping systems beyond screens.
            </motion.h2>

            {/* Subline */}
            <motion.p
              className="text-[11px] text-foreground/35 font-light uppercase tracking-[0.2em] text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
            >
              Product designer exploring behavior, interaction, and systems.
            </motion.p>
          </div>
        </div>
      )}

      {/* Cluster nodes — pushed to edges as secondary */}
      {isVisible &&
        CLUSTERS.map((cluster, i) => (
          <ClusterNode key={cluster.label} cluster={cluster} index={i} />
        ))}
    </motion.div>
  );
};

export default AboutOverlay;
