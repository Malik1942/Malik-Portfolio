import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";
import { NAV_ITEMS, SECTIONS, navItemHref } from "@/lib/sections";
import logo from "@/assets/logo.webp";
import { TextLink } from "@/components/ui/TextLink";

const EMAIL_HREF = "mailto:malikzhang19@gmail.com";
const LINKEDIN_HREF = "https://www.linkedin.com/in/malik-zhang";

/** The email + LinkedIn pair. Rendered beside the "Connect" word on desktop
 *  and bare, inside the link row, on mobile. */
function ConnectIcons() {
  return (
    <>
      <a
        href={EMAIL_HREF}
        aria-label="Email"
        className="hover:text-foreground transition-colors duration-slow"
      >
        <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </a>
      <a
        href={LINKEDIN_HREF}
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors duration-slow"
      >
        <Linkedin className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </>
  );
}

function HeaderConnect({
  interactive,
  className = "",
  testId,
}: {
  interactive: string;
  className?: string;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className={`${interactive} flex items-center gap-x-3 text-foreground-secondary ${className}`}
    >
      <TextLink href={EMAIL_HREF}>Connect</TextLink>
      <ConnectIcons />
    </div>
  );
}

interface SiteHeaderProps {
  /** True when the header is tucked away (direction-aware hide-on-scroll). */
  hidden: boolean;
  /** True when the header should not receive pointer events (e.g. About open). */
  inert: boolean;
  /** Disables the slide/fade transitions entirely. */
  shouldReduceMotion: boolean;
  /** Entrance animation target for the inner layer (opacity + y). */
  entranceVisible: boolean;
  /** Entrance animation delay, in seconds. */
  entranceDelay: number;
  /**
   * Prefix for the section anchors. Empty on the homepage (in-page anchors
   * like `#projects`); "/" on other pages so the href resolves to the homepage
   * section (`/#projects`) even though the onClick handles navigation.
   */
  hrefBase?: string;
  /** A homepage-section nav item was clicked; receives the section's DOM id. */
  onSection: (sectionId: string) => void;
  onAbout: () => void;
  /**
   * Optional logo-click handler. On the homepage this closes the About overlay
   * and returns to the hero (the logo's `to="/"` is a no-op there since we're
   * already on "/"). Omitted elsewhere, so the logo is a plain link home.
   */
  onLogoClick?: () => void;
  /**
   * Hides the divider line below the nav on mobile only. The case-study pages
   * set this so their sticky section guide can dock directly under the menu
   * row and read as one continuous bar — the divider would otherwise draw a
   * seam through the merged surface. md+ keeps the line.
   */
  hideMobileDivider?: boolean;
}

/**
 * The site's primary navigation — logo + NAV_ITEMS (Work / Studio) / About /
 * Resume, with a right-aligned Connect cluster (email + LinkedIn). A fixed,
 * direction-aware unit shared by the homepage hero and the case-study pages
 * so the two never drift. Mobile drops the logo and the "Connect" word and
 * folds the two icons into the single link row.
 *
 * The outer layer owns the fixed positioning, the scroll-direction slide, and
 * the background gradient. The inner layer owns the entrance / About fade so
 * each host can time it to its own load sequence.
 */
