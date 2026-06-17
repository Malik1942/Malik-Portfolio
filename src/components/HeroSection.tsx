import { useState, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DotGrid from "./DotGrid";
import AboutOverlay from "./AboutOverlay";
import { motion } from "framer-motion";
import { scrollToSectionNavTarget } from "@/lib/scrollToTarget";
import { usePageLoaded } from "@/hooks/usePageLoaded";

interface HeroSectionProps {
  isAboutOpen: boolean;
  onAboutClick: () => void;
  onAboutBack: () => void;
}

// ── Terminal one-liner ──────────────────────────────────────────────────────
const TERMINAL_TEXT =
  "AI-native product designer. I look past the obvious symptom to the real problem, then build real products that turn messy human intent into clear, steerable tools.";

// The leading word "AI-native" is a subtle Easter-egg link to the Moti project.
// It inherits the subtitle's exact styling and only reveals itself on hover/focus,
// navigating via the same router a project card uses (→ /project/moti).
const ACCENT_WORD = "AI-native";

const MotiLink = ({ children }: { children: ReactNode }) => (
  <Link
    to="/project/moti"
    aria-label="Go to Moti, my AI-native iOS app"
    className="pointer-events-auto cursor-pointer rounded-sm text-inherit no-underline transition-colors duration-300 hover:text-dot-red focus-visible:text-dot-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dot-red/60"
  >
    {children}
  </Link>
);

const TerminalOneLiner = ({ isVisible }: { isVisible: boolean }) => {
  const [len, setLen] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter — resets and retypes each time isVisible flips true
  useEffect(() => {
    if (!isVisible) {
      setLen(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    let cancelled = false;
    let pos = 0;

    const type = () => {
      if (cancelled || pos >= TERMINAL_TEXT.length) return;
      const ch = TERMINAL_TEXT[pos];
      // Organic pacing: pause longer at punctuation, vary base speed slightly
      const delay =
        ch === "," || ch === "." ? 130
        : ch === " " ? 18
        : 24 + Math.random() * 22;
      timerRef.current = setTimeout(() => {
        if (!cancelled) {
          pos++;
          setLen(pos);
          type();
        }
      }, delay);
    };

    // Short hold after the parent fade-in before typing begins
    timerRef.current = setTimeout(type, 500);
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible]);

  // Blinking block cursor — snaps on, fades off
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 560);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-baseline gap-[8px] md:gap-[12px] text-[11px] md:text-[18px] text-mono tracking-[0.04em] leading-[1.65] max-w-[320px] md:max-w-[640px] px-6">
      {/* Prompt glyph — items-baseline keeps it on the first text line */}
      <span className="text-foreground/56 shrink-0 select-none">{'>'}</span>
      {/* Typed text + cursor */}
      <span className="text-foreground/64 text-left">
        <MotiLink>{TERMINAL_TEXT.slice(0, Math.min(len, ACCENT_WORD.length))}</MotiLink>
        {TERMINAL_TEXT.slice(ACCENT_WORD.length, len)}
        <span
          className="inline-block align-middle ml-[2px]"
          style={{
            width: "0.5em",
            height: "1.05em",
            background: "rgba(231,230,228,0.64)",
            opacity: cursorOn ? 1 : 0,
            transition: cursorOn ? "none" : "opacity 0.1s",
          }}
        />
      </span>
    </div>
  );
};

// ── Hero section ────────────────────────────────────────────────────────────
const HeroSection = ({ isAboutOpen, onAboutClick, onAboutBack }: HeroSectionProps) => {
  const isLoaded = usePageLoaded();

  const handleSectionNavClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    scrollToSectionNavTarget(sectionId);
  };

  const terminalVisible = isLoaded && !isAboutOpen;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      <DotGrid aboutMode={isAboutOpen} onNameClick={onAboutClick} />
      <AboutOverlay isVisible={isAboutOpen} onBack={onAboutBack} />

      {/* Desktop: terminal one-liner (md+) */}
      <motion.div
        className="absolute left-0 right-0 hidden md:flex justify-center z-10 pointer-events-none"
        style={{ top: "calc(45vh + min(7.15vw, 73px) + 20px)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: terminalVisible ? 1 : 0,
          y: terminalVisible ? 0 : 8,
        }}
        transition={{ duration: 0.7, delay: isAboutOpen ? 0 : isLoaded ? 1.0 : 0 }}
      >
        <TerminalOneLiner isVisible={terminalVisible} />
      </motion.div>

      {/* Mobile: clean description (< md) */}
      <motion.div
        className="absolute left-0 right-0 flex md:hidden justify-center z-10 pointer-events-none"
        style={{ top: "calc(40vh + min(6.5vw, 66px) + 48px)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: terminalVisible ? 1 : 0,
          y: terminalVisible ? 0 : 8,
        }}
        transition={{ duration: 0.7, delay: isAboutOpen ? 0 : isLoaded ? 1.2 : 0 }}
      >
        <p className="text-[15px] text-foreground/68 font-light text-body leading-[1.55] max-w-[320px] text-center px-6">
          <MotiLink>{ACCENT_WORD}</MotiLink>{TERMINAL_TEXT.slice(ACCENT_WORD.length)}
        </p>
      </motion.div>

      {/* Top header */}
      <motion.div
        data-hero-header
        className="absolute top-0 left-0 right-0 px-6 md:px-16 lg:px-24 pt-7 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: terminalVisible ? 1 : 0,
          y: terminalVisible ? 0 : -20,
        }}
        transition={{ duration: 0.6, delay: isAboutOpen ? 0 : isLoaded ? 0.8 : 0 }}
        style={{ pointerEvents: isAboutOpen ? "none" : "auto" }}
      >
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">

          {/* Left — identity */}
          <div className="animate-fade-up delay-3">
            <p className="text-[15px] uppercase tracking-[0.18em] text-foreground/72 text-body font-medium mb-2">
              Product Designer
            </p>
            <p className="text-[12px] text-foreground/44 tracking-[0.06em] text-body">
              HARDWARE · AI · SPATIAL · SYSTEMS
            </p>
          </div>

          {/* Center — nav */}
          <nav className="flex items-center gap-x-8 gap-y-2 text-[16px] text-foreground/72 text-body animate-fade-up delay-4 justify-self-center">
            <a
              href="#projects"
              className="nav-link hover:text-foreground transition-colors duration-500"
              onClick={(event) => handleSectionNavClick(event, "projects")}
            >
              Selected Work
            </a>
            <a
              href="#ai-projects"
              className="nav-link hover:text-foreground transition-colors duration-500"
              onClick={(event) => handleSectionNavClick(event, "ai-projects")}
            >
              AI Explorations
            </a>
            <a
              href="#about"
              className="nav-link hover:text-foreground transition-colors duration-500"
              onClick={(e) => {
                e.preventDefault();
                onAboutClick();
              }}
            >
              About
            </a>
            <a href="/resume" className="nav-link hover:text-foreground transition-colors duration-500">
              Resume
            </a>
          </nav>

          {/* Right — intentionally empty to keep nav centered */}
          <div />
        </div>

        {/* Mobile — simple stack */}
        <div className="flex flex-col gap-5 md:hidden">
          <div className="animate-fade-up delay-3">
            <p className="text-[15px] uppercase tracking-[0.18em] text-foreground/72 text-body font-medium mb-2">
              Product Designer
            </p>
            <p className="text-[12px] text-foreground/44 tracking-[0.06em] text-body">
              HARDWARE · AI · SPATIAL · SYSTEMS
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[16px] text-foreground/72 text-body animate-fade-up delay-4">
            <a href="#projects" className="nav-link hover:text-foreground transition-colors duration-500" onClick={(e) => handleSectionNavClick(e, "projects")}>Selected Work</a>
            <a href="#ai-projects" className="nav-link hover:text-foreground transition-colors duration-500" onClick={(e) => handleSectionNavClick(e, "ai-projects")}>AI Explorations</a>
            <a href="#about" className="nav-link hover:text-foreground transition-colors duration-500" onClick={(e) => { e.preventDefault(); onAboutClick(); }}>About</a>
            <a href="/resume" className="nav-link hover:text-foreground transition-colors duration-500">Resume</a>
          </nav>
        </div>

        <div className="h-px bg-border/40 mt-5 animate-line-reveal delay-3" />
      </motion.div>

      {/* Scroll indicator — mirrors the About page indicator (see AboutOverlay.tsx).
          Absolute + bottom-center so it never reflows or overlaps the hero content.
          Made clickable here (the About version is decorative): smooth-scrolls to the
          projects section via the same anchor mechanism the nav links use. */}
      {!isAboutOpen && (
        <motion.button
          type="button"
          aria-label="Scroll to projects"
          onClick={() => scrollToSectionNavTarget("projects")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-10 cursor-pointer appearance-none bg-transparent border-0 p-0"
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
        </motion.button>
      )}
    </section>
  );
};

export default HeroSection;
