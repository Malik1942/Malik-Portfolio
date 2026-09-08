import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Printer } from "lucide-react";
import { BackLink } from "@/components/ui/BackLink";
import { ResumeDocument } from "@/components/ResumeDocument";
import { RESUME_DESCRIPTION, RESUME_NAME, RESUME_PDF_PATH, RESUME_UPDATED } from "@/data/resume";

export const RESUME_PAGE_TITLE = `${RESUME_NAME} – Resume`;

const ACTION_CLASS =
  "flex items-center gap-2 px-4 py-2 text-sm font-mono text-foreground-secondary hover:text-foreground border border-hairline hover:border-border rounded-sm transition-colors duration-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

/**
 * The resume page: a utility top bar, then the resume as a document.
 *
 * The document renders from src/data/resume.ts; the Download control serves
 * the PDF that scripts/generate-resume-pdf.mjs prints from this same page
 * (`npm run generate:resume`), and Print hands the same document to the
 * browser's print dialog through the stylesheet's print rules. Until Sep 2026
 * this page framed a Figma export in an iframe, which read fine to a person
 * and not at all to a parser.
 */
const Resume = () => {
  const navigate = useNavigate();

  // The site has no Helmet; index.html ships static meta. Set the title and
  // description here so the tab, a search result, and a pasted link all say
  // what this page is. Restore the defaults on unmount.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = RESUME_PAGE_TITLE;
    const description = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDescription = description?.getAttribute("content") ?? null;
    description?.setAttribute("content", RESUME_DESCRIPTION);
    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) description?.setAttribute("content", prevDescription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="resume-page-chrome flex items-center justify-between gap-4 px-6 md:px-10 py-4 border-b border-hairline bg-background z-10">
        <BackLink onClick={() => navigate("/")} aria-label="Back to home" family="mono">
          Back
        </BackLink>

        <div className="flex items-center gap-3 md:gap-4">
          <span className="hidden md:inline text-caption font-mono text-foreground-tertiary">
            Updated {RESUME_UPDATED}
          </span>
          <button type="button" onClick={() => window.print()} className={`hidden md:flex ${ACTION_CLASS}`}>
            <Printer className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            Print
          </button>
          <a href={RESUME_PDF_PATH} download="malik-resume-2026.pdf" className={ACTION_CLASS}>
            <Download className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            Download PDF
          </a>
        </div>
      </div>

      <main className="flex-1 sm:px-6 print:px-0">
        <ResumeDocument />
      </main>
    </div>
  );
};

export default Resume;
