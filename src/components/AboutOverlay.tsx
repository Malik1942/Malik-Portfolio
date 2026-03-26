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
    position: { left: "12%", top: "22%" },
    content:
      "A maker, product designer, and systems thinker. I craft experiences that bridge human intuition and digital possibility — moving between concept, design, and tangible form.",
  },
  {
    label: "What I Care About",
    position: { left: "88%", top: "18%" },
    content:
      "Design as behavior. Systems as language. I care about prototyping, meaningful interaction, and shaping products that feel inevitable rather than designed.",
  },
  {
    label: "Outside of Design",
    position: { left: "10%", top: "82%" },
    items: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
  },
  {
    label: "How I Build",
    position: { left: "90%", top: "80%" },
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
      className="absolute flex flex-col items-center gap-2.5 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
      style={{ left: cluster.position.left, top: cluster.position.top }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 2.0 + index * 0.12, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Center dot */}
      <motion.div
        className="w-[4px] h-[4px] rounded-full bg-foreground/15"
        animate={{
          scale: hovered ? 2 : 1,
          opacity: hovered ? 0.5 : 0.15,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Label */}
      <motion.span
        className="text-[9px] uppercase tracking-[0.3em] text-foreground/20 whitespace-nowrap"
        animate={{ opacity: hovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {cluster.label}
      </motion.span>

      {/* Content reveal */}
      <motion.div
        className="max-w-[190px] text-center"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 6,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: hovered ? "auto" : "none" }}
      >
        {cluster.content && (
          <p className="text-[10px] text-foreground/40 leading-[1.7] font-light">
            {cluster.content}
          </p>
        )}
        {cluster.items && (
          <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1">
            {cluster.items.map((item) => (
              <span
                key={item}
                className="text-[10px] text-foreground/30 font-light"
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
      transition={{ duration: 0.8, delay: isVisible ? 0.6 : 0 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
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
          <div className="flex items-center gap-8 md:gap-12 px-6">
            {/* Text — left side */}
            <div className="flex flex-col items-end text-right max-w-[340px]">
              <motion.h2
                className="text-[18px] sm:text-[22px] md:text-[26px] text-foreground/90 font-light leading-[1.5] tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              >
                I design through making — shaping systems beyond screens.
              </motion.h2>
              <motion.p
                className="text-[10px] sm:text-[11px] text-foreground/30 font-light uppercase tracking-[0.2em] mt-4"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
              >
                Product designer exploring behavior, interaction, and systems.
              </motion.p>
            </div>

            {/* Portrait — right side, particle-integrated */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 1.2, ease: "easeOut" }}
            >
              {/* Outer glow layers */}
              <div className="absolute -inset-8 rounded-full opacity-30"
                style={{
                  background: "radial-gradient(circle, rgba(200,200,220,0.08) 0%, transparent 70%)",
                }}
              />
              <div className="absolute -inset-4 rounded-full opacity-50"
                style={{
                  background: "radial-gradient(circle, rgba(200,200,220,0.05) 0%, transparent 60%)",
                }}
              />
              
              {/* Image with soft dissolving edge */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden"
                style={{
                  maskImage: "radial-gradient(circle, black 45%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 75%, transparent 90%)",
                  WebkitMaskImage: "radial-gradient(circle, black 45%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 75%, transparent 90%)",
                }}
              >
                <img
                  src={profileImage}
                  alt="Malik Zhang"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Inner ring hint */}
              <div className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: "inset 0 0 20px rgba(200,200,220,0.06), 0 0 40px rgba(200,200,220,0.04)",
                }}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Cluster nodes — far edges, dimmed as secondary */}
      {isVisible &&
        CLUSTERS.map((cluster, i) => (
          <ClusterNode key={cluster.label} cluster={cluster} index={i} />
        ))}
    </motion.div>
  );
};

export default AboutOverlay;
