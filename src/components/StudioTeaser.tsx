import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonRecipe } from "@/components/ui/Button";
import { getProject } from "@/data/projects";
import { DURATION, EASE } from "@/design-system/system/motion";
import { PAGE_COLUMN, PAGE_GUTTERS } from "@/design-system/system/layout";
import { noOrphan } from "@/lib/noOrphan";
import { SECTIONS } from "@/lib/sections";
import rangerHero from "@/assets/ranger-hero.webp";

// ─── Studio teaser ────────────────────────────────────────────────────────────
// The last thing on Work before the footer: a hand-off to the Studio page.
// Work is the homepage and Studio is a page of its own, so without this a
// visitor who scrolled the whole homepage would reach the footer never having
// seen that half the site exists.
//
// One wide banner, not a section of cards: the RANGER hero at 21:9 as the
// ground, a fade to the page background rising from the bottom, and the
// section label, a two-beat headline, one short sentence, and the button set
// on top of it. The whole banner is the link. RANGER is the picture because it
// is already a dark, lit scene, so the fade dissolves into the water instead of
// sitting on a photograph, and because a drone over a ghost net is unlike
// anything else on the homepage: the block reads as a doorway to somewhere
// else rather than as one more project row.

export const STUDIO_TEASER_ID = "studio-preview";
export const STUDIO_TEASER_PROJECT_ID = "ranger";
// Says what Studio is, without ranking it against Work: the case studies are
// the flagship, and a line like "Work is the process, Studio is the thing" read
// as if the process were the lesser half.
const STUDIO_TEASER_HEADLINE = "Apps I shipped. Machines I built.";
const STUDIO_TEASER_BLURB = "Designed, built with AI, and shipped for real.";
export const STUDIO_TEASER_CTA = "Go to Studio";

// The frame is a cinema ratio at every width, never a card: 21:9 from lg, 2:1
// on tablets and small laptops, and 4:3 (a shade off IMAX's 1.43) on phones,
// where it also runs edge to edge (the page gutters fall away and the corners
// square off) so the picture is as big as the screen allows. The subline is
// dropped there too: the headline already says it, and every line of type is
// a line of picture lost. Type and padding step with the
// frame, not the breakpoint: display type only from 1536px, where the 21:9
// frame is tall enough to carry it; a 56px headline that fits a 1920px banner
// is most of a 1280px one.
// The crop sits high and slides right on the small frames so the drone stays in
// the picture above the type. All of it is CSS, so the box reserves its height
// before the image arrives, as the project cards do.
const BANNER_FRAME =
  "aspect-[4/3] -mx-6 rounded-none md:mx-0 md:aspect-[2/1] md:rounded-2xl lg:aspect-[21/9]";
const BANNER_CROP = "object-[62%_40%] md:object-[56%_40%] lg:object-[50%_40%]";
const BANNER_ALT = "RANGER underwater drone lighting a drifting ghost net on the sea floor";

// The overlays, on the page canvas color.
const CANVAS = "var(--color-background-canvas)";
const WASH = `hsl(${CANVAS} / 0.1)`;
const FADE_UP = `linear-gradient(to top, hsl(${CANVAS}) 0%, hsl(${CANVAS} / 0.7) 45%, hsl(${CANVAS} / 0) 100%)`;
const FADE_RIGHT = `linear-gradient(to right, hsl(${CANVAS} / 0.5) 0%, hsl(${CANVAS} / 0) 100%)`;

export function StudioTeaser() {
  const project = getProject(STUDIO_TEASER_PROJECT_ID);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <section
      id={STUDIO_TEASER_ID}
      aria-labelledby={`${STUDIO_TEASER_ID}-title`}
      className={`${PAGE_GUTTERS} pt-section pb-8`}
    >
      <div className={PAGE_COLUMN}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.96, y: inView ? 0 : 40 }}
          transition={{
            duration: DURATION.reveal,
            ease: EASE.enter,
            opacity: { duration: DURATION.slow, ease: EASE.settle },
          }}
        >
          <Link
            to={SECTIONS.studio.path}
            className={`group relative block overflow-hidden bg-project-card-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background ${BANNER_FRAME}`}
          >
            {/* Ground: the photograph, lifting on hover like a card cover. */}
            <img
              src={rangerHero}
              alt={BANNER_ALT}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-reveal ease-move group-hover:scale-[1.03] ${BANNER_CROP}`}
            />

            {/* Fade: the page background rising from the bottom so the type sits
                on black, a gentler one from the left under the type, and a light
                wash so the photo reads as a ground rather than a cover. All three
                are the canvas token at an alpha, written inline because the
                alphas are tuned to this photograph, not steps on a scale. */}
            <div aria-hidden="true" className="absolute inset-0" style={{ background: WASH }} />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/4" style={{ background: FADE_UP }} />
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-3/5" style={{ background: FADE_RIGHT }} />

            {/* Type, bottom-left. */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 2xl:p-16">
              <h2
                id={`${STUDIO_TEASER_ID}-title`}
                className="text-label lg:text-sm font-medium uppercase tracking-eyebrow text-foreground"
              >
                {SECTIONS.studio.label}
              </h2>
              <p className="mt-3 lg:mt-4 2xl:mt-6 max-w-reading font-display text-title lg:text-heading 2xl:text-display font-light leading-tight text-foreground text-balance">
                {noOrphan(STUDIO_TEASER_HEADLINE)}
              </p>
              <p className="mt-2 lg:mt-3 2xl:mt-4 hidden md:block max-w-reading text-sm lg:text-base 2xl:text-xl leading-relaxed text-foreground-lead">
                {noOrphan(STUDIO_TEASER_BLURB)}
              </p>
              {/* The pill is drawn with the button recipe but is a span: the whole
                  banner is already the link, and a link inside a link is not allowed. */}
              <div className="mt-5 lg:mt-6 2xl:mt-8">
                <span className={buttonRecipe({ tone: "primary" })}>
                  {STUDIO_TEASER_CTA}
                  <span
                    aria-hidden="true"
                    className="inline-flex shrink-0 transition-transform duration-fast ease-settle group-hover:translate-x-0.5 [&>svg]:h-5 [&>svg]:w-5"
                  >
                    <ArrowRight />
                  </span>
                </span>
              </div>
            </div>

            {/* Credit for the picture, out of the way. */}
            {project ? (
              <span className="absolute hidden text-caption text-foreground-tertiary md:bottom-10 md:right-10 md:block 2xl:bottom-16 2xl:right-16">
                {project.title}, {project.year}
              </span>
            ) : null}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
