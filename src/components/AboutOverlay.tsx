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
    position: { left: "8%", top: "18%" },
    content:
      "A maker, product designer, and systems thinker. I craft experiences that bridge human intuition and digital possibility — moving between concept, design, and tangible form.",
  },
  {
    label: "What I Care About",
    position: { left: "92%", top: "15%" },
    content:
      "Design as behavior. Systems as language. I care about prototyping, meaningful interaction, and shaping products that feel inevitable rather than designed.",
  },
  {
    label: "Outside of Design",
    position: { left: "7%", top: "85%" },
    items: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
  },
  {
    label: "How I Build",
    position: { left: "93%", top: "83%" },
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

  // Determine if cluster is on the right side to flip reveal direction
  const isRight = parseFloat(cluster.position.left) > 50;

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-2.5 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
      style={{ left: cluster.position.left, top: cluster.position.top }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 2.2 + index * 0.12, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dot */}
      <motion.div
        className="w-[3px] h-[3px] rounded-full bg-foreground/10"
        animate={{ scale: hovered ? 2.5 : 1, opacity: hovered ? 0.4 : 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Label */}
      <motion.span
        className="text-[8px] uppercase tracking-[0.3em] text-foreground/15 whitespace-nowrap"
        animate={{ opacity: hovered ? 0.5 : 0.15 }}
        transition={{ duration: 0.4 }}
      >
        {cluster.label}
      </motion.span>

      {/* Hover reveal panel with backdrop */}
      <motion.div
        className={`absolute top-full mt-3 ${isRight ? "right-0" : "left-0"}`}
        style={{
          transform: isRight ? "translateX(50%)" : "translateX(-50%)",
        }}
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 8,
          scale: hovered ? 1 : 0.96,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div
          className="rounded-lg px-5 py-4 max-w-[220px] text-center"
          style={{
            pointerEvents: hovered ? "auto" : "none",
            background: "rgba(8, 8, 10, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          {cluster.content && (
            <p className="text-[11px] text-foreground/70 leading-[1.8] font-light">
              {cluster.content}
            </p>
          )}
          {cluster.items && (
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
              {cluster.items.map((item) => (
                <span key={item} className="text-[11px] text-foreground/55 font-light">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
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
      transition={{ duration: 0.8, delay: isVisible ? 0.6 : 0 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Center vignette — clears particle noise around identity */}
      {isVisible && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(8,8,10,0.5) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-foreground/25 hover:text-foreground/55 transition-colors duration-500 uppercase tracking-[0.15em] z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: isVisible ? 2.4 : 0 }}
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </motion.button>

      {/* ── Identity Core ── */}
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-6 md:gap-10 px-6">
            {/* Text — left side */}
            <div className="flex flex-col items-end text-right max-w-[360px]">
              <motion.h2
                className="text-[20px] sm:text-[24px] md:text-[28px] text-foreground/95 font-light leading-[1.45] tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              >
                I design through making — shaping systems beyond screens.
              </motion.h2>
              <motion.p
                className="text-[10px] sm:text-[11px] text-foreground/35 font-light uppercase tracking-[0.2em] mt-3"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
              >
                Product designer exploring behavior, interaction, and systems.
              </motion.p>
            </div>

            {/* Portrait — larger, dissolved edges */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 1.2, ease: "easeOut" }}
            >
              {/* Outer glow — larger spread */}
              <div
                className="absolute -inset-16 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(200,200,220,0.06) 0%, rgba(200,200,220,0.02) 40%, transparent 70%)",
                }}
              />
              <div
                className="absolute -inset-8 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(200,200,220,0.04) 0%, transparent 60%)",
                }}
              />

              {/* Image — 1.8x larger with soft dissolve */}
              <div
                className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden"
                style={{
                  maskImage: "radial-gradient(circle, black 40%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.08) 82%, transparent 92%)",
                  WebkitMaskImage: "radial-gradient(circle, black 40%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.08) 82%, transparent 92%)",
                }}
              >
                <img
                  src={profileImage}
                  alt="Malik Zhang"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Subtle ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: "inset 0 0 30px rgba(200,200,220,0.04), 0 0 60px rgba(200,200,220,0.03), 0 0 120px rgba(200,200,220,0.015)",
                }}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      {isVisible && (
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-foreground/15">Scroll</span>
          <motion.div
            className="w-px h-6 bg-foreground/10"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Cluster nodes — far edges */}
      {isVisible &&
        CLUSTERS.map((cluster, i) => (
          <ClusterNode key={cluster.label} cluster={cluster} index={i} />
        ))}
    </motion.div>
  );
};

export default AboutOverlay;
