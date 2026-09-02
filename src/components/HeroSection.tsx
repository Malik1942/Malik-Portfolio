import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DotGrid from "./DotGrid";
import AboutOverlay from "./AboutOverlay";
import { SiteHeader } from "./SiteHeader";
import { motion, useReducedMotion } from "framer-motion";
import { scrollToSectionNavTarget } from "@/lib/scrollToTarget";
import { usePageLoaded } from "@/hooks/usePageLoaded";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { SECTIONS } from "@/lib/sections";

interface HeroSectionProps {
  isAboutOpen: boolean;
  onAboutClick: () => void;
  onAboutBack: () => void;
  // Header nav — close About (if open) and scroll to the section with this DOM id.
  onSectionClick: (sectionId: string) => void;
}

// ── Terminal one-liner ──────────────────────────────────────────────────────
const TERMINAL_TEXT =
  "AI-native product designer. I find the real problem, decide where AI belongs, and build it end to end.";

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
    <div className="flex items-baseline gap-2 md:gap-3 text-label md:text-xl font-mono leading-relaxed max-w-[320px] md:max-w-[640px] px-6">
      {/* Prompt glyph — items-baseline keeps it on the first text line */}
      <span className="text-foreground/55 shrink-0 select-none">{'>'}</span>
      {/* Typed text + cursor */}
      <span className="text-foreground/72 text-left">
        <MotiLink>{TERMINAL_TEXT.slice(0, Math.min(len, ACCENT_WORD.length))}</MotiLink>
        {TERMINAL_TEXT.slice(ACCENT_WORD.length, len)}
        <span
          className="inline-block align-middle ml-0.5"
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
const HeroSection = ({ isAboutOpen, onAboutClick, onAboutBack, onSectionClick }: HeroSectionProps) => {
  const isLoaded = usePageLoaded();
  const shouldReduceMotion = useReducedMotion();
  // Direction-aware header: hide on scroll-down, reveal on scroll-up. Suspended
  // under reduced-motion (header stays put).
  const scrollHidden = useHideOnScroll();
  const headerTuckedAway = !shouldReduceMotion && scrollHidden;
  const headerInert = headerTuckedAway;

  // Hero body (name + terminal) hides while About is open; the header stays so
  // the site nav is present on the About view too.
  const terminalVisible = isLoaded && !isAboutOpen;
  const headerVisible = isLoaded;

  return (
    // Mobile + About open: let the section grow past the viewport so the About
    // hero content flows vertically instead of overlapping inside a fixed 100vh.
    // Everything else (desktop, and the non-About hero) keeps the exact h-screen.
    <section
      className={`relative w-full overflow-hidden bg-background ${
        isAboutOpen ? "min-h-[100svh] md:h-screen" : "h-screen"
      }`}
    >
      {/* Accessible page heading — the visible name is canvas pixels (aria-hidden). */}
      <h1 className="sr-only">Malik Zhang — Product Designer</h1>
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

      {/* Mobile: clean description (< md). Anchored to the name's own geometry
          so the gap under it is the same on every phone: DotGrid draws the name
          centred at 45vh at a font size of 13.2vw, and its ink (with the g
          descender) reaches ~0.27em below that centre, i.e. ~3.5vw. The old
          40vh anchor made the gap shrink as phones got taller (30px on an SE,
          15px on a Pro Max). */}
      <motion.div
        className="absolute left-0 right-0 flex md:hidden justify-center z-10 pointer-events-none"
        style={{ top: "calc(45vh + 3.5vw + 24px)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: terminalVisible ? 1 : 0,
          y: terminalVisible ? 0 : 8,
        }}
        transition={{ duration: 0.7, delay: isAboutOpen ? 0 : isLoaded ? 1.2 : 0 }}
      >
        <p className="text-base text-foreground/72 font-light leading-normal max-w-[340px] text-center px-6">
          <MotiLink>{ACCENT_WORD}</MotiLink>{TERMINAL_TEXT.slice(ACCENT_WORD.length)}
        </p>
      </motion.div>

      {/* Header — the shared site nav. Stays visible on the About view too; its
          links close About (if open) and scroll to the matching section. */}
      <SiteHeader
        hidden={headerTuckedAway}
        inert={headerInert}
        shouldReduceMotion={shouldReduceMotion}
        entranceVisible={headerVisible}
        entranceDelay={isLoaded ? 0.8 : 0}
        onSection={onSectionClick}
        onAbout={onAboutClick}
        onLogoClick={onAboutBack}
      />

      {/* Scroll indicator — mirrors the About page indicator (see AboutOverlay.tsx).
          Absolute + bottom-center so it never reflows or overlaps the hero content.
          Made clickable here (the About version is decorative): smooth-scrolls to the
          projects section via the same anchor mechanism the nav links use. */}
      {!isAboutOpen && (
        <motion.button
          type="button"
          aria-label="Scroll to projects"
          onClick={() => scrollToSectionNavTarget(SECTIONS.selected.id)}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 z-10 cursor-pointer appearance-none bg-transparent border-0 p-0"
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
        </motion.button>
      )}
    </section>
  );
};

export default HeroSection;
