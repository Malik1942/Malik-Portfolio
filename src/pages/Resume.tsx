import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackLink } from "@/components/ui/BackLink";
import { ResumeDocument } from "@/components/ResumeDocument";
import { RESUME_NAME, RESUME_PDF_PATH } from "@/data/resume";

export const RESUME_PAGE_TITLE = `${RESUME_NAME} – Resume`;

/**
 * The resume page: a utility top bar, then the resume as a document.
 *
 * The document renders from src/data/resume.ts; the Download control serves
 * the PDF that scripts/generate-resume-pdf.mjs prints from this same page
 * (`npm run generate:resume`). Until Sep 2026 this page framed a Figma export
 * in an iframe, which read fine to a person and not at all to a parser.
 */
const Resume = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = RESUME_PAGE_TITLE;
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="resume-page-chrome flex items-center justify-between px-6 md:px-10 py-4 border-b border-hairline bg-background z-10">
        <BackLink onClick={() => navigate("/")} aria-label="Back to home" family="mono">
          Back
        </BackLink>

        <a
          href={RESUME_PDF_PATH}
          download="malik-resume-2026.pdf"
          className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-foreground-secondary hover:text-foreground border border-hairline hover:border-border rounded-sm transition-colors duration-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </a>
      </div>

      <main className="flex-1 sm:px-6 print:px-0">
        <ResumeDocument />
      </main>
    </div>
  );
};

export default Resume;
