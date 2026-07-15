import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DESIGN_SYSTEM_GROUPS,
  getAdjacentSections,
  resolveSectionHash,
  type DesignSystemSection,
} from "./sectionModel";
import { renderBaselineSection } from "./sections";

interface DesignSystemShellProps {
  renderSection?: (section: DesignSystemSection) => ReactNode;
}

function groupIdForSection(sectionId: string) {
  return DESIGN_SYSTEM_GROUPS.find((group) =>
    group.sections.some((section) => section.id === sectionId),
  )?.id;
}

function AdjacentSectionLinks({
  section,
  position,
}: {
  section: DesignSystemSection;
  position: "Top" | "Bottom";
}) {
  const { previous, next } = getAdjacentSections(section.id);

  if (!previous && !next) return null;

  return (
    <nav
      aria-label={`${position} section navigation`}
      className="grid grid-cols-2 gap-4 border-y border-border/40 py-5"
    >
      <div>
        {previous ? (
          <a
            href={`#${previous.id}`}
            aria-label={`Previous: ${previous.label}`}
            className="group inline-flex min-h-[44px] flex-col justify-center text-left text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/44">
              Previous
            </span>
            <span className="mt-1 text-sm text-foreground/72 transition-colors group-hover:text-foreground">
              {previous.label}
            </span>
          </a>
        ) : null}
      </div>
      <div className="text-right">
        {next ? (
          <a
            href={`#${next.id}`}
            aria-label={`Next: ${next.label}`}
            className="group inline-flex min-h-[44px] flex-col justify-center text-right text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/44">
              Next
            </span>
            <span className="mt-1 text-sm text-foreground/72 transition-colors group-hover:text-foreground">
              {next.label}
            </span>
          </a>
        ) : null}
      </div>
    </nav>
  );
}

export function DesignSystemShell({
  renderSection = renderBaselineSection,
}: DesignSystemShellProps) {
  const [activeSection, setActiveSection] = useState(() =>
    resolveSectionHash(window.location.hash),
  );
  const [railOpen, setRailOpen] = useState(false);
  const [openGroupIds, setOpenGroupIds] = useState(
    () => {
      const activeGroupId = groupIdForSection(resolveSectionHash(window.location.hash).id);
      return new Set(activeGroupId ? [activeGroupId] : []);
    },
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const handleHashChange = () => {
      const nextSection = resolveSectionHash(window.location.hash);
      const activeGroupId = groupIdForSection(nextSection.id);

      setActiveSection(nextSection);
      setRailOpen(false);
      if (activeGroupId) {
        setOpenGroupIds((current) => {
          if (current.has(activeGroupId)) return current;
          const next = new Set(current);
          next.add(activeGroupId);
          return next;
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    headingRef.current?.focus({ preventScroll: true });
  }, [activeSection.id]);

  const toggleGroup = (groupId: string) => {
    setOpenGroupIds((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20 xl:gap-24">
      <div className="w-full flex-shrink-0 lg:sticky lg:top-28 lg:w-[200px] xl:w-[220px]">
        <button
          type="button"
          aria-expanded={railOpen}
          aria-controls="design-system-section-navigation"
          onClick={() => setRailOpen((open) => !open)}
          className="flex min-h-[44px] w-full items-center justify-between border-y border-border/40 py-3 text-left text-[11px] uppercase tracking-[0.2em] text-foreground/72 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 lg:hidden"
        >
          Browse sections
          <span aria-hidden="true">{railOpen ? "−" : "+"}</span>
        </button>

        <nav
          id="design-system-section-navigation"
          aria-label="Design system sections"
          className={`${railOpen ? "block" : "hidden"} border-b border-border/40 py-5 lg:block lg:border-b-0 lg:py-0`}
        >
          <p className="mb-6 hidden text-[10px] uppercase tracking-[0.25em] text-foreground/44 text-body lg:block">
            Reference
          </p>
          <div className="space-y-5">
            {DESIGN_SYSTEM_GROUPS.map((group) => {
              const isExpanded = openGroupIds.has(group.id);
              const listId = `design-system-group-${group.id}`;

              return (
                <section key={group.id} aria-labelledby={`${listId}-label`}>
                  <button
                    id={`${listId}-label`}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={listId}
                    onClick={() => toggleGroup(group.id)}
                    className="flex min-h-[44px] w-full items-center justify-between text-left text-[10px] uppercase tracking-[0.22em] text-foreground/44 text-body transition-colors hover:text-foreground/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 lg:min-h-0 lg:py-1"
                  >
                    {group.label}
                    <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                  </button>
                  <ul id={listId} hidden={!isExpanded} className="mt-1 space-y-0.5">
                    {group.sections.map((section) => {
                      const isActive = activeSection.id === section.id;
                      return (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            aria-current={isActive ? "location" : undefined}
                            className={`block min-h-[44px] border-l py-3 pl-3 text-[12px] leading-[1.35] text-body transition-[color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 lg:min-h-0 lg:py-2.5 lg:text-[11px] lg:uppercase lg:tracking-[0.12em] ${
                              isActive
                                ? "border-foreground/75 text-foreground/92"
                                : "border-transparent text-foreground/55 hover:border-foreground/30 hover:text-foreground/78"
                            }`}
                          >
                            {section.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </nav>
      </div>

      <main className="min-w-0 w-full max-w-[900px] flex-1">
        <AdjacentSectionLinks section={activeSection} position="Top" />
        <article className="py-12 md:py-16">
          <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-foreground/44 text-body">
            Design system
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-[2.8rem] font-light leading-[1.06] tracking-[-0.03em] text-foreground text-display focus:outline-none md:text-[4.5rem]"
          >
            {activeSection.label}
          </h1>
          <div className="mt-8 md:mt-10">{renderSection(activeSection)}</div>
        </article>
        <AdjacentSectionLinks section={activeSection} position="Bottom" />
      </main>
    </div>
  );
}
