import { Link } from "react-router-dom";
import { NAV_ITEMS, SECTIONS, navItemHref } from "@/lib/sections";
import { scrollToPageTop } from "@/lib/scrollToTarget";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { PAGE_COLUMN, PAGE_GUTTERS } from "@/design-system/system/layout";

interface FooterProps {
  /** A homepage section link was clicked; receives the section's DOM id. */
  onSectionClick?: (sectionId: string) => void;
  onAboutClick?: () => void;
  /** Prefix for section anchors: "" on the homepage, "/" elsewhere. */
  hrefBase?: string;
  /** false = the page column (page gutters, 1400px cap): the homepage and Studio
   *  footers share it with the header and the Work sections. Default true. */
  constrained?: boolean;
  /** true = matches project detail page grid (1400px, tighter padding). Default false. */
  wide?: boolean;
}

const Footer = ({
  onSectionClick,
  onAboutClick,
  hrefBase = "",
  constrained = true,
  wide = false,
}: FooterProps) => {
  // wide: max-w + px- on the same element — mirrors PAGE_OUTER pattern so edges align exactly
  const outerClass = wide
    ? "px-6 md:px-10 lg:px-16 max-w-page mx-auto pt-10 md:pt-16 pb-12"
    : `${PAGE_GUTTERS} pt-10 md:pt-16 pb-12`;
  const innerClass = wide ? "" : constrained ? "max-w-content mx-auto" : PAGE_COLUMN;
  return (
    <footer className={outerClass}>
      <div className={innerClass}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24">
          {/* Left — Explore: Work, Studio, then About, Resume, Design System.
              More Work is a homepage section, not a chrome destination. */}
          <div>
            <Eyebrow as="span" className="block mb-6">
              Explore
            </Eyebrow>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.kind === "section" ? (
                    <TextLink
                      href={navItemHref(item, hrefBase)}
                      tone="secondary"
                      size="sm"
                      onClick={(event) => {
                        if (!onSectionClick) return;
                        event.preventDefault();
                        onSectionClick(SECTIONS[item.section].id);
                      }}
                    >
                      {item.label}
                    </TextLink>
                  ) : (
                    <TextLink as={Link} to={item.path} tone="secondary" size="sm">
                      {item.label}
                    </TextLink>
                  )}
                </li>
              ))}
              <li>
                <TextLink
                  as="button"
                  tone="secondary"
                  size="sm"
                  className="text-left"
                  onClick={() => {
                    if (onAboutClick) {
                      scrollToPageTop();
                      onAboutClick();
                    }
                  }}
                >
                  About
                </TextLink>
              </li>
              <li>
                <TextLink href="/resume" tone="secondary" size="sm">Resume</TextLink>
              </li>
              <li>
                <TextLink href="/design-system" tone="secondary" size="sm">Design System</TextLink>
              </li>
            </ul>
          </div>

          {/* Right — Social */}
          <div>
            <Eyebrow as="span" className="block mb-6">
              Social
            </Eyebrow>
            <ul className="space-y-4">
              <li>
                <TextLink href="mailto:malikzhang19@gmail.com" tone="secondary" size="sm">Email</TextLink>
              </li>
              <li>
                <TextLink
                  href="https://www.linkedin.com/in/malik-zhang"
                  target="_blank"
                  rel="noopener noreferrer"
                  tone="secondary"
                  size="sm"
                  >
                    LinkedIn
                  </TextLink>
              </li>
              <li>
                <TextLink
                  href="https://github.com/Malik1942"
                  target="_blank"
                  rel="noopener noreferrer"
                  tone="secondary"
                  size="sm"
                  >
                    GitHub
                  </TextLink>
              </li>
              <li>
                <TextLink
                  href="https://x.com/MalikZ1942"
                  target="_blank"
                  rel="noopener noreferrer"
                  tone="secondary"
                  size="sm"
                  >
                    X
                  </TextLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center border-t border-border pt-8">
          <span className="text-caption text-foreground-tertiary">
            &copy; 2026 Malik Zhang
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
