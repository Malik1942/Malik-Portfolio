import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ClusterData {
  label: string;
  position: { left: string; top: string };
  content?: string;
  items?: string[];
}

const CLUSTERS: ClusterData[] = [
  {
    label: "Who I Am",
    position: { left: "28%", top: "32%" },
    content:
      "A maker, product designer, and systems thinker. I craft experiences that bridge human intuition and digital possibility — moving between concept, design, and tangible form.",
  },
  {
    label: "What I Care About",
    position: { left: "72%", top: "28%" },
    content:
      "Design as behavior. Systems as language. I care about prototyping, meaningful interaction, and shaping products that feel inevitable rather than designed.",
  },
  {
    label: "Outside of Design",
    position: { left: "28%", top: "70%" },
    items: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
  },
  {
    label: "How I Build",
    position: { left: "72%", top: "68%" },
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
      transition={{ duration: 1, delay: 1.4 + index * 0.15, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Center dot */}
      <motion.div
        className="w-[5px] h-[5px] rounded-full bg-foreground/25"
        animate={{
          scale: hovered ? 1.8 : 1,
          opacity: hovered ? 0.7 : 0.25,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Label */}
      <motion.span
        className="text-[10px] uppercase tracking-[0.25em] text-foreground/35 whitespace-nowrap"
        animate={{ opacity: hovered ? 0.8 : 0.35 }}
        transition={{ duration: 0.5 }}
      >
        {cluster.label}
      </motion.span>

      {/* Content reveal */}
      <motion.div
        className="max-w-[220px] text-center"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 8,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: hovered ? "auto" : "none" }}
      >
        {cluster.content && (
          <p className="text-[11px] text-foreground/55 leading-[1.7] font-light">
            {cluster.content}
          </p>
        )}
        {cluster.items && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            {cluster.items.map((item) => (
              <span
                key={item}
                className="text-[11px] text-foreground/45 font-light"
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
      transition={{ duration: 0.8, delay: isVisible ? 1.0 : 0 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-foreground/30 hover:text-foreground/60 transition-colors duration-500 uppercase tracking-[0.15em] z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: isVisible ? 1.8 : 0 }}
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </motion.button>

      {/* Cluster nodes */}
      {isVisible &&
        CLUSTERS.map((cluster, i) => (
          <ClusterNode key={cluster.label} cluster={cluster} index={i} />
        ))}
    </motion.div>
  );
};

export default AboutOverlay;