export function SiteHeader({
  hidden,
  inert,
  shouldReduceMotion,
  entranceVisible,
  entranceDelay,
  hrefBase = "",
  onSection,
  onAbout,
  onLogoClick,
  hideMobileDivider = false,
}: SiteHeaderProps) {
  const handle = (fn: () => void) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    fn();
  };

  // Only the actual links may ever be hit targets. The fixed wrapper spans the
  // full gradient block (including the ~48px transparent tail below the divider),
  // and on mobile the case-study section guide sticks inside that area — a
  // wrapper with default pointer-events silently swallows its taps and its
  // horizontal swipes. So the wrapper stays pointer-events-none permanently and
  // interactivity is granted per-link, revoked while hidden or inert (a
  // tucked-away, opacity-0 link must not intercept taps either).
  const interactive = inert || hidden ? "pointer-events-none" : "pointer-events-auto";

  // The same links render in the desktop and mobile rows.
  const links = (
    <>
      {NAV_ITEMS.map((item) =>
        item.kind === "section" ? (
          <TextLink
            key={item.label}
            href={navItemHref(item, hrefBase)}
            onClick={handle(() => onSection(SECTIONS[item.section].id))}
          >
            {item.label}
          </TextLink>
        ) : (
          <TextLink key={item.label} as={Link} to={item.path}>
            {item.label}
          </TextLink>
        ),
      )}
      <TextLink href={`${hrefBase}#about`} onClick={handle(onAbout)}>
        About
      </TextLink>
      <TextLink href="/resume">Resume</TextLink>
    </>
  );

  return (
    <div
      className="fixed top-0 left-0 right-0 z-header pointer-events-none"
      style={{
        // Subtle fade-slide instead of a full-height slide: while hidden the
        // header is transparent anyway, so a short 20px drift reads softer.
        // Asymmetric timing — quick quiet exit, slower gentle entrance.
        transform: `translateY(${hidden ? "-20px" : "0"})`,
        opacity: hidden ? 0 : 1,
        transition: shouldReduceMotion
          ? "none"
          : hidden
            ? "transform 240ms var(--ease-standard), opacity var(--duration-fast) var(--ease-exit)"
            : "transform var(--duration-page) var(--ease-move), opacity 350ms var(--ease-settle)",
      }}
    >
      <motion.div
        data-hero-header
        className="relative px-8 md:px-16 lg:px-24 pt-7 pb-12 pointer-events-none"
        style={{
          // Subtle vertical shader for legibility — solid at the top, fading to
          // fully transparent below the nav. The divider renders on top of it.
          background:
            "linear-gradient(to bottom, hsl(var(--component-site-header-scrim-color)) 0%, hsl(var(--component-site-header-scrim-color)) 42%, transparent 100%)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: entranceVisible ? 1 : 0,
          y: entranceVisible ? 0 : -20,
        }}
        transition={{ duration: 0.6, delay: entranceDelay }}
      >
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">

          {/* Left — personal logo (top-left); links home via the router */}
          <div className="animate-fade-up delay-3">
            <Link to="/" aria-label="Malik Zhang, home" onClick={onLogoClick} className={`${interactive} inline-block w-fit`}>
              <img src={logo} alt="Malik Zhang" className="h-6 w-auto select-none" />
            </Link>
          </div>

          {/* Center — nav */}
          <nav className={`${interactive} flex items-center gap-x-8 gap-y-2 text-base text-foreground-secondary animate-fade-up delay-4 justify-self-center`}>
            {links}
          </nav>

          {/* Right — Connect; 1fr column keeps the center nav optically centered */}
          <HeaderConnect
            testId="header-connect-desktop"
            interactive={interactive}
            className="justify-self-end text-base animate-fade-up delay-4"
          />
        </div>

        {/* Mobile — single-row nav, no logo, with the two Connect icons riding
            in the same row (the word "Connect" is desktop-only; the icons say
            it on their own). A fixed gap (not justify-between) keeps the
            spacing identical at every screen width. Six items instead of four
            is what drops that gap from 20px to 12px: 12 is the widest gap that
            still keeps the centered group inside the page margins, and so no
            wider than the divider beneath it, at 320px. */}
        <nav className={`${interactive} flex flex-nowrap items-center justify-center gap-x-3 whitespace-nowrap text-sm text-foreground-secondary animate-fade-up delay-4 md:hidden`}>
          {links}
          <ConnectIcons />
        </nav>

        <div className={`${hideMobileDivider ? "hidden md:block" : ""} h-px bg-border/40 mt-5 animate-line-reveal delay-3`} />
      </motion.div>
    </div>
  );
}
